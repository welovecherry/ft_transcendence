import { gameSettings } from './settingOptions.js';
// 나중에 화면 수정시 확인 필요

export function render() {
    return `
        <h1>Game Start</h1>
        <p>Mode: ${gameSettings.gameMode}</p>
        <p>Players: ${gameSettings.playerNames.join(', ')}</p>
        <p>Difficulty: ${gameSettings.difficulty}</p>
        <div id="game-screen">
            <!-- 모드, 플레이어 이름, 난이도 입력 시 그에 맞게 게임 호출 -->
        </div>
        <script src="/js/game/game-playing.js"></script>
    `;
}
