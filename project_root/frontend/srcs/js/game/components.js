import { setGameStart } from "./game-merge.js";

const translations = {
    en: {
        user: "User",
        championMsg: "is the champion!",
        win: "Wins!",
        restart: "Game Over! Restart",
        tournamentOver: "Tournament Over!",
    },
    ko: {
        user: "사용자",
        championMsg: "최종 승!",
        win: "승!",
        restart: "게임 종료! 다시 하기",
        tournamentOver: "토너먼트 종료!",
    },
    ja: {
        user: "ユーザー",
        championMsg: "がチャンピオンです！",
        win: "勝利！",
        restart: "ゲーム終了！再スタート",
        tournamentOver: "トーナメント終了！",
    },
};

let currentLanguage = localStorage.getItem('language') || 'en';

let gameSettings = {
    gameMode: '',
    playerNames: [],
    difficulty: '',
};

gameSettings = JSON.parse(localStorage.getItem('gameSettings'));

let level = 0;
let playerQueue = [];
let currentRound = 0;
let currentPlayers = [];
let firstRoundWinner = '';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
const renderer = new THREE.WebGLRenderer();
camera.position.z = 2.25;

// 탁구대 생성
const tableGeometry = new THREE.PlaneGeometry(4, 3);
const tableMaterial = new THREE.MeshBasicMaterial({ color: 0x000080 });
const table = new THREE.Mesh(tableGeometry, tableMaterial);
scene.add(table);

// 네트 생성
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
let paddleHeight = 0.6;
const paddleGeometry = new THREE.BoxGeometry(0.1, paddleHeight, 0.2);
const leftPaddleMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const rightPaddleMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const leftPaddle = new THREE.Mesh(paddleGeometry, leftPaddleMaterial);
const rightPaddle = new THREE.Mesh(paddleGeometry, rightPaddleMaterial);
leftPaddle.position.set(-2.02, 0, 0.1);
rightPaddle.position.set(2.02, 0, 0.1);
scene.add(leftPaddle);
scene.add(rightPaddle);

// 조명 추가
const light = new THREE.PointLight(0xffffff, 1, 10);
light.position.set(0, 5, 5);
scene.add(light);

// 밝은 방향 조명 추가
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(0, 5, 5);
scene.add(directionalLight);

// 공 생성
const ballGeometry = new THREE.SphereGeometry(0.15, 32, 32);
const ballMaterial = new THREE.MeshStandardMaterial({ color: 0xffa500 });
const ball = new THREE.Mesh(ballGeometry, ballMaterial);
ball.position.set(0, 0.1, 0);
scene.add(ball);

// 공 속도값 변수
let ballSpeed = {
    X: 0,
    Y: 0,
};

// 패들, 테이블의 속성값
const paddleSpeed = 0.06; // 패들 이동 속도
const tableHeight = 3; // 테이블 높이

// 이벤트 리스너의 작동과 관련한 패들 상태 변수
const paddleStates = {
    leftPaddleUp: false,
    leftPaddleDown: false,
    rightPaddleUp: false,
    rightPaddleDown: false,
};

// 패들 이동 함수
function keyEventListener() {
    // 키를 눌렀을 때의 이벤트 리스너
    document.addEventListener('keydown', (event) => {
        if (['ArrowUp', 'ArrowDown'].includes(event.code)) {
            event.preventDefault();
            // AI 모드(single mode)일 경우, 오른쪽 패들은 작동하지 않음
            if (gameSettings.gameMode === 'multi' || gameSettings.gameMode === 'tournament') {
                switch (event.code) {
                    case 'ArrowUp':
                        paddleStates.rightPaddleUp = true;
                        break;
                    case 'ArrowDown':
                        paddleStates.rightPaddleDown = true;
                        break;
                }
            }
        }
        // 좌측 패들 이벤트
        switch (event.code) {
            case 'KeyW':
                paddleStates.leftPaddleUp = true;
                break;
            case 'KeyS':
                paddleStates.leftPaddleDown = true;
                break;
        }
    });
    // 키를 뗐을 때의 이벤트 리스너
    document.addEventListener('keyup', (event) => {
        if (['ArrowUp', 'ArrowDown'].includes(event.code)) {
            // AI 모드(single mode)일 경우, 오른쪽 패들은 작동하지 않음
            if (gameSettings.gameMode === 'multi' || gameSettings.gameMode === 'tournament') {
                switch (event.code) {
                    case 'ArrowUp':
                        paddleStates.rightPaddleUp = false;
                        break;
                    case 'ArrowDown':
                        paddleStates.rightPaddleDown = false;
                        break;
                }
            }
        }
        // 좌측 패들 이벤트
        switch (event.code) {
            case 'KeyW':
                paddleStates.leftPaddleUp = false;
                break;
            case 'KeyS':
                paddleStates.leftPaddleDown = false;
                break;
        }
    });
}

