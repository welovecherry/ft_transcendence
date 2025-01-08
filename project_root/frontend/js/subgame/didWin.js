export function didWin(player1Choice, player2Choice) {
    if (player1Choice === player2Choice) {
        return 2;
    } else if (
        (player1Choice === 'Rock' && player2Choice === 'Scissors') ||
        (player1Choice === 'Scissors' && player2Choice === 'Paper') ||
        (player1Choice === 'Paper' && player2Choice === 'Rock')
    ) {
        return 1;
    } else {
        return 0;
    }
}
