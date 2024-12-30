import { getMatchOpponent, postMatchResult } from '../../api/match.js';
import { attachEventListener } from './subgameButtonListener.js';
import { didWin } from './subgameDidWin.js';
import { matchStatus } from './subgameMatchStatus.js';

export async function startMatch() {
    let subgameHTML = '';
    let matchHTML = '';

    const data = await getMatchOpponent();
    if (data) {
        matchStatus.me_id = data.id;
        matchStatus.me_select = data.select;

        subgameHTML = `
			<h3>Opponent: ${matchStatus.me_id}</h3>
		`;
        matchHTML = `
			<p>Select what you want to submit</p>
			<div class="btn-group" role="group" aria-label="Basic radio toggle button group">
				<input type="radio" class="btn-check" name="btnradio" id="Rock" autocomplete="off">
				<label class="btn btn-outline-primary" for="Rock">Rock</label>
				
				<input type="radio" class="btn-check" name="btnradio" id="Scissors" autocomplete="off">
				<label class="btn btn-outline-primary" for="Scissors">Scissors</label>
				
				<input type="radio" class="btn-check" name="btnradio" id="Paper" autocomplete="off">
				<label class="btn btn-outline-primary" for="Paper">Paper</label>
			</div>
			<button class="btn btn-success" id="save-button" data-action="showResult" disabled>Submit</button>
		`;
        document.getElementById('subgame-content').innerHTML = subgameHTML;
        document.getElementById('subgame-match').innerHTML = matchHTML;

        attachEventListener();
    } else {
        subgameHTML = `<p>Nobody is waiting for match. Enroll first.</p>`;
        document.getElementById('subgame-content').innerHTML = subgameHTML;
    }
}

export async function showResult() {
    let matchHTML = '';

    const selectedRadio = document.querySelector(
        'input[name="btnradio"]:checked'
    );

    matchStatus.other_id = 1; // 수정 필
    matchStatus.other_select = selectedRadio.getAttribute('id');
    console.log(matchStatus);
    const response = await postMatchResult(matchStatus);
    const winFlag = didWin(matchStatus.other_select, matchStatus.me_select);

    if (winFlag === 0) {
        matchHTML = `
            <p>You lose with ${matchStatus.me_select}</p>
            <button class="btn btn-success" data-action="subgameStart">Play Again!</button>
	    `;
    } else if (winFlag === 1) {
        matchHTML = `
            <p>You win with ${matchStatus.me_select}</p>
            <button class="btn btn-success" data-action="subgameStart">Play Again!</button>
	    `;
    } else {
        matchHTML = `
            <p>Tied with ${matchStatus.me_select}</p>
            <button class="btn btn-success" data-action="subgameStart">Play Again!</button>
	    `;
    }

    document.getElementById('subgame-match').innerHTML = matchHTML;
}
