"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const isWinner_1 = require("../common/isWinner");
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
            ProjectionExpression: 'col0, col1, col2, col3, #rows, #columns',
            TableName: TABLE_NAME
        };
        const remoteGameBoard = await dynamodb.query(params2).promise();
        if (remoteGameBoard && remoteGameBoard.Items) {
            remoteGameBoard.Items[0].col0.forEach((val) => {
                localGameBoard[0].push(val);
            }),
                remoteGameBoard.Items[0].col1.forEach((val) => {
                    localGameBoard[1].push(val);
                }),
                remoteGameBoard.Items[0].col2.forEach((val) => {
                    localGameBoard[2].push(val);
                }),
                remoteGameBoard.Items[0].col3.forEach((val) => {
                    localGameBoard[3].push(val);
                });
            var rows = remoteGameBoard.Items[0].rows;
            var columns = remoteGameBoard.Items[0].columns;
        }
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
            if (isWinner_1.isWinner(player, localGameBoard, column, rows, columns) === true) {
                return 'winner';
                // return JSON.stringify({'statusCode': 200, 'message': `${player} Wins!`, 'body': localGameBoard});
            }
            // return JSON.stringify({'statusCode': 200, 'message': 'Success', 'body': localGameBoard});
            return 'success';
        }
        else {
            // return(JSON.stringify({'statusCode': 400, 'message': 'Illegal Move', 'body': localGameBoard}));
            return 'illegal';
        }
    }
};
