import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { deletePlayer, DeletedPlayer } from '../utils/deletePlayer';
import Responses from './API_Responses';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  const data = await deletePlayer(event.pathParameters as unknown as DeletedPlayer);

  switch(data.statusCode) {
    case 404:
      return Responses._404({'message': 'Game not found or player is not a part of it'});
    case 410:
      return Responses._410({'message': 'Game is already in DONE state'});
    default:
      return Responses._202({'message': 'Success'});
    }
}
