"use-strict";


function createPlayer(name, symbol) {
    let playerName = name;
    let playerSymbol = symbol;
    return { name: playerName, symbol: playerSymbol };
}

function allEqual(...values) {
    let test = values[0];
    for (let i = 1; i < values.length; i++) {
        if (test != values[i]) return false;
    }
    return true;
}


const gameBoard = (function () {
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
    const getBoard = () => board;
    
    // return `false` if the game is still ongoing,
    // return `true`  if someone has won, 
    // return 'draw'  if the game ended in a tie.
    const checkWin = () => {
        // Rows
        for (let i = 0; i < SIZE; i++) {
            if (allEqual(board[i][1], board[i][2], board[i][0]) && board[i][0] !== undefined) {
                return true;
            };
        }
        // Columns
        for (let i = 0; i < SIZE; i++) {
            if (allEqual(board[0][i], board[1][i], board[2][i]) && board[0][i] !== undefined) {
                return true;
            };
        }
        // Diagonals
        if ((allEqual(board[0][0], board[1][1], board[2][2]) && board[1][1] !== undefined) ||
            (allEqual(board[0][2], board[1][1], board[2][0]) && board[1][1] !== undefined)) {
            return true;
        };

        if (board.flat().length == SIZE ** 2) {
            return 'draw';
        }

        return false;
    }
    reset();

    return { getBoard, putAt, checkWin, reset };
})();

const playerOne = createPlayer('Anderson', 'o');
const playerTwo = createPlayer('Bert', 'x');

const game = ((gameBoard, player1, player2) => {
    const playerOne = player1;
    const playerTwo = player2;
    const board = gameBoard;
    let turn = true;
    let finished = false;

    const makeMove = (x, y) => {
        // this needs to be at the start of the function, rather than at the end,
        // to allow the gameView class to update the DOM before the internal representation gets reset. 
        if (finished) reset();

        let { name, symbol } = turn ? playerOne : playerTwo;
        turn = board.putAt(y, x, symbol) ? !turn : turn;

        finished = board.checkWin();
        if (finished == 'draw') {
            return finished;
        } else if (finished) {
            return `${name} won!`;
        }
        return false;
    }
    //const getTurn = () => turn;
    // Prints board, coords, and who's to play to the console.
    const printGameInfo = () => {
        let boardState = getBoard();
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
    const reset = () => {
        board.reset();
        turn = true;
        finished = false;
    }
    const getBoard = () => board.getBoard();

    return {
        reset,
        makeMove,
        getBoard,
        info: printGameInfo
    }
})(gameBoard, playerOne, playerTwo);

const gameView = ((game, boardElement, dialog) => {
    const displayBoard = () => {
        let board = game.getBoard();
        let size = board.length;
        for (let rowIndex = 0; rowIndex < size; rowIndex++) {
            for (let colIndex = 0; colIndex < size; colIndex++) {
                let cell = document.querySelector(`[data-row="${rowIndex}"][data-col="${colIndex}"]`);
                cell.textContent = board[rowIndex][colIndex];
            }
        }
    }
    const clickHandler = event => {
        let col = event.target.dataset.col;
        let row = event.target.dataset.row;

        let outcomeMsg = game.makeMove(col, row);

        if (outcomeMsg !== false) {
            dialog.querySelector('h2').textContent = outcomeMsg;
            dialog.showModal();
        }

        displayBoard();
    }


    boardElement.childNodes.forEach(element => element.addEventListener('click', clickHandler));
})(game, document.querySelector('.board'), document.querySelector('dialog'));