"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const TABLE_NAME = process.env.gameTableName;
exports.default = async (Id) => {
    const dynamodb = new aws_sdk_1.default.DynamoDB.DocumentClient();
    const params = {
        ExpressionAttributeValues: {
            ':itemtype': 'game',
            ':Id': Id
        },
        ExpressionAttributeNames: {
            "#state": "state"
        },
        KeyConditionExpression: 'itemType = :itemtype and Id = :Id',
        ProjectionExpression: '#state',
        TableName: TABLE_NAME,
    };
    const game = await dynamodb.query(params).promise();
    if (game.state === 'IN_PROGRESS') {
        return true;
    }
    return false;
};
