import type { Artwork } from "./types";

// Text and imagery curated from the XD Lab record and documented sources.
// Image provenance and secondary-source review: ./SOURCES.md.
export const notEqual: Artwork = {
  slug: "not-equal",
  title: "≠",
  year: "2023",
  menuDescription: "Highlights the value of instability, nonequality over algorithmic equations",
  width: 960, height: 720,
  creators: ["Jeanyoon Choi"],
  venue: "Ars Electronica, Austria | Istanbul Digital Arts Festival, Türkiye",
  exhibitions: [
    { name: "Ars Electronica 2023: Who Owns the Truth?", venue: "Linz, Austria", dates: "September 2023", url: "https://ars.electronica.art/who-owns-the-truth/en/%E2%89%A0/" },
    { name: "Istanbul Digital Art Festival 2024: Search Reality", venue: "Istanbul, Türkiye", dates: "May 2024", url: "https://digitalartfestistanbul.org/wp-content/uploads/idaf_2024_katalog_eng.pdf" },
    { name: "Some Facts at Midnight", venue: "Studio Motif, Seoul, South Korea", dates: "November 2023" },
    { name: "Beyond Binary: Exploring Life Beyond Data", venue: "Monash University (virtual), Australia", dates: "November 2023", url: "https://www.monash.edu/mada/student-work/mada-now-2023/fine-art/bachelor-of-fine-art-art-history-and-curating/esther-ong" },
    { name: "Coding Creativity", venue: "Hera Gallery, Rhode Island, United States", dates: "October 2023", url: "https://www.heragallery.org/coding-creativity" },
    { name: "HYPERSPECTRAL", venue: "PhotoAccess, Manuka, Australia", dates: "July 2023" },
    { name: "COUNTERPOINT", venue: "Royal College of Art, London, United Kingdom", dates: "July 2023", url: "https://2023.rca.ac.uk/students/jeanyoon-choi/" },
  ],
  image: "/artworks/not-equal/1.webp",
  images: [
    {
      "src": "/artworks/not-equal/1.webp",
      "alt": "Four screens of the ≠ installation arranged across a gallery floor.",
      "width": 1920,
      "height": 1440,
      "caption": "The four-channel 『≠』 installation arranged across the gallery."
    },
    {
      "src": "/artworks/not-equal/2.webp",
      "alt": "Algorithmic image self-generated bearing the ≠ symbol.",
      "width": 1920,
      "height": 1080,
      "caption": "Algorithmic image self-generated bearing the ≠ symbol.",
    },
    {
      "src": "/artworks/not-equal/3.webp",
      "alt": "Three vertically stacked gallery screens showing stages of ≠.",
      "width": 3024,
      "height": 4032,
      "caption": "Three gallery screens show different stages of the four-channel work."
    },
    {
      "src": "/artworks/not-equal/4.webp",
      "alt": "Turquoise introductory ≠ screen with equations and a QR code.",
      "width": 3840,
      "height": 2160,
      "caption": "The opening screen presents equations and a QR code for mobile participation."
    },
    {
      "src": "/artworks/not-equal/5.webp",
      "alt": "≠ (Nonequality): chatGPT dialogue arranged across a dark screen.",
      "width": 1920,
      "height": 1440,
      "caption": "One channel accumulates real-time ChatGPT dialogue."
    },
    {
      "src": "/artworks/not-equal/6.webp",
      "alt": "≠ (Nonequality): gallery monitor displaying layered cyan and red imagery.",
      "width": 1920,
      "height": 1440,
      "caption": "A gallery monitor layers cyan and red algorithmic imagery."
    },
    {
      "src": "/artworks/not-equal/7.webp",
      "alt": "Turquoise ≠ screen relating time, money, consumption, and capital.",
      "width": 1920,
      "height": 1299,
      "caption": "The screen connects time, money, consumption, and capital through ≠."
    },
    {
      "src": "/artworks/not-equal/8.webp",
      "alt": "Rhizomatic keyword network on a black screen with ≠ notation.",
      "width": 1920,
      "height": 1440,
      "caption": "A rhizomatic database maps relationships between keywords."
    },
    {
      "src": "/artworks/not-equal/9.webp",
      "alt": "≠ (Nonequality): dionysus text over layered moving imagery in the artwork.",
      "width": 1920,
      "height": 1285,
      "caption": "Text invoking Dionysus appears over the moving image layers."
    },
    {
      "src": "/artworks/not-equal/10.webp",
      "alt": "Red screen of dense text, images, and the ≠ symbol.",
      "width": 1920,
      "height": 1080,
      "caption": "Dense text and images build toward the work’s final chaotic state."
    }
  ],
  video: { label: "Watch video ↗", url: "https://vimeo.com/904510875?share=copy" },
  content: { en: {
  "title": "≠ (Nonequality)",
  "summary": "『≠ (Nonequality)』 is an interactive Multi-Device Web Artwork arguing that the world cannot be comprehended solely with equations.",
  "paragraphs": [
    "The artwork 『≠』 explores the theme of ‘Illogicality within seemingly logical systems’, resonating with the notion that the rational components can amalgamate to produce irrational outcomes, akin to Dostoevsky’s criticism of the Crystal Palace. It presents how algorithmic outcomes - often considered logical - might present an illogical impression when aggregated. Employing different AI-generated outcomes ranging from GPT, Stable Diffusion, and TTS, 『≠』 presents the aggregated chaos where individual sections adhere to logic and algorithms, yet the overall experience emerges as illogical, deconstructed, and decentralised.",
    "Implemented in 4 Channels, 『≠』 invites audiences to scan the QR with their mobile and interact with this web-based artwork in real-time. Upon landing the mobile website, they first encounter an encyclopaedic interface where they can click on blue hyperlink keywords, transitioning from one keyword to another. Each keyword click dynamically influences all four channels via WebSocket, affecting the Rhizomatic Database, overlaid YouTube videos, and TTS-empowered dialogues where one screen generates LLM-based scripts in real-time, and the other responds ‘Ja’ continuously to the LLM. This ‘Ja’, reminiscent of a Nietzscheistic Camel, shifts towards ‘Nein’ and aggregated ‘Nein’ as audiences’ interaction accelerates, symbolically representing the evolution towards Nietzschestic Lion and Baby. The latest stage presents immersive chaos across all four channels, presenting joyful illogicality (≠) generated from seemingly logical systems (=)."
  ],
  "medium": "Multi-Device Web Artwork (4 Channels, 1 Mobile)"
} },
  references: [
  {
    "label": "XD Lab",
    "url": "https://www.xdlab.net/projects/nonequality"
  },
  {
    "label": "Earlier artwork page",
    "url": "https://portfolio-jyc.org/nonequality"
  }
],
};
