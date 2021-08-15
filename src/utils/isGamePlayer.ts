'use strict'
import AWS from 'aws-sdk';

const TABLE_NAME = process.env.gameTableName;

export const isGamePlayer = async (gameId: string, playerId: string) => {
const dynamodb = new AWS.DynamoDB.DocumentClient();

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
            ProjectionExpression: 'player',
            TableName: TABLE_NAME as string,
            IndexName: 'PlayerIndex'
            }
            const playerResult = await dynamodb.query(playerParams).promise();
        
        if(playerResult.Count && playerResult.Count > 0) {
            return (true);
        } else {
            return (false);
        }
    }
