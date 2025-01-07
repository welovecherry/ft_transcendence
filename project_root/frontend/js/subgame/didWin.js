export function didWin(player1Choice, player2Choice) {
    if (player1Choice === player2Choice) {
        return 2;
    } else if (
        (player1Choice === '1' && player2Choice === '2') ||
        (player1Choice === '2' && player2Choice === '3') ||
        (player1Choice === '3' && player2Choice === '1')
    ) {
        return 1;
    } else {
        return 0;
    }
}
