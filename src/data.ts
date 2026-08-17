import { Book, Philosopher, TimelineEvent } from "./types"

export const PURANAS: Book[] = [
  {
    name: "Agni Puran",
    lang: "Hindi",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2011/10/agni-puran.pdf" }]
  },
  {
    name: "Bhagwat Puran",
    lang: "Hindi",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2011/10/bhagwat-puran.pdf" }]
  },
  {
    name: "Bhavishya Puran",
    lang: "Hindi",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2011/10/bavishya-puran.pdf" }]
  },
  {
    name: "Brahma Puran",
    lang: "Hindi",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2011/10/bramha.pdf" }]
  },
  {
    name: "Brahmand Puran",
    lang: "Hindi",
    links: [
      { label: "Part I", url: "https://vedpuran.net/wp-content/uploads/2011/10/brahamand.pdf" },
      { label: "Part II", url: "https://vedpuran.net/wp-content/uploads/2011/10/brahamandp.pdf" }
    ]
  },
  {
    name: "Garuda Puran",
    lang: "Hindi",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2011/10/garuda1.pdf" }]
  },
  {
    name: "Kurma Puran",
    lang: "Hindi",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2011/10/kurma.pdf" }]
  },
  {
    name: "Ling Puran",
    lang: "Hindi",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2011/10/ling.pdf" }]
  },
  {
    name: "Markandya Puran",
    lang: "Hindi",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2011/10/markende-puran.pdf" }]
  },
  {
    name: "Matsya Puran",
    lang: "Hindi",
    links: [
      { label: "Part I", url: "https://vedpuran.net/wp-content/uploads/2011/10/matsya-puran-1.pdf" },
      { label: "Part II", url: "https://vedpuran.net/wp-content/uploads/2011/10/matsya-puran-2.pdf" }
    ]
  },
  {
    name: "Narad Puran",
    lang: "Hindi",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2011/10/nard-puran.pdf" }]
  },
  {
    name: "Padma Puran",
    lang: "Hindi",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2011/10/padam-puran.pdf" }]
  },
  {
    name: "Shiv Puran",
    lang: "Hindi",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2011/10/shiv-puran.pdf" }]
  },
  {
    name: "Skand Puran",
    lang: "Hindi",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2011/10/sakand-puran.pdf" }]
  },
  {
    name: "BrahmVaivarta Puran",
    lang: "Hindi",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2011/10/vaivtpuran.pdf" }]
  },
  {
    name: "Vaman Puran",
    lang: "Hindi",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2011/10/vamanpuran.pdf" }]
  },
  {
    name: "Varah Puran",
    lang: "Hindi",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2011/10/varaha-puran.pdf" }]
  },
  {
    name: "Vishnu Puran",
    lang: "Hindi",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2011/10/vishnu-puran.pdf" }]
  },
  {
    name: "Vayu Puran",
    lang: "Hindi",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2016/07/vayu-puran.pdf" }]
  },
  {
    name: "Vishwakarma Puran",
    lang: "Hindi",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2025/03/vishva-karma-puran-and-pujan-paddhati-by-pd-rakesh-shastri.pdf" }]
  },
  {
    name: "Narsimha Puran",
    lang: "Hindi",
    by: "Upapurana",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2011/10/narsihma-puran.pdf" }]
  },
  {
    name: "Kalki Puran",
    lang: "Hi + Sa",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2012/12/kalkipuranhindi1.pdf" }]
  },
  {
    name: "Devi Bhagwat",
    lang: "Sanskrit",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2012/12/devi-bhagavata-purana_press.pdf" }]
  },
  {
    name: "SrimadDevi Purana",
    lang: "English",
    by: "by MANISH – Uttarkashi",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/03/srimaddevipurana.pdf" }]
  },
  {
    name: "Vishnu Puran (English)",
    lang: "English",
    by: "Digitized by Google · by Aniket Gargelwar",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/03/vishnupuran-english-vedpuran.pdf" }]
  },
  {
    name: "Vishnu Puran (Good Quality)",
    lang: "Hi + Sa",
    by: "by Varun & Sangeeta Modi",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/03/vishnu_puran.pdf" }]
  },
  {
    name: "Nilmat Puran",
    lang: "Sanskrit",
    by: "Ancient History of Kashmir · by Sanjay Wattal",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/04/nilamata_purana.pdf" }]
  }
];

export const VEDAS: Book[] = [
  {
    name: "RigVed",
    lang: "Hindi",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2011/10/rigved.pdf" }]
  },
  {
    name: "RigVed – Good Quality",
    lang: "Hindi",
    by: "by Hardik Kothari",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2014/03/rigved.pdf" }]
  },
  {
    name: "RigVed Full Text HD",
    lang: "Hindi",
    by: "by Harsh Gupta, Ranchi",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/06/rigved-full-hd.pdf" }]
  },
  {
    name: "RigVed (English)",
    lang: "English",
    by: "by Ravi Gaurav Pandey",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2013/04/rigveda_english.pdf" }]
  },
  {
    name: "RigVed in Sanskrit",
    lang: "Sanskrit",
    by: "by Varun & Sangeeta Modi",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2013/12/rigveda_sanskrit_only.pdf" }]
  },
  {
    name: "Rigveda Gujarati Mandal 1",
    lang: "Gujarati",
    by: "by Gaurav Dabhi",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/03/rigveda-gujarati-mandal1.pdf" }]
  },
  {
    name: "SamVed",
    lang: "Hindi",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2011/10/samved.pdf" }]
  },
  {
    name: "SamVed – Good Quality",
    lang: "Hindi",
    by: "by Hardik Kothari",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2014/03/yugerved.pdf" }]
  },
  {
    name: "SamVed (Gujarati)",
    lang: "Gujarati",
    by: "by Gaurav Dabhi",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/03/samved-gujarati.pdf" }]
  },
  {
    name: "YajurVed",
    lang: "Hindi",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2011/10/yajurved.pdf" }]
  },
  {
    name: "YajurVed (Gujarati)",
    lang: "Gujarati",
    by: "by Gaurav Dabhi",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/03/yajurved-gujarati.pdf" }]
  },
  {
    name: "AtharvaVed",
    lang: "Hindi",
    links: [
      { label: "Part I", url: "https://vedpuran.net/wp-content/uploads/2011/10/arthved-part-1.pdf" },
      { label: "Part II", url: "https://vedpuran.net/wp-content/uploads/2011/10/atharva-2.pdf" }
    ]
  },
  {
    name: "AtharvaVed (Good Quality)",
    lang: "Hi + Sa",
    by: "by Varun & Sangeeta Modi",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2013/12/atharva-ved.pdf" }]
  },
  {
    name: "Arthved – Good Quality",
    lang: "Hindi",
    by: "by Hardik Kothari",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2014/03/arthved.pdf" }]
  },
  {
    name: "Atharva Veda (Harvard 1905)",
    lang: "English",
    by: "by Premananda Behera, Abu Dhabi",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/03/atharvaveda.pdf" }]
  },
  {
    name: "Ved Saurabh",
    lang: "Hindi",
    by: "by John Carter",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2014/02/ved-saurabh.pdf" }]
  },
  {
    name: "Research Report on Vedpuran",
    lang: "Hindi",
    by: "Inside Mysteries in Vedas · by Shrwan Jha",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2015/02/research-report-on-puran.pdf" }]
  }
];

