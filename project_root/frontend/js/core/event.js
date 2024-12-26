import { navigateTo } from './router.js';
import { gameSettings, renderGameOptions } from '../pages/setting-options.js';

// click 이벤트 발생 시 유형에 따라 처리
export function eventHandler(event) {
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
}
