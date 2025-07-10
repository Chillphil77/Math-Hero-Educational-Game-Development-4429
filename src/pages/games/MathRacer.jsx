import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../contexts/GameContext';
import { useUser } from '../../contexts/UserContext';
import { useSound } from '../../contexts/SoundContext';
import confetti from 'canvas-confetti';

const MathRacer = () => {
  const navigate = useNavigate();
  const { generateMathProblem, startGame, endGame } = useGame();
  const { user, addCoins, addXP } = useUser();
  const { playSound } = useSound();
  const gameRef = useRef(null);

  const [gameState, setGameState] = useState({
    status: 'menu',  // menu, playing, gameOver
    car: { position: 1, lane: 1 },  // position: 0-2 (left, center, right), lane: vertical position
    obstacles: [],
    score: 0,
    lives: 3,
    speed: 3, // Reduced speed
    level: 1,
    currentProblem: null,
    showProblem: true,
    difficulty: 'medium',
    lastCorrectAnswer: null,
    gameSpeed: 200, // Game update interval in ms (higher = slower)
  });

  // Game loop
  useEffect(() => {
    let gameLoop;
    
    if (gameState.status === 'playing') {
      gameLoop = setInterval(() => {
        updateGame();
      }, gameState.gameSpeed); // Slower update interval
    }
    
    return () => {
      if (gameLoop) clearInterval(gameLoop);
    };
  }, [gameState.status, gameState.car, gameState.obstacles, gameState.gameSpeed]);

  // Key press handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState.status !== 'playing') return;
      
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        moveCar('left');
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        moveCar('right');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.status, gameState.car]);

  const startNewGame = (difficulty = 'medium') => {
    // Set game speed based on difficulty
    const gameSpeed = difficulty === 'easy' ? 250 : difficulty === 'medium' ? 200 : 150;
    
    // Generate first math problem
    const problem = generateMathProblem(
      ['addition', 'subtraction', 'multiplication'][Math.floor(Math.random() * 3)],
      difficulty,
      user?.age || 8
    );
    
    // Start with one obstacle
    const answerChoices = generateAnswerChoices(problem.answer);
    const obstacles = [
      { lane: 30, position: 0, value: answerChoices[0], isCorrect: answerChoices[0] === problem.answer }, // Increased initial lane
      { lane: 35, position: 1, value: answerChoices[1], isCorrect: answerChoices[1] === problem.answer },
      { lane: 40, position: 2, value: answerChoices[2], isCorrect: answerChoices[2] === problem.answer }
    ];
    
    setGameState({
      status: 'playing',
      car: { position: 1, lane: 1 },
      obstacles,
      score: 0,
      lives: 3,
      speed: difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4,
      level: 1,
      currentProblem: problem,
      showProblem: true,
      difficulty,
      lastCorrectAnswer: null,
      gameSpeed
    });
    
    startGame('math-racer', { difficulty });
  };

  const updateGame = () => {
    setGameState(prevState => {
      // Move obstacles down but slower
      const updatedObstacles = prevState.obstacles.map(obstacle => ({
        ...obstacle,
        lane: obstacle.lane - 1
      })).filter(obstacle => obstacle.lane > -2);
      
      // Check for collisions
      const carObstacle = updatedObstacles.find(
        obstacle => 
          obstacle.position === prevState.car.position && 
          Math.abs(obstacle.lane - prevState.car.lane) < 2
      );
      
      let newScore = prevState.score;
      let newLives = prevState.lives;
      let newLevel = prevState.level;
      let newSpeed = prevState.speed;
      let newProblem = prevState.currentProblem;
      let showProblem = prevState.showProblem;
      let lastCorrectAnswer = prevState.lastCorrectAnswer;
      let gameSpeed = prevState.gameSpeed;
      
      // Handle collision
      if (carObstacle) {
        if (carObstacle.isCorrect) {
          // Hit correct answer
          playSound('correct');
          newScore += 100;
          newLevel = Math.floor(newScore / 500) + 1;
          
          // Speed increases more gradually now
          newSpeed = Math.min(5, 2 + Math.floor(newLevel / 3));
          gameSpeed = Math.max(100, 250 - (newLevel * 10)); // Gradually increase speed
          
          lastCorrectAnswer = carObstacle.value;
          
          // Add coins to user account
          addCoins(20);
          addXP(30);
          
          // Celebrate correct answer
          confetti({
            particleCount: 30,
            spread: 70,
            origin: { y: 0.6 }
          });
          
          // Create new problem
          newProblem = generateMathProblem(
            ['addition', 'subtraction', 'multiplication'][Math.floor(Math.random() * 3)],
            prevState.difficulty,
            user?.age || 8
          );
          showProblem = true;
          
          // Remove all current obstacles
          updatedObstacles.length = 0;
        } else {
          // Hit wrong answer
          playSound('incorrect');
          newLives--;
          
          // Remove the hit obstacle
          const obstacleIndex = updatedObstacles.findIndex(o => o === carObstacle);
          if (obstacleIndex !== -1) {
            updatedObstacles.splice(obstacleIndex, 1);
          }
        }
      }
      
      // Check if game over
      if (newLives <= 0) {
        // Game over
        endGame(newScore, { level: newLevel });
        return {
          ...prevState,
          status: 'gameOver',
          score: newScore,
          lives: newLives,
          level: newLevel
        };
      }
      
      // Add new obstacles if needed
      if (updatedObstacles.length === 0 && newProblem) {
        const answerChoices = generateAnswerChoices(newProblem.answer);
        
        // Place obstacles further away with more spacing between them
        for (let i = 0; i < 3; i++) {
          updatedObstacles.push({
            lane: 30 + (i * 5), // Place further away and spaced out
            position: i,
            value: answerChoices[i],
            isCorrect: answerChoices[i] === newProblem.answer
          });
        }
      }
      
      return {
        ...prevState,
        obstacles: updatedObstacles,
        score: newScore,
        lives: newLives,
        level: newLevel,
        speed: newSpeed,
        currentProblem: newProblem,
        showProblem,
        lastCorrectAnswer,
        gameSpeed
      };
    });
  };

  const generateAnswerChoices = (correctAnswer) => {
    // Create array with correct answer plus two wrong answers
    const choices = [correctAnswer];
    
    // Add two wrong answers
    while (choices.length < 3) {
      const variance = Math.max(5, Math.floor(correctAnswer * 0.4));
      const wrongAnswer = correctAnswer + Math.floor(Math.random() * variance * 2) - variance;
      
      if (wrongAnswer !== correctAnswer && !choices.includes(wrongAnswer) && wrongAnswer > 0) {
        choices.push(wrongAnswer);
      }
    }
    
    // Shuffle the choices
    return choices.sort(() => Math.random() - 0.5);
  };

  const moveCar = (direction) => {
    setGameState(prevState => {
      let newPosition = prevState.car.position;
      
      if (direction === 'left' && newPosition > 0) {
        newPosition--;
        playSound('click');
      } else if (direction === 'right' && newPosition < 2) {
        newPosition++;
        playSound('click');
      }
      
      return {
        ...prevState,
        car: { ...prevState.car, position: newPosition }
      };
    });
  };

  const renderRoad = () => {
    const lanes = 30; // Increased number of vertical positions for a longer road
    const roadLanes = Array(lanes).fill(0);
    
    return (
      <div className="relative w-full h-[500px] bg-gray-700 overflow-hidden rounded-lg"> {/* Taller road */}
        {/* Road markings */}
        <div className="absolute top-0 bottom-0 left-1/3 w-1 bg-yellow-400 dashed-line"></div>
        <div className="absolute top-0 bottom-0 right-1/3 w-1 bg-yellow-400 dashed-line"></div>
        
        {/* Car */}
        <motion.div 
          className="absolute bottom-8 w-14 h-20 bg-red-500 rounded-lg z-10" // Slightly bigger car
          style={{
            left: `calc(${(gameState.car.position * 33.33) + 16.66}% - 24px)`
          }}
          animate={{ x: [0, 5, -5, 0] }}
          transition={{ duration: 0.3 }}
        >
          {/* Car details */}
          <div className="absolute top-2 left-2 right-2 h-5 bg-blue-300 rounded-t-sm"></div>
          <div className="absolute bottom-1 left-1 w-3 h-4 bg-red-700 rounded-sm"></div>
          <div className="absolute bottom-1 right-1 w-3 h-4 bg-red-700 rounded-sm"></div>
        </motion.div>
        
        {/* Obstacles */}
        {gameState.obstacles.map((obstacle, index) => (
          <motion.div
            key={index}
            className={`absolute w-16 h-16 rounded-lg flex items-center justify-center text-xl font-bold ${
              obstacle.isCorrect ? 'bg-green-400' : 'bg-red-400'
            } text-white shadow-lg`}
            style={{
              left: `calc(${(obstacle.position * 33.33) + 16.66}% - 32px)`,
              top: `calc(${100 - (obstacle.lane * 3.33)}% - 32px)` // Adjust spacing
            }}
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            {obstacle.value}
          </motion.div>
        ))}
      </div>
    );
  };

  // Menu Screen
  if (gameState.status === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-800 via-purple-800 to-indigo-900 p-6 flex items-center justify-center">
        <motion.div
          className="bg-white rounded-3xl p-8 max-w-lg w-full"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <motion.div
              className="text-8xl mb-6 mx-auto"
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🏎️
            </motion.div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Math Racer</h1>
            <p className="text-gray-600 mb-8">
              Drive your car to collect the correct answers! Avoid the wrong ones!
            </p>
            
            {/* Difficulty Selection */}
            <div className="mb-8">
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
                    onClick={() => startNewGame(difficulty)}
                  >
                    {difficulty}
                  </motion.button>
                ))}
              </div>
            </div>
            
            {/* Instructions */}
            <div className="bg-gray-50 rounded-xl p-4 mb-8">
              <h3 className="font-bold text-gray-700 mb-2">How to Play:</h3>
              <ul className="text-left text-gray-600 text-sm space-y-1">
                <li>• Solve the math problem at the top</li>
                <li>• Use arrow keys or buttons to move your car left and right</li>
                <li>• Drive into the correct answer</li>
                <li>• Avoid wrong answers or lose lives</li>
                <li>• Speed increases as you level up!</li>
              </ul>
            </div>
            
            <motion.button
              onClick={() => startNewGame('medium')}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Racing! 🏁
            </motion.button>
            
            <motion.button
              onClick={() => navigate('/mini-games')}
              className="w-full mt-4 py-3 bg-gray-500 text-white font-bold rounded-xl"
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
  
  // Game Over Screen
  if (gameState.status === 'gameOver') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-800 via-purple-800 to-indigo-900 p-6 flex items-center justify-center">
        <motion.div
          className="bg-white rounded-3xl p-8 max-w-lg w-full"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <motion.div
              className="text-8xl mb-6"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🏁
            </motion.div>
            <h1 className="text-4xl font-bold text-red-600 mb-4">Game Over!</h1>
            <p className="text-gray-600 mb-8">
              Your math racing journey has come to an end!
            </p>
            
            <div className="bg-blue-50 rounded-2xl p-6 mb-8">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600">{gameState.score}</div>
                  <div className="text-sm text-gray-600">Final Score</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600">{gameState.level}</div>
                  <div className="text-sm text-gray-600">Level Reached</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-600">+{Math.floor(gameState.score / 10)}</div>
                  <div className="text-sm text-gray-600">Coins Earned</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <motion.button
                onClick={() => startNewGame(gameState.difficulty)}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Race Again! 🏎️
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
          </div>
        </motion.div>
      </div>
    );
  }
  
  // Game Playing Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 via-purple-800 to-indigo-900 p-4 md:p-6" ref={gameRef}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Game Header */}
        <div className="bg-white rounded-2xl p-4 shadow-lg sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{gameState.score}</div>
                <div className="text-sm text-gray-600">Score</div>
              </div>
              <div className="text-center">
                <div className="flex space-x-1">
                  {Array.from({ length: gameState.lives }, (_, i) => (
                    <span key={i} className="text-xl">❤️</span>
                  ))}
                </div>
                <div className="text-sm text-gray-600">Lives</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{gameState.level}</div>
                <div className="text-sm text-gray-600">Level</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{gameState.speed}</div>
                <div className="text-sm text-gray-600">Speed</div>
              </div>
            </div>
            
            {/* Current Problem */}
            {gameState.currentProblem && (
              <div className="text-center">
                <div className="text-xl font-bold text-gray-800">
                  {gameState.currentProblem.question} = ?
                </div>
                <div className="text-sm text-gray-600">Drive to the correct answer!</div>
              </div>
            )}
            
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
        
        {/* Game Area */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-center text-gray-800">
              {gameState.lastCorrectAnswer !== null ? (
                <motion.div 
                  initial={{ scale: 1.5, color: "#22c55e" }} 
                  animate={{ scale: 1, color: "#1f2937" }}
                  transition={{ duration: 1 }}
                >
                  Correct! {gameState.currentProblem.question} = {gameState.lastCorrectAnswer}
                </motion.div>
              ) : (
                "Math Racing!"
              )}
            </h2>
          </div>
          
          {/* Road and Car */}
          {renderRoad()}
          
          {/* Mobile Controls */}
          <div className="mt-6 flex justify-center space-x-8 md:hidden">
            <motion.button
              onTouchStart={() => moveCar('left')}
              className="bg-blue-500 text-white p-6 rounded-full font-bold text-2xl"
              whileTap={{ scale: 0.9 }}
            >
              ⬅️
            </motion.button>
            <motion.button
              onTouchStart={() => moveCar('right')}
              className="bg-blue-500 text-white p-6 rounded-full font-bold text-2xl"
              whileTap={{ scale: 0.9 }}
            >
              ➡️
            </motion.button>
          </div>
        </div>
        
        {/* Instructions */}
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <div className="text-center text-sm text-gray-600">
            <div className="hidden md:block">
              Use arrow keys to move left and right • Drive into the correct answer • Avoid wrong answers!
            </div>
            <div className="md:hidden">
              Tap buttons to move • Drive into the correct answer • Avoid wrong answers!
            </div>
          </div>
        </div>
      </div>
      
      {/* CSS for dashed lines */}
      <style jsx="true">{`
        .dashed-line {
          background-image: linear-gradient(to bottom, #f59e0b 50%, transparent 50%);
          background-size: 2px 20px;
          background-repeat: repeat-y;
        }
      `}</style>
    </div>
  );
};

export default MathRacer;