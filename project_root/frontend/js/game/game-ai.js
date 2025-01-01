import {
    level,
    scene,
    camera,
    renderer,
    ball,
    paddleGeometry,
    leftPaddle,
    rightPaddle,
    paddleStates,
    ballSpeed,
    paddleSpeed,
    tableHeight,
    keyEventListener,
    setGameSettings,
    displayPlayerNames,
    moveBall,
} from './components.js';

// Function to update paddle positions
function updateLeftPaddles() {
    if (
        paddleStates.leftPaddleUp &&
        leftPaddle.position.y + paddleGeometry.parameters.height / 2 <
            tableHeight / 2
    )
        leftPaddle.position.y += paddleSpeed;
    if (
        paddleStates.leftPaddleDown &&
        leftPaddle.position.y - paddleGeometry.parameters.height / 2 >
            -tableHeight / 2
    )
        leftPaddle.position.y -= paddleSpeed;
}

function updateRightPaddles(targetAIposY) {
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

let targetAIposY = 0;
function aiProcess(timeCount) {
    console.log('test: ', level);
    const X = 0;
    const Y = 1;

    const ballPos = [ball.position.x, ball.position.y];
    const ballSpd = [ballSpeed.X * 100, ballSpeed.Y * 100];
    const rightPaddlePos = [rightPaddle.position.x, rightPaddle.position.y];
    const diffDefConst = [0.33, 0.3, 0.28];
    const aiPaddleDiff = diffDefConst[level] + timeCount * 0.002;
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

let lastAITime = 0;
let timeCount = 0;

function animate() {
    requestAnimationFrame(animate);

    const currentTime = Date.now();
    moveBall(); // Move the ball
    updateLeftPaddles(); // Update paddle positions
    if (currentTime - lastAITime >= 1000) {
        aiProcess(timeCount); // ai moving
        lastAITime = currentTime;
        timeCount = timeCount + 1;
    }
    updateRightPaddles(targetAIposY);
    renderer.render(scene, camera);
}

export function initGame() {
    setGameSettings();
    const gameScreen = document.getElementById('game-screen');
    gameScreen.appendChild(renderer.domElement); // 렌더러를 DOM에 추가
    renderer.setSize(gameScreen.offsetWidth, gameScreen.offsetHeight); // 렌더러 크기 설정
    renderer.setClearColor(0xffffff, 1); // 배경을 흰색으로 설정
    displayPlayerNames();

    const startGameButton = document.getElementById('startGameButton');
    startGameButton.addEventListener('click', () => {
        ballSpeed.X = 0.02 * (Math.random() > 0.5 ? 1 : -1); // Reduce X speed for slower movement
        ballSpeed.Y = 0.015 * (Math.random() > 0.5 ? 1 : -1); // Reduce Y speed for slower movement
        ball.position.set(0, 0.1, 0); // Ensure ball starts at the center
        startGameButton.textContent = 'Game Running...';
        startGameButton.disabled = true; // Disable the button while the game is running
    });
    keyEventListener();
    animate();
}
