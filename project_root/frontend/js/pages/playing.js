import { gameSettings } from './settingOptions.js';
// 나중에 화면 수정시 확인 필요

export function render() {
    const content = document.getElementById('content');
    content.innerHTML = '';
    content.innerHTML = `
        <h1>Game Start</h1>
        <p>Mode: ${gameSettings.gameMode}</p>
        <p>Players: ${gameSettings.playerNames.join(', ')}</p>
        <p>Difficulty: ${gameSettings.difficulty}</p>
        <button class="btn btn-primary" id="startGameButton">Start Game</button>
        <div id="game-screen"></div>
    `;

    const script = document.createElement('script');
    script.src = 'js/game/game-playing.js';
    script.onload = function () {
        console.log('Game-playing script loaded!');
        loadGame();
    };
    document.body.appendChild(script);
}
