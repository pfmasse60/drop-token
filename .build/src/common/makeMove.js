'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeMove = void 0;
// import { v4 as uuidv4 } from 'uuid';
const moveCounter_1 = require("./moveCounter");
// import isGame from './isGame';
// import Responses from './API_Responses';
const API_Dynamodb_1 = __importDefault(require("./API_Dynamodb"));
const gameBoard_1 = __importDefault(require("../libs/gameBoard"));
const TABLE_NAME = process.env.gameTableName;
const makeMove = async (params) => {
    let { gameId, playerId, column = 0, move_type = 'move' } = params;
    let result = null;
    // const gamePlayer = await isGamePlayer(gameId, playerId);
    // if(!await isGame(gameId) || gamePlayer.player === false) {
    // 	return Responses._404({'message': 'Game not found or player is not a part of it.'});
    // };
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
        result = await gameBoard_1.default.add(column, PlayerName, gameId);
        return { result, move_number, PlayerName };
        // switch(result) {
        // 	case 'success': 
        // 		try {
        // 			await Dynamo.put(
        // 			TABLE_NAME as string,
        // 			{
        // 				itemType: 'move',
        // 				Id: uuidv4(),
        // 				gameId,
        // 				playerId,
        // 				playerName: playerName!.Items[0].playerName,
        // 				moveType,
        // 				move_number,
        // 				column
        // 			});
        // 		} catch (e) {
        // 			console.log(e.message);
        // 		}
        // 		await setGameState(gameId, 'DONE');
        // 		return {'statusCode': 200, 'message': `${gameId}/moves/${move_number}`};
        // 	case 'winner': 
        // 		try {
        // 		await Dynamo.put(
        // 			TABLE_NAME as string,
        // 			{
        // 				itemType: 'move',
        // 				Id: uuidv4(),
        // 				gameId,
        // 				playerId,
        // 				playerName: playerName!.Items[0].playerName,
        // 				moveType,
        // 				move_number,
        // 				column
        // 			});
        // 		} catch (e) {
        // 			console.log(e.message);
        // 		}
        // 		return JSON.stringify({'statusCode': 200, 'message': `${gameId}/moves/${move_number}`});
        // 	default:
        // 		return {'statusCode': 400, 'message': 'Illegal Move'};
        // 	}
    }
};
exports.makeMove = makeMove;
