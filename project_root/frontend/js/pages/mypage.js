export function render() {
    return `
        <h1>My Page</h1>
        <div id="user-stats">
            <p>LEVEL: <span id="user-level">Loading...</span></p>
            <p>Total Games: <span id="total-games">Loading...</span></p>
            <p>Games Won: <span id="games-won">Loading...</span></p>
            <p>Winning rate: <span id="winning-rate">Loading...</span></p>
            <p>Number of Single play: <span id="single-play">Loading...</span></p>
            <p>Number of Multi play: <span id="multi-play">Loading...</span></p>
            <p>Number of Tournament play: <span id="tournament-play">Loading...</span></p>
        </div>
    `;
}
