import * as merge from './game-merge.js';

let resizeListenerRegistered = false;

export function loadGame() {
    const gameSettings = JSON.parse(localStorage.getItem('gameSettings'));
    if (gameSettings) {
        const gameScreen = document.getElementById('game-screen');
        const gameContainer = document.getElementById('game-container');
        gameScreen.innerHTML = '';

        // 창 크기 변경 시 gameScreen 크기 조정
        const resizeGameScreen = () => {
            const containerWidth = gameContainer.clientWidth; // 부모 요소 너비
            const containerHeight = gameContainer.clientHeight; // 부모 요소 높이
            const aspectRatio = 4 / 3;
        
            let width = containerWidth;
            let height = containerWidth / aspectRatio;
        
            if (height > containerHeight * 0.75) {
                height = containerHeight * 0.75;
                width = height * aspectRatio;
            }
            gameScreen.style.width = `${Math.floor(width)}px`;
            gameScreen.style.height = `${Math.floor(height)}px`;
            if (merge.updateCamera) {
                merge.updateCamera(parseInt(gameScreen.style.width, 10), parseInt(gameScreen.style.height, 10));
            }
        };

        // 초기 크기 설정
        resizeGameScreen();
        // 중복 등록 방지
        if (!resizeListenerRegistered) {
            window.addEventListener('resize', resizeGameScreen);
            resizeListenerRegistered = true;
        }
        merge.initGame();
    } else {
        console.error('No game settings found in localStorage.');
    }
}