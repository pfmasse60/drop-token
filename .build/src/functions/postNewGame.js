"use strict";
// AWS Lambda API endpoint to create new game
// Creates new 4 x 4 gameboard and two players
// Pete Masse - 7/30/2021
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.baseHandler = void 0;
const API_Responses_1 = __importDefault(require("../common/API_Responses"));
const API_Dynamodb_1 = __importDefault(require("../common/API_Dynamodb"));
const uuid_1 = require("uuid");
// import core
const core_1 = __importDefault(require("@middy/core")); // esm Node v14+
//const middy = require('@middy/core') // commonjs Node v12+
// import some middlewares
const http_json_body_parser_1 = __importDefault(require("@middy/http-json-body-parser"));
const http_error_handler_1 = __importDefault(require("@middy/http-error-handler"));
const validator_1 = __importDefault(require("@middy/validator"));
// Serverless invironment variables set inside serverless.yml
const STATE = process.env.gameState;
const TABLE_NAME = process.env.gameTableName;
const baseHandler = async (event) => {
    const gameId = uuid_1.v4();
    const { players, columns, rows } = event.body;
    console.log(event);
    // if (!players
    //     || !columns
    //     || !rows
    //     || players.length != 2
    //     || typeof rows !== 'number'
    //     || typeof columns !== 'number') 
    //     return Responses._400({'message': 'Malformed Requst'});
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
        turn: true
    });
    await API_Dynamodb_1.default.put(TABLE_NAME, {
        itemType: 'player',
        Id: uuid_1.v4(),
        gameId: gameId,
        playerName: player2,
        turn: false
    });
    return API_Responses_1.default._200({ "gameId": gameId });
};
exports.baseHandler = baseHandler;
const inputSchema = {
    type: 'object',
    properties: {
        body: {
            type: 'object',
            properties: {
                players: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    minItems: 2,
                    uniqueItems: true
                },
                columns: {
                    type: 'number'
                },
                rows: {
                    type: 'number'
                }
            },
            required: ['players', 'columns', 'rows']
        }
    }
};
exports.handler = core_1.default(exports.baseHandler)
    .use(http_json_body_parser_1.default()) // parses the request body when it's a JSON and converts it to an object
    .use(validator_1.default({ inputSchema })) // validates the input
    .use(http_error_handler_1.default()); // handles common http errors and returns proper responses
