import AWS from "aws-sdk";
import { v4 as uuidv4 } from 'uuid';

const TABLE_NAME = process.env.gameTableName;
export const moveCounter = async(gameId: string) => {
    const dynamodb = new AWS.DynamoDB.DocumentClient();

    const params = {
        ExpressionAttributeValues: {
          ':itemtype': 'counter',
          ':gameId': gameId
        },
        ExpressionAttributeNames: {
          '#gameId': 'gameId',
          '#Id': 'Id'
        },
        KeyConditionExpression: 'itemType = :itemtype and #gameId = :gameId',
        ProjectionExpression: 'move_count, #Id',
        TableName: TABLE_NAME as string,
        IndexName: 'CounterIndex'
      }
  
      const result = await dynamodb.query(params).promise();

      if(result.Items && result.Items.length > 0) {
        const myObj = result.Items[0];

        let new_count = myObj.move_count;
        new_count = new_count + 1;

        const counterParams = {
            TableName: TABLE_NAME as string,
            Key: {itemType: 'counter', Id: myObj.Id},
            UpdateExpression: 'set #move_count = :new_count',
            ExpressionAttributeNames:{
                '#move_count': 'move_count'
            },
            ExpressionAttributeValues:{
              ':new_count': new_count
            },
        };

        try {
          await dynamodb.update(counterParams).promise() 
        }
        catch (e) {
          return(e.message)
        }
        return(new_count.toString());

      } else {
      const move_count = '0';
      const counterParams = {
        TableName: TABLE_NAME as string,
        Item: {
          itemType: 'counter',
          Id: uuidv4(),
          gameId,
          move_count
        }
		  }

      try {
        await dynamodb.put(counterParams).promise()
          } catch (e) {
          return(e.message)
          }
      return(move_count);
        }
      }