import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import getState from '../common/getState';
import Responses from '../common/API_Responses';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  const Id = event.pathParameters?.gameId as string;

  if (/[ `!@#$%^&*()_]/.test(Id)=== true) {
    return Responses._400({body: {message: 'Malformed request'}})
  }

  const gameState = await getState(Id);

  if (!gameState) {
    return Responses._404({body: {message: 'Game/moves not found'}});
  }
  return Responses._200({"gameId": gameState});
};

