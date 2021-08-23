"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const gameBoard_1 = require("../libs/gameBoard");
// let td: string[][] = [
//     [],
//     [],
//     [],
//     []
// ];
const handler = async (event) => {
    if (event && event.body) {
        const { player, column, gameId } = JSON.parse(event.body);
        return gameBoard_1.gameboard.add(column, player, gameId);
        // let options = {};
        // if (process.env.IS_OFFLINE) {
        //     options = {
        //     region: 'localhost',
        //     endpoint: 'http://localhost:8000',
        //     }
        // }
        // const dynamodb = new AWS.DynamoDB.DocumentClient(options);
        // const TABLE_NAME = process.env.gameTableName;
        // // let game;
        // // const gameId = 'e3ab8de9-61fb-4576-a6d4-3a562b4e9408';
        // // const playerId = '0ae81401-e9f3-4038-9d72-2130844288a8';
        // const player = [[{row: 2,col: 3, player: '0ae81401-e9f3-4038-9d72-2130844288a8'}]];
        // const params = {
        //     TableName: TABLE_NAME as string,
        //     Key: {itemType: 'game', Id: gameId},
        //     UpdateExpression: 'SET #c = list_append(#c, :c)',
        //     ExpressionAttributeValues:{
        //         ':c': player,
        //     },
        //     ExpressionAttributeNames:{
        //         '#c': `col${column}`,
        //     },
        // }
        // 	await dynamodb.update(params).promise();
        //     const params2 = {
        //         ExpressionAttributeValues: {
        //             ":itemtype": "game",
        //             ":Id": gameId
        //         },
        //         ExpressionAttributeNames: {
        //             "#Id": "Id",
        //             "#i": "itemType"
        //         },
        //         KeyConditionExpression: '#i = :itemtype and #Id = :Id',
        //         ProjectionExpression: `col${column}`,
        //         TableName: TABLE_NAME as string,
        //         }
        //         const number = await dynamodb.query(params2).promise();
        //         if (number && number.Items) {
        //             let Col = number.Items[0].`col${column}`.length;
        //             console.log(Col);
        //             return(Col);
        //         }
        //     }
        // let options = {};
        // if (process.env.IS_OFFLINE) {
        //     options = {
        //     region: 'localhost',
        //     endpoint: 'http://localhost:8000',
        //     }
        // }
        // const dynamodb = new AWS.DynamoDB.DocumentClient(options);
        // const params = {
        //     ExpressionAttributeValues: {
        //         ':playerId': playerId,
        //         ':gameId': gameId
        //     },
        //     ExpressionAttributeNames: {
        //         '#playerId': 'Id',
        //         '#gameId': 'gameId'
        //     },
        //     KeyConditionExpression: '#playerId = :playerId and #gameId = :gameId',
        //     ProjectionExpression: 'playerName',
        //     TableName: TABLE_NAME as string,
        //     IndexName: 'PlayerIndex'
        //     }
        // const game: {[key: string]: any} = await dynamodb.query(params).promise();
        // console.log(game);
        // return(game);
    }
};
exports.handler = handler;
// const gameboard = {
//     add(column: number, player: string) {
//         if (td[column].length < 4 ) {
//             td[column].push(player);
//             return JSON.stringify({'statusCode': 200, 'body': td})
//         } else {
//             return(JSON.stringify({'statusCode': 400}));
//         }
//     }
// }
