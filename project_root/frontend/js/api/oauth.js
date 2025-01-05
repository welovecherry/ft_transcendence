export async function login() {
    const response = await fetch(`/api/oauth/login/`);
    const authUrl = await response.json();
    window.location.href = authUrl.url;
}

export function sendAuthCode(code) {
    fetch('/api/oauth/access?code=' + code, {
        method: 'GET',
        credentials: 'include', // 쿠키를 포함한 요청
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.message === 'Login Success') {
                console.log(data.message);
            } else {
                console.error('Failed');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
