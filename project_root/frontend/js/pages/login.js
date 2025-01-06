// 번역 데이터
const translations = {
    en: {
        welcome: "Weclome to Pong Game",
        login: "Login",
    },
    ko: {
        welcome: "탁구 게임에 오신 것을 환영합니다",
        login: "로그인",
    },
    ja: {
        welcome: "ポンゲームへようこそ",
        login: "ログイン",
    },
};

let currentLanguage = localStorage.getItem('language') || 'en';

export function render() {
    const { welcome, login } = translations[currentLanguage];
    const content = document.getElementById('content');
    content.innerHTML = '';

    // UI 구성
    content.innerHTML = `
    <div style="position: relative; padding: 0; margin: 0; display: flex; justify-content: center; align-items: center;">
        <h1 style="margin-right: 20px;">
            ${welcome}
        </h1>
        <button class="btn btn-primary" data-action="login">${login}</button>
        <select id="language-select" style="margin-left: 10px;">
            <option value="ko" ${currentLanguage === 'ko' ? 'selected' : ''}>한국어</option>
            <option value="en" ${currentLanguage === 'en' ? 'selected' : ''}>English</option>
            <option value="ja" ${currentLanguage === 'ja' ? 'selected' : ''}>日本語</option>
        </select>
    </div>
    `;

    const languageSelect = document.getElementById('language-select');
    languageSelect.addEventListener('change', (e) => {
        currentLanguage = e.target.value;
        localStorage.setItem('language', currentLanguage);
        render();
    });
}
