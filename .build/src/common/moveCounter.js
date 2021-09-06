"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveCounter = void 0;
const uuid_1 = require("uuid");
const API_Dynamodb_1 = __importDefault(require("../common/API_Dynamodb"));
const TABLE_NAME = process.env.gameTableName;
const moveCounter = async (gameId) => {
    const data = await API_Dynamodb_1.default.query({
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
    });
    if (data.Items && data.Items.length > 0) {
        const myObj = data.Items[0];
        let new_count = myObj.move_count;
        new_count = new_count + 1;
        try {
            await API_Dynamodb_1.default.update({
                TableName: TABLE_NAME,
                Key: { itemType: 'counter', Id: myObj.Id },
                UpdateExpression: 'set #move_count = :new_count',
                ExpressionAttributeNames: {
                    '#move_count': 'move_count'
                },
                ExpressionAttributeValues: {
                    ':new_count': new_count
                },
            });
        }
        catch (e) {
            return (e.message);
        }
        return (new_count);
    }
    else {
        const move_count = 1;
        try {
            await API_Dynamodb_1.default.put(TABLE_NAME, {
                itemType: 'counter',
                Id: uuid_1.v4(),
                gameId,
                move_count
            });
        }
        catch (e) {
            return (e.message);
        }
        return (move_count);
    }
};
exports.moveCounter = moveCounter;
