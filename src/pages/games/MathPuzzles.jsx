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
    puzzlePieces: [],
    placedPieces: {},
    draggedPiece: null,
    currentFeedback: '',
    isCorrect: null,
    score: 0,
    level: 1,
    streak: 0,
    gameStatus: 'menu', // menu, playing, complete
    difficulty: 'medium',
    operation: 'mixed',
    puzzlesCompleted: 0,
    totalPuzzles: 5
  });

  const generateNewPuzzle = () => {
    const operations = gameState.operation === 'mixed' 
      ? ['addition', 'subtraction', 'multiplication', 'division'] 
      : [gameState.operation];
    
    const selectedOperation = operations[Math.floor(Math.random() * operations.length)];
    const puzzle = generateMathProblem(selectedOperation, gameState.difficulty, user?.age || 8);

    // Create puzzle pieces
    const pieces = [
      { id: 'num1', value: puzzle.num1, type: 'number', placed: false },
      { id: 'operator', value: getOperatorSymbol(selectedOperation), type: 'operator', placed: false },
      { id: 'num2', value: puzzle.num2, type: 'number', placed: false },
      { id: 'equals', value: '=', type: 'operator', placed: false },
      { id: 'answer', value: puzzle.answer, type: 'answer', placed: false }
    ];

    // Shuffle pieces
    const shuffledPieces = [...pieces].sort(() => Math.random() - 0.5);

    setGameState(prev => ({
      ...prev,
      currentPuzzle: puzzle,
      puzzlePieces: shuffledPieces,
      placedPieces: {},
      currentFeedback: '',
      isCorrect: null
    }));
  };

  const getOperatorSymbol = (operation) => {
    switch (operation) {
      case 'addition': return '+';
      case 'subtraction': return '-';
      case 'multiplication': return '×';
      case 'division': return '÷';
      default: return '+';
    }
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
      totalPuzzles: 5
    }));
    startGame('math-puzzles', { difficulty, operation });
    generateNewPuzzle();
  };

  const handleDragStart = (piece) => {
    if (piece.placed) return;
    setGameState(prev => ({ ...prev, draggedPiece: piece }));
  };

  const handleDrop = (slotId) => {
    if (!gameState.draggedPiece) return;

    const newPlacedPieces = { ...gameState.placedPieces };
    const newPuzzlePieces = gameState.puzzlePieces.map(piece => {
      if (piece.id === gameState.draggedPiece.id) {
        return { ...piece, placed: true };
      }
      return piece;
    });

    newPlacedPieces[slotId] = gameState.draggedPiece;

    setGameState(prev => ({
      ...prev,
      placedPieces: newPlacedPieces,
      puzzlePieces: newPuzzlePieces,
      draggedPiece: null
    }));

    // Check if puzzle is complete
    if (Object.keys(newPlacedPieces).length === 5) {
      checkPuzzleComplete(newPlacedPieces);
    }
  };

  const checkPuzzleComplete = (placedPieces) => {
    const correctOrder = ['num1', 'operator', 'num2', 'equals', 'answer'];
    const isCorrect = correctOrder.every((expectedId, index) => {
      const slotId = `slot-${index}`;
      const placedPiece = placedPieces[slotId];
      return placedPiece && placedPiece.id === expectedId;
    });

    if (isCorrect) {
      playSound('correct');
      const newStreak = gameState.streak + 1;
      const points = 100 + (newStreak * 10);
      setGameState(prev => ({
        ...prev,
        isCorrect: true,
        currentFeedback: 'Perfect! Puzzle solved! 🎉',
        score: prev.score + points,
        streak: newStreak,
        puzzlesCompleted: prev.puzzlesCompleted + 1
      }));

      addCoins(15 + newStreak);
      addXP(25);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Check if game is complete
      setTimeout(() => {
        if (gameState.puzzlesCompleted + 1 >= gameState.totalPuzzles) {
          completeGame();
        } else {
          generateNewPuzzle();
        }
      }, 2000);
    } else {
      playSound('incorrect');
      setGameState(prev => ({
        ...prev,
        isCorrect: false,
        currentFeedback: 'Not quite right! Try rearranging the pieces.',
        streak: 0
      }));

      // Reset puzzle after delay
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          placedPieces: {},
          puzzlePieces: prev.puzzlePieces.map(piece => ({ ...piece, placed: false })),
          currentFeedback: '',
          isCorrect: null
        }));
      }, 2000);
    }
  };

  const completeGame = () => {
    setGameState(prev => ({ ...prev, gameStatus: 'complete' }));
    endGame(gameState.score, {
      puzzlesCompleted: gameState.puzzlesCompleted,
      difficulty: gameState.difficulty,
      operation: gameState.operation
    });
  };

  const getPieceColor = (type) => {
    switch (type) {
      case 'number': return 'bg-blue-400 text-white';
      case 'operator': return 'bg-red-400 text-white';
      case 'answer': return 'bg-green-400 text-white';
      default: return 'bg-gray-400 text-white';
    }
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
              animate={{ rotateX: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🧩
            </motion.div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Math Puzzle Challenge</h1>
            <p className="text-gray-600 mb-8">
              Drag and drop puzzle pieces to create correct math equations!
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
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Puzzle Master!</h1>
            <p className="text-gray-600 mb-8">
              Congratulations! You've completed all the math puzzles!
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
            </div>
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
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Drag the pieces to complete the equation! 🧩
          </h2>

          {/* Equation Slots */}
          <div className="flex justify-center items-center space-x-4 mb-8">
            {Array.from({ length: 5 }, (_, index) => (
              <motion.div
                key={index}
                className="w-20 h-20 border-4 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-2xl font-bold bg-gray-50"
                whileHover={{ scale: 1.05 }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(`slot-${index}`)}
              >
                {gameState.placedPieces[`slot-${index}`] ? (
                  <span className={`w-full h-full rounded-xl flex items-center justify-center ${getPieceColor(gameState.placedPieces[`slot-${index}`].type)}`}>
                    {gameState.placedPieces[`slot-${index}`].value}
                  </span>
                ) : (
                  <span className="text-gray-400">?</span>
                )}
              </motion.div>
            ))}
          </div>

          {/* Puzzle Pieces */}
          <div className="flex justify-center">
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
              {gameState.puzzlePieces.filter(piece => !piece.placed).map((piece, index) => (
                <motion.div
                  key={piece.id}
                  className={`w-16 h-16 rounded-xl flex items-center justify-center text-xl font-bold cursor-pointer select-none ${getPieceColor(piece.type)} shadow-lg`}
                  draggable={!piece.placed}
                  onDragStart={() => handleDragStart(piece)}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {piece.value}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {gameState.currentFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`mt-6 text-center p-4 rounded-xl ${
                  gameState.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
              >
                <div className="text-2xl font-bold mb-2">
                  {gameState.isCorrect ? '🎉' : '🤔'}
                </div>
                <div className="text-lg font-bold">{gameState.currentFeedback}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Instructions */}
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <div className="text-center text-sm text-gray-600">
            <div className="hidden md:block">💡 Drag pieces from the bottom to the equation slots above. Arrange them in the correct order!</div>
            <div className="md:hidden">💡 Drag pieces to complete the math equation!</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MathPuzzles;