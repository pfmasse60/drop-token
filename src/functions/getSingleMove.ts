import {APIGatewayProxyEvent, APIGatewayProxyHandler} from 'aws-lambda';
import Responses from '../common/API_Responses';
import Dynamo from '../common/API_Dynamodb';
import isGame from '../common/isGame';

interface MoveRequestParams {
    gameId: string,
    move_number: string
}

const TABLE_NAME = process.env.gameTableName;

export const handler: APIGatewayProxyHandler = async (event : APIGatewayProxyEvent) => {
    const {gameId, move_number} = event.pathParameters as unknown as MoveRequestParams;

    if (await isGame(gameId) === false) {
        return Responses._404({'message': 'Game/moves not found'});
    };

    const moveParams = {
        ExpressionAttributeValues: {
            ':gameId': gameId,
            ':move_number': + move_number,
            ':itemType': 'move'
        },
        ExpressionAttributeNames: {
            '#gameId': 'gameId',
            '#itemType': 'itemType',
            '#move_number': 'move_number',
            '#column': 'column'
        },
        KeyConditionExpression: '#gameId = :gameId and #itemType = :itemType',
        FilterExpression: '#move_number = :move_number',
        ProjectionExpression: 'itemType, playerId, #column',
        TableName: TABLE_NAME as string,
        IndexName: 'MoveNumberIndex'
    }

    const data = await Dynamo.query(moveParams);

    if (!data?.Items || data.Items?. length <= 0) {
        return Responses._404({'message': 'Game/moves not found'});
    }

    const playerParams = {
        ExpressionAttributeValues: {
            ':playerId': data.Items[0].playerId,
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
    let playerName;

    try {
        playerName = await Dynamo.query(playerParams);
    } catch (e) {
        return(e.message);
    }

    if (playerName?. Items && playerName?.Items?.length > 0) {
        playerName = playerName.Items[0];
    }

    return Responses._202({
        'type': data.Items[0].itemType,
        'player': playerName!.playerName,
        'column': data.Items[0].column
    });
}
