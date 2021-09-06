"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeMove = void 0;
const uuid_1 = require("uuid");
const moveCounter_1 = require("./moveCounter");
const API_Dynamodb_1 = __importDefault(require("./API_Dynamodb"));
const gameBoard_1 = __importDefault(require("./gameBoard"));
const setGameState_1 = __importDefault(require("./setGameState"));
const setGameWinner_1 = __importDefault(require("./setGameWinner"));
const TABLE_NAME = process.env.gameTableName;
const makeMove = async (params) => {
    let { gameId, playerId, column = 0, move_type = 'move' } = params;
    let result = null;
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
        ProjectionExpression: 'playerName',
        TableName: TABLE_NAME,
        IndexName: 'PlayerIndex'
    };
    const playerName = await API_Dynamodb_1.default.query(playerParams);
    const move_number = await moveCounter_1.moveCounter(gameId);
    if (playerName && playerName.Items) {
        const PlayerName = playerName.Items[0].playerName;
        if (move_type === 'quit') {
            result = 'success';
            await setGameState_1.default(gameId, 'DONE');
        }
        else {
            result = await gameBoard_1.default.add(column, PlayerName, gameId);
            console.log(`RESULT FROM GAMEBOARD ${result}`);
        }
        switch (result) {
            case 'success':
                try {
                    await API_Dynamodb_1.default.put(TABLE_NAME, {
                        itemType: 'move',
                        Id: uuid_1.v4(),
                        gameId,
                        playerId,
                        playerName: playerName.Items[0].playerName,
                        moveType: move_type,
                        move_number,
                        column
                    });
                }
                catch (e) {
                    console.log(e.message);
                }
                return move_number;
            case 'winner':
                try {
                    await API_Dynamodb_1.default.put(TABLE_NAME, {
                        itemType: 'move',
                        Id: uuid_1.v4(),
                        gameId,
                        playerId,
                        playerName: playerName.Items[0].playerName,
                        moveType: move_type,
                        move_number,
                        column
                    });
                }
                catch (e) {
                    console.log(e.message);
                }
                await setGameState_1.default(gameId, 'DONE');
                await setGameWinner_1.default(gameId, playerName.Items[0].playerName);
                return move_number;
            case 'draw':
                try {
                    await API_Dynamodb_1.default.put(TABLE_NAME, {
                        itemType: 'move',
                        Id: uuid_1.v4(),
                        gameId,
                        playerId,
                        playerName: playerName.Items[0].playerName,
                        moveType: move_type,
                        move_number,
                        column
                    });
                }
                catch (e) {
                    console.log(e.message);
                }
                await setGameState_1.default(gameId, 'DONE');
                await setGameWinner_1.default(gameId, null);
                return move_number;
            default:
                return 'Illegal Move';
        }
    }
};
exports.makeMove = makeMove;