// 플레이어의 이름을 출력하는 함수
function displayPlayerNames() {
    const existingElement = document.getElementById('playerNamesDisplay');
    // 이미 표시된 경우 제거
    if (existingElement) {
        existingElement.remove();
    }

    let player1 = currentPlayers[0];
    let player2 = currentPlayers[1];

    // 새로운 div 요소 생성
    const playerNamesDisplay = document.createElement('div');
    playerNamesDisplay.id = 'playerNamesDisplay';
    playerNamesDisplay.innerText = `${player1} : ${player2}`;
    playerNamesDisplay.style.position = 'absolute';
    playerNamesDisplay.style.color = 'black';
    playerNamesDisplay.style.fontSize = '18px';
    playerNamesDisplay.style.fontWeight = 'bold';
    playerNamesDisplay.style.textAlign = 'center';
    playerNamesDisplay.style.zIndex = '1000';

    const playerInfoDiv = document.getElementById('player-info');
    if (playerInfoDiv) {
        playerInfoDiv.appendChild(playerNamesDisplay);
    }
}

// 공 이동 함수
function moveBall() {
    const halfPaddleHeight = paddleHeight / 2 + 0.05;
    ball.position.x += ballSpeed.X;
    ball.position.y += ballSpeed.Y;

    // 공이 벽에 닿았을 경우의 처리
    if (ball.position.y > 1.5 || ball.position.y < -1.5) {
        ballSpeed.Y *= -1;
    }
    // 공이 왼쪽 패들과 충돌 시 처리
    else if (
        ball.position.x < leftPaddle.position.x + 0.05 &&
        ball.position.y < leftPaddle.position.y + halfPaddleHeight &&
        ball.position.y > leftPaddle.position.y - halfPaddleHeight
    ) {
        ballSpeed.X *= -1;
        ballSpeed.Y += (ball.position.y - leftPaddle.position.y) * (halfPaddleHeight / 10);
    }
    // 공이 오른쪽 패들과 충돌 시 처리
    else if (
        ball.position.x > rightPaddle.position.x - 0.05 &&
        ball.position.y < rightPaddle.position.y + halfPaddleHeight &&
        ball.position.y > rightPaddle.position.y - halfPaddleHeight
    ) {
        ballSpeed.X *= -1;
        ballSpeed.Y += (ball.position.y - rightPaddle.position.y) * (halfPaddleHeight / 10);
    }
    // 공이 우측면을 통과했을 때
    else if (ball.position.x > 2) {
        endGame(currentPlayers[0]);
        return;
    }
    // 공이 좌측면을 통과했을 때
    else if (ball.position.x < -2) {
        endGame(currentPlayers[1]);
        return;
    }
}

// 토너먼트 모드의 설정값 초기화 함수
function resetTournament() {
    playerQueue = [...gameSettings.playerNames];
    currentRound = 0;
    firstRoundWinner = null;
    currentPlayers = [playerQueue[0], playerQueue[1]];
}

// 게임의 설정값을 초기화하는 함수
function resetGameElements() {
    setGameStart(false);
    ballSpeed.X = 0;
    ballSpeed.Y = 0;
    ball.position.set(0, 0.1, 0);
    leftPaddle.position.set(-2.02, 0, 0.1);
    rightPaddle.position.set(2.02, 0, 0.1);
    gameSettings = JSON.parse(localStorage.getItem('gameSettings'));
    // 난이도에 따라 패들 크기 조정
    paddleHeight = 0.6; // 기본 높이
    if (gameSettings.difficulty === 'easy') {
        paddleHeight += 0.2; // 쉬움: 더 큰 패들
    } else if (gameSettings.difficulty === 'hard') {
        paddleHeight -= 0.1; // 어려움: 더 작은 패들
    }
    leftPaddle.scale.y = paddleHeight / 0.6;
    rightPaddle.scale.y = paddleHeight / 0.6;
    const playerNamesDisplay = document.getElementById('playerNamesDisplay');
    if (playerNamesDisplay) {
        playerNamesDisplay.remove();
    }
}

