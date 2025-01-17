import { sendAuthCode } from '../api/oauth.js';

export async function handleOAuthCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const authorizationCode = urlParams.get('code');

    if (authorizationCode) {
        await sendAuthCode(authorizationCode);
    } else {
        console.error('Authorization Code not found');
    }
}
