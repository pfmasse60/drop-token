import AWS from 'aws-sdk';
    
    let options = {};
    if (process.env.IS_OFFLINE) {
        options = {
        region: 'localhost',
        endpoint: 'http://localhost:8000',
        }
    }
const dynamodb = new AWS.DynamoDB.DocumentClient(options);
const TABLE_NAME = process.env.gameTableName;


export const gameboard = {
    async add(column: number, player: string, gameId: string) {
        let td: string[][] = [
            [],
            [],
            [],
            []
        ];

        const params2 = {
            ExpressionAttributeValues: {
                ":itemtype": "game",
                ":Id": gameId
            },
            ExpressionAttributeNames: {
                "#Id": "Id",
                "#i": "itemType"
            },
            KeyConditionExpression: '#i = :itemtype and #Id = :Id',
            ProjectionExpression: 'col0, col1, col2, col3',
            TableName: TABLE_NAME as string,
            }
            const number = await dynamodb.query(params2).promise();
            if (number && number.Items) {
                number.Items[0].col0.forEach((val: string) => {
                    td[0].push(val);
                }),
                number.Items[0].col1.forEach((val: string) => {
                    td[1].push(val);
                }), 
                number.Items[0].col2.forEach((val: string) => {
                    td[2].push(val);
                }), 
                number.Items[0].col3.forEach((val: string) => {
                    td[3].push(val);
                })  
            }
            // let row = td[column].length;
        if (td[column].length < 4 ) {
            td[column].push(player);
            const params = {
                TableName: TABLE_NAME as string,
                Key: {itemType: 'game', Id: gameId},
                UpdateExpression: 'SET #c = list_append(#c, :c)',
                ExpressionAttributeValues:{
                    ':c': [`${player}`],
                },
                ExpressionAttributeNames:{
                    '#c': `col${column}`,
                },
            }
            await dynamodb.update(params).promise();
            console.table(td);
            return JSON.stringify({'statusCode': 200, 'body': td})
        } else {
            return(JSON.stringify({'statusCode': 400}));
        }
        
    }

}
