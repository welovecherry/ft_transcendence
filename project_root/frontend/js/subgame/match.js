import { getMatchOpponent, postMatchResult } from '../api/match.js';
import { attachEventListener } from './attachEventListener.js';
import { didWin } from './didWin.js';
import { matchStatus } from './matchStatus.js';

export async function startMatch() {
    let subgameHTML = '';
    let matchHTML = '';

    const data = await getMatchOpponent();
    if (data && data.id) {
        matchStatus.me_id = data.id;
        matchStatus.me_choice = data.choice;

        subgameHTML = `
			<p>Opponent: ${matchStatus.me_id}</p>
		`;
        matchHTML = `
			<p>Select what you want to submit</p>
			<div class="btn-group" role="group" aria-label="Basic radio toggle button group">
				<input type="radio" class="btn-check" name="btnradio" id="1" autocomplete="off">
				<label class="btn btn-outline-primary" for="1">✊ Rock</label>
				
				<input type="radio" class="btn-check" name="btnradio" id="2" autocomplete="off">
				<label class="btn btn-outline-primary" for="2">✌️ Scissors</label>
				
				<input type="radio" class="btn-check" name="btnradio" id="3" autocomplete="off">
				<label class="btn btn-outline-primary" for="3">🖐️ Paper</label>
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
    matchStatus.other_choice = selectedRadio.getAttribute('id');
    console.log(matchStatus);
    const response = await postMatchResult(matchStatus);
    const winFlag = didWin(matchStatus.other_choice, matchStatus.me_choice);

    if (winFlag === 0) {
        matchHTML = `
            <h3>You lose 😢</h3>
            <p>You: ${matchStatus.other_choice}</p>
            <p>${matchStatus.me_id}: ${matchStatus.me_choice}</p>
            <button class="btn btn-success" data-action="subgameStart">Play Again!</button>
	    `;
    } else if (winFlag === 1) {
        matchHTML = `
            <h3>You win 🥳</h3>
            <p>You: ${matchStatus.other_choice}</p>
            <p>${matchStatus.me_id}: ${matchStatus.me_choice}</p>
            <button class="btn btn-success" data-action="subgameStart">Play Again!</button>
	    `;
    } else {
        matchHTML = `
            <h3>Tied 😏</h3>
            <p>You: ${matchStatus.other_choice}</p>
            <p>${matchStatus.me_id}: ${matchStatus.me_choice}</p>
            <button class="btn btn-success" data-action="subgameStart">Play Again!</button>
	    `;
    }

    document.getElementById('subgame-match').innerHTML = matchHTML;
}
