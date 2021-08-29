"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
// import { deletePlayer, DeletedPlayer } from '../utils/deletePlayer';
const API_Responses_1 = __importDefault(require("../common/API_Responses"));
const API_Dynamodb_1 = __importDefault(require("../common/API_Dynamodb"));
const getState_1 = require("../common/getState");
const isGamePlayer_1 = require("../common/isGamePlayer");
;
// type AttributeType = {
//   UpdateExpression: string,
//   ExpressionAttributeNames: string,
//   ExpressionAttributeValues: string
// };
const TABLE_NAME = process.env.gameTableName;
const handler = async (event) => {
    const { gameId, playerId } = event.pathParameters;
    const gameStateParams = {
        TableName: TABLE_NAME,
        Key: { itemType: 'game', Id: gameId },
        UpdateExpression: 'set #state = :done',
        ExpressionAttributeNames: {
            '#state': 'state'
        },
        ExpressionAttributeValues: { ':done': 'DONE' }
    };
    const gameState = await getState_1.returnState(gameId);
    if (!gameState || await isGamePlayer_1.isGamePlayer(gameId, playerId) === false) {
        return API_Responses_1.default._404({ 'message': 'Game not found or player is not a part of it' });
    }
    const data = await API_Dynamodb_1.default.update(gameStateParams);
    // const data = await deletePlayer(event.pathParameters as unknown as DeletedPlayer);
    switch (data.statusCode) {
        case 404:
            return API_Responses_1.default._404({ 'message': 'Game not found or player is not a part of it' });
        case 410:
            return API_Responses_1.default._410({ 'message': 'Game is already in DONE state' });
        default:
            return API_Responses_1.default._202({ 'message': 'Success' });
    }
};
exports.handler = handler;
