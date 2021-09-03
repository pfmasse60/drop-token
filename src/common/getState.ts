import { QueryInput } from 'aws-sdk/clients/dynamodb';
import Dynamo from '../common/API_Dynamodb';
const TABLE_NAME = process.env.gameTableName;

export default async(Id: string) => {

  // let options = {};
  // if (process.env.IS_OFFLINE) {
  // options = {
  //     region: 'localhost',
  //     endpoint: 'http://localhost:8000',
  // }
  // }

    // const dynamodb = new AWS.DynamoDB.DocumentClient(options);

    const params = {
      ExpressionAttributeValues: {
        ":itemtype": {
          S: "game",
        },
        ":Id": {
          S: Id
        }
      },
      ExpressionAttributeNames: {
        "#state": "state"
      },
      KeyConditionExpression: 'itemType = :itemtype and Id = :Id',
      ProjectionExpression: "#state, player1, player2, winner",
      TableName: TABLE_NAME as string,
    }

    // const game: {[key: string]: any} = await dynamodb.query(params).promise();
    const data = await Dynamo.query2(params);
    console.log('GAME' + JSON.stringify(data, null, 1));

    // if (data && data.Items!.length > 0) {{
    //     const Items = data.Items[0];
    //       const gameState = {
    //         "players": [
    //           Items.player1,
    //           Items.player2
    //         ],
    //           "state": Items.state,
    //       }
    //   return gameState;
    // }
    return(null);
}