"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPlayerTurn = exports.makeMove = void 0;
const uuid_1 = require("uuid");
const moveCounter_1 = require("./moveCounter");
const API_Dynamodb_1 = __importDefault(require("./API_Dynamodb"));
const gameBoard_1 = __importDefault(require("./gameBoard"));
const setGameState_1 = __importDefault(require("./setGameState"));
const setGameWinner_1 = __importDefault(require("./setGameWinner"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
let options = {};
if (process.env.IS_OFFLINE) {
    options = {
        region: 'localhost',
        endpoint: 'http://localhost:8000'
    };
}
const dynamodb = new aws_sdk_1.default.DynamoDB.DocumentClient(options);
const TABLE_NAME = process.env.gameTableName;
const makeMove = async (params) => {
    let { gameId, playerId, column = 0, move_type = 'move' } = params;
    let result = null;
    const playerParams = {
        ExpressionAttributeValues: {
            ':gameId': gameId,
            ':itemType': 'player'
        },
        ExpressionAttributeNames: {
            '#gameId': 'gameId',
            '#itemType': 'itemType'
        },
        KeyConditionExpression: '#gameId = :gameId and #itemType = :itemType',
        ProjectionExpression: 'playerName, Id',
        TableName: TABLE_NAME,
        IndexName: 'MoveNumberIndex'
    };
    const playerNames = await API_Dynamodb_1.default.query(playerParams);
    const move_number = await moveCounter_1.moveCounter(gameId);
    let value;
    let PlayerName = '';
    if (playerNames && playerNames.Items) {
        for (value of playerNames?.Items) {
            if (value.Id === playerId) {
                PlayerName = value.playerName;
                await exports.setPlayerTurn(playerId, false);
            }
            else {
                await exports.setPlayerTurn(value.Id, true);
            }
        }
        if (move_type === 'quit') {
            result = 'success';
            await setGameState_1.default(gameId, 'DONE');
        }
        else {
            result = await gameBoard_1.default.add(column, PlayerName, gameId);
        }
        switch (result) {
            case 'success':
                try {
                    await API_Dynamodb_1.default.put(TABLE_NAME, {
                        itemType: 'move',
                        Id: uuid_1.v4(),
                        gameId,
                        playerId,
                        playerName: PlayerName,
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
                        playerName: PlayerName,
                        moveType: move_type,
                        move_number,
                        column
                    });
                }
                catch (e) {
                    console.log(e.message);
                }
                await setGameState_1.default(gameId, 'DONE');
                await setGameWinner_1.default(gameId, PlayerName);
                return move_number;
            case 'draw':
                try {
                    await API_Dynamodb_1.default.put(TABLE_NAME, {
                        itemType: 'move',
                        Id: uuid_1.v4(),
                        gameId,
                        playerId,
                        playerName: PlayerName,
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
    return 'Illegal Move';
};
exports.makeMove = makeMove;
const setPlayerTurn = async (playerId, turn) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            itemType: 'player',
            Id: playerId
        },
        UpdateExpression: 'set #turn = :turn',
        ExpressionAttributeValues: {
            ':turn': turn
        },
        ExpressionAttributeNames: {
            '#turn': 'turn'
        }
    };
    await dynamodb.update(params).promise();
};
exports.setPlayerTurn = setPlayerTurn;
