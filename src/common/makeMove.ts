'use strict'

import { v4 as uuidv4 } from 'uuid';
// import AWS from 'aws-sdk';
import { moveCounter } from './moveCounter';
import isGame from './isGame';
import Responses from './API_Responses';
import Dynamo from './API_Dynamodb';

export interface MoveParams {
	gameId: string,
	playerId: string,
	moveType?: string,
	column?: number
}

const TABLE_NAME = process.env.gameTableName;

export const makeMove = async (params: MoveParams) => {

	// let options = {};
    // if (process.env.IS_OFFLINE) {
	// 	options = {
    //     region: 'localhost',
    //     endpoint: 'http://localhost:8000',
	// 	}
    // }

	// const dynamodb = new AWS.DynamoDB.DocumentClient(options);
	let { gameId, playerId, moveType = 'move', column = 0 } = params;

	if(!await isGame(gameId)) {
		return Responses._404({'message': 'Game not found or player is not a part of it.'});
	};

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
	TableName: TABLE_NAME as string,
	IndexName: 'PlayerIndex'
	}
	const playerName = await Dynamo.query(playerParams);
	const move_number = await moveCounter(gameId);
	
	if(playerName!.Items && playerName!.Items.length > 0) {
		try {
			await Dynamo.put(
			TABLE_NAME as string,
			{
				itemType: 'move',
				Id: uuidv4(),
				gameId,
				playerId,
				playerName: playerName!.Items[0].playerName,
				moveType,
				move_number,
				column
			});
			// await Dynamo.put(TABLE_NAME as string, newMoveParams)
		} catch (e) {
			console.log(e.message);
		}
		return(gameId + "/moves/" + move_number);
	}
}
