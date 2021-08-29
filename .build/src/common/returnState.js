"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnState = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const TABLE_NAME = process.env.gameTableName;
const returnState = async (Id) => {
    let options = {};
    if (process.env.IS_OFFLINE) {
        options = {
            region: 'localhost',
            endpoint: 'http://localhost:8000',
        };
    }
    const dynamodb = new aws_sdk_1.default.DynamoDB.DocumentClient(options);
    const params = {
        ExpressionAttributeValues: {
            ":itemtype": "game",
            ":Id": Id
        },
        ExpressionAttributeNames: {
            "#state": "state"
        },
        KeyConditionExpression: 'itemType = :itemtype and Id = :Id',
        ProjectionExpression: "#state, player1, player2, winner",
        TableName: TABLE_NAME,
    };
    const game = await dynamodb.query(params).promise();
    if (game.Count > 0) {
        const Items = game.Items[0];
        const gameState = {
            "players": [
                Items.player1,
                Items.player2
            ],
            "state": Items.state,
            "winner": Items.winner
        };
        return gameState;
    }
    return (game.Items[0]);
};
exports.returnState = returnState;
