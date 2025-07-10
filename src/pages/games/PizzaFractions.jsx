import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { useSound } from '../../contexts/SoundContext';
import { useLanguage } from '../../contexts/LanguageContext';
import confetti from 'canvas-confetti';

const PizzaFractions = () => {
  const navigate = useNavigate();
  const { user, addCoins, addXP } = useUser();
  const { playSound } = useSound();
  const { t } = useLanguage();

  const [gameState, setGameState] = useState({
    currentLevel: 1,
    score: 0,
    streak: 0,
    gameStatus: 'menu', // menu, playing, complete
    currentQuestion: null,
    userAnswer: '',
    feedback: '',
    isCorrect: null,
    totalQuestions: 10,
    questionsAnswered: 0
  });

  const fractionQuestions = [
    // Halves
    { pizza: 2, selectedPieces: 1, answer: '1/2', level: 1, description: 'Half of the pizza' },
    { pizza: 4, selectedPieces: 2, answer: '2/4', simplifiedAnswer: '1/2', level: 1, description: 'Half of the pizza' },
    
    // Quarters  
    { pizza: 4, selectedPieces: 1, answer: '1/4', level: 2, description: 'One quarter of the pizza' },
    { pizza: 4, selectedPieces: 3, answer: '3/4', level: 2, description: 'Three quarters of the pizza' },
    
    // Thirds
    { pizza: 3, selectedPieces: 1, answer: '1/3', level: 3, description: 'One third of the pizza' },
    { pizza: 3, selectedPieces: 2, answer: '2/3', level: 3, description: 'Two thirds of the pizza' },
    { pizza: 6, selectedPieces: 2, answer: '2/6', simplifiedAnswer: '1/3', level: 3, description: 'One third of the pizza' },
    
    // Eighths
    { pizza: 8, selectedPieces: 1, answer: '1/8', level: 4, description: 'One eighth of the pizza' },
    { pizza: 8, selectedPieces: 3, answer: '3/8', level: 4, description: 'Three eighths of the pizza' },
    { pizza: 8, selectedPieces: 4, answer: '4/8', simplifiedAnswer: '1/2', level: 4, description: 'Half of the pizza' }
  ];

  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      gameStatus: 'playing',
      score: 0,
      streak: 0,
      questionsAnswered: 0
    }));
    generateQuestion();
  };

  const generateQuestion = () => {
    const availableQuestions = fractionQuestions.filter(q => q.level <= Math.min(4, Math.floor(gameState.questionsAnswered / 3) + 1));
    const question = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    
    setGameState(prev => ({
      ...prev,
      currentQuestion: question,
      userAnswer: '',
      feedback: '',
      isCorrect: null
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!gameState.userAnswer.trim()) return;

    const { currentQuestion } = gameState;
    const isCorrect = gameState.userAnswer === currentQuestion.answer || 
                     gameState.userAnswer === currentQuestion.simplifiedAnswer;

    setGameState(prev => ({
      ...prev,
      isCorrect,
      feedback: isCorrect ? 'Correct! 🎉' : `Not quite! The answer was ${currentQuestion.answer}${currentQuestion.simplifiedAnswer ? ` or ${currentQuestion.simplifiedAnswer}` : ''}`,
      questionsAnswered: prev.questionsAnswered + 1
    }));

    if (isCorrect) {
      playSound('correct');
      const newStreak = gameState.streak + 1;
      const points = 100 + (newStreak * 20);
      
      setGameState(prev => ({
        ...prev,
        score: prev.score + points,
        streak: newStreak
      }));

      addCoins(15);
      addXP(25);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#FF6347'] // Pizza colors
      });
    } else {
      playSound('incorrect');
      setGameState(prev => ({ ...prev, streak: 0 }));
    }

    setTimeout(() => {
      if (gameState.questionsAnswered + 1 >= gameState.totalQuestions) {
        setGameState(prev => ({ ...prev, gameStatus: 'complete' }));
      } else {
        generateQuestion();
      }
    }, 2500);
  };

  const renderPizza = (pieces, selectedPieces, size = 'large') => {
    const radius = size === 'large' ? 120 : 80;
    const centerX = radius + 10;
    const centerY = radius + 10;
    const anglePerPiece = (2 * Math.PI) / pieces;

    return (
      <svg 
        width={(radius + 10) * 2} 
        height={(radius + 10) * 2} 
        className="mx-auto"
      >
        {/* Pizza base */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="#D4A574"
          stroke="#B8956A"
          strokeWidth="3"
        />
        
        {/* Pizza pieces */}
        {Array.from({ length: pieces }, (_, i) => {
          const startAngle = i * anglePerPiece - Math.PI / 2;
          const endAngle = (i + 1) * anglePerPiece - Math.PI / 2;
          
          const x1 = centerX + radius * Math.cos(startAngle);
          const y1 = centerY + radius * Math.sin(startAngle);
          const x2 = centerX + radius * Math.cos(endAngle);
          const y2 = centerY + radius * Math.sin(endAngle);
          
          const largeArcFlag = anglePerPiece > Math.PI ? 1 : 0;
          
          const pathData = [
            `M ${centerX} ${centerY}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            'Z'
          ].join(' ');
          
          const isSelected = i < selectedPieces;
          
          return (
            <motion.path
              key={i}
              d={pathData}
              fill={isSelected ? "#FF6347" : "#FFA500"}
              stroke="#8B4513"
              strokeWidth="2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1, type: "spring" }}
            />
          );
        })}
        
        {/* Piece dividers */}
        {Array.from({ length: pieces }, (_, i) => {
          const angle = i * anglePerPiece - Math.PI / 2;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          
          return (
            <line
              key={`divider-${i}`}
              x1={centerX}
              y1={centerY}
              x2={x}
              y2={y}
              stroke="#8B4513"
              strokeWidth="2"
            />
          );
        })}
        
        {/* Toppings on selected pieces */}
        {Array.from({ length: selectedPieces }, (_, i) => {
          const angle = (i + 0.5) * anglePerPiece - Math.PI / 2;
          const distance = radius * 0.7;
          const x = centerX + distance * Math.cos(angle);
          const y = centerY + distance * Math.sin(angle);
          
          return (
            <g key={`topping-${i}`}>
              <circle cx={x - 10} cy={y - 5} r="3" fill="#8B0000" />
              <circle cx={x + 8} cy={y + 3} r="2" fill="#228B22" />
              <circle cx={x + 2} cy={y - 8} r="2.5" fill="#FFD700" />
            </g>
          );
        })}
      </svg>
    );
  };

  if (gameState.gameStatus === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 p-6 flex items-center justify-center">
        <motion.div
          className="bg-white rounded-3xl p-8 max-w-md w-full"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="text-center">
            <motion.div
              className="text-8xl mb-6"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🍕
            </motion.div>
            
            <h1 className="text-4xl font-bold text-gray-800 mb-4">{t('pizzaFractions')}</h1>
            <p className="text-gray-600 mb-8">
              Learn fractions by cutting and eating pizza! 🍕✂️
            </p>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-700 mb-4">What you'll learn:</h2>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <div className="text-2xl mb-1">🍕</div>
                  <div className="font-bold">Halves</div>
                  <div className="text-gray-600">1/2</div>
                </div>
                <div className="bg-red-100 p-3 rounded-lg">
                  <div className="text-2xl mb-1">🍕</div>
                  <div className="font-bold">Quarters</div>
                  <div className="text-gray-600">1/4, 3/4</div>
                </div>
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <div className="text-2xl mb-1">🍕</div>
                  <div className="font-bold">Thirds</div>
                  <div className="text-gray-600">1/3, 2/3</div>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <div className="text-2xl mb-1">🍕</div>
                  <div className="font-bold">Eighths</div>
                  <div className="text-gray-600">1/8, 3/8</div>
                </div>
              </div>
            </div>

            <motion.button
              onClick={startGame}
              className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🍕 Start Learning Fractions!
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

  if (gameState.gameStatus === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 p-6 flex items-center justify-center">
        <motion.div
          className="bg-white rounded-3xl p-8 max-w-md w-full"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="text-center">
            <motion.div
              className="text-8xl mb-6"
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🏆
            </motion.div>
            
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Pizza Master!</h1>
            <p className="text-gray-600 mb-8">
              Congratulations! You've mastered pizza fractions! 🎉
            </p>

            <div className="bg-orange-50 rounded-2xl p-6 mb-8">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-orange-600">{gameState.score}</div>
                  <div className="text-sm text-gray-600">Final Score</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-600">{gameState.questionsAnswered}</div>
                  <div className="text-sm text-gray-600">Questions Answered</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-600">{gameState.streak}</div>
                  <div className="text-sm text-gray-600">Best Streak</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600">+{Math.floor(gameState.score / 10)}</div>
                  <div className="text-sm text-gray-600">Coins Earned</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <motion.button
                onClick={startGame}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🍕 Play Again
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Game Header */}
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{gameState.score}</div>
                <div className="text-sm text-gray-600">Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{gameState.questionsAnswered}/{gameState.totalQuestions}</div>
                <div className="text-sm text-gray-600">Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{gameState.streak}</div>
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

        {/* Main Game Area */}
        <motion.div
          className="bg-white rounded-3xl p-8 shadow-lg"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          {gameState.currentQuestion && (
            <AnimatePresence mode="wait">
              {gameState.isCorrect === null ? (
                <motion.div
                  key="question"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    What fraction of the pizza is highlighted? 🍕
                  </h2>
                  
                  <div className="mb-8">
                    {renderPizza(gameState.currentQuestion.pizza, gameState.currentQuestion.selectedPieces)}
                  </div>
                  
                  <p className="text-lg text-gray-600 mb-6">
                    {gameState.currentQuestion.description}
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enter the fraction (e.g., 1/2, 3/4):
                      </label>
                      <input
                        type="text"
                        value={gameState.userAnswer}
                        onChange={(e) => setGameState(prev => ({ ...prev, userAnswer: e.target.value }))}
                        className="w-full text-center text-2xl font-bold py-4 px-6 rounded-xl border-2 border-orange-300 focus:border-orange-500 focus:outline-none transition-colors"
                        placeholder="1/2"
                        autoFocus
                      />
                    </div>
                    
                    <motion.button
                      type="submit"
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={!gameState.userAnswer.trim()}
                    >
                      Submit Answer 🍕
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
                    <div className="text-lg text-green-600 mb-4 flex items-center justify-center space-x-2">
                      <span className="text-2xl">🪙</span>
                      <span>+15 coins • +25 XP</span>
                    </div>
                  )}

                  <div className="mt-6">
                    {renderPizza(gameState.currentQuestion.pizza, gameState.currentQuestion.selectedPieces, 'small')}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PizzaFractions;