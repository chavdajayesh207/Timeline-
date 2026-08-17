import { JSDOM, VirtualConsole } from 'jsdom';
import fetch from 'node-fetch';

(async () => {
    try {
        const response = await fetch('http://localhost:3000');
        const html = await response.text();
        
        const virtualConsole = new VirtualConsole();
        virtualConsole.on("error", (err) => {
            console.log("JSDOM Error:", err.stack || err);
        });
        virtualConsole.on("jsdomError", (err) => {
            console.log("JSDOM JS Error:", err.message, err.stack);
        });
        virtualConsole.on("log", (msg) => {
            console.log("JSDOM Log:", msg);
        });

        const dom = new JSDOM(html, { 
            runScripts: "dangerously", 
            resources: "usable",
            url: "http://localhost:3000",
            virtualConsole 
        });
        
        setTimeout(() => {
            console.log("Finished running JSDOM. Exiting cleanly.");
            process.exit(0);
        }, 3000);
    } catch(e) {
        console.error("Test failed", e);
        process.exit(1);
    }
})();
