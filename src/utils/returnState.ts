import AWS from "aws-sdk";
const TABLE_NAME = process.env.gameTableName;

export const returnState = async(Id: string) => {
    const dynamodb = new AWS.DynamoDB.DocumentClient();

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

    const game: {[key: string]: any} = await dynamodb.query(params).promise();

    if (game.Count > 0) {
        const Items = game.Items[0];
          const gameState = {
            "players": [
              Items.player1,
              Items.player2
            ],
              "state": Items.state,
              "winner": Items.winner
          }
      return gameState;
    }
    return(game.Items[0]);
}