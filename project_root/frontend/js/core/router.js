import { isAuthenticated } from './auth.js';

const routes = {
    '/': 'login',
    '/setting': 'setting',
    '/playing': 'playing',
    '/subgame': 'subgame',
};

// 동적 페이지 렌더링
async function renderPage(pageName) {
    let pageModule;
    if (!isAuthenticated && pageName != 'login') {
        console.log(isAuthenticated);
        console.log(pageName);
        console.log('login');
        pageModule = await import(`../pages/login.js`);
    } else {
        console.log(isAuthenticated);
        console.log(pageName);
        console.log('pagename');
        pageModule = await import(`../pages/${pageName}.js`);
    }
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
