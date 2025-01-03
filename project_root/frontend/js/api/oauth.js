export async function login() {
    const response = await fetch(`/api/oauth/login/`);
    const AuthUrl = await response.text();
    window.location.href = AuthUrl;
}

export function sendAuthCode(code) {
    fetch('/api/oauth/code', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: code }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.access_token) {
                console.log('Access Token:', data.access_token);
            } else {
                console.error('Failed to get access token');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
