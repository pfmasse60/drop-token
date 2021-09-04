"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const API_Dynamodb_1 = __importDefault(require("../common/API_Dynamodb"));
const TABLE_NAME = process.env.gameTableName;
exports.default = async (Id) => {
    const params = {
        ExpressionAttributeValues: {
            ":itemtype": "game",
            ":Id": Id
        },
        ExpressionAttributeNames: {
            "#state": "state"
        },
        KeyConditionExpression: 'itemType = :itemtype and Id = :Id',
        ProjectionExpression: "#state, player1, player2, winner",
        TableName: TABLE_NAME,
    };
    const data = await API_Dynamodb_1.default.query2(params);
    if (data && data.length > 0) {
        const gameState = {
            "players": [
                data[0].player1,
                data[0].player2
            ],
            "state": data[0].state,
        };
        return gameState;
    }
    return (null);
};
