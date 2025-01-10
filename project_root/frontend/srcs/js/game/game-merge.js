import {
    level,
    gameSettings,
    scene,
    camera,
    renderer,
    ball,
    paddleGeometry,
    leftPaddle,
    rightPaddle,
    paddleStates,
    paddleSpeed,
    tableHeight,
    keyEventListener,
    setGameSettings,
    displayPlayerNames,
    moveBall,
    setBallSpeed,
    ballSpeed,
    paddleHeight,
} from "./components.js";

// 번역 데이터
const translations = {
    en: {
        running: "Game Running...",
        tournamentRunning: "Tournament Running..."
    },
    ko: {
        running: "게임 진행 중...",
        tournamentRunning: "토너먼트 진행 중..."
    },
    ja: {
        running: "ゲーム進行中...",
        tournamentRunning: "トーナメント進行中..."
    },
};

let currentLanguage = localStorage.getItem('language') || 'en';

export let gameStart = false;
export let timeCount = 0;
export function setGameStart(value) {
    gameStart = value;
    timeCount = 0;
}

const aiDifficultyValue = [0.41, 0.28, 0.22];
let singleValue = 0;
let lastAITime = 0;
let targetAIposY = 0;

// 전역 변수 선언
let playerQueue = []; // 선수 큐
let currentRound = 0; // 현재 라운드
let firstRoundWinner = null; // 첫 번째 라운드 승자
let currentPlayers = []; // 현재 플레이어
let isAnimating = false; // Global flag to control animation
let animationFrameId;


function updateLeftPaddles() {
    if (
        paddleStates.leftPaddleUp &&
        leftPaddle.position.y + paddleHeight / 2 <
        tableHeight / 2
    )
        leftPaddle.position.y += paddleSpeed;
    else if (
        paddleStates.leftPaddleDown &&
        leftPaddle.position.y - paddleHeight / 2 >
        -tableHeight / 2
    )
        leftPaddle.position.y -= paddleSpeed;
}

function updateRightPaddles() {
    if (
        paddleStates.rightPaddleUp &&
        rightPaddle.position.y + paddleHeight / 2 <
        tableHeight / 2
    )
        rightPaddle.position.y += paddleSpeed;
    else if (
        paddleStates.rightPaddleDown &&
        rightPaddle.position.y - paddleHeight / 2 >
        -tableHeight / 2
    )
        rightPaddle.position.y -= paddleSpeed;
}

function updateAiPaddles(targetAIposY) {
    if (
        paddleStates.rightPaddleUp &&
        rightPaddle.position.y + paddleHeight / 2 <
        tableHeight / 2 &&
        rightPaddle.position.y <= targetAIposY
    )
        rightPaddle.position.y += paddleSpeed;
    else if (
        paddleStates.rightPaddleDown &&
        rightPaddle.position.y - paddleHeight / 2 >
        -tableHeight / 2 &&
        rightPaddle.position.y >= targetAIposY
    )
        rightPaddle.position.y -= paddleSpeed;
}

function resetTournament() {
    console.log("Resetting tournament...");

    // Reset playerQueue
    playerQueue = [...gameSettings.playerNames];
    console.log("playerQueue reset:", playerQueue);

    // Reset currentRound
    currentRound = 0;
    console.log("currentRound reset to:", currentRound);

    // Reset firstRoundWinner
    firstRoundWinner = null;
    console.log("firstRoundWinner reset to:", firstRoundWinner);

    // 첫 번째 라운드 초기화
    currentPlayers = [playerQueue[0], playerQueue[1]];
    console.log("currentPlayers reset to:", currentPlayers);
}

function updateRound() {
    console.log(`Before update, currentRound: ${currentRound}, currentPlayers:`, currentPlayers);

    if (currentRound === 0) {
        // 첫 번째 라운드
        currentPlayers = [playerQueue[0], playerQueue[1]];
    } else if (currentRound === 1) {
        // 두 번째 라운드
        currentPlayers = [playerQueue[2], playerQueue[3]];
    } else if (currentRound === 2) {
        // 최종 라운드
        if (!firstRoundWinner) {
            console.error("First round winner is not defined.");
            return;
        }
        currentPlayers = [firstRoundWinner, playerQueue[3]];
    }

    console.log(`After update, currentPlayers:`, currentPlayers);
}


function startTournament() {
    const { tournamentRunning } = translations[currentLanguage];

    console.log("Starting a new tournament...");

    resetTournament();
    updateRound();
    console.log("First round currentPlayers:", currentPlayers);

    displayPlayerNames();
    setBallSpeed();
    ball.position.set(0, 0.1, 0);

    startGameButton.textContent = `${tournamentRunning}`;
    startGameButton.disabled = true;
}


