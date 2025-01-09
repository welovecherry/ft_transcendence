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
        playAgainButton: "Play Again!",
        timeout: "Timeout!",
        findMatchAgain: "Find match again.",
        choices: {
            Rock: "✊ Rock",
            Scissors: "✌️ Scissors",
            Paper: "🖐️ Paper",
        }
    },
    ko: {
        opponent: "상대방",
        enrollFirst: "매치 대기 중인 사람이 없습니다. 먼저 등록하세요.",
        selectWhatToSubmit: "어떤 것을 낼지 선택하세요",
        submitButton: "제출",
        youLose: "졌습니다..",
        youWin: "이겼습니다!",
        tied: "무승부",
        playAgainButton: "다시 하기",
        timeout: "시간 초과!",
        findMatchAgain: "매치를 다시 시작하세요.",
        choices: {
            Rock: "✊ 바위",
            Scissors: "✌️ 가위",
            Paper: "🖐️ 보"
        }
    },
    ja: {
        opponent: "対戦相手",
        enrollFirst: "対戦待機中の相手がいません。まず登録してください。",
        selectWhatToSubmit: "提出したいものを選んでください",
        submitButton: "提出",
        youLose: "あなたは負けました",
        youWin: "あなたは勝ちました",
        tied: "引き分け",
        playAgainButton: "もう一度遊ぶ",
        timeout: "タイムアウト!",
        findMatchAgain: "もう一度マッチを始めてください",
        choices: {
            Rock: "✊ グー",
            Scissors: "✌️ チョキ",
            Paper: "🖐️ パー"
        }
    }
};

let currentLanguage = localStorage.getItem('language') || 'en';

export async function startMatch() {
    const { opponent, enrollFirst, selectWhatToSubmit, submitButton } = translations[currentLanguage];
    let subgameHTML = '';
    let matchHTML = '';

    const data = await getMatchOpponent();
    if (data && data.other_id) {
        matchStatus.match_id = data.match_id;
        matchStatus.other_id = data.other_id;

        subgameHTML = `
            <p>${opponent}: ${matchStatus.other_id}</p>
        `;
        matchHTML = `
            <p>${selectWhatToSubmit}</p>
            <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
                <input type="radio" class="btn-check" name="btnradio" id="Rock" autocomplete="off">
                <label class="btn btn-outline-primary" for="Rock">Rock</label>
                
                <input type="radio" class="btn-check" name="btnradio" id="Scissors" autocomplete="off">
                <label class="btn btn-outline-primary" for="Scissors">Scissors</label>
                
                <input type="radio" class="btn-check" name="btnradio" id="Paper" autocomplete="off">
                <label class="btn btn-outline-primary" for="Paper">Paper</label>
            </div>
            <button class="btn btn-success" id="save-button" data-action="showResult" disabled>${submitButton}</button>
        `;
        document.getElementById('subgame-content').innerHTML = subgameHTML;
        document.getElementById('subgame-match').innerHTML = matchHTML;

        attachEventListener();
    } else {
        subgameHTML = `<p>${enrollFirst}</p>`;
        document.getElementById('subgame-content').innerHTML = subgameHTML;
        document.getElementById('subgame-match').innerHTML = matchHTML;
    }
}

export async function showResult() {
    const { youLose, youWin, tied, playAgainButton, choices, timeout, findMatchAgain } = translations[currentLanguage];
    let matchHTML = '';

    const selectedRadio = document.querySelector(
        'input[name="btnradio"]:checked'
    );

    matchStatus.choice = selectedRadio.getAttribute('id');
    console.log(matchStatus);
    const response = await postMatchResult(matchStatus);
    if (response.status === 200) {
        const data = response.json();
        const other_choice = data.other_choice;
        const winFlag = didWin(matchStatus.choice, other_choice);
        if (winFlag === 0) {
            matchHTML = `
                <h3>${youLose} 😢</h3>
                <p>You: ${choices[matchStatus.choice]}</p>
                <p>${matchStatus.other_id}: ${choices[matchStatus.other_choice]}</p>
                <button class="btn btn-success" data-action="subgameStart">${playAgainButton}</button>
            `;
        } else if (winFlag === 1) {
            matchHTML = `
                <h3>${youWin} 🥳</h3>
                <p>You: ${choices[matchStatus.choice]}</p>
                <p>${matchStatus.other_id}: ${choices[matchStatus.other_choice]}</p>
                <button class="btn btn-success" data-action="subgameStart">${playAgainButton}</button>
            `;
        } else {
            matchHTML = `
                <h3>${tied} 😏</h3>
                <p>You: ${choices[matchStatus.choice]}</p>
                <p>${matchStatus.other_id}: ${choices[matchStatus.other_choice]}</p>
                <button class="btn btn-success" data-action="subgameStart">${playAgainButton}</button>
            `;
        }
    } else if (response.status === 408) {
        matchHTML = `
            <h3>${timeout}</h3>
            <p>${findMatchAgain}</p>
            <button class="btn btn-success" data-action="subgameStart">${playAgainButton}</button>
        `;
    }

    document.getElementById('subgame-match').innerHTML = matchHTML;
}
