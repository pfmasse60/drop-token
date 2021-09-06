import Dynamo from '../common/API_Dynamodb';
const TABLE_NAME = process.env.gameTableName;

export default async(Id: string) => {

    const params = {
      ExpressionAttributeValues: {
        ":itemtype": "game",
        ":Id": Id
      },
      ExpressionAttributeNames: {
        "#state": "state"
      },
      KeyConditionExpression: 'itemType = :itemtype and Id = :Id',
      ProjectionExpression: "#state, player1, player2, winner",
      TableName: TABLE_NAME as string,
    }

    const data = await Dynamo.query2(params);

    if (data && data.length > 0) {
          const gameState = {
            "players": [
              data[0].player1,
              data[0].player2
            ],
              "state": data[0].state,
              'winner': (data[0].winner != '' ? data[0].winner : undefined)
          }
      return gameState;
    }
    return(null);
}