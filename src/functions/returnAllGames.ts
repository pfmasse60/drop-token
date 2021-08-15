import { APIGatewayProxyHandler } from 'aws-lambda';
import { returnGames } from '../utils/returnGames';
// import AWS from "aws-sdk";

export const handler: APIGatewayProxyHandler = async () => {
  return {
    statusCode: 200,
    body: await returnGames()
  }
}
  