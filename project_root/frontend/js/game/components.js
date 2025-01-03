// 난이도 설정
let gameSettings = {
    gameMode: '',
    playerNames: [],
    difficulty: '',
};
let level = 0;

let playerQueue = [];
let currentRound = 0;
let currentPlayers = [];
let firstRoundWinner = '';

function setGameSettings() {
    gameSettings = JSON.parse(localStorage.getItem('gameSettings'));
    if (gameSettings.difficulty === 'easy') {
        level = 0;
    } else if (gameSettings.difficulty === 'normal') {
        level = 1;
    } else if (gameSettings.difficulty === 'hard') {
        level = 2;
    }

    playerQueue = [...gameSettings.playerNames];
    if (gameSettings.gameMode === 'single') {
        currentPlayers = [1, 'AI']; //user_id로 수정 필요
    } else {
        currentPlayers = [playerQueue[0], playerQueue[1]];
    }
    currentRound = 0;
}

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
const rightPaddleMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 }); // chaged to green
// green: 0x00ff00
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
const ballSpeed = {
    X: 0, // Ball speed in X direction
    Y: 0, // Ball speed in Y direction
};

// Paddle Movement Logic
const paddleSpeed = 0.03; // 패들 이동 속도
const tableHeight = 3; // 테이블 높이

// Paddle flags for movement
const paddleStates = {
    leftPaddleUp: false,
    leftPaddleDown: false,
    rightPaddleUp: false,
    rightPaddleDown: false,
};

// Event listeners for paddle movement
function keyEventListener() {
    document.addEventListener('keydown', (event) => {
        if (['ArrowUp', 'ArrowDown'].includes(event.code))
            event.preventDefault();

        switch (event.code) {
            case 'KeyW':
                paddleStates.leftPaddleUp = true;
                break;
            case 'KeyS':
                paddleStates.leftPaddleDown = true;
                break;
            case 'ArrowUp':
                paddleStates.rightPaddleUp = true;
                break;
            case 'ArrowDown':
                paddleStates.rightPaddleDown = true;
                break;
        }
    });

    document.addEventListener('keyup', (event) => {
        switch (event.code) {
            case 'KeyW':
                paddleStates.leftPaddleUp = false;
                break;
            case 'KeyS':
                paddleStates.leftPaddleDown = false;
                break;
            case 'ArrowUp':
                paddleStates.rightPaddleUp = false;
                break;
            case 'ArrowDown':
                paddleStates.rightPaddleDown = false;
                break;
        }
    });
}

function displayPlayerNames() {
    console.log(ballSpeed.X);
    console.log(ballSpeed.Y);
    const existingElement = document.getElementById('playerNamesDisplay');
    if (existingElement) {
        existingElement.remove(); // 이미 표시된 경우 제거
    }

    let player1 = currentPlayers[0];
    let player2 = currentPlayers[1];

    // 새로운 div 요소 생성
    const playerNamesDisplay = document.createElement('div');
    playerNamesDisplay.id = 'playerNamesDisplay';
    playerNamesDisplay.innerText = `${player1} vs ${player2}`;
    playerNamesDisplay.style.position = 'absolute';
    playerNamesDisplay.style.color = 'black';
    playerNamesDisplay.style.fontSize = '20px';
    playerNamesDisplay.style.fontWeight = 'bold';
    playerNamesDisplay.style.textAlign = 'center';
    playerNamesDisplay.style.zIndex = '1000';

    // game-screen 기준으로 위치 설정
    const gameContainerRect = document
        .getElementById('game-screen')
        .getBoundingClientRect();
    playerNamesDisplay.style.left = `${
        gameContainerRect.left + gameContainerRect.width / 2 - 100
    }px`;
    playerNamesDisplay.style.top = `${
        gameContainerRect.top + gameContainerRect.height / 2 - 15
    }px`;

    // body에 추가
    document.body.appendChild(playerNamesDisplay);
}

// Function to move the ball
function moveBall() {
    ball.position.x += ballSpeed.X; // X축 이동
    ball.position.y += ballSpeed.Y; // Y축 이동

    // 공이 위 또는 아래 벽에 닿으면 반사
    if (ball.position.y > 1.5 || ball.position.y < -1.5) {
        ballSpeed.Y *= -1; // Y 방향 반전
    }

    // 공이 왼쪽 패들과 충돌 시 처리
    if (
        ball.position.x < leftPaddle.position.x + 0.1 && // X 범위 체크
        ball.position.y < leftPaddle.position.y + 0.3 && // Y 범위 체크 (위쪽 경계)
        ball.position.y > leftPaddle.position.y - 0.3 // Y 범위 체크 (아래쪽 경계)
    ) {
        ballSpeed.X *= -1; // X 방향 반전
        ballSpeed.Y += (ball.position.y - leftPaddle.position.y) * 0.03; // Y 방향 조정
    }

    // 공이 오른쪽 패들과 충돌 시 처리
    if (
        ball.position.x > rightPaddle.position.x - 0.1 && // X 범위 체크
        ball.position.y < rightPaddle.position.y + 0.3 && // Y 범위 체크 (위쪽 경계)
        ball.position.y > rightPaddle.position.y - 0.3 // Y 범위 체크 (아래쪽 경계)
    ) {
        ballSpeed.X *= -1; // X 방향 반전
        ballSpeed.Y += (ball.position.y - rightPaddle.position.y) * 0.03; // Y 방향 조정
    }

    if (ball.position.x > 2) {
        endGame(currentPlayers[0]);
        return;
    }
    if (ball.position.x < -2) {
        endGame(currentPlayers[1]);
        return;
    }
}

