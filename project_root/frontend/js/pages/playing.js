import { gameSettings } from './settingOptions.js';
import '../game/game-playing.js';
// 나중에 화면 수정시 확인 필요

export function render() {
    return `
        <h1>Game Start</h1>
        <p>Mode: ${gameSettings.gameMode}</p>
        <p>Players: ${gameSettings.playerNames.join(', ')}</p>
        <p>Difficulty: ${gameSettings.difficulty}</p>
        <button id="startGameButton">Start Game</button>
        <script src="../game/game-playing.js" defer></script>
            <!-- 모드, 플레이어 이름, 난이도 입력 시 그에 맞게 게임 호출 -->
        
    `;
}
