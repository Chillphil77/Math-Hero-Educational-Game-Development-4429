import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useLanguage } from '../contexts/LanguageContext';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();
  const { t } = useLanguage();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <motion.div
        className="text-center max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Hero Character */}
        <motion.div
          className="mb-8"
          animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="text-9xl mb-4">🦸‍♂️</div>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-6xl md:text-8xl font-bold text-white mb-6 font-kid"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Math Hero
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-2xl md:text-3xl text-white mb-8 font-light"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Transform Learning Into an Epic Adventure! 🚀
        </motion.p>

        {/* Features */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-2xl p-6 text-white">
            <div className="text-4xl mb-3">🎮</div>
            <h3 className="text-xl font-bold mb-2">Fun Games</h3>
            <p className="text-sm">Play exciting math games like Pac-Man Math, Memory Pairs, and more!</p>
          </div>
          <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-2xl p-6 text-white">
            <div className="text-4xl mb-3">🏆</div>
            <h3 className="text-xl font-bold mb-2">Earn Rewards</h3>
            <p className="text-sm">Collect coins, unlock achievements, and climb the leaderboard!</p>
          </div>
          <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-2xl p-6 text-white">
            <div className="text-4xl mb-3">🌟</div>
            <h3 className="text-xl font-bold mb-2">Level Up</h3>
            <p className="text-sm">Progress through levels and become the ultimate Math Hero!</p>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.button
          onClick={handleGetStarted}
          className="bg-white text-purple-600 font-bold text-2xl px-12 py-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🚀 Start Your Adventure!
        </motion.button>

        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl"
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                opacity: 0.7
              }}
              animate={{
                y: [0, -30, 0],
                rotate: [0, 360],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            >
              {['🔢', '➕', '➖', '✖️', '➗', '🎯', '⭐', '🏆'][Math.floor(Math.random() * 8)]}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Home;