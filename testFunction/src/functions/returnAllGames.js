"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const returnGames_1 = require("../utils/returnGames");
// import AWS from "aws-sdk";
const handler = async () => {
    return {
        statusCode: 200,
        body: await returnGames_1.returnGames()
    };
};
exports.handler = handler;
