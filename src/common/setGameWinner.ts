import Dynamo from './API_Dynamodb';
const TABLE_NAME = process.env.gameTableName;


export default async (gameId : string, winner : string | null) => {
    const gameStateUpdateParams = {
        TableName: TABLE_NAME as string,
        Key: {
            itemType: 'game',
            Id: gameId
        },
        UpdateExpression: 'set #winner = :winner',
        ExpressionAttributeNames: {
            '#winner': 'winner'
        },
        ExpressionAttributeValues: {
            ':winner': winner
        }
    };

    await Dynamo.update(gameStateUpdateParams);
}
