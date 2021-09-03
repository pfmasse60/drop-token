"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const API_Dynamodb_1 = __importDefault(require("../common/API_Dynamodb"));
const TABLE_NAME = process.env.gameTableName;
exports.default = async (Id) => {
    // let options = {};
    // if (process.env.IS_OFFLINE) {
    // options = {
    //     region: 'localhost',
    //     endpoint: 'http://localhost:8000',
    // }
    // }
    // const dynamodb = new AWS.DynamoDB.DocumentClient(options);
    const params = {
        ExpressionAttributeValues: {
            ":itemtype": {
                S: "game",
            },
            ":Id": {
                S: Id
            }
        },
        ExpressionAttributeNames: {
            "#state": "state"
        },
        KeyConditionExpression: 'itemType = :itemtype and Id = :Id',
        ProjectionExpression: "#state, player1, player2, winner",
        TableName: TABLE_NAME,
    };
    // const game: {[key: string]: any} = await dynamodb.query(params).promise();
    const data = await API_Dynamodb_1.default.query2(params);
    console.log('GAME' + JSON.stringify(data, null, 1));
    // if (data && data.Items!.length > 0) {{
    //     const Items = data.Items[0];
    //       const gameState = {
    //         "players": [
    //           Items.player1,
    //           Items.player2
    //         ],
    //           "state": Items.state,
    //       }
    //   return gameState;
    // }
    return (null);
};
