import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../contexts/GameContext';
import { useSound } from '../contexts/SoundContext';
import { useUser } from '../contexts/UserContext';
import { useLanguage } from '../contexts/LanguageContext';
import confetti from 'canvas-confetti';

const MathProblem = ({ 
  operation = 'addition', 
  difficulty = 'medium', 
  onCorrect, 
  onIncorrect, 
  showMultipleChoice = false, 
  timeLimit = null,
  selectedTable = null 
}) => {
  const { generateMathProblem, generateMultipleChoice } = useGame();
  const { playSound } = useSound();
  const { user, addCoins, addXP } = useUser();
  const { t } = useLanguage();

  const [problem, setProblem] = useState(null);
  const [choices, setChoices] = useState([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    generateNewProblem();
  }, [operation, difficulty, selectedTable]);

  useEffect(() => {
    if (timeLimit && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLimit && timeLeft === 0) {
      handleAnswer(null, true);
    }
  }, [timeLeft, timeLimit]);

  const generateNewProblem = () => {
    let newProblem;
    
    if (operation === 'multiplicationTables' && selectedTable) {
      // Generate specific multiplication table problem
      const factor = Math.floor(Math.random() * 10) + 1; // 1-10
      newProblem = {
        question: `${selectedTable} × ${factor}`,
        answer: selectedTable * factor,
        num1: selectedTable,
        num2: factor,
        operation: 'multiplication'
      };
    } else {
      newProblem = generateMathProblem(operation, difficulty, user?.age || 8);
    }
    
    setProblem(newProblem);

    if (showMultipleChoice) {
      const newChoices = generateMultipleChoice(newProblem.answer);
      setChoices(newChoices);
    }

    setUserAnswer('');
    setFeedback('');
    setIsCorrect(null);
    setTimeLeft(timeLimit);
  };

  const handleAnswer = (answer, isTimeout = false) => {
    const correct = !isTimeout && parseInt(answer) === problem.answer;
    setIsCorrect(correct);

    if (correct) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setFeedback(t('correct'));
      playSound('correct'); 

      // Reward coins and XP with golden coin effect
      const coinReward = 5 + (newStreak > 3 ? 5 : 0);
      addCoins(coinReward);
      addXP(10);

      // Golden confetti effect for coins
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#FFFF00'] // Golden colors
      });

      onCorrect && onCorrect(newStreak);
    } else {
      setStreak(0);
      setFeedback(isTimeout ? 'Time\'s up!' : t('incorrect'));
      playSound('incorrect');
      onIncorrect && onIncorrect();
    }

    // Auto-generate next problem after delay
    setTimeout(() => {
      generateNewProblem();
    }, 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userAnswer.trim()) {
      handleAnswer(userAnswer);
    }
  };

  const handleChoiceClick = (choice) => {
    handleAnswer(choice);
  };

  if (!problem) return null;

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Timer */}
      {timeLimit && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Time Left</span>
            <span className={`font-bold ${timeLeft <= 5 ? 'text-red-500' : 'text-blue-500'}`}>
              {timeLeft}s
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className={`h-2 rounded-full ${timeLeft <= 5 ? 'bg-red-500' : 'bg-blue-500'}`}
              initial={{ width: '100%' }}
              animate={{ width: `${(timeLeft / timeLimit) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      {/* Streak Counter */}
      {streak > 0 && (
        <motion.div
          className="text-center mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500 }}
        >
          <div className="inline-flex items-center space-x-2 bg-yellow-100 px-4 py-2 rounded-full">
            <span className="text-yellow-600">🔥</span>
            <span className="font-bold text-yellow-800">Streak: {streak}</span>
          </div>
        </motion.div>
      )}

      {/* Problem Display */}
      <motion.div
        className="text-center mb-6"
        key={problem.question}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-4xl font-bold text-gray-800 mb-4 font-mono">
          {problem.question} = ?
        </div>

        {/* Visual aids for younger kids */}
        {user?.age <= 8 && problem.operation === 'addition' && problem.num1 <= 10 && problem.num2 <= 10 && (
          <div className="flex justify-center items-center space-x-4 mb-4">
            <div className="flex flex-wrap gap-1">
              {Array.from({ length: problem.num1 }, (_, i) => (
                <motion.span
                  key={i}
                  className="text-2xl"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  🍎
                </motion.span>
              ))}
            </div>
            <span className="text-2xl font-bold text-gray-600">+</span>
            <div className="flex flex-wrap gap-1">
              {Array.from({ length: problem.num2 }, (_, i) => (
                <motion.span
                  key={i}
                  className="text-2xl"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: (problem.num1 + i) * 0.1 }}
                >
                  🍎
                </motion.span>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Answer Input */}
      <AnimatePresence mode="wait">
        {isCorrect === null ? (
          <motion.div
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {showMultipleChoice ? (
              <div className="grid grid-cols-2 gap-3">
                {choices.map((choice, index) => (
                  <motion.button
                    key={choice}
                    onClick={() => handleChoiceClick(choice)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {choice}
                  </motion.button>
                ))}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="w-full text-center text-2xl font-bold py-4 px-6 rounded-xl border-2 border-blue-300 focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Your answer"
                  autoFocus
                />
                <motion.button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!userAnswer.trim()}
                >
                  Submit Answer
                </motion.button>
              </form>
            )}
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
              className={`text-3xl font-bold mb-4 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}
              animate={{
                scale: [1, 1.2, 1],
                rotate: isCorrect ? [0, 10, -10, 0] : [0, -5, 5, 0]
              }}
              transition={{ duration: 0.5 }}
            >
              {isCorrect ? '🎉' : '😅'} {feedback}
            </motion.div>
            
            {!isCorrect && (
              <div className="text-xl text-gray-600 mb-4">
                The answer was: <span className="font-bold text-blue-600">{problem.answer}</span>
              </div>
            )}
            
            {isCorrect && (
              <div className="text-lg text-green-600 mb-4 flex items-center justify-center space-x-2">
                <span className="text-2xl">🪙</span>
                <span>+{5 + (streak > 3 ? 5 : 0)} coins • +10 XP</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MathProblem;