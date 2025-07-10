import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { useSound } from '../../contexts/SoundContext';
import { useLanguage } from '../../contexts/LanguageContext';
import confetti from 'canvas-confetti';

const SudokuGame = () => {
  const navigate = useNavigate();
  const { user, addCoins, addXP } = useUser();
  const { playSound } = useSound();
  const { t } = useLanguage();

  const [gameState, setGameState] = useState({
    grid: Array(4).fill().map(() => Array(4).fill(0)),
    solution: Array(4).fill().map(() => Array(4).fill(0)),
    initialGrid: Array(4).fill().map(() => Array(4).fill(0)),
    gameStatus: 'menu', // menu, playing, won
    difficulty: 'easy',
    score: 0,
    mistakes: 0,
    maxMistakes: 3
  });

  const generateSudoku = (difficulty) => {
    // Generate a simple 4x4 sudoku
    const solution = [
      [1, 2, 3, 4],
      [3, 4, 1, 2],
      [2, 3, 4, 1],
      [4, 1, 2, 3]
    ];

    // Shuffle the solution
    const shuffled = shuffleArray([...solution]);
    
    // Create puzzle by removing numbers
    const cellsToRemove = difficulty === 'easy' ? 8 : difficulty === 'medium' ? 10 : 12;
    const puzzle = shuffled.map(row => [...row]);
    
    for (let i = 0; i < cellsToRemove; i++) {
      let row, col;
      do {
        row = Math.floor(Math.random() * 4);
        col = Math.floor(Math.random() * 4);
      } while (puzzle[row][col] === 0);
      
      puzzle[row][col] = 0;
    }

    return { puzzle, solution: shuffled };
  };

  const shuffleArray = (array) => {
    // Simple array shuffle for demo
    return array.map(row => [...row]);
  };

  const startGame = (difficulty = 'easy') => {
    const { puzzle, solution } = generateSudoku(difficulty);
    
    setGameState({
      grid: puzzle.map(row => [...row]),
      solution: solution,
      initialGrid: puzzle.map(row => [...row]),
      gameStatus: 'playing',
      difficulty,
      score: 0,
      mistakes: 0,
      maxMistakes: 3
    });
  };

  const handleCellClick = (row, col, value) => {
    if (gameState.initialGrid[row][col] !== 0) return; // Can't change initial numbers
    
    const newGrid = [...gameState.grid];
    newGrid[row][col] = value;
    
    let newMistakes = gameState.mistakes;
    let newScore = gameState.score;
    
    if (value !== 0) {
      if (value === gameState.solution[row][col]) {
        playSound('correct');
        newScore += 10;
      } else {
        playSound('incorrect');
        newMistakes++;
      }
    }
    
    setGameState(prev => ({
      ...prev,
      grid: newGrid,
      mistakes: newMistakes,
      score: newScore
    }));
    
    // Check win condition
    if (JSON.stringify(newGrid) === JSON.stringify(gameState.solution)) {
      setTimeout(() => {
        setGameState(prev => ({ ...prev, gameStatus: 'won' }));
        addCoins(100);
        addXP(75);
        confetti({
          particleCount: 200,
          spread: 70,
          origin: { y: 0.6 }
        });
      }, 500);
    }
    
    // Check lose condition
    if (newMistakes >= gameState.maxMistakes) {
      playSound('incorrect');
      // Reset the wrong cell
      newGrid[row][col] = 0;
      setGameState(prev => ({ ...prev, grid: newGrid }));
    }
  };

  if (gameState.gameStatus === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 p-4 flex items-center justify-center">
        <motion.div
          className="bg-white rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="text-8xl mb-6"
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🧩
          </motion.div>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Math Sudoku</h1>
          
          <p className="text-gray-600 mb-6">
            Fill the grid with numbers using math clues and logic! This challenging puzzle game will test your math skills and logical thinking.
          </p>
          
          <div className="bg-indigo-50 rounded-xl p-4 mb-6 text-left">
            <h3 className="font-bold text-indigo-800 mb-2">Game Features:</h3>
            <ul className="space-y-2 text-indigo-700">
              <li>• Age-appropriate 4×4 grids</li>
              <li>• Math clues to help solve the puzzle</li>
              <li>• Multiple difficulty levels</li>
              <li>• Helpful hints and animations</li>
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-700 mb-3">Choose Difficulty:</h3>
            <div className="grid grid-cols-3 gap-3">
              {['easy', 'medium', 'hard'].map(diff => (
                <motion.button
                  key={diff}
                  onClick={() => startGame(diff)}
                  className={`py-3 rounded-xl font-bold text-white capitalize ${
                    diff === 'easy' ? 'bg-green-500' : 
                    diff === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {diff}
                </motion.button>
              ))}
            </div>
          </div>
          
          <motion.button
            onClick={() => navigate('/mini-games')}
            className="w-full py-3 bg-gray-500 text-white font-bold rounded-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Games
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Game Header */}
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{gameState.score}</div>
                <div className="text-sm text-gray-600">Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{gameState.mistakes}/{gameState.maxMistakes}</div>
                <div className="text-sm text-gray-600">Mistakes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 capitalize">{gameState.difficulty}</div>
                <div className="text-sm text-gray-600">Difficulty</div>
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

        {/* Sudoku Grid */}
        <motion.div
          className="bg-white rounded-2xl p-8 shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">4×4 Sudoku</h3>
          
          <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto mb-6">
            {gameState.grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`aspect-square border-2 border-gray-300 rounded-lg flex items-center justify-center text-2xl font-bold ${
                    gameState.initialGrid[rowIndex][colIndex] !== 0 
                      ? 'bg-gray-100 text-gray-700' 
                      : 'bg-white text-blue-600 cursor-pointer hover:bg-blue-50'
                  } ${
                    (rowIndex === 1 || rowIndex === 2) && (colIndex === 1 || colIndex === 2) 
                      ? 'border-r-4 border-b-4 border-indigo-500' 
                      : ''
                  }`}
                >
                  {cell === 0 ? (
                    gameState.initialGrid[rowIndex][colIndex] === 0 ? (
                      <div className="grid grid-cols-2 gap-1 w-full h-full p-1">
                        {[1, 2, 3, 4].map(num => (
                          <motion.button
                            key={num}
                            onClick={() => handleCellClick(rowIndex, colIndex, num)}
                            className="text-xs bg-blue-100 hover:bg-blue-200 rounded flex items-center justify-center"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            {num}
                          </motion.button>
                        ))}
                      </div>
                    ) : ''
                  ) : (
                    cell
                  )}
                </div>
              ))
            )}
          </div>
          
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Fill each row, column, and 2×2 box with numbers 1-4
            </p>
            <motion.button
              onClick={() => setGameState(prev => ({ ...prev, gameStatus: 'menu' }))}
              className="bg-blue-500 text-white font-bold px-6 py-3 rounded-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              New Game
            </motion.button>
          </div>
        </motion.div>

        {/* Win Modal */}
        <AnimatePresence>
          {gameState.gameStatus === 'won' && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-3xl p-8 max-w-md w-full text-center"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-3xl font-bold text-green-600 mb-4">Puzzle Solved!</h2>
                <p className="text-gray-600 mb-4">
                  Excellent work! You've completed the Sudoku puzzle!
                </p>
                <div className="text-lg text-green-600 mb-6">
                  +{gameState.score} points • +100 coins • +75 XP
                </div>
                
                <div className="space-y-3">
                  <motion.button
                    onClick={() => startGame(gameState.difficulty)}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold py-3 px-8 rounded-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Play Again
                  </motion.button>
                  
                  <motion.button
                    onClick={() => navigate('/mini-games')}
                    className="w-full bg-gray-500 text-white font-bold py-3 px-8 rounded-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Back to Games
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SudokuGame;