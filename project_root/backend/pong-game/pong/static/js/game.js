let gameSettings = {
    gameMode: 'multi', // 기본값: multi, multi, tournament
    // gameMode: 'tournament', // 기본값: multi, multi, tournament
    playerNames: ['P1', 'P2', 'p3', 'p4'], 
    difficulty: 'hard', // 기본값: easy,  easy, medium, hard
};

// Three.js 초기화
const scene = new THREE.Scene(); // 씬(Scene) 생성
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // 카메라 설정
const renderer = new THREE.WebGLRenderer(); // 렌더러 생성
renderer.setSize(window.innerWidth, window.innerHeight); // 렌더러 크기 설정
document.getElementById("gameContainer").appendChild(renderer.domElement); // 렌더러를 DOM에 추가

// 배경색 설정 (흰색)
renderer.setClearColor(0xffffff, 1); // 배경을 흰색으로 설정

// 카메라 위치 설정
camera.position.z = 5; // 카메라를 Z축 뒤로 이동 (씬의 내용을 볼 수 있도록)

// 짙은 파란색 직사각형(탁구대) 생성
const tableGeometry = new THREE.PlaneGeometry(4, 3); // 폭 4, 높이 3의 직사각형
const tableMaterial = new THREE.MeshBasicMaterial({ color: 0x000080 }); // 짙은 파란색(Material 색상 설정)
const table = new THREE.Mesh(tableGeometry, tableMaterial); // Geometry와 Material을 합쳐 Mesh 생성
scene.add(table); // 씬에 직사각형 추가

// 네트 생성 (흰색 점선)
// dashSize: 점선의 길이, gapSize: 점선 사이의 간격
const netMaterial = new THREE.LineDashedMaterial({ color: 0xffffff, dashSize: 0.1, gapSize: 0.1 });
const netGeometry = new THREE.BufferGeometry();
const netVertices = new Float32Array([0, 1.5, 0, 0, -1.5, 0]); // 네트 시작점과 끝점
netGeometry.setAttribute("position", new THREE.BufferAttribute(netVertices, 3));
const net = new THREE.Line(netGeometry, netMaterial);
net.computeLineDistances(); // 점선 효과를 위한 거리 계산
scene.add(net); // 씬에 네트 추가

// 패들 생성
const paddleGeometry = new THREE.BoxGeometry(0.1, 0.5, 0.2); // 폭 0.1, 높이 0.5, 깊이 0.2
const leftPaddleMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // 빨간색 패들
const rightPaddleMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 }); // 초록색으로 색깔 바꿈
const leftPaddle = new THREE.Mesh(paddleGeometry, leftPaddleMaterial);
const rightPaddle = new THREE.Mesh(paddleGeometry, rightPaddleMaterial);
leftPaddle.position.set(-2.05, 0, 0.1); // 왼쪽 패들 위치
rightPaddle.position.set(2.05, 0, 0.1); // 오른쪽 패들 위치
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
const paddleSpeed = 0.1; // 패들 이동 속도
const tableHeight = 3; // 테이블 높이

// Paddle flags for movement
let leftPaddleUp = false,
    leftPaddleDown = false,
    rightPaddleUp = false,
    rightPaddleDown = false;

document.addEventListener("keydown", (event) => {
    // 방향키 입력 시 스크롤 방지
    if (["ArrowUp", "ArrowDown"].includes(event.code)) event.preventDefault();

    switch (event.code) {
        case "KeyW":
            leftPaddleUp = true;
            break;
        case "KeyS":
            leftPaddleDown = true;
            break;
        case "ArrowUp":
            rightPaddleUp = true;
            break;
        case "ArrowDown":
            rightPaddleDown = true;
            break;
    }
});

document.addEventListener("keyup", (event) => {
    switch (event.code) {
        case "KeyW":
            leftPaddleUp = false;
            break;
        case "KeyS":
            leftPaddleDown = false;
            break;
        case "ArrowUp":
            rightPaddleUp = false;
            break;
        case "ArrowDown":
            rightPaddleDown = false;
            break;
    }
});

// Function to update paddle positions
function updatePaddles() {
    if (leftPaddleUp && leftPaddle.position.y + paddleGeometry.parameters.height / 2 < tableHeight / 2)
        leftPaddle.position.y += paddleSpeed;
    if (leftPaddleDown && leftPaddle.position.y - paddleGeometry.parameters.height / 2 > -tableHeight / 2)
        leftPaddle.position.y -= paddleSpeed;

    if (rightPaddleUp && rightPaddle.position.y + paddleGeometry.parameters.height / 2 < tableHeight / 2)
        rightPaddle.position.y += paddleSpeed;
    if (rightPaddleDown && rightPaddle.position.y - paddleGeometry.parameters.height / 2 > -tableHeight / 2)
        rightPaddle.position.y -= paddleSpeed;
}

