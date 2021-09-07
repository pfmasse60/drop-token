"use strict";
// AWS Lambda API endpoint to allow player to quit and end game
// Pete Masse - 7/30/2021
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const API_Responses_1 = __importDefault(require("../common/API_Responses"));
const getState_1 = __importDefault(require("../common/getState"));
const isPlayer_1 = require("../common/isPlayer");
const makeMove_1 = require("../common/makeMove");
const setGameState_1 = __importDefault(require("../common/setGameState"));
const handler = async (event) => {
    const { gameId, playerId } = event.pathParameters;
    const gameState = await getState_1.default(gameId);
    const gamePlayer = await isPlayer_1.isGamePlayer(gameId, playerId);
    if (gameState === null || gamePlayer.player === false) {
        return API_Responses_1.default._404({ 'message': 'Game not found or player is not a part of it' });
    }
    if (gameState.state === 'DONE')
        return API_Responses_1.default._410({ 'message': 'Game is already in DONE state' });
    await makeMove_1.makeMove({ gameId, playerId, move_type: 'quit' });
    await setGameState_1.default(gameId, 'DONE');
    return API_Responses_1.default._202({ 'message': 'Success' });
};
exports.handler = handler;
