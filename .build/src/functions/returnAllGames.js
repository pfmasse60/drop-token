"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
// import { APIGatewayProxyHandler } from 'aws-lambda';
const API_Dynamodb_1 = __importDefault(require("../common/API_Dynamodb"));
const TABLE_NAME = process.env.gameTableName;
const handler = async () => {
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
    const games = await API_Dynamodb_1.default.query(params);
    if (games && games.Items) {
        var newArray = games.Items.map(function (item) {
            return [item.Id].join(" ");
        });
        return (JSON.stringify({ "games": newArray }, null, 2));
    }
    else {
        return (JSON.stringify({ "games": [] }));
    }
};
exports.handler = handler;
