import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
// import { deletePlayer, DeletedPlayer } from '../utils/deletePlayer';
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

type keyType = {
  gameId : string,
  playerId : string
};

type DeletedPlayer = {
  gameId : string,
  playerId : string
}

// type AttributeType = {
//   UpdateExpression: string,
//   ExpressionAttributeNames: string,
//   ExpressionAttributeValues: string
// };

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

  if (!gameState || await isGamePlayer(gameId, playerId) === false) {
      return Responses._404({'message': 'Game not found or player is not a part of it'});
  }
      
  const data = await Dynamo.update(gameStateParams as UpdateType);

  // const data = await deletePlayer(event.pathParameters as unknown as DeletedPlayer);

  switch(data.statusCode) {
    case 404:
      return Responses._404({'message': 'Game not found or player is not a part of it'});
    case 410:
      return Responses._410({'message': 'Game is already in DONE state'});
    default:
      return Responses._202({'message': 'Success'});
    }
}
