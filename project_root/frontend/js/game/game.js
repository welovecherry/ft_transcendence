// 난이도 설정
const test = JSON.parse(localStorage.getItem('gameSettings'));
const difficulty_test = test.difficulty;
let level = 0;
if (difficulty_test == 'easy')
    level = 0;
else if (difficulty_test == 'normal')
    level = 1;
else (difficulty_test == 'hard')
    level = 2;

// Three.js 초기화
const scene = new THREE.Scene(); // 씬(Scene) 생성
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
); // 카메라 설정
const renderer = new THREE.WebGLRenderer(); // 렌더러 생성

// 카메라 위치 설정
camera.position.z = 2.3; // 카메라를 Z축 뒤로 이동 (씬의 내용을 볼 수 있도록)

// 짙은 파란색 직사각형(탁구대) 생성
const tableGeometry = new THREE.PlaneGeometry(4, 3); // 폭 4, 높이 3의 직사각형
const tableMaterial = new THREE.MeshBasicMaterial({ color: 0x000080 }); // 짙은 파란색(Material 색상 설정)
const table = new THREE.Mesh(tableGeometry, tableMaterial); // Geometry와 Material을 합쳐 Mesh 생성
scene.add(table); // 씬에 직사각형 추가

// 네트 생성 (흰색 점선)
const netMaterial = new THREE.LineDashedMaterial({
    color: 0xffffff,
    dashSize: 0.1,
    gapSize: 0.1,
});
const netGeometry = new THREE.BufferGeometry();
const netVertices = new Float32Array([0, 1.5, 0, 0, -1.5, 0]); // 네트 시작점과 끝점
netGeometry.setAttribute('position', new THREE.BufferAttribute(netVertices, 3));
const net = new THREE.Line(netGeometry, netMaterial);
net.computeLineDistances(); // 점선 효과를 위한 거리 계산
scene.add(net); // 씬에 네트 추가

// 패들 생성
const paddleGeometry = new THREE.BoxGeometry(0.1, 0.6, 0.2); // 폭 0.1, 높이 0.6, 깊이 0.2
const leftPaddleMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // 빨간색 패들
const rightPaddleMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff }); // 파란색 패들
const leftPaddle = new THREE.Mesh(paddleGeometry, leftPaddleMaterial);
const rightPaddle = new THREE.Mesh(paddleGeometry, rightPaddleMaterial);
leftPaddle.position.set(-2.02, 0, 0.1); // 왼쪽 패들 위치
rightPaddle.position.set(2.02, 0, 0.1); // 오른쪽 패들 위치
scene.add(leftPaddle);
scene.add(rightPaddle);

// 조명 추가 (패들이 3D로 보이도록)
const light = new THREE.PointLight(0xffffff, 1, 10);
light.position.set(0, 5, 5); // 조명 위치
scene.add(light);

// 밝은 방향 조명 추가
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); // 밝은 흰색 조명
directionalLight.position.set(0, 5, 5); // 위쪽 및 약간 앞쪽에 배치
scene.add(directionalLight);

// 공 생성 (Orange 3D Ball)
const ballGeometry = new THREE.SphereGeometry(0.15, 32, 32); // 구체 생성
const ballMaterial = new THREE.MeshStandardMaterial({ color: 0xffa500 }); // 주황색
const ball = new THREE.Mesh(ballGeometry, ballMaterial);
ball.position.set(0, 0.1, 0); // 공 초기 위치
scene.add(ball);

// Ball movement variables
let ballSpeedX = 0; // Ball speed in X direction
let ballSpeedY = 0; // Ball speed in Y direction

// Paddle Movement Logic
const paddleSpeed = 0.03; // 패들 이동 속도
const tableHeight = 3; // 테이블 높이

// Paddle flags for movement
let leftPaddleUp = false,
    leftPaddleDown = false,
    rightPaddleUp = false,
    rightPaddleDown = false;

// Event listeners for paddle movement
document.addEventListener('keydown', (event) => {
    if (['ArrowUp', 'ArrowDown'].includes(event.code)) event.preventDefault();

    switch (event.code) {
        case 'KeyW':
            leftPaddleUp = true;
            break;
        case 'KeyS':
            leftPaddleDown = true;
            break;
        case 'ArrowUp':
            rightPaddleUp = true;
            break;
        case 'ArrowDown':
            rightPaddleDown = true;
            break;
    }
});

document.addEventListener('keyup', (event) => {
    switch (event.code) {
        case 'KeyW':
            leftPaddleUp = false;
            break;
        case 'KeyS':
            leftPaddleDown = false;
            break;
        case 'ArrowUp':
            rightPaddleUp = false;
            break;
        case 'ArrowDown':
            rightPaddleDown = false;
            break;
    }
});

// Function to update paddle positions
function updateLeftPaddles() {
    if (
        leftPaddleUp &&
        leftPaddle.position.y + paddleGeometry.parameters.height / 2 <
            tableHeight / 2
    )
        leftPaddle.position.y += paddleSpeed;
    if (
        leftPaddleDown &&
        leftPaddle.position.y - paddleGeometry.parameters.height / 2 >
            -tableHeight / 2
    )
        leftPaddle.position.y -= paddleSpeed;
}

