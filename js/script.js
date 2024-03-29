const GameBoard = (function () {
    const SIZE = 3;
    const board = [];
    for (let row = 0; row < SIZE; row++) {
        board.push(new Array(SIZE));
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
    // Returns false if the game is still ongoing, to prevent accidental draws from occurring
    const checkWin = function () {
        // If not, check to see who won (if anyone)
        let eval = false;
        for (let i = 0; i < SIZE; i++) {
            if (board[i][0] == board[i][1] == board[i][2] != undefined) {
                eval = board[i][0];
            };
        }
        for (let i = 0; i < SIZE; i++) {
            if (board[0][i] == board[1][i] == board[2][i] != undefined) {
                eval = board[0][i];
            };
        }
        if (board[0][0] == board[1][1] == board[2][2] != undefined ||
            board[0][2] == board[1][1] == board[2][0] != undefined) {
            eval = board[0][0];
        };

        if (!eval && board.flat().length != SIZE ** 2) {
            eval = 'draw';
        }

        return eval;
    }
    return { getBoard: getBoard, putAt: putAt, checkWin: checkWin };
});
const Game = (function (gameBoard, player1, player2) {
    const playerOne = player1;
    const playerTwo = player2;
    const board = gameBoard;
    let turn = true;

    const makeMove = function (x, y) {
        let symbol = turn ? playerTwo : playerOne;
        turn = board.putAt(y, x, symbol) ? !turn : turn;

        let hasWon = board.checkWin();
        if (hasWon) {
            console.log(hasWon);
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

let board = GameBoard();
let game = Game(board, 'x', 'o');