export const EPICS: Book[] = [
  {
    name: "Mahabharat (Hindi)",
    lang: "Hindi",
    by: "271 MB · Full Text",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2012/07/mahabhart-full-with-geeta-hindi.pdf" }]
  },
  {
    name: "Mahabharat Gorakhpur Press",
    lang: "Hindi",
    by: "Vol 1–12 · 709 MB · 7250 pages · by Hardik Kothari",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/03/mahabhart-gorkhpur.pdf" }]
  },
  {
    name: "Mahabharat Complete (Nepali)",
    lang: "Nepali",
    by: "by Krishna Shiwakoti, Nepal",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2025/03/mahabharta_pdf_nepali-1.pdf" }]
  },
  {
    name: "Ramayan (Hindi-Sanskrit)",
    lang: "Hi + Sa",
    by: "182 MB · All Kand · 6191 pages",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2012/08/ramayana_all_kand_6191_pages.pdf" }]
  },
  {
    name: "Ramayan (Tamil)",
    lang: "Tamil",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2013/01/tamil-ramayanam-326-page.pdf" }]
  },
  {
    name: "Ramayana (Nepali)",
    lang: "Nepali",
    by: "175 MB · by Krishna Shiwakoti, Nepal",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2025/04/ramayan_nepali.pdf" }]
  },
  {
    name: "Shri Ram Charit Manas (Complete)",
    lang: "Hindi",
    by: "Tulsidas",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2026/05/shree-ram-charit-manas.pdf" }]
  },
  {
    name: "Ramcharitmanas (English)",
    lang: "English",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2013/04/1318_sri-ramchritmanas_roman.pdf" }]
  },
  {
    name: "Anand Ramayan",
    lang: "Hindi",
    by: "293 MB · by Yogendra Mishra",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2013/04/anandramayan.pdf" }]
  },
  {
    name: "Adbhut Ramayan",
    lang: "Hindi",
    by: "by Jayant Majmundar, Indore",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/05/adbhut-ramayan-hindi.pdf" }]
  },
  {
    name: "Sunderkand Path",
    lang: "Hindi",
    by: "by Amit Mishra, Pune",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/03/sunderkand_path.pdf" }]
  }
];

export const GITA_UPANISHADS: Book[] = [
  {
    name: "Bhagavad Geeta",
    lang: "Hi + Sa",
    by: "Gorakhpur Press",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2012/03/unencrypted-geeta.pdf" }]
  },
  {
    name: "Bhagavad Geeta (Punjabi)",
    lang: "Punjabi + Sa",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2012/03/full-punjabi-geeta.pdf" }]
  },
  {
    name: "Bhagavad Geeta (Exact Translation)",
    lang: "English",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2013/04/455_gita_roman.pdf" }]
  },
  {
    name: "Bhagvad Geeta (Explained)",
    lang: "English",
    by: "by Ravi Gaurav Pandey",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2013/04/srimad-bhagvad-gita.pdf" }]
  },
  {
    name: "Bagwat Gita (Tamil)",
    lang: "Tamil",
    by: "by Jaison Tirunelveli, Tamilnadu",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/03/bhagavad_gita_bharathiar.pdf" }]
  },
  {
    name: "Geeta – Sanskrit Only",
    lang: "Sanskrit",
    by: "by Vishal Goswami",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2014/02/gita.pdf" }]
  },
  {
    name: "Geeta Marathi (Gnyaneshwari)",
    lang: "Marathi",
    by: "by Mahesh Vaidya, Pune",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/04/geeta-marathi-gnyaneshwari.pdf" }]
  },
  {
    name: "Moksha Gita",
    lang: "English",
    by: "by Hemant Kumar Deshmukh",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/03/moksha_gita.pdf" }]
  },
  {
    name: "The Uddhava Gita",
    lang: "English",
    by: "by Kanak, Pune",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/04/theuddhavagita.pdf" }]
  },
  {
    name: "Geeta Rahasya Sanskrit",
    lang: "Sanskrit",
    by: "by Hemant Deshmukh",
    links: [{ label: "Open PDF", url: "https://vedpurana.files.wordpress.com/2021/03/gita-sadhale2.pdf" }]
  },
  {
    name: "108 Upanishads",
    lang: "Hindi",
    by: "With Upanishad Brahmam Commentary · by Hardik Kothari",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2014/02/108-upanishads-with-upanishad-brahmam-commentary.pdf" }]
  },
  {
    name: "Keno Upanishad",
    lang: "Hindi",
    by: "by Vaibhav Ghodke, Indore",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2016/07/kenoupnishad.pdf" }]
  },
  {
    name: "The Upanishads in Short",
    lang: "English",
    by: "by Chiranjeev Rajkhowa, Sivasagar",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/03/the_upanishads.pdf" }]
  },
  {
    name: "Vedant Darshan",
    lang: "Hi + Sa",
    by: "by Yogendra Mishra",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2013/04/gita-press-vedant-darshan-brahmasutra-sanskrit-hindi.pdf" }]
  },
  {
    name: "Brahmasutra",
    lang: "Sanskrit",
    by: "by Yogendra Mishra",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2013/04/bramsutr.pdf" }]
  },
  {
    name: "Vivek Chudamani",
    lang: "Hi + Sa",
    by: "by Yogendra Mishra",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2013/04/vivakchudamani.pdf" }]
  },
  {
    name: "Introduction to Vedanta",
    lang: "English",
    by: "Swami Dayananda · by Parul Airon",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/04/introduction-to-vedanta-by-swami-dayananda.pdf" }]
  },
  {
    name: "Vedanta Sutras — Sankaracharya",
    lang: "English",
    by: "by Parul Airon",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/04/vedanta-sutras-with-the-commentary-by-sankaracharya.pdf" }]
  }
];

export const TANTRA_YOGA: Book[] = [
  {
    name: "Vigyan Bhairav Tantra",
    lang: "Hindi",
    devaName: "विज्ञान भैरव तंत्र",
    by: "by Shiva Gupta, Kanpur",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2020/11/vigyan-bharav-tantra.pdf" }]
  },
  {
    name: "Shiva Swarodaya",
    lang: "Hi + Sa",
    devaName: "श्री शिवपार्वती सवांद",
    by: "by Vikrant Kaushish, Noida",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/05/shiva-swarodaya-sanskrit-hindi.pdf" }]
  },
  {
    name: "Shiva Samhita",
    lang: "Hi + Sa",
    by: "by Amit Mishra, Pune",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/03/shiva_sahinta_withhinditika.pdf" }]
  },
  {
    name: "Kularnava Tantra",
    lang: "English",
    by: "Arthur Avalon · by Manjari, Viborg",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/04/arthuravalonkularnavatantraeng.pdf" }]
  },
  {
    name: "Yoga Rasayanam",
    lang: "Hi + Sa",
    by: "by Vaibhav Ghodke, Indore",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/03/yoga-rasayanam-sanskrit-hindi.pdf" }]
  },
  {
    name: "Gheranda Samhita",
    lang: "Sanskrit + En",
    by: "S C Vasu · by Prasant Kumar Sahay",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/03/gheranda-samhita-by-s-c-vasu.pdf" }]
  },
  {
    name: "Kundalini — Evolutionary Energy",
    lang: "English",
    by: "Gopi Krishna · by Parul Airon",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/04/kundalini-the-evolutionary-energy-in-man-by-gopi-krishna.pdf" }]
  },
  {
    name: "Laghu Yoga Vasishta",
    lang: "English",
    by: "by Parul Airon",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/04/laghu-yoga-vasishta-english.pdf" }]
  },
  {
    name: "Shri YogVasisth Maharamayan",
    lang: "Hindi",
    by: "by Nirankari, Delhi",
    links: [
      { label: "Part 1", url: "https://vedpuran.net/wp-content/uploads/2021/04/shri-yogavasishtha-1.pdf" },
      { label: "Part 2", url: "https://vedpuran.net/wp-content/uploads/2021/04/shri-yogavasishtha-2.pdf" },
      { label: "Part 3", url: "https://vedpuran.net/wp-content/uploads/2021/04/shri-yogavasishtha-3.pdf" },
      { label: "Part 4", url: "https://vedpuran.net/wp-content/uploads/2021/04/shri-yogavasishtha-4.pdf" }
    ]
  },
  {
    name: "Rawan Sahinta",
    lang: "Hi + Sa",
    devaName: "रावण सहिंता",
    by: "by Rajkumar Ramji Soni, Raipur",
    links: [
      { label: "Part 1", url: "https://vedpuran.net/wp-content/uploads/2021/03/ravan-samhita-1.pdf" },
      { label: "Part 2", url: "https://vedpuran.net/wp-content/uploads/2021/03/ravan-samhita-2.pdf" },
      { label: "Part 3", url: "https://vedpuran.net/wp-content/uploads/2021/03/ravan-samhita-3.pdf" },
      { label: "Part 4", url: "https://vedpuran.net/wp-content/uploads/2021/03/ravan-samhita-4.pdf" },
      { label: "Part 5", url: "https://vedpuran.net/wp-content/uploads/2021/03/ravan-samhita-5.pdf" }
    ]
  }
];

