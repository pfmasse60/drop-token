import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { returnState } from '../utils/returnState';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  const Id = event.pathParameters?.gameId as string;

  if (/[ `!@#$%^&*()_]/.test(Id)=== true) {
    return responseApi._400({body: {message: 'Malformed request'}})
  }

  const returnedState = await returnState(Id);

  if (!returnedState) {
    return responseApi._404({body: {message: 'Game/moves not found'}});
  }
  return responseApi._200({"gameId": returnedState});
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
