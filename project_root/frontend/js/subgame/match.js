import { getMatchOpponent, postMatchResult } from '../api/match.js';
import { attachEventListener } from './attachEventListener.js';
import { didWin } from './didWin.js';
import { matchStatus } from './matchStatus.js';

const translations = {
    en: {
        opponent: "Opponent",
        enrollFirst: "Nobody is waiting for match. Enroll first.",
        selectWhatToSubmit: "Select what you want to submit",
        submitButton: "Submit",
        youLose: "You lose",
        youWin: "You win",
        tied: "Tied",
        playAgainButton: "Play Again!"
    },
    ko: {
        opponent: "상대방",
        enrollFirst: "매치 대기 중인 사람이 없습니다. 먼저 등록하세요.",
        selectWhatToSubmit: "어떤 것을 낼지 선택하세요",
        submitButton: "제출",
        youLose: "졌습니다..",
        youWin: "이겼습니다!",
        tied: "무승부",
        playAgainButton: "다시 하기"
    },
    ja: {
        opponent: "対戦相手",
        enrollFirst: "対戦待機中の相手がいません。まず登録してください。",
        selectWhatToSubmit: "提出したいものを選んでください",
        submitButton: "提出",
        youLose: "あなたは負けました",
        youWin: "あなたは勝ちました",
        tied: "引き分け",
        playAgainButton: "もう一度遊ぶ"
    }
};

let currentLanguage = localStorage.getItem('language') || 'en';

export async function startMatch() {
    const { opponent, enrollFirst, selectWhatToSubmit, submitButton } = translations[currentLanguage];
    let subgameHTML = '';
    let matchHTML = '';

    const data = await getMatchOpponent();
    if (data && data.id) {
        matchStatus.me_id = data.id;
        matchStatus.me_choice = data.choice;

        subgameHTML = `
            <p>${opponent}: ${matchStatus.me_id}</p>
        `;
        matchHTML = `
            <p>${selectWhatToSubmit}</p>
            <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
                <input type="radio" class="btn-check" name="btnradio" id="Rock" autocomplete="off">
                <label class="btn btn-outline-primary" for="Rock">✊ Rock</label>
                
                <input type="radio" class="btn-check" name="btnradio" id="Scissors" autocomplete="off">
                <label class="btn btn-outline-primary" for="Scissors">✌️ Scissors</label>
                
                <input type="radio" class="btn-check" name="btnradio" id="Paper" autocomplete="off">
                <label class="btn btn-outline-primary" for="Paper">🖐️ Paper</label>
            </div>
            <button class="btn btn-success" id="save-button" data-action="showResult" disabled>${submitButton}</button>
        `;
        document.getElementById('subgame-content').innerHTML = subgameHTML;
        document.getElementById('subgame-match').innerHTML = matchHTML;

        attachEventListener();
    } else {
        subgameHTML = `<p>${enrollFirst}</p>`;
        document.getElementById('subgame-content').innerHTML = subgameHTML;
    }
}

export async function showResult() {
    const { youLose, youWin, tied, playAgainButton } = translations[currentLanguage];
    let matchHTML = '';

    const selectedRadio = document.querySelector(
        'input[name="btnradio"]:checked'
    );

    matchStatus.other_id = 1; // 수정 필
    matchStatus.other_choice = selectedRadio.getAttribute('id');
    console.log(matchStatus);
    const response = await postMatchResult(matchStatus);
    const winFlag = didWin(matchStatus.other_choice, matchStatus.me_choice);

    if (winFlag === 0) {
        matchHTML = `
            <h3>${youLose} 😢</h3>
            <p>You: ${matchStatus.other_choice}</p>
            <p>${matchStatus.me_id}: ${matchStatus.me_choice}</p>
            <button class="btn btn-success" data-action="subgameStart">${playAgainButton}</button>
        `;
    } else if (winFlag === 1) {
        matchHTML = `
            <h3>${youWin} 🥳</h3>
            <p>You: ${matchStatus.other_choice}</p>
            <p>${matchStatus.me_id}: ${matchStatus.me_choice}</p>
            <button class="btn btn-success" data-action="subgameStart">${playAgainButton}</button>
        `;
    } else {
        matchHTML = `
            <h3>${tied} 😏</h3>
            <p>You: ${matchStatus.other_choice}</p>
            <p>${matchStatus.me_id}: ${matchStatus.me_choice}</p>
            <button class="btn btn-success" data-action="subgameStart">${playAgainButton}</button>
        `;
    }

    document.getElementById('subgame-match').innerHTML = matchHTML;
}
