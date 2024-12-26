import {
    gameSettings,
    updatePlayerNames,
    updateDifficulty,
} from './updateSettings.js';

export const renderGameOptions = (mode) => {
    gameSettings.gameMode = mode;
    gameSettings.playerNames = [];
    gameSettings.difficulty = 'easy';

    let optionsHTML = '';
    let startBtnHTML = '';
    if (mode === 'single') {
        optionsHTML = `
            <div class="form-group">
                <label for="difficulty">Select Difficulty</label>
                <select class="form-control" id="difficulty">
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
            </div>
        `;
        startBtnHTML = `<button class="btn btn-success" id="start-game-btn">Start Game</button>`;
    } else if (mode === 'multi') {
        optionsHTML = `
            <div class="form-group">
                <label for="player1-name">Player 1 Name</label>
                <input type="text" class="form-control" id="player1-name" placeholder="Enter Player 1 Name">
            </div>
            <div class="form-group">
                <label for="player2-name">Player 2 Name</label>
                <input type="text" class="form-control" id="player2-name" placeholder="Enter Player 2 Name">
            </div>
            <div class="form-group">
                <label for="difficulty">Select Difficulty</label>
                <select class="form-control" id="difficulty">
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
            </div>
        `;
        startBtnHTML = `<button class="btn btn-success" id="start-game-btn" disabled>Start Game</button>`;
    } else if (mode === 'tournament') {
        optionsHTML = `
            <div class="form-group">
                <label for="player1-name">Player 1 Name</label>
                <input type="text" class="form-control" id="player1-name" placeholder="Enter Player 1 Name">
            </div>
            <div class="form-group">
                <label for="player2-name">Player 2 Name</label>
                <input type="text" class="form-control" id="player2-name" placeholder="Enter Player 2 Name">
            </div>
            <div class="form-group">
                <label for="player3-name">Player 3 Name</label>
                <input type="text" class="form-control" id="player3-name" placeholder="Enter Player 3 Name">
            </div>
            <div class="form-group">
                <label for="player4-name">Player 4 Name</label>
                <input type="text" class="form-control" id="player4-name" placeholder="Enter Player 4 Name">
            </div>
            <div class="form-group">
                <label for="difficulty">Select Difficulty</label>
                <select class="form-control" id="difficulty">
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
            </div>
        `;
        startBtnHTML = `<button class="btn btn-success" id="start-game-btn" disabled>Start Game</button>`;
    }

    document.getElementById('game-options').innerHTML = optionsHTML;
    document.getElementById('game-start-button').innerHTML = startBtnHTML;

    attachEventListeners();
};

function attachEventListeners() {
    // 난이도 변경 이벤트
    document
        .getElementById('difficulty')
        ?.addEventListener('change', (event) => {
            updateDifficulty(event.target.value);
        });

    // 플레이어 이름 변경 이벤트
    document.querySelectorAll('[id^="player"]').forEach((input) => {
        input.addEventListener('blur', () => {
            const names = Array.from(
                document.querySelectorAll('[id^="player"]')
            )
                .map((input) => input.value)
                .filter(Boolean);

            const result = updatePlayerNames(names);

            const startBtn = document.getElementById('start-game-btn');
            if (!result.valid && result.message) {
                alert(result.message);
                startBtn.disabled = true;
            } else if (!result.valid) {
                startBtn.disabled = true;
            } else {
                startBtn.disabled = false;
            }
        });
    });
}

export { gameSettings };
