"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const getState_1 = __importDefault(require("../common/getState"));
const API_Responses_1 = __importDefault(require("../common/API_Responses"));
const handler = async (event) => {
    const Id = event.pathParameters?.gameId;
    if (/[ `!@#$%^&*()_]/.test(Id) === true) {
        return API_Responses_1.default._400({ body: { message: 'Malformed request' } });
    }
    const returnedState = await getState_1.default(Id);
    if (!returnedState) {
        return API_Responses_1.default._404({ body: { message: 'Game/moves not found' } });
    }
    return API_Responses_1.default._200({ "gameId": returnedState });
};
exports.handler = handler;
