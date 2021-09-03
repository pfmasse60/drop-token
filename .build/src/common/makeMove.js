'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeMove = void 0;
const uuid_1 = require("uuid");
// import AWS from 'aws-sdk';
const moveCounter_1 = require("./moveCounter");
const isGame_1 = __importDefault(require("./isGame"));
const API_Responses_1 = __importDefault(require("./API_Responses"));
const API_Dynamodb_1 = __importDefault(require("./API_Dynamodb"));
const TABLE_NAME = process.env.gameTableName;
const makeMove = async (params) => {
    // let options = {};
    // if (process.env.IS_OFFLINE) {
    // 	options = {
    //     region: 'localhost',
    //     endpoint: 'http://localhost:8000',
    // 	}
    // }
    // const dynamodb = new AWS.DynamoDB.DocumentClient(options);
    let { gameId, playerId, moveType = 'move', column = 0 } = params;
    if (!await isGame_1.default(gameId)) {
        return API_Responses_1.default._404({ 'message': 'Game not found or player is not a part of it.' });
    }
    ;
    const playerParams = {
        ExpressionAttributeValues: {
            ':playerId': {
                S: playerId
            },
            ':gameId': {
                S: gameId
            }
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
    if (playerName.Items && playerName.Items.length > 0) {
        try {
            await API_Dynamodb_1.default.put(TABLE_NAME, {
                itemType: 'move',
                Id: uuid_1.v4(),
                gameId,
                playerId,
                playerName: playerName.Items[0].playerName,
                moveType,
                move_number,
                column
            });
            // await Dynamo.put(TABLE_NAME as string, newMoveParams)
        }
        catch (e) {
            console.log(e.message);
        }
        return (gameId + "/moves/" + move_number);
    }
};
exports.makeMove = makeMove;
