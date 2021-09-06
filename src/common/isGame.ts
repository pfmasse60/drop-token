import Dynamo from '../common/API_Dynamodb';

const TABLE_NAME = process.env.gameTableName;

export default async (gameId : string) => {

    const game = await Dynamo.query2({
        ExpressionAttributeValues: {
            ':itemtype': 'game',
            ':Id': gameId
        },
        ExpressionAttributeNames: {
            "#state": "state"
        },
        KeyConditionExpression: 'itemType = :itemtype and Id = :Id',
        ProjectionExpression: '#state',
        TableName: TABLE_NAME as string
    });

    if (game !.length === 0 || game ![0].state === 'DONE') {
        return false;
    }
    return true;
}
