import Dynamo from '../common/API_Dynamodb';

const TABLE_NAME = process.env.gameTableName;

export const isGamePlayer = async (gameId: string, playerId: string) => {

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
        ProjectionExpression: 'player',
        TableName: TABLE_NAME as string,
        IndexName: 'PlayerIndex'
        });
        
    if (data!.Count && data!.Count > 0) {
        return (true);
    } else {
        return (false);
    }
}