// 게임의 종료 메시지 출력
function displayEndMessage(winner, isChampion = false) {
    const { championMsg, win } = translations[currentLanguage];

    const message = isChampion ? `${winner} ${championMsg}` : `${winner} ${win}`;
    const messageColor = isChampion ? 'green' : 'blue';
    const messageFontSize = isChampion ? '30px' : '25px';

    const endMessage = document.createElement('div');
    endMessage.id = isChampion ? 'championMessage' : 'endMessage';

    endMessage.innerText = message;
    endMessage.style.position = 'absolute';
    endMessage.style.color = messageColor;
    endMessage.style.fontSize = messageFontSize;
    endMessage.style.fontWeight = 'bold';
    endMessage.style.textAlign = 'center';
    endMessage.style.zIndex = '1000';

    const playerInfoDiv = document.getElementById('player-info');
    if (playerInfoDiv) {
        playerInfoDiv.appendChild(endMessage);
    }
    return endMessage;
}

// 게임 모드 관련 논리 함수
function handleGameModeLogic(winner) {
    const { restart, tournamentOver } = translations[currentLanguage];
    const startGameButton = document.getElementById('startGameButton');

    if (gameSettings.gameMode === 'multi' || gameSettings.gameMode === 'single') {
        const playerNamesDisplay = document.getElementById('playerNamesDisplay');
        if (playerNamesDisplay) {
            playerNamesDisplay.remove();
        }
        if (startGameButton) {
            startGameButton.disabled = false;
            startGameButton.textContent = `${restart}`;
        }
        leftPaddle.position.set(-2.02, 0, 0.1);
        rightPaddle.position.set(2.02, 0, 0.1);
    } else if (gameSettings.gameMode === 'tournament') {
        currentRound++;
        if (currentRound === 1) {
            currentPlayers = [playerQueue[2], playerQueue[3]];
        } else if (currentRound === 2) {
            if (!firstRoundWinner) {
                console.error("First round winner is not defined.");
                return;
            }
            playerQueue.push(winner);
            currentPlayers = [firstRoundWinner, winner];
        } else if (currentRound === 3) {
            const championText = displayEndMessage(winner, true);
            resetTournament();
            setTimeout(() => {
                championText.remove();
                if (startGameButton) {
                    startGameButton.disabled = true;
                    startGameButton.textContent = `${tournamentOver}`;
                }
                leftPaddle.position.set(-2.02, 0, 0.1);
                rightPaddle.position.set(2.02, 0, 0.1);

                const playerNamesDisplay =
                    document.getElementById('playerNamesDisplay');
                if (playerNamesDisplay) {
                    playerNamesDisplay.remove();
                }
                championText.remove();
            }, 2000);
            return;
        }
        if (currentRound === 1) {
            firstRoundWinner = winner;
        }
        displayPlayerNames();
        setBallSpeed();
        ball.position.set(0, 0.1, 0);
    }
}

// 게임 종료 함수
function endGame(winner) {
    resetGameElements();
    const endMessage = displayEndMessage(winner);

    setTimeout(() => {
        endMessage.remove();
        handleGameModeLogic(winner);
    }, 2000);
}

// 게임 관련 설정 함수
function setGameSettings() {
    resetGameElements();
    const { user } = translations[currentLanguage];
    if (gameSettings.difficulty === 'easy') {
        level = 0;
    } else if (gameSettings.difficulty === 'medium') {
        level = 1;
    } else if (gameSettings.difficulty === 'hard') {
        level = 2;
    }
    playerQueue = [...gameSettings.playerNames];
    if (gameSettings.gameMode === 'single') {
        currentPlayers = [`${user}`, 'AI'];
    } else {
        currentPlayers = [playerQueue[0], playerQueue[1]];
    }
    currentRound = 0;
}

// 공의 속도 설정
function setBallSpeed() {
    ballSpeed = { X: 0, Y: 0 };

    if (level === 0) {
        ballSpeed.X = 0.025 * (Math.random() > 0.5 ? 1 : -1);
        ballSpeed.Y = 0.025 * (Math.random() > 0.5 ? 1 : -1);
    } else if (level === 1) {
        ballSpeed.X = 0.035 * (Math.random() > 0.5 ? 1 : -1);
        ballSpeed.Y = 0.035 * (Math.random() > 0.5 ? 1 : -1);
    } else if (level === 2) {
        ballSpeed.X = 0.045 * (Math.random() > 0.5 ? 1 : -1);
        ballSpeed.Y = 0.045 * (Math.random() > 0.5 ? 1 : -1);
    }
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
    paddleHeight,
    paddleSpeed,
    tableHeight,
    keyEventListener,
    setGameSettings,
    displayPlayerNames,
    moveBall,
    endGame,
    setBallSpeed,
};
