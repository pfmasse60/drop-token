"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const API_Responses_1 = __importDefault(require("../common/API_Responses"));
const makeMove_1 = require("../common/makeMove");
const isGame_1 = __importDefault(require("../common/isGame"));
const isPlayer_1 = require("../common/isPlayer");
const handler = async (event) => {
    if (event && event.body) {
        const { column } = JSON.parse(event.body);
        const { gameId, playerId } = event.pathParameters;
        const gamePlayer = await isPlayer_1.isGamePlayer(gameId, playerId);
        if (!await isGame_1.default(gameId) || gamePlayer.player === false) {
            return API_Responses_1.default._404({ 'message': 'Game/moves not found' });
        }
        ;
        if (gamePlayer.data.turn === false) {
            return API_Responses_1.default._409({
                'message': `${gamePlayer.data.playerName} tried to post when it's not their turn.`
            });
        }
        const move_number = await makeMove_1.makeMove({ gameId, playerId, column });
        return API_Responses_1.default._200({ 'move': `${gameId}/moves/${move_number}` });
    }
};
exports.handler = handler;
