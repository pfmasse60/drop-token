'use strict'

import { v4 as uuidv4 } from 'uuid';
import AWS from 'aws-sdk';

export interface Game {
    players : string[],
    columns : number,
    rows : number
}

const TABLE_NAME = process.env.gameTableName;
const STATE = process.env.gameState;

export const makeGame = async (body: any) => {
	const dynamodb = new AWS.DynamoDB.DocumentClient();
 	let {players, columns, rows}: Game = JSON.parse(body);

	const Id = uuidv4();
	const [player1, player2] = players;

	const newGameParams = {
		TableName: TABLE_NAME as string,
		Item: {
			itemType: 'game',
			Id,
			player1,
			player2,
			columns,
			rows,
			state: STATE,
			winner: null
		}
	}
	
	try {
		await dynamodb.put(newGameParams).promise()
	  	} catch (e) {
			return(e.message)
	  	}
		  

		let playerParams = {
			TableName: TABLE_NAME as string,
			Item: {
				itemType: 'player',
				Id: uuidv4(),
				gameId: Id,
				playerName: player1
			}
	}
	try {
		await dynamodb.put(playerParams).promise()
		} catch (e) {
			return(e.message)
		}  

		playerParams = {
			TableName: TABLE_NAME as string,
			Item: {
				itemType: 'player',
				Id: uuidv4(),
				gameId: Id,
				playerName: player2
			}
		}

		try {
			await dynamodb.put(playerParams).promise()
			} catch (e) {
				return(e.message)
			}

	return(Id);
}
