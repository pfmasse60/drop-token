// AWS Lambda API endpoint to create new game
// Creates new 4 x 4 gameboard and two players
// Pete Masse - 7/30/2021

import {APIGatewayProxyEvent, APIGatewayProxyHandler} from 'aws-lambda';
import Responses from '../common/API_Responses';
import Dynamo from '../common/API_Dynamodb';
import {v4 as uuidv4} from 'uuid';
// import core
import middy from '@middy/core' // esm Node v14+
//const middy = require('@middy/core') // commonjs Node v12+

// import some middlewares
import jsonBodyParser from '@middy/http-json-body-parser'
import httpErrorHandler from '@middy/http-error-handler'
import validator from '@middy/validator'

// Serverless invironment variables set inside serverless.yml
const STATE: string = process.env.gameState !;
const TABLE_NAME: string = process.env.gameTableName !;

type GameBoardType = {
    itemType: string,
    Id: string,
    player1: string,
    player2: string,
    winner: string,
    columns: number,
    rows: number,
    maxMoves: number,
    state: string,
    col0: string[],
    col1: string[],
    col2: string[],
    col3: string[]
};

type PlayerType = {
    itemType: string,
    Id: string,
    gameId: string,
    playerName: string,
    turn: boolean
}

type HandlerInputType = {
    players: string[],
    columns: number,
    rows: number
}

export const baseHandler: APIGatewayProxyHandler = async (event : APIGatewayProxyEvent) => {
    const gameId: string = uuidv4();
    const {players, columns, rows} = event.body as unknown as HandlerInputType;
    console.log(event);
    // if (!players
    //     || !columns
    //     || !rows
    //     || players.length != 2
    //     || typeof rows !== 'number'
    //     || typeof columns !== 'number') 
    //     return Responses._400({'message': 'Malformed Requst'});
    

    const [player1, player2] = players;

    await Dynamo.put<GameBoardType>(TABLE_NAME as string, {
        itemType: 'game',
        Id: gameId,
        player1,
        player2,
        winner: '',
        columns,
        rows,
        maxMoves: columns * rows,
        state: STATE !,
        col0: [],
        col1: [],
        col2: [],
        col3: []
    });

    await Dynamo.put<PlayerType>(TABLE_NAME as string, {
        itemType: 'player',
        Id: uuidv4(),
        gameId: gameId,
        playerName: player1,
        turn: true
    });

    await Dynamo.put<PlayerType>(TABLE_NAME as string, {
        itemType: 'player',
        Id: uuidv4(),
        gameId: gameId,
        playerName: player2,
        turn: false
    });

    return Responses._200({"gameId": gameId});
};

const inputSchema = {
    type: 'object',
    properties: {
        body: {
            type: 'object',
            properties: {
                players: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    minItems: 2,
                    uniqueItems: true
                },
                columns: {
                    type: 'number'
                },
                rows: {
                    type: 'number'
                }
            },
            required: ['players', 'columns', 'rows']
        }
    }
}

export const handler = middy(baseHandler)
  .use(jsonBodyParser()) // parses the request body when it's a JSON and converts it to an object
  .use(validator({inputSchema})) // validates the input
  .use(httpErrorHandler()) // handles common http errors and returns proper responses
