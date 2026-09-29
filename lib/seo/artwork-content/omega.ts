import type { ArtworkDiscovery } from "./types";

// Derived from the corresponding English artwork record; does not replace terminal copy.
const discovery: ArtworkDiscovery = {
    description: "Explore Ω (Omega) by Jeanyoon Choi: an interactive web installation where shaking a phone disrupts MBTI classification and algorithmic representations of identity.",
    aliases: ["Omega", "오메가"],
    topics: ["interactive art", "contemporary web art", "MBTI", "algorithmic identity", "인터랙티브 아트", "웹 아트", "알고리즘 분류", "정체성"],
    ko: {
      title: "Ω (오메가)",
      summary: "최정윤의 『Ω』(2025)는 MBTI를 비롯해 인간의 정체성을 벡터와 유형으로 환원하는 알고리즘적 분류를 비판하는 인터랙티브 멀티 디바이스 웹 아트워크입니다.",
      paragraphs: [
        "관객은 QR 코드를 스캔하고 휴대전화에서 GPT 기반의 이분법적 질문에 답합니다. 응답으로 계산된 MBTI 유형과 AI 생성 영상은 주변 네 개의 스크린에서 회전하는 원통형 3차원 벡터 공간을 구성합니다.",
        "휴대전화를 쥔 손의 미세한 흔들림이 모든 기기에 글리치를 일으킵니다. 관객이 더 적극적으로 흔들수록 원통의 질서가 무너지고 영상이 흩어집니다. 동시에 휴대전화 카메라가 포착한 흔들리고 흐릿한 관객의 얼굴이 매끈한 AI 이미지를 덮어씁니다. 전기 저항의 기호인 Ω를 제목으로 삼은 작품은 분류 체계에 대한 의심과 신체적 저항을 통해 규정할 수 없는 인간의 주체성을 탐구합니다."
      ],
      medium: "멀티 디바이스 웹 아트워크: 디스플레이 4대, 휴대전화 1대"
    }
  };

export default discovery;
