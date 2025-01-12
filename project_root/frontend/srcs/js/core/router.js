import { isAuthenticated } from '../api/oauth.js';

const routes = {
    '/': 'login',
    '/home': 'home',
    '/subgame': 'subgame',
};

// 게임 도중에 페이지 이동 시 게임 중지
function stopGame() {
    const playerNamesDisplay = document.getElementById('playerNamesDisplay');
    if (playerNamesDisplay) {
        playerNamesDisplay.remove();
        console.log("'User vs AI' removed");
    }

    const championMessage = document.getElementById('championMessage');
    if (championMessage) {
        championMessage.remove();
        console.log("Champion message removed.");
    } else {
        console.log("No champion message found.");
    }

    const endMessage = document.getElementById('endMessage');
    if (endMessage) {
        endMessage.remove();
        console.log("End message removed.");
    } else {
        console.log("No end message found.");
    }

    console.log("Game stopped and elements cleared.");
}

export async function renderPage(path) {
    stopGame();

    const validPaths = Object.keys(routes);
    let pageName = routes[path] || 'login';
    const isLogin = await isAuthenticated();
    console.log(isLogin);

    if (!isLogin && (!validPaths.includes(path) || pageName != 'login')) {
        pageName = 'login';
    } else if (
        isLogin &&
        (!validPaths.includes(path) || pageName === 'login')
    ) {
        pageName = 'home';
    }

    const pageModule = await import(`../pages/${pageName}.js`);
    pageModule.render();
    return pageName;
}

// URL 이동 처리
export async function navigateTo(path) {

    let pageName = await renderPage(path);
    let currentState = { page: pageName };

    if (JSON.stringify(history.state) !== JSON.stringify(currentState)) {
        window.history.pushState(currentState, '', '/' + pageName);
    }
    console.log(history.state);
}

// 브라우저의 뒤로가기/앞으로가기 이벤트 처리
export async function handlePopState() {
    const path = window.location.pathname;

    renderPage(path);
}
