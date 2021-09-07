import Dynamo from './API_Dynamodb';

const TABLE_NAME = process.env.gameTableName;

export const isGamePlayer = async (gameId : string, playerId : string) => {

    const data = await Dynamo.query({
        ExpressionAttributeValues: {
            ':playerId': playerId,
            ':gameId': gameId
        },
        ExpressionAttributeNames: {
            '#playerId': 'Id',
            '#gameId': 'gameId'
        },
        KeyConditionExpression: '#playerId = :playerId and #gameId = :gameId',
        ProjectionExpression: 'playerName, Id, turn',
        TableName: TABLE_NAME as string,
        IndexName: 'PlayerIndex'
    });
    let value;
    if (data ?. Items && data.Items ?. length > 0) {
        value = data ?. Items[0];
        if (value.Id === playerId) {
            return({'player': true, 'data': value});
        }
        return({'player': false, 'data': value});
    }
}
