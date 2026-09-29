import type { ArtworkDiscovery } from "./types";

// Derived from the corresponding English artwork record; does not replace terminal copy.
const discovery: ArtworkDiscovery = {
    description: "Explore ≠ (Nonequality) by Jeanyoon Choi: a four-channel interactive web artwork combining AI dialogue, hypertext, and the illogical outcomes of logical systems.",
    aliases: ["Nonequality", "난이퀄리티"],
    topics: ["interactive art", "contemporary web art", "generative AI", "hypertext", "인터랙티브 아트", "웹 아트", "생성형 인공지능", "비논리성"],
    ko: {
      title: "≠ (Nonequality)",
      summary: "최정윤의 『≠ (Nonequality)』(2023)는 세계를 등식만으로 이해할 수 없다는 문제의식에서 출발한 4채널 인터랙티브 멀티 디바이스 웹 아트워크입니다.",
      paragraphs: [
        "작품은 논리적으로 보이는 시스템 안의 비논리성을 탐구합니다. GPT, Stable Diffusion, 음성 합성 등 개별적으로 알고리즘을 따르는 결과들이 함께 작동하면서 분산되고 해체된 전체를 만듭니다.",
        "관객은 QR 코드로 접속한 모바일 웹의 백과사전형 인터페이스에서 파란색 키워드 링크를 선택합니다. 각 선택은 WebSocket을 통해 네 개의 채널에 실시간으로 전달되어 리좀형 데이터베이스, 중첩된 영상, AI 생성 대화와 음성을 변화시킵니다. 반복되는 ‘Ja’는 상호작용이 빨라질수록 ‘Nein’으로 바뀌고, 네 채널의 집합적 혼란은 논리적 체계에서 발생하는 즐거운 비논리성을 드러냅니다."
      ],
      medium: "멀티 디바이스 웹 아트워크: 4채널, 휴대전화 1대"
    }
  };

export default discovery;
