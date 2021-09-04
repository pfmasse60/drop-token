"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const API_Responses_1 = __importDefault(require("../common/API_Responses"));
const API_Dynamodb_1 = __importDefault(require("../common/API_Dynamodb"));
const TABLE_NAME = process.env.gameTableName;
const handler = async (event) => {
    const { gameId, move_number } = event.pathParameters;
    const moveParams = {
        ExpressionAttributeValues: {
            ':gameId': gameId,
            ':move_number': +move_number,
            ':itemType': 'move'
        },
        ExpressionAttributeNames: {
            '#gameId': 'gameId',
            '#itemType': 'itemType',
            '#move_number': 'move_number',
            '#column': 'column'
        },
        KeyConditionExpression: '#gameId = :gameId and #itemType = :itemType',
        FilterExpression: '#move_number = :move_number',
        ProjectionExpression: 'itemType, playerId, #column',
        TableName: TABLE_NAME,
        IndexName: 'MoveNumberIndex'
    };
    const data = await API_Dynamodb_1.default.query(moveParams);
    if (!data?.Items || data.Items?.length <= 0) {
        return ({ 'statusCode': 404 });
    }
    const playerParams = {
        ExpressionAttributeValues: {
            ':playerId': data.Items[0].playerId,
            ':gameId': gameId
        },
        ExpressionAttributeNames: {
            '#playerId': 'Id',
            '#gameId': 'gameId'
        },
        KeyConditionExpression: '#playerId = :playerId and #gameId = :gameId',
        ProjectionExpression: 'playerName',
        TableName: TABLE_NAME,
        IndexName: 'PlayerIndex'
    };
    let playerName;
    try {
        playerName = await API_Dynamodb_1.default.query(playerParams);
    }
    catch (e) {
        return (e.message);
    }
    if (playerName?.Items && playerName?.Items?.length > 0) {
        playerName = playerName.Items[0];
    }
    return API_Responses_1.default._202({
        'type': data.Items[0].itemType,
        'player': playerName.playerName,
        'column': data.Items[0].column
    });
};
exports.handler = handler;
