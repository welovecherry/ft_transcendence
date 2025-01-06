import { navigateTo } from '../core/router.js';

export async function login() {
    const response = await fetch(`/api/oauth/login/`);
    const authUrl = await response.json();
    window.location.href = authUrl.url;
}

export async function sendAuthCode(code) {
    await fetch('/api/oauth/access?code=' + code, {
        method: 'GET',
        credentials: 'include', // 쿠키를 포함한 요청
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.message === 'Login Success') {
                console.log(data.message);
                navigateTo('/setting');
            } else {
                console.error('Failed');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

export async function isAuthenticated() {
    const response = await fetch('/api/oauth/check/', {
        method: 'GET',
        credentials: 'include', // 쿠키를 포함한 요청
    });
    return response.ok;
}