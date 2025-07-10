import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../contexts/GameContext';
import { useUser } from '../../contexts/UserContext';
import { useSound } from '../../contexts/SoundContext';
import confetti from 'canvas-confetti';

const MemoryGame = () => {
  const navigate = useNavigate();
  const { generateMathProblem, startGame, endGame } = useGame();
  const { user, addCoins, addXP } = useUser();
  const { playSound } = useSound();
  
  const [gameState, setGameState] = useState({
    cards: [],
    flippedIndices: [],
    matchedPairs: [],
    moves: 0,
    gameStatus: 'menu', // menu, playing, complete
    difficulty: 'easy',
    score: 0,
    startTime: null,
    elapsedTime: 0
  });

  // Timer
  useEffect(() => {
    let timer;
    if (gameState.gameStatus === 'playing' && gameState.startTime) {
      timer = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          elapsedTime: Math.floor((Date.now() - prev.startTime) / 1000)
        }));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState.gameStatus, gameState.startTime]);

  const generateCards = (difficulty) => {
    const pairCount = difficulty === 'easy' ? 6 : difficulty === 'medium' ? 8 : 10;
    const problems = [];
    const answers = [];
    
    // Generate math problems and answers
    for (let i = 0; i < pairCount; i++) {
      const problem = generateMathProblem(
        ['addition', 'subtraction', 'multiplication'][Math.floor(Math.random() * 3)],
        difficulty,
        user?.age || 8
      );
      
      problems.push({
        id: i,
        type: 'problem',
        content: problem.question,
        pairId: i,
        matched: false
      });
      
      answers.push({
        id: i + pairCount,
        type: 'answer',
        content: problem.answer.toString(),
        pairId: i,
        matched: false
      });
    }
    
    // Combine and shuffle
    return [...problems, ...answers].sort(() => Math.random() - 0.5);
  };

  const startNewGame = (difficulty = 'easy') => {
    const cards = generateCards(difficulty);
    setGameState({
      cards,
      flippedIndices: [],
      matchedPairs: [],
      moves: 0,
      gameStatus: 'playing',
      difficulty,
      score: 0,
      startTime: Date.now(),
      elapsedTime: 0
    });
    
    startGame('memory', { difficulty });
  };

  const handleCardClick = (index) => {
    const { cards, flippedIndices, matchedPairs } = gameState;
    
    // Prevent clicking same card or if two cards are already flipped
    if (
      flippedIndices.includes(index) || 
      matchedPairs.includes(cards[index].pairId) ||
      flippedIndices.length >= 2
    ) {
      return;
    }
    
    // Flip the card
    playSound('click');
    
    const newFlippedIndices = [...flippedIndices, index];
    setGameState(prev => ({
      ...prev,
      flippedIndices: newFlippedIndices
    }));
    
    // Check if we have a pair
    if (newFlippedIndices.length === 2) {
      const [firstIndex, secondIndex] = newFlippedIndices;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];
      
      // Increment moves
      const newMoves = gameState.moves + 1;
      
      // Check if cards match
      if (firstCard.pairId === secondCard.pairId) {
        // Match!
        playSound('correct');
        const newMatchedPairs = [...matchedPairs, firstCard.pairId];
        const bonus = calculateBonus(gameState.difficulty);
        const newScore = gameState.score + bonus;
        
        // Small confetti burst for each match
        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.6 }
        });
        
        setGameState(prev => ({
          ...prev,
          flippedIndices: [],
          matchedPairs: newMatchedPairs,
          moves: newMoves,
          score: newScore
        }));
        
        // Check if game is complete
        if (newMatchedPairs.length === cards.length / 2) {
          gameComplete(newScore, newMoves);
        }
      } else {
        // No match, flip cards back after a delay
        playSound('incorrect');
        setTimeout(() => {
          setGameState(prev => ({
            ...prev,
            flippedIndices: [],
            moves: newMoves
          }));
        }, 1000);
      }
    }
  };

  const calculateBonus = (difficulty) => {
    const basePoints = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20;
    return basePoints;
  };

  const gameComplete = (finalScore, moves) => {
    // Calculate time bonus
    const timeBonus = Math.max(0, 500 - gameState.elapsedTime * 2);
    const movesBonus = Math.max(0, 300 - moves * 5);
    const totalScore = finalScore + timeBonus + movesBonus;
    
    playSound('achievement');
    
    // Big confetti celebration
    confetti({
      particleCount: 200,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    setGameState(prev => ({
      ...prev,
      gameStatus: 'complete',
      score: totalScore
    }));
    
    // Add rewards
    addCoins(Math.floor(totalScore / 10));
    addXP(Math.floor(totalScore / 5));
    
    // Record game stats
    endGame(totalScore, {
      moves,
      time: gameState.elapsedTime,
      difficulty: gameState.difficulty
    });
  };

  const getCardBackgroundColor = (card, isFlipped, isMatched) => {
    if (!isFlipped && !isMatched) return 'bg-blue-500';
    
    if (card.type === 'problem') {
      return isMatched ? 'bg-green-400' : 'bg-purple-500';
    } else {
      return isMatched ? 'bg-green-400' : 'bg-yellow-500';
    }
  };

  // Menu Screen
  if (gameState.gameStatus === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-blue-600 p-6 flex items-center justify-center">
        <motion.div
          className="bg-white rounded-3xl p-8 max-w-md w-full"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <motion.div
              className="text-8xl mb-6 mx-auto"
              animate={{ rotateY: [0, 180, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            >
              🃏
            </motion.div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Memory Match</h1>
            <p className="text-gray-600 mb-8">
              Match math problems with their answers to win! Test your memory and math skills.
            </p>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-700 mb-4">Select Difficulty</h2>
                <div className="grid grid-cols-3 gap-4">
                  {['easy', 'medium', 'hard'].map(difficulty => (
                    <motion.button
                      key={difficulty}
                      className={`py-3 rounded-xl font-bold text-white capitalize ${
                        difficulty === 'easy' 
                          ? 'bg-green-500' 
                          : difficulty === 'medium' 
                            ? 'bg-yellow-500' 
                            : 'bg-red-500'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => startNewGame(difficulty)}
                    >
                      {difficulty}
                    </motion.button>
                  ))}
                </div>
              </div>
              
              <motion.button
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => startNewGame('easy')}
              >
                Start Game
              </motion.button>
              
              <motion.button
                className="w-full py-3 bg-gray-500 text-white font-bold rounded-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/mini-games')}
              >
                Back to Games
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Game Complete Screen
  if (gameState.gameStatus === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-blue-600 p-6 flex items-center justify-center">
        <motion.div
          className="bg-white rounded-3xl p-8 max-w-md w-full"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <motion.div
              className="text-8xl mb-6 mx-auto"
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🏆
            </motion.div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Game Complete!</h1>
            <p className="text-gray-600 mb-8">
              Congratulations! You've matched all the pairs!
            </p>
            
            <div className="bg-blue-50 rounded-2xl p-6 mb-8">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600">{gameState.score}</div>
                  <div className="text-sm text-gray-600">Final Score</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600">{gameState.moves}</div>
                  <div className="text-sm text-gray-600">Moves</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600">{gameState.elapsedTime}s</div>
                  <div className="text-sm text-gray-600">Time</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-600">+{Math.floor(gameState.score / 10)}</div>
                  <div className="text-sm text-gray-600">Coins Earned</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <motion.button
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => startNewGame(gameState.difficulty)}
              >
                Play Again
              </motion.button>
              
              <motion.button
                className="w-full py-3 bg-gray-500 text-white font-bold rounded-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/mini-games')}
              >
                Back to Games
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Game Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-blue-600 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Game Stats */}
        <div className="bg-white rounded-2xl p-4 mb-6 shadow-lg">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{gameState.score}</div>
                <div className="text-sm text-gray-600">Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{gameState.moves}</div>
                <div className="text-sm text-gray-600">Moves</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{gameState.elapsedTime}s</div>
                <div className="text-sm text-gray-600">Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold capitalize text-green-600">{gameState.difficulty}</div>
                <div className="text-sm text-gray-600">Difficulty</div>
              </div>
            </div>
            
            <div className="flex space-x-2 mt-2 md:mt-0">
              <motion.button
                onClick={() => navigate('/mini-games')}
                className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Exit
              </motion.button>
            </div>
          </div>
        </div>

        {/* Game Board */}
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg">
          <div className={`grid grid-cols-4 ${gameState.difficulty === 'hard' ? 'md:grid-cols-5' : 'md:grid-cols-4'} gap-3 md:gap-6`}>
            {gameState.cards.map((card, index) => {
              const isFlipped = gameState.flippedIndices.includes(index);
              const isMatched = gameState.matchedPairs.includes(card.pairId);
              
              return (
                <motion.div
                  key={index}
                  className={`aspect-square rounded-xl cursor-pointer shadow-md overflow-hidden ${
                    getCardBackgroundColor(card, isFlipped, isMatched)
                  }`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    rotateY: isFlipped || isMatched ? 180 : 0
                  }}
                  transition={{ 
                    duration: 0.3,
                    delay: index * 0.05,
                    type: "spring"
                  }}
                  whileHover={{ scale: isMatched ? 1 : 1.05 }}
                  whileTap={{ scale: isMatched ? 1 : 0.95 }}
                  onClick={() => handleCardClick(index)}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    {(isFlipped || isMatched) ? (
                      <div 
                        className="text-white font-bold text-center p-2 w-full h-full flex items-center justify-center"
                        style={{ transform: 'rotateY(180deg)' }}
                      >
                        <span className={`text-lg md:text-xl ${card.type === 'problem' ? 'font-mono' : ''}`}>
                          {card.content}
                        </span>
                      </div>
                    ) : (
                      <div className="text-3xl text-white">?</div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryGame;