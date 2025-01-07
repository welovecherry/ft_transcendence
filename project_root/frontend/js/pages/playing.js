import { navigateTo } from '../core/router.js';
import { loadGame } from '../game/loadGame.js';
// 나중에 화면 수정시 확인 필요

export function render() {
    const gameSettings = JSON.parse(localStorage.getItem('gameSettings'));
    if (gameSettings) {
        const content = document.getElementById('content');
        content.innerHTML = '';
        content.innerHTML = `
            <p>Mode: ${gameSettings.gameMode}</p>
            <p>Difficulty: ${gameSettings.difficulty}</p>
            <button class="btn btn-primary" id="startGameButton">Start Game</button>
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
