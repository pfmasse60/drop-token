import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { returnMove, MoveRequestParams } from '../utils/returnMove';
import Responses from './API_Responses';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  const {gameId, move_number} = event.pathParameters as unknown as MoveRequestParams;

    const data = await returnMove({gameId, move_number});

    switch(data.statusCode) {
      case 404:
        // return Responses._404({'message': 'Game/moves not found'});
        return Responses._404(data.data);
      case 400:
        return Responses._400({'message': 'Malformed request'});
      default:
        return Responses._202(data.data);
    }
}
