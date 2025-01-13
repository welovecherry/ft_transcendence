const translations = {
    en: {
        welcome: "Welcome to 42's Ping Pong Game",
        login: "Login",
        developer: "developer",
    },
    ko: {
        welcome: "42 핑퐁 게임에 오신 것을 환영합니다",
        login: "로그인",
        developer: "개발자",
    },
    ja: {
        welcome: "42のポンゲームへようこそ",
        login: "ログイン",
        developer: "開発者",
    },
};

let currentLanguage = localStorage.getItem('language') || 'en';

export function render() {
    const { welcome, login, developer } = translations[currentLanguage];
    const content = document.getElementById('content');
    content.innerHTML = '';

    // UI 구성
    content.innerHTML = `
    <div style="position: relative; padding: 0; margin: 0; display: flex; justify-content: center; align-items: center;">
        <h1 style="font-size:50px;">${welcome}</h1>
    </div>
    <hr></hr>
    <div style="position: relative; padding: 0; margin: 0; display: flex; justify-content: center; align-items: center;  margin-bottom: 50px">
        <button class="btn btn-primary" data-action="login">
            ${login}
        </button>
        <select class="form-select" id="language-select" style="width: 120px; margin-left: 10px;">
            <option value="ko" ${currentLanguage === 'ko' ? 'selected' : ''}>한국어</option>
            <option value="en" ${currentLanguage === 'en' ? 'selected' : ''}>English</option>
            <option value="ja" ${currentLanguage === 'ja' ? 'selected' : ''}>日本語</option>
        </select>
    </div>
    <hr></hr>
    <div style="position: relative; padding: 0; margin: 0; display: flex; justify-content: center; align-items: center;">
        <body>
            ${developer}: jungmiho seok seungjun sumilee
        </body>
    </div>
    `;

    const languageSelect = document.getElementById('language-select');
    languageSelect.addEventListener('change', (e) => {
        currentLanguage = e.target.value;
        localStorage.setItem('language', currentLanguage);
        render();
    });
}
