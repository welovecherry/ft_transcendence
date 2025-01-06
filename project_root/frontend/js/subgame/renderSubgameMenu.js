import { getEnrollment } from '../api/enroll.js';
import { getHistory } from '../api/history.js';
import { didWin } from './didWin.js';
import { attachEventListener } from './attachEventListener.js';

export const renderSubgameMenu = async (mode) => {
    let subgameHTML = '';

    if (mode === 'enroll') {
        const data = await getEnrollment();
        console.log(data);
        if (data && data.me_choice) {
            subgameHTML = `
				<div class="container mb-5">
					<p>You've already enrolled: ${data.me_choice}</p>
					<p>Wait for your opponent...</p>
				</div>
			`;
        } else {
            subgameHTML = `
				<p>Enroll your choice</p>
				<div class="btn-group" role="group" aria-label="Basic radio toggle button group">
					<input type="radio" class="btn-check" name="btnradio" id="Rock" autocomplete="off">
					<label class="btn btn-outline-primary" for="Rock">✊ Rock</label>
	
					<input type="radio" class="btn-check" name="btnradio" id="Scissors" autocomplete="off">
					<label class="btn btn-outline-primary" for="Scissors">✌️ Scissors</label>
	
					<input type="radio" class="btn-check" name="btnradio" id="Paper" autocomplete="off">
					<label class="btn btn-outline-primary" for="Paper">🖐️ Paper</label>
				</div>
				<button class="btn btn-success" id="save-button" data-action="subgameSave" disabled>Save</button>
			`;
        }
    } else if (mode === 'match') {
        subgameHTML = `
			<button class="btn btn-success" data-action="subgameStart">Start!</button>
		`;
    } else if (mode === 'history') {
        const data = await getHistory();

        let totalCount = 0;
        let winCount = 0;

        data.forEach((match) => {
            totalCount++;
            const me_choice = match.me_choice;
            const other_choice = match.other_choice;

            if (didWin(other_choice, me_choice) === 1) {
                winCount++;
            }
        });

        subgameHTML = `<p>Total count: ${totalCount}</p>
			<p>Win count: ${winCount}</p>`;
    }

    document.getElementById('subgame-content').innerHTML = subgameHTML;
    document.getElementById('subgame-match').innerHTML = '';
    attachEventListener();
};
