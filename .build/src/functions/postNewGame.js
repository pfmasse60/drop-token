"use strict";
// AWS Lambda API endpoint to create new game
// Creates new 4 x 4 gameboard and two players
// Pete Masse - 7/30/2021
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const API_Responses_1 = __importDefault(require("../common/API_Responses"));
const API_Dynamodb_1 = __importDefault(require("../common/API_Dynamodb"));
const uuid_1 = require("uuid");
// Serverless invironment variables set inside serverless.yml
const STATE = process.env.gameState;
const TABLE_NAME = process.env.gameTableName;
const handler = async (event) => {
    const gameId = uuid_1.v4();
    const { players, columns, rows } = JSON.parse(event.body);
    if (!players || !columns || !rows || players.length != 2)
        return API_Responses_1.default._400({ 'message': 'Malformed Requst' });
    const [player1, player2] = players;
    await API_Dynamodb_1.default.put(TABLE_NAME, {
        itemType: 'game',
        Id: gameId,
        player1,
        player2,
        winner: '',
        columns,
        rows,
        maxMoves: columns * rows,
        state: STATE,
        col0: [],
        col1: [],
        col2: [],
        col3: []
    });
    await API_Dynamodb_1.default.put(TABLE_NAME, {
        itemType: 'player',
        Id: uuid_1.v4(),
        gameId: gameId,
        playerName: player1,
        winner: false
    });
    await API_Dynamodb_1.default.put(TABLE_NAME, {
        itemType: 'player',
        Id: uuid_1.v4(),
        gameId: gameId,
        playerName: player2,
        winner: false
    });
    return API_Responses_1.default._200({ "gameId": gameId });
};
exports.handler = handler;