function updateRightPaddles(targetAIposY) {
    if (
        rightPaddleUp &&
        rightPaddle.position.y + paddleGeometry.parameters.height / 2 <
            tableHeight / 2 &&
        rightPaddle.position.y <= targetAIposY
    )
        rightPaddle.position.y += paddleSpeed;
    else if (
        rightPaddleDown &&
        rightPaddle.position.y - paddleGeometry.parameters.height / 2 >
            -tableHeight / 2 &&
        rightPaddle.position.y >= targetAIposY
    )
        rightPaddle.position.y -= paddleSpeed;
}

// Function to move the ball
function moveBall() {
    ball.position.x += ballSpeedX; // X축 이동
    ball.position.y += ballSpeedY; // Y축 이동

    // 공이 위 또는 아래 벽에 닿으면 반사
    if (ball.position.y > 1.5 || ball.position.y < -1.5) {
        ballSpeedY *= -1; // Y 방향 반전
    }

    // 공이 왼쪽 패들과 충돌 시 처리
    if (
        ball.position.x < leftPaddle.position.x + 0.1 && // X 범위 체크
        ball.position.y < leftPaddle.position.y + 0.3 && // Y 범위 체크 (위쪽 경계)
        ball.position.y > leftPaddle.position.y - 0.3 // Y 범위 체크 (아래쪽 경계)
    ) {
        ballSpeedX *= -1; // X 방향 반전
        ballSpeedY += (ball.position.y - leftPaddle.position.y) * 0.03; // Y 방향 조정
    }

    // 공이 오른쪽 패들과 충돌 시 처리
    if (
        ball.position.x > rightPaddle.position.x - 0.1 && // X 범위 체크
        ball.position.y < rightPaddle.position.y + 0.3 && // Y 범위 체크 (위쪽 경계)
        ball.position.y > rightPaddle.position.y - 0.3 // Y 범위 체크 (아래쪽 경계)
    ) {
        ballSpeedX *= -1; // X 방향 반전
        ballSpeedY += (ball.position.y - rightPaddle.position.y) * 0.03; // Y 방향 조정
    }

    // 공이 왼쪽 또는 오른쪽 벽에 닿으면 게임 종료
    if (ball.position.x > 2 || ball.position.x < -2) {
        endGame();
    }
}

// Function to end the game
function endGame() {
    ballSpeedX = 0; // Stop ball movement
    ballSpeedY = 0;
    ball.position.set(0, 0.1, 0); // Reset ball to the center of the table
    startGameButton.textContent = 'Game Over! Restart'; // Update button text
    startGameButton.disabled = false; // Enable the button for restart
}

let targetAIposY = 0;
function aiProcess(timeCount) {
    console.log("test: ", level);
    const X = 0;
    const Y = 1;

    const ballPos = [ball.position.x, ball.position.y];
    const ballSpeed = [ballSpeedX * 100, ballSpeedY * 100];
    const rightPaddlePos = [rightPaddle.position.x, rightPaddle.position.y];
    const diffDefConst = [0.33, 0.3, 0.28];
    const aiPaddleDiff = diffDefConst[level] + timeCount * 0.002;
    let ballReachPos = [0, 0];

    let reachPaddleTime = 0;
    if (ballSpeed[X] > 0) {
        reachPaddleTime = (2 - ballPos[X]) / ballSpeed[X];
        ballReachPos[X] = 2;
    } else if (ballSpeed[X] < 0) {
        reachPaddleTime = (-2 - ballPos[X]) / ballSpeed[X];
        ballReachPos[X] = -2;
    }
    let rawBallReachPosY = ballPos[Y] + ballSpeed[Y] * reachPaddleTime;
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
        rightPaddleUp = true;
        rightPaddleDown = false;
    } else if (ballReachPos[Y] < rightPaddlePos[Y]) {
        targetAIposY = ballReachPos[Y];
        rightPaddleUp = false;
        rightPaddleDown = true;
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

function initGame() {
    const gameScreen = document.getElementById('game-screen');
    gameScreen.appendChild(renderer.domElement); // 렌더러를 DOM에 추가
    renderer.setSize(gameScreen.offsetWidth, gameScreen.offsetHeight); // 렌더러 크기 설정
    renderer.setClearColor(0xffffff, 1); // 배경을 흰색으로 설정

    const startGameButton = document.getElementById('startGameButton');
    startGameButton.addEventListener('click', () => {
        ballSpeedX = 0.02 * (Math.random() > 0.5 ? 1 : -1); // Reduce X speed for slower movement
        ballSpeedY = 0.015 * (Math.random() > 0.5 ? 1 : -1); // Reduce Y speed for slower movement
        ball.position.set(0, 0.1, 0); // Ensure ball starts at the center
        startGameButton.textContent = 'Game Running...';
        startGameButton.disabled = true; // Disable the button while the game is running
    });
    animate();
}
