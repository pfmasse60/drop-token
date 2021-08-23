export const areFourConnected = (player: any, board: any[][]) => {

    // horizontalCheck 
    for (let j = 0; j < getHeight()-3 ; j++ ){
        for (let i = 0; i < getWidth(); i++){
            if (board[i][j] == player && board[i][j+1] == player && board[i][j+2] == player && board[i][j+3] == player){
                return true;
            }           
        }
    }
    // verticalCheck
    for (let i = 0; i < getWidth()-3 ; i++ ){
        for (let j = 0; j < getHeight(); j++){
            if (board[i][j] == player && board[i+1][j] == player && board[i+2][j] == player && board[i+3][j] == player){
                return true;
            }           
        }
    }
    // ascendingDiagonalCheck 
    for (let i=3; i < getWidth(); i++){
        for (let j=0; j < getHeight()-3; j++){
            if (board[i][j] == player && board[i-1][j+1] == player && board[i-2][j+2] == player && board[i-3][j+3] == player)
                return true;
        }
    }
    // descendingDiagonalCheck
    for (let i=3; i < getWidth(); i++){
        for (let j=3; j < getHeight(); j++){
            if (board[i][j] == player && board[i-1][j-1] == player && board[i-2][j-2] == player && board[i-3][j-3] == player)
                return true;
        }
    }
    return false;
}
