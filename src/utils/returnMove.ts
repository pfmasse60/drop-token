import AWS from "aws-sdk";

export interface MoveRequestParams {
	gameId: string,
	move_number?: string
  }

const TABLE_NAME = process.env.gameTableName;

   export const returnMove = async(params: MoveRequestParams) => {
       const {gameId, move_number} = params;

    const dynamodb = new AWS.DynamoDB.DocumentClient();

    let keyCondition = '#gameId = :gameId and #move_number = :move_number';
    let expressionAttValues = {
      ':gameId': gameId,
      ':move_number': move_number
    };
    let expressionAttNames = {
      '#gameId': 'gameId',
      '#move_number': 'move_number',
      '#column': 'column'
    };

    const moveParams = {
      ExpressionAttributeValues: expressionAttValues,
      ExpressionAttributeNames: expressionAttNames,
      KeyConditionExpression: keyCondition,
      ProjectionExpression: 'itemType, playerId, #column',
      TableName: TABLE_NAME as string,
      IndexName: 'MoveNumberIndex'
    }
    
    const result = await dynamodb.query(moveParams).promise();

    if(!result.Items || result.Items.length < 1) {
      return({'statusCode': 404});
    }
    const data = result.Items[0];

    const playerParams = {
      ExpressionAttributeValues: {
        ':playerId': data.playerId,
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
    let playerName;

    try {
      playerName = await dynamodb.query(playerParams).promise();
    }catch(e) {
      return(e.message);
    }

    if(playerName.Items && playerName.Items.length > 0) {
      playerName = playerName.Items[0];
    }

    return({'statusCode': 200, 'data': {'type': data.itemType, 'player': playerName.playerName, 'column': data.column}});    
}