export function render() {
    const content = document.getElementById('content');
    content.innerHTML = '';
    content.innerHTML = `
        <h1>Select Game Mode</h1>
        <button class="btn btn-primary" data-action="renderGameOptions" data-mode="single">👤 Single Player</button>
        <button class="btn btn-primary" data-action="renderGameOptions" data-mode="multi">👥 Multiplayer</button>
        <button class="btn btn-primary" data-action="renderGameOptions" data-mode="tournament">🏆 Tournament</button>
        <button class="btn btn-primary" data-action="navigateTo" data-path="/subgame">👋 Sub Game</button>
        <div id="game-options"></div>
        <div id="game-start-button"></div>
    `;
}
