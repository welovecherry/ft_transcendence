const translations = {
    en: {
        title: "Rock Scissors Paper",
        enroll: "Enroll",
        match: "Match",
        history: "History",
    },
    ko: {
        title: "가위 바위 보",
        enroll: "등록",
        match: "매치",
        history: "기록",
    },
    ja: {
        title: "じゃんけん",
        enroll: "登録",
        match: "試合",
        history: "履歴",
    },
};

let currentLanguage = localStorage.getItem('language') || 'en';

export function render() {
    const { title, enroll, match, history } = translations[currentLanguage];

    const content = document.getElementById('content');
    content.innerHTML = '';
    content.innerHTML = `
        <h1>${title}</h1>
        <button class="btn btn-primary" data-action="renderSubgameMenu" data-mode="enroll">${enroll}</button>
        <button class="btn btn-primary" data-action="renderSubgameMenu" data-mode="match">${match}</button>
        <button class="btn btn-primary" data-action="renderSubgameMenu" data-mode="history">${history}</button>
        <div class="container mt-5" id="subgame-content"></div>
        <div class="container mt-3" id="subgame-match"></div>
    `;
}
