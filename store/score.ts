import { Player, PlayerIndex } from './Player';
import { Card, sort, Suit } from '~/CardTypes';

export interface PlayerScore {
  id: PlayerIndex;
  bid: number;
  jack: boolean;
  highest: boolean;
  lowest: boolean;
  gamePoints: number;
}

interface FinalScore {
  redScore: number;
  blueScore: number;
  scores: PlayerScore[];
}

function gamePoint(card: Card): number {
  if (card.value < 10) {
    return 0;
  }

  if (card.value === 10) {
    return 10;
  }

  return card.value - 10;
}

function gamePoints(hand: Card[]): number {
  return hand.reduce((a, c) => a + gamePoint(c), 0);
}

export default function score(trump: Suit, players: Player[]): FinalScore {
  const all = players
    .flatMap((p) => p.won)
    .filter((c) => c.suit === trump)
    .sort(sort);
  const highest = all[all.length - 1];

  let redScore = 0;
  let blueScore = 0;

  let redGame = 0;
  let blueGame = 0;

  const scores = players.map((p, i) => {
    const score: PlayerScore = {
      id: p.id,
      bid: p.bid,
      jack: !!p.won.find((c) => c.suit === trump && c.value === 11),
      highest: p.won.includes(highest),
      lowest: false, // HACK: Computed in game.ts
      gamePoints: gamePoints(p.won),
    };

    let total = 0;
    if (score.jack) total++;
    if (score.highest) total++;
    if (score.lowest) total++;

    if (i % 2 === 0) {
      redScore += total;
      redGame += score.gamePoints;
    } else {
      blueScore += total;
      blueGame += score.gamePoints;
    }

    return score;
  });

  if (redGame > blueGame) {
    redScore++;
  } else if (blueGame > redGame) {
    blueScore++;
  }

  return {
    redScore,
    blueScore,
    scores,
  };
}
