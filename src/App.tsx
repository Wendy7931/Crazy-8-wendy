/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCrazyEights } from './hooks/useCrazyEights';
import { Card } from './components/Card';
import { Suit, Rank } from './types';
import { Heart, Diamond, Club, Spade, RotateCcw, Trophy, Info } from 'lucide-react';

const SuitIcon = ({ suit, size = 24 }: { suit: Suit; size?: number }) => {
  switch (suit) {
    case Suit.HEARTS: return <Heart size={size} className="text-red-500 fill-red-500" />;
    case Suit.DIAMONDS: return <Diamond size={size} className="text-red-500 fill-red-500" />;
    case Suit.CLUBS: return <Club size={size} className="text-zinc-900 fill-zinc-900" />;
    case Suit.SPADES: return <Spade size={size} className="text-zinc-900 fill-zinc-900" />;
  }
};

export default function App() {
  const { state, initGame, playCard, drawCard, selectSuit } = useCrazyEights();

  const topDiscard = state.discardPile[state.discardPile.length - 1];

  return (
    <div className="min-h-screen bg-emerald-900 text-white font-sans overflow-hidden flex flex-col">
      {/* Start Screen */}
      <AnimatePresence>
        {state.status === 'WAITING' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed inset-0 z-[100] bg-emerald-950 flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="grid grid-cols-8 gap-4 p-4">
                {Array.from({ length: 32 }).map((_, i) => (
                  <div key={i} className="w-24 h-36 border-2 border-white rounded-xl rotate-12" />
                ))}
              </div>
            </div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative z-10"
            >
              <div className="mb-6 flex justify-center gap-4">
                <SuitIcon suit={Suit.HEARTS} size={32} />
                <SuitIcon suit={Suit.SPADES} size={32} />
                <SuitIcon suit={Suit.DIAMONDS} size={32} />
                <SuitIcon suit={Suit.CLUBS} size={32} />
              </div>
              
              <h1 className="text-6xl sm:text-8xl font-black mb-4 tracking-tighter uppercase italic leading-none">
                Wendy 的<br />
                <span className="text-emerald-400">疯狂 8 点</span>
              </h1>
              
              <p className="text-emerald-200/60 max-w-md mx-auto mb-12 text-lg sm:text-xl font-medium">
                经典的策略与运气卡牌游戏。匹配花色或点数，利用万能 8 点，争当第一个清空手牌的人！
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => initGame()}
                  className="px-12 py-5 bg-white text-emerald-950 rounded-2xl font-black text-xl hover:bg-emerald-400 hover:scale-105 transition-all shadow-2xl shadow-emerald-500/20"
                >
                  开始游戏
                </button>
                
                <div className="group relative">
                  <button className="px-8 py-5 bg-emerald-900/50 border border-emerald-500/30 rounded-2xl font-bold text-lg hover:bg-emerald-800/50 transition-all flex items-center gap-2">
                    <Info size={20} />
                    如何游玩
                  </button>
                  
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-72 p-6 bg-zinc-900 border border-white/10 rounded-3xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all text-left">
                    <h3 className="font-bold text-lg mb-3 text-emerald-400">规则</h3>
                    <ul className="text-sm space-y-2 text-zinc-300">
                      <li>• 匹配顶牌的 <strong>花色</strong> 或 <strong>点数</strong>。</li>
                      <li>• <strong>8 是万能牌！</strong> 随时可以打出并改变花色。</li>
                      <li>• 如果无牌可出，必须 <strong>摸一张牌</strong>。</li>
                      <li>• 第一个 <strong>清空手牌</strong> 的玩家获胜！</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="absolute bottom-8 left-0 w-full flex justify-center gap-8 opacity-30 text-[10px] uppercase tracking-[0.3em] font-bold">
              <span>标准 52 张牌</span>
              <span>AI 对手</span>
              <span>响应式设计</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="p-4 flex justify-between items-center bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
            <span className="font-serif italic text-xl">W</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight uppercase">Wendy 的疯狂 8 点</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-widest opacity-50">当前花色</span>
            <div className="flex items-center gap-2">
              {state.currentSuit && <SuitIcon suit={state.currentSuit} size={16} />}
              <span className="font-mono text-sm">{state.currentSuit || '---'}</span>
            </div>
          </div>
          <button 
            onClick={() => initGame()}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            title="重新开始"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </header>

      {/* Game Board */}
      <main className="flex-grow relative flex flex-col items-center justify-between p-4 sm:p-8">
        
        {/* AI Hand */}
        <div className="w-full flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 opacity-60">
            <span className="text-xs uppercase tracking-widest">对手</span>
            <span className="bg-white/10 px-2 py-0.5 rounded text-xs font-mono">{state.aiHand.length} 张牌</span>
          </div>
          <div className="flex -space-x-12 sm:-space-x-20 justify-center">
            {state.aiHand.map((card, i) => (
              <motion.div
                key={card.id}
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card card={card} isFlipped={false} disabled className="scale-75 sm:scale-90" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Center Area: Deck & Discard */}
        <div className="flex items-center gap-8 sm:gap-16 my-8">
          {/* Draw Pile */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-white/5 rounded-2xl blur-sm group-hover:bg-white/10 transition-colors" />
            <div className="relative">
              <Card 
                card={{ id: 'deck', suit: Suit.SPADES, rank: Rank.ACE }} 
                isFlipped={false} 
                onClick={drawCard}
                disabled={state.turn !== 'PLAYER' || state.status !== 'PLAYING'}
                className={state.turn === 'PLAYER' && state.status === 'PLAYING' ? 'ring-2 ring-emerald-400 ring-offset-4 ring-offset-emerald-900' : ''}
              />
              {state.deck.length > 0 && (
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest opacity-50 whitespace-nowrap">
                  摸牌 ({state.deck.length})
                </div>
              )}
            </div>
          </div>

          {/* Discard Pile */}
          <div className="relative">
            <AnimatePresence mode="popLayout">
              {topDiscard && (
                <motion.div
                  key={topDiscard.id}
                  initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 1.2, opacity: 0 }}
                >
                  <Card card={topDiscard} disabled />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest opacity-50 whitespace-nowrap">
              弃牌堆
            </div>
          </div>
        </div>

        {/* Status Message */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4 w-64">
          <div className="bg-black/30 p-4 rounded-xl border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-2">
              <Info size={14} className="opacity-50" />
              <span className="text-[10px] uppercase tracking-widest opacity-50">日志</span>
            </div>
            <p className="text-sm font-medium leading-relaxed">{state.lastAction}</p>
          </div>
          <div className="bg-black/30 p-4 rounded-xl border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${state.turn === 'PLAYER' ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'}`} />
              <span className="text-[10px] uppercase tracking-widest opacity-50">状态</span>
            </div>
            <p className="text-sm font-bold">{state.turn === 'PLAYER' ? '你的回合' : 'AI 思考中...'}</p>
          </div>
        </div>

        {/* Player Hand */}
        <div className="w-full flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 opacity-60">
            <span className="text-xs uppercase tracking-widest">你的手牌</span>
            <span className="bg-white/10 px-2 py-0.5 rounded text-xs font-mono">{state.playerHand.length} 张牌</span>
          </div>
          <div className="flex -space-x-12 sm:-space-x-16 justify-center max-w-full overflow-x-auto pb-8 px-8 no-scrollbar">
            {state.playerHand.map((card, i) => {
              const playable = state.turn === 'PLAYER' && state.status === 'PLAYING' && (
                card.rank === Rank.EIGHT || 
                card.suit === state.currentSuit || 
                card.rank === topDiscard.rank
              );
              return (
                <motion.div
                  key={card.id}
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card 
                    card={card} 
                    onClick={() => playCard(card.id)}
                    disabled={!playable}
                    className={playable ? 'hover:z-10' : 'grayscale-[0.5] opacity-60'}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Mobile Status Bar */}
      <div className="lg:hidden p-3 bg-black/40 border-t border-white/10 flex justify-between items-center">
        <p className="text-xs font-medium truncate max-w-[70%]">{state.lastAction}</p>
        <div className="flex items-center gap-2">
          {state.currentSuit && <SuitIcon suit={state.currentSuit} size={14} />}
          <span className="text-xs font-mono">{state.currentSuit}</span>
        </div>
      </div>

      {/* Suit Selection Modal */}
      <AnimatePresence>
        {state.status === 'SUIT_SELECTION' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-zinc-900 border border-white/10 p-8 rounded-3xl max-w-md w-full text-center"
            >
              <h2 className="text-2xl font-bold mb-2">万能牌！</h2>
              <p className="text-zinc-400 mb-8">请选择一个新的花色以继续游戏。</p>
              <div className="grid grid-cols-2 gap-4">
                {[Suit.HEARTS, Suit.DIAMONDS, Suit.CLUBS, Suit.SPADES].map(suit => (
                  <button
                    key={suit}
                    onClick={() => selectSuit(suit)}
                    className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
                  >
                    <SuitIcon suit={suit} size={40} />
                    <span className="text-xs uppercase tracking-widest font-bold group-hover:text-emerald-400 transition-colors">
                      {suit === Suit.HEARTS ? '红心' : suit === Suit.DIAMONDS ? '方块' : suit === Suit.CLUBS ? '梅花' : '黑桃'}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Over Modal */}
      <AnimatePresence>
        {state.status === 'GAME_OVER' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-zinc-900 border border-white/20 p-12 rounded-[2.5rem] max-w-lg w-full text-center shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-indigo-500 to-emerald-500" />
              
              <div className="mb-8 flex justify-center">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center ${state.winner === 'PLAYER' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>
                  <Trophy size={48} />
                </div>
              </div>

              <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter">
                {state.winner === 'PLAYER' ? '胜利！' : '失败！'}
              </h2>
              <p className="text-zinc-400 mb-12 text-lg">
                {state.winner === 'PLAYER' 
                  ? '你打得非常出色，率先清空了手牌。' 
                  : 'AI 这次更胜一筹。下局好运！'}
              </p>

              <button
                onClick={() => initGame()}
                className="w-full py-5 rounded-2xl bg-white text-black font-bold text-lg hover:bg-emerald-400 transition-colors flex items-center justify-center gap-3"
              >
                <RotateCcw size={20} />
                再玩一局
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
