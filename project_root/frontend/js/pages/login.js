export function render() {
    const content = document.getElementById('content');
    content.innerHTML = '';
    content.innerHTML = `
        <h1>Welcome to Pong Game</h1>
        <button class="btn btn-primary" data-action="navigateTo" data-path="/setting">Start Game</button>
    `;
}
