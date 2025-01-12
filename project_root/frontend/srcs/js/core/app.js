import { renderPage, navigateTo, handlePopState } from './router.js';
import { eventHandler } from './event.js';
import { handleOAuthCallback } from './auth.js';

export async function initializeApp() {
    const path = window.location.pathname;

    if (path === '/oauth/callback') {
        await handleOAuthCallback();
        history.replaceState({ page: 'home' }, '', '/home');
        renderPage('/home');
    } else {
        navigateTo(path);
    }

    window.addEventListener('popstate', handlePopState);
    document.body.addEventListener('click', eventHandler);
}
