import { Card, isJick, isTrump, Suit } from './CardTypes';

type OptionalCard = Card | null | undefined;

export function isRecommended(trump: Suit, led: Card, card: Card) {
  return (
    isTrump(trump, card) ||
    (led.suit === card.suit && !(isJick(trump, led) || isJick(trump, card)))
  );
}

export function isRequired(trump: Suit, led: Card, card: Card) {
  return (
    (isTrump(trump, led) && isTrump(trump, card)) ||
    (led.suit === card.suit && !(isJick(trump, led) || isJick(trump, card)))
  );
}

export function isAllowed(
  trump: Suit,
  led: OptionalCard,
  hand: Card[],
  card: Card
) {
  if (!led) {
    return true;
  }

  const hasRequired = hand.some((c) => isRequired(trump, led, c));
  return !hasRequired || isRecommended(trump, led, card);
}
