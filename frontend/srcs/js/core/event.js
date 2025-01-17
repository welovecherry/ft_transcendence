import { navigateTo } from './router.js';
import {
    renderGameOptions,
    startGameWithSettings,
} from '../pages/settingOptions.js';
import { renderSubgameMenu } from '../subgame/renderSubgameMenu.js';
import { startMatch, showResult } from '../subgame/match.js';
import { postEnrollment } from '../api/enroll.js';
import { login } from '../api/oauth.js';
import { render } from '../pages/home.js'

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
        startGameWithSettings();
    }

    if (target.matches('[id="backToSetting"]')) {
        render();
    }

    if (target.matches('[data-action="renderSubgameMenu"]')) {
        const mode = target.getAttribute('data-mode');
        renderSubgameMenu(mode);
    }

    if (target.matches('[data-action="subgameSave"]')) {
        const selectedRadio = document.querySelector(
            'input[name="btnradio"]:checked'
        );
        let data = {
            choice: '',
        };
        data.choice = selectedRadio.getAttribute('id');

        await postEnrollment(data);
        renderSubgameMenu('enroll');
    }

    if (target.matches('[data-action="subgameStart"]')) {
        startMatch();
    }

    if (target.matches('[data-action="showResult"]')) {
        showResult();
    }

    if (target.matches('[data-action="login"')) {
        login();
    }
}
