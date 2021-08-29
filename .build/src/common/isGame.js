"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import AWS from "aws-sdk";
const TABLE_NAME = process.env.gameTableName;
const API_Dynamodb_1 = __importDefault(require("../common/API_Dynamodb"));
exports.default = async (gameId) => {
    let options = {};
    if (process.env.IS_OFFLINE) {
        options = {
            region: 'localhost',
            endpoint: 'http://localhost:8000',
        };
    }
    // const dynamodb = new AWS.DynamoDB.DocumentClient(options);
    const params = {
        ExpressionAttributeValues: {
            ':itemtype': 'game',
            ':Id': gameId
        },
        ExpressionAttributeNames: {
            "#state": "state"
        },
        KeyConditionExpression: 'itemType = :itemtype and Id = :Id',
        ProjectionExpression: '#state',
        TableName: TABLE_NAME,
    };
    const game = await API_Dynamodb_1.default.query(params);
    if (!game || game?.Items == undefined) {
        return false;
    }
    return true;
};
