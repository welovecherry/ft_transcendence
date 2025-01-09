import { navigateTo } from '../core/router.js';
import { loadGame } from '../game/loadGame.js';
// 나중에 화면 수정시 확인 필요

const translations = {
    en: {
        title: "Game Start",
        mode: "Mode",
        difficulty: "Difficulty",
        diffChoices: {
            easy: "Easy",
            medium: "Medium",
            hard: "Hard"
        },
        modeChoices: {
            single: "Single Player",
            multi: "MultiPlayer",
            tournament: "Tournament",
        },
        button: "Start",
        settingNotFound: "Settings not found!",
    },
    ko: {
        title: "게임 시작",
        mode: "모드",
        difficulty: "난이도",
        diffChoices: {
            easy: "쉬움",
            medium: "보통",
            hard: "어려움"
        },
        modeChoices: {
            single: "싱글 플레이어",
            multi: "멀티 플레이어",
            tournament: "토너먼트",
        },
        button: "시작",
        settingNotFound: "게임이 설정되지 않았습니다.",
    },
    ja: {
        title: "ゲーム開始",
        mode: "モード",
        difficulty: "難易度",
        diffChoices: {
            easy: "簡単",
            medium: "普通",
            hard: "難しい"
        },
        modeChoices: {
            single: "シングルプレイヤー",
            multi: "マルチプレイヤー",
            tournament: "トーナメント",
        },
        button: "開始",
        settingNotFound: "ゲームが設定されていません。",
    },
};

let currentLanguage = localStorage.getItem('language') || 'en';

export function render() {
    const { title, mode, difficulty, button, settingNotFound, modeChoices, diffChoices } = translations[currentLanguage];

    const gameSettings = JSON.parse(localStorage.getItem('gameSettings'));
    if (gameSettings) {
        const content = document.getElementById('content');
        content.innerHTML = '';
        content.innerHTML = `
            <h1>${title}</h1>
            <p>${mode}: ${modeChoices[gameSettings.gameMode]}</p>
            <p>${difficulty}: ${diffChoices[gameSettings.difficulty]}</p>
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
        alert(`${settingNotFound}`);
        navigateTo('/setting');
    }
}
