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
}
