const GameBoard = (function () {
    const SIZE = 3;
    let board = [];
    const reset = () => {
        board = [];
        for (let row = 0; row < SIZE; row++) {
            board.push(new Array(SIZE));
        }
    }
    const putAt = (row, col, symbol) => {
        if (board[row][col] == undefined) {
            board[row][col] = symbol;
            return true;
        }
        return false;
    }
    const getBoard = () => {
        return board;
    }
    // Returns false if the game is still ongoing, to prevent accidental draws from occurring
    const checkWin = () => {
        // If not, check to see who won (if anyone)
        let eval = false;
        // Rows
        for (let i = 0; i < SIZE; i++) {
            if (allEqual(board[i][1], board[i][2], board[i][0]) && board[i][0] !== undefined) {
                eval = board[i][0];
            };
        }
        // Columns
        for (let i = 0; i < SIZE; i++) {
            if (allEqual(board[0][i], board[1][i], board[2][i]) && board[0][i] !== undefined) {
                eval = board[0][i];
            };
        }
        // Diagonals
        if ((allEqual(board[0][0], board[1][1], board[2][2]) && board[0][0] != undefined) ||
            (allEqual(board[0][2], board[1][1], board[2][0]) && board[0][2] != undefined)) {
            eval = board[0][0];
        };

        if (!eval && board.flat().length == SIZE ** 2) {
            console.log(board.flat().length);
            eval = 'draw';
        }

        return eval;
    }
    reset();
    return { getBoard: getBoard, putAt: putAt, checkWin: checkWin, reset: reset };
});
const Game = (function (gameBoard, player1, player2) {
    const playerOne = player1;
    const playerTwo = player2;
    const board = gameBoard;
    let turn = true;

    const makeMove = (x, y) => {
        let symbol = turn ? playerTwo : playerOne;
        turn = board.putAt(y, x, symbol) ? !turn : turn;

        let hasWon = board.checkWin();
        if (hasWon) {
            console.log(hasWon);
            board.reset();
        }

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

function allEqual(...values) {
    let test = values[0];
    for (let i = 1; i < values.length; i++) {
        if (test != values[i]) return false;
    }
    return true;
}

let board = GameBoard();
let game = Game(board, 'x', 'o');