function moveBall() {
    ball.position.x += ballSpeedX; // X축 이동
    ball.position.y += ballSpeedY; // Y축 이동

    // 공이 위 또는 아래 벽에 닿으면 반사
    if (ball.position.y > 1.5 || ball.position.y < -1.5) {
        ballSpeedY *= -1; // Y 방향 반전
    }

    // 공이 왼쪽 또는 오른쪽 경계를 넘으면 게임 종료 또는 라운드 종료
    if (ball.position.x > 2) {
        if (gameSettings.gameMode === "multi") {
            endGame(gameSettings.playerNames[0]); 
        } else if (gameSettings.gameMode === "tournament") {
            // endGameForTournament(currentPlayers[0]);
            endGame(currentPlayers[0]); 
        }
        return;
    }
    if (ball.position.x < -2) {
        if (gameSettings.gameMode === "multi") {
            endGame(gameSettings.playerNames[1]); 
        } else if (gameSettings.gameMode === "tournament") {
            // endGameForTournament(currentPlayers[1]); //
            endGame(currentPlayers[1]);
        }
        return;
    }

    // 공이 왼쪽 패들과 충돌 시 처리
    if (
        ball.position.x < leftPaddle.position.x + 0.1 &&
        ball.position.y < leftPaddle.position.y + 0.25 &&
        ball.position.y > leftPaddle.position.y - 0.25
    ) {
        ballSpeedX *= -1;
        ballSpeedY += (ball.position.y - leftPaddle.position.y) * 0.03;
    }

    // 공이 오른쪽 패들과 충돌 시 처리
    if (
        ball.position.x > rightPaddle.position.x - 0.1 &&
        ball.position.y < rightPaddle.position.y + 0.25 &&
        ball.position.y > rightPaddle.position.y - 0.25
    ) {
        ballSpeedX *= -1;
        ballSpeedY += (ball.position.y - rightPaddle.position.y) * 0.03;
    }
}


function displayPlayerNames() {
    const existingElement = document.getElementById("playerNamesDisplay");
    if (existingElement) {
        existingElement.remove(); // 이미 표시된 경우 제거
    }

    let player1, player2;

    if (gameSettings.gameMode === "multi") {
        // Multi 모드
        player1 = gameSettings.playerNames[0];
        player2 = gameSettings.playerNames[1];
    } else if (gameSettings.gameMode === "tournament") {
        // Tournament 모드
        player1 = currentPlayers[0];
        player2 = currentPlayers[1];
    } else {
        console.error("Unknown game mode:", gameSettings.gameMode);
        return;
    }

    // 새로운 div 요소 생성
    const playerNamesDisplay = document.createElement("div");
    playerNamesDisplay.id = "playerNamesDisplay";
    playerNamesDisplay.innerText = `${player1} vs ${player2}`;
    playerNamesDisplay.style.position = "absolute";
    playerNamesDisplay.style.color = "black";
    playerNamesDisplay.style.fontSize = "20px";
    playerNamesDisplay.style.fontWeight = "bold";
    playerNamesDisplay.style.textAlign = "center";

    // gameContainer 기준으로 위치 설정
    const gameContainerRect = document.getElementById("gameContainer").getBoundingClientRect();
    playerNamesDisplay.style.left = `${gameContainerRect.left + gameContainerRect.width / 2 - 60}px`;
    playerNamesDisplay.style.top = `${gameContainerRect.bottom + 800}px`;

    // body에 추가
    document.body.appendChild(playerNamesDisplay);
}


function startTournament() {
    // Prepare the player queue with the tournament participants
    playerQueue = [...gameSettings.playerNames]; // Copy all player names from settings
    currentRound = 0; // Start from the first round

    // 첫 번째 라운드: P1 vs P2
    currentPlayers = [playerQueue[0], playerQueue[1]];
    displayPlayerNames(); // Display the names of the first match
    setBallSpeed(); // Set the ball speed based on difficulty
    ball.position.set(0, 0.1, 0); // Ensure the ball starts at the center
    startGameButton.textContent = "Tournament Running...";
    startGameButton.disabled = true; // Disable the start button during the tournament
}

