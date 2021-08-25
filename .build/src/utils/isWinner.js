"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isWinner = void 0;
const isWinner = (player, board, col, rows, columns) => {
    // horizontalCheck 
    for (let j = 0; j < columns - 3; j++) {
        for (let i = 0; i < rows; i++) {
            if (board[i][j] == player && board[i][j + 1] == player && board[i][j + 2] == player && board[i][j + 3] == player) {
                console.log(player);
                return true;
            }
        }
    }
    // verticalCheck
    // if(board[col].filter((v) => (v === player)).length = rows){
    //     return true;
    // }
    // return false;       
    for (let i = 0; i < rows - 3; i++) {
        for (let j = 0; j < columns; j++) {
            console.table(board);
            if (board[i][j] == player && board[i + 1][j] == player && board[i + 2][j] == player && board[i + 3][j] == player) {
                return true;
            }
        }
    }
    // ascendingDiagonalCheck 
    for (let i = 3; i < rows; i++) {
        for (let j = 0; j < columns - 3; j++) {
            if (board[i][j] == player && board[i - 1][j + 1] == player && board[i - 2][j + 2] == player && board[i - 3][j + 3] == player)
                return true;
        }
    }
    // descendingDiagonalCheck
    for (let i = 3; i < rows; i++) {
        for (let j = 3; j < columns; j++) {
            if (board[i][j] == player && board[i - 1][j - 1] == player && board[i - 2][j - 2] == player && board[i - 3][j - 3] == player)
                return true;
        }
    }
    return false;
};
exports.isWinner = isWinner;
