"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const uuid_1 = require("uuid");
const API_Responses_1 = __importDefault(require("../common/API_Responses"));
const API_Dynamodb_1 = __importDefault(require("../common/API_Dynamodb"));
const isGame_1 = __importDefault(require("../common/isGame"));
const moveCounter_1 = require("../common/moveCounter");
const TABLE_NAME = process.env.gameTableName;
const handler = async (event) => {
    if (event && event.body) {
        const { column } = JSON.parse(event.body);
        const { gameId, playerId } = event.pathParameters;
        if (!await isGame_1.default(gameId)) {
            return API_Responses_1.default._404({ 'message': 'Game not found or player is not a part of it.' });
        }
        ;
        const playerParams = {
            ExpressionAttributeValues: {
                ':playerId': playerId,
                ':gameId': gameId
            },
            ExpressionAttributeNames: {
                '#playerId': 'Id',
                '#gameId': 'gameId'
            },
            KeyConditionExpression: '#playerId = :playerId and #gameId = :gameId',
            ProjectionExpression: 'playerName',
            TableName: TABLE_NAME,
            IndexName: 'PlayerIndex'
        };
        const data = await API_Dynamodb_1.default.query(playerParams);
        const move_number = await moveCounter_1.moveCounter(gameId);
        if (data?.Items && data?.Items?.length > 0) {
            if (column == undefined || column < 0) {
                return API_Responses_1.default._400({ message: 'Malformed request' });
            }
            try {
                await API_Dynamodb_1.default.put(TABLE_NAME, {
                    itemType: 'move',
                    Id: uuid_1.v4(),
                    gameId,
                    playerId,
                    playerName: data.Items[0].playerName,
                    moveType: 'move',
                    move_number,
                    column
                });
            }
            catch (e) {
                console.log(e.message);
            }
            return API_Responses_1.default._200({ "move": gameId + "/moves/" + move_number });
        }
        return API_Responses_1.default._404({ message: 'Game/moves not found' });
    }
};
exports.handler = handler;
