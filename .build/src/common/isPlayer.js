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
        ProjectionExpression: 'playerName',
        TableName: TABLE_NAME,
        IndexName: 'PlayerIndex'
    });
    if (data.Count && data.Count > 0) {
        return ({ 'player': true, 'data': data.Items });
    }
    else {
        return ({ 'player': false, 'data': null });
    }
};
exports.isGamePlayer = isGamePlayer;
