import { navigateTo } from './router.js';
import { sendAuthCode } from '../api/oauth.js';

export let isAuthenticated = false;

export function handleOAuthCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const authorizationCode = urlParams.get('code'); // 'code' 파라미터를 추출

    if (authorizationCode) {
        isAuthenticated = true;
        sendAuthCode(authorizationCode);
        navigateTo('setting');
    } else {
        console.error('Authorization Code not found');
    }
}
