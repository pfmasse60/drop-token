"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameboard = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const isWinner_1 = require("../utils/isWinner");
let options = {};
if (process.env.IS_OFFLINE) {
    options = {
        region: 'localhost',
        endpoint: 'http://localhost:8000'
    };
}
const dynamodb = new aws_sdk_1.default.DynamoDB.DocumentClient(options);
const TABLE_NAME = process.env.gameTableName;
exports.gameboard = {
    async add(column, player, gameId) {
        let board = [[], [], [], []];
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
            TableName: TABLE_NAME
        };
        const number = await dynamodb.query(params2).promise();
        if (number && number.Items) {
            number.Items[0].col0.forEach((val) => {
                board[0].push(val);
            }),
                number.Items[0].col1.forEach((val) => {
                    board[1].push(val);
                }),
                number.Items[0].col2.forEach((val) => {
                    board[2].push(val);
                }),
                number.Items[0].col3.forEach((val) => {
                    board[3].push(val);
                });
            var rows = number.Items[0].rows;
            var columns = number.Items[0].columns;
        }
        if (board[column].length < rows) {
            board[column].push(player);
            const params = {
                TableName: TABLE_NAME,
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
            };
            await dynamodb.update(params).promise();
            // if (board[column].length === rows) {
            if (isWinner_1.isWinner(player, board, column, rows, columns) === true) {
                return JSON.stringify({ 'statusCode': 200, 'message': `${player} Wins!`, 'body': board });
            }
            // }
            return JSON.stringify({ 'statusCode': 200, 'message': 'Success', 'body': board });
        }
        else {
            return (JSON.stringify({ 'statusCode': 400, 'message': 'Illegal Move', 'body': board }));
        }
    }
};
