"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGamePlayer = void 0;
const API_Dynamodb_1 = __importDefault(require("./API_Dynamodb"));
const TABLE_NAME = process.env.gameTableName;
const isGamePlayer = async (gameId, playerId) => {
    const data = await API_Dynamodb_1.default.query({
        ExpressionAttributeValues: {
            ':playerId': playerId,
            ':gameId': gameId
        },
        ExpressionAttributeNames: {
            '#playerId': 'Id',
            '#gameId': 'gameId'
        },
        KeyConditionExpression: '#playerId = :playerId and #gameId = :gameId',
        ProjectionExpression: 'playerName, Id, turn',
        TableName: TABLE_NAME,
        IndexName: 'PlayerIndex'
    });
    let value;
    if (data?.Items && data.Items?.length > 0) {
        value = data?.Items[0];
        if (value.Id === playerId) {
            return ({ 'player': true, 'data': value });
        }
        return ({ 'player': false, 'data': value });
    }
};
exports.isGamePlayer = isGamePlayer;
