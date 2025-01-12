import {
    gameSettings,
    updatePlayerNames,
    updateDifficulty,
} from './updateSettings.js';
import { render } from './playing.js'

const translations = {
    en: {
        gameStart: "Game Start!",
        selectDifficulty: "Select Difficulty",
        enterPlayer: "Enter Player's Name",
        easy: "Easy",
        medium: "Medium",
        hard: "Hard",
        player: "Player",
        name: "Name",
        errOverLength: "Name cannot exceed ${maxLength} characters.",
        errEmptyField: "This field must not be empty",
        errUniqueName: "Name must be unique",
    },
    ko: {
        gameStart: "게임 시작!",
        selectDifficulty: "난이도 선택",
        enterPlayer: "플레이어의 이름 입력",
        easy: "쉬움",
        medium: "보통",
        hard: "어려움",
        player: "플레이어",
        name: "이름",
        errOverLength: "이름은 ${maxLength}자를 넘길 수 없습니다",
        errEmptyField: "빈칸은 허용되지 않습니다.",
        errUniqueName: "중복된 이름이 존재합니다.",
    },
    ja: {
        gameStart: "ゲームスタート!",
        selectDifficulty: "難易度を選択",
        enterPlayer: "プレイヤーの名前を入力",
        easy: "簡単",
        medium: "普通",
        hard: "難しい",
        player: "プレイヤー",
        name: "名前",
        errOverLength: "名前は${maxLength}文字を超えることはできません。",
        errEmptyField: "空欄は許可されていません。",
        errUniqueName: "重複する名前が存在します。",
    },
};

let currentLanguage = localStorage.getItem('language') || 'en';

export const renderGameOptions = (mode) => {
    const { gameStart, enterPlayer, selectDifficulty, easy, medium, hard, player, name } = translations[currentLanguage];
    gameSettings.gameMode = mode;
    gameSettings.playerNames = [];
    gameSettings.difficulty = 'easy';

    let optionsHTML = '';
    let startBtnHTML = '';
    if (mode === 'single') {
        optionsHTML = `
            <div class="form-group">
                <label for="difficulty">${selectDifficulty}</label>
                <select class="form-control" id="difficulty">
                    <option value="easy">${easy}</option>
                    <option value="medium">${medium}</option>
                    <option value="hard">${hard}</option>
                </select>
            </div>
        `;
    } else if (mode === 'multi') {
        optionsHTML = `
            <div class="form-group">
                <label for="player1-name">${player} 1 ${name}</label>
                <input type="text" class="form-control" id="player1-name" placeholder="${enterPlayer}" required>
            </div>
            <div class="form-group">
                <label for="player2-name">${player} 2 ${name}</label>
                <input type="text" class="form-control" id="player2-name" placeholder="${enterPlayer}" required>
            </div>
            <div class="form-group">
                <label for="difficulty">${selectDifficulty}</label>
                <select class="form-control" id="difficulty">
                    <option value="easy">${easy}</option>
                    <option value="medium">${medium}</option>
                    <option value="hard">${hard}</option>
                </select>
            </div>
        `;
    } else if (mode === 'tournament') {
        optionsHTML = `
            <div class="form-group">
                <label for="player1-name">${player} 1 ${name}</label>
                <input type="text" class="form-control" id="player1-name" placeholder="${enterPlayer}" required>
            </div>
            <div class="form-group">
                <label for="player2-name">${player} 2 ${name}</label>
                <input type="text" class="form-control" id="player2-name" placeholder="${enterPlayer}" required>
            </div>
            <div class="form-group">
                <label for="player3-name">${player} 3 ${name}</label>
                <input type="text" class="form-control" id="player3-name" placeholder="${enterPlayer}" required>
            </div>
            <div class="form-group">
                <label for="player4-name">${player} 4 ${name}</label>
                <input type="text" class="form-control" id="player4-name" placeholder="${enterPlayer}" required>
            </div>
            <div class="form-group">
                <label for="difficulty">${selectDifficulty}</label>
                <select class="form-control" id="difficulty">
                    <option value="easy">${easy}</option>
                    <option value="medium">${medium}</option>
                    <option value="hard">${hard}</option>
                </select>
            </div>
        `;
    }

    document.getElementById('game-options').innerHTML = optionsHTML;
    startBtnHTML = `<button class="btn btn-success" id="start-game-btn">${gameStart}</button>`;
    document.getElementById('game-start-button').innerHTML = startBtnHTML;
};

export function startGameWithSettings() {
    const { errEmptyField, errOverLength, errUniqueName } = translations[currentLanguage];
    const maxLength = 15;
    const startBtn = document.getElementById('start-game-btn');
    const playerInputs = document.querySelectorAll('[id^="player"]');

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
            warningDiv.textContent = errOverLength.replace('${maxLength}', maxLength);
            allValid = false;
        } else if (value === '') {
            // 필드가 비어있는 경우
            input.classList.add('is-invalid');
            warningDiv.textContent = `${errEmptyField}`;
            allValid = false;
        } else {
            // 중복 검사
            if (names.filter((name) => name === value).length > 1) {
                input.classList.add('is-invalid');
                warningDiv.textContent = `${errUniqueName}`;
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
        render();
    }
}
