"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const TABLE_NAME = process.env.gameTableName;
exports.default = async (gameId) => {
    let options = {};
    if (process.env.IS_OFFLINE) {
        options = {
            region: 'localhost',
            endpoint: 'http://localhost:8000',
        };
    }
    const dynamodb = new aws_sdk_1.default.DynamoDB.DocumentClient(options);
    const params = {
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
    };
    const game = await dynamodb.query(params).promise();
    if (game?.Items[0] == undefined) {
        return false;
    }
    return true;
};
