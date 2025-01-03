export async function login() {
    const response = await fetch(`/api/oauth/login/`);
    const authUrl = await response.json();
    window.location.href = authUrl.url;
}

export function sendAuthCode(code) {
    fetch('/api/oauth/access/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: code }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.email) {
                console.log('id: ', data.email);
            } else {
                console.error('Failed to get access token');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
