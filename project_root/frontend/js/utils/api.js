// export const getUserStats = async () => {
//     try {
//         const response = await fetch('/api/user/stats');
//         const data = await response.json();
//         return data; // 서버에서 받은 데이터를 반환
//     } catch (error) {
//         console.error('Error fetching user stats:', error);
//         return null;
//     }
// };

// export const updateGameStatus = async (gameData) => {
//     try {
//         const response = await fetch('/api/user/game-status', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(gameData),
//         });
//         const data = await response.json();
//         return data; // 성공적으로 게임 상태가 저장된 결과를 반환
//     } catch (error) {
//         console.error('Error updating game status:', error);
//         return null;
//     }
// };
