import { Card } from '../CardTypes';

export type PlayerIndex = 0 | 1 | 2 | 3;

export type Player = {
  id: PlayerIndex;
  name: string;
  cards: Card[];
  played: Card;
  bid: number;
  won: Card[];
};
