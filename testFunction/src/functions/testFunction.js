"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const handler = async () => {
    const dynamodb = new aws_sdk_1.default.DynamoDB.DocumentClient();
    const TABLE_NAME = process.env.gameTableName;
    const gameId = 'e4e96c22-f529-478a-bc17-41540f3c79f3';
    const params = {
        TableName: TABLE_NAME,
        Key: { itemType: 'game', Id: gameId },
        UpdateExpression: 'set #move_count = :new_count',
        "Tags": {
            "L": [
                {
                    "S": "items"
                },
                {
                    "S": "attributes"
                },
                {
                    "S": "throughput"
                }
            ]
        }
    };
    try {
        const result = await dynamodb.update(params).promise();
        console.log(result);
    }
    catch (e) {
        console.log(e);
    }
};
exports.handler = handler;
