import { moveCounter } from '../utils/moveCounter';

export const handler = async () => {

    const gameId = 'cc35415e-ad8b-4d05-b7d4-0c6303e20bb9';
    return(await moveCounter(gameId as string));
}