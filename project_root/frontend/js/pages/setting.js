export function render() {
    return `
        <h1>Select Game Mode</h1>
        <button class="btn btn-primary" data-action="renderGameOptions" date-mode="single">Single Player</button>
        <button class="btn btn-primary" data-action="renderGameOptions" date-mode="multi">Multiplayer</button>
        <button class="btn btn-primary" data-action="renderGameOptions" date-mode="tournament">Tournament</button>
        <button class="btn btn-primary" data-path="/mypage">My Page</button>
        <div id="game-options"></div>
        <div id="game-start-button"></div>
    `;
}
