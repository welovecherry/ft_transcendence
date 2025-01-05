export const getMatchOpponent = async () => {
    try {
        const userId = 1;
        const response = await fetch(`/api/match/${userId}/`, {
            method: 'GET',
            credentials: 'include', // 쿠키를 포함한 요청
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching match opponent:', error);
        return null;
    }
};

export const postMatchResult = async (matchData) => {
    try {
        const response = await fetch(`/api/match/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(matchData),
            credentials: 'include',
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error posting match result:', error);
        return null;
    }
};