function updateAi(timeCount) {
    const X = 0;
    const Y = 1;

    const ballPos = [ball.position.x, ball.position.y];
    const ballSpd = [ballSpeed.X * 100, ballSpeed.Y * 100];
    const rightPaddlePos = [rightPaddle.position.x, rightPaddle.position.y];
    const aiPaddleDiff = aiDifficultyValue[level] + timeCount * 0.002;
    console.log("diff: ", aiPaddleDiff);
    let ballReachPos = [0, 0];

    let reachPaddleTime = 0;
    if (ballSpd[X] > 0) {
        reachPaddleTime = (2 - ballPos[X]) / ballSpd[X];
        ballReachPos[X] = 2;
    } else if (ballSpd[X] < 0) {
        reachPaddleTime = (-2 - ballPos[X]) / ballSpd[X];
        ballReachPos[X] = -2;
    }
    let rawBallReachPosY = ballPos[Y] + ballSpd[Y] * reachPaddleTime;
    while (rawBallReachPosY > 1.5 || rawBallReachPosY < -1.5) {
        if (rawBallReachPosY > 4.5 || rawBallReachPosY < -4.5) {
            rawBallReachPosY =
                rawBallReachPosY > 0
                    ? -(rawBallReachPosY - 3)
                    : -(rawBallReachPosY + 3);
        } else if (rawBallReachPosY > 1.5 || rawBallReachPosY < -1.5) {
            if (rawBallReachPosY > 0)
                rawBallReachPosY = 1.5 - (rawBallReachPosY - 1.5);
            else if (rawBallReachPosY < 0)
                rawBallReachPosY = -1.5 + (-1.5 - rawBallReachPosY);
        }
    }
    ballReachPos[Y] =
        rawBallReachPosY + (0.5 - Math.random()) * 2 * aiPaddleDiff;
    if (ballReachPos[Y] > rightPaddlePos[Y]) {
        targetAIposY = ballReachPos[Y];
        paddleStates.rightPaddleUp = true;
        paddleStates.rightPaddleDown = false;
    } else if (ballReachPos[Y] < rightPaddlePos[Y]) {
        targetAIposY = ballReachPos[Y];
        paddleStates.rightPaddleUp = false;
        paddleStates.rightPaddleDown = true;
    }
}

let lastFrameTime = performance.now(); // 마지막 프레임 시간 저장

let lastTime = 0; // 이전 프레임 시간
const targetFPS = 60; // 목표 FPS (초당 120회)
const interval = 1000 / targetFPS; // 각 프레임 사이의 시간 간격 (밀리초)

let lastTimeMS = 0; // 이전 시간 (밀리초 단위)

function animate(time) {
    const now = performance.now();
    const deltaTime = now - lastTimeMS; // 시간 차이를 밀리초 단위로 계산

    if (deltaTime >= interval) {
        lastTimeMS = now - (deltaTime % interval); // 오버플로우된 시간을 처리

        if (!isAnimating) return; // 애니메이션이 멈추면 실행되지 않음

        // moveBall()에 deltaTime을 전달하여 이동 속도 조정
        moveBall(deltaTime / 1000); // deltaTime을 초 단위로 변환

        updateLeftPaddles();
        if (singleValue === 0) { // Multiplayer
            updateRightPaddles();
        } else if (gameStart === true && singleValue === 1) { // Single player
            const currentTime = Date.now();
            if (currentTime - lastAITime >= 1000) {
                updateAi(timeCount);
                lastAITime = currentTime;
                timeCount++;
                console.log("now: ", timeCount);
            }
            updateAiPaddles(targetAIposY);
        }
        renderer.render(scene, camera);
    }

    // 다음 프레임을 계속 요청
    animationFrameId = requestAnimationFrame(animate);
}

function resetPaddleStates() {
    paddleStates.rightPaddleUp = false;
    paddleStates.rightPaddleDown = false;
    paddleStates.leftPaddleUp = false;
    paddleStates.leftPaddleDown = false;
    console.log("Paddle states reset");
}

export function initGame() {
    const { running } = translations[currentLanguage];

    // Stop any previous animations
    isAnimating = false;

    setTimeout(() => {
        setGameSettings();

        const gameScreen = document.getElementById('game-screen');
        gameScreen.appendChild(renderer.domElement);
        renderer.setSize(gameScreen.offsetWidth, gameScreen.offsetHeight);
        renderer.setClearColor(0xffffff, 1);

        if (gameSettings.gameMode === 'single') {
            singleValue = 1;
        } else {
            singleValue = 0;
            resetPaddleStates();
        }

        const startGameButton = document.getElementById('startGameButton');
        startGameButton.addEventListener('click', () => {
            setGameStart(true);
            leftPaddle.position.set(-2.02, 0, 0.1);
            rightPaddle.position.set(2.02, 0, 0.1);

            console.log('Start button clicked');

            if (
                gameSettings.gameMode === 'single' ||
                gameSettings.gameMode === 'multi'
            ) {
                console.log("setting");
                setBallSpeed();
                displayPlayerNames();
                ball.position.set(0, 0.1, 0);
                startGameButton.textContent = `${running}`;
                startGameButton.disabled = true;
            } else if (gameSettings.gameMode === 'tournament') {
                startTournament();
            }
        });

        keyEventListener();

        // Restart the animation loop
        isAnimating = true;
        animate();
    }, 100); // Add a slight delay to allow cleanup
}

export function resetGame() {
    // 전역 상태 초기화
    isAnimating = false; // 애니메이션 중단
    cancelAnimationFrame(animationFrameId); // 애니메이션 프레임 취소

    // DOM 상태 초기화
    const gameScreen = document.getElementById('game-screen');
    if (gameScreen) {
        gameScreen.innerHTML = ''; // 화면 초기화
    }

    console.log('Game state reset');
}

window.addEventListener('popstate', () => {
    resetGame();
});

export function updateCamera(width, height) {
    const aspect = width / height;
    camera.aspect = aspect; // 카메라 종횡비 업데이트
    camera.updateProjectionMatrix(); // 프로젝션 매트릭스 재계산
    renderer.setSize(width, height); // 렌더러 크기 업데이트
}