export let gameSettings = {
    gameMode: '',
    playerNames: [],
    difficulty: '',
};

export const updatePlayerNames = (names) => {
    gameSettings.playerNames = names;
    return { valid: true };
};

export const updateDifficulty = () => {
    gameSettings.difficulty = document.getElementById('difficulty').value;
};
