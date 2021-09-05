import Dynamo from './API_Dynamodb';
const TABLE_NAME = process.env.gameTableName;


export default async(gameId: string, state: string) => {
    const gameStateUpdateParams = {
        TableName: TABLE_NAME as string,
        Key: {itemType: 'game', Id: gameId},
        UpdateExpression: 'set #state = :state',
        ExpressionAttributeNames:{
            '#state': 'state'
        },
        ExpressionAttributeValues:{':state': state}
    };

    await Dynamo.update(gameStateUpdateParams);
}