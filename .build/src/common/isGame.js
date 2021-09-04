"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const API_Dynamodb_1 = __importDefault(require("../common/API_Dynamodb"));
const TABLE_NAME = process.env.gameTableName;
exports.default = async (gameId) => {
    const game = await API_Dynamodb_1.default.query({
        ExpressionAttributeValues: {
            ':itemtype': 'game',
            ':Id': gameId
        },
        ExpressionAttributeNames: {
            "#state": "state"
        },
        KeyConditionExpression: 'itemType = :itemtype and Id = :Id',
        ProjectionExpression: '#state',
        TableName: TABLE_NAME,
    });
    if (game.Items?.length === 0) {
        return false;
    }
    return true;
};
