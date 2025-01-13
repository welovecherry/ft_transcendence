import {
    level,
    gameSettings,
    scene,
    camera,
    renderer,
    ball,
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
import { render } from "../pages/home.js"

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
const aiDifficultyValue = [0.42, 0.29, 0.23];
let singleValue = 0;
let lastAITime = 0;
let targetAIposY = 0;
let playerQueue = [];
let currentRound = 0;
let firstRoundWinner = null;
let currentPlayers = [];
let isAnimating = false;
let animationFrameId;

// 좌측 패들에 대한 이동 논리 함수
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
// 우측 패들에 대한 이동 논리 함수
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
// AI 패들(우측)에 대한 이동 논리 함수
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
// 토너먼트 리셋 함수
function resetTournament() {
    playerQueue = [...gameSettings.playerNames];
    currentRound = 0;
    firstRoundWinner = null;
    currentPlayers = [playerQueue[0], playerQueue[1]];
}
// 라운드 업데이트
function updateRound() {
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
}
// 토너먼트 시작 함수
function startTournament() {
    const { tournamentRunning } = translations[currentLanguage];
    resetTournament();
    updateRound();
    displayPlayerNames();
    setBallSpeed();
    ball.position.set(0, 0.1, 0);
    startGameButton.textContent = `${tournamentRunning}`;
    startGameButton.disabled = true;
}
// AI 논리 알고리즘 함수
function updateAi(timeCount) {
    const X = 0;
    const Y = 1;

    const ballPos = [ball.position.x, ball.position.y];
    const ballSpd = [ballSpeed.X * 100, ballSpeed.Y * 100];
    const rightPaddlePos = [rightPaddle.position.x, rightPaddle.position.y];
    const aiPaddleDiff = aiDifficultyValue[level] + timeCount * 0.002;
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

const targetFPS = 60;
const interval = 1000 / targetFPS;
let lastTimeMS = 0;
function animate() {
    const now = performance.now();
    const deltaTime = now - lastTimeMS;

    if (deltaTime >= interval) {
        lastTimeMS = now - (deltaTime % interval);
        if (!isAnimating)
            return;
        moveBall();
        updateLeftPaddles();
        if (singleValue === 0) {
            updateRightPaddles();
        } else if (gameStart === true && singleValue === 1) {
            const currentTime = Date.now();
            if (currentTime - lastAITime >= 1000) {
                updateAi(timeCount);
                lastAITime = currentTime;
                timeCount++;
            }
            updateAiPaddles(targetAIposY);
        }
        renderer.render(scene, camera);
    }
    // 다음 프레임을 계속 요청
    animationFrameId = requestAnimationFrame(animate);
}
// 패들 상태 초기화 함수
function resetPaddleStates() {
    paddleStates.rightPaddleUp = false;
    paddleStates.rightPaddleDown = false;
    paddleStates.leftPaddleUp = false;
    paddleStates.leftPaddleDown = false;
}
// 게임 시작 함수
export function initGame() {
    const { running } = translations[currentLanguage];
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
            if (
                gameSettings.gameMode === 'single' ||
                gameSettings.gameMode === 'multi'
            ) {
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
        isAnimating = true;
        animate();
    }, 100);
}
// 게임을 리셋하는 함수
export function resetGame() {
    isAnimating = false;
    cancelAnimationFrame(animationFrameId);
    const gameScreen = document.getElementById('game-screen');
    if (gameScreen) {
        gameScreen.innerHTML = '';
    }
}
// 뒤로가기 동작에 대한 이벤트 리스너
window.addEventListener('popstate', () => {
    resetGame();
});

window.addEventListener('visibilitychange', () => {
    if (document.hidden && window.location.pathname === '/home') {
        resetGame();
        render();
    }
});

// 카메라 업데이트 함수
export function updateCamera(width, height) {
    const aspect = width / height;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}