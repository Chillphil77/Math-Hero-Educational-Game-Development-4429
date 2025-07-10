import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../contexts/GameContext';
import { useUser } from '../../contexts/UserContext';
import { useSound } from '../../contexts/SoundContext';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

const PacManMath = () => {
  const { generateMathProblem, startGame, endGame } = useGame();
  const { user, addCoins, addXP } = useUser();
  const { playSound } = useSound();
  const navigate = useNavigate();

  const [gameState, setGameState] = useState({
    pacman: { x: 1, y: 1, direction: 'right' },
    score: 0,
    lives: 3,
    level: 1,
    gameStatus: 'menu', // menu, playing, paused, gameOver
    currentProblem: null,
    correctAnswer: null,
    wrongAnswers: [],
    timeLeft: 60,
    dotsEaten: 0,
    totalDots: 0,
    maze: []
  });

  // Simplified 15x15 maze (1=wall, 0=path, 2=dot, 3=answer)
  const baseMaze = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,1,2,2,2,2,2,2,1],
    [1,2,1,1,2,1,2,1,2,1,2,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,2,1,1,1,2,1,1,1,2,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,1,1,2,1,2,2,2,2,2,1,2,1,1,1],
    [0,0,0,2,1,2,1,0,1,2,1,2,0,0,0],
    [1,1,1,2,1,2,1,1,1,2,1,2,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,2,1,1,1,2,1,1,1,2,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,2,1,2,1,2,1,2,1,1,2,1],
    [1,2,2,2,2,2,2,1,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ];

  // Initialize game
  useEffect(() => {
    if (gameState.gameStatus === 'playing' && !gameState.currentProblem) {
      initializeLevel();
    }
  }, [gameState.gameStatus]);

  // Timer
  useEffect(() => {
    if (gameState.gameStatus === 'playing' && gameState.timeLeft > 0) {
      const timer = setTimeout(() => {
        setGameState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameState.timeLeft === 0) {
      gameOver();
    }
  }, [gameState.timeLeft, gameState.gameStatus]);

  const initializeLevel = () => {
    const problem = generateMathProblem('addition', 'medium', user?.age || 8);
    const correctAnswer = problem.answer;

    // Generate wrong answers
    const wrongAnswers = [];
    for (let i = 0; i < 3; i++) {
      let wrong;
      do {
        const variance = Math.max(5, Math.floor(correctAnswer * 0.3));
        wrong = correctAnswer + Math.floor(Math.random() * variance * 2) - variance;
      } while (wrong === correctAnswer || wrong <= 0 || wrongAnswers.includes(wrong));
      wrongAnswers.push(wrong);
    }

    // Create maze with answers at RANDOM positions
    const newMaze = baseMaze.map(row => [...row]);
    
    // Find all empty cells where we can place answers
    const emptyCells = [];
    for (let y = 0; y < newMaze.length; y++) {
      for (let x = 0; x < newMaze[y].length; x++) {
        if (newMaze[y][x] === 2) { // dot positions
          emptyCells.push({ x, y });
        }
      }
    }

    // Randomly select 4 positions for answers
    const selectedPositions = [];
    const allAnswers = [correctAnswer, ...wrongAnswers];
    
    for (let i = 0; i < Math.min(4, allAnswers.length); i++) {
      if (emptyCells.length === 0) break;
      
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const position = emptyCells.splice(randomIndex, 1)[0];
      selectedPositions.push(position);
      
      newMaze[position.y][position.x] = {
        type: 'answer',
        value: allAnswers[i],
        isCorrect: allAnswers[i] === correctAnswer
      };
    }

    // Count total dots
    const totalDots = newMaze.flat().filter(cell => cell === 2).length;

    setGameState(prev => ({
      ...prev,
      maze: newMaze,
      currentProblem: problem,
      correctAnswer,
      wrongAnswers,
      totalDots,
      dotsEaten: 0
    }));
  };

  const startNewGame = () => {
    setGameState({
      pacman: { x: 1, y: 1, direction: 'right' },
      score: 0,
      lives: 3,
      level: 1,
      gameStatus: 'playing',
      currentProblem: null,
      correctAnswer: null,
      wrongAnswers: [],
      timeLeft: 60,
      dotsEaten: 0,
      totalDots: 0,
      maze: []
    });
    startGame('pacman', { difficulty: 'medium' });
  };

  const movePacman = (direction) => {
    if (gameState.gameStatus !== 'playing') return;

    setGameState(prev => {
      const { pacman, maze } = prev;
      let newX = pacman.x;
      let newY = pacman.y;

      switch (direction) {
        case 'up': newY--; break;
        case 'down': newY++; break;
        case 'left': newX--; break;
        case 'right': newX++; break;
      }

      // Check boundaries and walls
      if (newY < 0 || newY >= maze.length || newX < 0 || newX >= maze[0].length || maze[newY][newX] === 1) {
        return prev;
      }

      // Check what's at the new position
      const cell = maze[newY][newX];
      let newScore = prev.score;
      let newDotsEaten = prev.dotsEaten;
      let newMaze = [...maze];

      if (cell === 2) {
        // Eat dot
        newScore += 10;
        newDotsEaten++;
        newMaze[newY][newX] = 0;
        playSound('coin');
      } else if (cell && cell.type === 'answer') {
        // Hit an answer
        handleAnswerHit(cell);
        newMaze[newY][newX] = 0;
      }

      return {
        ...prev,
        pacman: { x: newX, y: newY, direction },
        score: newScore,
        dotsEaten: newDotsEaten,
        maze: newMaze
      };
    });
  };

  const handleAnswerHit = (answerCell) => {
    if (answerCell.isCorrect) {
      playSound('correct');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setGameState(prev => ({
        ...prev,
        score: prev.score + 100,
        level: prev.level + 1
      }));

      addCoins(20);
      addXP(30);

      // Generate next level after delay
      setTimeout(() => {
        initializeLevel();
        setGameState(prev => ({ ...prev, timeLeft: 60 }));
      }, 1000);
    } else {
      playSound('incorrect');
      setGameState(prev => ({ ...prev, lives: prev.lives - 1 }));

      if (gameState.lives <= 1) {
        gameOver();
      }
    }
  };

  const gameOver = () => {
    setGameState(prev => ({ ...prev, gameStatus: 'gameOver' }));
    endGame(gameState.score, {
      level: gameState.level,
      dotsEaten: gameState.dotsEaten
    });
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowUp': movePacman('up'); break;
        case 'ArrowDown': movePacman('down'); break;
        case 'ArrowLeft': movePacman('left'); break;
        case 'ArrowRight': movePacman('right'); break;
        case ' ':
          e.preventDefault();
          if (gameState.gameStatus === 'playing') {
            setGameState(prev => ({ ...prev, gameStatus: 'paused' }));
          } else if (gameState.gameStatus === 'paused') {
            setGameState(prev => ({ ...prev, gameStatus: 'playing' }));
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.gameStatus]);

  // Touch controls for mobile
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (e) => {
    if (!touchStart.x || !touchStart.y) return;

    const touch = e.changedTouches[0];
    const xDiff = touchStart.x - touch.clientX;
    const yDiff = touchStart.y - touch.clientY;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if (xDiff > 0) {
        movePacman('left');
      } else {
        movePacman('right');
      }
    } else {
      if (yDiff > 0) {
        movePacman('up');
      } else {
        movePacman('down');
      }
    }

    setTouchStart({ x: 0, y: 0 });
  };

  const renderCell = (cell, x, y) => {
    const { pacman } = gameState;

    // Pac-Man position
    if (pacman.x === x && pacman.y === y) {
      return (
        <motion.div
          className="w-full h-full bg-yellow-400 rounded-full flex items-center justify-center text-lg"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          {pacman.direction === 'right' && '▶️'}
          {pacman.direction === 'left' && '◀️'}
          {pacman.direction === 'up' && '🔼'}
          {pacman.direction === 'down' && '🔽'}
        </motion.div>
      );
    }

    // Render maze elements
    if (cell === 1) {
      return <div className="w-full h-full bg-blue-800 rounded-sm"></div>;
    } else if (cell === 2) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
        </div>
      );
    } else if (cell && cell.type === 'answer') {
      return (
        <motion.div
          className="w-full h-full rounded-lg flex items-center justify-center text-xs font-bold bg-white text-blue-600 border-2 border-blue-400"
          animate={{ pulse: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          {cell.value}
        </motion.div>
      );
    }

    return <div className="w-full h-full bg-black"></div>;
  };

  if (gameState.gameStatus === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black flex items-center justify-center p-4">
        <motion.div
          className="bg-white rounded-3xl p-8 max-w-md w-full text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <motion.div
            className="text-8xl mb-6"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            🟡
          </motion.div>

          <h1 className="text-4xl font-bold text-gray-800 mb-4">Pac-Man Math</h1>
          <p className="text-gray-600 mb-6">
            Navigate Pac-Man through the maze and collect the correct answers!
          </p>

          <div className="space-y-4 text-left text-sm text-gray-600 mb-6">
            <div>🎯 Solve: Math problems appear on screen</div>
            <div>🕹️ Use arrow keys or swipe to move</div>
            <div>✅ Collect correct answers for points</div>
            <div>❌ Avoid wrong answers or lose lives</div>
            <div>⏸️ Press SPACE to pause</div>
          </div>

          <motion.button
            onClick={startNewGame}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-4 px-8 rounded-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Game
          </motion.button>

          <motion.button
            onClick={() => navigate('/mini-games')}
            className="w-full mt-4 bg-gray-500 text-white font-bold py-3 px-8 rounded-xl"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black p-4">
      <div className="max-w-4xl mx-auto">
        {/* Game UI */}
        <div className="bg-white rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{gameState.score}</div>
                <div className="text-sm text-gray-600">Score</div>
              </div>
              <div className="text-center">
                <div className="flex space-x-1">
                  {Array.from({ length: gameState.lives }, (_, i) => (
                    <span key={i} className="text-xl">💛</span>
                  ))}
                </div>
                <div className="text-sm text-gray-600">Lives</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{gameState.level}</div>
                <div className="text-sm text-gray-600">Level</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{gameState.timeLeft}</div>
                <div className="text-sm text-gray-600">Time</div>
              </div>
            </div>

            {gameState.currentProblem && (
              <div className="text-center">
                <div className="text-xl font-bold text-gray-800">
                  {gameState.currentProblem.question} = ?
                </div>
                <div className="text-sm text-gray-600">Find the answer!</div>
              </div>
            )}
          </div>
        </div>

        {/* Game Board */}
        <div 
          className="bg-black rounded-2xl p-4 relative touch-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {gameState.maze.length > 0 && (
            <div 
              className="grid gap-0 w-full max-w-2xl mx-auto"
              style={{ gridTemplateColumns: 'repeat(15, 1fr)' }}
            >
              {gameState.maze.map((row, y) =>
                row.map((cell, x) => (
                  <div
                    key={`${x}-${y}`}
                    className="aspect-square relative"
                    style={{ minWidth: '20px', minHeight: '20px' }}
                  >
                    {renderCell(cell, x, y)}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Mobile Control Buttons */}
        <div className="bg-white rounded-2xl p-4 mt-4 md:hidden">
          <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
            <div></div>
            <motion.button
              onTouchStart={() => movePacman('up')}
              className="bg-blue-500 text-white p-4 rounded-xl font-bold text-2xl"
              whileTap={{ scale: 0.9 }}
            >
              ⬆️
            </motion.button>
            <div></div>
            
            <motion.button
              onTouchStart={() => movePacman('left')}
              className="bg-blue-500 text-white p-4 rounded-xl font-bold text-2xl"
              whileTap={{ scale: 0.9 }}
            >
              ⬅️
            </motion.button>
            
            <motion.button
              onTouchStart={() => setGameState(prev => ({ 
                ...prev, 
                gameStatus: prev.gameStatus === 'playing' ? 'paused' : 'playing' 
              }))}
              className="bg-yellow-500 text-white p-4 rounded-xl font-bold text-sm"
              whileTap={{ scale: 0.9 }}
            >
              {gameState.gameStatus === 'playing' ? '⏸️' : '▶️'}
            </motion.button>
            
            <motion.button
              onTouchStart={() => movePacman('right')}
              className="bg-blue-500 text-white p-4 rounded-xl font-bold text-2xl"
              whileTap={{ scale: 0.9 }}
            >
              ➡️
            </motion.button>
            
            <div></div>
            <motion.button
              onTouchStart={() => movePacman('down')}
              className="bg-blue-500 text-white p-4 rounded-xl font-bold text-2xl"
              whileTap={{ scale: 0.9 }}
            >
              ⬇️
            </motion.button>
            <div></div>
          </div>
        </div>

        {/* Controls Help */}
        <div className="bg-white rounded-2xl p-4 mt-4">
          <div className="text-center text-sm text-gray-600">
            <div className="hidden md:block">Use arrow keys to move • SPACE to pause • Collect correct answers • Avoid wrong answers!</div>
            <div className="md:hidden">Swipe or use buttons to move • Collect correct answers • Avoid wrong answers!</div>
          </div>
        </div>

        {/* Game Over Modal */}
        <AnimatePresence>
          {gameState.gameStatus === 'gameOver' && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-3xl p-8 max-w-md w-full text-center mx-4"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div className="text-6xl mb-4">😵</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Game Over!</h2>
                <div className="space-y-2 mb-6">
                  <div>Final Score: <span className="font-bold">{gameState.score}</span></div>
                  <div>Level Reached: <span className="font-bold">{gameState.level}</span></div>
                  <div>Dots Eaten: <span className="font-bold">{gameState.dotsEaten}</span></div>
                </div>
                <div className="space-y-3">
                  <motion.button
                    onClick={startNewGame}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-8 rounded-xl"
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

        {/* Paused Modal */}
        <AnimatePresence>
          {gameState.gameStatus === 'paused' && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-3xl p-8 max-w-md w-full text-center mx-4"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div className="text-6xl mb-4">⏸️</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Game Paused</h2>
                <p className="text-gray-600 mb-6">Take a break and come back when ready!</p>
                <div className="space-y-3">
                  <motion.button
                    onClick={() => setGameState(prev => ({ ...prev, gameStatus: 'playing' }))}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-3 px-8 rounded-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Resume Game
                  </motion.button>
                  <motion.button
                    onClick={() => navigate('/mini-games')}
                    className="w-full bg-gray-500 text-white font-bold py-3 px-8 rounded-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Quit Game
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

export default PacManMath;