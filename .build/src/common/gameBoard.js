"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const isWinner_1 = require("./isWinner");
let options = {};
if (process.env.IS_OFFLINE) {
    options = {
        region: 'localhost',
        endpoint: 'http://localhost:8000'
    };
}
const dynamodb = new aws_sdk_1.default.DynamoDB.DocumentClient(options);
const TABLE_NAME = process.env.gameTableName;
exports.default = {
    async add(column, player, gameId) {
        let localGameBoard = [[], [], [], []];
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
            ProjectionExpression: 'col0, col1, col2, col3, #rows, #columns, maxMoves',
            TableName: TABLE_NAME
        };
        let totalCount = 1;
        const remoteGameBoard = await dynamodb.query(params2).promise();
        if (remoteGameBoard && remoteGameBoard.Items) {
            remoteGameBoard.Items[0].col0.forEach((val) => {
                localGameBoard[0].push(val);
                totalCount++;
            }),
                remoteGameBoard.Items[0].col1.forEach((val) => {
                    localGameBoard[1].push(val);
                    totalCount++;
                }),
                remoteGameBoard.Items[0].col2.forEach((val) => {
                    localGameBoard[2].push(val);
                    totalCount++;
                }),
                remoteGameBoard.Items[0].col3.forEach((val) => {
                    localGameBoard[3].push(val);
                    totalCount++;
                });
            var rows = remoteGameBoard.Items[0].rows;
            var columns = remoteGameBoard.Items[0].columns;
            var maxMoves = remoteGameBoard.Items[0].maxMoves;
        }
        console.log(`COLUMN LENGTH AND ROWS ${localGameBoard[column].length}  ${rows}`);
        if (localGameBoard[column].length < rows) {
            localGameBoard[column].push(player);
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
            if (isWinner_1.isWinner(player, localGameBoard, rows, columns) === true) {
                return 'winner';
            }
            if (totalCount === maxMoves)
                return 'draw';
            return 'success';
        }
        else {
            return 'illegal';
        }
    }
};