function endGame(winner) {
    ballSpeed.X = 0;
    ballSpeed.Y = 0;
    ball.position.set(0, 0.1, 0); // 공을 중앙으로 리셋

    // 종료 메시지 생성
    let gameOverMessage = `${winner} Wins!`;
    const gameOverText = document.createElement('div');
    gameOverText.innerText = gameOverMessage;
    gameOverText.style.position = 'absolute';
    gameOverText.style.color = 'blue';
    gameOverText.style.fontSize = '30px';
    gameOverText.style.fontWeight = 'bold';
    gameOverText.style.textAlign = 'center';
    gameOverText.style.zIndex = '1000';

    const gameContainerRect = document
        .getElementById('game-screen')
        .getBoundingClientRect();
    gameOverText.style.left = `${
        gameContainerRect.left + gameContainerRect.width / 2 - 100
    }px`; // 중앙 배치
    gameOverText.style.top = `${
        gameContainerRect.top + gameContainerRect.height / 2 - 15
    }px`; // 중앙 배치

    document.body.appendChild(gameOverText);

    const startGameButton = document.getElementById('startGameButton');
    setTimeout(() => {
        gameOverText.remove();

        if (
            gameSettings.gameMode === 'multi' ||
            gameSettings.gameMode === 'single'
        ) {
            // Multi 모드: 단일 경기 종료
            const playerNamesDisplay =
                document.getElementById('playerNamesDisplay');
            if (playerNamesDisplay) {
                playerNamesDisplay.remove();
            }
            startGameButton.disabled = false;
            startGameButton.textContent = 'Game Over! Restart';
        } else if (gameSettings.gameMode === 'tournament') {
            // Tournament 모드: 3라운드 진행
            currentRound++;
            if (currentRound === 1) {
                // 두 번째 라운드: P3 vs P4
                currentPlayers = [playerQueue[2], playerQueue[3]]; // 다음 경기 선수 설정
            } else if (currentRound === 2) {
                // 마지막 라운드: 첫 번째 라운드 승자 vs 두 번째 라운드 승자
                playerQueue.push(winner); // 이번 라운드 승자를 큐에 추가
                if (!firstRoundWinner) {
                    console.error('First round winner is not defined.');
                    return;
                }
                currentPlayers = [firstRoundWinner, winner];
            } else if (currentRound === 3) {
                // 토너먼트 종료
                const champion = winner;
                const championText = document.createElement('div');
                championText.innerText = `${champion} is the Champion!`;
                championText.style.position = 'absolute';
                championText.style.color = 'green';
                championText.style.fontSize = '40px';
                championText.style.fontWeight = 'bold';
                championText.style.textAlign = 'center';
                championText.style.zIndex = '1000';

                championText.style.left = `${
                    gameContainerRect.left + gameContainerRect.width / 2 - 100
                }px`;
                championText.style.top = `${
                    gameContainerRect.top + gameContainerRect.height / 2 - 15
                }px`;

                document.body.appendChild(championText);

                // 2초 후에 토너먼트 종료 메시지 제거
                setTimeout(() => {
                    const playerNamesDisplay =
                        document.getElementById('playerNamesDisplay');
                    if (playerNamesDisplay) {
                        playerNamesDisplay.remove();
                    }
                    championText.remove();
                    startGameButton.disabled = false;
                    startGameButton.textContent = 'Tournament Over! Restart';
                }, 2000);
                return;
            }

            // 첫 번째 라운드 승자 저장
            if (currentRound === 1) {
                firstRoundWinner = winner;
            }

            // 다음 라운드 준비
            displayPlayerNames();
            setBallSpeed();
            ball.position.set(0, 0.1, 0); // 다음 경기 준비
        }
    }, 2000); // 2초 후에 게임 종료 메시지 제거
}

function setBallSpeed() {
    if (level === 0) {
        ballSpeed.X = 0.020 * (Math.random() > 0.5 ? 1 : -1);
        ballSpeed.Y = 0.020 * (Math.random() > 0.5 ? 1 : -1);
    } else if (level === 1) {
        ballSpeed.X = 0.022 * (Math.random() > 0.5 ? 1 : -1);
        ballSpeed.Y = 0.022 * (Math.random() > 0.5 ? 1 : -1);
    } else if (level === 2) {
        ballSpeed.X = 0.025 * (Math.random() > 0.5 ? 1 : -1);
        ballSpeed.Y = 0.025 * (Math.random() > 0.5 ? 1 : -1);
    }
    console.log('setBallSpeed set');
    console.log(ballSpeed.X);
    console.log(ballSpeed.Y);
}

export {
    gameSettings,
    level,
    scene,
    camera,
    renderer,
    ball,
    paddleGeometry,
    leftPaddle,
    rightPaddle,
    paddleStates,
    light,
    directionalLight,
    net,
    table,
    ballSpeed,
    paddleSpeed,
    tableHeight,
    keyEventListener,
    setGameSettings,
    displayPlayerNames,
    moveBall,
    endGame,
    setBallSpeed,
};
