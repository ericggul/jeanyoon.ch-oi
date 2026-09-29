import type { Artwork } from "./types";

// Text and imagery curated from the XD Lab record and documented sources.
// Image provenance and secondary-source review: ./SOURCES.md.
export const sota: Artwork = {
  slug: "sota",
  title: "SoTA",
  year: "2024",
  menuDescription: "Verfremdungseffekt on Contemporary Neural Network Architectures",
  width: 960, height: 720,
  creators: ["Jeanyoon Choi","Euan Kang","SeJoon Park","Minhyeok Seo","Prof. Yiyun Kang"],
  venue: "KAIST Art Museum",
  exhibitions: [
    { name: "KAIST Art Museum Opening Media Art Exhibition", venue: "KAIST Art Museum", dates: "17 December 2024 – 30 June 2025", url: "https://sota-xdlab.net/" },
    { name: "ACM DIS 2026 Interactivity", venue: "National University of Singapore, Singapore", dates: "June 2026", url: "https://dis.acm.org/2026/program-2026/" },
  ],
  site: "https://sota-xdlab.net/",
  relatedResearchId: "sota",
  image: "/artworks/sota/1.webp",
  images: [
    {
      "src": "/artworks/sota/1.webp",
      "alt": "Wide purple-lit installation view of SoTA at KAIST Art Museum.",
      "width": 1920,
      "height": 1068,
      "caption": "Installation view of 『SoTA』 in KAIST Art Museum."
    },
    {
      "src": "/artworks/sota/2.webp",
      "alt": "SoTA: visitor standing inside the gallery with green projection and four screens.",
      "width": 1920,
      "height": 1280,
      "caption": "The four screens and green projection surround a visitor in the gallery."
    },
    {
      "src": "/artworks/sota/3.webp",
      "alt": "SoTA: phone interaction in front of a visualised neural-network avatar.",
      "width": 1920,
      "height": 1280,
      "caption": "A visitor uses a phone to interact with a visualised neural-network avatar."
    },
    {
      "src": "/artworks/sota/4.webp",
      "alt": "SoTA: installation view with red and blue screens between large projections.",
      "width": 1920,
      "height": 1147,
      "caption": "Four displays sit between the red and blue projections."
    },
    {
      "src": "/artworks/sota/5.webp",
      "alt": "SoTA: purple close-up of the projection structure.",
      "width": 1920,
      "height": 1200,
      "caption": "A close view of the purple projected structure in the installation."
    },
    {
      "src": "/artworks/sota/6.webp",
      "alt": "SoTA: visitor facing the installation as white projected forms cross the gallery.",
      "width": 1920,
      "height": 1073,
      "caption": "Projected white network forms cross the gallery around a visitor."
    },
    {
      "src": "/artworks/sota/7.webp",
      "alt": "SoTA: visitor interacting beside a screen of neural-network visualisation.",
      "width": 1920,
      "height": 1280,
      "caption": "A visitor navigates neural-network information on a gallery screen."
    },
    {
      "src": "/artworks/sota/8.webp",
      "alt": "Monochrome network lines visualising the abstract phase of SoTA.",
      "width": 1920,
      "height": 1200,
      "caption": "Monochrome lines visualise the abstract Backend phase."
    },
    {
      "src": "/artworks/sota/9.webp",
      "alt": "SoTA: wide view of the installation with projected abstract lines and central screens.",
      "width": 1920,
      "height": 1050,
      "caption": "An installation view with abstract projected lines and four central screens."
    },
    {
      "src": "/artworks/sota/10.webp",
      "alt": "SoTA: visitor using a phone to scan the installation QR code.",
      "width": 1920,
      "height": 1280,
      "caption": "A visitor scans the installation QR code to enter the mobile experience."
    },
    {
      "src": "/artworks/sota/11.webp",
      "alt": "SoTA: purple geometric structure from the representational phase.",
      "width": 1920,
      "height": 1200,
      "caption": "A purple geometric model in the representational Frontend phase."
    },
    {
      "src": "/artworks/sota/12.webp",
      "alt": "Neural-network model visuals and corresponding SoTA installation views.",
      "caption": "The paper juxtaposes neural-network model forms with their room-scale installation views.",
      "width": 1920,
      "height": 1266
    },
    {
      "src": "/artworks/sota/13.webp",
      "alt": "SoTA: backend visualisations and their projection in the exhibition.",
      "caption": "Backend token-similarity visualisations are shown in detail and projected across the exhibition space.",
      "width": 1920,
      "height": 801
    },
    {
      "src": "/artworks/sota/14.webp",
      "alt": "Diagram of the Idle, Frontend, and Backend states of SoTA.",
      "caption": "The paper maps 『SoTA』’s audience-driven Idle, Frontend, and Backend states across the projectors and four screens.",
      "width": 1920,
      "height": 1168
    },
    {
      "alt": "SoTA software architecture: mobile orientation and Socket.io connect audience input to the Idle, Frontend, and Backend states, with Three.js, D3.js, AI dialogue, speech, and token-embedding visualisation.",
      "caption": "Software architecture of 『SoTA』: audience input, synchronized display outputs, and transitions between Idle, Frontend, and Backend.",
      "width": 3702,
      "height": 3688,
      "src": "/artworks/sota/15.webp"
    }
  ],
  video: { label: "Watch video ↗", url: "https://player.vimeo.com/video/1061512520?h=862a6a902a" },
  content: { en: {
  "title": "SoTA",
  "summary": "『SoTA』 is an interactive XAI Multi-Device Web Artwork. Audience’s phone initially navigates a 3d visualisation of 118 neural networks; when they leave, all screens erupt into chaotic monochrome patterns, exposing AI’s drift from human comprehension toward “AI for AI’s sake”.",
  "paragraphs": [
    "State-of-the-Art (SoTA) refers to cutting-edge AI models, analogous to achieving an artistic pinnacle. Early SoTA architectures (CNN/RNN) were designed to mimic human cognition, echoing the representational approach. Yet, as Rich Sutton’s “Bitter Lesson” argues, ever-growing GPU power now eclipses human-designed intricacies, nudging SoTA from carefully crafted forms toward vast, computation-driven abstractions.",
    "『SoTA』 is an XAI(Explainable AI)-driven interactive multi-device web artwork that makes our evolving metaphor tangible. Two projectors, four PCs, and audiences’ mobiles present 118 neural architectures in a 3D, interactive, and representational form—initially mirroring SoTA’s earlier pre-modernist era (the Frontend). But once audiences stop interacting and leave the site, unprecedentedly, the screens flip to chaotic monochrome visuals that abstractly depict LLM token cross-similarities (the Backend). Like Pollock’s expressive drips, the swirling lines of connectionism immerse audiences in a vortex of high-dimensional complexity no longer intelligible to us.",
    "Mirroring Modernism’s shift, 『SoTA』 reveals how AI can reshape society, identity, and creativity. It questions whether massive models will foster inclusive, human-centred progress or slip into self-referential abstraction—a Black Box. By uncovering AI’s hidden layers, 『SoTA』 urges us to reflect on the implications of State-of-the-Artificial Intelligence and responsibly guide these systems."
  ],
  "medium": "Multi-Device Web Artwork (4 Displays, 2 Projectors, 1 Mobile, 4 Channel Audio)"
} },
  references: [
  {
    "label": "XD Lab",
    "url": "https://www.xdlab.net/projects/sota"
  },
  {
    "label": "Interactive artwork",
    "url": "https://sota-xdlab.net/"
  }
],
};
