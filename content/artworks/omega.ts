import type { Artwork } from "./types";

// Text and imagery curated from the XD Lab record and documented sources.
// Image provenance and secondary-source review: ./SOURCES.md.
export const omega: Artwork = {
  slug: "omega",
  title: "Ω",
  year: "2025",
  menuDescription: "Resistance to algorithmic classification, exemplified by MBTI types",
  width: 960, height: 720,
  creators: ["Jeanyoon Choi"],
  venue: "Design Korea 2025",
  exhibitions: [{ name: "Design Korea 2025" }],
  image: "/artworks/omega/1.webp",
  images: [
    {
      "src": "/artworks/omega/1.webp",
      "alt": "Ω: green image fragments form a twisting vertical trail inside a dark green circular field.",
      "width": 1920,
      "height": 1191,
      "caption": "Green image fragments twist through the disrupted vector space."
    },
    {
      "src": "/artworks/omega/2.webp",
      "alt": "Blue cylindrical field of classified image panels in Ω.",
      "width": 2940,
      "height": 1912,
      "caption": "AI-generated images are arranged within a blue cylindrical vector space."
    },
    {
      "src": "/artworks/omega/3.webp",
      "alt": "Visitors at the Ω installation of four screens arranged in an arc in the exhibition.",
      "width": 1920,
      "height": 1184,
      "caption": "Visitors encounter the four-screen 『Ω』 installation at Design Korea 2025."
    },
    {
      "src": "/artworks/omega/4.webp",
      "alt": "Ω: green fragments and curved forms after the vector space breaks down.",
      "width": 1563,
      "height": 969,
      "caption": "Green fragments break away as the ordered vector space collapses."
    },
    {
      "src": "/artworks/omega/5.webp",
      "alt": "Magenta circular formation of fragmented images in Ω.",
      "width": 2880,
      "height": 1800,
      "caption": "Fragmented images form a magenta circular field."
    },
    {
      "src": "/artworks/omega/6.webp",
      "alt": "Visitor using a phone beside Ω screens showing changing images and text.",
      "width": 1920,
      "height": 1184,
      "caption": "A visitor uses a mobile phone while the surrounding screens change in real time."
    },
    {
      "src": "/artworks/omega/7.webp",
      "alt": "Ω: yellow and red imagery folded through the cylindrical vector space.",
      "width": 1563,
      "height": 969,
      "caption": "Yellow and red image fragments twist through the cylindrical field."
    },
    {
      "src": "/artworks/omega/8.webp",
      "alt": "Ω: green cylindrical vector space composed of many classified image panels.",
      "width": 1563,
      "height": 981,
      "caption": "The classified image panels form a green cylindrical space."
    },
    {
      "src": "/artworks/omega/9.webp",
      "alt": "Visitor looking at four Ω screens displaying blue and green image sequences.",
      "width": 1920,
      "height": 1185,
      "caption": "A visitor faces the four screens as blue and green images shift."
    },
    {
      "src": "/artworks/omega/10.webp",
      "alt": "Ω: cyan fractured fragments breaking away from the vector structure.",
      "width": 1920,
      "height": 1202,
      "caption": "Cyan fragments detach from the vector structure."
    },
    {
      "src": "/artworks/omega/11.webp",
      "alt": "Ω: blue distorted cylindrical structure with camera imagery.",
      "width": 1920,
      "height": 1203,
      "caption": "Live camera imagery disrupts the blue classification space."
    },
    {
      "src": "/artworks/omega/12.webp",
      "alt": "Earlier Ω installation view with two screens showing orange and pink compositions.",
      "width": 1920,
      "height": 1080,
      "caption": "An earlier two-screen installation view of 『Ω』."
    },
    {
      "src": "/artworks/omega/13.webp",
      "alt": "Ω: red fragmented image structure against a dark background.",
      "width": 1563,
      "height": 969,
      "caption": "Red image fragments scatter after the ordered structure breaks."
    },
    {
      "src": "/artworks/omega/14.webp",
      "alt": "Ω: orange cylindrical virtual image space composed of classified media panels.",
      "width": 1920,
      "height": 1203,
      "caption": "Orange image panels construct the initial classification space."
    },
    {
      "src": "/artworks/omega/15.webp",
      "alt": "Visitors facing the Ω installation as the screens show coloured letters.",
      "width": 1920,
      "height": 1185,
      "caption": "Visitors watch the screen sequence change to coloured letters."
    }
  ],
  video: { label: "Watch video ↗", url: "https://www.youtube.com/watch?v=31I_Dk_pgRE" },
  content: { en: {
  "title": "Ω",
  "summary": "『Ω』 is an interactive, multi-device web artwork that critiques the vectorisation of human identity, specifically the MBTI craze in Korea. Initially, the audience engages with a GPT-based MBTI test via mobile, constructing a cylindrical 3D vector space on surrounding screens. However, the experience shifts as phones are accidentally shaken. Realising that these tremors trigger glitches, users actively shake their devices until the ordered system tilts and collapses. This deconstruction captures shaken, low-fidelity images of the audience, overwriting the polished AI simulacrum. 『Ω』 thus acts as a playful disruption, reclaiming undefinable human subjectivity from the panopticon of algorithmic classification.",
  "paragraphs": [
    "『Ω』 is a multi-device web artwork where the audience interacts with a multi-channel installation. After scanning a QR code, the audience engages with a GPT-based questionnaire using their mobile phone. Based on previous responses, the artwork infinitely generates questions with binary choices, trapping the user in the MBTI’s binary system. These responses are evaluated in real-time to produce an MBTI type, displayed across multiple screens. The leftmost screen, for instance, represents the Extrovert/Introvert axis, displaying AI-generated videos symbolising that specific type. These videos form a rotating 3D cylindrical vector space, creating a Three.js-based visual structure evoking a surveillance gaze. The audience remains trapped in the middle of this accelerating, seemingly unescapable panopticon.",
    "An unexpected narrative shift arises not from explicit instruction, but from the implicit nature of human interaction. Even a slight, accidental tremor of the holding hand triggers glitches across all devices. Initially, these subtle changes may be unnoticed. However, as the accidental shaking accumulates, the ordered cylindrical vector space distorts further, becoming impossible to ignore. Realising their physical agency, the audience no longer focuses on the interface to actively shake their mobiles. The further they shake, the larger the distortion becomes. Generative videos detach from the cylinder and float freely in 3D space, resulting in a deconstructivist collapse. Simultaneously, the mobile glitch brutally reveals the underlying code, exposing HTML tags and JavaScript variables, stripped of their protective wrappers.",
    "With each shake, live photographs are captured via the mobile camera, resulting in naturally blurred, shaken images of the audience. These imperfect human faces overwrite the polished, high-fidelity AI imagery within the deconstructed vector space. This interaction symbolises the recovery of an undefinable, imperfect subjectivity against the organised system.",
    "The title, 『Ω』, references the symbol for resistance in electromagnetism. Just as electrical resistance enables a circuit to flow, this work posits that questioning, doubting, and shaking the socio-cultural trend of vectorisation is essential. 『Ω』 aims to critically rethink this process. Through multi-modal interactions and unexpected narrative shifts, the work establishes a space for playful, critical, and resistive discourse on the human-algorithm relationship."
  ],
  "medium": "Multi-Device Web Artwork (4 Displays, 1 Mobile)"
} },
  references: [
  {
    "label": "XD Lab",
    "url": "https://www.xdlab.net/projects/omega"
  }
],
};
