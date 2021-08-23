"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const makeGame_1 = require("../utils/makeGame");
const handler = async (event) => {
    if (event && event.body) {
        const { players, columns, rows } = JSON.parse(event.body);
        if (!players || !columns || !rows || players.length < 2) {
            return responseApi._400({ body: { message: 'Malformed request' } });
        }
    }
    return responseApi._200({ "gameId": await makeGame_1.makeGame(event.body) });
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
    }
};
