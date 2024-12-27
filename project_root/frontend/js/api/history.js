export const getHistory = async () => {
    try {
        const userId = 1;
        const response = await fetch(`/api/history/${userId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching user game history:', error);
        return null;
    }
};
