// AWS Lambda API endpoint to allow player to quit and end game
// Pete Masse - 7/30/2021

import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import Responses from '../common/API_Responses';
import Dynamo from '../common/API_Dynamodb';
import { returnState } from '../common/getState';
import { isGamePlayer } from '../common/isGamePlayer';

interface UpdateType extends AWS.DynamoDB.DocumentClient.UpdateItemInput {

  TableName: string,
  Key: {itemType: string, Id: string}
  UpdateExpression: string,
  ExpressionAttributeNames:{
      '#state': string
  },
  ExpressionAttributeValues:{':done': string}
};

type DeletedPlayer = {
  gameId : string,
  playerId : string
}

// Serverless invironment variable set inside serverless.yml
const TABLE_NAME = process.env.gameTableName;
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  const {gameId, playerId} = event.pathParameters as unknown as DeletedPlayer;

  const gameStateParams = {
    TableName: TABLE_NAME as string,
    Key: {itemType: 'game', Id: gameId},
    UpdateExpression: 'set #state = :done',
    ExpressionAttributeNames:{
        '#state': 'state'
    },
    ExpressionAttributeValues:{':done': 'DONE'}
  };
  
  const gameState = await returnState(gameId);
  
  if (gameState?.state === 'DONE')
    return Responses._410({'message': 'Game is already in DONE state'});
  
  if (!gameState || await isGamePlayer(gameId, playerId) === false)
    return Responses._404({'message': 'Game not found or player is not a part of it'});
      
  await Dynamo.update(gameStateParams as UpdateType);
  return Responses._202({'message': 'Success'});
}
