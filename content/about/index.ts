export const menuDescription = "Biography and artistic practice.";

export const explore = {
  introduction: "You can explore my practice through my artworks, research, experiments, projects, and texts:",
  sections: ["artworks", "research", "experiments", "projects", "texts"],
} as const;

export const cvPage = {
  label: "CV",
  description: "Education, teaching, publications, exhibitions, talks, and performances.",
  href: "/oi/cv",
} as const;

export const cvDownload = {
  label: "Download CV ↓",
  description: "Download CV as a PDF.",
  href: "/cv/JeanyoonChoi_CV.pdf",
  download: "JeanyoonChoi_CV.pdf",
} as const;

// Artist identity and bilingual profile copy.
export const profile = {
  name: "Jeanyoon Choi",
  koreanName: "최정윤",
  alternateNames: ["Jean-Yoon Choi"],
  // Scholarly identity profiles (ORCID from the v3 SoTA record; Scholar from content/research).
  identifiers: ["https://orcid.org/0009-0002-9846-3865", "https://scholar.google.com/citations?user=dBBmS0oAAAAJ"],
  en: {
    title: "Jeanyoon Choi — Media Art, Interactive Art & Web Art",
    description: "Jeanyoon Choi is a Korean computational artist and researcher creating multi-device web artworks about the complexity of AI, algorithmic culture, and economic structures.",
    paragraphs: [
      "Jeanyoon Choi (b. 1999) is a Korean computational artist and researcher. He designs and researches multi-device web artworks that reflect the complexity of contemporary socio-technological systems, including AI, algorithmic culture, and economic structures. By interconnecting mobile devices and screens, these artworks create provocatively interactive environments. To develop their conceptual foundations, he draws on art, philosophy, and his scientific background, then uses software engineering and design to translate these ideas into interactive experiences.",
      "He holds a BS in Industrial Engineering from Seoul National University and an MA in Information Experience Design from the Royal College of Art, and is currently a PhD candidate at KAIST's Experience Design Lab (XD Lab). He has also taught Computational Design Practices in the Interaction Design Department at K-Arts (Korea National University of Arts). His work has been exhibited internationally at Ars Electronica, Istanbul Digital Arts Festival, IKLECTIK London, Centre Culturel Coréen, and KAIST Art Museum. His papers have been published in the proceedings of ACM DIS and in the Leonardo journal (MIT Press), and he has served as an academic reviewer for ACM TEI, NeurIPS Creative AI, and Digital Creativity.",
    ],
    topics: ["media art", "interactive art", "media art research", "contemporary web art", "net art", "web art researcher", "computational art", "web art", "multi-device web artworks", "interconnectivity", "complexity"],
  },
  ko: {
    title: "최정윤 (Jeanyoon Choi) — 미디어 아트 · 인터랙티브 아트 · 웹 아트",
    description: "최정윤(Jeanyoon Choi)은 한국의 컴퓨테이셔널 아티스트이자 연구자입니다. AI, 알고리즘 문화, 경제 구조 등 동시대 사회기술 시스템의 복잡성을 멀티 디바이스 웹 아트워크로 탐구합니다.",
    paragraphs: [
      "최정윤(Jeanyoon Choi, 1999년생)은 한국의 컴퓨테이셔널 아티스트이자 연구자입니다. AI, 알고리즘 문화, 경제 구조 등 동시대 사회기술 시스템의 복잡성을 반영하는 멀티 디바이스 웹 아트워크를 기획하고 연구합니다. 모바일 기기와 스크린을 서로 연결해 도발적인 인터랙티브 환경을 만듭니다. 이를 위해 예술, 철학, 과학적 배경을 결합해 작품의 개념적 토대를 세우고, 소프트웨어 공학과 디자인 접근법으로 이를 인터랙티브 경험으로 구현합니다.",
      "서울대학교에서 산업공학 학사, 영국 왕립예술학교(Royal College of Art)에서 정보경험디자인 석사 학위를 받았으며, 현재 KAIST 경험디자인연구실(XD Lab) 박사과정에 있습니다. 한국예술종합학교 인터랙션디자인과에서 컴퓨테이셔널 디자인 실습을 강의했습니다. 작품은 아르스 일렉트로니카, 이스탄불 디지털 아트 페스티벌, 런던 IKLECTIK, 프랑스 한국문화원, KAIST 미술관 등에서 전시되었습니다. 논문은 ACM DIS와 MIT Press의 Leonardo 저널에 게재되었고, ACM TEI, NeurIPS Creative AI, Digital Creativity의 학술 심사위원으로 활동했습니다.",
    ],
    topics: ["미디어 아트", "인터랙티브 아트", "미디어 아트 연구", "컨템포러리 웹 아트", "넷 아트", "웹 아트 연구자", "컴퓨테이셔널 아트", "웹 아트", "멀티 디바이스 웹 아트워크", "상호연결성", "복잡성"],
  },
};
