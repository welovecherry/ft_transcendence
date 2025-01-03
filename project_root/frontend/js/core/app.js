import { navigateTo, handlePopState } from './router.js';
import { eventHandler } from './event.js';
import { handleOAuthCallback } from './auth.js';

export function initializeApp() {
    // 초기에 로드된 페이지 렌더링
    const path = window.location.pathname;
    navigateTo(path);

    // 브라우저 히스토리 이벤트 감지
    window.addEventListener('popstate', handlePopState);

    // 페이지 로드 시 callback 처리
    window.addEventListener('load', () => {
        if (window.location.pathname === '/oauth/callback') {
            handleOAuthCallback();
        }
    });

    // 페이지 내 클릭 이벤트 감지
    document.body.addEventListener('click', eventHandler);
}
