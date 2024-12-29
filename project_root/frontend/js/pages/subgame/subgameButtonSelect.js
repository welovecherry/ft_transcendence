export function attachEventListeners() {
    const radioButtons = document.querySelectorAll('input[name="btnradio"]');
    const saveButton = document.getElementById('save-button');

    radioButtons.forEach((radio) => {
        radio.addEventListener('change', () => {
            saveButton.disabled = !Array.from(radioButtons).some(
                (btn) => btn.checked
            );
        });
    });

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

        renderSubgameMenu('enroll');
    });
}
