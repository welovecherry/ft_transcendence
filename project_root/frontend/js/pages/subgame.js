export function render() {
    return `
        <h1>Rock Scissors Paper</h1>
        <button class="btn btn-primary" data-action="renderSubgameMenu" data-mode="enroll">Enroll</button>
        <button class="btn btn-primary" data-action="renderSubgameMenu" data-mode="match">Match</button>
        <div class="container mt-5" id="subgame-content"></div>
        <div class="container mt-3" id="subgame-match"></div>

        <div class="container mt-10"> 
            <h2>Game History</h2>
            <div id="subgame-history" data-action="showHistory"></div>
        </div>
    `;
}
