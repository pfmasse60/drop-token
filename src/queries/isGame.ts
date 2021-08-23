import AWS from "aws-sdk";
const TABLE_NAME = process.env.gameTableName;

export default async(gameId: string) => {

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
        ':itemtype': 'game',
        ':Id': gameId
    },
        ExpressionAttributeNames: {
        "#state": "state"
    },
        KeyConditionExpression: 'itemType = :itemtype and Id = :Id',
        ProjectionExpression: '#state',
        TableName: TABLE_NAME as string,
    }

    const game: {[key: string]: any} = await dynamodb.query(params).promise();

    if (game?.Items[0] == undefined) {
        return false;
    }
    return true;
}