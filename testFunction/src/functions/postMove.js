"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const makeMove_1 = require("../utils/makeMove");
const handler = async (event) => {
    let returnedMove = "";
    if (event && event.body) {
        const { column } = JSON.parse(event.body);
        if (!column) {
            return responseApi._400({ body: { message: 'Malformed request' } });
        }
        const { gameId, playerId } = event.pathParameters;
        returnedMove = await makeMove_1.makeMove({ gameId, playerId, moveType: 'move', column });
    }
    if (returnedMove.length < 1) {
        return responseApi._404({ body: { message: 'Game/moves not found' } });
    }
    return responseApi._200({ "gameId": returnedMove });
};
exports.handler = handler;
const responseApi = {
    _200: (body) => {
        return {
            statusCode: 200,
            body: JSON.stringify(body, null, 2),
        };
    },
    _400: (body) => {
        return {
            statusCode: 400,
            body: JSON.stringify(body, null, 2),
        };
    },
    _404: (body) => {
        return {
            statusCode: 404,
            body: JSON.stringify(body, null, 2),
        };
    }
};
