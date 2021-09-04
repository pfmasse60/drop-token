"use strict";
// AWS Lambda API endpoint to allow player to quit and end game
// Pete Masse - 7/30/2021
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const API_Responses_1 = __importDefault(require("../common/API_Responses"));
const API_Dynamodb_1 = __importDefault(require("../common/API_Dynamodb"));
const getState_1 = __importDefault(require("../common/getState"));
const isGamePlayer_1 = require("../common/isGamePlayer");
const makeMove_1 = require("../common/makeMove");
// Serverless invironment variable set inside serverless.yml
const TABLE_NAME = process.env.gameTableName;
const handler = async (event) => {
    const { gameId, playerId } = event.pathParameters;
    const gameState = await getState_1.default(gameId);
    const gamePlayer = await isGamePlayer_1.isGamePlayer(gameId, playerId);
    if (gameState === null || gamePlayer.player === false) {
        return API_Responses_1.default._404({ 'message': 'Game not found or player is not a part of it' });
    }
    if (gameState.state === 'DONE')
        return API_Responses_1.default._410({ 'message': 'Game is already in DONE state' });
    await makeMove_1.makeMove({ gameId, playerId, moveType: 'quit' });
    const gameStateUpdateParams = {
        TableName: TABLE_NAME,
        Key: { itemType: 'game', Id: gameId },
        UpdateExpression: 'set #state = :done',
        ExpressionAttributeNames: {
            '#state': 'state'
        },
        ExpressionAttributeValues: { ':done': 'DONE' }
    };
    await API_Dynamodb_1.default.update(gameStateUpdateParams);
    return API_Responses_1.default._202({ 'message': 'Success' });
};
exports.handler = handler;
