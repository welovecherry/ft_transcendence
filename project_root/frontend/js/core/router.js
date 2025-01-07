const routes = {
    '/': 'login',
    '/setting': 'setting',
    '/playing': 'playing',
    '/subgame': 'subgame',
};


function stopGame() {
    isAnimating = false; // 애니메이션 중지

    const playerNamesDisplay = document.getElementById('playerNamesDisplay');
    if (playerNamesDisplay) {
        playerNamesDisplay.remove(); // 'User vs AI' 문자열 제거
    }

    const championMessage = document.querySelector('#championMessage'); // 챔피언 메시지
    if (championMessage) {
        championMessage.remove();
        console.log("Champion message removed.");
    }

    const endMessage = document.querySelector('#endMessage'); // 승리 메시지
    if (endMessage) {
        endMessage.remove();
        console.log("End message removed.");
    }

    console.log("Game stopped and elements cleared.");
}


// 동적 페이지 렌더링
async function renderPage(pageName) {
    // Cleanup previous page elements
    // const playerNamesDisplay = document.getElementById('playerNamesDisplay');
    // if (playerNamesDisplay) {
    //     playerNamesDisplay.remove(); // Remove the leftover element
    // }
    stopGame();

    const pageModule = await import(`../pages/${pageName}.js`);
    pageModule.render();
}

// URL 이동 처리
export function navigateTo(path) {
    window.history.pushState({}, path, window.location.origin + path);
    const pageName = routes[path] || 'login';
    renderPage(pageName);
}

// 브라우저의 뒤로가기/앞으로가기 이벤트 처리
export function handlePopState() {
    const path = window.location.pathname;
    const pageName = routes[path] || 'login';
    renderPage(pageName);
}
