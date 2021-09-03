import { v4 as uuidv4 } from 'uuid';
import Dynamo from '../common/API_Dynamodb';

const TABLE_NAME = process.env.gameTableName;
export const moveCounter = async(gameId: string):Promise<number> => {
  
      const data = await Dynamo.query({
        ExpressionAttributeValues: {
          ':itemtype': {
            S: 'counter'
          },
          ':gameId': {
            S: gameId
          }
        },
        ExpressionAttributeNames: {
          '#gameId': 'gameId',
          '#Id': 'Id'
        },
        KeyConditionExpression: 'itemType = :itemtype and #gameId = :gameId',
        ProjectionExpression: 'move_count, #Id',
        TableName: TABLE_NAME as string,
        IndexName: 'CounterIndex'
      });

      if(data!.Items && data!.Items.length > 0) {
        const myObj = data!.Items[0];

        let new_count:number = myObj.move_count;
        new_count = new_count + 1;

        try {
          await Dynamo.update({
            TableName: TABLE_NAME as string,
            Key: {itemType: {S: 'counter'}, Id: myObj.Id},
            UpdateExpression: 'set #move_count = :new_count',
            ExpressionAttributeNames:{
                '#move_count': 'move_count'
            },
            ExpressionAttributeValues:{
              ':new_count': {
                S: new_count +''
              }
            },
        });
        }
        catch (e) {
          return(e.message)
        }
        return(new_count);

      } else {
      const move_count = 0;

      try {
        await Dynamo.put(TABLE_NAME!,
          {
            itemType: 'counter',
            Id: uuidv4(),
            gameId,
            move_count
          });
      } catch (e) {
        return(e.message)
      }
      return(move_count);
        }
      }