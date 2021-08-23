"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnGames = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const TABLE_NAME = process.env.gameTableName;
const returnGames = async () => {
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
            ":itemtype": "game",
            ":theState": "IN_PROGRESS"
        },
        ExpressionAttributeNames: {
            "#state": "state"
        },
        KeyConditionExpression: 'itemType = :itemtype',
        FilterExpression: '#state = :theState',
        ProjectionExpression: "Id",
        TableName: TABLE_NAME,
    };
    const number = await dynamodb.query(params).promise();
    if (number && number.Items) {
        var newArray = number.Items.map(function (item) {
            return [item.Id].join(" ");
        });
        return (JSON.stringify({ "games": newArray }, null, 2));
    }
    else {
        return (JSON.stringify({ "games": [] }));
    }
};
exports.returnGames = returnGames;
