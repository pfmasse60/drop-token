"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const API_Responses_1 = __importDefault(require("./API_Responses"));
const TABLE_NAME = process.env.gameTableName;
const handler = async (event) => {
    const { gameId } = event.pathParameters;
    const dynamodb = new aws_sdk_1.default.DynamoDB.DocumentClient();
    const search = event.queryStringParameters;
    let start = search?.start;
    let until = search?.until;
    let qParams;
    // let keyCondition;
    // let expressionAttValues;
    // let expressionAttNames
    if (start == null || until == null) {
        let keyCondition = '#gameId = :gameId and #itemType = :itemType';
        let expressionAttValues = {
            ':gameId': gameId,
            ':itemType': 'move'
        };
        let expressionAttNames = {
            '#gameId': 'gameId',
            '#column': 'column',
            '#itemType': 'itemType'
        };
        qParams = {
            ExpressionAttributeValues: expressionAttValues,
            ExpressionAttributeNames: expressionAttNames,
            KeyConditionExpression: keyCondition,
            ProjectionExpression: 'moveType, playerName, #column',
            TableName: TABLE_NAME,
            IndexName: 'MoveNumberIndex'
        };
    }
    else {
        let startInt = parseInt(start);
        let untilInt = parseInt(until);
        if (untilInt < startInt || startInt <= 0) {
            return API_Responses_1.default._400({ 'message': 'Malformed request' });
        }
        let keyCondition = '#gameId = :gameId and #itemType = :itemType';
        let expressionAttValues = {
            ':gameId': gameId,
            ':itemType': 'move',
            ':start': startInt,
            ':until': untilInt
        };
        let expressionAttNames = {
            '#gameId': 'gameId',
            '#column': 'column',
            '#itemType': 'itemType',
            '#move_number': 'move_number'
        };
        qParams = {
            ExpressionAttributeValues: expressionAttValues,
            ExpressionAttributeNames: expressionAttNames,
            KeyConditionExpression: keyCondition,
            FilterExpression: '#move_number >= :start and #move_number <= :until ',
            ProjectionExpression: 'moveType, playerName, #column',
            TableName: TABLE_NAME,
            IndexName: 'MoveNumberIndex'
        };
    }
    // return Responses._400({'message': qParams});
    const data = await dynamodb.query(qParams).promise();
    if (data.Items && data.Items.length > 0) {
        return API_Responses_1.default._200({ 'moves': data.Items });
    }
    return API_Responses_1.default._404({ 'message': data });
};
exports.handler = handler;
