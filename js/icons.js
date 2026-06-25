/**
 * Cat Health Checker Choice Vector Icons
 * Custom flat premium SVG illustrations matching the symptom intensity for each question.
 */
window.CAT_ICONS = {
  // Q1: Appetite (식사량 변동)
  1: {
    0: `<svg viewBox="0 0 24 24" class="option-svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <!-- 비어있는 밥그릇 (식사량 저하 없음 -> 잘 먹어서 비어있음) -->
          <path d="M3 19h18c-.5-4.5-2-7.5-6-7.5H9c-4 0-5.5 3-6 7.5z" fill="#EDF2F7" stroke="#4A5568"/>
          <line x1="2" y1="19" x2="22" y2="19" stroke="#4A5568" stroke-width="2"/>
          <!-- 빈 밥그릇 안쪽에 생선 뼈 무늬 표시 -->
          <path d="M9 15h6M10.5 13.5v3M12 13.5v3M13.5 13.5v3" stroke="#A0AEC0"/>
        </svg>`,
    1: `<svg viewBox="0 0 24 24" class="option-svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <!-- 반쯤 찬 밥그릇 (식사량 저하 약간 있음) -->
          <path d="M3 19h18c-.5-4.5-2-7.5-6-7.5H9c-4 0-5.5 3-6 7.5z" fill="#EDF2F7" stroke="#4A5568"/>
          <path d="M5.5 16.5c1.5-1.5 4-2 6.5-2s5 .5 6.5 2" fill="#FF7A59" stroke="#E26444"/>
          <line x1="2" y1="19" x2="22" y2="19" stroke="#4A5568" stroke-width="2"/>
        </svg>`,
    2: `<svg viewBox="0 0 24 24" class="option-svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <!-- 수북이 꽉 찬 밥그릇 (식사량 저하 심각 -> 안 먹어서 그대로 가득 참) -->
          <path d="M3 19h18c-.5-4.5-2-7.5-6-7.5H9c-4 0-5.5 3-6 7.5z" fill="#EDF2F7" stroke="#4A5568"/>
          <path d="M5.3 16c1.5-3.5 4.2-4.5 6.7-4.5s5.2 1 6.7 4.5" fill="#FF7A59" stroke="#E26444"/>
          <line x1="2" y1="19" x2="22" y2="19" stroke="#4A5568" stroke-width="2"/>
          <circle cx="10" cy="13" r="0.8" fill="#FFF" stroke="none"/>
          <circle cx="14" cy="13.5" r="0.8" fill="#FFF" stroke="none"/>
          <circle cx="12" cy="12" r="0.8" fill="#FFF" stroke="none"/>
        </svg>`
  },
  // Q2: Hiding (구석에 숨음)
  2: {
    0: `<svg viewBox="0 0 24 24" class="option-svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <!-- 활달하게 나와서 노는 고양이 (숨음 없음) -->
          <circle cx="12" cy="12" r="4.5" fill="#FFEDE9" stroke="#4A5568"/>
          <path d="M9.5 8l-2-2.5h1.2zM14.5 8l2-2.5h-1.2z" fill="#FF7A59" stroke="#4A5568"/>
          <circle cx="10.5" cy="11.5" r="0.5" fill="#4A5568"/>
          <circle cx="13.5" cy="11.5" r="0.5" fill="#4A5568"/>
          <path d="M11 14c.5.3 1.5.3 2 0" stroke="#4A5568"/>
          <!-- 바깥 잔디/햇살 매칭 -->
          <path d="M19 5l1.5-1.5" stroke="#D69E2E"/>
        </svg>`,
    1: `<svg viewBox="0 0 24 24" class="option-svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <!-- 가구 뒤에서 살짝 기웃거리는 모습 (숨음 약간) -->
          <rect x="2" y="14" width="20" height="7" rx="1.5" fill="#CBD5E0" stroke="#4A5568"/>
          <circle cx="12" cy="12" r="3.5" fill="#FFEDE9" stroke="#4A5568"/>
          <path d="M10 9l-1.5-2h1zM14 9l1.5-2h-1z" fill="#FF7A59" stroke="#4A5568"/>
          <circle cx="11" cy="12" r="0.5" fill="#4A5568"/>
          <circle cx="13" cy="12" r="0.5" fill="#4A5568"/>
        </svg>`,
    2: `<svg viewBox="0 0 24 24" class="option-svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <!-- 상자 깊은 곳에 완전히 박혀서 어둠 속에 눈만 보임 (숨음 자주) -->
          <rect x="2" y="7" width="20" height="14" rx="2" fill="#4A5568" stroke="#2D3748"/>
          <path d="M2 11h20M2 16h20" stroke="#2D3748" stroke-dasharray="2,2"/>
          <ellipse cx="9" cy="13.5" rx="2" ry="1" fill="#FEFCBF" stroke="none"/>
          <ellipse cx="15" cy="13.5" rx="2" ry="1" fill="#FEFCBF" stroke="none"/>
          <circle cx="9" cy="13.5" r="0.6" fill="#2D3748" stroke="none"/>
          <circle cx="15" cy="13.5" r="0.6" fill="#2D3748" stroke="none"/>
        </svg>`
  },
  // Q3: Lethargy (무기력증)
  3: {
    0: `<svg viewBox="0 0 24 24" class="option-svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <!-- 에너제틱하게 달리기/장난감 놀이 (무기력 없음) -->
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#FEFCBF" stroke="#D69E2E"/>
        </svg>`,
    1: `<svg viewBox="0 0 24 24" class="option-svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <!-- 얌전한 앉아있는 상태 (무기력 약간) -->
          <ellipse cx="12" cy="16" rx="6" ry="4.5" fill="#EDF2F7" stroke="#4A5568"/>
          <circle cx="12" cy="10" r="3" fill="#FFEDE9" stroke="#4A5568"/>
          <path d="M10.5 8l-1.5-1.5h1zM13.5 8l1.5-1.5h-1z" fill="#FF7A59" stroke="#4A5568"/>
        </svg>`,
    2: `<svg viewBox="0 0 24 24" class="option-svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <!-- 바닥에 퍼져 자거나 늘어져 있는 상태 (무기력 자주) -->
          <path d="M3 18c1.5-2 4.5-3 9-3s7.5 1 9 3z" fill="#EDF2F7" stroke="#4A5568"/>
          <circle cx="12" cy="13.5" r="3.5" fill="#FFEDE9" stroke="#4A5568"/>
          <path d="M10 13.5h1.5M12.5 13.5h1.5" stroke="#4A5568"/>
          <!-- Zzz 효과 -->
          <text x="17" y="9" font-size="6.5" font-family="monospace" fill="#718096" font-weight="bold">Zz</text>
        </svg>`
  },
  // Q4: Drinking (음수량 급증)
  4: {
    0: `<svg viewBox="0 0 24 24" class="option-svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <!-- 정상 음수량 (물이 잔잔하게 참) -->
          <path d="M4 9h16v9a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V9z" fill="#EDF2F7" stroke="#4A5568"/>
          <path d="M4 14.5c2.5-1 5.5-1 8 0s5.5 1 8 0V18a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-3.5z" fill="#BEE3F8" stroke="#3182CE"/>
        </svg>`,
    1: `<svg viewBox="0 0 24 24" class="option-svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <!-- 물그릇의 수위가 꽤 줄어듬 (마시는 양이 조금 늚) -->
          <path d="M4 9h16v9a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V9z" fill="#EDF2F7" stroke="#4A5568"/>
          <path d="M4 17.5c2.5-.5 5.5-.5 8 0s5.5.5 8 0V18a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-.5z" fill="#BEE3F8" stroke="#3182CE"/>
        </svg>`,
    2: `<svg viewBox="0 0 24 24" class="option-svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <!-- 물그릇이 완전히 비고 겉면에 목마른 붉은 물방울 (음수량 폭증) -->
          <path d="M4 9h16v9a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V9z" fill="#EDF2F7" stroke="#4A5568"/>
          <line x1="4" y1="9" x2="20" y2="9" stroke="#4A5568"/>
          <path d="M12 11.5v3.5M12 18.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0" stroke="#E53E3E" stroke-width="1.5"/>
        </svg>`
  },
  // Q5: Litter box (배변 이상)
  5: {
    0: `<svg viewBox="0 0 24 24" class="option-svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <!-- 정상적인 감자/맛동산 (배변 이상 없음) -->
          <path d="M12 5c-3 0-5 2-5 5.5 0 1.5 1 2 1 3.5 0 2.5 2 4 4 4s4-1.5 4-4c0-1.5 1-2 1-3.5C17 7 15 5 12 5z" fill="#FFEDE9" stroke="#4A5568"/>
          <path d="M10 13c.5.5 1.5.5 2 0" stroke="#4A5568"/>
        </svg>`,
    1: `<svg viewBox="0 0 24 24" class="option-svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <!-- 묽거나 약간 흩어진 변 (배변 이상 약간) -->
          <path d="M5 14c1.5-1.5 3.5-2.5 7-2.5s5.5 1 7 2.5c1 1.5-1 3-3 2.5s-4 .5-5 .5-4.5-.5-6-3z" fill="#FEFCBF" stroke="#D69E2E"/>
        </svg>`,
    2: `<svg viewBox="0 0 24 24" class="option-svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <!-- 물처럼 심한 설사 또는 통증 주의보 (배변 이상 자주) -->
          <path d="M4 16c2-2.5 5-2.5 8-1.5s5 1 8-.5c1 1.5-1.5 3-4 2s-6 .5-8 0-4-1.5-4 0z" fill="#FED7D7" stroke="#E53E3E"/>
          <path d="M12 5v2.5M12 10.5h0.01" stroke="#E53E3E" stroke-width="2.5" stroke-linecap="round"/>
        </svg>`
  },
  // Q6: Grooming (그루밍 이상)
  6: {
    0: `<svg viewBox="0 0 24 24" class="option-svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <!-- 깔끔하고 단정하게 정돈된 부드러운 털 (그루밍 이상 없음) -->
          <ellipse cx="12" cy="12" rx="8" ry="6" fill="#FFEDE9" stroke="#4A5568"/>
          <path d="M6 12h12M7 9.5h10M8 14.5h8" stroke="#4A5568" stroke-dasharray="1,2"/>
          <path d="M19 6l1.5-1.5M4 19l1.5-1.5" stroke="#2F855A"/>
        </svg>`,
    1: `<svg viewBox="0 0 24 24" class="option-svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <!-- 핥아서 침을 묻히는 평범한 그루밍 (그루밍 이상 약간) -->
          <ellipse cx="12" cy="12" rx="8" ry="6" fill="#FFEDE9" stroke="#4A5568"/>
          <!-- 작은 그루밍 혀 묘사 -->
          <path d="M11.5 11c-.5.8.3 1.8 1 1s1.5-.2 1.5-1.2" fill="#FFBEE3" stroke="#FF7A59"/>
        </svg>`,
    2: `<svg viewBox="0 0 24 24" class="option-svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <!-- 피부 장벽이 붉게 노출되거나 땜빵이 생김 (오버그루밍 자주) -->
          <ellipse cx="12" cy="12" rx="8" ry="6" fill="#FFEDE9" stroke="#4A5568"/>
          <circle cx="12" cy="12" r="3" fill="#FED7D7" stroke="#E53E3E" stroke-dasharray="1.5,1.5"/>
          <line x1="10" y1="10" x2="14" y2="14" stroke="#E53E3E"/>
          <line x1="14" y1="10" x2="10" y2="14" stroke="#E53E3E"/>
        </svg>`
  },
  // Q7: Sensitivity (경계성 예민성)
  7: {
    0: `<svg viewBox="0 0 24 24" class="option-svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <!-- 손을 대면 하트를 뿜으며 좋아하는 온순한 상태 (예민함 없음) -->
          <path d="M12 21c-4.5-4-8-7.5-8-11A4.5 4.5 0 0 1 8.5 5.5c1.5 0 3 .8 3.5 2 .5-1.2 2-2 3.5-2a4.5 4.5 0 0 1 4.5 4.5c0 3.5-3.5 7-8 11z" fill="#FED7D7" stroke="#E53E3E"/>
        </svg>`,
    1: `<svg viewBox="0 0 24 24" class="option-svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <!-- 만지려 하니 고개를 피하거나 갸우뚱함 (예민함 약간) -->
          <circle cx="12" cy="12" r="7.5" fill="#EDF2F7" stroke="#4A5568"/>
          <path d="M12 8.5a1.8 1.8 0 0 1 1.8 1.8c0 1.2-1.2 1.8-1.2 2.5 M12 15.5h.01" stroke="#4A5568" stroke-width="2" stroke-linecap="round"/>
        </svg>`,
    2: `<svg viewBox="0 0 24 24" class="option-svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <!-- 만지자 하악질을 하거나 화를 내며 위협함 (예민함 자주) -->
          <circle cx="12" cy="12" r="7.5" fill="#FED7D7" stroke="#E53E3E"/>
          <!-- 성난 눈썹과 입 -->
          <path d="M8.5 10l2 1.5M15.5 10l-2 1.5M9.5 15c1-1.5 4-1.5 5 0" stroke="#E53E3E" stroke-width="1.8"/>
          <path d="M3 3l3 3M21 3l-3 3" stroke="#E53E3E" stroke-width="1.5"/>
        </svg>`
  },
  // Q8: Flu (호흡기/감기 증상)
  8: {
    0: `<svg viewBox="0 0 24 24" class="option-svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <!-- 뽀송하고 맑은 고양이 얼굴 (감기 증상 없음) -->
          <circle cx="12" cy="12" r="7.5" fill="#FFEDE9" stroke="#4A5568"/>
          <circle cx="9.5" cy="11.5" r="0.5" fill="#4A5568"/>
          <circle cx="14.5" cy="11.5" r="0.5" fill="#4A5568"/>
          <path d="M11 14.5c.5.3 1.5.3 2 0" stroke="#4A5568"/>
        </svg>`,
    1: `<svg viewBox="0 0 24 24" class="option-svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <!-- 한쪽에 콧물이 맺힌 모습 (감기 증상 약간) -->
          <circle cx="12" cy="12" r="7.5" fill="#FFEDE9" stroke="#4A5568"/>
          <circle cx="9.5" cy="11.5" r="0.5" fill="#4A5568"/>
          <circle cx="14.5" cy="11.5" r="0.5" fill="#4A5568"/>
          <path d="M12 14v2.5a.3.3 0 0 0 .5 0C12.5 15.5 12 14.5 12 14" fill="#BEE3F8" stroke="#3182CE" stroke-width="0.8"/>
        </svg>`,
    2: `<svg viewBox="0 0 24 24" class="option-svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <!-- 눈곱과 콧물이 뒤범벅된 상태 (감기 증상 자주) -->
          <circle cx="12" cy="12" r="7.5" fill="#FED7D7" stroke="#E53E3E"/>
          <path d="M8.5 11l1.5 1M15.5 11l-1.5 1" stroke="#E53E3E" stroke-width="1.5"/>
          <circle cx="5" cy="15" r="0.8" fill="#BEE3F8" stroke="none"/>
          <circle cx="19" cy="15" r="0.8" fill="#BEE3F8" stroke="none"/>
          <path d="M11.5 14v3.5a.5.5 0 0 0 1 0C12.5 16 11.5 15 11.5 14" fill="#BEE3F8" stroke="#3182CE" stroke-width="0.8"/>
        </svg>`
  },
  // Q9: Breathing (개구 호흡)
  9: {
    0: `<svg viewBox="0 0 24 24" class="option-svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <!-- 입을 다물고 코로 얌전히 쉬는 숨 (개구호흡 없음) -->
          <circle cx="12" cy="12" r="7.5" fill="#FFEDE9" stroke="#4A5568"/>
          <line x1="11" y1="14" x2="13" y2="14" stroke="#4A5568"/>
          <path d="M7 8s2-1 5-1 5 1 5 1" stroke="#2F855A" stroke-dasharray="1.5,1.5"/>
        </svg>`,
    1: `<svg viewBox="0 0 24 24" class="option-svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <!-- 호흡수가 빨라 가슴이 들썩거림 (개구호흡 약간) -->
          <circle cx="12" cy="12" r="7.5" fill="#FFEDE9" stroke="#4A5568"/>
          <ellipse cx="12" cy="13.5" rx="1.5" ry="1" fill="#FFF" stroke="#4A5568"/>
          <path d="M18.5 9a3.5 3.5 0 0 1 0 4M20.5 7.5a5.5 5.5 0 0 1 0 7" stroke="#D69E2E"/>
        </svg>`,
    2: `<svg viewBox="0 0 24 24" class="option-svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <!-- 입을 활짝 열고 붉은 혀로 헐떡이는 호흡 (개구호흡 자주) -->
          <circle cx="12" cy="12" r="7.5" fill="#FED7D7" stroke="#E53E3E"/>
          <path d="M10 13h4v3a2 2 0 0 1-4 0v-3z" fill="#E53E3E" stroke="#E53E3E"/>
          <ellipse cx="12" cy="14.5" rx="1.2" ry="1.2" fill="#FFBEE3" stroke="none"/>
          <path d="M19 8.5a4 4 0 0 1 0 5M21 7a6 6 0 0 1 0 8" stroke="#E53E3E" stroke-width="1.5"/>
        </svg>`
  },
  // Q10: Joints (절뚝거림/관절 이상)
  10: {
    0: `<svg viewBox="0 0 24 24" class="option-svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <!-- 높이 껑충 활달하게 잘 뛰어내림 (관절 이상 없음) -->
          <path d="M3 20h5v-4h5v-4h6" stroke="#4A5568"/>
          <circle cx="18" cy="6.5" r="2.5" fill="#FFEDE9" stroke="#4A5568"/>
          <path d="M5 14.5l2.5-2.5M7.5 12h-1.8 M7.5 12v1.8" stroke="#2F855A" stroke-width="1.5"/>
        </svg>`,
    1: `<svg viewBox="0 0 24 24" class="option-svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <!-- 계단 앞에서 뛸까말까 멈칫함 (망설임 있음) -->
          <path d="M3 20h5v-4h5v-4h6" stroke="#4A5568"/>
          <circle cx="8" cy="12" r="2.5" fill="#FFEDE9" stroke="#4A5568"/>
          <text x="12.5" y="8" font-size="7.5" font-family="sans-serif" font-weight="900" fill="#D69E2E">?</text>
        </svg>`,
    2: `<svg viewBox="0 0 24 24" class="option-svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <!-- 다리에 붕대를 매거나 통증으로 주저앉음 (보행 이상 자주) -->
          <path d="M3 20h18" stroke="#E53E3E"/>
          <rect x="7" y="15" width="3.5" height="5" rx="1.2" fill="#FFF" stroke="#E53E3E"/>
          <path d="M12 6.5l-2 3.5h4L12 6.5zM12 12v1" stroke="#E53E3E" stroke-width="1.5"/>
        </svg>`
  }
};
