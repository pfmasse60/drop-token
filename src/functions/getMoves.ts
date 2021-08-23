import {APIGatewayProxyEvent, APIGatewayProxyHandler} from 'aws-lambda';
import AWS from 'aws-sdk';
import Responses from './API_Responses';

const TABLE_NAME = process.env.gameTableName;

export const handler: APIGatewayProxyHandler = async (event : APIGatewayProxyEvent) => {

    let options = {};
    if (process.env.IS_OFFLINE) {
		options = {
        region: 'localhost',
        endpoint: 'http://localhost:8000',
		}
    }

    const {gameId} = event.pathParameters as unknown as {
        gameId: string
    };
    const dynamodb = new AWS.DynamoDB.DocumentClient(options);

    const search = event.queryStringParameters;
    let start = search ?. start as string;
    let until = search ?. until as string;

    let qParams;

    if (start == null || until == null) {
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
        let startInt = parseInt(start);
        let untilInt = parseInt(until);
        
        if (untilInt < startInt || startInt<= 0) {
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
    // return Responses._400({'message': qParams});
    const data = await dynamodb.query(qParams).promise();

    if (data.Items && data.Items.length > 0) {

        return Responses._200({'moves': data.Items});
    }
    return Responses._404({'message': data});
}
