import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { useSound } from '../../contexts/SoundContext';
import { useLanguage } from '../../contexts/LanguageContext';
import confetti from 'canvas-confetti';

const DinoEggs = () => {
  const navigate = useNavigate();
  const { user, addCoins, addXP } = useUser();
  const { playSound } = useSound();
  const { t } = useLanguage();

  const [currentScene, setCurrentScene] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showProblem, setShowProblem] = useState(false);
  const [eggsFound, setEggsFound] = useState(0);

  const story = [
    {
      id: 0,
      text: t('dinoEggsStory1'),
      character: "🦖",
      background: "from-green-400 to-green-600",
      action: "next"
    },
    {
      id: 1,
      text: t('dinoEggsStory2'),
      character: "🥚",
      background: "from-green-400 to-green-600",
      action: "problem",
      problem: {
        question: "12 ÷ 3",
        answer: 4,
        operation: "division"
      },
      hint: "Think about sharing equally among the nests!"
    },
    {
      id: 2,
      text: t('dinoEggsStory3'),
      character: "🦕",
      background: "from-blue-400 to-blue-600",
      action: "problem",
      problem: {
        question: "6 × 3",
        answer: 18,
        operation: "multiplication"
      },
      hint: "Multiply the number of nests by eggs per nest!"
    },
    {
      id: 3,
      text: t('dinoEggsStory4'),
      character: "🐣",
      background: "from-yellow-400 to-yellow-600",
      action: "problem",
      problem: {
        question: "18 - 5",
        answer: 13,
        operation: "subtraction"
      },
      hint: "Subtract the hatched eggs from the total!"
    },
    {
      id: 4,
      text: t('dinoEggsStory5'),
      character: "🦴",
      background: "from-purple-400 to-purple-600",
      action: "problem",
      problem: {
        question: "2 + 2 + 1",
        answer: 5,
        operation: "addition"
      },
      hint: "Add all the baby dinosaurs together!"
    },
    {
      id: 5,
      text: t('dinoEggsStory6'),
      character: "🌟",
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

    const userAnswerNum = parseInt(userAnswer);
    const correctAnswer = currentStory.problem.answer;

    if (userAnswerNum === correctAnswer) {
      playSound('correct');
      setFeedback(t('correct') + " Tina is so happy! 🎉");
      addCoins(12);
      addXP(20);
      setEggsFound(eggsFound + 1);

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
      setFeedback(`${t('incorrect')} ${currentStory.hint || 'Try again!'}`);
    }
  };

  const handleComplete = () => {
    addCoins(40);
    addXP(80);
    confetti({
      particleCount: 200,
      spread: 70,
      origin: { y: 0.6 }
    });
    setTimeout(() => {
      navigate('/stories');
    }, 3000);
  };

  // Visual eggs for counting
  const renderEggs = (count, nestCount = 0) => {
    if (currentScene === 1 && count === 12) {
      return (
        <div className="grid grid-cols-6 gap-2 max-w-xs mx-auto mb-4">
          {Array.from({ length: count }, (_, i) => (
            <motion.span
              key={i}
              className="text-2xl"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              🥚
            </motion.span>
          ))}
        </div>
      );
    }
    return null;
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
            <span>{t('dinoEggs')}</span>
            <span>{currentScene + 1} / {story.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentScene + 1) / story.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Character */}
        <motion.div
          className="text-center mb-6"
          animate={{ scale: [1, 1.1, 1], y: [0, -10, 0] }}
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

          {/* Visual aids */}
          {currentScene === 1 && renderEggs(12)}
          
          {currentScene === 2 && (
            <div className="flex justify-center space-x-4 mb-4">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl mb-1">🪺</div>
                  <div className="flex space-x-1">
                    {Array.from({ length: 3 }, (_, j) => (
                      <span key={j} className="text-lg">🥚</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Problem Section */}
        <AnimatePresence>
          {showProblem && currentStory.action === 'problem' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-green-50 rounded-2xl p-6 mb-6"
            >
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-green-800 mb-2">
                  {currentStory.problem.question} = ?
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="w-full text-center text-2xl font-bold py-3 px-4 rounded-xl border-2 border-green-300 focus:border-green-500 focus:outline-none"
                  placeholder="Your answer"
                  autoFocus
                />
                <motion.button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-3 px-6 rounded-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!userAnswer.trim()}
                >
                  Help Tina!
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
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-3 px-8 rounded-xl"
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
              Help with Math! 🧮
            </motion.button>
          )}

          {currentStory.action === 'complete' && (
            <motion.button
              onClick={handleComplete}
              className="bg-gradient-to-r from-green-500 to-yellow-500 text-white font-bold py-3 px-8 rounded-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Celebrate with Tina! 🎉
            </motion.button>
          )}
        </div>

        {/* Progress Counter */}
        {eggsFound > 0 && (
          <motion.div
            className="mt-6 text-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500 }}
          >
            <div className="inline-flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full">
              <span className="text-green-600">🥚</span>
              <span className="font-bold text-green-800">Problems Solved: {eggsFound}</span>
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

export default DinoEggs;