export const PHILOSOPHY: Book[] = [
  {
    name: "Chanakya Sutrani",
    lang: "Sa + Hi",
    by: "Sanskrit with Hindi Commentary · by Divy Sitlani",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2014/02/chanakyasutrani-skt-text-with-hindi-commentary-1946.pdf" }]
  },
  {
    name: "Chanakya Niti Darpan",
    lang: "Hi + Sa",
    by: "by Hemant Kumar Deshmukh",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/03/chanakya-niti-darpan-vedpuran.pdf" }]
  },
  {
    name: "Chanakya Niti",
    lang: "Hindi",
    by: "by Ashutosh Bansal, Barnala Punjab",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2025/10/e0a49ae0a4bee0a4a3e0a495e0a58de0a4af-e0a4a8e0a580e0a4a4e0a4bf-ashutosh-kumar-bansal.pdf" }]
  },
  {
    name: "Manusmriti (English)",
    lang: "English",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2013/04/manusmriti.pdf" }]
  },
  {
    name: "Manusmriti (Hindi-Sanskrit)",
    lang: "Hi + Sa",
    by: "by Umesh Gupta, New Delhi",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2016/07/manusmiriti.pdf" }]
  },
  {
    name: "Vidur Niti",
    lang: "Sanskrit",
    by: "by Hemant Kumar Deshmukh",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/03/vidur-niti-vedpuran.pdf" }]
  },
  {
    name: "Panchatantra Sanskrit-Hindi",
    lang: "Sa + Hi",
    by: "by Vishal Goswami",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2014/02/panchatantrasanskrithindi-jpmishra1910.pdf" }]
  },
  {
    name: "Bijak Kabir Sahib",
    lang: "Hindi",
    by: "by Hemant Deshmukh",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2016/07/bijak_kabir-_saheb.pdf" }]
  },
  {
    name: "Anulom-Vilom Kavya",
    lang: "Hi + Sa",
    devaName: "राघवयादवीयम्",
    by: "Venkataadhvari · by Dr B.K. Shrivastav",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/04/raghav-yadviyam.pdf" }]
  },
  {
    name: "Satyarthaprakasa",
    lang: "Telugu → Hindi",
    by: "by Dr Ch Sivarama Krishna Sharma, Hyderabad",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/04/satyarthaprakasa.pdf" }]
  },
  {
    name: "Pratisarga Parva – Third Khand",
    lang: "English",
    by: "by Avinandan Bose",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2016/07/pratisarga-parva-third-khand.pdf" }]
  },
  {
    name: "Mantreswara's Phaladeepika",
    lang: "English",
    by: "by Parul Airon",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/04/mantreswara_s__phaladeeplka.pdf" }]
  },
  {
    name: "Science in Vedas",
    lang: "Hindi",
    by: "by Sankalp Pandey, Hisar",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2016/12/science-in-vedas.pdf" }]
  },
  {
    name: "Narad Bhakti Shandilya",
    lang: "Hi + Sa",
    by: "by Rajesh Sharma, Faridabad",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/03/90815narad_bhakti_shandilya_1p65.pdf" }]
  }
];

