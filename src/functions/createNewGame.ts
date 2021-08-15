import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { makeGame, Game } from '../utils/makeGame';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  if (event && event.body){
      const {players, columns, rows}: Game = JSON.parse(event.body);
    if (!players || !columns || !rows || players.length < 2) {
      return responseApi._400({body: {message: 'Malformed request'}})
    }
  }
  
  return responseApi._200({"gameId": await makeGame(event.body)});
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
  }
};