import { animate } from './game.js';

document.addEventListener('DOMContentLoaded', function () {
    // 게임 화면을 동적으로 로드하는 함수
    function loadGame(gameSettings) {
        console.log("asdfasdfasdf");
        const gameScreen = document.getElementById('game-screen');
        // 기존에 게임이 있는 경우 제거 (게임 화면을 새로 로드할 때)
        gameScreen.innerHTML = '';

        // 게임 화면 로드
        const script = document.createElement('script');
        script.src = 'game.js'; // 게임 구현된 파일 경로
        script.onload = function () {
            // 게임 초기화 함수 호출, gameSettings을 전달하여 시작
            animate(gameSettings);
        };
        document.body.appendChild(script);
    }

    // 현재 설정된 게임 설정을 기준으로 게임 로드
    const gameSettings = JSON.parse(localStorage.getItem('gameSettings'));
    console.log("asdf");
    loadGame(gameSettings);
});