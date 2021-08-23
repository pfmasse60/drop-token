'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGamePlayer = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const TABLE_NAME = process.env.gameTableName;
const isGamePlayer = async (gameId, playerId) => {
    let options = {};
    if (process.env.IS_OFFLINE) {
        options = {
            region: 'localhost',
            endpoint: 'http://localhost:8000',
        };
    }
    const dynamodb = new aws_sdk_1.default.DynamoDB.DocumentClient(options);
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
        ProjectionExpression: 'player',
        TableName: TABLE_NAME,
        IndexName: 'PlayerIndex'
    };
    const playerResult = await dynamodb.query(playerParams).promise();
    if (playerResult.Count && playerResult.Count > 0) {
        return (true);
    }
    else {
        return (false);
    }
};
exports.isGamePlayer = isGamePlayer;
