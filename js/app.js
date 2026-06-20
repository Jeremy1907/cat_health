/**
 * Cat Health Checker MVP Main Application Logic
 * Integrates unique IDs, member registration, canvas image compression, ID retrieval with mock AI image matching.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    currentScreen: 'main-screen',
    catId: null,      // 발급받은 고유 ID (#123456 형식)
    catName: null,    // 고양이 이름
    ownerName: null,  // 반려인 이름
    catPhoto: null,   // 압축된 고양이 사진 (Base64 Data URL)
    findCatPhoto: null, // ID 찾기 시 업로드한 임시 사진 Base64
    answers: Array(10).fill(null), // 10 questions, values: 0/1/2
    currentQuestionIndex: 0,
    isVideoUploaded: false,
    videoFile: null,
    totalScore: 0,
    riskAssessment: null
  };

  // DOM Elements
  const screens = {
    main: document.getElementById('main-screen'),
    registration: document.getElementById('registration-screen'),
    findId: document.getElementById('find-id-screen'),
    checklist: document.getElementById('checklist-screen'),
    upload: document.getElementById('upload-screen'),
    result: document.getElementById('result-screen')
  };

  const progressBar = document.getElementById('progress-bar');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  
  // Video Elements
  const fileInput = document.getElementById('file-input');
  const uploadArea = document.getElementById('upload-area');
  const previewContainer = document.getElementById('preview-container');
  const previewVideo = document.getElementById('preview-video');
  const videoNameText = document.getElementById('video-name');
  const videoSizeText = document.getElementById('video-size');
  const btnSubmit = document.getElementById('btn-submit');
  
  // Registration & Login Elements
  const loginIdInput = document.getElementById('login-id-input');
  const btnLoginSubmit = document.getElementById('btn-login-submit');
  const btnGoToFindId = document.getElementById('btn-go-to-find-id');
  
  const ownerNameInput = document.getElementById('owner-name-input');
  const regCatNameInput = document.getElementById('reg-cat-name-input');
  const btnSelectPhoto = document.getElementById('btn-select-photo');
  const photoFileInput = document.getElementById('photo-file-input');
  const photoPreviewBox = document.getElementById('photo-preview-box');
  const photoPlaceholder = document.getElementById('photo-preview-placeholder');
  const btnRegSubmit = document.getElementById('btn-reg-submit');
  
  // Find ID Elements
  const findOwnerNameInput = document.getElementById('find-owner-name-input');
  const findCatNameInput = document.getElementById('find-cat-name-input');
  const btnFindSelectPhoto = document.getElementById('btn-find-select-photo');
  const findPhotoFileInput = document.getElementById('find-photo-file-input');
  const findPhotoPreviewBox = document.getElementById('find-photo-preview-box');
  const findPhotoPlaceholder = document.getElementById('find-photo-preview-placeholder');
  const btnFindIdSubmit = document.getElementById('btn-find-id-submit');
  const findIdLoadingBox = document.getElementById('find-id-loading-box');
  const findIdResultBox = document.getElementById('find-id-result-box');
  const findIdMatchNotice = document.getElementById('find-id-match-notice');
  const foundIdDisplay = document.getElementById('found-id-display');
  const btnCopyFoundId = document.getElementById('btn-copy-found-id');

  // Modal Elements
  const idModalOverlay = document.getElementById('id-modal-overlay');
  const issuedIdDisplay = document.getElementById('issued-id-display');
  const btnCopyId = document.getElementById('btn-copy-id');
  const btnModalClose = document.getElementById('btn-modal-close');

  // Initialize App
  init();

  function init() {
    setupEventListeners();
    showScreen('main-screen');
  }

  // Setup Global Event Listeners
  function setupEventListeners() {
    // 1) Go to Registration Screen
    document.getElementById('btn-go-to-reg').addEventListener('click', () => {
      resetState();
      showScreen('registration-screen');
    });

    // 2) Go back from Registration Screen
    document.getElementById('btn-reg-back').addEventListener('click', () => {
      showScreen('main-screen');
    });

    // 2.5) Go to Find ID Screen
    btnGoToFindId.addEventListener('click', () => {
      resetState();
      showScreen('find-id-screen');
    });

    // 2.6) Go back from Find ID Screen
    document.getElementById('btn-find-id-back').addEventListener('click', () => {
      showScreen('main-screen');
    });

    // 3) Photo Selector Event (Registration)
    btnSelectPhoto.addEventListener('click', () => photoFileInput.click());
    photoFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        if (!file.type.startsWith('image/')) {
          alert('이미지 파일만 선택할 수 있습니다.');
          return;
        }
        compressImage(file, (base64Url) => {
          state.catPhoto = base64Url;
          photoPreviewBox.style.backgroundImage = `url(${base64Url})`;
          photoPlaceholder.style.display = 'none';
        });
      }
    });

    // 3.5) Photo Selector Event (Find ID)
    btnFindSelectPhoto.addEventListener('click', () => findPhotoFileInput.click());
    findPhotoFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        if (!file.type.startsWith('image/')) {
          alert('이미지 파일만 선택할 수 있습니다.');
          return;
        }
        compressImage(file, (base64Url) => {
          state.findCatPhoto = base64Url;
          findPhotoPreviewBox.style.backgroundImage = `url(${base64Url})`;
          findPhotoPlaceholder.style.display = 'none';
        });
      }
    });

    // 4) Registration Form Submission
    btnRegSubmit.addEventListener('click', () => {
      const ownerVal = ownerNameInput.value.trim();
      const catVal = regCatNameInput.value.trim();

      if (!ownerVal || !catVal) {
        alert("반려인 이름과 고양이 이름은 필수 항목입니다!");
        return;
      }

      // 사진 미등록 시 최종 확인 컨펌 창 팝업
      if (!state.catPhoto) {
        const confirmStart = confirm("고양이 사진 등록 없이 분석을 시작하시겠습니까?\n\n※ 사진이 등록되지 않으면 추후 고유 ID를 분실했을 때 ID 찾기 기능 이용이 완전히 불가능합니다.");
        if (!confirmStart) {
          return; // 취소 클릭 시 등록 화면 유지
        }
      }

      // Generate unique ID
      const newId = generateUniqueId();
      state.catId = newId;
      state.catName = catVal;
      state.ownerName = ownerVal;

      // Save Profile in LocalStorage
      const profile = {
        id: newId,
        catName: catVal,
        ownerName: ownerVal,
        catPhoto: state.catPhoto
      };

      try {
        localStorage.setItem(`cat_profile_${newId}`, JSON.stringify(profile));
        
        // Show Issued ID Modal
        issuedIdDisplay.innerText = newId;
        idModalOverlay.style.display = 'flex';
      } catch (err) {
        console.error("고양이 등록 실패:", err);
        alert("브라우저 저장 공간이 가득 찼습니다. 캐시를 지우거나 다른 이미지를 등록해 주세요.");
      }
    });

    // 4.5) Find ID Form Submission (With mock AI face matching)
    btnFindIdSubmit.addEventListener('click', () => {
      const findOwner = findOwnerNameInput.value.trim();
      const findCat = findCatNameInput.value.trim();

      if (!findOwner || !findCat) {
        alert("반려인 이름과 고양이 이름을 모두 입력해 주세요!");
        return;
      }

      if (!state.findCatPhoto) {
        alert("고양이 대조를 위해 사진 등록을 완료해 주세요!");
        return;
      }

      // Search matching profile in LocalStorage
      let foundProfile = null;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('cat_profile_')) {
          try {
            const profile = JSON.parse(localStorage.getItem(key));
            if (profile.ownerName === findOwner && profile.catName === findCat) {
              foundProfile = profile;
              break;
            }
          } catch (e) {
            // Ignore corrupted keys
          }
        }
      }

      if (!foundProfile) {
        findIdResultBox.style.display = 'none';
        alert("일치하는 고양이 등록 정보를 찾을 수 없습니다. 이름과 닉네임을 확인해 주세요.");
        return;
      }

      // Hide result box and show loader animation for simulation
      findIdResultBox.style.display = 'none';
      findIdLoadingBox.style.display = 'flex';
      btnFindIdSubmit.disabled = true;

      // Simulate 2 seconds AI features extraction delay
      setTimeout(() => {
        findIdLoadingBox.style.display = 'none';
        btnFindIdSubmit.disabled = false;

        // Render Found result
        if (foundProfile.catPhoto) {
          // Both photos exist, mock AI success matching
          findIdMatchNotice.innerHTML = `🔍 <strong>이전 고양이 사진과 특징점 대조 분석 결과</strong><br><span style="color: var(--normal);">일치율 98.4%로 동일 고양이임이 최종 확인되었습니다!</span>`;
          foundIdDisplay.innerText = foundProfile.id;
          findIdResultBox.style.display = 'flex';
        } else {
          // Original profile had no photo
          alert("해당 계정은 최초 등록 시 고양이 사진을 등록하지 않아, 보안 정책상 사진 대조 및 ID 찾기가 불가능합니다.");
          findIdResultBox.style.display = 'none';
        }
      }, 2000);
    });

    // 4.6) Copy found ID
    btnCopyFoundId.addEventListener('click', () => {
      const text = foundIdDisplay.innerText;
      navigator.clipboard.writeText(text).then(() => {
        alert(`ID가 복사되었습니다: ${text}\n첫 화면의 로그인 입력란에 입력해 주세요.`);
      }).catch(() => {
        alert(`ID 복사 실패: ${text}`);
      });
    });

    // 5) Modal buttons: Copy ID
    btnCopyId.addEventListener('click', () => {
      if (state.catId) {
        navigator.clipboard.writeText(state.catId).then(() => {
          alert(`ID가 복사되었습니다: ${state.catId}\n로그인 시 사용해 주세요.`);
        }).catch(err => {
          alert(`복사 실패. ID를 직접 기록해 주세요: ${state.catId}`);
        });
      }
    });

    // 6) Modal buttons: Close Modal and Start Test
    btnModalClose.addEventListener('click', () => {
      idModalOverlay.style.display = 'none';
      state.answers = Array(10).fill(null);
      state.currentQuestionIndex = 0;
      showScreen('checklist-screen');
      renderQuestion();
    });

    // 7) ID Login Handler
    btnLoginSubmit.addEventListener('click', () => {
      let enteredId = loginIdInput.value.trim();
      if (!enteredId) {
        alert("ID를 입력해 주세요!");
        return;
      }

      // Normalize format (Always prefix with #)
      if (!enteredId.startsWith('#')) {
        enteredId = '#' + enteredId;
      }

      // Validate format
      if (!/^#\d{6}$/.test(enteredId)) {
        alert("올바르지 않은 ID 형식입니다. (# + 6자리 숫자)");
        return;
      }

      // Load Profile
      const storedProfile = localStorage.getItem(`cat_profile_${enteredId}`);
      if (!storedProfile) {
        alert("등록되지 않은 ID입니다. 고유 번호를 확인해 주세요.");
        return;
      }

      try {
        const profile = JSON.parse(storedProfile);
        resetState(); // Clear temporary answers, files, etc.
        
        // Set logged in profile state
        state.catId = profile.id;
        state.catName = profile.catName;
        state.ownerName = profile.ownerName;
        state.catPhoto = profile.catPhoto;

        // Auto-fill login field for convenience
        loginIdInput.value = enteredId;

        // Transition to checklist
        showScreen('checklist-screen');
        renderQuestion();
      } catch (err) {
        console.error("로그인 로드 실패:", err);
        alert("고양이 정보를 불러오는 도중 오류가 발생했습니다.");
      }
    });

    // 8) Start Without Registration (Guest mode)
    document.getElementById('btn-start-no-reg').addEventListener('click', () => {
      resetState();
      state.catId = null;
      state.catName = null;
      state.ownerName = null;
      state.catPhoto = null;

      showScreen('checklist-screen');
      renderQuestion();
    });

    // Option Buttons in Checklist (Delegated)
    document.getElementById('options-wrapper').addEventListener('click', (e) => {
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

    // Checklist Navigation: Prev
    btnPrev.addEventListener('click', () => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex--;
        renderQuestion();
      } else {
        showScreen('main-screen');
      }
    });

    // Checklist Navigation: Next
    btnNext.addEventListener('click', () => {
      if (state.currentQuestionIndex < 9) {
        state.currentQuestionIndex++;
        renderQuestion();
      } else {
        showScreen('upload-screen');
      }
    });

    // File Input trigger for video
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
        handleVideoFile(files[0]);
      }
    });

    // File change handler
    fileInput.addEventListener('change', (e) => {
      const files = e.target.files;
      if (files.length > 0) {
        handleVideoFile(files[0]);
      }
    });

    // Upload Screen Navigation: Prev
    document.getElementById('btn-upload-prev').addEventListener('click', () => {
      state.currentQuestionIndex = 9;
      showScreen('checklist-screen');
      renderQuestion();
    });

    // Submit for Results
    btnSubmit.addEventListener('click', () => {
      calculateAndShowResults();
    });

    // Save Image Button
    document.getElementById('btn-save-image').addEventListener('click', () => {
      window.CatResult.saveAsImage('result-card');
    });

    // Share Button
    document.getElementById('btn-share').addEventListener('click', () => {
      window.CatResult.shareResult(state.totalScore, state.riskAssessment.level);
    });

    // Restart Button
    document.getElementById('btn-restart').addEventListener('click', () => {
      showScreen('main-screen');
      resetState();
    });
  }

  // State Resetter
  function resetState() {
    state.answers = Array(10).fill(null);
    state.currentQuestionIndex = 0;
    state.isVideoUploaded = false;
    state.videoFile = null;
    state.totalScore = 0;
    state.riskAssessment = null;
    state.findCatPhoto = null;

    // Reset input text values
    const catInput = document.getElementById('cat-name-input');
    if (catInput) catInput.value = '';
    
    loginIdInput.value = '';
    ownerNameInput.value = '';
    regCatNameInput.value = '';
    photoFileInput.value = '';
    
    // Find ID inputs
    if (findOwnerNameInput) findOwnerNameInput.value = '';
    if (findCatNameInput) findCatNameInput.value = '';
    if (findPhotoFileInput) findPhotoFileInput.value = '';

    // Reset Photo previews
    photoPreviewBox.style.backgroundImage = 'none';
    photoPlaceholder.style.display = 'block';
    
    if (findPhotoPreviewBox) findPhotoPreviewBox.style.backgroundImage = 'none';
    if (findPhotoPlaceholder) findPhotoPlaceholder.style.display = 'block';

    // Hide retrieval boxes
    if (findIdLoadingBox) findIdLoadingBox.style.display = 'none';
    if (findIdResultBox) findIdResultBox.style.display = 'none';

    // Reset video input DOM elements
    fileInput.value = '';
    previewVideo.src = '';
    previewContainer.classList.remove('active');
    btnSubmit.innerText = '건강 분석 결과 보기 (영상 없이 진행)';
    btnSubmit.classList.replace('btn-primary', 'btn-secondary');
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
    if (screenId === 'registration-screen') {
      progress = 8;
    } else if (screenId === 'find-id-screen') {
      progress = 8;
    } else if (screenId === 'checklist-screen') {
      progress = 15 + ((state.currentQuestionIndex + 1) / 10) * 60;
    } else if (screenId === 'upload-screen') {
      progress = 85;
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
    document.getElementById('q-desc').innerText = question.description;

    // Clear and build options
    const optionsWrapper = document.getElementById('options-wrapper');
    optionsWrapper.innerHTML = '';

    const options = [
      { text: '없음', value: 0 },
      { text: '약간 있음', value: 1 },
      { text: '자주 있음', value: 2 }
    ];

    const currentAnswer = state.answers[state.currentQuestionIndex];

    options.forEach(opt => {
      const button = document.createElement('button');
      button.className = 'option-btn';
      if (currentAnswer === opt.value) {
        button.classList.add('selected');
      }
      button.dataset.value = opt.value;
      button.innerHTML = `<span>${opt.text}</span>`;
      optionsWrapper.appendChild(button);
    });

    // Enable/Disable next navigation button based on answer selection
    btnNext.disabled = (currentAnswer === null);
  }

  // Handle uploaded video file and validate constraints (Max 10s, Max 50MB)
  function handleVideoFile(file) {
    if (!file) return;

    // Check File Mime type
    if (!file.type.startsWith('video/')) {
      alert("비디오 파일만 업로드할 수 있습니다.");
      return;
    }

    // Constraint: 1. Max Size (50MB)
    const MAX_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      alert("영상 크기가 너무 큽니다. 최대 50MB 이내의 영상만 가능합니다.");
      return;
    }

    // Constraint: 2. Max Duration (10s)
    const videoUrl = URL.createObjectURL(file);
    const tempVideo = document.createElement('video');
    tempVideo.preload = 'metadata';
    tempVideo.src = videoUrl;

    const originalSubmitText = btnSubmit.innerText;
    btnSubmit.disabled = true;
    btnSubmit.innerHTML = '<span class="spinner"></span> 영상 확인 중...';

    tempVideo.onloadedmetadata = function() {
      URL.revokeObjectURL(videoUrl);
      const duration = tempVideo.duration;

      if (duration > 10.5) {
        alert("영상 길이가 10초를 초과합니다. 10초 이내의 영상만 업로드해 주세요.");
        fileInput.value = '';
        state.isVideoUploaded = false;
        state.videoFile = null;
        previewContainer.classList.remove('active');
        btnSubmit.disabled = false;
        btnSubmit.innerText = '건강 분석 결과 보기 (영상 없이 진행)';
        btnSubmit.classList.replace('btn-primary', 'btn-secondary');
      } else {
        state.videoFile = file;
        state.isVideoUploaded = true;

        videoNameText.innerText = file.name;
        videoSizeText.innerText = `${(file.size / (1024 * 1024)).toFixed(2)} MB (${Math.round(duration)}초)`;

        previewVideo.src = URL.createObjectURL(file);
        previewContainer.classList.add('active');

        btnSubmit.disabled = false;
        btnSubmit.innerText = '건강 분석 결과 보기';
        btnSubmit.classList.replace('btn-secondary', 'btn-primary');
      }
    };

    tempVideo.onerror = function() {
      URL.revokeObjectURL(videoUrl);
      alert("비디오 메타데이터를 불러오지 못했습니다. 다른 동영상 포맷을 시도해 주세요.");
      btnSubmit.disabled = false;
      btnSubmit.innerText = '건강 분석 결과 보기 (영상 없이 진행)';
    };
  }

  // Calculate scores and switch to result screen
  function calculateAndShowResults() {
    const behaviorScore = window.CatScoring.calculateBehaviorScore(state.answers);
    const videoScore = window.CatScoring.calculateVideoScore(state.isVideoUploaded);
    const totalScore = window.CatScoring.calculateTotalScore(behaviorScore, videoScore);

    state.totalScore = totalScore;
    
    // Determine risk levels
    const assessment = window.CatScoring.getRiskAssessment(totalScore);
    state.riskAssessment = assessment;

    // Toggle Profile Card & Save History Conditionally based on Cat Registration
    const profileCard = document.getElementById('result-profile-card');
    const historySection = document.getElementById('history-section');
    const historyPromoSection = document.getElementById('history-promo-section');
    const resultCatTitle = document.getElementById('result-cat-name-title');

    if (state.catId) {
      if (profileCard) {
        profileCard.style.display = 'flex';
        
        document.getElementById('result-profile-name').innerText = state.catName;
        document.getElementById('result-profile-owner').innerText = `반려인: ${state.ownerName}`;
        document.getElementById('result-profile-id').innerText = `등록 ID: ${state.catId}`;
        
        const profileImg = document.getElementById('result-profile-img');
        if (state.catPhoto) {
          profileImg.style.backgroundImage = `url(${state.catPhoto})`;
          profileImg.innerHTML = '';
        } else {
          profileImg.style.backgroundImage = 'none';
          profileImg.innerHTML = '🐱';
          profileImg.style.display = 'flex';
          profileImg.style.justifyContent = 'center';
          profileImg.style.alignItems = 'center';
          profileImg.style.fontSize = '1.3rem';
        }
      }

      if (resultCatTitle) resultCatTitle.innerText = `${state.catName}의`;
      
      if (historySection) historySection.style.display = 'block';
      if (historyPromoSection) historyPromoSection.style.display = 'none';

      const titleLabel = document.getElementById('history-title-label');
      if (titleLabel) {
        titleLabel.innerText = `${state.catName}의 지난 건강 측정 내역 (최근 5회)`;
      }

      saveHistory(totalScore, assessment.level, state.catId);
    } else {
      if (profileCard) profileCard.style.display = 'none';
      if (resultCatTitle) resultCatTitle.innerText = '';
      
      if (historySection) historySection.style.display = 'none';
      if (historyPromoSection) historyPromoSection.style.display = 'block';
    }

    // Update Common Result UI Elements
    document.getElementById('risk-badge').innerText = assessment.level;
    document.getElementById('risk-badge').className = `risk-level-badge ${assessment.textClass}`;
    
    document.getElementById('result-summary-desc').innerText = assessment.description;
    document.getElementById('result-advice-content').innerText = assessment.advice;
    
    const videoNotice = document.getElementById('video-score-notice');
    if (state.isVideoUploaded) {
      videoNotice.innerText = "+ 영상 분석 점수 5점이 반영되었습니다.";
      videoNotice.style.display = 'block';
    } else {
      videoNotice.style.display = 'none';
    }

    // Switch screen to result
    showScreen('result-screen');

    // Render chart
    setTimeout(() => {
      window.CatResult.renderChart('result-chart', totalScore, assessment.color);
    }, 120);
  }

  // Save diagnostic to localStorage based on unique ID
  function saveHistory(score, level, catId) {
    if (!catId) return;
    try {
      const newRecord = {
        date: new Date().toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        score: score,
        level: level
      };

      const storageKey = `cat_health_history_${catId}`;
      let history = JSON.parse(localStorage.getItem(storageKey) || '[]');
      history.unshift(newRecord);
      history = history.slice(0, 5); // Limit 5 items
      localStorage.setItem(storageKey, JSON.stringify(history));

      renderHistoryList(history);
    } catch (err) {
      console.warn("로컬스토리지를 사용할 수 없습니다:", err);
    }
  }

  // Render history list from array
  function renderHistoryList(history) {
    const listContainer = document.getElementById('history-list');
    if (!listContainer) return;

    listContainer.innerHTML = '';
    
    if (history.length <= 1) {
      listContainer.innerHTML = '<div class="text-center" style="font-size:0.85rem;color:var(--text-muted);padding:10px 0;">이전 측정 기록이 없습니다.</div>';
      return;
    }

    history.slice(1).forEach(record => {
      const item = document.createElement('div');
      item.style.display = 'flex';
      item.style.justify = 'space-between';
      item.style.padding = '8px 0';
      item.style.fontSize = '0.85rem';
      item.style.borderBottom = '1px dashed #E2E8F0';

      const dateSpan = document.createElement('span');
      dateSpan.innerText = record.date;
      dateSpan.style.color = 'var(--text-muted)';

      const scoreSpan = document.createElement('span');
      scoreSpan.innerHTML = `<strong>${record.score}점</strong> (${record.level})`;
      
      let color = 'var(--text-dark)';
      if (record.level === '정상 범위') color = 'var(--normal)';
      else if (record.level === '관찰 필요') color = 'var(--warn)';
      else if (record.level === '병원 상담 권장') color = 'var(--danger)';
      else if (record.level === '빠른 병원 방문 권장') color = 'var(--critical)';
      scoreSpan.style.color = color;

      item.appendChild(dateSpan);
      item.appendChild(scoreSpan);
      listContainer.appendChild(item);
    });
  }

  // IMAGE COMPRESSION UTILITY: Resizes to 150x150 square for safe LocalStorage storage size (approx 10KB)
  function compressImage(file, callback) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const TARGET_SIZE = 150;
        
        let width = img.width;
        let height = img.height;
        const cropSize = Math.min(width, height);
        
        canvas.width = TARGET_SIZE;
        canvas.height = TARGET_SIZE;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(
          img,
          (width - cropSize) / 2,
          (height - cropSize) / 2,
          cropSize,
          cropSize,
          0,
          0,
          TARGET_SIZE,
          TARGET_SIZE
        );
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        callback(dataUrl);
      };
    };
  }

  // ID GENERATOR: Produces '#xxxxxx' format, verifying unique profile in local storage
  function generateUniqueId() {
    let attempts = 0;
    while (attempts < 1000) {
      const numStr = Math.floor(100000 + Math.random() * 900000).toString();
      const checkId = '#' + numStr;
      if (!localStorage.getItem(`cat_profile_${checkId}`)) {
        return checkId;
      }
      attempts++;
    }
    return '#' + Date.now().toString().slice(-6);
  }
});
