export function render() {
    const content = document.getElementById('content');
    content.innerHTML = '';
    content.innerHTML = `
        <h1>Rock Scissors Paper</h1>
        <button class="btn btn-primary" data-action="renderSubgameMenu" data-mode="enroll">Enroll</button>
        <button class="btn btn-primary" data-action="renderSubgameMenu" data-mode="match">Match</button>
        <button class="btn btn-primary" data-action="renderSubgameMenu" data-mode="history">History</button>
        <div class="container mt-5" id="subgame-content"></div>
        <div class="container mt-3" id="subgame-match"></div>
    `;
}
