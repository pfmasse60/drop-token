import Dynamo from '../common/API_Dynamodb';

const TABLE_NAME = process.env.gameTableName;

export const isGamePlayer = async (gameId: string, playerId: string) => {

    const data = await Dynamo.query({
        ExpressionAttributeValues: {
            ':playerId': {
                S: playerId
            },
            ':gameId': {
                S: gameId
            }
        },
        ExpressionAttributeNames: {
            '#playerId': 'Id',
            '#gameId': 'gameId'
        },
        KeyConditionExpression: '#playerId = :playerId and #gameId = :gameId',
        ProjectionExpression: 'playerName',
        TableName: TABLE_NAME as string,
        IndexName: 'PlayerIndex'
        });
        
    if (data!.Count && data!.Count > 0) {
        return ({'player': true, 'data': data!.Items});
    } else {
        return ({'player': false, 'data': null});
    }
}
