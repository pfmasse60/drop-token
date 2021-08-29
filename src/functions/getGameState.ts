import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { returnState } from '../common/getState';
import Responses from '../common/API_Responses';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  const Id = event.pathParameters?.gameId as string;

  if (/[ `!@#$%^&*()_]/.test(Id)=== true) {
    return Responses._400({body: {message: 'Malformed request'}})
  }

  const returnedState = await returnState(Id);

  if (!returnedState) {
    return Responses._404({body: {message: 'Game/moves not found'}});
  }
  return Responses._200({"gameId": returnedState});
};

