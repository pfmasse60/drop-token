// import { APIGatewayProxyHandler } from 'aws-lambda';
import Dynamo from '../common/API_Dynamodb';

const TABLE_NAME = process.env.gameTableName;

export const handler = async () => {

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
  const games = await Dynamo.query(params);
  if(games && games.Items) {
    var newArray = games.Items.map(function(item) {
      return [item.Id].join(" ");
    });
    return (JSON.stringify({"games":newArray},null,2));
  }else{
    return(JSON.stringify({"games": []}))
  }  
}
