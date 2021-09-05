import AWS from 'aws-sdk';
import {isWinner} from '../common/isWinner';

let options = {};
if (process.env.IS_OFFLINE) {
    options = {
        region: 'localhost',
        endpoint: 'http://localhost:8000'
    }
}

const dynamodb = new AWS.DynamoDB.DocumentClient(options);
const TABLE_NAME = process.env.gameTableName;

export default {
    async add(column : number, player : string, gameId : string) {
        let localGameBoard: string[][] = [[], [], [], []];

        const params2 = {
            ExpressionAttributeValues: {
                ":itemtype": "game",
                ":Id": gameId
            },
            ExpressionAttributeNames: {
                "#Id": "Id",
                "#i": "itemType",
                "#rows": "rows",
                "#columns": "columns"
            },
            KeyConditionExpression: '#i = :itemtype and #Id = :Id',
            ProjectionExpression: 'col0, col1, col2, col3, #rows, #columns',
            TableName: TABLE_NAME as string
        }
        const remoteGameBoard = await dynamodb.query(params2).promise();
        if (remoteGameBoard && remoteGameBoard.Items) {
            remoteGameBoard.Items[0].col0.forEach((val : string) => {
                localGameBoard[0].push(val);
            }),
            remoteGameBoard.Items[0].col1.forEach((val : string) => {
                localGameBoard[1].push(val);
            }),
            remoteGameBoard.Items[0].col2.forEach((val : string) => {
                localGameBoard[2].push(val);
            }),
            remoteGameBoard.Items[0].col3.forEach((val : string) => {
                localGameBoard[3].push(val);
            })
            var rows = remoteGameBoard.Items[0].rows;
            var columns = remoteGameBoard.Items[0].columns;
        }
        if (localGameBoard[column].length < rows) {
            localGameBoard[column].push(player);
            const params = {
                TableName: TABLE_NAME as string,
                Key: {
                    itemType: 'game',
                    Id: gameId
                },
                UpdateExpression: 'SET #c = list_append(#c, :c)',
                ExpressionAttributeValues: {
                    ':c': [`${player}`]
                },
                ExpressionAttributeNames: {
                    '#c': `col${column}`
                }
            }
            await dynamodb.update(params).promise();
                if (isWinner(player, localGameBoard, column, rows, columns) === true) {
                    return 'winner';
                    // return JSON.stringify({'statusCode': 200, 'message': `${player} Wins!`, 'body': localGameBoard});
                }
            // return JSON.stringify({'statusCode': 200, 'message': 'Success', 'body': localGameBoard});
                return 'success';
        } else {
            // return(JSON.stringify({'statusCode': 400, 'message': 'Illegal Move', 'body': localGameBoard}));
            return 'illegal';
        }
    }
}
