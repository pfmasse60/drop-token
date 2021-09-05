'use strict'

// import { v4 as uuidv4 } from 'uuid';
import { moveCounter } from './moveCounter';
// import isGame from './isGame';
// import Responses from './API_Responses';
import Dynamo from './API_Dynamodb';
import gameboard from '../libs/gameBoard';
// import { isGamePlayer } from './isPlayer';
// import setGameState from './setGameState';

export interface MoveParams {
	gameId: string,
	playerId: string,
	moveType?: string,
	column?: number
}

const TABLE_NAME = process.env.gameTableName;

export const makeMove = async (params: MoveParams) => {
	
	let { gameId, playerId, column = 0, move_type = 'move' } = params;
	let result:  "winner" | "success" | "illegal" | null = null;
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
	TableName: TABLE_NAME as string,
	IndexName: 'PlayerIndex'
	}
	const playerName = await Dynamo.query(playerParams);
	const move_number = await moveCounter(gameId);
	
	
	if (playerName && playerName.Items) {
		const PlayerName = playerName.Items[0].playerName
		result = await gameboard.add(column, PlayerName as string, gameId);
	
	return {result, move_number, PlayerName};
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
}
