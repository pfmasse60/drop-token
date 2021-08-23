'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePlayer = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const returnState_1 = require("../utils/returnState");
const isGamePlayer_1 = require("../utils/isGamePlayer");
const makeMove_1 = require("../utils/makeMove");
const TABLE_NAME = process.env.gameTableName;
const deletePlayer = async (params) => {
    let options = {};
    if (process.env.IS_OFFLINE) {
        options = {
            region: 'localhost',
            endpoint: 'http://localhost:8000',
        };
    }
    const dynamodb = new aws_sdk_1.default.DynamoDB.DocumentClient(options);
    const { gameId, playerId } = params;
    const gameState = await returnState_1.returnState(gameId);
    if (!gameState || await isGamePlayer_1.isGamePlayer(gameId, playerId) === false) {
        return ({ 'statusCode': 404 });
    }
    if (gameState.state === 'DONE') {
        return ({ 'statusCode': 410 });
    }
    const gameStateParams = {
        TableName: TABLE_NAME,
        Key: { itemType: 'game', Id: gameId },
        UpdateExpression: 'set #state = :done',
        ExpressionAttributeNames: {
            '#state': 'state'
        },
        ExpressionAttributeValues: { ':done': 'DONE' }
    };
    try {
        await dynamodb.update(gameStateParams).promise();
    }
    catch (e) {
        return (e.message);
    }
    try {
        await makeMove_1.makeMove({ gameId, playerId, moveType: 'quit' });
    }
    catch (e) {
        return (e.message);
    }
    return ({ 'statusCode': 202 });
};
exports.deletePlayer = deletePlayer;
