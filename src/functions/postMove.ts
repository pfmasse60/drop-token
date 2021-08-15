import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { makeMove, MoveParams } from '../utils/makeMove';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  let returnedMove: string = "";

  if (event && event.body){
    const {column} = JSON.parse(event.body);
    
    if (!column) {
      return responseApi._400({body: {message: 'Malformed request'}})
    }
    const {gameId, playerId} = event.pathParameters as unknown as MoveParams;

    returnedMove = await makeMove({gameId, playerId, moveType: 'move', column});
  }

  if (returnedMove.length < 1) {
    return responseApi._404({body: {message: 'Game/moves not found'}});
  }
  return responseApi._200({"gameId": returnedMove});
  };

  const responseApi = {
    _200: (body: {[key: string] : any}) => {
      return {
        statusCode: 200,
        body: JSON.stringify(body,null,2),
      };
    },
  
    _400: (body: {[key: string] : any}) => {
      return {
        statusCode: 400,
        body: JSON.stringify(body,null,2),
      };
    },
    _404: (body: {[key: string] : any}) => {
      return {
        statusCode: 404,
        body: JSON.stringify(body,null,2),
      };
    }
  };
