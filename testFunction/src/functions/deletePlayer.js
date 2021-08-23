"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const deletePlayer_1 = require("../utils/deletePlayer");
const API_Responses_1 = __importDefault(require("./API_Responses"));
const handler = async (event) => {
    const data = await deletePlayer_1.deletePlayer(event.pathParameters);
    switch (data.statusCode) {
        case 404:
            return API_Responses_1.default._404({ 'message': 'Game not found or player is not a part of it' });
        case 410:
            return API_Responses_1.default._410({ 'message': 'Game is already in DONE state' });
        default:
            return API_Responses_1.default._202({ 'message': 'Success' });
    }
};
exports.handler = handler;
