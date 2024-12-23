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
const gameSettingPage = () => {
    return `
        <h1>Select Game Mode</h1>
        <button class="btn btn-primary" onclick="selectGame('single')">Single Player</button>
        <button class="btn btn-primary" onclick="selectGame('multi')">Multiplayer</button>
        <button class="btn btn-primary" onclick="selectGame('tournament')">Tournament</button>
        <div id="game-options"></div>
        <button class="btn btn-success" onclick="startGame()">Start Game</button>
    `;
};

// 게임 설정에 맞는 폼을 동적으로 생성
const selectGame = (mode) => {
    gameSettings.gameMode = mode;
    gameSettings.playerNames = [];
    gameSettings.difficulty = '';

    let optionsHTML = '';
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
    }

    document.getElementById('game-options').innerHTML = optionsHTML;
};

// 이름 업데이트 함수
const updatePlayerNames = () => {
    gameSettings.playerNames = [
        document.getElementById('player1-name')?.value,
        document.getElementById('player2-name')?.value,
        document.getElementById('player3-name')?.value,
        document.getElementById('player4-name')?.value,
    ].filter((name) => name);
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

// 초기 페이지 렌더링
renderPage('login');
