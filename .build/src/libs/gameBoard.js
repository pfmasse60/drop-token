"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameboard = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
let options = {};
if (process.env.IS_OFFLINE) {
    options = {
        region: 'localhost',
        endpoint: 'http://localhost:8000',
    };
}
const dynamodb = new aws_sdk_1.default.DynamoDB.DocumentClient(options);
const TABLE_NAME = process.env.gameTableName;
exports.gameboard = {
    async add(column, player, gameId) {
        let td = [
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
            TableName: TABLE_NAME,
        };
        const number = await dynamodb.query(params2).promise();
        if (number && number.Items) {
            number.Items[0].col0.forEach((val) => {
                td[0].push(val);
            }),
                number.Items[0].col1.forEach((val) => {
                    td[1].push(val);
                }),
                number.Items[0].col2.forEach((val) => {
                    td[2].push(val);
                }),
                number.Items[0].col3.forEach((val) => {
                    td[3].push(val);
                });
        }
        // let row = td[column].length;
        if (td[column].length < 4) {
            td[column].push(player);
            const params = {
                TableName: TABLE_NAME,
                Key: { itemType: 'game', Id: gameId },
                UpdateExpression: 'SET #c = list_append(#c, :c)',
                ExpressionAttributeValues: {
                    ':c': [`${player}`],
                },
                ExpressionAttributeNames: {
                    '#c': `col${column}`,
                },
            };
            await dynamodb.update(params).promise();
            console.table(td);
            return JSON.stringify({ 'statusCode': 200, 'body': td });
        }
        else {
            return (JSON.stringify({ 'statusCode': 400 }));
        }
    }
};
