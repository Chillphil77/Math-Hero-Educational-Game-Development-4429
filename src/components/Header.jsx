import React from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useSound } from '../contexts/SoundContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUser, FiSettings, FiVolumeX, FiVolume2, FiLogOut, FiMusic } = FiIcons;

const Header = () => {
  const { user, logout, getAvatarEmoji } = useUser();
  const { language, changeLanguage, t } = useLanguage();
  const { soundEnabled, backgroundMusicEnabled, toggleSound, toggleBackgroundMusic } = useSound();

  if (!user) return null;

  return (
    <motion.header
      className="bg-white shadow-lg border-b-4 border-primary-400 sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">🦸</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Math Hero
            </h1>
          </motion.div>

          {/* User Info */}
          <div className="flex items-center space-x-4">
            {/* Coins with golden effect */}
            <motion.div
              className="flex items-center space-x-2 bg-gradient-to-r from-yellow-100 to-yellow-200 px-3 py-1 rounded-full border border-yellow-300"
              whileHover={{ scale: 1.05 }}
              animate={{ 
                boxShadow: [
                  "0 0 0 0 rgba(255, 215, 0, 0.4)", 
                  "0 0 0 10px rgba(255, 215, 0, 0)", 
                  "0 0 0 0 rgba(255, 215, 0, 0.4)"
                ] 
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.span 
                className="text-yellow-600 text-lg"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🪙
              </motion.span>
              <span className="font-bold text-yellow-800">{user.coins}</span>
            </motion.div>

            {/* Level */}
            <motion.div
              className="flex items-center space-x-2 bg-purple-100 px-3 py-1 rounded-full"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-purple-600 text-lg">⭐</span>
              <span className="font-bold text-purple-800">{t('level')} {user.level}</span>
            </motion.div>

            {/* Avatar */}
            <motion.div
              className="flex items-center space-x-2 bg-blue-100 px-3 py-1 rounded-full"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-2xl">{getAvatarEmoji()}</span>
              <span className="font-bold text-blue-800">{user.name}</span>
            </motion.div>

            {/* Language Selector */}
            <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="en">🇺🇸 EN</option>
              <option value="de">🇩🇪 DE</option>
              <option value="fr">🇫🇷 FR</option>
            </select>

            {/* Background Music Toggle */}
            <motion.button
              onClick={toggleBackgroundMusic}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title={t('backgroundMusic')}
            >
              <SafeIcon 
                icon={FiMusic} 
                className={`w-5 h-5 ${backgroundMusicEnabled ? 'text-green-600' : 'text-gray-600'}`} 
              />
            </motion.button>

            {/* Sound Toggle */}
            <motion.button
              onClick={toggleSound}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title={t('soundEffects')}
            >
              <SafeIcon 
                icon={soundEnabled ? FiVolume2 : FiVolumeX} 
                className="w-5 h-5 text-gray-600" 
              />
            </motion.button>

            {/* Logout */}
            <motion.button
              onClick={logout}
              className="p-2 rounded-full bg-red-100 hover:bg-red-200 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title={t('logout')}
            >
              <SafeIcon icon={FiLogOut} className="w-5 h-5 text-red-600" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;