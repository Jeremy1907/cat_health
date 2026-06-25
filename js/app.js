/**
 * Cat Health Checker MVP Main Application Logic
 * Direct self-diagnosis flow without login or cat registration features.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    currentScreen: 'main-screen',
    answers: Array(10).fill(null), // 10 questions, values: 0/1/2
    currentQuestionIndex: 0,
    uploadedImages: [], // array of { file, objectUrl }
    totalScore: 0,
    riskAssessment: null
  };

  // DOM Elements
  const screens = {
    main: document.getElementById('main-screen'),
    checklist: document.getElementById('checklist-screen'),
    upload: document.getElementById('upload-screen'),
    loading: document.getElementById('loading-screen'),
    result: document.getElementById('result-screen')
  };

  const progressBar = document.getElementById('progress-bar');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  
  // File Upload Elements
  const fileInput = document.getElementById('file-input');
  const uploadArea = document.getElementById('upload-area');
  const previewContainer = document.getElementById('preview-container');
  const btnSubmit = document.getElementById('btn-submit');
  
  // Start Button
  const btnStart = document.getElementById('btn-start');

  // Initialize App
  init();

  function init() {
    setupEventListeners();
    renderHistoryList();
    showScreen('main-screen');
  }

  // Setup Global Event Listeners
  function setupEventListeners() {
    // 1) Start Self Diagnosis directly
    if (btnStart) {
      btnStart.addEventListener('click', () => {
        resetState();
        showScreen('checklist-screen');
        renderQuestion();
      });
    }

    // Load Diagnosis from History List (Delegation)
    const historyList = document.getElementById('history-list');
    if (historyList) {
      historyList.addEventListener('click', (e) => {
        const btn = e.target.closest('.history-item-btn');
        if (!btn) return;
        const historyId = btn.dataset.id;
        loadDiagnosisFromHistory(historyId);
      });
    }

    // Save Current Diagnosis button click
    const btnSaveCurrent = document.getElementById('btn-save-current');
    if (btnSaveCurrent) {
      btnSaveCurrent.addEventListener('click', () => {
        saveCurrentDiagnosisToHistory();
      });
    }

    // Option Buttons in Checklist (Delegated)
    const optionsWrapper = document.getElementById('options-wrapper');
    if (optionsWrapper) {
      optionsWrapper.addEventListener('click', (e) => {
        const btn = e.target.closest('.option-btn');
        if (!btn) return;

        const scoreValue = parseInt(btn.dataset.value, 10);
        state.answers[state.currentQuestionIndex] = scoreValue;

        // Highlight selected option
        document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');

        // Enable next button when an option is selected
        btnNext.disabled = false;
      });
    }

    // Checklist Navigation: Prev
    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        if (state.currentQuestionIndex > 0) {
          state.currentQuestionIndex--;
          renderQuestion();
        } else {
          showScreen('main-screen');
        }
      });
    }

    // Checklist Navigation: Next
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        if (state.currentQuestionIndex < 9) {
          state.currentQuestionIndex++;
          renderQuestion();
        } else {
          showScreen('upload-screen');
        }
      });
    }

    // File Input trigger for images
    if (uploadArea) {
      uploadArea.addEventListener('click', () => fileInput.click());

      // File drag and drop support
      uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--primary)';
        uploadArea.style.backgroundColor = 'var(--primary-light)';
      });

      uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = 'rgba(255, 122, 89, 0.3)';
        uploadArea.style.backgroundColor = 'var(--white)';
      });

      uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'rgba(255, 122, 89, 0.3)';
        uploadArea.style.backgroundColor = 'var(--white)';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
          handleImageFiles(files);
        }
      });
    }

    // File change handler
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const files = e.target.files;
        if (files.length > 0) {
          handleImageFiles(files);
        }
      });
    }

    // Upload Screen Navigation: Prev
    const btnUploadPrev = document.getElementById('btn-upload-prev');
    if (btnUploadPrev) {
      btnUploadPrev.addEventListener('click', () => {
        state.currentQuestionIndex = 9;
        showScreen('checklist-screen');
        renderQuestion();
      });
    }

    // Submit for Results
    if (btnSubmit) {
      btnSubmit.addEventListener('click', () => {
        runAiMatchingFlow();
      });
    }



    // Save Image Button
    const btnSaveImage = document.getElementById('btn-save-image');
    if (btnSaveImage) {
      btnSaveImage.addEventListener('click', () => {
        window.CatResult.saveAsImage('result-card');
      });
    }

    // Share Button
    const btnShare = document.getElementById('btn-share');
    if (btnShare) {
      btnShare.addEventListener('click', () => {
        window.CatResult.shareResult(state.totalScore, state.riskAssessment.level);
      });
    }

    // Restart Button
    const btnRestart = document.getElementById('btn-restart');
    if (btnRestart) {
      btnRestart.addEventListener('click', () => {
        showScreen('main-screen');
        resetState();
      });
    }
  }

  // State Resetter
  function resetState() {
    state.answers = Array(10).fill(null);
    state.currentQuestionIndex = 0;
    
    // Revoke and clear images
    clearUploadedImageUrls();
    
    state.totalScore = 0;
    state.riskAssessment = null;

    // Reset input DOM elements
    if (fileInput) fileInput.value = '';
    
    const previewGrid = document.getElementById('image-preview-grid');
    if (previewGrid) previewGrid.innerHTML = '';
    if (previewContainer) previewContainer.classList.remove('active');
    
    // Reset receipt elements
    const receiptImagesGrid = document.getElementById('receipt-images-grid');
    if (receiptImagesGrid) receiptImagesGrid.innerHTML = '';
    
    const receiptImagesSection = document.getElementById('receipt-images-section');
    if (receiptImagesSection) receiptImagesSection.style.display = 'none';
    
    const receiptImagesDivider = document.getElementById('receipt-images-divider');
    if (receiptImagesDivider) receiptImagesDivider.style.display = 'none';

    // Reset receipt catpoints
    const receiptCatpointsList = document.getElementById('receipt-catpoints-list');
    if (receiptCatpointsList) receiptCatpointsList.innerHTML = '';

    if (btnSubmit) {
      btnSubmit.innerHTML = '<span style="text-align: center; line-height: 1.3;">건강 분석 결과 보기<br><span style="font-size: 0.85rem; font-weight: 600; opacity: 0.9;">(사진 없이 진행)</span></span>';
      btnSubmit.classList.replace('btn-primary', 'btn-secondary');
    }
  }

  // SPA Screen Toggle & Progress Bar Update
  function showScreen(screenId) {
    state.currentScreen = screenId;
    
    // Toggle active classes
    Object.keys(screens).forEach(key => {
      const el = screens[key];
      if (el.id === screenId) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    // Update Progress Bar
    let progress = 0;
    if (screenId === 'main-screen') {
      progress = 0;
    } else if (screenId === 'checklist-screen') {
      progress = 10 + ((state.currentQuestionIndex + 1) / 10) * 70;
    } else if (screenId === 'upload-screen') {
      progress = 90;
    } else if (screenId === 'loading-screen') {
      progress = 95;
    } else if (screenId === 'result-screen') {
      progress = 100;
    }
    progressBar.style.width = `${progress}%`;
    
    // Scroll window to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Render question text & options dynamically
  function renderQuestion() {
    const question = window.CAT_QUESTIONS[state.currentQuestionIndex];
    if (!question) return;

    // Render texts
    document.getElementById('q-progress').innerText = `질문 ${state.currentQuestionIndex + 1} / 10`;
    document.getElementById('q-text').innerText = question.question;

    // Render Cat Point
    const catPointContainer = document.getElementById('q-catpoint-container');
    const catPointText = document.getElementById('q-catpoint');
    if (catPointContainer && catPointText) {
      if (question.catPoint) {
        catPointText.innerText = question.catPoint;
        catPointContainer.style.display = 'block';
      } else {
        catPointContainer.style.display = 'none';
      }
    }

    // Clear and build options
    const optionsWrapper = document.getElementById('options-wrapper');
    optionsWrapper.innerHTML = '';

    const options = [
      { text: '없음', value: 0, badgeText: '양호', badgeClass: 'badge-none' },
      { text: '약간 있음', value: 1, badgeText: '주의', badgeClass: 'badge-mild' },
      { text: '자주 있음', value: 2, badgeText: '심각', badgeClass: 'badge-severe' }
    ];

    const currentAnswer = state.answers[state.currentQuestionIndex];

    options.forEach(opt => {
      const button = document.createElement('button');
      button.className = 'option-btn option-btn-with-img';
      if (currentAnswer === opt.value) {
        button.classList.add('selected');
      }
      button.dataset.value = opt.value;
      
      // Render standard PNG image directly (disable SVG icons)
      const questionId = state.currentQuestionIndex + 1;
      let imageUrl = 'assets/status_none.png';
      if (question.images && Array.isArray(question.images) && question.images[opt.value]) {
        imageUrl = question.images[opt.value];
      } else if (question.image) {
        imageUrl = question.image;
      }
      const visualContent = `<img src="${imageUrl}" class="option-img" alt="${opt.text}">`;
      
      const statusClassMap = {
        0: 'status-none',
        1: 'status-mild',
        2: 'status-severe'
      };
      
      button.innerHTML = `
        <div class="option-btn-content">
          <div class="img-container ${statusClassMap[opt.value]}">
            ${visualContent}
            <span class="option-badge ${opt.badgeClass}">${opt.badgeText}</span>
          </div>
          <span class="option-txt">${opt.text}</span>
        </div>
      `;
      optionsWrapper.appendChild(button);
    });

    // Enable/Disable next navigation button based on answer selection
    btnNext.disabled = (currentAnswer === null);
  }

  // Handle uploaded image files
  function handleImageFiles(files) {
    if (!files || files.length === 0) return;

    const validFiles = [];
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB limit per file

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        alert("이미지 파일만 업로드할 수 있습니다.");
        continue;
      }
      if (file.size > MAX_SIZE) {
        alert(`파일 크기가 너무 큽니다: ${file.name} (최대 10MB)`);
        continue;
      }
      validFiles.push(file);
    }

    if (state.uploadedImages.length + validFiles.length > 4) {
      alert("최대 4장의 사진만 업로드할 수 있습니다.");
      return;
    }

    validFiles.forEach(file => {
      const objectUrl = URL.createObjectURL(file);
      state.uploadedImages.push({ file, objectUrl });
    });

    renderImagePreviews();
    updateSubmitButtonText();
  }

  // Render Image Previews in Upload Screen
  function renderImagePreviews() {
    const previewGrid = document.getElementById('image-preview-grid');
    const uploadCount = document.getElementById('upload-count');

    if (!previewGrid || !previewContainer || !uploadCount) return;

    previewGrid.innerHTML = '';

    if (state.uploadedImages.length > 0) {
      previewContainer.classList.add('active');
      uploadCount.innerText = state.uploadedImages.length;

      state.uploadedImages.forEach((imgObj, index) => {
        const item = document.createElement('div');
        item.className = 'image-preview-item';

        const img = document.createElement('img');
        img.src = imgObj.objectUrl;
        img.alt = `Cat Photo ${index + 1}`;

        const removeBtn = document.createElement('button');
        removeBtn.className = 'btn-remove-image';
        removeBtn.innerHTML = '&times;';
        removeBtn.dataset.index = index;
        
        removeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          removeUploadedImage(index);
        });

        item.appendChild(img);
        item.appendChild(removeBtn);
        previewGrid.appendChild(item);
      });
    } else {
      previewContainer.classList.remove('active');
      uploadCount.innerText = '0';
    }
  }

  // Remove individual image
  function removeUploadedImage(index) {
    const removed = state.uploadedImages.splice(index, 1)[0];
    if (removed && removed.objectUrl) {
      URL.revokeObjectURL(removed.objectUrl);
    }
    renderImagePreviews();
    updateSubmitButtonText();
  }

  // Update Next/Submit Button text based on image count
  function updateSubmitButtonText() {
    if (btnSubmit) {
      if (state.uploadedImages.length > 0) {
        btnSubmit.innerHTML = '건강 분석 결과 보기';
        btnSubmit.classList.replace('btn-secondary', 'btn-primary');
      } else {
        btnSubmit.innerHTML = '<span style="text-align: center; line-height: 1.3;">건강 분석 결과 보기<br><span style="font-size: 0.85rem; font-weight: 600; opacity: 0.9;">(사진 없이 진행)</span></span>';
        btnSubmit.classList.replace('btn-primary', 'btn-secondary');
      }
    }
  }

  // Clear all uploaded image Object URLs
  function clearUploadedImageUrls() {
    state.uploadedImages.forEach(item => {
      if (item.objectUrl) {
        URL.revokeObjectURL(item.objectUrl);
      }
    });
    state.uploadedImages = [];
  }

  // Run the 3-second AI matching flow before showing results
  function runAiMatchingFlow() {
    showScreen('loading-screen');
    
    const progressFill = document.getElementById('loading-progress-fill');
    const percentText = document.getElementById('loading-percent');
    
    const duration = 3000; // 3 seconds
    const intervalTime = 30; // 30ms updates
    let elapsed = 0;
    
    if (progressFill) progressFill.style.width = '0%';
    if (percentText) percentText.innerText = '0';
    
    const interval = setInterval(() => {
      elapsed += intervalTime;
      const percent = Math.min(Math.round((elapsed / duration) * 100), 100);
      
      if (progressFill) progressFill.style.width = `${percent}%`;
      if (percentText) percentText.innerText = percent;
      
      if (elapsed >= duration) {
        clearInterval(interval);
        calculateAndShowResults();
      }
    }, intervalTime);
  }

  // Calculate scores and switch to result screen
  function calculateAndShowResults() {
    const behaviorScore = window.CatScoring.calculateBehaviorScore(state.answers);
    const totalScore = window.CatScoring.calculateTotalScore(behaviorScore);

    state.totalScore = totalScore;
    
    // Determine risk levels
    const assessment = window.CatScoring.getRiskAssessment(totalScore, state.answers);
    state.riskAssessment = assessment;

    // 1) Update Receipt Date/Time
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const dateEl = document.getElementById('receipt-date');
    if (dateEl) dateEl.innerText = formattedDate;

    // 2) Update Detail Scores
    const behaviorScoreEl = document.getElementById('receipt-behavior-score');
    if (behaviorScoreEl) behaviorScoreEl.innerText = `${behaviorScore} / 28`;

    // 3) Update Symptoms Summary List
    const symptomsListEl = document.getElementById('receipt-symptoms-list');
    const symptomKeywords = [
      "식욕 저하 (식사량 감소 및 거부)",
      "소외 행동 (구석에 숨음)",
      "활력 저하 (놀이/스크래칭 감소)",
      "음수량 급증 (소변 크기 증가)",
      "배변 습관 변화 (화장실 테러)",
      "그루밍 이상 (핥기/털 푸석함)",
      "이상 발성/예민 (골골송/하악질)",
      "식빵 자세 불량 (눈 게슴츠레 뜸)",
      "개구호흡 (입 벌리고 가쁜 숨)",
      "보행 이상 (수직 이동 망설임)"
    ];
    
    if (symptomsListEl) {
      symptomsListEl.innerHTML = '';
      
      let checkedCount = 0;
      state.answers.forEach((ans, idx) => {
        if (ans === 1 || ans === 2) {
          checkedCount++;
          const item = document.createElement('div');
          item.className = 'symptom-item';
          
          const statusClass = ans === 1 ? 'mild' : 'severe';
          const statusText = ans === 1 ? '약간 있음' : '자주 있음';
          
          item.innerHTML = `
            <span class="symptom-name">#${idx + 1} ${symptomKeywords[idx]}</span>
            <span class="symptom-status ${statusClass}">${statusText}</span>
          `;
          symptomsListEl.appendChild(item);
        }
      });
      
      if (checkedCount === 0) {
        symptomsListEl.innerHTML = '<div class="symptom-item empty-symptoms">🐾 감지된 특이 증상 없음 (양호)</div>';
      }
    }

    // 3.5) Update Cat Points Section inside the Scoring Section (score 1 or 2)
    const catpointsListEl = document.getElementById('receipt-catpoints-list');
    renderCatPoints(state.answers, catpointsListEl);

    // 4) Render receipt images
    const receiptImagesSection = document.getElementById('receipt-images-section');
    const receiptImagesDivider = document.getElementById('receipt-images-divider');
    const receiptImagesGrid = document.getElementById('receipt-images-grid');
    
    if (receiptImagesGrid && receiptImagesSection && receiptImagesDivider) {
      receiptImagesGrid.innerHTML = '';
      if (state.uploadedImages.length > 0) {
        state.uploadedImages.forEach((imgObj, idx) => {
          const gridItem = document.createElement('div');
          gridItem.className = 'receipt-image-item';
          
          const img = document.createElement('img');
          img.src = imgObj.objectUrl;
          img.alt = `Cat Photo ${idx + 1}`;
          
          gridItem.appendChild(img);
          receiptImagesGrid.appendChild(gridItem);
        });
        receiptImagesSection.style.display = 'flex';
        receiptImagesDivider.style.display = 'block';
      } else {
        receiptImagesSection.style.display = 'none';
        receiptImagesDivider.style.display = 'none';
      }
    }

    // Update Common Result UI Elements
    const riskBadge = document.getElementById('risk-badge');
    if (riskBadge) {
      riskBadge.innerText = assessment.level;
      riskBadge.className = `risk-level-badge ${assessment.textClass}`;
    }
    
    document.getElementById('result-summary-desc').innerText = assessment.description;
    
    const catImgEl = document.getElementById('result-cat-img');
    if (catImgEl) {
      catImgEl.src = assessment.image || 'assets/cat_status_1.png';
    }
    
    const adviceEl = document.getElementById('result-advice-content');
    if (adviceEl) {
      adviceEl.innerText = assessment.advice;
    }

    // Enable/reset the save button for manual saving
    const saveBtn = document.getElementById('btn-save-current');
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.innerHTML = '💾 저장';
    }

    // Switch screen to result
    showScreen('result-screen');
  }

  // Compress and resize image to prevent localStorage quota issues
  function compressImage(file, maxWidth = 300, maxHeight = 300) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.6));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  // Save current diagnosis results
  function saveCurrentDiagnosisToHistory() {
    const saveBtn = document.getElementById('btn-save-current');
    if (!saveBtn || saveBtn.disabled) return;

    // Show saving status
    const originalText = saveBtn.innerHTML;
    saveBtn.disabled = true;
    saveBtn.innerHTML = '💾 저장 중...';

    // Compress images first
    const compressionPromises = state.uploadedImages.map(imgObj => {
      if (imgObj.file) {
        return compressImage(imgObj.file);
      } else {
        return Promise.resolve(imgObj.objectUrl);
      }
    });

    Promise.all(compressionPromises).then(base64Images => {
      const dateEl = document.getElementById('receipt-date');
      const formattedDate = dateEl ? dateEl.innerText : new Date().toLocaleString();
      const behaviorScore = window.CatScoring.calculateBehaviorScore(state.answers);

      const uniqueId = 'diag_' + Date.now();
      const diagnosisData = {
        id: uniqueId,
        date: formattedDate,
        answers: [...state.answers],
        behaviorScore: behaviorScore,
        totalScore: state.totalScore,
        riskAssessment: state.riskAssessment,
        images: base64Images
      };

      let history = [];
      try {
        const rawHistory = localStorage.getItem('cat_diagnosis_history');
        if (rawHistory) {
          history = JSON.parse(rawHistory);
        }
      } catch (e) {
        console.error('Failed to parse history:', e);
      }

      // Check if duplicate based on exact date
      const isDuplicate = history.some(item => item.date === formattedDate);
      if (!isDuplicate) {
        history.unshift(diagnosisData);
        if (history.length > 5) {
          history = history.slice(0, 5);
        }
        localStorage.setItem('cat_diagnosis_history', JSON.stringify(history));
      }

      // Update button state
      saveBtn.innerHTML = '✓ 저장됨';
      saveBtn.disabled = true;

      // Refresh list
      renderHistoryList();
      alert("진단 결과가 최근 기록에 저장되었습니다!");
    }).catch(err => {
      console.error('Failed to save diagnosis:', err);
      alert("저장 중 오류가 발생했습니다.");
      saveBtn.disabled = false;
      saveBtn.innerHTML = originalText;
    });
  }

  // Load previous diagnosis result from localStorage
  function loadDiagnosisFromHistory(historyId) {
    let history = [];
    try {
      const rawHistory = localStorage.getItem('cat_diagnosis_history');
      if (rawHistory) {
        history = JSON.parse(rawHistory);
      }
    } catch (e) {
      console.error('Failed to parse history:', e);
    }

    const item = history.find(d => d.id === historyId);
    if (!item) {
      alert("해당 진단 기록을 찾을 수 없습니다.");
      return;
    }

    try {
      // Reset current state and load past state
      resetState();
      
      state.answers = item.answers;
      state.totalScore = item.totalScore;
      state.riskAssessment = item.riskAssessment;
      state.uploadedImages = item.images.map(b64 => ({ file: null, objectUrl: b64 }));

      // Render Loaded Results on Receipt Card
      // 1) Date
      const dateEl = document.getElementById('receipt-date');
      if (dateEl) dateEl.innerText = item.date;

      // 2) Score
      const behaviorScoreEl = document.getElementById('receipt-behavior-score');
      if (behaviorScoreEl) behaviorScoreEl.innerText = `${item.behaviorScore} / 28`;

      // 3) Symptoms summary
      const symptomsListEl = document.getElementById('receipt-symptoms-list');
      const symptomKeywords = [
        "식욕 저하 (식사량 감소 및 거부)",
        "소외 행동 (구석에 숨음)",
        "활력 저하 (놀이/스크래칭 감소)",
        "음수량 급증 (소변 크기 증가)",
        "배변 습관 변화 (화장실 테러)",
        "그루밍 이상 (핥기/털 푸석함)",
        "이상 발성/예민 (골골송/하악질)",
        "식빵 자세 불량 (눈 게슴츠레 뜸)",
        "개구호흡 (입 벌리고 가쁜 숨)",
        "보행 이상 (수직 이동 망설임)"
      ];
      if (symptomsListEl) {
        symptomsListEl.innerHTML = '';
        
        let checkedCount = 0;
        state.answers.forEach((ans, idx) => {
          if (ans === 1 || ans === 2) {
            checkedCount++;
            const item = document.createElement('div');
            item.className = 'symptom-item';
            
            const statusClass = ans === 1 ? 'mild' : 'severe';
            const statusText = ans === 1 ? '약간 있음' : '자주 있음';
            
            item.innerHTML = `
              <span class="symptom-name">#${idx + 1} ${symptomKeywords[idx]}</span>
              <span class="symptom-status ${statusClass}">${statusText}</span>
            `;
            symptomsListEl.appendChild(item);
          }
        });
        
        if (checkedCount === 0) {
          symptomsListEl.innerHTML = '<div class="symptom-item empty-symptoms">🐾 감지된 특이 증상 없음 (양호)</div>';
        }
      }

      // 3.5) Update Cat Points Section inside the Scoring Section (score 1 or 2)
      const catpointsListEl = document.getElementById('receipt-catpoints-list');
      renderCatPoints(item.answers, catpointsListEl);

      // 4) Images Grid
      const receiptImagesSection = document.getElementById('receipt-images-section');
      const receiptImagesDivider = document.getElementById('receipt-images-divider');
      const receiptImagesGrid = document.getElementById('receipt-images-grid');
      
      if (receiptImagesGrid && receiptImagesSection && receiptImagesDivider) {
        receiptImagesGrid.innerHTML = '';
        if (state.uploadedImages.length > 0) {
          state.uploadedImages.forEach((imgObj, idx) => {
            const gridItem = document.createElement('div');
            gridItem.className = 'receipt-image-item';
            
            const img = document.createElement('img');
            img.src = imgObj.objectUrl;
            img.alt = `Cat Photo ${idx + 1}`;
            
            gridItem.appendChild(img);
            receiptImagesGrid.appendChild(gridItem);
          });
          receiptImagesSection.style.display = 'flex';
          receiptImagesDivider.style.display = 'block';
        } else {
          receiptImagesSection.style.display = 'none';
          receiptImagesDivider.style.display = 'none';
        }
      }

      // 5) Update Badges & Texts
      const riskBadge = document.getElementById('risk-badge');
      if (riskBadge) {
        riskBadge.innerText = item.riskAssessment.level;
        riskBadge.className = `risk-level-badge ${item.riskAssessment.textClass}`;
      }
      document.getElementById('result-summary-desc').innerText = item.riskAssessment.description;
      
      const catImgEl = document.getElementById('result-cat-img');
      if (catImgEl) {
        catImgEl.src = item.riskAssessment.image || 'assets/cat_status_1.png';
      }
      
      const adviceEl = document.getElementById('result-advice-content');
      if (adviceEl) {
        adviceEl.innerText = item.riskAssessment.advice;
      }

      // 6) Set save button as saved & disabled since it is loaded from history
      const saveBtn = document.getElementById('btn-save-current');
      if (saveBtn) {
        saveBtn.innerHTML = '✓ 저장됨';
        saveBtn.disabled = true;
      }

      // Show Result screen
      showScreen('result-screen');

      alert("이전 간이 진단 결과를 성공적으로 불러왔습니다!");
    } catch (err) {
      console.error("Failed to load diagnosis:", err);
      alert("진단 결과를 불러오는 중 오류가 발생했습니다.");
    }
  }

  // Render history list on main screen
  function renderHistoryList() {
    const historyListEl = document.getElementById('history-list');
    const historySectionEl = document.getElementById('history-section');
    if (!historyListEl || !historySectionEl) return;

    let history = [];
    try {
      const rawHistory = localStorage.getItem('cat_diagnosis_history');
      if (rawHistory) {
        history = JSON.parse(rawHistory);
      }
    } catch (e) {
      console.error('Failed to load history list:', e);
    }

    if (history.length > 0) {
      historySectionEl.style.display = 'block';
      historyListEl.innerHTML = '';
      history.forEach(item => {
        const btn = document.createElement('button');
        btn.className = 'history-item-btn';
        btn.dataset.id = item.id;
        
        // 과거 데이터 대응 및 고양이 이미지 매핑
        const catImgUrl = (item.riskAssessment && item.riskAssessment.image) ? item.riskAssessment.image : 'assets/cat_status_1.png';
        
        btn.innerHTML = `
          <div style="display: flex; align-items: center; gap: 12px; width: 100%;">
            <div style="width: 36px; height: 36px; border-radius: 50%; overflow: hidden; background-color: #F7FAFC; border: 1px solid #E2E8F0; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);">
              <img src="${catImgUrl}" alt="진단 결과 고양이" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <span style="font-weight: 700; color: var(--text-dark); font-size: 0.88rem;">📅 ${item.date}</span>
            <span style="margin-left: auto; font-size: 0.78rem; font-weight: 700; color: var(--primary);">상세보기 ➔</span>
          </div>
        `;
        historyListEl.appendChild(btn);
      });
    } else {
      historySectionEl.style.display = 'none';
    }
  }

  // Render cat points grouped by severity and toggled with accordion
  function renderCatPoints(answers, catpointsListEl) {
    if (!catpointsListEl) return;
    catpointsListEl.innerHTML = '';

    const criticalIndices = [3, 4, 7, 8]; // 초응급 질문 (4, 5, 8, 9번)
    const itemsData = [];

    answers.forEach((ans, idx) => {
      if (ans === 1 || ans === 2) {
        const question = window.CAT_QUESTIONS[idx];
        let severity = 0;
        
        // 4단계 위급도 매김 (높을수록 위험)
        if (criticalIndices.includes(idx)) {
          severity = ans === 2 ? 4 : 2; // 초응급 자주 있음: 4, 초응급 약간 있음: 2
        } else {
          severity = ans === 2 ? 3 : 1; // 일반 자주 있음: 3, 일반 약간 있음: 1
        }
        
        itemsData.push({
          idx,
          ans,
          question,
          severity
        });
      }
    });

    if (itemsData.length === 0) return;

    // 가장 높은 위급도 탐색
    const maxSeverity = Math.max(...itemsData.map(item => item.severity));

    const visibleItems = itemsData.filter(item => item.severity === maxSeverity);
    const hiddenItems = itemsData.filter(item => item.severity < maxSeverity);

    // 가장 위급한 아이템 출력
    visibleItems.forEach(data => {
      const item = document.createElement('div');
      const statusClass = data.ans === 1 ? 'mild' : 'severe';
      item.className = `catpoint-item ${statusClass}`;
      item.innerHTML = `
        <span class="catpoint-item-title">Q${data.idx + 1}. ${data.question.question}</span>
        <p class="catpoint-item-text">🐾 ${data.question.catPoint}</p>
      `;
      catpointsListEl.appendChild(item);
    });

    // 덜 위급한 아이템이 있다면 더보기 버튼 및 아코디언 추가
    if (hiddenItems.length > 0) {
      const moreBtn = document.createElement('button');
      moreBtn.className = 'receipt-catpoints-more-btn';
      moreBtn.innerHTML = `<span>▼ 다른 관찰 사항 더보기 (${hiddenItems.length}개)</span>`;
      
      const hiddenWrapper = document.createElement('div');
      hiddenWrapper.className = 'receipt-catpoints-hidden-wrapper';
      
      hiddenItems.forEach(data => {
        const item = document.createElement('div');
        const statusClass = data.ans === 1 ? 'mild' : 'severe';
        item.className = `catpoint-item ${statusClass}`;
        item.innerHTML = `
          <span class="catpoint-item-title">Q${data.idx + 1}. ${data.question.question}</span>
          <p class="catpoint-item-text">🐾 ${data.question.catPoint}</p>
        `;
        hiddenWrapper.appendChild(item);
      });
      
      moreBtn.addEventListener('click', () => {
        const isExpanded = hiddenWrapper.classList.toggle('active');
        moreBtn.classList.toggle('active');
        if (isExpanded) {
          moreBtn.innerHTML = `<span>▲ 다른 관찰 사항 접기</span>`;
        } else {
          moreBtn.innerHTML = `<span>▼ 다른 관찰 사항 더보기 (${hiddenItems.length}개)</span>`;
        }
      });
      
      catpointsListEl.appendChild(moreBtn);
      catpointsListEl.appendChild(hiddenWrapper);
    }
  }

});
