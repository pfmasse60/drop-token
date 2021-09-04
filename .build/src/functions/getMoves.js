"use strict";
// AWS Lambda API endpoint to retrieve all in progress games
// Pete Masse - 7/30/2021
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const API_Responses_1 = __importDefault(require("../common/API_Responses"));
const API_Dynamodb_1 = __importDefault(require("../common/API_Dynamodb"));
const isGame_1 = __importDefault(require("../common/isGame"));
// Serverless invironment variable set inside serverless.yml
const TABLE_NAME = process.env.gameTableName;
const handler = async (event) => {
    const { gameId } = event.pathParameters;
    if (await isGame_1.default(gameId) === false) {
        return API_Responses_1.default._404({ 'message': 'Game/moves not found' });
    }
    const search = event.queryStringParameters;
    let qParams;
    if (search == null) {
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
        let startInt = +search.start;
        let untilInt = +search.until;
        if (untilInt < startInt || startInt < 0) {
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
    const data = await API_Dynamodb_1.default.query(qParams);
    return API_Responses_1.default._200({ 'moves': data.Items });
};
exports.handler = handler;
