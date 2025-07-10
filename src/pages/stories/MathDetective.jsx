import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { useSound } from '../../contexts/SoundContext';
import { useLanguage } from '../../contexts/LanguageContext';
import confetti from 'canvas-confetti';

const MathDetective = () => {
  const navigate = useNavigate();
  const { user, addCoins, addXP } = useUser();
  const { playSound } = useSound();
  const { t } = useLanguage();
  
  const [currentScene, setCurrentScene] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showProblem, setShowProblem] = useState(false);
  const [cluesFound, setCluesFound] = useState(0);

  const story = [
    {
      id: 0,
      text: t('mathDetectiveStory1'),
      character: "🕵️",
      background: "from-gray-400 to-gray-600",
      action: "next"
    },
    {
      id: 1,
      text: t('mathDetectiveStory2'),
      character: "📝",
      background: "from-blue-400 to-blue-600",
      action: "problem",
      problem: {
        question: "15 - 7",
        answer: 8,
        operation: "subtraction"
      },
      hint: "This is subtraction - take away the returned items!"
    },
    {
      id: 2,
      text: t('mathDetectiveStory3'),
      character: "📹",
      background: "from-green-400 to-green-600",
      action: "problem",
      problem: {
        question: "45 - 12",
        answer: 33,
        operation: "subtraction"
      },
      hint: "Subtract the time they were away!"
    },
    {
      id: 3,
      text: t('mathDetectiveStory4'),
      character: "👣",
      background: "from-purple-400 to-purple-600",
      action: "problem",
      problem: {
        question: "3 × 4",
        answer: 12,
        operation: "multiplication"
      },
      hint: "Multiply the number of rooms by footprints per room!"
    },
    {
      id: 4,
      text: t('mathDetectiveStory5'),
      character: "🔍",
      background: "from-red-400 to-red-600",
      action: "problem",
      problem: {
        question: "24 ÷ 3",
        answer: 8,
        operation: "division"
      },
      hint: "Divide to find the room number!"
    },
    {
      id: 5,
      text: t('mathDetectiveStory6'),
      character: "🏆",
      background: "from-yellow-400 to-yellow-600",
      action: "complete"
    }
  ];

  const currentStory = story[currentScene];

  const handleNext = () => {
    playSound('click');
    if (currentScene < story.length - 1) {
      setCurrentScene(currentScene + 1);
      setUserAnswer('');
      setFeedback('');
      setShowProblem(false);
    }
  };

  const handleProblem = () => {
    setShowProblem(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;

    const userAnswerNum = parseInt(userAnswer);
    const correctAnswer = currentStory.problem.answer;

    if (userAnswerNum === correctAnswer) {
      playSound('correct');
      setFeedback(t('correct') + " Excellent detective work! 🕵️‍♂️");
      addCoins(15);
      addXP(25);
      setCluesFound(cluesFound + 1);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setTimeout(() => {
        handleNext();
      }, 2000);
    } else {
      playSound('incorrect');
      setFeedback(`${t('incorrect')} ${currentStory.hint || 'Try again, detective!'}`);
    }
  };

  const handleComplete = () => {
    addCoins(50);
    addXP(100);
    confetti({
      particleCount: 200,
      spread: 70,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      navigate('/stories');
    }, 3000);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentStory.background} p-4 flex items-center justify-center`}>
      <motion.div
        className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Story Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>{t('mathDetective')}</span>
            <span>{currentScene + 1} / {story.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="h-2 bg-gradient-to-r from-gray-500 to-blue-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentScene + 1) / story.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Character */}
        <motion.div
          className="text-center mb-6"
          animate={{
            scale: [1, 1.1, 1],
            y: [0, -10, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <div className="text-8xl mb-4">{currentStory.character}</div>
        </motion.div>

        {/* Story Text */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-xl text-gray-800 leading-relaxed mb-4">
            {currentStory.text}
          </p>
        </motion.div>

        {/* Problem Section */}
        <AnimatePresence>
          {showProblem && currentStory.action === 'problem' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gray-50 rounded-2xl p-6 mb-6"
            >
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-gray-800 mb-2">
                  {currentStory.problem.question} = ?
                </div>
                <div className="text-sm text-gray-600">
                  {t('solveToReveal')}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="w-full text-center text-2xl font-bold py-3 px-4 rounded-xl border-2 border-gray-300 focus:border-gray-500 focus:outline-none"
                  placeholder="Your answer"
                  autoFocus
                />
                <motion.button
                  type="submit"
                  className="w-full bg-gradient-to-r from-gray-500 to-blue-500 text-white font-bold py-3 px-6 rounded-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!userAnswer.trim()}
                >
                  Solve the Mystery! 🕵️‍♂️
                </motion.button>
              </form>

              {feedback && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`mt-4 text-center p-3 rounded-xl ${
                    feedback.includes('Correct') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {feedback}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          {currentStory.action === 'next' && (
            <motion.button
              onClick={handleNext}
              className="bg-gradient-to-r from-gray-500 to-blue-500 text-white font-bold py-3 px-8 rounded-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('continue')} →
            </motion.button>
          )}

          {currentStory.action === 'problem' && !showProblem && (
            <motion.button
              onClick={handleProblem}
              className="bg-gradient-to-r from-gray-500 to-blue-500 text-white font-bold py-3 px-8 rounded-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Examine the Clue! 🔍
            </motion.button>
          )}

          {currentStory.action === 'complete' && (
            <motion.button
              onClick={handleComplete}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-3 px-8 rounded-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Case Solved! 🏆
            </motion.button>
          )}
        </div>

        {/* Clues Counter */}
        {cluesFound > 0 && (
          <motion.div
            className="mt-6 text-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500 }}
          >
            <div className="inline-flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full">
              <span className="text-gray-600">🔍</span>
              <span className="font-bold text-gray-800">Clues Found: {cluesFound}</span>
            </div>
          </motion.div>
        )}

        {/* Back Button */}
        <motion.button
          onClick={() => navigate('/stories')}
          className="absolute top-4 left-4 bg-gray-500 text-white p-2 rounded-full"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          ←
        </motion.button>
      </motion.div>
    </div>
  );
};

export default MathDetective;