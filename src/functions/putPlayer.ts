// AWS Lambda API endpoint to allow player to quit and end game
// Pete Masse - 7/30/2021

import {APIGatewayProxyEvent, APIGatewayProxyHandler} from 'aws-lambda';
import Responses from '../common/API_Responses';
import getState from '../common/getState';
import {isGamePlayer} from '../common/isPlayer';
import {makeMove} from '../common/makeMove';
import setGameState from '../common/setGameState';

type PlayerWhoQuit = {
    gameId: string,
    playerId: string
}

export const handler: APIGatewayProxyHandler = async (event : APIGatewayProxyEvent) => {

    const {gameId, playerId} = event.pathParameters as unknown as PlayerWhoQuit;
    const gameState = await getState(gameId);
    const gamePlayer = await isGamePlayer(gameId, playerId);

    if (gameState === null || gamePlayer !.player === false) {
        return Responses._404({'message': 'Game not found or player is not a part of it'});
    }

    if (gameState.state === 'DONE') 
        return Responses._410({'message': 'Game is already in DONE state'});
    

    await makeMove({gameId, playerId, move_type: 'quit'});
    await setGameState(gameId, 'DONE');

    return Responses._202({'message': 'Success'});
}
