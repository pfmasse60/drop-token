import AWS from 'aws-sdk';
import {isWinner} from '../utils/isWinner';

let options = {};
if (process.env.IS_OFFLINE) {
    options = {
        region: 'localhost',
        endpoint: 'http://localhost:8000'
    }
}
const dynamodb = new AWS.DynamoDB.DocumentClient(options);
const TABLE_NAME = process.env.gameTableName;


export const gameboard = {
    async add(column : number, player : string, gameId : string) {
        let board: string[][] = [[], [], [], []];

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
        const number = await dynamodb.query(params2).promise();
        if (number && number.Items) {
            number.Items[0].col0.forEach((val : string) => {
                board[0].push(val);
            }),
            number.Items[0].col1.forEach((val : string) => {
                board[1].push(val);
            }),
            number.Items[0].col2.forEach((val : string) => {
                board[2].push(val);
            }),
            number.Items[0].col3.forEach((val : string) => {
                board[3].push(val);
            })
            var rows = number.Items[0].rows;
            var columns = number.Items[0].columns;
        }
        if (board[column].length < rows) {
            board[column].push(player);
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
            // if (board[column].length === rows) {
                if (isWinner(player, board, column, rows, columns) === true) {
                    return JSON.stringify({'statusCode': 200, 'message': `${player} Wins!`, 'body': board});
                }
            // }
            return JSON.stringify({'statusCode': 200, 'message': 'Success', 'body': board}); 
        } else {
            return(JSON.stringify({'statusCode': 400, 'message': 'Illegal Move', 'body': board}));
        }
    }
}
