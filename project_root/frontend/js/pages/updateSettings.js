// 게임 설정에 필요한 정보를 저장할 변수
export let gameSettings = {
    gameMode: '',
    playerNames: [],
    difficulty: '',
};

// 이름 업데이트 함수
export const updatePlayerNames = (names) => {
    const uniqueNames = new Set(names);
    if (uniqueNames.size !== names.length) {
        return { valid: false, message: 'Player names must be unique!' };
    }

    if (
        (gameSettings.gameMode === 'multi' && names.length !== 2) ||
        (gameSettings.gameMode === 'tournament' && names.length !== 4)
    ) {
        return { valid: false };
    }
    gameSettings.playerNames = names;
    return { valid: true };
};

// 난이도 업데이트 함수
export const updateDifficulty = () => {
    gameSettings.difficulty = document.getElementById('difficulty').value;
};
