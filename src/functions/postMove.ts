import {APIGatewayProxyEvent} from 'aws-lambda';
import Responses from '../common/API_Responses';
import {makeMove} from '../common/makeMove';
import isGame from '../common/isGame';
import {isGamePlayer} from '../common/isPlayer';

export interface MoveParams {
    gameId: string,
    playerId: string,
    moveType?: string,
    column?: number,
    move_number?: string
}

export const handler = async (event : APIGatewayProxyEvent) => {

    if (event && event.body) {

        const {column} = JSON.parse(event.body);
        const {gameId, playerId} = event.pathParameters as unknown as MoveParams;
        const gamePlayer = await isGamePlayer(gameId, playerId);

        if (!await isGame(gameId) || gamePlayer !.player === false) {
            return Responses._404({'message': 'Game/moves not found'});
        };
        if (gamePlayer !.data.turn === false) {
            return Responses._409({
                    'message': `${
                    gamePlayer !.data.playerName
                } tried to post when it's not their turn.`
            })
        }

        const move_number = await makeMove({gameId, playerId, column});
        return Responses._200({'move': `${gameId}/moves/${move_number}`});
    }
}
