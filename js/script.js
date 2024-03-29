const GameBoard = (function () {
    const size = 3;
    const board = [];
    for (let row = 0; row < size; row++) {
        board.push(new Array(size));
    }
    const putAt = function (row, col, symbol) {
        if (board[row][col] == undefined) {
            board[row][col] = symbol;
            return true;
        }
        return false;
    }
    const getBoard = function () {
        return board;
    }
    return { getBoard: getBoard, putAt: putAt };
});
const Game = (function (gameBoard, player1, player2) {
    const playerOne = player1;
    const playerTwo = player2;
    const board = gameBoard;
    let turn = true;

    const makeMove = function (x, y) {
        let symbol = turn ? playerTwo : playerOne;
        turn = board.putAt(y, x, symbol) ? !turn : turn;

        printGameInfo();
    }
    const getTurn = () => turn;
    // Prints board, coords, and who's to play to the console.
    const printGameInfo = () => {
        let boardState = board.getBoard();
        let msg = '';
        for (let row = 0; row < boardState.length; row++) {
            msg += `${row} `;
            for (let col = 0; col < boardState[row].length; col++) {
                let tileValue = boardState[row][col] ? boardState[row][col] : ' ';
                msg += tileValue + ', ';
            }
            msg += `\n`;
        }
        msg = msg + '  0, 1, 2';
        msg += turn ? "\nplayer 1's turn" : "\nplayer 2's turn";
        console.log(msg);
    }
    return {
        board: board.getBoard,
        makeMove: makeMove,
        turn: getTurn(),
    }
});

let board = GameBoard();
let game = Game(board, 'x', 'o');