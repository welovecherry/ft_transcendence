import {
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
} from './components.js';

// Function to update paddle positions
function updatePaddles() {
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

    if (
        paddleStates.rightPaddleUp &&
        rightPaddle.position.y + paddleGeometry.parameters.height / 2 <
            tableHeight / 2
    )
        rightPaddle.position.y += paddleSpeed;
    if (
        paddleStates.rightPaddleDown &&
        rightPaddle.position.y - paddleGeometry.parameters.height / 2 >
            -tableHeight / 2
    )
        rightPaddle.position.y -= paddleSpeed;
}

function startTournament() {
    displayPlayerNames(); // Display the names of the first match
    setBallSpeed(); // Set the ball speed based on difficulty
    ball.position.set(0, 0.1, 0); // Ensure the ball starts at the center
    startGameButton.textContent = 'Tournament Running...';
    startGameButton.disabled = true; // Disable the start button during the tournament
}

function animate() {
    requestAnimationFrame(animate);
    moveBall(); // for both multi and tournament modes
    updatePaddles(); // Handles paddle movement
    renderer.render(scene, camera); // Renders the scene
}

export function initGame() {
    setGameSettings();
    const gameScreen = document.getElementById('game-screen');
    gameScreen.appendChild(renderer.domElement); // 렌더러를 DOM에 추가
    renderer.setSize(gameScreen.offsetWidth, gameScreen.offsetHeight); // 렌더러 크기 설정
    renderer.setClearColor(0xffffff, 1); // 배경을 흰색으로 설정
    displayPlayerNames(); // Display P1 vs P2

    const startGameButton = document.getElementById('startGameButton');
    startGameButton.addEventListener('click', () => {
        if (gameSettings.gameMode === 'multi') {
            setBallSpeed(); // Set ball speed based on difficulty
            ball.position.set(0, 0.1, 0); // Ensure ball starts at the center
            startGameButton.textContent = 'Game Running...';
            startGameButton.disabled = true; // Disable the button while the game is running
        } else if (gameSettings.gameMode === 'tournament') {
            startTournament(); // Initialize and start the tournament
        }
    });
    keyEventListener();
    animate();
}
