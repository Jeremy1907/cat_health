/**
 * Cat Health Checker Result & Sharing Logic
 */

window.CatResult = {
  chartInstance: null,

  /**
   * Chart.js를 사용한 도넛 차트 렌더링
   * @param {string} canvasId - 캔버스 엘리먼트 ID
   * @param {number} score - 획득한 총점
   * @param {string} color - 위험 등급 색상
   */
  renderChart(canvasId, score, color) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    // 기존 차트가 존재하면 파괴 후 재전송 (재진입 시 방지)
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const maxScore = 25; // MVP 기준 최대 점수
    const scorePercentage = Math.min(Math.round((score / maxScore) * 100), 100);
    const remainingPercentage = 100 - scorePercentage;

    // Chart.js 글로벌 폰트 설정 (Pretendard 적용 목적)
    Chart.defaults.font.family = 'Pretendard, -apple-system, sans-serif';

    this.chartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [scorePercentage, remainingPercentage],
          backgroundColor: [color, '#E2E8F0'], // 등급 색상 & 연회색 배경
          borderWidth: 0,
          cutout: '80%' // 얇은 도넛 형태 구현
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        },
        interaction: { mode: 'none' }
      }
    });

    // 차트 중앙 텍스트 업데이트
    const textElement = document.getElementById('chart-center-text');
    if (textElement) {
      textElement.innerHTML = `<span class="score-num" style="color: ${color}">${score}</span><span class="score-total">/${maxScore}점</span>`;
    }
  },

  /**
   * html2canvas를 사용해 결과 카드 영역을 이미지 파일로 저장
   * @param {string} elementId - 캡처할 타겟 엘리먼트 ID
   */
  saveAsImage(elementId) {
    const target = document.getElementById(elementId);
    if (!target) return;

    // 로딩 인디케이터 표시
    const saveBtn = document.getElementById('btn-save-image');
    const originalText = saveBtn.innerHTML;
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<span class="spinner"></span> 이미지 생성 중...';

    // html2canvas 옵션 설정 (CORS 이슈 대응, scale 향상으로 선명도 확보)
    html2canvas(target, {
      useCORS: true,
      allowTaint: true,
      scale: 2, // 해상도 높임
      backgroundColor: '#FFF8F4' // 기본 배경색 지정
    }).then(canvas => {
      try {
        const link = document.createElement('a');
        link.download = `cat_health_result_${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (err) {
        console.error("이미지 저장 실패:", err);
        alert("이미지 저장 중 오류가 발생했습니다. 브라우저 설정을 확인해주세요.");
      } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalText;
      }
    }).catch(err => {
      console.error("html2canvas 실행 실패:", err);
      alert("이미지 변환에 실패했습니다.");
      saveBtn.disabled = false;
      saveBtn.innerHTML = originalText;
    });
  },

  /**
   * Web Share API 또는 클립보드를 사용해 결과 공유
   * @param {number} score - 위험도 점수
   * @param {string} level - 위험 등급
   */
  shareResult(score, level) {
    const shareTitle = "우리 고양이 건강 자가진단 결과";
    const shareText = `우리 고양이 건강 Checker MVP 진단 결과, 위험도 점수는 ${score}/25점이며 [${level}] 상태입니다. 지금 바로 확인해 보세요!`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      navigator.share({
        title: shareTitle,
        text: shareText,
        url: shareUrl,
      })
      .then(() => console.log('공유 성공'))
      .catch((error) => {
        if (error.name !== 'AbortError') {
          console.error('공유 오류:', error);
          this.fallbackCopyToClipboard(shareText);
        }
      });
    } else {
      this.fallbackCopyToClipboard(shareText);
    }
  },

  /**
   * Web Share 미지원 시 클립보드에 결과 텍스트 복사
   * @param {string} text - 복사할 내용
   */
  fallbackCopyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      alert("결과 텍스트가 클립보드에 복사되었습니다! SNS나 메신저에 공유해 보세요.");
    }).catch(err => {
      console.error('클립보드 복사 실패:', err);
      alert("클립보드 복사에 실패했습니다. 결과를 드래그해서 복사해 주세요.");
    });
  }
};
