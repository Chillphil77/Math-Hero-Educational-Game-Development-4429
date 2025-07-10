import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { useSound } from '../../contexts/SoundContext';
import { useLanguage } from '../../contexts/LanguageContext';
import confetti from 'canvas-confetti';

const BakeryFractions = () => {
  const navigate = useNavigate();
  const { user, addCoins, addXP } = useUser();
  const { playSound } = useSound();
  const { t } = useLanguage();
  
  const [currentScene, setCurrentScene] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showProblem, setShowProblem] = useState(false);
  const [recipesCompleted, setRecipesCompleted] = useState(0);

  const story = [
    {
      id: 0,
      text: t('bakeryFractionsStory1'),
      character: "🧁",
      background: "from-pink-400 to-pink-600",
      action: "next"
    },
    {
      id: 1,
      text: t('bakeryFractionsStory2'),
      character: "🧁",
      background: "from-yellow-400 to-yellow-600",
      action: "problem",
      problem: {
        question: "Fill ___ of the cup",
        answer: "1/2",
        operation: "fractions",
        visual: "half_cup"
      },
      hint: "Half means 1 out of 2 equal parts!"
    },
    {
      id: 2,
      text: t('bakeryFractionsStory3'),
      character: "🍪",
      background: "from-brown-400 to-brown-600",
      action: "problem",
      problem: {
        question: "Fill ___ fourths",
        answer: "3",
        operation: "fractions",
        visual: "three_fourths"
      },
      hint: "3/4 means 3 out of 4 equal parts!"
    },
    {
      id: 3,
      text: t('bakeryFractionsStory4'),
      character: "🎂",
      background: "from-purple-400 to-purple-600",
      action: "problem",
      problem: {
        question: "Fill ___ thirds",
        answer: "2",
        operation: "fractions",
        visual: "two_thirds"
      },
      hint: "2/3 means 2 out of 3 equal parts!"
    },
    {
      id: 4,
      text: t('bakeryFractionsStory5'),
      character: "🥧",
      background: "from-orange-400 to-orange-600",
      action: "problem",
      problem: {
        question: "Fill ___ quarter",
        answer: "1",
        operation: "fractions",
        visual: "one_fourth"
      },
      hint: "1/4 means 1 out of 4 equal parts!"
    },
    {
      id: 5,
      text: t('bakeryFractionsStory6'),
      character: "👑",
      background: "from-rainbow-400 to-rainbow-600",
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
    const userAnswerClean = userAnswer.trim().toLowerCase();
    const isCorrect = userAnswerClean === correctAnswer.toLowerCase() || 
                     userAnswerClean === correctAnswer;

    if (isCorrect) {
      playSound('correct');
      setFeedback(t('correct') + " Perfect baking! 👩‍🍳");
      addCoins(20);
      addXP(35);
      setRecipesCompleted(recipesCompleted + 1);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFB6C1', '#FFA500', '#8B4513'] // Bakery colors
      });

      setTimeout(() => {
        handleNext();
      }, 2000);
    } else {
      playSound('incorrect');
      setFeedback(`${t('incorrect')} ${currentStory.hint || 'Try again, baker!'}`);
    }
  };

  const handleComplete = () => {
    addCoins(80);
    addXP(150);
    confetti({
      particleCount: 200,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FFA500', '#FF6347']
    });

    setTimeout(() => {
      navigate('/stories');
    }, 3000);
  };

  const renderVisual = (visualType) => {
    switch (visualType) {
      case 'half_cup':
        return (
          <div className="flex justify-center mb-4">
            <div className="w-24 h-32 border-4 border-gray-400 rounded-b-lg relative bg-white">
              <div className="absolute bottom-0 w-full h-1/2 bg-yellow-300 rounded-b-lg"></div>
              <div className="absolute top-1/2 left-0 right-0 border-t-2 border-gray-400"></div>
              <div className="text-center text-xs mt-1">1/2</div>
            </div>
          </div>
        );
      case 'three_fourths':
        return (
          <div className="flex justify-center mb-4">
            <div className="w-24 h-32 border-4 border-gray-400 rounded-b-lg relative bg-white">
              <div className="absolute bottom-0 w-full h-3/4 bg-brown-300 rounded-b-lg"></div>
              <div className="absolute top-1/4 left-0 right-0 border-t-2 border-gray-400"></div>
              <div className="absolute top-2/4 left-0 right-0 border-t-2 border-gray-400"></div>
              <div className="absolute top-3/4 left-0 right-0 border-t-2 border-gray-400"></div>
              <div className="text-center text-xs mt-1">3/4</div>
            </div>
          </div>
        );
      case 'two_thirds':
        return (
          <div className="flex justify-center mb-4">
            <div className="w-24 h-32 border-4 border-gray-400 rounded-b-lg relative bg-white">
              <div className="absolute bottom-0 w-full h-2/3 bg-blue-200 rounded-b-lg"></div>
              <div className="absolute top-1/3 left-0 right-0 border-t-2 border-gray-400"></div>
              <div className="absolute top-2/3 left-0 right-0 border-t-2 border-gray-400"></div>
              <div className="text-center text-xs mt-1">2/3</div>
            </div>
          </div>
        );
      case 'one_fourth':
        return (
          <div className="flex justify-center mb-4">
            <div className="w-24 h-32 border-4 border-gray-400 rounded-b-lg relative bg-white">
              <div className="absolute bottom-0 w-full h-1/4 bg-orange-300 rounded-b-lg"></div>
              <div className="absolute top-1/4 left-0 right-0 border-t-2 border-gray-400"></div>
              <div className="absolute top-2/4 left-0 right-0 border-t-2 border-gray-400"></div>
              <div className="absolute top-3/4 left-0 right-0 border-t-2 border-gray-400"></div>
              <div className="text-center text-xs mt-1">1/4</div>
            </div>
          </div>
        );
      default:
        return null;
    }
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
            <span>{t('bakeryFractions')}</span>
            <span>{currentScene + 1} / {story.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="h-2 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full"
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
              className="bg-pink-50 rounded-2xl p-6 mb-6"
            >
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-pink-800 mb-2">
                  {currentStory.problem.question}
                </div>
                <div className="text-sm text-pink-600">
                  Look at the measuring cup and enter your answer!
                </div>
              </div>

              {/* Visual Aid */}
              {currentStory.problem.visual && renderVisual(currentStory.problem.visual)}

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="w-full text-center text-2xl font-bold py-3 px-4 rounded-xl border-2 border-pink-300 focus:border-pink-500 focus:outline-none"
                  placeholder="Enter fraction (like 1/2 or just the number)"
                  autoFocus
                />
                <motion.button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white font-bold py-3 px-6 rounded-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!userAnswer.trim()}
                >
                  Mix the Ingredients! 🥄
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
              className="bg-gradient-to-r from-pink-500 to-orange-500 text-white font-bold py-3 px-8 rounded-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('continue')} →
            </motion.button>
          )}

          {currentStory.action === 'problem' && !showProblem && (
            <motion.button
              onClick={handleProblem}
              className="bg-gradient-to-r from-pink-500 to-orange-500 text-white font-bold py-3 px-8 rounded-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Measuring! 📏
            </motion.button>
          )}

          {currentStory.action === 'complete' && (
            <motion.button
              onClick={handleComplete}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-3 px-8 rounded-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Bakery Complete! 🏆
            </motion.button>
          )}
        </div>

        {/* Recipe Counter */}
        {recipesCompleted > 0 && (
          <motion.div
            className="mt-6 text-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500 }}
          >
            <div className="inline-flex items-center space-x-2 bg-pink-100 px-4 py-2 rounded-full">
              <span className="text-pink-600">🧁</span>
              <span className="font-bold text-pink-800">Recipes Completed: {recipesCompleted}</span>
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

export default BakeryFractions;