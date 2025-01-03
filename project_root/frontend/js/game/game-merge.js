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
} from "./components.js";

const aiDifficultyValue = [0.33, 0.3, 0.28];
let singleValue = 0;
let lastAITime = 0;
let timeCount = 0;
let targetAIposY = 0;

function updateLeftPaddles() {
    if (
        paddleStates.leftPaddleUp &&
        leftPaddle.position.y + paddleGeometry.parameters.height / 2 <
            tableHeight / 2
    )
        leftPaddle.position.y += paddleSpeed;
    else if (
        paddleStates.leftPaddleDown &&
        leftPaddle.position.y - paddleGeometry.parameters.height / 2 >
            -tableHeight / 2
    )
        leftPaddle.position.y -= paddleSpeed;
}

function updateRightPaddles() {
    if (
        paddleStates.rightPaddleUp &&
        rightPaddle.position.y + paddleGeometry.parameters.height / 2 <
            tableHeight / 2
    )
        rightPaddle.position.y += paddleSpeed;
    else if (
        paddleStates.rightPaddleDown &&
        rightPaddle.position.y - paddleGeometry.parameters.height / 2 >
            -tableHeight / 2
    )
        rightPaddle.position.y -= paddleSpeed;
}

function updateAiPaddles(targetAIposY) {
    if (
        paddleStates.rightPaddleUp &&
        rightPaddle.position.y + paddleGeometry.parameters.height / 2 <
            tableHeight / 2 &&
        rightPaddle.position.y <= targetAIposY
    )
        rightPaddle.position.y += paddleSpeed;
    else if (
        paddleStates.rightPaddleDown &&
        rightPaddle.position.y - paddleGeometry.parameters.height / 2 >
            -tableHeight / 2 &&
        rightPaddle.position.y >= targetAIposY
    )
        rightPaddle.position.y -= paddleSpeed;
}

function startTournament() {
    displayPlayerNames();
    setBallSpeed();
    ball.position.set(0, 0.1, 0);
    startGameButton.textContent = 'Tournament Running...';
    startGameButton.disabled = true;
}

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

function animate() {
    requestAnimationFrame(animate);
    
    moveBall();

    updateLeftPaddles();
    if (singleValue == 0)
        updateRightPaddles();
    else if (singleValue == 1)
    {
        const currentTime = Date.now();
        if (currentTime - lastAITime >= 1000)
        {
            updateAi(timeCount);
            lastAITime = currentTime;
            timeCount++;
        }
        updateAiPaddles(targetAIposY);
    }
    renderer.render(scene, camera);
}

export function initGame() {
    setGameSettings();
    const gameScreen = document.getElementById('game-screen');
    gameScreen.appendChild(renderer.domElement);
    renderer.setSize(gameScreen.offsetWidth, gameScreen.offsetHeight);
    renderer.setClearColor(0xffffff, 1);
    // displayPlayerNames();

    if (gameSettings.gameMode === 'single')
        singleValue = 1;
    else
        singleValue = 0;
    
    const startGameButton = document.getElementById('startGameButton');
    startGameButton.addEventListener('click', () => {
        displayPlayerNames();
        if (gameSettings.gameMode === 'single' ||
                gameSettings.gameMode === 'multi') {
            setBallSpeed();
            ball.position.set(0, 0.1, 0);
            startGameButton.textContent = 'Game Running...';
            startGameButton.disabled = true;
        }
        else if (gameSettings.gameMode === 'tournament') {
            startTournament();
        }
    });
    keyEventListener();
    
    animate();
}