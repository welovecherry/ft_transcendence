import { isAuthenticated } from '../api/oauth.js';

const routes = {
    '/': 'login',
    '/setting': 'setting',
    '/playing': 'playing',
    '/subgame': 'subgame',
};

// 게임 도중에 페이지 이동 시 게임 중지
function stopGame() {

    const playerNamesDisplay = document.getElementById('playerNamesDisplay');
    if (playerNamesDisplay) {
        playerNamesDisplay.remove(); // 'User vs AI' 문자열 제거
        console.log("'User vs AI' removed");
    }

    const championMessage = document.getElementById('championMessage'); // 챔피언 메시지
    if (championMessage) {
        championMessage.remove();
        console.log("Champion message removed.");
    } else {
        console.log("No champion message found.");
    }

    const endMessage = document.getElementById('endMessage'); // 승리 메시지
    if (endMessage) {
        endMessage.remove();
        console.log("End message removed.");
    } else {
        console.log("No end message found.");
    }

    console.log("Game stopped and elements cleared.");
}


async function renderPage(pageName) {
    stopGame();

    const pageModule = await import(`../pages/${pageName}.js`);
    pageModule.render();
}

// URL 이동 처리
export async function navigateTo(path) {
    const validPaths = Object.keys(routes);
    const pageName = routes[path] || 'login';
    const isLogin = await isAuthenticated();
    console.log(isLogin);

    if (!isLogin && (!validPaths.includes(path) || pageName != 'login')) {
        window.history.pushState({}, '', '/');
        renderPage('login');
    } else if (
        isLogin &&
        (!validPaths.includes(path) || pageName === 'login')
    ) {
        window.history.pushState({}, '', '/setting');
        renderPage('setting');
    } else {
        window.history.pushState({}, '', path);
        renderPage(pageName);
    }
}

// 브라우저의 뒤로가기/앞으로가기 이벤트 처리
export function handlePopState() {
    const path = window.location.pathname;
    const pageName = routes[path] || 'login';
    renderPage(pageName);
}
