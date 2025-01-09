export function attachEventListener() {
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
}
