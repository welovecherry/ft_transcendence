import { getEnrollment } from '../api/enroll.js';
import { getHistory } from '../api/history.js';
import { didWin } from './didWin.js';
import { attachEventListener } from './attachEventListener.js';

// 번역 데이터
const translations = {
    en: {
        enrollMessage: "Enroll your choice",
        rock: "✊ Rock",
        scissors: "✌️ Scissors",
        paper: "🖐️ Paper",
        waitOpponent: "Wait for your opponent...",
        saveButton: "Save",
        startButton: "Start!",
        totalCount: "Total count:",
        winCount: "Win count:",
        alreadyEnrolled: "You've already enrolled", // 추가된 항목
    },
    ko: {
        enrollMessage: "당신의 선택을 등록하세요",
        rock: "✊ 바위",
        scissors: "✌️ 가위",
        paper: "🖐️ 보",
        waitOpponent: "상대를 기다리는 중...",
        saveButton: "저장",
        startButton: "시작!",
        totalCount: "총 횟수:",
        winCount: "승리 횟수:",
        alreadyEnrolled: "이미 등록되었습니다", // 추가된 항목
    },
    ja: {
        enrollMessage: "選択を登録してください",
        rock: "✊ グー",
        scissors: "✌️ チョキ",
        paper: "🖐️ パー",
        waitOpponent: "対戦相手を待っています...",
        saveButton: "保存",
        startButton: "スタート！",
        totalCount: "総数:",
        winCount: "勝利数:",
        alreadyEnrolled: "すでに登録されています", // 추가된 항목
    },
};

let currentLanguage = localStorage.getItem('language') || 'en';

export const renderSubgameMenu = async (mode) => {
    const { enrollMessage, rock, scissors, paper, waitOpponent, saveButton, startButton, totalCount, winCount, alreadyEnrolled } = translations[currentLanguage];

    let subgameHTML = '';

    if (mode === 'enroll') {
        const data = await getEnrollment();
        console.log(data);
        if (data && data.me_choice) {
            subgameHTML = `
                <div class="container mb-5">
                    <p>${alreadyEnrolled}: ${data.me_choice}</p>
                    <p>${waitOpponent}</p>
                </div>
            `;
        } else {
            subgameHTML = `
                <p>${enrollMessage}</p>
                <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
                    <input type="radio" class="btn-check" name="btnradio" id="Rock" autocomplete="off">
                    <label class="btn btn-outline-primary" for="Rock">${rock}</label>

                    <input type="radio" class="btn-check" name="btnradio" id="Scissors" autocomplete="off">
                    <label class="btn btn-outline-primary" for="Scissors">${scissors}</label>

                    <input type="radio" class="btn-check" name="btnradio" id="Paper" autocomplete="off">
                    <label class="btn btn-outline-primary" for="Paper">${paper}</label>
                </div>
                <button class="btn btn-success" id="save-button" data-action="subgameSave" disabled>${saveButton}</button>
            `;
        }
    } else if (mode === 'match') {
        subgameHTML = `
            <button class="btn btn-success" data-action="subgameStart">${startButton}</button>
        `;
    } else if (mode === 'history') {
        const data = await getHistory();

        let totalCountValue = 0;
        let winCountValue = 0;
        let user_id = 1; //이후 수정 필요

        data.forEach((match) => {
            totalCountValue++;
            const me_id = match.me_id;
            const me_choice = match.me_choice;
            const other_id = match.other_id;
            const other_choice = match.other_choice;

            if (me_id === user_id && didWin(me_choice, other_choice) === 1) {
                winCountValue++;
            }
            if (other_id === user_id && didWin(other_choice, me_choice) === 1) {
                winCountValue++;
            }
        });

        subgameHTML = `<p>${totalCount}: ${totalCountValue}</p>
            <p>${winCount}: ${winCountValue}</p>`;
    }

    document.getElementById('subgame-content').innerHTML = subgameHTML;
    document.getElementById('subgame-match').innerHTML = '';
    attachEventListener();
};