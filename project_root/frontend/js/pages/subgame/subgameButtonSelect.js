import { postEnrollment } from '../../api/enroll.js';
import { postMatchResult } from '../../api/match.js';
import { renderSubgameMenu } from './subgameDisplay.js';

export function attachEventListeners() {
    const radioButtons = document.querySelectorAll('input[name="btnradio"]');
    const saveButton = document.getElementById('save-button');

    if (radioButtons) {
        radioButtons.forEach((radio) => {
            radio.addEventListener('change', () => {
                saveButton.disabled = !Array.from(radioButtons).some(
                    (btn) => btn.checked
                );
            });
        });
    }

    // if (saveButton) {
    //     saveButton.addEventListener('click', async () => {
    // const selectedRadio = document.querySelector(
    //     'input[name="btnradio"]:checked'
    // );
    // if (mode === 'enroll') {
    //     let data = {
    //         id: '',
    //         select: '',
    //     };
    //     data.id = 1;
    //     data.select = selectedRadio.getAttribute('id');

    //     const response = await postEnrollment(data);
    //     renderSubgameMenu(mode);
    //         } else if (mode === 'match') {
    //             let data = {
    //                 id: '',
    //                 select: '',
    //             };
    //             data.id = 1;
    //             data.select = selectedRadio.getAttribute('id');
    //             const response = await postMatchResult(data);
    //         }
    //     });
    // }
}
