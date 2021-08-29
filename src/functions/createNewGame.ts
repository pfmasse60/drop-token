import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import Responses from '../common/API_Responses';
import Dynamo from '../common/API_Dynamodb';
import { v4 as uuidv4 } from 'uuid';

const STATE:string = process.env.gameState!;
const TABLE_NAME:string = process.env.gameTableName!;

type GameType = {
  itemType: string,
  Id: string,
  player1: string,
  player2: string,
  columns: number,
  rows: number,
  state: string,
  winner: string | null,
  col0: string[],
  col1:	string[],
  col2:	string[],
  col3:	string[]
};

type PlayerType = {
  itemType: string,
  Id: string,
  gameId: string,
  playerName: string  
}

type HandlerInputType = {
  players: string[],
  columns: number,
  rows: number
}

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    const gameId:string = uuidv4();
    const {players, columns, rows}: HandlerInputType = JSON.parse(event.body!);

    if(!players || !columns || !rows)
      return Responses._400({'message': 'Malformed Requst'});

    const [player1, player2] = players;
    
    await Dynamo.put<GameType>(
      TABLE_NAME as string,
      {
        itemType: 'game',
        Id: gameId,
        player1,
        player2,
        columns,
        rows,
        state: STATE!,
        winner: null,
        col0: [],
        col1:	[],
        col2:	[],
        col3:	[]
      });
      
      await Dynamo.put<PlayerType>(
        TABLE_NAME as string,
        {
          itemType: 'player',
          Id: uuidv4(),
          gameId: gameId,
          playerName: player1
        });
      
      await Dynamo.put<PlayerType>(
        TABLE_NAME as string,
        {
          itemType: 'player',
          Id: uuidv4(),
          gameId: gameId,
          playerName: player2
        });
        
  return Responses._200({"gameId": gameId});
};
