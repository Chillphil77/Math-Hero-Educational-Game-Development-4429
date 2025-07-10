import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { useSound } from '../../contexts/SoundContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useGame } from '../../contexts/GameContext';
import confetti from 'canvas-confetti';

const BattleshipMath = () => {
  const navigate = useNavigate();
  const { user, addCoins, addXP } = useUser();
  const { playSound } = useSound();
  const { t } = useLanguage();
  const { generateMathProblem } = useGame();

  const [gameState, setGameState] = useState({
    playerBoard: Array(8).fill().map(() => Array(8).fill('water')),
    enemyBoard: Array(8).fill().map(() => Array(8).fill('water')),
    playerShots: Array(8).fill().map(() => Array(8).fill(false)),
    enemyShots: Array(8).fill().map(() => Array(8).fill(false)),
    ships: [],
    enemyShips: [],
    currentProblem: null,
    userAnswer: '',
    gameStatus: 'menu', // menu, playing, won, lost
    turn: 'player',
    score: 0,
    shipsDestroyed: 0,
    totalShips: 5
  });

  const shipSizes = [5, 4, 3, 3, 2]; // Different ship sizes

  const startGame = () => {
    const playerShips = placeShipsRandomly();
    const enemyShips = placeShipsRandomly();
    
    setGameState(prev => ({
      ...prev,
      gameStatus: 'playing',
      playerBoard: createBoardWithShips(playerShips),
      enemyBoard: createBoardWithShips(enemyShips),
      ships: playerShips,
      enemyShips: enemyShips,
      playerShots: Array(8).fill().map(() => Array(8).fill(false)),
      enemyShots: Array(8).fill().map(() => Array(8).fill(false)),
      score: 0,
      shipsDestroyed: 0
    }));
    
    generateNewProblem();
  };

  const placeShipsRandomly = () => {
    const ships = [];
    const board = Array(8).fill().map(() => Array(8).fill(false));
    
    shipSizes.forEach((size, shipIndex) => {
      let placed = false;
      let attempts = 0;
      
      while (!placed && attempts < 100) {
        const horizontal = Math.random() < 0.5;
        const startX = Math.floor(Math.random() * (horizontal ? 8 - size : 8));
        const startY = Math.floor(Math.random() * (horizontal ? 8 : 8 - size));
        
        let canPlace = true;
        const positions = [];
        
        for (let i = 0; i < size; i++) {
          const x = horizontal ? startX + i : startX;
          const y = horizontal ? startY : startY + i;
          
          if (board[y][x]) {
            canPlace = false;
            break;
          }
          positions.push({ x, y });
        }
        
        if (canPlace) {
          positions.forEach(pos => {
            board[pos.y][pos.x] = true;
          });
          
          ships.push({
            id: shipIndex,
            positions,
            hits: 0,
            size
          });
          
          placed = true;
        }
        
        attempts++;
      }
    });
    
    return ships;
  };

  const createBoardWithShips = (ships) => {
    const board = Array(8).fill().map(() => Array(8).fill('water'));
    
    ships.forEach(ship => {
      ship.positions.forEach(pos => {
        board[pos.y][pos.x] = 'ship';
      });
    });
    
    return board;
  };

  const generateNewProblem = () => {
    const operations = ['addition', 'subtraction', 'multiplication', 'division'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    const problem = generateMathProblem(operation, 'medium', user?.age || 8);
    
    setGameState(prev => ({
      ...prev,
      currentProblem: problem,
      userAnswer: ''
    }));
  };

  const handleAnswerSubmit = () => {
    if (!gameState.userAnswer.trim()) return;
    
    const isCorrect = parseInt(gameState.userAnswer) === gameState.currentProblem.answer;
    
    if (isCorrect) {
      playSound('correct');
      // Allow player to shoot
      setGameState(prev => ({ ...prev, turn: 'player' }));
    } else {
      playSound('incorrect');
      setGameState(prev => ({ ...prev, userAnswer: '' }));
    }
  };

  const handleCellClick = (x, y) => {
    if (gameState.turn !== 'player' || gameState.playerShots[y][x]) return;
    
    const newShots = [...gameState.playerShots];
    newShots[y][x] = true;
    
    const isHit = gameState.enemyBoard[y][x] === 'ship';
    let newScore = gameState.score;
    let shipsDestroyed = gameState.shipsDestroyed;
    
    if (isHit) {
      playSound('achievement');
      newScore += 100;
      
      // Check if ship is destroyed
      const hitShip = gameState.enemyShips.find(ship => 
        ship.positions.some(pos => pos.x === x && pos.y === y)
      );
      
      if (hitShip) {
        hitShip.hits++;
        if (hitShip.hits === hitShip.size) {
          shipsDestroyed++;
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 }
          });
        }
      }
    } else {
      playSound('incorrect');
    }
    
    setGameState(prev => ({
      ...prev,
      playerShots: newShots,
      score: newScore,
      shipsDestroyed,
      turn: 'enemy'
    }));
    
    // Check win condition
    if (shipsDestroyed === gameState.totalShips) {
      setTimeout(() => {
        setGameState(prev => ({ ...prev, gameStatus: 'won' }));
        addCoins(200);
        addXP(150);
        confetti({
          particleCount: 200,
          spread: 70,
          origin: { y: 0.6 }
        });
      }, 1000);
    } else {
      // Enemy turn after delay
      setTimeout(() => {
        enemyTurn();
      }, 1500);
    }
  };

  const enemyTurn = () => {
    // Simple AI - random shots
    let x, y;
    do {
      x = Math.floor(Math.random() * 8);
      y = Math.floor(Math.random() * 8);
    } while (gameState.enemyShots[y][x]);
    
    const newEnemyShots = [...gameState.enemyShots];
    newEnemyShots[y][x] = true;
    
    const isHit = gameState.playerBoard[y][x] === 'ship';
    
    if (isHit) {
      playSound('incorrect');
      // Check if all player ships are destroyed
      // For simplicity, let's just continue the game
    }
    
    setGameState(prev => ({
      ...prev,
      enemyShots: newEnemyShots
    }));
    
    // Generate new problem for next turn
    generateNewProblem();
  };

  if (gameState.gameStatus === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-red-900 p-4 flex items-center justify-center">
        <motion.div
          className="bg-white rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="text-8xl mb-6"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🚢
          </motion.div>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Battleship Math</h1>
          
          <p className="text-gray-600 mb-6">
            Sink enemy ships by solving math problems to find coordinates! This exciting game combines strategy with math skills.
          </p>
          
          <div className="bg-blue-50 rounded-xl p-4 mb-6 text-left">
            <h3 className="font-bold text-blue-800 mb-2">Game Features:</h3>
            <ul className="space-y-2 text-blue-700">
              <li>• Find ship coordinates by solving math problems</li>
              <li>• Multiple difficulty levels</li>
              <li>• Strategic gameplay with different ship sizes</li>
              <li>• Exciting sound effects and animations</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <motion.button
              onClick={startGame}
              className="w-full py-4 bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold rounded-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Battle
            </motion.button>
            
            <motion.button
              onClick={() => navigate('/mini-games')}
              className="w-full py-3 bg-gray-500 text-white font-bold rounded-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Back to Games
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-red-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Game Header */}
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{gameState.score}</div>
                <div className="text-sm text-gray-600">Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{gameState.shipsDestroyed}/{gameState.totalShips}</div>
                <div className="text-sm text-gray-600">Ships Sunk</div>
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

        {/* Math Problem */}
        {gameState.currentProblem && gameState.turn === 'enemy' && (
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-lg text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Solve to Aim!</h3>
            <div className="text-3xl font-bold text-blue-600 mb-4">
              {gameState.currentProblem.question} = ?
            </div>
            
            <div className="flex items-center space-x-4 max-w-md mx-auto">
              <input
                type="number"
                value={gameState.userAnswer}
                onChange={(e) => setGameState(prev => ({ ...prev, userAnswer: e.target.value }))}
                className="flex-1 text-center text-xl font-bold py-3 px-4 rounded-xl border-2 border-blue-300 focus:border-blue-500 focus:outline-none"
                placeholder="Answer"
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAnswerSubmit();
                  }
                }}
              />
              <motion.button
                onClick={handleAnswerSubmit}
                disabled={!gameState.userAnswer.trim()}
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-3 px-6 rounded-xl disabled:opacity-50"
                whileHover={{ scale: gameState.userAnswer.trim() ? 1.05 : 1 }}
                whileTap={{ scale: gameState.userAnswer.trim() ? 0.95 : 1 }}
              >
                Aim!
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Game Board */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Enemy Waters</h3>
          <div className="grid grid-cols-8 gap-2 max-w-md mx-auto">
            {gameState.enemyBoard.map((row, y) =>
              row.map((cell, x) => {
                const isShot = gameState.playerShots[y][x];
                const isHit = isShot && cell === 'ship';
                const isMiss = isShot && cell === 'water';
                
                return (
                  <motion.button
                    key={`${x}-${y}`}
                    onClick={() => handleCellClick(x, y)}
                    disabled={isShot || gameState.turn !== 'player'}
                    className={`aspect-square rounded-lg border-2 font-bold text-sm ${
                      isHit ? 'bg-red-500 text-white border-red-700' :
                      isMiss ? 'bg-blue-300 text-blue-800 border-blue-500' :
                      'bg-blue-500 text-white border-blue-700 hover:bg-blue-400'
                    } disabled:cursor-not-allowed`}
                    whileHover={{ scale: !isShot && gameState.turn === 'player' ? 1.1 : 1 }}
                    whileTap={{ scale: !isShot && gameState.turn === 'player' ? 0.9 : 1 }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (x + y) * 0.05 }}
                  >
                    {isHit ? '💥' : isMiss ? '💧' : '🌊'}
                  </motion.button>
                );
              })
            )}
          </div>
        </div>

        {/* Game Over Modal */}
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
                <div className="text-6xl mb-4">🏆</div>
                <h2 className="text-3xl font-bold text-green-600 mb-4">Victory!</h2>
                <p className="text-gray-600 mb-4">
                  You've sunk all enemy ships! Excellent math skills, Admiral!
                </p>
                <div className="text-lg text-green-600 mb-6">
                  +{gameState.score} points • +200 coins • +150 XP
                </div>
                
                <div className="space-y-3">
                  <motion.button
                    onClick={startGame}
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
      </div>
    </div>
  );
};

export default BattleshipMath;