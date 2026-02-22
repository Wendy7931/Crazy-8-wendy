
import { useState, useCallback, useEffect } from 'react';
import { Card, Suit, Rank, GameState, GameStatus } from '../types';
import { createDeck, shuffle, INITIAL_HAND_SIZE } from '../constants';

const getSuitName = (suit: Suit) => {
  switch (suit) {
    case Suit.HEARTS: return '红心';
    case Suit.DIAMONDS: return '方块';
    case Suit.CLUBS: return '梅花';
    case Suit.SPADES: return '黑桃';
    default: return suit;
  }
};

export const useCrazyEights = () => {
  const [state, setState] = useState<GameState>({
    deck: [],
    playerHand: [],
    aiHand: [],
    discardPile: [],
    currentSuit: null,
    turn: 'PLAYER',
    status: 'WAITING',
    winner: null,
    lastAction: '欢迎来到 Wendy 的疯狂 8 点！',
  });

  const initGame = useCallback(() => {
    const fullDeck = shuffle(createDeck());
    const playerHand = fullDeck.splice(0, INITIAL_HAND_SIZE);
    const aiHand = fullDeck.splice(0, INITIAL_HAND_SIZE);
    
    // Initial discard cannot be an 8 for simplicity in starting
    let firstDiscardIndex = fullDeck.findIndex(c => c.rank !== Rank.EIGHT);
    if (firstDiscardIndex === -1) firstDiscardIndex = 0;
    const firstDiscard = fullDeck.splice(firstDiscardIndex, 1)[0];

    setState({
      deck: fullDeck,
      playerHand,
      aiHand,
      discardPile: [firstDiscard],
      currentSuit: firstDiscard.suit,
      turn: 'PLAYER',
      status: 'PLAYING',
      winner: null,
      lastAction: '游戏开始！轮到你了。',
    });
  }, []);

  const checkWinner = useCallback((newState: GameState) => {
    if (newState.playerHand.length === 0) {
      return { ...newState, status: 'GAME_OVER' as GameStatus, winner: 'PLAYER' as const };
    }
    if (newState.aiHand.length === 0) {
      return { ...newState, status: 'GAME_OVER' as GameStatus, winner: 'AI' as const };
    }
    return newState;
  }, []);

  const isValidMove = useCallback((card: Card, currentState: GameState) => {
    const topCard = currentState.discardPile[currentState.discardPile.length - 1];
    if (card.rank === Rank.EIGHT) return true;
    return card.suit === currentState.currentSuit || card.rank === topCard.rank;
  }, []);

  const drawCard = useCallback(() => {
    if (state.status !== 'PLAYING' || state.turn !== 'PLAYER') return;

    setState(prev => {
      if (prev.deck.length === 0) {
        return { ...prev, turn: 'AI', lastAction: '牌堆已空！跳过回合。' };
      }
      const newDeck = [...prev.deck];
      const drawnCard = newDeck.pop()!;
      return {
        ...prev,
        deck: newDeck,
        playerHand: [...prev.playerHand, drawnCard],
        turn: 'AI',
        lastAction: '你摸了一张牌。',
      };
    });
  }, [state.status, state.turn]);

  const playCard = useCallback((cardId: string) => {
    setState(prev => {
      if (prev.status !== 'PLAYING' || prev.turn !== 'PLAYER') return prev;

      const cardIndex = prev.playerHand.findIndex(c => c.id === cardId);
      const card = prev.playerHand[cardIndex];

      if (!isValidMove(card, prev)) return prev;

      const newPlayerHand = prev.playerHand.filter(c => c.id !== cardId);
      const newDiscardPile = [...prev.discardPile, card];

      if (card.rank === Rank.EIGHT) {
        return {
          ...prev,
          playerHand: newPlayerHand,
          discardPile: newDiscardPile,
          status: 'SUIT_SELECTION',
          lastAction: '你打出了 8！请选择花色。',
        };
      }

      const nextState = checkWinner({
        ...prev,
        playerHand: newPlayerHand,
        discardPile: newDiscardPile,
        currentSuit: card.suit,
        turn: 'AI',
        lastAction: `你打出了 ${getSuitName(card.suit)} ${card.rank}。`,
      });

      return nextState;
    });
  }, [isValidMove, checkWinner]);

  const selectSuit = useCallback((suit: Suit) => {
    setState(prev => {
      const nextState = checkWinner({
        ...prev,
        currentSuit: suit,
        status: 'PLAYING',
        turn: 'AI',
        lastAction: `花色改为 ${getSuitName(suit)}。轮到 AI。`,
      });
      return nextState;
    });
  }, [checkWinner]);

  // AI Logic
  useEffect(() => {
    if (state.status === 'PLAYING' && state.turn === 'AI') {
      const timer = setTimeout(() => {
        setState(prev => {
          const playableCards = prev.aiHand.filter(c => isValidMove(c, prev));
          
          if (playableCards.length > 0) {
            // Prefer non-8s if possible, or just pick first
            const cardToPlay = playableCards.find(c => c.rank !== Rank.EIGHT) || playableCards[0];
            const newAiHand = prev.aiHand.filter(c => c.id !== cardToPlay.id);
            const newDiscardPile = [...prev.discardPile, cardToPlay];
            
            if (cardToPlay.rank === Rank.EIGHT) {
              // AI picks its most frequent suit
              const suitCounts: Record<string, number> = {};
              newAiHand.forEach(c => {
                suitCounts[c.suit] = (suitCounts[c.suit] || 0) + 1;
              });
              const bestSuit = (Object.keys(suitCounts).reduce((a, b) => suitCounts[a] > suitCounts[b] ? a : b, Suit.HEARTS)) as Suit;
              
              return checkWinner({
                ...prev,
                aiHand: newAiHand,
                discardPile: newDiscardPile,
                currentSuit: bestSuit,
                turn: 'PLAYER',
                lastAction: `AI 打出了 8 并选择了 ${getSuitName(bestSuit)}。`,
              });
            }

            return checkWinner({
              ...prev,
              aiHand: newAiHand,
              discardPile: newDiscardPile,
              currentSuit: cardToPlay.suit,
              turn: 'PLAYER',
              lastAction: `AI 打出了 ${getSuitName(cardToPlay.suit)} ${cardToPlay.rank}。`,
            });
          } else {
            // Draw
            if (prev.deck.length > 0) {
              const newDeck = [...prev.deck];
              const drawnCard = newDeck.pop()!;
              return {
                ...prev,
                deck: newDeck,
                aiHand: [...prev.aiHand, drawnCard],
                turn: 'PLAYER',
                lastAction: 'AI 摸了一张牌。',
              };
            } else {
              return {
                ...prev,
                turn: 'PLAYER',
                lastAction: 'AI 跳过（无牌可摸）。',
              };
            }
          }
        });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state.status, state.turn, isValidMove, checkWinner]);

  return {
    state,
    initGame,
    playCard,
    drawCard,
    selectSuit,
  };
};
