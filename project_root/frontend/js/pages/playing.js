import { gameSettings } from './settingOptions.js';
import { loadGame } from '../game/loadGame.js';
// 나중에 화면 수정시 확인 필요

export function render() {
    const content = document.getElementById('content');
    content.innerHTML = '';
    content.innerHTML = `
        <p>Mode: ${gameSettings.gameMode}</p>
        <p>Difficulty: ${gameSettings.difficulty}</p>
        <button class="btn btn-primary" id="startGameButton">Start Game</button>
        <div id="game-screen"></div>
    `;

    loadGame();
}
