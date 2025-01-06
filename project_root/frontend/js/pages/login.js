// 번역 데이터
const translations = {
    en: {
        welcome: "Weclome to Pong Game",
        login: "Login",
    },
    ko: {
        welcome: "탁구 게임에 오신 것을 환영합니다.",
        login: "로그인",
    },
    ja: {
        welcome: "ポンゲームへようこそ",
        login: "ログイン",
    },
};

let currentLanguage = localStorage.getItem('language') || 'en';

export function render() {
    const content = document.getElementById('content');
    content.innerHTML = '';
    content.innerHTML = `
        <h1>Welcome to Pong Game</h1>
        <button class="btn btn-primary" data-action="login">Login</button>
    `;

    const { welcome, login } = translations[currentLanguage];

    // UI 구성
    content.innerHTML = `
    <div style="position: absolute; top: 10px; right: 10px;">
        <select id="language-select">
            <option value="ko" ${currentLanguage === 'ko' ? 'selected' : ''}>한국어</option>
            <option value="en" ${currentLanguage === 'en' ? 'selected' : ''}>English</option>
            <option value="ja" ${currentLanguage === 'ja' ? 'selected' : ''}>日本語</option>
        </select>
    </div>
    <div style="position: relative; padding: 0; margin: 0;">
        <h1>
            ${welcome}
        </h1>
    </div>
    <button class="btn btn-primary" data-action="login">${login}</button>
    `;

    const languageSelect = document.getElementById('language-select');
    languageSelect.addEventListener('change', (e) => {
        currentLanguage = e.target.value;
        localStorage.setItem('language', currentLanguage);
        render();
    });
}
