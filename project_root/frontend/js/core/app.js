import { navigateTo, handlePopState } from './router.js';
import { eventHandler } from './event.js';
import { handleOAuthCallback } from './auth.js';

function resetSettings() {
    localStorage.removeItem('gameSettings');
}

export function initializeApp() {
    // 브라우저 히스토리 이벤트 감지
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.page === 'playing') {
            console.log('playing');
        } else {
            console.log('stopped playing. setting reset');
            resetSettings();
        }
    });

    // 페이지 내 클릭 이벤트 감지
    document.body.addEventListener('click', eventHandler);

    // 페이지 로드 시 callback 처리
    window.addEventListener('DOMContentLoaded', () => {
        if (window.location.pathname === '/oauth/callback') {
            handleOAuthCallback();
        } else {
            const path = window.location.pathname;
            navigateTo(path);
        }
    });
}
