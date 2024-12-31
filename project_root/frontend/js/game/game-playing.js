function loadGame(gameSettings) {
    const gameScreen = document.getElementById('game-screen');
    gameScreen.style.width = '100%';
    gameScreen.style.height = '75vh';
    gameScreen.style.position = 'relative';
    gameScreen.style.aspectRatio = '4:3';
    gameScreen.innerHTML = '';

    const script = document.createElement('script');
    if (gameSettings.gameMode === 'single') {
        script.src = 'js/game/game.js';
    } else {
        script.src = 'js/game/game-multi.js';
    }
    script.onload = function () {
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
