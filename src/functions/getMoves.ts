import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import AWS from 'aws-sdk';
import Responses from './API_Responses';

const TABLE_NAME = process.env.gameTableName;

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  const {gameId} = event.pathParameters as unknown as {gameId: string};
  const dynamodb = new AWS.DynamoDB.DocumentClient();

  // ToDo
  // const search = event.queryStringParameters;

  let keyCondition = '#gameId = :gameId';
  let expressionAttValues = {
    ':gameId': gameId
  };
  let expressionAttNames = {
    '#gameId': 'gameId',
    '#column': 'column'
  };

  const qParams = {
    ExpressionAttributeValues: expressionAttValues,
    ExpressionAttributeNames: expressionAttNames,
    KeyConditionExpression: keyCondition,
    ProjectionExpression: 'moveType, playerName, #column',
    TableName: TABLE_NAME as string,
    IndexName: 'MoveNumberIndex'
  }
  const data = await dynamodb.query(qParams).promise();

  if(data.Items && data.Items.length > 0) {

    return Responses._200({'moves': data.Items});
  }

    return Responses._404({'message': 'Game/moves not found'});

  }