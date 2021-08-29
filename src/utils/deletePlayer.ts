import AWS from 'aws-sdk';
import { returnState } from '../common/getState';
import { isGamePlayer } from '../common/isGamePlayer';
import { makeMove } from '../utils/makeMove';


export interface DeletedPlayer {
    gameId : string,
    playerId : string
}

const TABLE_NAME = process.env.gameTableName;

export const deletePlayer = async (params: DeletedPlayer) => {

    let options = {};
    if (process.env.IS_OFFLINE) {
		options = {
        region: 'localhost',
        endpoint: 'http://localhost:8000',
		}
    }

    const dynamodb = new AWS.DynamoDB.DocumentClient(options);
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
    
    try {
        await makeMove({gameId, playerId, moveType: 'quit'});
    }
    catch (e) {
        return(e.message)
    }

    return({'statusCode': 202});
}