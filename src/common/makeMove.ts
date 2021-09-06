import {v4 as uuidv4} from 'uuid';
import {moveCounter} from './moveCounter';
import Dynamo from './API_Dynamodb';
import gameboard from './gameBoard';
import setGameState from './setGameState';
import setGameWinner from './setGameWinner';

export interface MoveParams {
    gameId: string,
    playerId: string,
    // moveType?: string,
    column?: number,
    move_type?: string
}

const TABLE_NAME = process.env.gameTableName;

export const makeMove = async (params : MoveParams) => {

    let {
        gameId,
        playerId,
        column = 0,
        move_type = 'move'
    } = params;
    let result: "winner" | "success" | "illegal" | 'draw' | null = null;

    const playerParams = {
        ExpressionAttributeValues: {
            ':playerId': playerId,
            ':gameId': gameId
        },
        ExpressionAttributeNames: {
            '#playerId': 'Id',
            '#gameId': 'gameId'
        },
        KeyConditionExpression: '#playerId = :playerId and #gameId = :gameId',
        ProjectionExpression: 'playerName',
        TableName: TABLE_NAME as string,
        IndexName: 'PlayerIndex'
    }
    const playerName = await Dynamo.query(playerParams);
    const move_number = await moveCounter(gameId);


    if (playerName && playerName.Items) {
        const PlayerName = playerName.Items[0].playerName
        if (move_type === 'quit') {
            result = 'success';
            await setGameState(gameId, 'DONE');
        } else {
            result = await gameboard.add(column, PlayerName as string, gameId);
            console.log(`RESULT FROM GAMEBOARD ${result}`)
        }

        switch (result) {
            case 'success':
                try {
                    await Dynamo.put(TABLE_NAME as string, {
                        itemType: 'move',
                        Id: uuidv4(),
                        gameId,
                        playerId,
                        playerName: playerName !.Items[0].playerName,
                        moveType: move_type,
                        move_number,
                        column
                    });
                } catch (e) {
                    console.log(e.message);
                }
                return move_number;
            case 'winner':
                try {
                    await Dynamo.put(TABLE_NAME as string, {
                        itemType: 'move',
                        Id: uuidv4(),
                        gameId,
                        playerId,
                        playerName: playerName !.Items[0].playerName,
                        moveType: move_type,
                        move_number,
                        column
                    });
                } catch (e) {
                    console.log(e.message);
                }
                await setGameState(gameId, 'DONE');
                await setGameWinner(gameId, playerName !.Items[0].playerName);
                return move_number;
            case 'draw':
                try {
                    await Dynamo.put(TABLE_NAME as string, {
                        itemType: 'move',
                        Id: uuidv4(),
                        gameId,
                        playerId,
                        playerName: playerName !.Items[0].playerName,
                        moveType: move_type,
                        move_number,
                        column
                    });
                } catch (e) {
                    console.log(e.message);
                }
                await setGameState(gameId, 'DONE');
                await setGameWinner(gameId, null);
                return move_number;
            default:
                return 'Illegal Move';

        }
    }
}
