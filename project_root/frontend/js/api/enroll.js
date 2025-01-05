export const getEnrollment = async () => {
    try {
        const userId = 1;
        const response = await fetch(`/api/enroll/${userId}/`, {
            method: 'GET',
            credentials: 'include', // 쿠키를 포함한 요청
        });
        const data = await response.json();
        if (!response.ok) {
            console.error('Failed to get enrollment:', data);
            return null;
        }
        return data;
    } catch (error) {
        console.error('Error fetching user enrollment:', error);
        return null;
    }
};

export const postEnrollment = async (enrollData) => {
    try {
        const response = await fetch(`/api/enroll/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(enrollData),
            credentials: 'include',
        });
        const data = await response.json();
        if (!response.ok) {
            console.error('Failed to post enrollment:', data);
            return null;
        }
        return data;
    } catch (error) {
        console.error('Error posting user enrollment:', error);
        return null;
    }
};
