const translations = {
    en: {
        selectGameMode: 'Select Game Mode',
        singlePlayer: 'Single Player',
        multiPlayer: 'Multiplayer',
        tournament: 'Tournament',
        subGame: 'Sub Game',
    },
    ko: {
        selectGameMode: '게임 모드 선택',
        singlePlayer: '싱글 플레이어',
        multiPlayer: '멀티플레이어',
        tournament: '토너먼트',
        subGame: '서브 게임',
    },
    ja: {
        selectGameMode: 'ゲームモードを選択',
        singlePlayer: 'シングルプレイヤー',
        multiPlayer: 'マルチプレイヤー',
        tournament: 'トーナメント',
        subGame: 'サブゲーム',
    },
};

let currentLanguage = localStorage.getItem('language') || 'en';

export function render() {
    const { selectGameMode, singlePlayer, multiPlayer, tournament, subGame } = translations[currentLanguage];
    const content = document.getElementById('content');
    content.innerHTML = '';
    content.innerHTML = `
        <h1>${selectGameMode}</h1>
        <button class="btn btn-primary" data-action="renderGameOptions" data-mode="single">👤 ${singlePlayer}</button>
        <button class="btn btn-primary" data-action="renderGameOptions" data-mode="multi">👥 ${multiPlayer}</button>
        <button class="btn btn-primary" data-action="renderGameOptions" data-mode="tournament">🏆 ${tournament}</button>
        <button class="btn btn-primary" data-action="navigateTo" data-path="/subgame">👋 ${subGame}</button>
        <div id="game-options"></div>
        <div id="game-start-button"></div>
    `;
}
