document.addEventListener('DOMContentLoaded', () => {
	let gameType = '';
	let playerNames = [];
	let gameSpeed = 'normal';

	const gameSettings = document.getElementById('game-settings');
	const startGameBtn = document.getElementById('start-game-btn');
	const gameArea = document.getElementById('game-area');
	const playerNamesDisplay = document.getElementById('player-names');
	const resetGameBtn = document.getElementById('reset-game-btn');
	const gameResult = document.getElementById('game-result');

	const singlePlayerBtn = document.getElementById('single-player-btn');
	const multiPlayerBtn = document.getElementById('multi-player-btn');
	const tournamentBtn = document.getElementById('tournament-btn');

	const player2Settings = document.getElementById('player2-settings');
	const player3Settings = document.getElementById('player3-settings');
	const player4Settings = document.getElementById('player4-settings');

	const player1NameInput = document.getElementById('player1-name');
	const player2NameInput = document.getElementById('player2-name');
	const player3NameInput = document.getElementById('player3-name');
	const player4NameInput = document.getElementById('player4-name');

	let canvas, context;
	let ball,
		paddle1,
		paddle2,
		keysPressed,
		gameInterval,
		ballSpeed,
		paddleSpeed;
	let player1Score = 0,
		player2Score = 0;
	let isGameOver = false;

	singlePlayerBtn.addEventListener('click', () => setGameType('single'));
	singlePlayerBtn.addEventListener('click', () => resetGame());
	multiPlayerBtn.addEventListener('click', () => setGameType('multi'));
	multiPlayerBtn.addEventListener('click', () => resetGame());
	tournamentBtn.addEventListener('click', () => setGameType('tournament'));
	tournamentBtn.addEventListener('click', () => resetGame());

	startGameBtn.addEventListener('click', () => startGame());
	resetGameBtn.addEventListener('click', () => resetGame());

	function setGameType(type) {
		gameType = type;
		playerNames = [];
		gameSettings.classList.remove('d-none');
		gameArea.classList.add('d-none');
		gameResult.classList.add('d-none');

		player1NameInput.value = '';
		player2NameInput.value = '';
		player3NameInput.value = '';
		player4NameInput.value = '';

		if (gameType === 'single') {
			player2Settings.classList.add('d-none');
			player3Settings.classList.add('d-none');
			player4Settings.classList.add('d-none');
		} else if (gameType === 'multi') {
			player2Settings.classList.remove('d-none');
			player3Settings.classList.add('d-none');
			player4Settings.classList.add('d-none');
		} else if (gameType === 'tournament') {
			player2Settings.classList.remove('d-none');
			player3Settings.classList.remove('d-none');
			player4Settings.classList.remove('d-none');
		}
	}

	function startGame() {
		playerNames.push(player1NameInput.value);
		if (gameType === 'multi' || gameType === 'tournament') {
			playerNames.push(player2NameInput.value);
		}
		if (gameType === 'tournament') {
			playerNames.push(player3NameInput.value);
			playerNames.push(player4NameInput.value);
		}

		gameSpeed = document.getElementById('game-speed').value;
		playerNamesDisplay.textContent = playerNames.join(' vs ');
		gameSettings.classList.add('d-none');
		gameArea.classList.remove('d-none');
		gameResult.classList.add('d-none');

		// Set the game speed
		ballSpeed = gameSpeed === 'fast' ? 7 : 4;
		paddleSpeed = 4;

		initializePongGame();
	}

	function resetGame() {
		playerNames = [];
		setGameType(gameType);
		gameResult.classList.add('d-none');
		player1Score = 0;
		player2Score = 0;
		renderGame();
		clearInterval(gameInterval);
	}

	function initializePongGame() {
		player1Score = 0;
		player2Score = 0;
		canvas = document.getElementById('pong');
		context = canvas.getContext('2d');

		ball = new Ball();
		paddle1 = new Paddle(true);
		paddle2 = new Paddle(false);

		keysPressed = {};

		window.addEventListener('keydown', (e) => {
			keysPressed[e.key] = true;
		});

		window.addEventListener('keyup', (e) => {
			keysPressed[e.key] = false;
		});

		gameInterval = setInterval(gameLoop, 1000 / 60);
	}

	function gameLoop() {
		if (isGameOver) return;

		updateGame();
		renderGame();
	}

	function updateGame() {
		if (isGameOver) return;

		ball.update();
		paddle1.update();
		paddle2.update();

		if (
			ball.x - ball.radius < paddle1.x + paddle1.width &&
			ball.y > paddle1.y &&
			ball.y < paddle1.y + paddle1.height
		) {
			ball.dx = -ball.dx;
		}

		if (
			ball.x + ball.radius > paddle2.x &&
			ball.y > paddle2.y &&
			ball.y < paddle2.y + paddle2.height
		) {
			ball.dx = -ball.dx;
		}

		// Ball out of bounds
		if (ball.x - ball.radius < 0) {
			player2Score++;
			resetBall();
		}
		if (ball.x + ball.radius > canvas.width) {
			player1Score++;
			resetBall();
		}
	}

	function renderGame() {
		context.clearRect(0, 0, canvas.width, canvas.height);

		// Draw paddles and ball
		paddle1.render();
		paddle2.render();
		ball.render();

		// Draw scores
		context.fillStyle = 'white';
		context.font = '32px Arial';
		context.fillText(player1Score, canvas.width / 4, 50);
		context.fillText(player2Score, (3 * canvas.width) / 4, 50);

		// Check for game over
		if (player1Score >= 10 || player2Score >= 10) {
			endGame();
		}
	}

	function endGame() {
		isGameOver = true;
		clearInterval(gameInterval);
		gameResult.textContent +=
			player1Score > player2Score
				? `${playerNames[0]}`
				: `${playerNames[1]}`;
		gameResult.classList.remove('d-none');
		gameArea.classList.remove('d-none');
	}

	function resetBall() {
		if (isGameOver) return;
		ball = new Ball();
		setTimeout(() => {
			gameInterval = setInterval(gameLoop, 1000 / 60);
		}, 1000);
	}

	class Ball {
		constructor() {
			this.x = canvas.width / 2;
			this.y = canvas.height / 2;
			this.radius = 10;
			this.dx = ballSpeed;
			this.dy = ballSpeed;
			this.color = 'white';
		}

		update() {
			this.x += this.dx;
			this.y += this.dy;

			// Wall collision
			if (
				this.y - this.radius < 0 ||
				this.y + this.radius > canvas.height
			) {
				this.dy = -this.dy;
			}
		}

		render() {
			context.beginPath();
			context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
			context.fillStyle = this.color;
			context.fill();
			context.closePath();
		}
	}

	class Paddle {
		constructor(isLeft) {
			this.width = 10;
			this.height = 100;
			this.isLeft = isLeft;
			this.x = isLeft ? 0 : canvas.width - this.width;
			this.y = canvas.height / 2 - this.height / 2;
			this.speed = paddleSpeed;
		}

		update() {
			if (this.isLeft) {
				if (keysPressed['ArrowUp'] && this.y > 0) {
					this.y -= this.speed;
				}
				if (
					keysPressed['ArrowDown'] &&
					this.y < canvas.height - this.height
				) {
					this.y += this.speed;
				}
			} else {
				if (keysPressed['q'] && this.y > 0) {
					this.y -= this.speed;
				}
				if (keysPressed['a'] && this.y < canvas.height - this.height) {
					this.y += this.speed;
				}
			}
		}

		render() {
			context.fillStyle = 'white';
			context.fillRect(this.x, this.y, this.width, this.height);
		}
	}
});
