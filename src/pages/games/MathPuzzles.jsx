import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../contexts/GameContext';
import { useUser } from '../../contexts/UserContext';
import { useSound } from '../../contexts/SoundContext';
import confetti from 'canvas-confetti';

const MathPuzzles = () => {
  const navigate = useNavigate();
  const { generateMathProblem, startGame, endGame } = useGame();
  const { user, addCoins, addXP } = useUser();
  const { playSound } = useSound();

  const [gameState, setGameState] = useState({
    currentPuzzle: null,
    userAnswer: '',
    feedback: '',
    isCorrect: null,
    score: 0,
    level: 1,
    streak: 0,
    timeLeft: 30,
    gameStatus: 'menu', // menu, playing, paused, complete
    difficulty: 'medium',
    operation: 'mixed',
    puzzlesCompleted: 0,
    totalPuzzles: 10
  });

  // Timer effect
  useEffect(() => {
    if (gameState.gameStatus === 'playing' && gameState.timeLeft > 0) {
      const timer = setTimeout(() => {
        setGameState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameState.timeLeft === 0 && gameState.gameStatus === 'playing') {
      handleTimeUp();
    }
  }, [gameState.timeLeft, gameState.gameStatus]);

  const generateNewPuzzle = () => {
    const operations = gameState.operation === 'mixed' 
      ? ['addition', 'subtraction', 'multiplication', 'division']
      : [gameState.operation];
    
    const selectedOperation = operations[Math.floor(Math.random() * operations.length)];
    const puzzle = generateMathProblem(selectedOperation, gameState.difficulty, user?.age || 8);
    
    setGameState(prev => ({
      ...prev,
      currentPuzzle: puzzle,
      userAnswer: '',
      feedback: '',
      isCorrect: null,
      timeLeft: 30 + (gameState.difficulty === 'easy' ? 10 : gameState.difficulty === 'hard' ? -10 : 0)
    }));
  };

  const startNewGame = (difficulty = 'medium', operation = 'mixed') => {
    setGameState(prev => ({
      ...prev,
      gameStatus: 'playing',
      difficulty,
      operation,
      score: 0,
      level: 1,
      streak: 0,
      puzzlesCompleted: 0,
      totalPuzzles: 10
    }));
    
    startGame('math-puzzles', { difficulty, operation });
    generateNewPuzzle();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!gameState.userAnswer.trim()) return;

    const userAnswerNum = parseInt(gameState.userAnswer);
    const isCorrect = userAnswerNum === gameState.currentPuzzle.answer;

    if (isCorrect) {
      playSound('correct');
      const newStreak = gameState.streak + 1;
      const points = 100 + (newStreak * 10) + (gameState.timeLeft * 2);
      
      setGameState(prev => ({
        ...prev,
        isCorrect: true,
        feedback: 'Correct! Well done! 🎉',
        score: prev.score + points,
        streak: newStreak,
        puzzlesCompleted: prev.puzzlesCompleted + 1
      }));

      // Reward coins and XP
      addCoins(10 + newStreak);
      addXP(20);

      // Confetti effect
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

    } else {
      playSound('incorrect');
      setGameState(prev => ({
        ...prev,
        isCorrect: false,
        feedback: `Incorrect. The answer was ${gameState.currentPuzzle.answer}`,
        streak: 0
      }));
    }

    // Check if game is complete
    setTimeout(() => {
      if (gameState.puzzlesCompleted + 1 >= gameState.totalPuzzles) {
        completeGame();
      } else {
        generateNewPuzzle();
      }
    }, 2000);
  };

  const handleTimeUp = () => {
    playSound('incorrect');
    setGameState(prev => ({
      ...prev,
      isCorrect: false,
      feedback: `Time's up! The answer was ${gameState.currentPuzzle.answer}`,
      streak: 0
    }));

    setTimeout(() => {
      if (gameState.puzzlesCompleted >= gameState.totalPuzzles) {
        completeGame();
      } else {
        generateNewPuzzle();
      }
    }, 2000);
  };

  const completeGame = () => {
    setGameState(prev => ({ ...prev, gameStatus: 'complete' }));
    endGame(gameState.score, {
      puzzlesCompleted: gameState.puzzlesCompleted,
      difficulty: gameState.difficulty,
      operation: gameState.operation
    });
  };

  // Menu Screen
  if (gameState.gameStatus === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 p-6 flex items-center justify-center">
        <motion.div
          className="bg-white rounded-3xl p-8 max-w-md w-full"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <motion.div
              className="text-8xl mb-6 mx-auto"
              animate={{ rotateY: [0, 180, 360] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🧩
            </motion.div>
            
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Math Puzzles</h1>
            <p className="text-gray-600 mb-8">
              Solve challenging math problems against the clock! Test your skills and improve your speed.
            </p>

            {/* Difficulty Selection */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-700 mb-4">Select Difficulty</h2>
              <div className="grid grid-cols-3 gap-3">
                {['easy', 'medium', 'hard'].map(difficulty => (
                  <motion.button
                    key={difficulty}
                    className={`py-3 rounded-xl font-bold text-white capitalize ${
                      difficulty === 'easy' ? 'bg-green-500' : 
                      difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setGameState(prev => ({ ...prev, difficulty }));
                    }}
                  >
                    {difficulty}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Operation Selection */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-700 mb-4">Select Operation</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'mixed', label: 'Mixed', icon: '🎯' },
                  { key: 'addition', label: 'Addition', icon: '➕' },
                  { key: 'subtraction', label: 'Subtraction', icon: '➖' },
                  { key: 'multiplication', label: 'Multiplication', icon: '✖️' }
                ].map(op => (
                  <motion.button
                    key={op.key}
                    className={`py-3 rounded-xl font-bold text-white ${
                      gameState.operation === op.key ? 'bg-blue-600' : 'bg-blue-400'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setGameState(prev => ({ ...prev, operation: op.key }));
                    }}
                  >
                    <div>{op.icon}</div>
                    <div className="text-sm">{op.label}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            <motion.button
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => startNewGame(gameState.difficulty, gameState.operation)}
            >
              🚀 Start Puzzle Challenge
            </motion.button>

            <motion.button
              className="w-full mt-4 py-3 bg-gray-500 text-white font-bold rounded-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/mini-games')}
            >
              Back to Games
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Game Complete Screen
  if (gameState.gameStatus === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 p-6 flex items-center justify-center">
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
            
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Puzzle Complete!</h1>
            <p className="text-gray-600 mb-8">
              Great job! You've completed all the math puzzles!
            </p>

            <div className="bg-blue-50 rounded-2xl p-6 mb-8">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600">{gameState.score}</div>
                  <div className="text-sm text-gray-600">Final Score</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600">{gameState.puzzlesCompleted}</div>
                  <div className="text-sm text-gray-600">Puzzles Solved</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600">{gameState.streak}</div>
                  <div className="text-sm text-gray-600">Best Streak</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-600">+{Math.floor(gameState.score / 10)}</div>
                  <div className="text-sm text-gray-600">Coins Earned</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <motion.button
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => startNewGame(gameState.difficulty, gameState.operation)}
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Game Header */}
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{gameState.score}</div>
                <div className="text-sm text-gray-600">Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{gameState.puzzlesCompleted}/{gameState.totalPuzzles}</div>
                <div className="text-sm text-gray-600">Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{gameState.streak}</div>
                <div className="text-sm text-gray-600">Streak</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${gameState.timeLeft <= 5 ? 'text-red-500' : 'text-purple-600'}`}>{gameState.timeLeft}s</div>
                <div className="text-sm text-gray-600">Time</div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <motion.button
                onClick={() => setGameState(prev => ({ ...prev, gameStatus: 'paused' }))}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-bold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ⏸️ Pause
              </motion.button>
              
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

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <div className="flex justify-between text-sm mb-2">
            <span>Progress</span>
            <span>{gameState.puzzlesCompleted}/{gameState.totalPuzzles} puzzles</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <motion.div
              className="h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(gameState.puzzlesCompleted / gameState.totalPuzzles) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Main Puzzle Area */}
        <motion.div
          className="bg-white rounded-3xl p-8 shadow-lg"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {gameState.currentPuzzle && (
            <AnimatePresence mode="wait">
              {gameState.isCorrect === null ? (
                <motion.div
                  key="puzzle"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center"
                >
                  <div className="mb-8">
                    <div className="text-6xl font-bold text-gray-800 mb-4 font-mono">
                      {gameState.currentPuzzle.question} = ?
                    </div>
                    
                    {/* Visual aids for younger kids */}
                    {user?.age <= 8 && gameState.currentPuzzle.operation === 'addition' && 
                     gameState.currentPuzzle.num1 <= 10 && gameState.currentPuzzle.num2 <= 10 && (
                      <div className="flex justify-center items-center space-x-4 mb-6">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {Array.from({ length: gameState.currentPuzzle.num1 }, (_, i) => (
                            <motion.span
                              key={i}
                              className="text-2xl"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: i * 0.1 }}
                            >
                              🟦
                            </motion.span>
                          ))}
                        </div>
                        <span className="text-3xl font-bold text-gray-600">+</span>
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {Array.from({ length: gameState.currentPuzzle.num2 }, (_, i) => (
                            <motion.span
                              key={i}
                              className="text-2xl"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: (gameState.currentPuzzle.num1 + i) * 0.1 }}
                            >
                              🟨
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <input
                      type="number"
                      value={gameState.userAnswer}
                      onChange={(e) => setGameState(prev => ({ ...prev, userAnswer: e.target.value }))}
                      className="w-full text-center text-3xl font-bold py-4 px-6 rounded-xl border-2 border-blue-300 focus:border-blue-500 focus:outline-none transition-colors"
                      placeholder="Your answer"
                      autoFocus
                    />
                    
                    <motion.button
                      type="submit"
                      className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={!gameState.userAnswer.trim()}
                    >
                      Submit Answer
                    </motion.button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="feedback"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center"
                >
                  <motion.div
                    className={`text-4xl font-bold mb-4 ${
                      gameState.isCorrect ? 'text-green-600' : 'text-red-600'
                    }`}
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: gameState.isCorrect ? [0, 10, -10, 0] : [0, -5, 5, 0]
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {gameState.isCorrect ? '🎉' : '😅'}
                  </motion.div>
                  
                  <div className="text-2xl font-bold mb-4 text-gray-800">
                    {gameState.feedback}
                  </div>
                  
                  {gameState.isCorrect && (
                    <div className="text-lg text-green-600 mb-4">
                      +{100 + (gameState.streak * 10)} points • +{10 + gameState.streak} coins
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MathPuzzles;