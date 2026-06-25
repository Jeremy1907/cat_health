// CORS 방지를 위해 JSON 대신 JS 전역 객체로 질문 데이터를 정의합니다.
window.CAT_QUESTIONS = [
  {
    "id": 1,
    "question": "최근 식사량이 눈에 띄게 줄었거나, 사료를 씹다 흘리거나 냄새만 맡고 돌아서나요?",
    "catPoint": "고양이는 구강 질환(구내염)이 흔해 배가 고파도 사료를 흘리거나 거부합니다.",
    "images": [
      "assets/q1_appetite_none.png",
      "assets/q1_appetite_mild.png",
      "assets/q1_appetite_severe.png"
    ],
    "image": "assets/q1_appetite.png"
  },
  {
    "id": 2,
    "question": "평소에 잘 안 가던 장소(옷장 깊은 곳, 침대 밑 구석)에 숨어서 이름을 불러도 안 나오나요?",
    "catPoint": "영역 동물인 고양이가 숨는 것은 취미가 아니라 몸이 아플 때 자신을 숨기려는 본능입니다.",
    "images": [
      "assets/q2_hiding_none.png",
      "assets/q2_hiding_mild.png",
      "assets/q2_hiding_severe.png"
    ],
    "image": "assets/q2_hiding.png"
  },
  {
    "id": 3,
    "question": "사냥 놀이(낚싯대 등)에 반응이 없거나, 스크래처를 긁는 횟수가 부쩍 줄었나요?",
    "catPoint": "보편적인 무기력을 고양이의 핵심 본능인 '사냥'과 '스크래칭' 행동 감소로 구체화했습니다.",
    "images": [
      "assets/q3_lethargy_none.png",
      "assets/q3_lethargy_mild.png",
      "assets/q3_lethargy_severe.png"
    ],
    "image": "assets/q3_lethargy.png"
  },
  {
    "id": 4,
    "question": "물 먹는 횟수가 부쩍 늘었거나, 감자(소변 덩어리)의 크기가 평소보다 눈에 띄게 커졌나요?",
    "catPoint": "고양이 고질병인 만성 신부전과 당뇨의 핵심 초기 증상(다음/다뇨)을 집사의 언어로 바꿨습니다.",
    "images": [
      "assets/q4_drinking_none.png",
      "assets/q4_drinking_mild.png",
      "assets/q4_drinking_severe.png"
    ],
    "image": "assets/q4_drinking.png"
  },
  {
    "id": 5,
    "question": "화장실을 들락날락하며 울거나 감자(소변)를 전혀 못 만들고, 침대나 이불에 '화장실 테러'를 하나요?",
    "catPoint": "소변볼 때 아프다는 것을 집사에게 알리는 고양이만의 대표적인 요로계 질환 신호입니다.",
    "images": [
      "assets/q5_litter_none.png",
      "assets/q5_litter_mild.png",
      "assets/q5_litter_severe.png"
    ],
    "image": "assets/q5_litter.png"
  },
  {
    "id": 6,
    "question": "특정 부위(배, 다리 등)를 탈모가 올 정도로 집요하게 핥거나, 반대로 그루밍을 아예 안 해서 털이 푸석한가요?",
    "catPoint": "고양이만의 고유 행동인 '그루밍'의 극단적인 변화를 통해 통증과 스트레스를 잡아냅니다.",
    "images": [
      "assets/q6_grooming_none.png",
      "assets/q6_grooming_mild.png",
      "assets/q6_grooming_severe.png"
    ],
    "image": "assets/q6_grooming.png"
  },
  {
    "id": 7,
    "question": "몸을 웅크린 채 평소와 다른 톤으로 낮게 골골송(갸르릉)을 계속 내거나, 만지려 할 때 하악질을 하나요?",
    "catPoint": "너무 아플 때 스스로를 진정시키기 위해 내는 '골골송의 역설'과 고양이의 방어 본능을 엮었습니다.",
    "images": [
      "assets/q7_sensitivity_none.png",
      "assets/q7_sensitivity_mild.png",
      "assets/q7_sensitivity_severe.png"
    ],
    "image": "assets/q7_sensitivity.png"
  },
  {
    "id": 8,
    "question": "식빵 자세를 탄탄하게 못 잡고 옆으로 쓰러지듯 앉거나, 눈을 제대로 못 뜨고 게슴츠레하게 뜨고 있나요?",
    "catPoint": "고양이만의 '식빵 자세' 불량과 고양이 통증 지수의 핵심인 눈 모양을 반영했습니다.",
    "images": [
      "assets/q8_flu_none.png",
      "assets/q8_flu_mild.png",
      "assets/q8_flu_severe.png"
    ],
    "image": "assets/q8_flu.png"
  },
  {
    "id": 9,
    "question": "평소와 달리 입을 벌리고 강아지처럼 혀를 내밀며 '헥헥' 숨을 쉬나요? (개구호흡)",
    "catPoint": "강아지에겐 일상이지만, 고양이에게 개구호흡은 1분 1초를 다투는 치명적인 심폐 응급 신호입니다.",
    "images": [
      "assets/q9_breathing_none.png",
      "assets/q9_breathing_mild.png",
      "assets/q9_breathing_severe.png"
    ],
    "image": "assets/q9_breathing.png"
  },
  {
    "id": 10,
    "question": "캣타워나 소파를 한 번에 뛰어오르지 못하고 엉거주춤 망설이거나, 뒷다리를 절뚝이나요?",
    "catPoint": "고양이 관절염의 대표 증상으로, 수직 이동을 망설이는 고양이 특유의 행동 패턴을 짚었습니다.",
    "images": [
      "assets/q10_joints_none.png",
      "assets/q10_joints_mild.png",
      "assets/q10_joints_severe.png"
    ],
    "image": "assets/q10_joints.png"
  }
];
