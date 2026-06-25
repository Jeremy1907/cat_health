/**
 * Cat Health Checker Scoring Logic
 * 향후 AI 분석 API 도입 시 점수 계산 로직을 유연하게 교체할 수 있도록 설계되었습니다.
 */

window.CatScoring = {
  /**
   * 행동 질문 체크리스트 점수 계산
   * @param {Array<number>} answers - 각 질문별 답변 점수 배열 (0, 1, 2)
   * @returns {number} 행동 점수 합계 (최대 28점)
   */
  calculateBehaviorScore(answers) {
    if (!answers || !Array.isArray(answers)) return 0;
    
    // 일반 증상 인덱스: 1, 2, 3, 6, 7, 10번 -> 0, 1, 2, 5, 6, 9
    // 초응급 증상 인덱스: 4, 5, 8, 9번 -> 3, 4, 7, 8
    const normalIndices = [0, 1, 2, 5, 6, 9];
    const criticalIndices = [3, 4, 7, 8];
    
    let rawScore = 0;
    
    answers.forEach((score, idx) => {
      const val = Number(score) || 0;
      if (normalIndices.includes(idx)) {
        rawScore += val; // 없음: 0, 약간: 1, 심함: 2
      } else if (criticalIndices.includes(idx)) {
        rawScore += val * 2; // 없음: 0, 약간: 2, 심함: 4
      }
    });
    
    return rawScore;
  },

  /**
   * 전체 총점 계산
   * @param {number} behaviorScore - 행동 점수 (원시 점수)
   * @returns {number} 100점 만점 기준 환산 점수
   */
  calculateTotalScore(behaviorScore) {
    return Math.min(Math.round(behaviorScore * 3.57), 100);
  },

  /**
   * 위험도 판별 기준 정보 획득
   * @param {number} totalScore - 100점 환산 총합 점수
   * @param {Array<number>} answers - 질문별 답변 배열 (0, 1, 2)
   * @returns {object} { level: string, color: string, description: string, advice: string }
   */
  getRiskAssessment(totalScore, answers) {
    if (!answers || !Array.isArray(answers)) {
      return {
        level: "정상 범위",
        color: "#2F855A",
        lightColor: "#C6F6D5",
        textClass: "risk-normal",
        description: "현재 고양이의 건상 상태는 정상적인 범주에 속해 보입니다. 주기적인 관찰과 예방 접종을 유지하며 평화로운 일상을 즐기세요!",
        advice: "",
        image: "assets/cat_status_1.png"
      };
    }

    // 일반 증상 인덱스: 1, 2, 3, 6, 7, 10번 -> 0, 1, 2, 5, 6, 9
    // 초응급 증상 인덱스: 4, 5, 8, 9번 -> 3, 4, 7, 8
    const normalIndices = [0, 1, 2, 5, 6, 9];
    const criticalIndices = [3, 4, 7, 8];

    // 조건 확인
    const hasCriticalSevere = criticalIndices.some(idx => answers[idx] === 2); // 5)
    const hasNormalSevere = normalIndices.some(idx => answers[idx] === 2);    // 4)
    const hasCriticalMild = criticalIndices.some(idx => answers[idx] === 1);  // 3)
    const hasNormalMild = normalIndices.some(idx => answers[idx] === 1);      // 2)

    if (hasCriticalSevere) {
      return {
        level: "빠른 병원 방문 권장",
        color: "#E53E3E", // 빨간색 (Red)
        lightColor: "#FED7D7",
        textClass: "risk-critical",
        description: "고양이에게서 위급한 증상이 포착되었습니다! 즉시 가까운 동물병원에 방문하여 수의사의 진료를 받으세요!",
        advice: "",
        image: "assets/cat_status_5.png"
      };
    } else if (hasNormalSevere) {
      return {
        level: "병원 상담 권장",
        color: "#DD6B20", // 주황색 (Orange)
        lightColor: "#FEEBC8",
        textClass: "risk-danger",
        description: "고양이에게서 이상 행동이 확인되었습니다. 질병의 신호일 수 있습니다. 가까운 동물병원에 방문하여 수의사와 전문 상담을 받아보는 것을 권장합니다.",
        advice: "",
        image: "assets/cat_status_4.png"
      };
    } else if (hasCriticalMild) {
      return {
        level: "관찰 필요",
        color: "#D69E2E", // 노란색/금색 (Yellow/Gold)
        lightColor: "#FEFCBF",
        textClass: "risk-warn",
        description: "고양이에게서 걱정스러운 행동 변화가 포착되었습니다. 식사량, 활동성, 배변 상태 등을 평소보다 면밀히 기록하고 주의를 기울여 주세요.",
        advice: "",
        image: "assets/cat_status_3.png"
      };
    } else if (hasNormalMild) {
      return {
        level: "관찰 필요",
        color: "#D69E2E", // 노란색/금색 (Yellow/Gold)
        lightColor: "#FEFCBF",
        textClass: "risk-warn",
        description: "고양이에게서 약간의 행동 변화가 포착되었습니다. 스트레스나 초기 증상일 수 있습니다. 지속적인 관찰이 필요합니다.",
        advice: "",
        image: "assets/cat_status_2.png"
      };
    } else {
      // 1) 모두 없음
      return {
        level: "정상 범위",
        color: "#2F855A", // 짙은 초록 (Green)
        lightColor: "#C6F6D5",
        textClass: "risk-normal",
        description: "현재 고양이의 건상 상태는 정상적인 범주에 속해 보입니다. 주기적인 관찰과 예방 접종을 유지하며 평화로운 일상을 즐기세요!",
        advice: "",
        image: "assets/cat_status_1.png"
      };
    }
  }
};