export const AYURVEDA_SCIENCE: Book[] = [
  {
    name: "Charak Samhita",
    lang: "Sa + Hi",
    by: "Atridevaji Gupt · by Hemant Deshmukh",
    links: [
      { label: "Vol 1", url: "https://vedpuran.net/wp-content/uploads/2016/07/charaksamhitaatridevajigupt-vol-1.pdf" },
      { label: "Vol 2", url: "https://vedpuran.net/wp-content/uploads/2016/07/charaksamhitaatridevajigupt-vol-2.pdf" }
    ]
  },
  {
    name: "Aryabhatiya (English)",
    lang: "English",
    by: "by Eklavya Bansal",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2013/02/aryabhata_with_english_commentary.pdf" }]
  },
  {
    name: "Aryabhatiya Sanskrit",
    lang: "Sanskrit",
    by: "by Hemant Deshmukh",
    links: [
      { label: "Part I", url: "https://vedpuran.net/wp-content/uploads/2021/03/aryabhatiyasanskrit.pdf" },
      { label: "Part II", url: "https://vedpuran.net/wp-content/uploads/2021/03/aryabhatiyachaptertwo.pdf" }
    ]
  },
  {
    name: "Brahma Sphuta Siddhanta",
    lang: "Sanskrit",
    by: "by Hemant Deshmukh",
    links: [
      { label: "Vol 1", url: "https://vedpuran.net/wp-content/uploads/2021/03/brahma-sphuta-siddhanta_vol_i.pdf" },
      { label: "Vol 2", url: "https://vedpuran.net/wp-content/uploads/2021/03/brahma-sphuta-siddhanta_vol_ii.pdf" },
      { label: "Vol 3", url: "https://vedpuran.net/wp-content/uploads/2021/03/brahma-sphuta-siddhanta_vol_iii.pdf" },
      { label: "Vol 4", url: "https://vedpuran.net/wp-content/uploads/2021/03/brahma-sphuta-siddhanta_vol_iv.pdf" }
    ]
  },
  {
    name: "Varahamihira Brhat Samhita",
    lang: "Sanskrit",
    by: "by Hemant Deshmukh",
    links: [{ label: "Open PDF", url: "https://vedpurana.files.wordpress.com/2021/03/varahamihira_brhatsamhitasanskrit.pdf" }]
  },
  {
    name: "Varahamihira Pancha (Astronomy)",
    lang: "Sanskrit",
    by: "by Hemant Deshmukh",
    links: [{ label: "Open PDF", url: "https://vedpurana.files.wordpress.com/2021/03/varahamihira_pancha.pdf" }]
  },
  {
    name: "Varahamihira Brihat Jataka",
    lang: "English",
    by: "Ancient Astrology · by Hemant Deshmukh",
    links: [{ label: "Open PDF", url: "https://vedpurana.files.wordpress.com/2021/03/varahamihira_the_brihat_jataka.pdf" }]
  },
  {
    name: "Brihat Parashara Hora Shastra",
    lang: "English",
    by: "by Tejas Pandya, Nagpur",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/04/brihat_parashara_hora_shastra_english_v.pdf" }]
  },
  {
    name: "Bhrigu Samhita (फलित दर्पण)",
    lang: "Hindi",
    by: "110 MB · Maharishi Bhrigu · by Eklavya Bansal",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2013/02/bhrigu-samhita-hindi1.pdf" }]
  },
  {
    name: "Rekha Ganit (रेखा गणित)",
    lang: "En + Sa",
    by: "by Hemant Deshmukh",
    links: [
      { label: "Vol I", url: "https://vedpurana.files.wordpress.com/2021/03/rekhaganitavol_i.pdf" },
      { label: "Vol II", url: "https://vedpurana.files.wordpress.com/2021/03/rekhaganitavol_ii_dli.pdf" }
    ]
  },
  {
    name: "Vrddhayavanjataka of Minaraja",
    lang: "English",
    by: "by Hemant Deshmukh",
    links: [
      { label: "Part 1", url: "https://vedpurana.files.wordpress.com/2021/03/vrddhayavanjataka-of-minaraja-1.pdf" },
      { label: "Part 2", url: "https://vedpurana.files.wordpress.com/2021/03/vrddhayavanjataka-of-minaraja-2.pdf" }
    ]
  },
  {
    name: "Vimanika Shastra",
    lang: "Hi + Sa",
    devaName: "विमानिका शस्त्र",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/03/vimanika-shaster.pdf" }]
  },
  {
    name: "Vimanika Shastra (English)",
    lang: "English",
    by: "by Sunil Kumar Singh & Om Asthana",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/03/the-vimanika-shastra.pdf" }]
  },
  {
    name: "Vastu for House",
    lang: "English",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/05/vastu-for-house-ebook.pdf" }]
  },
  {
    name: "Bhavan Bhaskar Vastu Shastra",
    lang: "Hindi",
    by: "by Hemant Deshmukh",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2016/07/bhavanbhaskar-vastu-shastra.pdf" }]
  },
  {
    name: "Arogyanidhii (आरोग्य निधि)",
    lang: "Hindi",
    by: "by Rajesh Kumar, Dehradun",
    links: [
      { label: "Part 1", url: "https://vedpuran.net/wp-content/uploads/2021/03/arogyanidhi1.pdf" },
      { label: "Part 2", url: "https://vedpuran.net/wp-content/uploads/2021/03/arogyanidhi2.pdf" }
    ]
  },
  {
    name: "Saral Rogopchar",
    lang: "Gujarati",
    by: "by Mukesh Dadhaniya",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/03/saral_rogopchar.pdf" }]
  },
  {
    name: "Swasthya Jivan (स्वस्थ जीवन)",
    lang: "Hindi",
    by: "by Pravin P Chauhan",
    links: [
      { label: "Part 1", url: "https://vedpuran.net/wp-content/uploads/2021/03/swasthya_jivan__no__7_1.pdf" },
      { label: "Part 2", url: "https://vedpuran.net/wp-content/uploads/2021/03/swasthya_jivan__no__7_2.pdf" }
    ]
  },
  {
    name: "Vividh Chikitsa",
    lang: "Hindi",
    by: "by Pravin P Chauhan",
    links: [
      { label: "Part I", url: "https://vedpuran.net/wp-content/uploads/2021/03/vividh_chikitsa1.pdf" },
      { label: "Part II", url: "https://vedpuran.net/wp-content/uploads/2021/03/vividh_chikitsa2.pdf" }
    ]
  },
  {
    name: "Divya Prerna Prakash",
    lang: "Hindi",
    devaName: "दिव्य प्रेरणा प्रकाश",
    by: "by Rajesh Kumar, Dehradun",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/03/divya_prerna_prakash.pdf" }]
  }
];

export const STOTRAS_CHALISA: Book[] = [
  {
    name: "Hanuman Chalisa",
    lang: "Hindi",
    by: "Mobile friendly version",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2026/01/hanuman-chalisa-mobile-friendly.pdf" }]
  },
  {
    name: "Hanuman Chalisa (Marwari)",
    lang: "Hindi",
    by: "by Rajeev Sharma, Rajasthan",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2014/11/hanumanchalisa.pdf" }]
  },
  {
    name: "Hanuman Chalisa",
    lang: "Hindi",
    by: "by Utkarsh Mahajan, Anand",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/05/hanuman-chalisa.pdf" }]
  },
  {
    name: "Bajrang Baan",
    lang: "Hindi",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/05/bajrang-baan.pdf" }]
  },
  {
    name: "Durga Chalisa",
    lang: "Hindi",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/05/durga-chalisa.pdf" }]
  },
  {
    name: "Ganesh Chalisa",
    lang: "Hindi",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/05/ganesh-chalisa.pdf" }]
  },
  {
    name: "Gayatri Chalisa",
    lang: "Hindi",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/05/gayatri-chalisa.pdf" }]
  },
  {
    name: "Navgraha Chalisa",
    lang: "Hindi",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/05/navgraha-chalisa.pdf" }]
  },
  {
    name: "Santoshi Maa Chalisa",
    lang: "Hindi",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/05/santoshi-maa-chalisa.pdf" }]
  },
  {
    name: "Sarasvati Chalisa",
    lang: "Hindi",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/05/sarasvati-chalisa.pdf" }]
  },
  {
    name: "Shiv Chalisa",
    lang: "Hindi",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/05/shiv-chalisa.pdf" }]
  },
  {
    name: "Sri Gajendra Moksha",
    lang: "Hindi",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/05/sri-gajendra-moksha.pdf" }]
  },
  {
    name: "Sri Krishna Chalisa",
    lang: "Hindi",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/05/sri-krishna-chalisa.pdf" }]
  },
  {
    name: "Sri Laxmi Chalisa",
    lang: "Hindi",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/05/sri-laxmi-chalisa.pdf" }]
  },
  {
    name: "Sri Shani Dev Chalisa",
    lang: "Hindi",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/05/sri-shani-dev-chalisa.pdf" }]
  },
  {
    name: "Swar Vigyan",
    lang: "Hindi",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/05/swar-vigyan.pdf" }]
  },
  {
    name: "Durga Saptashati (Hindi)",
    lang: "Hindi",
    by: "by Eklavya Bansal",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2013/04/durga-saptashati-hindi.pdf" }]
  },
  {
    name: "Durga Saptashati (Sanskrit)",
    lang: "Sanskrit",
    by: "by Eklavya Bansal",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2013/04/durga-saptshati-sanskrit.pdf" }]
  },
  {
    name: "Durga Saptsati",
    lang: "Hindi",
    by: "by Ram Manohar Kumar",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/05/durga_saptsati_web.pdf" }]
  },
  {
    name: "Sri Vishnu Sahasranaam Strotam",
    lang: "Sanskrit",
    by: "by Jatin Goyal, Nabha Pataila",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/03/sri-vishnu-sahasranaam-satrotam.pdf" }]
  },
  {
    name: "Shiv Tandav Stotram",
    lang: "Sanskrit",
    by: "by Hemant Kumar Deshmukh",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/03/shiv-thadav-stotram.pdf" }]
  },
  {
    name: "Gopi Geet",
    lang: "Sa+Gu+Hi+En",
    by: "Sanskrit, Gujarati, Hindi & English · by Santosh Vyas",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/04/gopi-geet-sanskritguj-hindi-eng.pdf" }]
  }
];

