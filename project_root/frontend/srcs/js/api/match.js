import { getCSRFToken } from './csrf.js'

export const getMatchOpponent = async () => {
    try {
        const response = await fetch(`/api/match/`, {
            method: 'GET',
            credentials: 'include',
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
                'X-CSRFToken': getCSRFToken()
            },
            body: JSON.stringify(matchData),
            credentials: 'include',
        });
        return response;
    } catch (error) {
        console.error('Error posting match result:', error);
        return null;
    }
};
