// AWS Lambda API endpoint to allow player to quit and end game
// Pete Masse - 7/30/2021

import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import Responses from '../common/API_Responses';
import Dynamo from '../common/API_Dynamodb';
import getState from '../common/getState';
import { isGamePlayer } from '../common/isGamePlayer';
import { makeMove } from '../common/makeMove';

interface gameStatusUpdateType extends AWS.DynamoDB.DocumentClient.UpdateItemInput {
  TableName: string,
  Key: {itemType: string, Id: string}
  UpdateExpression: string,
  ExpressionAttributeNames:{
      '#state': string
  },
  ExpressionAttributeValues:{':done': string}
};

type PlayerWhoQuit = {
  gameId : string,
  playerId : string
}

// Serverless invironment variable set inside serverless.yml
const TABLE_NAME = process.env.gameTableName;
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  const {gameId, playerId} = event.pathParameters as unknown as PlayerWhoQuit;
  const gameState = await getState(gameId);
  const gamePlayer = await isGamePlayer(gameId, playerId);

  if (gameState === null || gamePlayer.player === false) {
    return Responses._404({'message': 'Game not found or player is not a part of it'});
  }
  // ToDo: change this back to gameState.state === 'DONE'
  if ('DONE' === 'DONE')
    return Responses._410({'message': 'Game is already in DONE state'});
    await makeMove({gameId, playerId, moveType: 'quit'});
    // const players = await Dynamo.query({
    //   ExpressionAttributeValues: {
    //       ':gameId': gameId
    //   },
    //   ExpressionAttributeNames: {
    //       '#gameId': 'gameId',
    //       '#Id': 'Id'
    //   },
    //   KeyConditionExpression: '#gameId = :gameId',
    //   ProjectionExpression: '#Id',
    //   TableName: TABLE_NAME as string,
    //   IndexName: 'PlayerIndex'
    // });

    // const params = players!.Items!.map(Id => playerStatus(Id, playerId));
    // console.log(params);
    // await Dynamo.update(params);

    const gameStateUpdateParams = {
      TableName: TABLE_NAME as string,
      Key: {itemType: {S: 'game'}, Id: {S: gameId}},
      UpdateExpression: 'set #state = :done',
      ExpressionAttributeNames:{
          '#state': 'state'
      },
      ExpressionAttributeValues:{':done': {
        S: 'DONE'
      }}
    };  
  await Dynamo.update(gameStateUpdateParams);
  return Responses._202({'message': 'Success'});
}

// export const playerStatus = (num: any, playerId: string) => {
//   let winnerPlayerStatus: any;
//   console.log(num.Id + ' ' + playerId);
//   if (num.Id !== playerId) {
//     winnerPlayerStatus = {
//       TableName: TABLE_NAME as string,
//       Key: {itemType: 'player', Id: num.Id},
//       UpdateExpression: 'set #winner = :true',
//       ExpressionAttributeNames:{
//         '#winner': 'winner'
//       },
//       ExpressionAttributeValues:{':true': true},
//       IndexName: 'PlayerIndex'
//     };

//   }
//   return winnerPlayerStatus;
// }
