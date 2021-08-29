import { APIGatewayProxyEvent} from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import Responses from '../common/API_Responses';
import Dynamo from '../common/API_Dynamodb';
import isGame from '../common/isGame';
import { moveCounter } from '../common/moveCounter';

export interface MoveParams {
	gameId: string,
	playerId: string,
	moveType: string,
	column?: number,
	move_number?: string
}

const TABLE_NAME = process.env.gameTableName;

export const handler = async (event: APIGatewayProxyEvent) => {

  if (event && event.body){
    const {column} = JSON.parse(event.body);
    
    const {gameId, playerId} = event.pathParameters as unknown as MoveParams;

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
      const data = await Dynamo.query(playerParams);
      const move_number = await moveCounter(gameId);
      
      if(data?.Items && data?.Items?.length > 0) {
        if (column == undefined || column < 0) {
          return Responses._400({message: 'Malformed request'})
        }
    
      try {
        await Dynamo.put(TABLE_NAME!,
          {
            itemType: 'move',
            Id: uuidv4(),
            gameId,
            playerId,
            playerName: data.Items[0].playerName,
            moveType: 'move',
            move_number,
            column
          })
      } catch (e) {
        console.log(e.message)
      }
        return Responses._200({"move": gameId + "/moves/" + move_number});
      }
      return Responses._404({message: 'Game/moves not found'});
  }
};

