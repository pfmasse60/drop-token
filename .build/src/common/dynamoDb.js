"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dynamo = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
let options = {};
if (process.env.IS_OFFLINE) {
    options = {
        region: 'localhost',
        endpoint: 'http://localhost:8000'
    };
}
const dynamodb = new aws_sdk_1.default.DynamoDB.DocumentClient(options);
exports.Dynamo = {
    async put(TableName, Item) {
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
};
