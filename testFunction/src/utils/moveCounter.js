"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveCounter = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const uuid_1 = require("uuid");
const TABLE_NAME = process.env.gameTableName;
const moveCounter = async (gameId) => {
    const dynamodb = new aws_sdk_1.default.DynamoDB.DocumentClient();
    const params = {
        ExpressionAttributeValues: {
            ':itemtype': 'counter',
            ':gameId': gameId
        },
        ExpressionAttributeNames: {
            '#gameId': 'gameId',
            '#Id': 'Id'
        },
        KeyConditionExpression: 'itemType = :itemtype and #gameId = :gameId',
        ProjectionExpression: 'move_count, #Id',
        TableName: TABLE_NAME,
        IndexName: 'CounterIndex'
    };
    const result = await dynamodb.query(params).promise();
    if (result.Items && result.Items.length > 0) {
        const myObj = result.Items[0];
        let new_count = myObj.move_count;
        new_count = new_count + 1;
        const counterParams = {
            TableName: TABLE_NAME,
            Key: { itemType: 'counter', Id: myObj.Id },
            UpdateExpression: 'set #move_count = :new_count',
            ExpressionAttributeNames: {
                '#move_count': 'move_count'
            },
            ExpressionAttributeValues: {
                ':new_count': new_count
            },
        };
        try {
            await dynamodb.update(counterParams).promise();
        }
        catch (e) {
            return (e.message);
        }
        return (new_count);
    }
    else {
        const move_count = 1;
        const counterParams = {
            TableName: TABLE_NAME,
            Item: {
                itemType: 'counter',
                Id: uuid_1.v4(),
                gameId,
                move_count
            }
        };
        try {
            await dynamodb.put(counterParams).promise();
        }
        catch (e) {
            return (e.message);
        }
        return (move_count);
    }
};
exports.moveCounter = moveCounter;