function endGame(winner) {
    ballSpeedX = 0;
    ballSpeedY = 0;
    ball.position.set(0, 0.1, 0); // 공을 중앙으로 리셋

    // 종료 메시지 생성
    let gameOverMessage = `${winner} Wins!`;
    const gameOverText = document.createElement("div");
    gameOverText.innerText = gameOverMessage;
    gameOverText.style.position = "absolute";
    gameOverText.style.color = "blue";
    gameOverText.style.fontSize = "30px";
    gameOverText.style.fontWeight = "bold";
    gameOverText.style.textAlign = "center";

    const gameContainerRect = document.getElementById("gameContainer").getBoundingClientRect();
    gameOverText.style.left = `${gameContainerRect.left + gameContainerRect.width / 2 - 80}px`;
    gameOverText.style.top = `${gameContainerRect.bottom + 850}px`;

    document.body.appendChild(gameOverText);

    setTimeout(() => {
        gameOverText.remove();

        if (gameSettings.gameMode === "multi") {
            // Multi 모드: 단일 경기 종료
            const playerNamesDisplay = document.getElementById("playerNamesDisplay");
            if (playerNamesDisplay) {
                playerNamesDisplay.remove();
            }
            startGameButton.disabled = false;
            startGameButton.textContent = "Game Over! Restart";
        } else if (gameSettings.gameMode === "tournament") {
            // Tournament 모드: 3 라운드 진행
            currentRound++;

            if (currentRound === 1) {
                // 두 번째 라운드: P3 vs P4
                currentPlayers = [playerQueue[2], playerQueue[3]];
            } else if (currentRound === 2) {
                // 마지막 라운드: 첫 번째 라운드 승자 vs 두 번째 라운드 승자
                playerQueue.push(winner); // 이번 라운드 승자를 큐에 추가
                if (!firstRoundWinner) {
                    console.error("First round winner is not defined.");
                    return;
                }
                currentPlayers = [firstRoundWinner, winner];
            } else if (currentRound === 3) {
                // 토너먼트 종료
                const champion = winner;
                const championText = document.createElement("div");
                championText.innerText = `${champion} is the Champion!`;
                championText.style.position = "absolute";
                championText.style.color = "green";
                championText.style.fontSize = "40px";
                championText.style.fontWeight = "bold";
                championText.style.textAlign = "center";

                championText.style.left = `${gameContainerRect.left + gameContainerRect.width / 2 - 190}px`;
                championText.style.top = `${gameContainerRect.bottom + 850}px`;

                document.body.appendChild(championText);

                setTimeout(() => {
                    const playerNamesDisplay = document.getElementById("playerNamesDisplay");
                    if (playerNamesDisplay) {
                        playerNamesDisplay.remove();
                    }
                    championText.remove();
                    startGameButton.disabled = false;
                    startGameButton.textContent = "Tournament Over! Restart";
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
    }, 2000);
}



function setBallSpeed() {
    if (gameSettings.difficulty === 'easy') {
        ballSpeedX = 0.01 * (Math.random() > 0.5 ? 1 : -1);
        ballSpeedY = 0.008 * (Math.random() > 0.5 ? 1 : -1);
    } else if (gameSettings.difficulty === 'medium') {
        ballSpeedX = 0.025 * (Math.random() > 0.5 ? 1 : -1);
        ballSpeedY = 0.015 * (Math.random() > 0.5 ? 1 : -1);
    } else if (gameSettings.difficulty === 'hard') {
        ballSpeedX = 0.045 * (Math.random() > 0.5 ? 1 : -1);
        ballSpeedY = 0.025 * (Math.random() > 0.5 ? 1 : -1);
    }
}

startGameButton.addEventListener("click", () => {
    if (gameSettings.gameMode === "multi") {
        displayPlayerNames(); // Display P1 vs P2
        setBallSpeed(); // Set ball speed based on difficulty
        ball.position.set(0, 0.1, 0); // Ensure ball starts at the center
        startGameButton.textContent = "Game Running...";
        startGameButton.disabled = true; // Disable the button while the game is running
    } else if (gameSettings.gameMode === "tournament") {
        startTournament(); // Initialize and start the tournament
    }
});


function animate() {
    requestAnimationFrame(animate);
    
    if (gameSettings.gameMode === "multi") {
        moveBall();
    } else if (gameSettings.gameMode === "tournament") {
        moveBall();
    }
    updatePaddles();
    renderer.render(scene, camera);
}


animate(); // Start animation loop