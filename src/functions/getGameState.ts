import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
// import AWS from "aws-sdk";
// const TABLE_NAME = process.env.gameTableName;
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

//   const params = {
//     ExpressionAttributeValues: {
//       ":itemtype": "game",
//       ":Id": Id
//     },
//     ExpressionAttributeNames: {
//       "#state": "state"
//     },
//     KeyConditionExpression: 'itemType = :itemtype and Id = :Id',
//     ProjectionExpression: "#state, player1, player2, winner",
//     TableName: TABLE_NAME as string,
//   }

// const game: {[key: string]: any} = await dynamodb.query(params).promise();
// if (game) {
//   const Items = game.Items[0];
//     const gameState = {
//       "players": [
//         Items.player1,
//         Items.player2
//       ],
//         "state": Items.state,
//         "winner": Items.winner
//     }

  //   return {
  //     statusCode: 200,
  //     body: JSON.stringify(
  //       {
  //         message: gameState
  //       },
  //       null,
  //       2
  //     ),
  //   }
  // };

  // return {
  //   statusCode: 200,
  //   body: JSON.stringify(
  //     {
  //       message: "No Games found"
  //     },
  //     null,
  //     2
  //   ),
  // }
  // }