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

    const maxScore = 100; // 100점 만점 기준 환산 점수를 그대로 사용
    const scorePercentage = Math.min(Math.round(score), 100);
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

    // 차트 중앙 텍스트 업데이트 (이상 징후 점수 카운트업 애니메이션)
    const textElement = document.getElementById('chart-center-text');
    if (textElement) {
      const duration = 1200; // 1.2초 동안 진행
      const frameRate = 1000 / 60; // 60 FPS
      const totalFrames = Math.round(duration / frameRate);
      let frame = 0;

      const animateScore = () => {
        frame++;
        const progress = frame / totalFrames;
        // Ease-out-quad 효과 적용
        const easeProgress = progress * (2 - progress);
        const currentValue = Math.round(easeProgress * scorePercentage);

        textElement.innerHTML = `
          <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 700; margin-bottom: 2px; display: block; text-align: center; white-space: nowrap;">이상 징후</span>
          <span class="score-num" style="color: ${color}; font-size: 2.1rem; font-weight: 800; line-height: 1;">${currentValue}점</span>
        `;

        if (frame < totalFrames) {
          requestAnimationFrame(animateScore);
        } else {
          textElement.innerHTML = `
            <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 700; margin-bottom: 2px; display: block; text-align: center; white-space: nowrap;">이상 징후</span>
            <span class="score-num" style="color: ${color}; font-size: 2.1rem; font-weight: 800; line-height: 1;">${scorePercentage}점</span>
          `;
        }
      };

      requestAnimationFrame(animateScore);
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

    // 캡처할 때 저장 버튼 숨기기
    const smallSaveBtn = target.querySelector('#btn-save-current');
    if (smallSaveBtn) smallSaveBtn.style.display = 'none';

    // 캡처 시도 재귀 함수
    const captureAttempt = (useTaint) => {
      html2canvas(target, {
        useCORS: true,
        allowTaint: useTaint,
        scale: 2,
        backgroundColor: '#FFF8F4'
      }).then(canvas => {
        if (smallSaveBtn) smallSaveBtn.style.display = 'flex';
        try {
          const link = document.createElement('a');
          link.download = `cat_health_result_${Date.now()}.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
        } catch (err) {
          console.error("이미지 변환 실패 (useTaint: " + useTaint + "):", err);
          if (useTaint) {
            // file:// 환경에서 캔버스 오염 에러가 발생한 경우, allowTaint를 비활성화하여 재시도
            if (window.location.protocol === 'file:') {
              alert("로컬 파일(file://) 환경에서는 브라우저 보안 정책(CORS)으로 인해 이미지 저장 중 일부 그림(상태 고양이 그림 등)이 제외될 수 있습니다. 웹 서버 환경(http://)에서 진단하시면 완전히 저장하실 수 있습니다.");
            }
            captureAttempt(false);
          } else {
            alert("이미지 저장 중 오류가 발생했습니다. 브라우저 설정을 확인해주세요.");
            saveBtn.disabled = false;
            saveBtn.innerHTML = originalText;
          }
        } finally {
          if (!useTaint) {
            saveBtn.disabled = false;
            saveBtn.innerHTML = originalText;
          }
        }
      }).catch(err => {
        if (smallSaveBtn) smallSaveBtn.style.display = 'flex';
        console.error("html2canvas 실행 실패:", err);
        alert("이미지 변환에 실패했습니다.");
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalText;
      });
    };

    // 1차적으로 true 시도 (일반 웹 서버 환경용)
    captureAttempt(true);
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
