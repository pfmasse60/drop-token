"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
let options = {};
if (process.env.IS_OFFLINE) {
    options = {
        region: 'localhost',
        endpoint: 'http://localhost:8000'
    };
}
const dynamodb = new aws_sdk_1.default.DynamoDB.DocumentClient(options);
exports.default = {
    async put(TableName, Item) {
        console.log(JSON.stringify(Item, null, 1));
        var params = {
            TableName,
            Item
        };
        try {
            await dynamodb.put(params).promise();
        }
        catch (e) {
            console.log(e.message);
        }
    },
    async update(params) {
        console.log(JSON.stringify(params, null, 1));
        try {
            await dynamodb.update(params).promise();
        }
        catch (e) {
            return (e.message);
        }
        return { 'statusCode': 202 };
    },
    async query(params) {
        let data;
        try {
            data = await dynamodb.query(params).promise();
        }
        catch (e) {
            console.log(e.message);
        }
        console.log(JSON.stringify(data));
        return data;
    }
};
