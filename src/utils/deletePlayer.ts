'use strict'

import AWS from 'aws-sdk';
import { returnState } from '../utils/returnState';
import { isGamePlayer } from '../utils/isGamePlayer';
import { makeMove } from '../utils/makeMove';
import { moveCounter } from './moveCounter';


export interface DeletedPlayer {
    gameId : string,
    playerId : string
}

const TABLE_NAME = process.env.gameTableName;

export const deletePlayer = async (params: DeletedPlayer) => {
    const dynamodb = new AWS.DynamoDB.DocumentClient();
    const {gameId, playerId} = params as unknown as DeletedPlayer;

    const gameState = await returnState(gameId);

    if (!gameState || await isGamePlayer(gameId, playerId) === false) {
      return({'statusCode': 404});
    }
    
    if (gameState.state === 'DONE'){
        return({'statusCode': 410});
    }

    const gameStateParams = {
        TableName: TABLE_NAME as string,
        Key: {itemType: 'game', Id: gameId},
        UpdateExpression: 'set #state = :done',
        ExpressionAttributeNames:{
            '#state': 'state'
        },
        ExpressionAttributeValues:{':done': 'DONE'}
    };

    try {
        await dynamodb.update(gameStateParams).promise() 
    }
    catch (e) {
        return(e.message)
    }
    const move_number = await moveCounter(gameId);
    
    try {
        await makeMove({gameId, playerId, moveType: 'quit', move_number});
    }
    catch (e) {
        return(e.message)
    }

    return({'statusCode': 202});
}