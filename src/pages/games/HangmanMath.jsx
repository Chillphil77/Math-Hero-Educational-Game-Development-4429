import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { useSound } from '../../contexts/SoundContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useGame } from '../../contexts/GameContext';
import confetti from 'canvas-confetti';

const HangmanMath = () => {
  const navigate = useNavigate();
  const { user, addCoins, addXP } = useUser();
  const { playSound } = useSound();
  const { t } = useLanguage();
  const { generateMathProblem } = useGame();

  const [gameState, setGameState] = useState({
    currentProblem: null,
    correctAnswer: null,
    wrongAnswers: [],
    answeredProblems: [],
    wrongGuesses: 0,
    maxWrongGuesses: 6,
    gameStatus: 'menu', // menu, playing, won, lost
    score: 0,
    level: 1,
    problemsCompleted: 0,
    targetNumber: null,
    revealedDigits: []
  });

  const startGame = () => {
    generateNewProblem();
    setGameState(prev => ({
      ...prev,
      gameStatus: 'playing',
      score: 0,
      level: 1,
      problemsCompleted: 0,
      wrongGuesses: 0,
      answeredProblems: []
    }));
  };

  const generateNewProblem = () => {
    const difficulty = user?.age <= 7 ? 'easy' : user?.age <= 9 ? 'medium' : 'hard';
    const operations = ['addition', 'subtraction', 'multiplication', 'division'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    const problem = generateMathProblem(operation, difficulty, user?.age || 8);
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

    // Create target number with hidden digits
    const targetNumber = correctAnswer.toString();
    const revealedDigits = new Array(targetNumber.length).fill(false);

    setGameState(prev => ({
      ...prev,
      currentProblem: problem,
      correctAnswer,
      wrongAnswers,
      targetNumber,
      revealedDigits
    }));
  };

  const handleAnswerClick = (answer) => {
    if (gameState.answeredProblems.includes(gameState.currentProblem.question)) {
      return;
    }

    const isCorrect = answer === gameState.correctAnswer;
    
    if (isCorrect) {
      playSound('correct');
      
      // Reveal a digit
      const unrevealedIndices = gameState.revealedDigits
        .map((revealed, index) => revealed ? null : index)
        .filter(index => index !== null);
      
      if (unrevealedIndices.length > 0) {
        const randomIndex = unrevealedIndices[Math.floor(Math.random() * unrevealedIndices.length)];
        const newRevealedDigits = [...gameState.revealedDigits];
        newRevealedDigits[randomIndex] = true;
        
        setGameState(prev => ({
          ...prev,
          revealedDigits: newRevealedDigits,
          answeredProblems: [...prev.answeredProblems, prev.currentProblem.question],
          problemsCompleted: prev.problemsCompleted + 1,
          score: prev.score + 100
        }));

        // Check if all digits are revealed
        if (newRevealedDigits.every(digit => digit)) {
          setTimeout(() => {
            setGameState(prev => ({ ...prev, gameStatus: 'won' }));
            addCoins(50);
            addXP(75);
            confetti({
              particleCount: 200,
              spread: 70,
              origin: { y: 0.6 }
            });
          }, 1000);
        } else {
          // Generate new problem after short delay
          setTimeout(() => {
            generateNewProblem();
          }, 1500);
        }
      }
    } else {
      playSound('incorrect');
      const newWrongGuesses = gameState.wrongGuesses + 1;
      
      setGameState(prev => ({
        ...prev,
        wrongGuesses: newWrongGuesses,
        answeredProblems: [...prev.answeredProblems, prev.currentProblem.question]
      }));
      
      if (newWrongGuesses >= gameState.maxWrongGuesses) {
        setGameState(prev => ({ ...prev, gameStatus: 'lost' }));
      } else {
        // Generate new problem after short delay
        setTimeout(() => {
          generateNewProblem();
        }, 1500);
      }
    }
  };

  const renderHangman = () => {
    const parts = [
      // Head
      <circle key="head" cx="50" cy="20" r="8" stroke="#8B4513" strokeWidth="2" fill="none" />,
      // Body
      <line key="body" x1="50" y1="28" x2="50" y2="65" stroke="#8B4513" strokeWidth="2" />,
      // Left arm
      <line key="leftArm" x1="50" y1="40" x2="35" y2="55" stroke="#8B4513" strokeWidth="2" />,
      // Right arm
      <line key="rightArm" x1="50" y1="40" x2="65" y2="55" stroke="#8B4513" strokeWidth="2" />,
      // Left leg
      <line key="leftLeg" x1="50" y1="65" x2="35" y2="80" stroke="#8B4513" strokeWidth="2" />,
      // Right leg
      <line key="rightLeg" x1="50" y1="65" x2="65" y2="80" stroke="#8B4513" strokeWidth="2" />
    ];

    return (
      <svg width="100" height="100" className="mx-auto">
        {/* Gallows */}
        <line x1="10" y1="90" x2="60" y2="90" stroke="#8B4513" strokeWidth="4" />
        <line x1="20" y1="90" x2="20" y2="10" stroke="#8B4513" strokeWidth="4" />
        <line x1="20" y1="10" x2="50" y2="10" stroke="#8B4513" strokeWidth="4" />
        <line x1="50" y1="10" x2="50" y2="12" stroke="#8B4513" strokeWidth="2" />
        
        {/* Body parts based on wrong guesses */}
        {parts.slice(0, gameState.wrongGuesses).map((part, index) => (
          <motion.g
            key={index}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 500 }}
          >
            {part}
          </motion.g>
        ))}
      </svg>
    );
  };

  const renderNumber = () => {
    if (!gameState.targetNumber) return null;

    return gameState.targetNumber.split('').map((digit, index) => (
      <motion.div
        key={index}
        className="w-16 h-20 border-4 border-blue-400 rounded-xl flex items-center justify-center mx-2 bg-white shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <span className="text-4xl font-bold text-blue-800">
          {gameState.revealedDigits[index] ? digit : '?'}
        </span>
      </motion.div>
    ));
  };

  if (gameState.gameStatus === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-6 flex items-center justify-center">
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
              🔢
            </motion.div>
            
            <h1 className="text-4xl font-bold text-gray-800 mb-4">{t('hangmanMath')}</h1>
            <p className="text-gray-600 mb-8">
              {t('solveToReveal')}
            </p>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-700 mb-4">How to play:</h2>
              <div className="space-y-2 text-sm text-gray-600 text-left">
                <div>🎯 {t('hangmanHint')}</div>
                <div>🔢 Reveal digits by solving correctly</div>
                <div>❌ Wrong answers add body parts</div>
                <div>🏆 Reveal all digits to win!</div>
              </div>
            </div>

            <motion.button
              onClick={startGame}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🔢 {t('start')} {t('hangmanMath')}!
            </motion.button>

            <motion.button
              onClick={() => navigate('/mini-games')}
              className="w-full mt-4 py-3 bg-gray-500 text-white font-bold rounded-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('back')} to Games
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Game Header */}
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{gameState.score}</div>
                <div className="text-sm text-gray-600">Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">{gameState.problemsCompleted}</div>
                <div className="text-sm text-gray-600">Problems</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{gameState.level}</div>
                <div className="text-sm text-gray-600">Level</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{gameState.wrongGuesses}/{gameState.maxWrongGuesses}</div>
                <div className="text-sm text-gray-600">Wrong</div>
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
          <div className="grid md:grid-cols-2 gap-8">
            {/* Hangman Drawing */}
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Save the stick figure!</h3>
              <div className="bg-gray-100 rounded-xl p-6 mb-4">
                {renderHangman()}
              </div>
              
              {/* Secret Number */}
              <div className="mb-4">
                <h4 className="text-lg font-bold text-blue-800 mb-3">Secret Number:</h4>
                <div className="flex justify-center">
                  {renderNumber()}
                </div>
              </div>
              
              <div className="text-lg font-bold text-red-600">
                {gameState.maxWrongGuesses - gameState.wrongGuesses} guesses left
              </div>
            </div>

            {/* Math Problem */}
            <div className="text-center">
              {gameState.currentProblem && (
                <>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">{t('mathProblem')}</h3>
                  
                  <div className="bg-blue-100 rounded-xl p-6 mb-6">
                    <div className="text-4xl font-bold text-blue-800 mb-4">
                      {gameState.currentProblem.question} = ?
                    </div>
                  </div>

                  <h4 className="text-lg font-bold text-gray-700 mb-4">{t('selectAnswer')}</h4>
                  
                  {/* Answer Options */}
                  <div className="grid grid-cols-2 gap-4">
                    {[gameState.correctAnswer, ...gameState.wrongAnswers]
                      .sort(() => Math.random() - 0.5)
                      .map((answer, index) => {
                        const isAnswered = gameState.answeredProblems.includes(gameState.currentProblem.question);
                        
                        return (
                          <motion.button
                            key={answer}
                            onClick={() => handleAnswerClick(answer)}
                            disabled={isAnswered}
                            className={`p-4 rounded-xl font-bold text-xl transition-all ${
                              isAnswered 
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                            }`}
                            whileHover={!isAnswered ? { scale: 1.05 } : {}}
                            whileTap={!isAnswered ? { scale: 0.95 } : {}}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            {answer}
                          </motion.button>
                        );
                      })}
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Game Over Modals */}
        <AnimatePresence>
          {(gameState.gameStatus === 'won' || gameState.gameStatus === 'lost') && (
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
                {gameState.gameStatus === 'won' ? (
                  <>
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="text-3xl font-bold text-green-600 mb-4">{t('youWin')}!</h2>
                    <p className="text-gray-600 mb-4">
                      {t('fantastic')} The secret number was: <span className="font-bold text-2xl text-blue-600">{gameState.targetNumber}</span>
                    </p>
                    <div className="text-lg text-green-600 mb-6">
                      +{gameState.score} points • +50 coins • +75 XP
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-6xl mb-4">😢</div>
                    <h2 className="text-3xl font-bold text-red-600 mb-4">{t('gameOver')}!</h2>
                    <p className="text-gray-600 mb-6">
                      The secret number was: <span className="font-bold text-2xl text-blue-600">{gameState.targetNumber}</span>
                    </p>
                  </>
                )}
                
                <div className="space-y-3">
                  <motion.button
                    onClick={startGame}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-8 rounded-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {t('play')} Again
                  </motion.button>
                  
                  <motion.button
                    onClick={() => navigate('/mini-games')}
                    className="w-full bg-gray-500 text-white font-bold py-3 px-8 rounded-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {t('back')} to Games
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

export default HangmanMath;