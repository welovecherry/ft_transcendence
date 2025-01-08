import { navigateTo } from '../core/router.js';
import { loadGame } from '../game/loadGame.js';
// 나중에 화면 수정시 확인 필요

const translations = {
    en: {
        title: "Game Start",
        mode: "Mode",
        difficulty: "Difficulty",
        button: "Start",
    },
    ko: {
        title: "게임 시작",
        mode: "모드",
        difficulty: "난이도",
        button: "시작",
    },
    ja: {
        title: "ゲーム開始",
        mode: "モード",
        difficulty: "難易度",
        button: "開始",
    },
};

let currentLanguage = localStorage.getItem('language') || 'en';

export function render() {
    const { title, mode, difficulty, button } = translations[currentLanguage];

    const gameSettings = JSON.parse(localStorage.getItem('gameSettings'));
    if (gameSettings) {
        const content = document.getElementById('content');
        content.innerHTML = '';
        content.innerHTML = `
            <h1>${title}</h1>
            <p>${mode}: ${gameSettings.gameMode}</p>
            <p>${difficulty}: ${gameSettings.difficulty}</p>
            <button class="btn btn-primary" id="startGameButton">${button}</button>
            <div id="game-screen"></div>
        `;

        const existingScript = document.querySelector(
            'script[src="js/game/game-playing.js"]'
        );
        if (existingScript) {
            existingScript.remove();
        }
        loadGame();
    } else {
        alert('Settings Not Found!');
        navigateTo('/setting');
    }
}
