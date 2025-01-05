export const getHistory = async () => {
    try {
        const userId = 1;
        const response = await fetch(`/api/history/${userId}/`, {
            method: 'GET',
            credentials: 'include', // 쿠키를 포함한 요청
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching user game history:', error);
        return null;
    }
};
