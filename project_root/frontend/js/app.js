// import { getUserStats } from './api';

// 게임 설정에 필요한 정보를 저장할 변수
let gameSettings = {
    gameMode: '',
    playerNames: [],
    difficulty: '',
};

// 페이지 렌더링 함수
const renderPage = (page) => {
    const content = document.getElementById('content');
    content.innerHTML = '';

    switch (page) {
        case 'login':
            content.innerHTML = loginPage();
            break;
        case 'game-setting':
            content.innerHTML = gameSettingPage();
            break;
        case 'game-playing':
            content.innerHTML = gamePlayingPage();
            break;
        default:
            content.innerHTML = loginPage();
    }
};

// 로그인 페이지
const loginPage = () => {
    return `
        <h1>Welcome to Pong Game</h1>
        <button class="btn btn-primary" onclick="navigateTo('game-setting')">Start Game</button>
    `;
};

// 게임 설정 페이지
// 일단 임시로 사용자 통계 띄워줌
const gameSettingPage = () => {
    return `
        <div id="user-stats">
            <p>Total Games: <span id="total-games">Loading...</span></p>
            <p>Games Won: <span id="games-won">Loading...</span></p>
        </div>
        <h1>Select Game Mode</h1>
        <button class="btn btn-primary" onclick="selectGame('single')">Single Player</button>
        <button class="btn btn-primary" onclick="selectGame('multi')">Multiplayer</button>
        <button class="btn btn-primary" onclick="selectGame('tournament')">Tournament</button>
        <button class="btn btn-primary" onclick="selectGame('subgame')">Sub Game</button>
        <div id="game-options"></div>
        <div id="game-start-button"></div>
    `;
};

// 페이지 로드 시 API 호출하여 유저 통계 표시
// const loadUserStats = async () => {
//     const stats = await getUserStats();
//     if (stats) {
//         document.getElementById('total-games').textContent = stats.totalGames;
//         document.getElementById('games-won').textContent = stats.gamesWon;
//     }
// };

// 게임 설정에 맞는 폼을 동적으로 생성
const selectGame = (mode) => {
    gameSettings.gameMode = mode;
    gameSettings.playerNames = [];
    gameSettings.difficulty = '';

    let optionsHTML = '';
    let startBtnHTML = '';
    if (mode === 'single') {
        optionsHTML = `
            <div class="form-group">
                <label for="difficulty">Select Difficulty</label>
                <select class="form-control" id="difficulty" onchange="updateDifficulty()">
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
            </div>
        `;
        startBtnHTML = `<button class="btn btn-success" id="start-game-btn" onclick="startGame()">Start Game</button>`;
    } else if (mode === 'multi') {
        optionsHTML = `
            <div class="form-group">
                <label for="player1-name">Player 1 Name</label>
                <input type="text" class="form-control" id="player1-name" placeholder="Enter Player 1 Name" oninput="updatePlayerNames()">
            </div>
            <div class="form-group">
                <label for="player2-name">Player 2 Name</label>
                <input type="text" class="form-control" id="player2-name" placeholder="Enter Player 2 Name" oninput="updatePlayerNames()">
            </div>
            <div class="form-group">
                <label for="difficulty">Select Difficulty</label>
                <select class="form-control" id="difficulty" onchange="updateDifficulty()">
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
            </div>
        `;
        startBtnHTML = `<button class="btn btn-success" id="start-game-btn" onclick="startGame()" disabled>Start Game</button>`;
    } else if (mode === 'tournament') {
        optionsHTML = `
            <div class="form-group">
                <label for="player1-name">Player 1 Name</label>
                <input type="text" class="form-control" id="player1-name" placeholder="Enter Player 1 Name" oninput="updatePlayerNames()">
            </div>
            <div class="form-group">
                <label for="player2-name">Player 2 Name</label>
                <input type="text" class="form-control" id="player2-name" placeholder="Enter Player 2 Name" oninput="updatePlayerNames()">
            </div>
            <div class="form-group">
                <label for="player3-name">Player 3 Name</label>
                <input type="text" class="form-control" id="player3-name" placeholder="Enter Player 3 Name" oninput="updatePlayerNames()">
            </div>
            <div class="form-group">
                <label for="player4-name">Player 4 Name</label>
                <input type="text" class="form-control" id="player4-name" placeholder="Enter Player 4 Name" oninput="updatePlayerNames()">
            </div>
            <div class="form-group">
                <label for="difficulty">Select Difficulty</label>
                <select class="form-control" id="difficulty" onchange="updateDifficulty()">
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
            </div>
        `;
        startBtnHTML = `<button class="btn btn-success" id="start-game-btn" onclick="startGame()" disabled>Start Game</button>`;
    } else if (mode === 'subgame') {
        startBtnHTML = `<button class="btn btn-success" id="start-game-btn" onclick="startGame()">Start Game</button>`;
    }

    document.getElementById('game-options').innerHTML = optionsHTML;
    document.getElementById('game-start-button').innerHTML = startBtnHTML;
};

// 이름 업데이트 함수
const updatePlayerNames = () => {
    const player1Name = document.getElementById('player1-name')?.value;
    const player2Name = document.getElementById('player2-name')?.value;
    const player3Name = document.getElementById('player3-name')?.value;
    const player4Name = document.getElementById('player4-name')?.value;

    gameSettings.playerNames = [
        player1Name,
        player2Name,
        player3Name,
        player4Name,
    ].filter((name) => name);

    // 중복 이름 체크
    const uniqueNames = new Set(gameSettings.playerNames);
    if (uniqueNames.size !== gameSettings.playerNames.length) {
        alert('Player names must be unique!');
        // 중복이 있는 경우, 게임 시작 버튼 비활성화
        document.getElementById('start-game-btn').disabled = true;
    } else if (
        (gameSettings.gameMode === 'multi' &&
            gameSettings.playerNames.length != 2) ||
        (gameSettings.gameMode === 'tournament' &&
            gameSettings.playerNames.length != 4)
    ) {
        // 이름 개수가 부족하면 게임 시작 버튼 비활성화
        document.getElementById('start-game-btn').disabled = true;
    } else {
        // 중복이 없고 이름이 있으면 게임 시작 버튼 활성화
        document.getElementById('start-game-btn').disabled = false;
    }
};

// 난이도 업데이트 함수
const updateDifficulty = () => {
    gameSettings.difficulty = document.getElementById('difficulty').value;
};

// 게임 시작 함수
const startGame = () => {
    localStorage.setItem('gameSettings', JSON.stringify(gameSettings));
    navigateTo('game-playing');
};

// 게임 화면 페이지
const gamePlayingPage = () => {
    return `
        <h1>Game is Starting...</h1>
        <p>Mode: ${gameSettings.gameMode}</p>
        <p>Players: ${gameSettings.playerNames.join(', ')}</p>
        <p>Difficulty: ${gameSettings.difficulty}</p>
        <div id="game-screen">
            <!-- 모드, 플레이어 이름, 난이도 입력 시 그에 맞게 게임 호출 -->
        </div>
        <script src="/js/game-playing.js"></script>
    `;
};

// 히스토리 API를 사용한 라우팅
const navigateTo = (page) => {
    window.history.pushState({}, page, window.location.origin + '/' + page);
    renderPage(page);
};

// 페이지가 로드되면 초기화
window.addEventListener('popstate', () => {
    const path = window.location.pathname.split('/')[1];
    renderPage(path || 'login');
});

// 페이지가 로드되면 유저 통계를 불러옴
// window.addEventListener('load', loadUserStats);

// 초기 페이지 렌더링
renderPage('login');
