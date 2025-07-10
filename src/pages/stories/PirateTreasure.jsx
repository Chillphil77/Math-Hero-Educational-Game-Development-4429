import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { useSound } from '../../contexts/SoundContext';
import { useLanguage } from '../../contexts/LanguageContext';
import confetti from 'canvas-confetti';

const PirateTreasure = () => {
  const navigate = useNavigate();
  const { user, addCoins, addXP } = useUser();
  const { playSound } = useSound();
  const { t } = useLanguage();

  const [currentScene, setCurrentScene] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showProblem, setShowProblem] = useState(false);
  const [treasureFound, setTreasureFound] = useState(0);

  const story = [
    {
      id: 0,
      text: t('pirateTreasureStory1'),
      character: "🏴‍☠️",
      background: "from-blue-400 to-blue-600",
      action: "next"
    },
    {
      id: 1,
      text: t('pirateTreasureStory2'),
      character: "🏴‍☠️",
      background: "from-blue-400 to-blue-600",
      action: "problem",
      problem: {
        question: "24 ÷ 3",
        answer: 8,
        operation: "division"
      },
      hint: "Think about sharing equally!"
    },
    {
      id: 2,
      text: t('pirateTreasureStory3'),
      character: "🗺️",
      background: "from-green-400 to-green-600",
      action: "next"
    },
    {
      id: 3,
      text: t('pirateTreasureStory4'),
      character: "🗺️",
      background: "from-green-400 to-green-600",
      action: "problem",
      problem: {
        question: "X: 5 + 3, Y: 6 + 2",
        answer: 82, // 8 and 8, answer as 82 for both
        operation: "addition"
      },
      hint: "Add the numbers for X and Y coordinates!"
    },
    {
      id: 4,
      text: t('pirateTreasureStory5'),
      character: "⛏️",
      background: "from-yellow-400 to-yellow-600",
      action: "next"
    },
    {
      id: 5,
      text: t('pirateTreasureStory6'),
      character: "📦",
      background: "from-purple-400 to-purple-600",
      action: "problem",
      problem: {
        question: "3 × 4",
        answer: 12,
        operation: "multiplication"
      },
      hint: "Multiply to unlock the chest!"
    },
    {
      id: 6,
      text: t('pirateTreasureStory7'),
      character: "💰",
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

    const correctAnswer = currentStory.problem.answer;
    let userAnswerNum;

    // Handle coordinate problem (scene 3)
    if (currentScene === 3) {
      // For coordinates, we expect "8,8" or "8 8" or just "88"
      const cleaned = userAnswer.replace(/[,\s]/g, '');
      userAnswerNum = parseInt(cleaned);
    } else {
      userAnswerNum = parseInt(userAnswer);
    }

    if (userAnswerNum === correctAnswer) {
      playSound('correct');
      setFeedback(t('correct') + " Well done, pirate! 🎉");
      
      // Reward coins and XP
      addCoins(15);
      addXP(25);
      setTreasureFound(treasureFound + 1);

      // Confetti effect
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Move to next scene after delay
      setTimeout(() => {
        handleNext();
      }, 2000);
    } else {
      playSound('incorrect');
      setFeedback(`${t('incorrect')} Try again. ${currentStory.hint || ''}`);
    }
  };

  const handleComplete = () => {
    // Final rewards
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
            <span>{t('pirateTreasure')}</span>
            <span>{currentScene + 1} / {story.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentScene + 1) / story.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Character */}
        <motion.div
          className="text-center mb-6"
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
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
              className="bg-blue-50 rounded-2xl p-6 mb-6"
            >
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-blue-800 mb-2">
                  {currentStory.problem.question}
                </div>
                {currentScene === 3 && (
                  <div className="text-sm text-blue-600">
                    Enter coordinates as "8,8" or "88"
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="w-full text-center text-2xl font-bold py-3 px-4 rounded-xl border-2 border-blue-300 focus:border-blue-500 focus:outline-none"
                  placeholder={currentScene === 3 ? "8,8" : "Your answer"}
                  autoFocus
                />
                <motion.button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-3 px-6 rounded-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!userAnswer.trim()}
                >
                  Submit Answer
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
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-8 rounded-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('continue')} Adventure →
            </motion.button>
          )}

          {currentStory.action === 'problem' && !showProblem && (
            <motion.button
              onClick={handleProblem}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-3 px-8 rounded-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Solve the Problem 🧮
            </motion.button>
          )}

          {currentStory.action === 'complete' && (
            <motion.button
              onClick={handleComplete}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-3 px-8 rounded-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Claim Your Treasure! 💰
            </motion.button>
          )}
        </div>

        {/* Treasure Counter */}
        {treasureFound > 0 && (
          <motion.div
            className="mt-6 text-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500 }}
          >
            <div className="inline-flex items-center space-x-2 bg-yellow-100 px-4 py-2 rounded-full">
              <span className="text-yellow-600">🏆</span>
              <span className="font-bold text-yellow-800">Problems Solved: {treasureFound}</span>
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

export default PirateTreasure;