import { getHistory } from '../api/history.js';
import { didWin } from './subgame/subgameDidWin.js';

export async function render() {
    const content = document.getElementById('content');
    content.innerHTML = '';
    content.innerHTML = `
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

    const data = await getHistory();

    let totalCount = 0;
    let winCount = 0;
    let user_id = 1;

    data.forEach((match) => {
        totalCount++;
        const me_id = match.me_id;
        const me_select = match.me_select;
        const other_id = match.other_id;
        const other_select = match.other_select;

        if (me_id === user_id && didWin(me_select, other_select) === 1) {
            winCount++;
        }
        if (other_id === user_id && didWin(other_select, me_select) === 1) {
            winCount++;
        }
    });

    const history = document.getElementById('subgame-history');
    history.innerHTML = `<p>Total count: ${totalCount}</p>
        <p>Win count: ${winCount}</p>`;
}
