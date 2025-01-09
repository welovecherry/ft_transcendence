import * as merge from './game-merge.js';

export function loadGame() {
    const gameSettings = JSON.parse(localStorage.getItem('gameSettings'));
    console.log("please: ", gameSettings.difficulty);
    if (gameSettings) {
        const gameScreen = document.getElementById('game-screen');
        gameScreen.style.width = '100%';
        gameScreen.style.height = '75vh';
        gameScreen.style.position = 'relative';
        gameScreen.style.aspectRatio = '4:3';
        gameScreen.innerHTML = ''; // DOM 초기화

        const script = document.createElement('script');
        console.log(gameSettings.gameMode);
        merge.initGame(); // 초기화 후 게임 다시 시작
        document.body.appendChild(script);
    } else {
        console.error('No game settings found in localStorage.');
    }
}
