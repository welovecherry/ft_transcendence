import * as merge from './game-merge.js';

let resizeListenerRegistered = false; // 이벤트 리스너 중복 등록 방지 플래그

export function loadGame() {
    const gameSettings = JSON.parse(localStorage.getItem('gameSettings'));
    if (gameSettings) {
        const gameScreen = document.getElementById('game-screen');
        const gameContainer = document.getElementById('game-container');

        // 부모 요소에서 중앙 정렬 처리
        gameContainer.style.display = 'flex';
        gameContainer.style.flexDirection = 'column';
        gameContainer.style.alignItems = 'center';
        gameContainer.style.justifygameContainer = 'flex-start'; // 텍스트와 게임 화면이 함께 출력되도록 설정
        gameContainer.style.height = '100vh'; // 전체 화면 크기

        // 게임 화면 스타일 설정
        gameScreen.style.position = 'relative';
        gameScreen.style.width = '100%';
        gameScreen.style.maxWidth = '800px'; // 최대 너비 제한
        gameScreen.style.height = '75vh'; // 기본 높이
        gameScreen.style.aspectRatio = '4 / 3'; // 4:3 비율 유지
        gameScreen.style.overflow = 'hidden'; // 넘치는 부분 숨기기
        gameScreen.style.marginTop = '20px'; // 텍스트와 간격 추가
        gameScreen.innerHTML = ''; // DOM 초기화

        // 창 크기 변경 시 gameScreen 크기 조정
        const resizeGameScreen = () => {
            const width = Math.min(window.innerWidth, 800); // 최대 800px로 제한
            const height = Math.min(window.innerHeight * 0.75, width / (4 / 3));
            gameScreen.style.width = `${width}px`;
            gameScreen.style.height = `${height}px`;

            // Three.js 렌더링 업데이트 (merge 내부에서 처리 필요)
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

        // Three.js 게임 초기화 호출
        console.log(gameSettings.gameMode);
        merge.initGame(); // 초기화 후 게임 다시 시작
    } else {
        console.error('No game settings found in localStorage.');
    }
}