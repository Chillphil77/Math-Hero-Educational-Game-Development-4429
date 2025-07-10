import React from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import { useLanguage } from '../contexts/LanguageContext';
import GameCard from '../components/GameCard';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiGamepad2, FiZap, FiTarget, FiGrid, FiShuffle, FiCpu, FiPuzzle, FiEdit3, FiPieChart, FiTruck } = FiIcons;

const MiniGames = () => {
  const { user } = useUser();
  const { t } = useLanguage();

  const games = [
    {
      title: 'Math Racer',
      description: 'Drive your car to collect correct answers! Avoid the wrong ones in this exciting racing game.',
      icon: FiTruck,
      path: '/games/math-racer',
      premium: false,
      difficulty: 'medium',
      estimatedTime: '5-10 min',
      color: 'red'
    },
    {
      title: 'Math Puzzles',
      description: 'Solve challenging math problems against the clock! Perfect for building speed and accuracy.',
      icon: FiPuzzle,
      path: '/games/math-puzzles',
      premium: false,
      difficulty: 'medium',
      estimatedTime: '5-10 min',
      color: 'indigo'
    },
    {
      title: t('pizzaFractions'),
      description: 'Learn fractions by cutting and sharing pizza! Visual learning with delicious examples.',
      icon: FiPieChart,
      path: '/games/pizza-fractions',
      premium: false,
      difficulty: 'easy',
      estimatedTime: '8-12 min',
      color: 'orange'
    },
    {
      title: t('hangmanMath'),
      description: 'Guess math words letter by letter! Save the stick figure by solving before time runs out.',
      icon: FiEdit3,
      path: '/games/hangman',
      premium: false,
      difficulty: 'medium',
      estimatedTime: '5-8 min',
      color: 'purple'
    },
    {
      title: t('pacmanMath'),
      description: 'Navigate Pac-Man through a maze, collecting correct answers while avoiding wrong ones!',
      icon: FiZap,
      path: '/games/pacman',
      premium: false,
      difficulty: 'medium',
      estimatedTime: '5-10 min',
      color: 'yellow'
    },
    {
      title: t('memoryGame'),
      description: 'Match math problems with their correct answers in this memory challenge!',
      icon: FiGrid,
      path: '/games/memory',
      premium: false,
      difficulty: 'easy',
      estimatedTime: '5-8 min',
      color: 'blue'
    },
    {
      title: t('slotMachine'),
      description: 'Solve math problems to spin the slot machine and win coins and prizes!',
      icon: FiTarget,
      path: '/games/slot-machine',
      premium: false,
      difficulty: 'easy',
      estimatedTime: '3-5 min',
      color: 'purple'
    },
    {
      title: t('battleshipMath'),
      description: 'Sink enemy ships by solving math problems to find coordinates!',
      icon: FiShuffle,
      path: '/games/battleship',
      premium: false, // No longer premium
      difficulty: 'hard',
      estimatedTime: '10-15 min',
      color: 'red'
    },
    {
      title: t('sudokuGame'),
      description: 'Fill the grid with numbers using math clues and logic!',
      icon: FiCpu,
      path: '/games/sudoku',
      premium: false, // No longer premium
      difficulty: 'hard',
      estimatedTime: '15-20 min',
      color: 'indigo'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-center space-x-4 mb-4">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <SafeIcon icon={FiGamepad2} className="w-12 h-12 text-purple-600" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-800">Mini Games</h1>
          <motion.div
            animate={{ rotate: [0, -360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <SafeIcon icon={FiGamepad2} className="w-12 h-12 text-blue-600" />
          </motion.div>
        </div>
        <p className="text-xl text-gray-600">
          Learn math through fun and engaging games! 🎮
        </p>
      </motion.div>

      {/* Player Stats */}
      <motion.div
        className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-6 text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Your Gaming Stats 🏆</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold">{user?.stats?.gamesPlayed || 0}</div>
                <div className="text-sm opacity-90">Games Played</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold flex items-center justify-center space-x-1">
                  <span className="text-2xl">🪙</span>
                  <span>{user?.coins || 0}</span>
                </div>
                <div className="text-sm opacity-90">Coins Earned</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{user?.level || 1}</div>
                <div className="text-sm opacity-90">Current Level</div>
              </div>
            </div>
          </div>
          <motion.div
            className="text-6xl"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🎮
          </motion.div>
        </div>
      </motion.div>

      {/* All Games Available */}
      <div>
        <motion.h2
          className="text-3xl font-bold text-gray-800 mb-6 flex items-center space-x-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span>🎮</span>
          <span>All Games Available</span>
          <motion.span
            className="bg-green-400 text-green-900 text-sm px-3 py-1 rounded-full font-bold"
            animate={{ pulse: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ALL FREE!
          </motion.span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game, index) => (
            <motion.div
              key={game.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <GameCard {...game} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Coming Soon */}
      <motion.div
        className="bg-gray-100 rounded-3xl p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="text-6xl mb-4">🚧</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">More Games Coming Soon!</h3>
        <p className="text-gray-600">
          We're working on exciting new math games. Stay tuned for updates!
        </p>
      </motion.div>
    </div>
  );
};

export default MiniGames;