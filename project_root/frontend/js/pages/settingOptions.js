import {
    gameSettings,
    updatePlayerNames,
    updateDifficulty,
} from './updateSettings.js';
import { navigateTo } from '../core/router.js';

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
    } else if (mode === 'multi') {
        optionsHTML = `
            <div class="form-group">
                <label for="player1-name">Player 1 Name</label>
                <input type="text" class="form-control" id="player1-name" placeholder="Enter Player 1 Name" required>
            </div>
            <div class="form-group">
                <label for="player2-name">Player 2 Name</label>
                <input type="text" class="form-control" id="player2-name" placeholder="Enter Player 2 Name" required>
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
    } else if (mode === 'tournament') {
        optionsHTML = `
            <div class="form-group">
                <label for="player1-name">Player 1 Name</label>
                <input type="text" class="form-control" id="player1-name" placeholder="Enter Player 1 Name" required>
            </div>
            <div class="form-group">
                <label for="player2-name">Player 2 Name</label>
                <input type="text" class="form-control" id="player2-name" placeholder="Enter Player 2 Name" required>
            </div>
            <div class="form-group">
                <label for="player3-name">Player 3 Name</label>
                <input type="text" class="form-control" id="player3-name" placeholder="Enter Player 3 Name" required>
            </div>
            <div class="form-group">
                <label for="player4-name">Player 4 Name</label>
                <input type="text" class="form-control" id="player4-name" placeholder="Enter Player 4 Name" required>
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
    }

    document.getElementById('game-options').innerHTML = optionsHTML;
    startBtnHTML = `<button class="btn btn-success" id="start-game-btn">Start Game</button>`;
    document.getElementById('game-start-button').innerHTML = startBtnHTML;
};

export function startGameWithSettings() {
    const maxLength = 15;
    const startBtn = document.getElementById('start-game-btn');
    const playerInputs = document.querySelectorAll('[id^="player"]');

    // 게임 시작 버튼 클릭 이벤트
    startBtn.addEventListener('click', () => {
        let allValid = true;
        const names = Array.from(playerInputs).map((input) =>
            input.value.trim()
        );
        const warningDivs = Array.from(playerInputs).map((input) => {
            let warningDiv =
                input.parentElement.querySelector('.invalid-feedback');
            if (!warningDiv) {
                warningDiv = document.createElement('div');
                warningDiv.className = 'invalid-feedback';
                input.parentElement.appendChild(warningDiv);
            }
            return warningDiv;
        });

        // 각 입력 필드에 대해 유효성 검사
        playerInputs.forEach((input, index) => {
            const warningDiv = warningDivs[index];
            const value = input.value.trim();

            // 15자 제한 검사
            if (value.length > maxLength) {
                input.classList.add('is-invalid');
                warningDiv.textContent = `Name cannot exceed ${maxLength} characters.`;
                allValid = false;
            } else if (value === '') {
                // 필드가 비어있는 경우
                input.classList.add('is-invalid');
                warningDiv.textContent = 'This field is required.';
                allValid = false;
            } else {
                // 중복 검사
                if (names.filter((name) => name === value).length > 1) {
                    input.classList.add('is-invalid');
                    warningDiv.textContent = 'Names must be unique.';
                    allValid = false;
                } else {
                    input.classList.remove('is-invalid');
                    warningDiv.textContent = '';
                }
            }
        });

        if (allValid) {
            updateDifficulty();
            updatePlayerNames(names);
            localStorage.setItem('gameSettings', JSON.stringify(gameSettings));
            navigateTo('/playing');
        }
    });
}
