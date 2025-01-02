import * as ai from './game-ai.js';
import * as multi from './game-multi.js';
import * as merge from './game-merge.js';

export function loadGame() {
    const gameSettings = JSON.parse(localStorage.getItem('gameSettings'));
    if (gameSettings) {
        const gameScreen = document.getElementById('game-screen');
        gameScreen.style.width = '100%';
        gameScreen.style.height = '75vh';
        gameScreen.style.position = 'relative';
        gameScreen.style.aspectRatio = '4:3';
        gameScreen.innerHTML = '';

        const script = document.createElement('script');
        console.log(gameSettings.gameMode);
        merge.initGame();
        document.body.appendChild(script);
    } else {
        console.error('No game settings found in localStorage.');
    }
}
