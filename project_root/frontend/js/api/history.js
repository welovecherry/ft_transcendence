export const getHistory = async () => {
    try {
        const response = await fetch(`/api/history/`, {
            method: 'GET',
            credentials: 'include',
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching user game history:', error);
        return null;
    }
};
