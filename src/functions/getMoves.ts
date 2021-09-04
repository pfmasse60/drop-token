// AWS Lambda API endpoint to retrieve all in progress games
// Pete Masse - 7/30/2021

import {APIGatewayProxyEvent, APIGatewayProxyHandler} from 'aws-lambda';
import Responses from '../common/API_Responses';
import Dynamo from '../common/API_Dynamodb';
import isGame from '../common/isGame';

// Serverless invironment variable set inside serverless.yml
const TABLE_NAME = process.env.gameTableName;

export const handler: APIGatewayProxyHandler = async (event : APIGatewayProxyEvent) => {

    const {gameId} = event.pathParameters as unknown as {gameId: string};

    if (await isGame(gameId) === false) {
        return Responses._404({'message': 'Game/moves not found'});
    }

    const search = event.queryStringParameters;
    let qParams;

    if (search == null) {
        let keyCondition = '#gameId = :gameId and #itemType = :itemType';
        let expressionAttValues = {
            ':gameId': gameId,
            ':itemType': 'move'
        };
        let expressionAttNames = {
            '#gameId': 'gameId',
            '#column': 'column',
            '#itemType': 'itemType'
        };

        qParams = {
            ExpressionAttributeValues: expressionAttValues,
            ExpressionAttributeNames: expressionAttNames,
            KeyConditionExpression: keyCondition,
            ProjectionExpression: 'moveType, playerName, #column',
            TableName: TABLE_NAME as string,
            IndexName: 'MoveNumberIndex'
        }
    } else {
        let startInt = +search.start!;
        let untilInt = +search.until!;
        
        if (untilInt < startInt || startInt < 0) {
            return Responses._400({'message': 'Malformed request'});
        }

        let keyCondition = '#gameId = :gameId and #itemType = :itemType';

        let expressionAttValues = {
            ':gameId': gameId,
            ':itemType': 'move',
            ':start': startInt,
            ':until': untilInt
        };

        let expressionAttNames = {
            '#gameId': 'gameId',
            '#column': 'column',
            '#itemType': 'itemType',
            '#move_number': 'move_number'
        };

        qParams = {
            ExpressionAttributeValues: expressionAttValues,
            ExpressionAttributeNames: expressionAttNames,
            KeyConditionExpression: keyCondition,
            FilterExpression: '#move_number >= :start and #move_number <= :until ',
            ProjectionExpression : 'moveType, playerName, #column',
            TableName : TABLE_NAME as string,
            IndexName : 'MoveNumberIndex'
        }
    }
    const data = await Dynamo.query(qParams);
    
    return Responses._200({'moves': data!.Items});
}
