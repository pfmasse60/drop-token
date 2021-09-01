"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const API_Responses_1 = __importDefault(require("../common/API_Responses"));
const makeMove_1 = require("../common/makeMove");
const handler = async (event) => {
    if (event && event.body) {
        const { column } = JSON.parse(event.body);
        const { gameId, playerId } = event.pathParameters;
        const playerMove = await makeMove_1.makeMove({ gameId, playerId, column });
        // if(!await isGame(gameId)) {
        //   return Responses._404({'message': 'Game not found or player is not a part of it.'});
        // };
        // const playerParams = {
        //   ExpressionAttributeValues: {
        //     ':playerId': playerId,
        //     ':gameId': gameId
        //   },
        //   ExpressionAttributeNames: {
        //     '#playerId': 'Id',
        //     '#gameId': 'gameId'
        //   },
        //   KeyConditionExpression: '#playerId = :playerId and #gameId = :gameId',
        //   ProjectionExpression: 'playerName',
        //   TableName: TABLE_NAME as string,
        //   IndexName: 'PlayerIndex'
        //   }
        //   const data = await Dynamo.query(playerParams);
        //   const move_number = await moveCounter(gameId);
        //   if(data?.Items && data?.Items?.length > 0) {
        //     if (column == undefined || column < 0) {
        //       return Responses._400({message: 'Malformed request'})
        //     }
        //   try {
        //     await Dynamo.put(TABLE_NAME!,
        //       {
        //         itemType: 'move',
        //         Id: uuidv4(),
        //         gameId,
        //         playerId,
        //         playerName: data.Items[0].playerName,
        //         moveType: 'move',
        //         move_number,
        //         column
        //       })
        //   } catch (e) {
        //     console.log(e.message)
        //   }
        return API_Responses_1.default._200({ move: playerMove });
    }
};
exports.handler = handler;
