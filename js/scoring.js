/**
 * Cat Health Checker Scoring Logic
 * 향후 AI 분석 API 도입 시 점수 계산 로직을 유연하게 교체할 수 있도록 설계되었습니다.
 */

window.CatScoring = {
  /**
   * 행동 질문 체크리스트 점수 계산
   * @param {Array<number>} answers - 각 질문별 답변 점수 배열 (0, 1, 2)
   * @returns {number} 행동 점수 합계 (최대 20점)
   */
  calculateBehaviorScore(answers) {
    if (!answers || !Array.isArray(answers)) return 0;
    return answers.reduce((sum, score) => sum + (Number(score) || 0), 0);
  },

  /**
   * 영상 업로드 점수 계산 (AI 미적용 MVP 버전)
   * MVP: 영상 업로드 여부만 판별하여 완료 시 5점 부여.
   * 향후: AI API 연동 후 분석된 확률 값(0~100)을 가중치로 환산하여 반영할 수 있도록 확장 가능.
   * @param {boolean} isVideoUploaded - 비디오 파일 업로드 완료 여부
   * @param {object} [aiAnalysisResult] - 향후 AI 분석 결과 전달용 (예: { normalProbability: 0.2, abnormalProbability: 0.8 })
   * @returns {number} 영상 점수 (MVP: 0 또는 5점)
   */
  calculateVideoScore(isVideoUploaded, aiAnalysisResult = null) {
    // 향후 AI 분석 API가 활성화되었을 경우의 예시 로직
    if (aiAnalysisResult && typeof aiAnalysisResult.abnormalProbability === 'number') {
      // 이상행동 확률에 비례해 최대 10점 혹은 15점 등 부여하는 방식으로 확장 가능
      return Math.round(aiAnalysisResult.abnormalProbability * 10); 
    }

    // 현재 MVP 버전: 단순 업로드 성공 시 5점 가산
    return isVideoUploaded ? 5 : 0;
  },

  /**
   * 전체 총점 계산
   * @param {number} behaviorScore - 행동 점수
   * @param {number} videoScore - 비디오 점수
   * @returns {number} 총합 점수
   */
  calculateTotalScore(behaviorScore, videoScore) {
    return behaviorScore + videoScore;
  },

  /**
   * 위험도 판별 기준 정보 획득
   * @param {number} totalScore - 총합 점수
   * @returns {object} { level: string, color: string, description: string, advice: string }
   */
  getRiskAssessment(totalScore) {
    if (totalScore >= 0 && totalScore <= 7) {
      return {
        level: "정상 범위",
        color: "#2F855A", // 짙은 초록 (Green)
        lightColor: "#C6F6D5",
        textClass: "risk-normal",
        description: "현재 고양이의 건강 상태는 정상적인 범주에 속해 보입니다.",
        advice: "주기적인 관찰과 예방 접종을 유지하며 평화로운 일상을 즐기세요!"
      };
    } else if (totalScore >= 8 && totalScore <= 14) {
      return {
        level: "관찰 필요",
        color: "#D69E2E", // 노란색/금색 (Yellow/Gold)
        lightColor: "#FEFCBF",
        textClass: "risk-warn",
        description: "약간의 행동 변화가 포착되었습니다. 스트레스나 초기 증상일 수 있습니다.",
        advice: "식사량, 활동성, 배변 상태 등을 평소보다 면밀히 기록하고 주의를 기울여 주세요."
      };
    } else if (totalScore >= 15 && totalScore <= 25) {
      return {
        level: "병원 상담 권장",
        color: "#DD6B20", // 주황색 (Orange)
        lightColor: "#FEEBC8",
        textClass: "risk-danger",
        description: "이상 행동이 다수 확인되었습니다. 질병의 신호일 수 있습니다.",
        advice: "가까운 동물병원에 방문하여 수의사와의 전문 상담을 받아보는 것을 권장합니다."
      };
    } else {
      // 26점 이상 (향후 고득점 가능성 고려)
      return {
        level: "빠른 병원 방문 권장",
        color: "#E53E3E", // 빨간색 (Red)
        lightColor: "#FED7D7",
        textClass: "risk-critical",
        description: "심각한 이상 증상이나 중대한 변화가 관찰되었습니다.",
        advice: "지체하지 말고 즉시 가까운 24시간 동물병원 혹은 전문 동물병원에 내원하시기 바랍니다."
      };
    }
  }
};
