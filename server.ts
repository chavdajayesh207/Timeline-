import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use JSON middleware with generous limits for file content transfers
  app.use(express.json({ limit: "50mb" }));

  // Initialize Gemini SDK securely on the server
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // Helper to call ai.models.generateContent with retry on transient/high demand/rate limit errors
  async function generateContentWithRetry(params: any, maxRetries = 4, delayMs = 1500) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await ai.models.generateContent(params);
      } catch (e: any) {
        const errMessage = (e.message || "").toLowerCase();
        const isRateLimitOrUnavailable = 
          e.status === 503 || 
          e.status === 429 || 
          errMessage.includes("503") || 
          errMessage.includes("unavailable") || 
          errMessage.includes("high demand") || 
          errMessage.includes("resource exhausted") || 
          errMessage.includes("rate limit") || 
          errMessage.includes("429");
          
        if (isRateLimitOrUnavailable && i < maxRetries - 1) {
          console.warn(`[Gemini API Warning] Model high demand or rate limit detected (attempt ${i + 1}/${maxRetries}). Retrying in ${delayMs}ms...`);
          await new Promise(resolve => setTimeout(resolve, delayMs));
          delayMs *= 2.5; // Exponential backoff
        } else {
          throw e;
        }
      }
    }
    throw new Error("Failed to reach Gemini API after retries");
  }

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // API 1: Extract high-fidelity book metadata using Gemini 3.5-flash
  app.post("/api/extract-metadata", async (req, res) => {
    try {
      const { text, filename } = req.body;
      if (!text) {
        return res.status(400).json({ error: "No book content provided for analysis." });
      }

      const prompt = `Analyze this book content (first portion) and its filename to extract accurate metadata.
Filename: "${filename || ''}"
Text content extract:
"""
${text.slice(0, 15000)}
"""

Provide a JSON object response with these precise keys (do NOT wrap in markdown, output raw JSON string):
- "title": (string) official title of the book, corrected for clean capitalization.
- "author": (string) full author or main sage name (if completely unknown, write "Unknown").
- "language": (string, default "English") detected language (e.g., "English", "Sanskrit", "Hindi", "Gujarati", "Latin", "Greek").
- "category": (string) MUST fit best into one of these specific collections: "philosophy", "psychology", "business", "finance", "technology", "self_growth", "history", "science", "health", "creativity", "career", "literature", "biography", "spirituality", "exam_prep".
- "description": (string) a premium, engaging, and highly eloquent synopsis of the book tailored for a luxury reader app. Focus on core themes and relevance (around 2-3 sentences max).
- "readingTime": (string) estimated reading time based on dense prose (e.g. "4 hrs 15 mins" or "10 hrs 30 mins").
- "nativeTitle": (string, optional) if the book belongs to Indian scriptures or classical Sanskrit texts, provide its traditional Sanskrit name in Devanagari script (e.g. "श्रीमद्भगवद्गीता").`;

      const response = await generateContentWithRetry({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              author: { type: Type.STRING },
              language: { type: Type.STRING },
              category: { type: Type.STRING },
              description: { type: Type.STRING },
              readingTime: { type: Type.STRING },
              nativeTitle: { type: Type.STRING },
            },
            required: ["title", "author", "language", "category", "description", "readingTime"],
          }
        }
      });

      const extractedText = response.text;
      if (!extractedText) {
        throw new Error("No response text from Gemini model");
      }

      const data = JSON.parse(extractedText);
      res.json(data);
    } catch (e: any) {
      console.error("Gemini automatic metadata extraction error:", e);
      res.status(500).json({ error: e.message || "Failed to analyze book content with AI." });
    }
  });

  // API 2: Generate stunning, premium visual covers using gemini-2.5-flash-image
  app.post("/api/generate-cover", async (req, res) => {
    try {
      const { title, author, category, description } = req.body;
      if (!title) {
        return res.status(400).json({ error: "Missing title for cover rendering." });
      }

      const categoryStylingMap: Record<string, string> = {
        philosophy: "A deep philosophical, minimalist book cover landscape, ancient marble Greek bust silhouette, starry dark academy background, muted colors",
        psychology: "Artistic psychological concept background, abstract layered minds, deep indigo and violet colors, fine network line art",
        business: "High-quality professional minimalist corporate cover, dark emerald background with linear brass grid, modern geometric construct",
        finance: "Stately old-world vintage ledger grid texture, deep royal pine green, gold foil details, historical typography layout",
        technology: "Sleek matte back cover pattern, deep midnight slate, subtle neon cyan circuit tracings, clean sci-fi digital aesthetic",
        self_growth: "A calming minimalist zen garden, warm sunrise pastel glow over misty horizons, simple single circle line art",
        history: "A vintage weathered map background, antique columns outline, dark charcoal sepia palette, historical parchment",
        science: "Atomic orbital trails, deep space sparkling stars backdrop, beautiful soft celestial blue nebulas",
        health: "Serene minimalist organic illustration of eucalyptus leaves, clean sage green backdrop, gentle natural lighting",
        creativity: "An elegant painterly creative design cover, oil paint canvas brushstrokes of deep red, gold, and teal colors",
        career: "Modern geometric flat design vector illustration, professional sky blue corporate gradients, ascending abstract lines",
        literature: "An antique classic leather bound book skin, subtle ornate gilded frame, deep ruby red textured leather",
        biography: "Timeless charcoal shades, side profile shadow silhouette, vintage personal diary theme",
        spirituality: "An ambient glowing orange-gold mandala design, sacred flame, soft temple silhouette, highly spiritual and peaceful",
        exam_prep: "Classical premium academic shield with stars emblem, deep royal blue velvet background"
      };

      const baseTheme = categoryStylingMap[category] || "A pristine premium minimalist design, luxury layout.";
      const prompt = `A premium, high-quality, professional book cover graphic design for a book titled "${title}" by "${author}". Core mood: ${baseTheme}. Visual style: clean, artistic, atmospheric, with NO text overlay, no letters, no title text on the image (pure illustration background).`;

      const response = await generateContentWithRetry({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: "3:4"
          }
        }
      });

      let base64Image = "";
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          base64Image = part.inlineData.data;
          break;
        }
      }

      if (base64Image) {
        res.json({ imageUrl: `data:image/png;base64,${base64Image}` });
      } else {
        res.status(500).json({ error: "No graphic data returned from Image Generator." });
      }
    } catch (e: any) {
      console.error("Gemini visual cover generator failed:", e);
      res.status(500).json({ error: e.message || "Failed to generate visual cover with AI." });
    }
  });

  // API 3: Fetch Gutenberg / Archive / External URL to bypass CORS and extract first blocks of text
  app.post("/api/fetch-url", async (req, res) => {
    try {
      const { url } = req.body;
      if (!url) {
        return res.status(400).json({ error: "Missing remote URL." });
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch from URL. Status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type") || "";
      
      // If it's a PDF, we don't want to load all MBs as plain text. Return notice to let the client download and extract PDF pages via pdf.js
      if (contentType.includes("pdf") || url.toLowerCase().endsWith(".pdf")) {
        return res.json({ isPdf: true });
      }

      // Read Gutenberg or plain HTML/TXT
      const buffer = await response.arrayBuffer();
      const textDecoder = new TextDecoder("utf-8");
      let text = textDecoder.decode(buffer);
      
      // Basic HTML cleanup if it is Gutenberg HTML or web pages
      if (text.includes("<body") || text.includes("<html") || contentType.includes("html")) {
        text = text.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
                    .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, '')
                    .replace(/<[^>]+>/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim();
      }

      res.json({ text: text.slice(0, 50000) });
    } catch (e: any) {
      console.error("URL fetcher proxy failed:", e);
      res.status(500).json({ error: e.message || "Failed to retrieve content from specified URL." });
    }
  });

  // API Workflows: Automated luxury summary generation for book details
  app.post("/api/book-ai-summary", async (req, res) => {
    try {
      const { title, author, category, description } = req.body;
      if (!title) {
        return res.status(400).json({ error: "Missing book title for summary compiling." });
      }

      const prompt = `You are an elite, widely-read literary scholar and theological philosopher. Compile a breathtaking, structured summary of the book:
Title: "${title}"
Author: "${author || 'Unknown Sage'}"
Category: "${category || 'General Wisdom'}"
In-app description: "${description || ''}"

Please write a highly aesthetic, academic yet deeply inspiring analysis structured with the following parts (around 300-400 words total, formatted nicely in clean Markdown with spaced paragraphs):
1. **🌸 METAPHYSICAL OVERVIEW**: A cinematic, deep look into the soul of the book. What core question does it seek to answer?
2. **🔑 CORE PRINCIPLES & IDEAS**: 3-4 bullet points highlighting the immortal tenets or philosophical axioms.
3. **🏛️ HISTORICAL & SAGE CONTEXT**: Brief paragraph placing the book in the stream of global history and human lineage.
4. **🧘 INTEGRATIVE WORKFLOW**: How a modern practitioner can apply this exact teaching to neutralize digital anxiety and focus.`;

      const response = await generateContentWithRetry({
        model: "gemini-3.5-flash",
        contents: prompt
      });

      res.json({ summaryText: response.text });
    } catch (e: any) {
      console.error("Gemini Details Summary compilation failed:", e);
      res.status(500).json({ error: e.message || "Unable to produce book summary." });
    }
  });

  // API Workflows: Dynamic Contextual Page explainer analyzes actual PDF text extract in real-time
  app.post("/api/ai-chat-explain", async (req, res) => {
    try {
      const { pageText, bookTitle, queryType } = req.body;
      const customQuestion = req.body.customQuestion || req.body.userQuery;

      if (!bookTitle) {
        return res.status(400).json({ error: "Missing book context title." });
      }

      let systemPrompt = `You are the Wisdom Engine inside "Wisdom AI", a personal knowledge app. The user is currently viewing "${bookTitle}". You have deeply read and analysed this entire book.

Respond in a warm, insightful, concise style — like a brilliant friend who has read every book the user owns. Keep responses under 120 words unless the user asks for a detailed plan. Use plain language. No bullet spam — integrate ideas into flowing sentences. When relevant, connect ideas to Indian philosophy (especially Bhagavad Gita) as the user values this connection.

Rules:
- Stay grounded in the actual content of the book
- Never fabricate quotes — paraphrase accurately
- For action plans, be specific and immediately actionable
- For cross-book connections, be intellectually bold
- End with one relevant follow-up question to keep the conversation alive

The student is referencing the currently displayed page in the reader. Here is the exact extracted text of the page:
"""
${pageText || '(No text could be extracted from this scanned page; give a high-level explanation of the book instead)'}
"""`;

      let userPrompt = "";
      switch (queryType) {
        case "explain":
          userPrompt = "Please analyze the selected page and provide a deep, highly-clarifying explanation of the core sentences and concepts present.";
          break;
        case "summarize":
          userPrompt = "Provide a dense, structured chapter summary of what is happening on this page. Highlight 3 key milestones or logic points.";
          break;
        case "sanskrit":
          userPrompt = "Explain any traditional terms (Sanskrit, Greek, or technical terms) found in this page text. Translate to Hindi Devanagari and explain the literal and spiritual significance.";
          break;
        case "philosophy":
          userPrompt = "Compare the philosophical ideas found on this page with other global systems (e.g., stoicism, vedanta, buddhism, modern psychoanalysis). Provide elegant cross-connections.";
          break;
        case "history":
          userPrompt = "Describe the historical, lineage, or manuscript context relevant to this portion of the text. Who authored it and under what earthly circumstances?";
          break;
        case "lessons":
          userPrompt = "Extract 3 highly actionable, timeless key wisdom lessons that the student can execute in their life today based on this page.";
          break;
        case "chat":
          userPrompt = customQuestion || "Discuss the main concepts on this page.";
          break;
        default:
          userPrompt = "Explain the content of this page.";
      }

      const prompt = `${systemPrompt}\n\nStudent's Request: ${userPrompt}\n\nProvide an elegant, comforting, and authoritative response formatted with clean, spacious Markdown paragraphs. Avoid any clinical metadata or diagnostic lingo. Speak with the warmth of a great teacher.`;

      const response = await generateContentWithRetry({
        model: "gemini-3.5-flash",
        contents: prompt
      });

      res.json({ response: response.text, resultText: response.text });
    } catch (e: any) {
      console.error("Contextual page analysis failed:", e);
      res.status(500).json({ error: e.message || "Failed to invoke AI Reading companion." });
    }
  });

  // API Workflows: Personal Knowledge Management actions powered by Gemini
  app.post("/api/note-ai-action", async (req, res) => {
    try {
      const { action, noteText, bookTitle, tags } = req.body;
      if (!noteText) {
        return res.status(400).json({ error: "Missing text context to process." });
      }

      let systemPrompt = `You are the Wisdom Engine inside "Wisdom AI", a personal knowledge app. The user is currently viewing "${bookTitle || 'the context'}". You have deeply read and analysed this entire book.

Respond in a warm, insightful, concise style — like a brilliant friend who has read every book the user owns. Keep responses under 120 words unless the user asks for a detailed plan. Use plain language. No bullet spam — integrate ideas into flowing sentences. When relevant, connect ideas to Indian philosophy (especially Bhagavad Gita) as the user values this connection.

Rules:
- Stay grounded in the actual content of the book
- Never fabricate quotes — paraphrase accurately
- For action plans, be specific and immediately actionable
- For cross-book connections, be intellectually bold
- End with one relevant follow-up question to keep the conversation alive`;
      let userPrompt = "";

      switch (action) {
        case "summarize":
          userPrompt = `Please compile a breathtaking, structured summary of the following knowledge context${bookTitle ? ` relating to "${bookTitle}"` : ""}. Include a concise metaphysical overview, 3-4 immortal core tenets, and historical context. Knowledge text:\n\n"""\n${noteText}\n"""`;
          break;
        case "flashcards": // "flashcard" from vault.js might use 'summarize' previously, let's fix that
        case "flashcard":
          userPrompt = `Based on the following knowledge context${bookTitle ? ` from "${bookTitle}"` : ""}, generate 5 highly engaging, high-quality Study Flashcards for active recall. Format each flashcard rigorously as:
**Q: [Conceptual Question]**
*A: [Elegant, clear answer explaining the concept]*

Knowledge text:
"""
${noteText}
"""`;
          break;
        case "mindmap":
          userPrompt = `Create a text-based, beautifully indented conceptual Mind Map structure based on the following text${bookTitle ? ` from "${bookTitle}"` : ""}. Use nested emoji-bullet branches to map out main themes, primary branches, and sub-points. Make it visually rich and intuitive. Note text:\n\n"""\n${noteText}\n"""`;
          break;
        case "connections":
        case "actionable":
          if (action === 'connections') {
            userPrompt = `Analyze the main conceptual pillars of this knowledge context${bookTitle ? ` referencing "${bookTitle}"` : ""}. Provide 3 fascinating related ideas, surprising cross-disciplinary connections (e.g. connecting stoicism with modern cognitive therapy, or finance with behavioral psychology), and potential search queries to connect it to other domains. Emphasize shared concepts and mental models. Knowledge text:\n\n"""\n${noteText}\n"""`;
          } else {
             // Action plan
             userPrompt = `Translate the abstract wisdom or information in the following context${bookTitle ? ` from "${bookTitle}"` : ""} into a highly concrete, step-by-step 7-day actionable life plan. What should the user do first thing in the morning, during the day, and at night to live out this truth? Format strictly as a bulleted checklist starting with "- ". Knowledge text:\n\n"""\n${noteText}\n"""`;
          }
          break;
        case "actionplan":
             userPrompt = `Translate the abstract wisdom or information in the following context${bookTitle ? ` from "${bookTitle}"` : ""} into a highly concrete, step-by-step actionable life plan. What should the user do first thing in the morning, during the day, and at night to live out this truth? Format strictly as a bulleted checklist starting with "- " for max 7 items. Knowledge text:\n\n"""\n${noteText}\n"""`;
          break;
        case "chat":
             userPrompt = `The user is having a conversational query regarding the following context${bookTitle ? ` from "${bookTitle}"` : ""}.\n\nContext:\n"""\n${noteText}\n"""\n\nPlease answer their specific question naturally, maintaining your persona as the Wisdom Engine. Be direct, elegant, and provide a deep psychological or philosophical layer if appropriate.`;
             break;
        case "quiz":
             userPrompt = `Generate a challenging 5-question multiple choice quiz based on the key lessons and mental models in the following context${bookTitle ? ` from "${bookTitle}"` : ""}. Format each question clearly, followed by options A, B, C, D. At the very end, provide the answer key. Knowledge text:\n\n"""\n${noteText}\n"""`;
             break;
        case "roadmap":
             userPrompt = `Create a comprehensive 4-week learning Roadmap based on the following context${bookTitle ? ` from "${bookTitle}"` : ""}. Break it down week-by-week, focusing on Identity, Environment, Systems, and Mastery. Format with bold headers and actionable weekly milestones. Knowledge text:\n\n"""\n${noteText}\n"""`;
             break;
        default:
          userPrompt = `Analyze the following knowledge text and provide deep insights:\n\n${noteText}`;
      }

      const prompt = `${systemPrompt}\n\nStudent's Request:\n${userPrompt}\n\nProvide an elegant, inspiring, and highly-refined response in spacious, easily readable Markdown. Avoid generic fluff.`;

      // Use AI instance already configured
      const response = await generateContentWithRetry({
        model: "gemini-3.5-flash",
        contents: prompt
      });

      res.json({ resultText: response.text });
    } catch (e: any) {
      console.error("Note AI action failed:", e);
      res.status(500).json({ error: e.message || "Failed to invoke Wisdom Engine." });
    }
  });

  // API 4: Direct PDF streaming proxy to bypass block-level CORS issues
  app.get("/api/proxy-pdf", async (req, res) => {
    try {
      const targetUrl = req.query.url as string;
      if (!targetUrl) {
        return res.status(400).send("Missing target URL parameter.");
      }

      const response = await fetch(targetUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
          "Accept": "application/pdf,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          "Referer": targetUrl.includes("vedpuran.net") ? "https://vedpuran.net/" : (targetUrl.includes("wordpress") ? "https://wordpress.com/" : targetUrl)
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to proxy. Remote status: ${response.status}`);
      }

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Access-Control-Allow-Origin", "*");

      const body = response.body;
      if (body) {
        const reader = body.getReader();
        const sendNextChunk = async () => {
          const { done, value } = await reader.read();
          if (done) {
            res.end();
            return;
          }
          res.write(value);
          await sendNextChunk();
        };
        await sendNextChunk();
      } else {
        res.status(500).send("No readable stream body found on target endpoint");
      }
    } catch (e: any) {
      console.error("PDF reverse proxy failed:", e);
      res.status(500).send(e.message || "Error proxying selected PDF file.");
    }
  });

  // Vite development middleware vs production bundle static directories
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Fullstack Server running on http://localhost:${PORT}`);
  });
}

startServer();
