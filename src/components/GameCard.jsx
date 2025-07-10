import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSound } from '../contexts/SoundContext';
import SafeIcon from '../common/SafeIcon';

const GameCard = ({
  title,
  description,
  icon,
  path,
  premium = false,
  difficulty = 'medium',
  estimatedTime = '5-10 min',
  color = 'blue'
}) => {
  const navigate = useNavigate();
  const { playSound } = useSound();

  const colorClasses = {
    blue: 'from-blue-400 to-blue-600',
    green: 'from-green-400 to-green-600',
    purple: 'from-purple-400 to-purple-600',
    pink: 'from-pink-400 to-pink-600',
    orange: 'from-orange-400 to-orange-600',
    red: 'from-red-400 to-red-600',
    yellow: 'from-yellow-400 to-yellow-600',
    indigo: 'from-indigo-400 to-indigo-600'
  };

  const handlePlay = () => {
    // Remove premium restrictions - all games are free
    playSound('click');
    navigate(path);
  };

  return (
    <motion.div
      className="relative bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:shadow-2xl"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handlePlay}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header with gradient */}
      <div className={`h-32 bg-gradient-to-br ${colorClasses[color]} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-white opacity-10">
          <div className="absolute top-2 right-2 w-20 h-20 bg-white rounded-full opacity-20"></div>
          <div className="absolute bottom-2 left-2 w-16 h-16 bg-white rounded-full opacity-20"></div>
        </div>

        {/* Game Icon */}
        <div className="absolute top-4 left-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
          <SafeIcon icon={icon} className="w-6 h-6 text-gray-700" />
        </div>

        {/* Free Badge instead of Premium */}
        <div className="absolute top-4 right-4">
          <motion.div
            className="bg-green-400 text-green-900 px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <span>✨</span>
            <span>FREE</span>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{description}</p>

        {/* Game Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <span>🎯</span>
            <span className="capitalize">{difficulty}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>⏱️</span>
            <span>{estimatedTime}</span>
          </div>
        </div>

        {/* Play Button */}
        <motion.button
          className={`w-full py-3 rounded-xl font-bold text-white transition-all duration-200 bg-gradient-to-r ${colorClasses[color]} hover:shadow-lg active:scale-95`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          🎮 Play Now
        </motion.button>
      </div>
    </motion.div>
  );
};

export default GameCard;