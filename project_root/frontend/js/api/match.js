export const getMatchOpponent = async () => {
    try {
        const userId = 1;
        const response = await fetch(`/api/match/${userId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching match opponent:', error);
        return null;
    }
};

export const postMatchResult = async (matchData) => {
    try {
        const response = await fetch(`/api/match`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(matchData),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error posting match result:', error);
        return null;
    }
};
