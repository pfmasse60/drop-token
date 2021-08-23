"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnMove = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const TABLE_NAME = process.env.gameTableName;
const returnMove = async (params) => {
    let options = {};
    if (process.env.IS_OFFLINE) {
        options = {
            region: 'localhost',
            endpoint: 'http://localhost:8000',
        };
    }
    const { gameId, move_number } = params;
    const dynamodb = new aws_sdk_1.default.DynamoDB.DocumentClient(options);
    const moveParams = {
        ExpressionAttributeValues: {
            ':gameId': gameId,
            ':move_number': parseInt(move_number),
            ':itemType': 'move'
        },
        ExpressionAttributeNames: {
            '#gameId': 'gameId',
            '#itemType': 'itemType',
            '#move_number': 'move_number',
            '#column': 'column'
        },
        KeyConditionExpression: '#gameId = :gameId and #itemType = :itemType',
        FilterExpression: '#move_number = :move_number',
        ProjectionExpression: 'itemType, playerId, #column',
        TableName: TABLE_NAME,
        IndexName: 'MoveNumberIndex'
    };
    const result = await dynamodb.query(moveParams).promise();
    if (!result.Items || result.Items.length < 1) {
        return ({ 'statusCode': 404 });
    }
    const data = result.Items[0];
    const playerParams = {
        ExpressionAttributeValues: {
            ':playerId': data.playerId,
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
    let playerName;
    try {
        playerName = await dynamodb.query(playerParams).promise();
    }
    catch (e) {
        return (e.message);
    }
    if (playerName.Items && playerName.Items.length > 0) {
        playerName = playerName.Items[0];
    }
    return ({
        'statusCode': 200,
        'data': {
            'type': data.itemType,
            'player': playerName.playerName,
            'column': data.column
        }
    });
};
exports.returnMove = returnMove;
