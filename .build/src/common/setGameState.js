"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const API_Dynamodb_1 = __importDefault(require("./API_Dynamodb"));
const TABLE_NAME = process.env.gameTableName;
exports.default = async (gameId, state) => {
    const gameStateUpdateParams = {
        TableName: TABLE_NAME,
        Key: {
            itemType: 'game',
            Id: gameId
        },
        UpdateExpression: 'set #state = :state',
        ExpressionAttributeNames: {
            '#state': 'state'
        },
        ExpressionAttributeValues: {
            ':state': state
        }
    };
    await API_Dynamodb_1.default.update(gameStateUpdateParams);
};
