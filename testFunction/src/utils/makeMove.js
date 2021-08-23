'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeMove = void 0;
const uuid_1 = require("uuid");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const moveCounter_1 = require("./moveCounter");
const isGame_1 = __importDefault(require("../queries/isGame"));
const TABLE_NAME = process.env.gameTableName;
const makeMove = async (params) => {
    const dynamodb = new aws_sdk_1.default.DynamoDB.DocumentClient();
    let { gameId, playerId, moveType, column = '' } = params;
    if (!await isGame_1.default(gameId)) {
        return ({ 'statusCode': 400 });
    }
    ;
    const playerParams = {
        ExpressionAttributeValues: {
            ':playerId': playerId,
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
    const result = await dynamodb.query(playerParams).promise();
    const move_number = await moveCounter_1.moveCounter(gameId);
    if (result.Items && result.Items.length > 0) {
        let myObj = result.Items[0];
        const newMoveParams = {
            TableName: TABLE_NAME,
            Item: {
                itemType: 'move',
                Id: uuid_1.v4(),
                gameId,
                playerId,
                playerName: myObj.playerName,
                moveType,
                move_number,
                column
            }
        };
        try {
            await dynamodb.put(newMoveParams).promise();
        }
        catch (e) {
            return (e.message);
        }
        return (gameId + "/moves/" + move_number);
    }
    return ({ 'statusCode': 404 });
};
exports.makeMove = makeMove;
