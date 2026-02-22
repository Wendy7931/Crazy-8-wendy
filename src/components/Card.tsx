
import React from 'react';
import { motion } from 'motion/react';
import { Card as CardType, Suit } from '../types';
import { Heart, Diamond, Club, Spade } from 'lucide-react';

interface CardProps {
  card: CardType;
  onClick?: () => void;
  isFlipped?: boolean;
  disabled?: boolean;
  className?: string;
}

const SuitIcon = ({ suit, size = 20 }: { suit: Suit; size?: number }) => {
  switch (suit) {
    case Suit.HEARTS: return <Heart size={size} className="text-red-500 fill-red-500" />;
    case Suit.DIAMONDS: return <Diamond size={size} className="text-red-500 fill-red-500" />;
    case Suit.CLUBS: return <Club size={size} className="text-zinc-900 fill-zinc-900" />;
    case Suit.SPADES: return <Spade size={size} className="text-zinc-900 fill-zinc-900" />;
  }
};

export const Card: React.FC<CardProps> = ({ card, onClick, isFlipped = true, disabled = false, className = "" }) => {
  const isRed = card.suit === Suit.HEARTS || card.suit === Suit.DIAMONDS;

  return (
    <motion.div
      layoutId={card.id}
      whileHover={!disabled && isFlipped ? { y: -20, scale: 1.05 } : {}}
      whileTap={!disabled && isFlipped ? { scale: 0.95 } : {}}
      onClick={!disabled ? onClick : undefined}
      className={`
        relative w-24 h-36 sm:w-32 sm:h-48 rounded-xl shadow-lg cursor-pointer overflow-hidden
        transition-shadow duration-200
        ${disabled ? 'opacity-80 cursor-not-allowed' : 'hover:shadow-xl'}
        ${className}
      `}
    >
      {isFlipped ? (
        <div className="w-full h-full bg-white border-2 border-zinc-200 flex flex-col p-2 sm:p-3 select-none">
          <div className={`flex flex-col items-start ${isRed ? 'text-red-500' : 'text-zinc-900'}`}>
            <span className="text-lg sm:text-2xl font-bold leading-none">{card.rank}</span>
            <SuitIcon suit={card.suit} size={16} />
          </div>
          
          <div className="flex-grow flex items-center justify-center">
            <SuitIcon suit={card.suit} size={48} />
          </div>

          <div className={`flex flex-col items-end rotate-180 ${isRed ? 'text-red-500' : 'text-zinc-900'}`}>
            <span className="text-lg sm:text-2xl font-bold leading-none">{card.rank}</span>
            <SuitIcon suit={card.suit} size={16} />
          </div>
        </div>
      ) : (
        <div className="w-full h-full bg-indigo-700 border-4 border-white flex items-center justify-center">
          <div className="w-full h-full opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-white/30 rounded-full flex items-center justify-center">
              <span className="text-white/50 font-serif italic text-xl sm:text-2xl">W</span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