export const OTHERS: Book[] = [
  {
    name: "Guru Granth Sahib Ji",
    lang: "Hindi",
    by: "by Hemant Kumar Deshmukh",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/03/shri-guru-granth-sahib-ji-in-hindi.pdf" }]
  },
  {
    name: "Narayan Kwach",
    lang: "Hi + Sa",
    devaName: "नारायण कवच",
    by: "Smartphone screen-size version",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2016/03/narayan-kwach.pdf" }]
  },
  {
    name: "Tukaram Gatha",
    lang: "Sanskrit",
    devaName: "तुकाराम गाथा",
    by: "by Swapnil Akolkar",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/03/tukaramgatha.pdf" }]
  },
  {
    name: "Swami Narayan Vachnamrit",
    lang: "Gujarati",
    by: "by Inder Singh, Jodhpur",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/04/vachanamrut_001.pdf" }]
  },
  {
    name: "Caitanya Caritamrita – Aadi Lila",
    lang: "English",
    by: "by Hemant Deshmukh",
    links: [{ label: "Open PDF", url: "https://vedpurana.files.wordpress.com/2021/03/caitanya-caritamrita_adi_lila.pdf" }]
  },
  {
    name: "Caitanya Caritamrita – Madhya Lila",
    lang: "English",
    by: "by Hemant Deshmukh",
    links: [{ label: "Open PDF", url: "https://vedpurana.files.wordpress.com/2021/03/caitanya-caritamrita_madhya_lila.pdf" }]
  },
  {
    name: "Caitanya Caritamrita – Antya Lila",
    lang: "English",
    by: "by Hemant Deshmukh",
    links: [{ label: "Open PDF", url: "https://vedpurana.files.wordpress.com/2021/03/caitanya-caritamrita_antya_lila.pdf" }]
  },
  {
    name: "Caitanya Mahaprabhu ki Siksa",
    lang: "Hindi",
    by: "by Sumesh Singh, Udaipur",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/05/chatanya-mahaprabhu-ki-siksa-hindi-4th-ed.pdf" }]
  },
  {
    name: "Vraja Mandala Parikrama",
    lang: "Hindi",
    devaName: "ब्रज मंडल परिक्रमा",
    by: "by Sumesh Singh, Udaipur",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/05/vraja-mandala-parikrama-2ed-hindi.pdf" }]
  },
  {
    name: "Harinam Mahamantra",
    lang: "Hindi",
    devaName: "हरी नाम महामंत्र",
    by: "by Sumesh Singh, Udaipur",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/05/harinama-mahamantra-10th-ed-hindi1.pdf" }]
  },
  {
    name: "Panini Ashtadhyayi",
    lang: "Sanskrit",
    by: "8 Books · by Hemant Deshmukh",
    links: [
      { label: "Bk1", url: "https://vedpurana.files.wordpress.com/2021/03/panini_ashtadhyayi_book1.pdf" },
      { label: "Bk2", url: "https://vedpurana.files.wordpress.com/2021/03/panini_ashtadhyayi_book2.pdf" },
      { label: "Bk3", url: "https://vedpurana.files.wordpress.com/2021/03/panini_ashtadhyayi_book3.pdf" },
      { label: "Bk4", url: "https://vedpurana.files.wordpress.com/2021/03/panini_ashtadhyayi_book4.pdf" },
      { label: "Bk5", url: "https://vedpurana.files.wordpress.com/2021/03/panini_ashtadhyayi_book5.pdf" }
    ]
  },
  {
    name: "Panini Kashika",
    lang: "Sanskrit",
    by: "by Hemant Deshmukh",
    links: [{ label: "Open PDF", url: "https://vedpurana.files.wordpress.com/2021/03/panini_kashika.pdf" }]
  },
  {
    name: "Panini Kosha Dictionary",
    lang: "En + Sa",
    by: "Sanskrit-English · by Hemant Deshmukh",
    links: [{ label: "Open PDF", url: "https://vedpurana.files.wordpress.com/2021/03/panini_kosha_dictionary-of-the-sanskrit.pdf" }]
  },
  {
    name: "Panini Mahabhashya",
    lang: "Sanskrit",
    by: "6 Parts · by Hemant Deshmukh",
    links: [
      { label: "P1", url: "https://vedpurana.files.wordpress.com/2021/03/panini_mahabhashya_i.pdf" },
      { label: "P2", url: "https://vedpurana.files.wordpress.com/2021/03/panini_mahabhashya_ii.pdf" },
      { label: "P3", url: "https://vedpurana.files.wordpress.com/2021/03/panini_mahabhashya_iii.pdf" },
      { label: "P4", url: "https://vedpurana.files.wordpress.com/2021/03/panini_mahabhashya_iv.pdf" },
      { label: "P5", url: "https://vedpurana.files.wordpress.com/2021/03/panini_mahabhashya_v.pdf" },
      { label: "P6", url: "https://vedpurana.files.wordpress.com/2021/03/panini_mahabhashya_vi.pdf" }
    ]
  },
  {
    name: "Panini Siddhanta Kaumudi",
    lang: "Sanskrit",
    by: "by Hemant Deshmukh",
    links: [{ label: "Open PDF", url: "https://vedpurana.files.wordpress.com/2021/03/panini_siddhanta-kaumudi.pdf" }]
  },
  {
    name: "Panini Dhatu Path",
    lang: "Sanskrit",
    by: "by Hemant Deshmukh",
    links: [{ label: "Open PDF", url: "https://vedpurana.files.wordpress.com/2021/03/panini_thedhatupathaofpanini.pdf" }]
  },
  {
    name: "Sabda Kalpadrumam",
    lang: "Sanskrit",
    by: "5 Parts · by Hemant Deshmukh",
    links: [
      { label: "P1", url: "https://vedpurana.files.wordpress.com/2021/03/sabdakalpadrumah-01.pdf" },
      { label: "P2", url: "https://vedpurana.files.wordpress.com/2021/03/sabdakalpadrumah-02.pdf" },
      { label: "P3", url: "https://vedpurana.files.wordpress.com/2021/03/sabdakalpadrumah-03.pdf" },
      { label: "P4", url: "https://vedpurana.files.wordpress.com/2021/03/sabdakalpadrumah-04.pdf" },
      { label: "P5", url: "https://vedpurana.files.wordpress.com/2021/03/sabdakalpadrumah-05.pdf" }
    ]
  },
  {
    name: "Vachaspatya Sanskrit",
    lang: "Sanskrit",
    by: "6 Parts · by Hemant Deshmukh",
    links: [
      { label: "P1", url: "https://vedpurana.files.wordpress.com/2021/03/vacaspatyam-01.pdf" },
      { label: "P2", url: "https://vedpurana.files.wordpress.com/2021/03/vacaspatyam-02.pdf" },
      { label: "P3", url: "https://vedpurana.files.wordpress.com/2021/03/vacaspatyam-03.pdf" },
      { label: "P4", url: "https://vedpurana.files.wordpress.com/2021/03/vacaspatyam-04.pdf" },
      { label: "P5", url: "https://vedpurana.files.wordpress.com/2021/03/vacaspatyam-05.pdf" },
      { label: "P6", url: "https://vedpurana.files.wordpress.com/2021/03/vacaspatyam-06.pdf" }
    ]
  },
  {
    name: "Works of Sri Sankaracharya",
    lang: "Sanskrit",
    by: "20 Volumes · by Hemant Deshmukh",
    links: [
      { label: "V1", url: "https://vedpurana.files.wordpress.com/2021/03/works-of-sri-sankaracharya-01-brahmasutra-1.pdf" },
      { label: "V2", url: "https://vedpurana.files.wordpress.com/2021/03/works-of-sri-sankaracharya-02-brahmasutra-2.pdf" },
      { label: "V3", url: "https://vedpurana.files.wordpress.com/2021/03/works-of-sri-sankaracharya-03-brahmasutra-3.pdf" },
      { label: "V4", url: "https://vedpurana.files.wordpress.com/2021/03/works-of-sri-sankaracharya-04-isa-kena-katha-prasna-upanishads-1.pdf" },
      { label: "V5+", url: "https://vedpurana.files.wordpress.com/2021/03/works-of-sri-sankaracharya-05-mundaka-mandukya-aitareya-upanishads-1.pdf" }
    ]
  },
  {
    name: "Panchtantra Sanskrit-Hindi",
    lang: "Hi + Sa",
    by: "by Hemant Deshmukh",
    links: [{ label: "Open PDF", url: "https://vedpurana.files.wordpress.com/2021/03/panchatantrasanskrithindi-jpmishra1910.pdf" }]
  },
  {
    name: "Sadhak Sanjivani",
    lang: "Hindi",
    devaName: "साधक संजीविनी",
    by: "by Hemant Kumar Deshmukh",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2014/11/sadhak_sanjivini.pdf" }]
  },
  {
    name: "Sadhak Sanjivani (Swami Ramsukhdas)",
    lang: "Hi + Sa",
    by: "by Ram Manohar Kumar",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/05/sadhak-sanjivani-hindi-sanskrit-by-swami-ramsukhdas-ji-sanskrit-hindi.pdf" }]
  },
  {
    name: "Mantar Vigyan",
    lang: "Hindi",
    by: "by Lakshman Sharma",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/05/mantra-vigyan.pdf" }]
  },
  {
    name: "Sandhyaa Rahasya",
    lang: "Hindi",
    by: "by Chandra Shekher Katiyar, Ambikapur",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/03/sandhyaa-rahasya-pt-chamupati.pdf" }]
  },
  {
    name: "Manglacharana",
    lang: "Hi + Sa",
    by: "by Rajesh Sharma, Faridabad",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/03/manglacharana.pdf" }]
  },
  {
    name: "Prasad",
    lang: "Hindi",
    by: "by Rajesh Sharma, Faridabad",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/03/prasad.pdf" }]
  },
  {
    name: "Gayatri Worship",
    lang: "English",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/05/gayatri-worship.pdf" }]
  },
  {
    name: "Sharvan Maah Mahatam",
    lang: "Hindi",
    by: "by Anshuman Shrivastava, Gaya Bihar",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2025/10/sharvan-maah-mahatam-all-charter-1-30-anshuman-kumar.pdf" }]
  },
  {
    name: "Nataraaja Ashtotharam Tamil",
    lang: "Tamil",
    by: "by Bavakuru, Jaffna",
    links: [{ label: "Open PDF", url: "https://vedpurana.files.wordpress.com/2021/03/nataraaja-ashtotharam01.pdf" }]
  },
  {
    name: "OM Research — Spectral Analysis",
    lang: "English",
    by: "by Sandeep Bhan, Delhi",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/03/spectral_analysis_om.pdf" }]
  },
  {
    name: "OM Research — Solar Eclipse",
    lang: "English",
    by: "by Sandeep Bhan, Delhi",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/03/solar_eclipse_om.pdf" }]
  },
  {
    name: "OM — Effect on Nervous System",
    lang: "English",
    by: "by Sandeep Bhan, Delhi",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/03/om_chant_effect_on_nervous_system.pdf" }]
  },
  {
    name: "OM — Science & Astronomy",
    lang: "English",
    by: "by Sandeep Bhan, Delhi",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/03/science_and_astronomy_ijtk-134-716-724.pdf" }]
  },
  {
    name: "Super Brain Yoga — Research Study",
    lang: "English",
    by: "by Sandeep Bhan, Delhi",
    links: [{ label: "Open PDF", url: "https://vedpuran.net/wp-content/uploads/2021/03/sby-a-research-study.pdf" }]
  }
];

