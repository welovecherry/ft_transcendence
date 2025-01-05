import { navigateTo, handlePopState } from './router.js';
import { eventHandler } from './event.js';
import { handleOAuthCallback } from './auth.js';

export function initializeApp() {
    // 브라우저 히스토리 이벤트 감지
    window.addEventListener('popstate', handlePopState);
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
