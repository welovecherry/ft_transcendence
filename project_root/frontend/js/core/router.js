import { isAuthenticated } from '../api/oauth.js';

const routes = {
    '/': 'login',
    '/setting': 'setting',
    '/playing': 'playing',
    '/subgame': 'subgame',
};

// 동적 페이지 렌더링
async function renderPage(pageName) {
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