export const ALL_CATEGORIES = {
  puranas: { title: "Puranas", icon: "📜", description: "Mahapuranas & Upapuranas detailing cosmos history and chronicles", list: PURANAS },
  vedas: { title: "Vedas", icon: "🕉️", description: "The core revealations – Rig, Sama, Yajur, and Atharva Vedas", list: VEDAS },
  epics: { title: "Epics", icon: "⚔️", description: "The beautiful historical epics: Ramayana and Mahabharata", list: EPICS },
  gita: { title: "Gita & Upanishads", icon: "🌸", description: "Vedant philosophy, Upanishad commentaries, and absolute paths to self-knowledge", list: GITA_UPANISHADS },
  tantra: { title: "Tantra & Yoga", icon: "🔱", description: "Practical mysticism, breathing, energetic frameworks, and cosmic unions", list: TANTRA_YOGA },
  philosophy: { title: "Philosophy", icon: "🏛️", description: "Dharma, ethics, deep rationalism, and codes of statecraft from ancient sages", list: PHILOSOPHY },
  ayurveda: { title: "Ayurveda & Science", icon: "🌿", description: "Health, medicine, astronomy, architecture (Vastu), and aeronautics description", list: AYURVEDA_SCIENCE },
  stotras: { title: "Stotras & Chalisa", icon: "🪔", description: "Prayers, sacred chants, shields, and emotional devotion portals", list: STOTRAS_CHALISA },
  others: { title: "Others", icon: "📚", description: "Grammars like Panini, dictionaries, and research regarding modern consciousness states", list: OTHERS }
};

