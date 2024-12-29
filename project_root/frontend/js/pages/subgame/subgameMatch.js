import { attachEventListeners } from './subgameButtonSelect.js';

export function startMatch() {
    let subgameHTML = '';
    let matchHTML = '';

    //api 호출
    subgameHTML = `
	<h3>Opponent: someone</h3>
	`;
    matchHTML = `
	<p>Select what you want to submit</p>
	<div class="btn-group" role="group" aria-label="Basic radio toggle button group">
	<input type="radio" class="btn-check" name="btnradio" id="btnradio1" autocomplete="off">
	<label class="btn btn-outline-primary" for="btnradio1">Rock</label>
	
	<input type="radio" class="btn-check" name="btnradio" id="btnradio2" autocomplete="off">
	<label class="btn btn-outline-primary" for="btnradio2">Scissors</label>
	
	<input type="radio" class="btn-check" name="btnradio" id="btnradio3" autocomplete="off">
	<label class="btn btn-outline-primary" for="btnradio3">Paper</label>
	</div>
	<button class="btn btn-success" id="save-button" data-action="showResult" disabled>Submit</button>
	`;
    document.getElementById('subgame-content').innerHTML = subgameHTML;
    document.getElementById('subgame-match').innerHTML = matchHTML;

    attachEventListeners();
}

export function showResult() {
    let matchHTML = '';

    const selectedRadio = document.querySelector(
        'input[name="btnradio"]:checked'
    );

    matchHTML = `
	<p>you win with ${selectedRadio.getAttribute('id')}</p>
	<button class="btn btn-success" data-action="subgameStart">Restart!</button>
	`;

    document.getElementById('subgame-match').innerHTML = matchHTML;
}
