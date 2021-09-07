import {v4 as uuidv4} from 'uuid';
import {moveCounter} from './moveCounter';
import Dynamo from './API_Dynamodb';
import gameboard from './gameBoard';
import setGameState from './setGameState';
import setGameWinner from './setGameWinner';
import AWS from 'aws-sdk';

export interface MoveParams {
    gameId: string,
    playerId: string,
    column?: number,
    move_type?: string
}

let options = {};
if (process.env.IS_OFFLINE) {
    options = {
        region: 'localhost',
        endpoint: 'http://localhost:8000'
    }
}

const dynamodb = new AWS.DynamoDB.DocumentClient(options);

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
            ':gameId': gameId,
            ':itemType': 'player'
        },
        ExpressionAttributeNames: {
            '#gameId': 'gameId',
            '#itemType': 'itemType'
        },
        KeyConditionExpression: '#gameId = :gameId and #itemType = :itemType',
        ProjectionExpression: 'playerName, Id',
        TableName: TABLE_NAME as string,
        IndexName: 'MoveNumberIndex'
    }
    const playerNames = await Dynamo.query(playerParams);
    const move_number = await moveCounter(gameId);

    let value;
    let PlayerName: string = '';
    if (playerNames && playerNames.Items) {
        for (value of playerNames ?. Items) {
            if (value.Id === playerId) {
                PlayerName = value.playerName;
                await setPlayerTurn(playerId, false);
            } else { 
                await setPlayerTurn(value.Id, true);
            }
        }
        if (move_type === 'quit') {
            result = 'success';
            await setGameState(gameId, 'DONE');
        } else {
            result = await gameboard.add(column, PlayerName, gameId);
        }

        switch (result) {
            case 'success':
                try {
                    await Dynamo.put(TABLE_NAME as string, {
                        itemType: 'move',
                        Id: uuidv4(),
                        gameId,
                        playerId,
                        playerName: PlayerName,
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
                        playerName: PlayerName,
                        moveType: move_type,
                        move_number,
                        column
                    });
                } catch (e) {
                    console.log(e.message);
                }
                await setGameState(gameId, 'DONE');
                await setGameWinner(gameId, PlayerName);
                return move_number;
            case 'draw':
                try {
                    await Dynamo.put(TABLE_NAME as string, {
                        itemType: 'move',
                        Id: uuidv4(),
                        gameId,
                        playerId,
                        playerName: PlayerName,
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
    return 'Illegal Move';
}

export const setPlayerTurn = async (playerId : string, turn : boolean) => {
    const params = {
        TableName: TABLE_NAME as string,
        Key: {
            itemType: 'player',
            Id: playerId
        },
        UpdateExpression: 'set #turn = :turn',
        ExpressionAttributeValues: {
            ':turn': turn
        },
        ExpressionAttributeNames: {
            '#turn': 'turn'
        }
    }
    await dynamodb.update(params).promise();
}