export const PHILOSOPHERS: Philosopher[] = [
  {
    name: "Krishna",
    category: "Indian",
    dates: "c. 3100 BCE (Traditional)",
    majorWork: "Bhagavad Gita",
    description: "Towering statesman, yogic master, and avatar of Vishnu who formulated Karma Yoga, Bhakti Yoga, and Jnana Yoga in the middle of a colossal battlefield.",
    quote: "You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions."
  },
  {
    name: "Mahavira",
    category: "Indian",
    dates: "599 – 527 BCE",
    majorWork: "Preserved in Jain Agamas",
    description: "The 24th Tirthankara of Jainism who attained omniscience after 12 years of severe austerities. He established absolute Ahimsa (non-violence) and Anekantavada (multi-sided truth) as pillars of human behavior.",
    quote: "Do not injure, abuse, oppress, enslave, insult, torment, torture, or kill any creature or living being."
  },
  {
    name: "Gautama Buddha",
    category: "Indian",
    dates: "563 – 483 BCE",
    majorWork: "Preserved in the Tripitaka",
    description: "Born Siddhartha Gautama, he attained full liberation under the Bodhi tree. He taught the Four Noble Truths and the Eightfold Path to end the cycle of search-and-craving.",
    quote: "Peace comes from within. Do not seek it without."
  },
  {
    name: "Chanakya",
    category: "Indian",
    dates: "375 – 283 BCE",
    majorWork: "Arthashastra",
    description: "Grand counselor of Maurya Empire. He codified ancient statecraft, realpolitik, macroeconomic resilience, espionage, and moral governance code.",
    quote: "Once you start working on something, don't be afraid of failure and don't abandon it. People who work sincerely are closest to divinity."
  },
  {
    name: "Patanjali",
    category: "Indian",
    dates: "c. 2nd Century BCE",
    majorWork: "Yoga Sutras",
    description: "Synthesized the practices of classical Yoga into the Eight Limbs (Ashtanga Yoga) — transitioning from physical self-mastery to deep meditation.",
    quote: "Yoga is the calming of the ripples of mind-stuff."
  },
  {
    name: "Adi Shankaracharya",
    category: "Indian",
    dates: "788 – 820 CE",
    majorWork: "Upanishad & Gita Commentaries",
    description: "Towering proponent of Advaita Vedanta (non-duality) who walked the length and breadth of India consolidating non-dual reality: Atman is identical to Brahman.",
    quote: "Brahman alone is real; the material world is a relative projection."
  },
  {
    name: "Ramanuja",
    category: "Indian",
    dates: "1017 – 1137 CE",
    majorWork: "Sri Bhashya",
    description: "Sanskrit philosopher of Vishishtadvaita (qualified non-duality) who integrated emotional devotion with systematic philosophical structure.",
    quote: "The divine Lord is full of absolute love. Reaching Union means aligning of heart with that divine core."
  },
  {
    name: "Madhvacharya",
    category: "Indian",
    dates: "1238 – 1317 CE",
    majorWork: "Anuvyakhyana",
    description: "Advocate of Dvaita (absolute dualism) who stated that individual souls and the cosmic godhead remain forever unique and separate.",
    quote: "Love is the primary path to absolute freedom."
  },
  {
    name: "Swami Vivekananda",
    category: "Indian",
    dates: "1863 – 1902 CE",
    majorWork: "Raja Yoga & Karma Yoga",
    description: "Brought the synthesis of dynamic spiritual Vedanta to the West, emphasizing practical service to the poor, mental focus, and human dignity.",
    quote: "Arise, awake, and stop not until the goal is reached."
  },
  {
    name: "Sri Aurobindo",
    category: "Indian",
    dates: "1872 – 1950",
    majorWork: "The Life Divine",
    description: "Developed Integral Yoga to evolve mental consciousness into 'supermental' divine living directly upon Earth.",
    quote: "True knowledge is not attained by thinking. It is what you are; it is what you become."
  },
  {
    name: "Jiddu Krishnamurti",
    category: "Indian",
    dates: "1895 – 1986",
    majorWork: "Freedom from the Known",
    description: "Stated that truth is a pathless land. Rejected all institutional religious authority, urging people to observe their own mental movements directly.",
    quote: "It is no measure of health to be well-adjusted to a profoundly sick society."
  },
  {
    name: "Osho",
    category: "Indian",
    dates: "1931 – 1990",
    majorWork: "The Book of Secrets",
    description: "Iconoclastic modern thinker who synthesized eastern meditation secrets with western psychotherapy and existential courage.",
    quote: "Be — don't try to become."
  },
  {
    name: "Socrates",
    category: "Greek",
    dates: "470 – 399 BCE",
    majorWork: "Recorded in Plato's Dialogues",
    description: "Pioneered Western ethics by walking the streets of Athens questioning unexamined beliefs, leading to the Socratic Method of logical cross-examination.",
    quote: "The unexamined life is not worth living."
  },
  {
    name: "Plato",
    category: "Greek",
    dates: "428 – 348 BCE",
    majorWork: "The Republic",
    description: "Student of Socrates. Established the Academy and developed the Theory of Forms, arguing that the physical world is a shadow of real eternal truths.",
    quote: "At the touch of love everyone becomes a poet."
  },
  {
    name: "Aristotle",
    category: "Greek",
    dates: "384 – 322 BCE",
    majorWork: "Nicomachean Ethics",
    description: "Tutor to Alexander the Great. Constructed deductive logic, categorizations of sciences, and the ethos of finding the virtue as the golden mean.",
    quote: "It is the mark of an educated mind to entertain a thought without accepting it."
  },
  {
    name: "Epicurus",
    category: "Greek",
    dates: "341 – 270 BCE",
    majorWork: "Letter to Menoeceus",
    description: "Argued that the highest good is to seek modest pleasures, self-sufficiency, and freedom from fear and pain through rational philosophy.",
    quote: "Death is nothing to us. When we exist, death is not; and when death exists, we are not."
  },
  {
    name: "Epictetus",
    category: "Greek",
    dates: "50 – 135 CE",
    majorWork: "Enchiridion / Discourses",
    description: "Born a slave, he became one of Rome's greatest Stoics, showing that we cannot control outer events, only our psychological reactions.",
    quote: "People are disturbed not by things, but by the views they take of things."
  },
  {
    name: "Marcus Aurelius",
    category: "Greek",
    dates: "121 – 180 CE",
    majorWork: "Meditations",
    description: "Roman Emperor and towering philosopher who practiced Stoicism while leading armies, writing a personal journal of raw, beautiful self-discipline.",
    quote: "You have power over your mind - not outside events. Realize this, and you will find strength."
  },
  {
    name: "Confucius",
    category: "Chinese",
    dates: "551 – 479 BCE",
    majorWork: "Analyects",
    description: "Shaped Chinese civilization by declaring that harmonic society is built upon structured family respect, rites, and virtuous leadership.",
    quote: "The man who moves a mountain begins by carrying away small stones."
  },
  {
    name: "Laozi",
    category: "Chinese",
    dates: "c. 6th Century BCE",
    majorWork: "Tao Te Ching",
    description: "Mystical originator of Taoism. He urged people to discard unnatural striving and align with 'the Tao' via non-action (wu wei).",
    quote: "Nature does not hurry, yet everything is accomplished."
  },
  {
    name: "Zhuangzi",
    category: "Chinese",
    dates: "c. 4th Century BCE",
    majorWork: "Zhuangzi Book",
    description: "Unravelled standard mental limits using humorous paradoxes, parables, and his famous butterfly dream, exploring natural freedom.",
    quote: "To settle disputes by changing perspectives is to reside within the center of the Circle."
  },
  {
    name: "René Descartes",
    category: "Western",
    dates: "1596 – 1650",
    majorWork: "Meditations on First Philosophy",
    description: "Initiated modern rationalism by systematically doubting all sensory evidence until finding the bedrock of thinking.",
    quote: "Cogito, ergo sum. I think, therefore I am."
  },
  {
    name: "John Locke",
    category: "Western",
    dates: "1632 – 1704",
    majorWork: "Two Treatises of Government",
    description: "Proposed that the mind is a blank slate (tabula rasa) at birth and that citizens retain natural rights to life, liberty, and estate.",
    quote: "The end of law is not to abolish or restrain, but to preserve and enlarge freedom."
  },
  {
    name: "David Hume",
    category: "Western",
    dates: "1711 – 1776",
    majorWork: "A Treatise of Human Nature",
    description: "Skeptical empiricist who declared that human reasoning is guided by habits and feelings rather than objective rational certainty.",
    quote: "Reason is, and ought only to be the slave of the passions."
  },
  {
    name: "Immanuel Kant",
    category: "Western",
    dates: "1724 – 1804",
    majorWork: "Critique of Pure Reason",
    description: "Built a bridge between rationalism and empiricism, demonstrating that our minds actively structure all our experiences of the world.",
    quote: "Two things fill the mind with ever new and increasing admiration: the starry heavens above me and the moral law within me."
  },
  {
    name: "Arthur Schopenhauer",
    category: "Western",
    dates: "1788 – 1860",
    majorWork: "The World as Will and Representation",
    description: "Synthesized Upanishadic non-duality with Western thought, declaring that the base of the cosmos is a blind, endless 'Will' that causes suffering.",
    quote: "Every man takes the limits of his own field of vision for the limits of the world."
  },
  {
    name: "Friedrich Nietzsche",
    category: "Western",
    dates: "1844 – 1900",
    majorWork: "Thus Spoke Zarathustra",
    description: "Radical critic of traditional morals. Urged active creation of own purposes to transcend institutional mediocrity as the Übermensch.",
    quote: "That which does not kill us makes us stronger."
  },
  {
    name: "Jean-Paul Sartre",
    category: "Western",
    dates: "1905 – 1980",
    majorWork: "Being and Nothingness",
    description: "Champion of modern existentialism, stating that 'existence precedes essence' and that humans are condemned to be absolutely free.",
    quote: "We are left alone, without excuse. That is what I mean when I say that man is condemned to be free."
  }
];

