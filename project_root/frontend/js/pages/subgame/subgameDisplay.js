import { getEnrollment, postEnrollment } from '../../api/enroll.js';
import { attachEventListeners } from './subgameButtonSelect.js';

export const renderSubgameMenu = async (mode) => {
    let subgameHTML = '';

    if (mode === 'enroll') {
        //api 호출 -> 지금 내가 정보 갖고 있는지 보기
        const data = await getEnrollment();
        if (data && data.me_select) {
            subgameHTML = `
				<p>You've already enrolled: ${data.me_select}</p>
				<p>Wait for your opponent...</p>
			`;
        } else {
            subgameHTML = `
				<p>Select what you want to enroll</p>
				<div class="btn-group" role="group" aria-label="Basic radio toggle button group">
					<input type="radio" class="btn-check" name="btnradio" id="btnradio1" autocomplete="off">
					<label class="btn btn-outline-primary" for="btnradio1">Rock</label>
	
					<input type="radio" class="btn-check" name="btnradio" id="btnradio2" autocomplete="off">
					<label class="btn btn-outline-primary" for="btnradio2">Scissors</label>
	
					<input type="radio" class="btn-check" name="btnradio" id="btnradio3" autocomplete="off">
					<label class="btn btn-outline-primary" for="btnradio3">Paper</label>
				</div>
				<button class="btn btn-success" id="save-button" data-action="subgameSave" disabled>Save</button>
			`;
        }
    } else if (mode === 'match') {
        subgameHTML = `
			<button class="btn btn-success" data-action="subgameStart">Start!</button>
		`;
    }

    document.getElementById('subgame-content').innerHTML = subgameHTML;
    document.getElementById('subgame-match').innerHTML = '';

    attachEventListeners();

    const saveButton = document.getElementById('save-button');
    let enrollData = {
        me_id: '',
        me_select: '',
    };

    saveButton.addEventListener('click', async () => {
        const selectedRadio = document.querySelector(
            'input[name="btnradio"]:checked'
        );
        enrollData.me_id = 1;
        enrollData.me_select = selectedRadio.getAttribute('id');
        const data = await postEnrollment(enrollData);

        // renderSubgameMenu;
    });
};
