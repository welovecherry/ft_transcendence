import { navigateTo } from './router.js';
import { gameSettings, renderGameOptions } from '../pages/settingOptions.js';
import { renderSubgameMenu } from '../pages/subgame/subgameDisplay.js';
import { startMatch, showResult } from '../pages/subgame/subgameMatch.js';
import { attachEventListener } from '../pages/subgame/subgameButtonListener.js';
import { postEnrollment } from '../api/enroll.js';

// click 이벤트 발생 시 유형에 따라 처리
export async function eventHandler(event) {
    const target = event.target;

    if (target.matches('[data-action="navigateTo"]')) {
        const path = target.getAttribute('data-path');
        navigateTo(path);
    }

    if (target.matches('[data-action="renderGameOptions"]')) {
        const mode = target.getAttribute('data-mode');
        renderGameOptions(mode);
    }

    if (target.matches('[id="start-game-btn"]')) {
        localStorage.setItem('gameSettings', JSON.stringify(gameSettings));
        navigateTo('/playing');
    }

    if (target.matches('[data-action="renderSubgameMenu"]')) {
        const mode = target.getAttribute('data-mode');
        renderSubgameMenu(mode).then(() => {
            attachEventListener();
        });
    }

    if (target.matches('[data-action="subgameSave"]')) {
        const selectedRadio = document.querySelector(
            'input[name="btnradio"]:checked'
        );
        let data = {
            id: '',
            select: '',
        };
        data.id = 1;
        data.select = selectedRadio.getAttribute('id');

        const response = await postEnrollment(data);
        renderSubgameMenu('enroll');
    }

    if (target.matches('[data-action="subgameStart"]')) {
        startMatch();
    }

    if (target.matches('[data-action="showResult"]')) {
        showResult();
    }
}