export const TIMELINE_EVENTS: TimelineEvent[] = [
  { date: "3500 BCE", name: "First Recorded Writing", desc: "The transition from prehistoric speech to permanent recording: Cuneiform script develops in Sumer (Mesopotamia).", isBig: true, category: "civilization" },
  { date: "3000 BCE", name: "The First Kingdom Unification", desc: "Pharaoh Narmer unites Upper and Lower Egypt into a single kingdom under divine solar rule.", isBig: true, category: "civilization" },
  { date: "Treta Yuga", name: "Lord Rama of Ayodhya", desc: "Traditional Hindu era of Rama's reign, laying the eternal codes of political dharma and sacred commitment.", isBig: false, category: "spiritual" },
  { date: "2560 BCE", name: "The Great Pyramid of Giza", desc: "Built as a cosmic conduit and burial chamber under Pharaoh Khufu, demonstrating unbelievable engineering accuracy.", isBig: false, category: "civilization" },
  { date: "c. 3102 BCE", name: "Ascent of Lord Krishna", desc: "The passing of Lord Krishna marks the traditional commencement of Kali Yuga. His Bhagavad Gita forever binds Karma and Dharma.", isBig: false, category: "spiritual" },
  { date: "1754 BCE", name: "Codification of Hammurabi", desc: "Babylonian king inscribes a strict legal code on a public basalt stele, declaring 'an eye for an eye'.", isBig: false, category: "civilization" },
  { date: "c. 1500 BCE", name: "Composition of the Vedas", desc: "The oldest layer of Sanskrit literature and hymns comprising the RigVeda is structured by cosmic seers.", isBig: true, category: "knowledge" },
  { date: "599 BCE", name: "Birth of Mahavira", desc: "Sanskrit prince renounces all material possessions in Vaishali to teach strict Ahimsa (absolute nonviolence).", isBig: true, category: "spiritual" },
  { date: "563 BCE", name: "Gautama Buddha's Awakening", desc: "Siddhartha Gautama sits under the Bodhi tree, dissolving mental blocks to find the four noble paths of truth.", isBig: true, category: "spiritual" },
  { date: "551 BCE", name: "Confucian Social Reform", desc: "Confucius establishes ethical social models and ancestor respect in Lu State during China's warring state era.", isBig: true, category: "knowledge" },
  { date: "c. 6th c. BCE", name: "Laozi Writes the Way", desc: "The mysterious keeper of archives writes the Tao Te Ching, urging returns to simple natural flow (Wu Wei).", isBig: false, category: "spiritual" },
  { date: "470 BCE", name: "Socrates' Street Dialogues", desc: "The onset of dialectic logic: Socrates starts questioning intellectual pride in the market square of Athens.", isBig: true, category: "knowledge" },
  { date: "428 BCE", name: "Plato Establishes the Academy", desc: "In Athens, Plato designs the world's first formal institute for research, geometry, and philosophical contemplation.", isBig: true, category: "knowledge" },
  { date: "384 BCE", name: "Aristotle Explains Empirical Laws", desc: "Aristotle structures categorical logic, physics, biology, and politics via pure observation of natural mechanics.", isBig: true, category: "knowledge" },
  { date: "~150 CE", name: "Nagarjuna's Middle Way", desc: "Nagarjuna develops Madhyamaka, showing that all things lack individual separate self-substance (Sunyata).", isBig: false, category: "knowledge" },
  { date: "788 CE", name: "Adi Shankaracharya's Renovation", desc: "Re-establishes the non-dual baseline of Advaita Vedanta across India before passing at the age of 32.", isBig: true, category: "spiritual" },
  { date: "1596 CE", name: "Descartes' Methodological Doubt", desc: "Dissolves mental conditioning to establish mathematical certitude: 'I think, therefore I am'.", isBig: false, category: "knowledge" },
  { date: "1724 CE", name: "Immanuel Kant's Synthesis", desc: "Synthesizes human experience and physical reality, outlining universal moral rules (Categorical Imperative).", isBig: false, category: "knowledge" },
  { date: "1844 CE", name: "Friedrich Nietzsche's Warning", desc: "Urges the evolution of human values into self-responsible courage, escaping institutional traps.", isBig: false, category: "knowledge" },
  { date: "1863 CE", name: "Swami Vivekananda's World Speech", desc: "Introduces universal sisterhood, brotherhood, Yoga and Advaita Vedanta philosophy to a packed Chicago hall.", isBig: true, category: "spiritual" },
  { date: "1895 CE", name: "Krishnamurti Direct Vision", desc: "Urges Direct Observation without the medium of institutional masters: 'Truth is a pathless land'.", isBig: false, category: "spiritual" },
  { date: "1931 CE", name: "Osho's Universal Synthesis", desc: "Merges deep Zen mindfulness, Upanishads, dynamic breathing, and modern psychotherapy.", isBig: false, category: "spiritual" },
  { date: "2026 CE", name: "The Present Epoch", desc: "You stand at the summit of this vast historical architecture, holding these sacred library keys.", isBig: true, category: "civilization" }
];

export const TOP_10_BOOKS = [
  { rank: "01", title: "Bhagavad Gita", language: "Sanskrit / Hind / Eng", stars: 5 },
  { rank: "02", title: "Dhammapada", language: "Pali / English", stars: 5 },
  { rank: "03", title: "Tao Te Ching", language: "Chinese / English", stars: 5 },
  { rank: "04", title: "Analects of Confucius", language: "Chinese / English", stars: 5 },
  { rank: "05", title: "The Republic by Plato", language: "Greek / English", stars: 5 },
  { rank: "06", title: "Meditations by Marcus Aurelius", language: "Latin / English", stars: 5 },
  { rank: "07", title: "Yoga Sutras of Patanjali", language: "Sanskrit / Hindi", stars: 5 },
  { rank: "08", title: "Arthashastra by Chanakya", language: "Sanskrit / English", stars: 5 },
  { rank: "09", title: "Freedom from the Known by J. Krishnamurti", language: "English", stars: 5 },
  { rank: "10", title: "Thus Spoke Zarathustra by Nietzsche", language: "German / English", stars: 5 }
];
