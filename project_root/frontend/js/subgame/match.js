import { getMatchOpponent, postMatchResult } from '../api/match.js';
import { attachEventListener } from './attachEventListener.js';
import { didWin } from './didWin.js';
import { matchStatus } from './matchStatus.js';

export async function startMatch() {
    let subgameHTML = '';
    let matchHTML = '';

    const data = await getMatchOpponent();
    if (data && data.other_id) {
        matchStatus.other_id = data.other_id;
        matchStatus.other_choice = data.other_choice;

        subgameHTML = `
			<p>Opponent: ${matchStatus.other_id}</p>
		`;
        matchHTML = `
			<p>Select what you want to submit</p>
			<div class="btn-group" role="group" aria-label="Basic radio toggle button group">
				<input type="radio" class="btn-check" name="btnradio" id="Rock" autocomplete="off">
				<label class="btn btn-outline-primary" for="Rock">✊ Rock</label>
				
				<input type="radio" class="btn-check" name="btnradio" id="Scissors" autocomplete="off">
				<label class="btn btn-outline-primary" for="Scissors">✌️ Scissors</label>
				
				<input type="radio" class="btn-check" name="btnradio" id="Paper" autocomplete="off">
				<label class="btn btn-outline-primary" for="Paper">🖐️ Paper</label>
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

    matchStatus.me_choice = selectedRadio.getAttribute('id');
    console.log(matchStatus);
    const response = await postMatchResult(matchStatus);
    const winFlag = didWin(matchStatus.me_choice, matchStatus.other_choice);

    if (winFlag === 0) {
        matchHTML = `
            <h3>You lose 😢</h3>
            <p>You: ${matchStatus.me_choice}</p>
            <p>${matchStatus.me_id}: ${matchStatus.other_choice}</p>
            <button class="btn btn-success" data-action="subgameStart">Play Again!</button>
	    `;
    } else if (winFlag === 1) {
        matchHTML = `
            <h3>You win 🥳</h3>
            <p>You: ${matchStatus.me_choice}</p>
            <p>${matchStatus.me_id}: ${matchStatus.other_choice}</p>
            <button class="btn btn-success" data-action="subgameStart">Play Again!</button>
	    `;
    } else {
        matchHTML = `
            <h3>Tied 😏</h3>
            <p>You: ${matchStatus.me_choice}</p>
            <p>${matchStatus.me_id}: ${matchStatus.other_choice}</p>
            <button class="btn btn-success" data-action="subgameStart">Play Again!</button>
	    `;
    }

    document.getElementById('subgame-match').innerHTML = matchHTML;
}
