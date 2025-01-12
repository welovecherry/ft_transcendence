import { navigateTo, handlePopState } from './router.js';
import { eventHandler } from './event.js';
import { handleOAuthCallback } from './auth.js';

export async function initializeApp() {
    const path = window.location.pathname;

    if (path === '/oauth/callback') {
        await handleOAuthCallback();
        navigateTo('/setting');
    } else {
        navigateTo(path);
    }

    // 브라우저 히스토리 이벤트 감지
    window.addEventListener('popstate', handlePopState);

    // 페이지 내 클릭 이벤트 감지
    document.body.addEventListener('click', eventHandler);

}
