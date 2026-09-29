import type { ArtworkDiscovery } from "./types";

// Derived from the corresponding English artwork record; does not replace terminal copy.
const discovery: ArtworkDiscovery = {
    description: "Explore SoTA, a collaborative interactive web artwork by Jeanyoon Choi and XD Lab collaborators: 118 neural networks, explainable AI, and installation photography.",
    aliases: ["State-of-the-Art", "소타"],
    topics: ["interactive art", "web artwork", "explainable AI", "neural network visualization", "인터랙티브 아트", "웹 아트", "설명 가능한 인공지능", "신경망 시각화"],
    ko: {
      title: "SoTA (소타)",
      summary: "『SoTA』(2024)는 최정윤과 공동 제작자들이 인공지능의 구조와 인간의 이해 사이의 관계를 탐구하는 인터랙티브 멀티 디바이스 웹 아트워크입니다. 관객은 휴대전화로 118개 신경망 구조의 3차원 시각화를 탐색합니다.",
      paragraphs: [
        "작품의 프런트엔드에서는 관객의 휴대전화와 여러 디스플레이 및 프로젝터가 연결되어 신경망의 구조를 표현합니다. 이는 인간의 인지를 모방하던 초기 AI 구조와 재현적 미술의 관계를 드러냅니다.",
        "관객이 상호작용을 멈추고 사이트를 떠나면 화면들은 LLM 토큰 간 유사성을 추상적으로 표현하는 혼란스러운 흑백 패턴으로 전환됩니다. 이 백엔드는 인간이 이해할 수 있는 구조에서 거대한 계산 중심의 추상성으로 향하는 AI의 변화를 보여줍니다. 작품은 설명 가능한 인공지능(XAI)을 매개로, AI가 인간 중심의 진보를 향하는지 아니면 자기 지시적인 블랙박스로 향하는지를 질문합니다."
      ],
      medium: "멀티 디바이스 웹 아트워크: 디스플레이 4대, 프로젝터 2대, 휴대전화 1대, 4채널 오디오"
    }
  };

export default discovery;
