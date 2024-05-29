const checkGameDataForBot = async (data: any) => {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    const findWinningMove = (symbol: string): number => {
        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (data[a].symbol === symbol && data[b].symbol === symbol && data[c].symbol === "") {
                return c;
            }
            if (data[a].symbol === symbol && data[c].symbol === symbol && data[b].symbol === "") {
                return b;
            }
            if (data[b].symbol === symbol && data[c].symbol === symbol && data[a].symbol === "") {
                return a;
            }
        }
        return -1;
    };

    let move = findWinningMove("O");
    if (move !== -1) {
        console.log(`checkGameDataForBot::: Winning move for O at ${move}`);
        return move;
    }

    move = findWinningMove("X");
    if (move !== -1) {
        console.log(`checkGameDataForBot::: Blocking move for X at ${move}`);
        return move;
    }

    const emptyCells = data.map((cell: any, index: any) => cell.symbol === "" ? index : -1).filter((index: any) => index !== -1);

    if (emptyCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const randomMove = emptyCells[randomIndex];
        console.log(`checkGameDataForBot::: Random move at ${randomMove}`);
        return randomMove;
    }

    console.log("checkGameDataForBot::: No moves left");
    return -1;
};

// Example of findRandomNumber function, in case it's needed
const findRandomNumber = () => {
    return Math.floor(Math.random() * 9) + 1;
}



export { checkGameDataForBot }


