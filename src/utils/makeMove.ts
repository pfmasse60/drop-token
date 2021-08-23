'use strict'

import { v4 as uuidv4 } from 'uuid';
import AWS from 'aws-sdk';
import { moveCounter } from './moveCounter';
import isGame from '../queries/isGame';
import Responses from '../functions/API_Responses';

export interface MoveParams {
	gameId: string,
	playerId: string,
	moveType: string,
	column?: number,
	move_number?: string
}

const TABLE_NAME = process.env.gameTableName;

export const makeMove = async (params: MoveParams) => {

	let options = {};
    if (process.env.IS_OFFLINE) {
		options = {
        region: 'localhost',
        endpoint: 'http://localhost:8000',
		}
    }

	const dynamodb = new AWS.DynamoDB.DocumentClient(options);
	let { gameId, playerId, moveType, column = '' } = params;

	if(!await isGame(gameId)) {
		return Responses._404({'message': 'Game not found or player is not a part of it.'});
	};

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
	const result = await dynamodb.query(playerParams).promise();
	const move_number = await moveCounter(gameId);
	
	if(result.Items && result.Items.length > 0) {
		let myObj = result.Items[0];

		const newMoveParams = {
			TableName: TABLE_NAME as string,
			Item: {
				itemType: 'move',
				Id: uuidv4(),
				gameId,
				playerId,
				playerName: myObj.playerName,
				moveType,
				move_number,
				column
			}
		}
	
	try {
		await dynamodb.put(newMoveParams).promise()
	} catch (e) {
		return(e.message)
	}
		return(gameId + "/moves/" + move_number);
	}
	return({'statusCode': 404});
}
