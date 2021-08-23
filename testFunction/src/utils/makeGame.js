'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGame = void 0;
const uuid_1 = require("uuid");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const TABLE_NAME = process.env.gameTableName;
const STATE = process.env.gameState;
const makeGame = async (body) => {
    const dynamodb = new aws_sdk_1.default.DynamoDB.DocumentClient();
    let { players, columns, rows } = JSON.parse(body);
    const Id = uuid_1.v4();
    const [player1, player2] = players;
    const newGameParams = {
        TableName: TABLE_NAME,
        Item: {
            itemType: 'game',
            Id,
            player1,
            player2,
            columns,
            rows,
            state: STATE,
            winner: null,
            col1: [],
            col2: [],
            col3: [],
            col4: []
        }
    };
    try {
        await dynamodb.put(newGameParams).promise();
    }
    catch (e) {
        return (e.message);
    }
    let playerParams = {
        TableName: TABLE_NAME,
        Item: {
            itemType: 'player',
            Id: uuid_1.v4(),
            gameId: Id,
            playerName: player1
        }
    };
    try {
        await dynamodb.put(playerParams).promise();
    }
    catch (e) {
        return (e.message);
    }
    playerParams = {
        TableName: TABLE_NAME,
        Item: {
            itemType: 'player',
            Id: uuid_1.v4(),
            gameId: Id,
            playerName: player2
        }
    };
    try {
        await dynamodb.put(playerParams).promise();
    }
    catch (e) {
        return (e.message);
    }
    return (Id);
};
exports.makeGame = makeGame;
