class LottoBall extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    connectedCallback() {
      const number = this.getAttribute('number');
      const colorClass = this.getColorClass(number);
      const isBonus = this.hasAttribute('bonus');
  
      this.shadowRoot.innerHTML = `
        <style>
          .lotto-ball {
            width: 45px;
            height: 45px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 1.2rem;
            font-weight: 700;
            color: #333;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            animation: appear 0.4s ease-out forwards;
          }
  
          .bonus {
              background: linear-gradient(135deg, #ffab73, #ff8a5c);
          }
  
          .color-1 { background: linear-gradient(135deg, #fbc400, #f8a500); }
          .color-2 { background: linear-gradient(135deg, #69c8f2, #4da8db); }
          .color-3 { background: linear-gradient(135deg, #ff7272, #f55d5d); }
          .color-4 { background: linear-gradient(135deg, #aaa, #888); }
          .color-5 { background: linear-gradient(135deg, #b0d840, #99c030); }
  
          @keyframes appear {
              from { transform: scale(0.6); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
          }
  
          @media (max-width: 768px) {
              .lotto-ball {
                  width: 38px;
                  height: 38px;
                  font-size: 1rem;
              }
          }
        </style>
        <div class="lotto-ball ${isBonus ? 'bonus' : colorClass}">
          ${number}
        </div>
      `;
    }
  
    getColorClass(number) {
      const num = parseInt(number, 10);
      if (num <= 10) return 'color-1';
      if (num <= 20) return 'color-2';
      if (num <= 30) return 'color-3';
      if (num <= 40) return 'color-4';
      return 'color-5';
    }
  }
  
  customElements.define('lotto-ball', LottoBall);
  
  document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const lottoGamesContainer = document.getElementById('lotto-games-container');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    const themeText = themeToggle.querySelector('.theme-text');
  
    // 테마 설정 기능
    const applyTheme = (theme) => {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      
      if (theme === 'dark') {
        themeIcon.textContent = '🌙';
        themeText.textContent = 'Dark Mode';
      } else {
        themeIcon.textContent = '☀️';
        themeText.textContent = 'Light Mode';
      }
    };

    // 초기 테마 로드
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);

    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });

    const generateLotto = () => {
      lottoGamesContainer.innerHTML = '';
      for (let i = 0; i < 5; i++) {
        const gameContainer = document.createElement('div');
        gameContainer.classList.add('lotto-game');
  
        const numbers = new Set();
        while (numbers.size < 7) { 
          const randomNumber = Math.floor(Math.random() * 45) + 1;
          numbers.add(randomNumber);
        }
  
        const allNumbers = Array.from(numbers).sort((a, b) => a - b);
        const mainNumbers = allNumbers.slice(0, 6);
        const bonusNumber = allNumbers[6];
  
        mainNumbers.forEach((number, index) => {
          setTimeout(() => {
              const lottoBall = document.createElement('lotto-ball');
              lottoBall.setAttribute('number', number);
              gameContainer.appendChild(lottoBall);
          }, (i * 7 + index) * 100);
        });
  
        const bonusContainer = document.createElement('div');
        bonusContainer.classList.add('bonus-container');
        
        const plusSign = document.createElement('span');
        plusSign.textContent = '+';
        bonusContainer.appendChild(plusSign);
  
        setTimeout(() => {
          const lottoBall = document.createElement('lotto-ball');
          lottoBall.setAttribute('number', bonusNumber);
          lottoBall.setAttribute('bonus', '');
          bonusContainer.appendChild(lottoBall);
          gameContainer.appendChild(bonusContainer);
        }, (i * 7 + 6) * 100);
  
        lottoGamesContainer.appendChild(gameContainer);
      }
    };

    generateBtn.addEventListener('click', generateLotto);

    // 키보드 단축키 추가 (Enter, Space)
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault(); // 스페이스바 클릭 시 페이지 스크롤 방지
        generateBtn.click(); // 버튼 클릭 시뮬레이션
      }
    });
  });
  