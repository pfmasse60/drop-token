"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
// import AWS from "aws-sdk";
// const TABLE_NAME = process.env.gameTableName;
const returnState_1 = require("../utils/returnState");
const handler = async (event) => {
    const Id = event.pathParameters?.gameId;
    if (/[ `!@#$%^&*()_]/.test(Id) === true) {
        return responseApi._400({ body: { message: 'Malformed request' } });
    }
    const returnedState = await returnState_1.returnState(Id);
    if (!returnedState) {
        return responseApi._404({ body: { message: 'Game/moves not found' } });
    }
    return responseApi._200({ "gameId": returnedState });
};
exports.handler = handler;
const responseApi = {
    _200: (body) => {
        return {
            statusCode: 200,
            body: JSON.stringify(body, null, 2),
        };
    },
    _400: (body) => {
        return {
            statusCode: 400,
            body: JSON.stringify(body, null, 2),
        };
    },
    _404: (body) => {
        return {
            statusCode: 404,
            body: JSON.stringify(body, null, 2),
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
