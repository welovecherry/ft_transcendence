// 게임 설정에 필요한 정보를 저장할 변수
export let gameSettings = {
    gameMode: '',
    playerNames: [],
    difficulty: '',
};

// 이름 업데이트 함수
export const updatePlayerNames = (names) => {
    gameSettings.playerNames = names;
    return { valid: true };
};

// 난이도 업데이트 함수
export const updateDifficulty = () => {
    gameSettings.difficulty = document.getElementById('difficulty').value;
};
