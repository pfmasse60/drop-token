"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const returnMove_1 = require("../utils/returnMove");
const API_Responses_1 = __importDefault(require("./API_Responses"));
const handler = async (event) => {
    const { gameId, move_number } = event.pathParameters;
    const data = await returnMove_1.returnMove({ gameId, move_number });
    switch (data.statusCode) {
        case 404:
            // return Responses._404({'message': 'Game/moves not found'});
            return API_Responses_1.default._404(data.data);
        case 400:
            return API_Responses_1.default._400({ 'message': 'Malformed request' });
        default:
            return API_Responses_1.default._202(data.data);
    }
};
exports.handler = handler;
