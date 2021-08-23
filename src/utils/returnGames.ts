import AWS from "aws-sdk";
const TABLE_NAME = process.env.gameTableName;

  export const returnGames = async() => {
    
    let options = {};
    if (process.env.IS_OFFLINE) {
      options = {
        region: 'localhost',
        endpoint: 'http://localhost:8000',
      }
    }
    
    const dynamodb = new AWS.DynamoDB.DocumentClient(options);

    const params = {
      ExpressionAttributeValues: {
        ":itemtype": "game",
        ":theState": "IN_PROGRESS"
      },
      ExpressionAttributeNames: {
        "#state": "state"
      },
      KeyConditionExpression: 'itemType = :itemtype',
      FilterExpression: '#state = :theState',
      ProjectionExpression: "Id",
      TableName: TABLE_NAME as string,
    }
    const number = await dynamodb.query(params).promise();

    if(number && number.Items) {
      var newArray = number.Items.map(function(item) {
        return [item.Id].join(" ");
      });
      return (JSON.stringify({"games":newArray},null,2));
      }else{
        return(JSON.stringify({"games": []}))
      }
}  