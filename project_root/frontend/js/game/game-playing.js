function loadGame(gameSettings) {
    const gameScreen = document.getElementById('game-screen');
    gameScreen.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'js/game/game.js';
    script.onload = function () {
        // 게임 초기화 함수 호출, gameSettings을 전달하여 시작
        initGame();
    };
    document.body.appendChild(script);
}

// 현재 설정된 게임 설정을 기준으로 게임 로드
const gameSettings = JSON.parse(localStorage.getItem('gameSettings'));
if (gameSettings) {
    loadGame(gameSettings);
} else {
    console.error('No game settings found in localStorage.');
}
