import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useSound } from '../contexts/SoundContext';
import GameCard from '../components/GameCard';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTrendingUp, FiAward, FiTarget, FiClock, FiGamepad2, FiBook, FiBookOpen, FiShoppingBag } = FiIcons;

const Dashboard = () => {
  const { user } = useUser();
  const { t } = useLanguage();
  const { playSound } = useSound();
  const navigate = useNavigate();

  const quickActions = [
    {
      title: t('practice'),
      description: 'Practice basic math operations',
      icon: FiBook,
      path: '/practice',
      color: 'green'
    },
    {
      title: t('miniGames'),
      description: 'Play fun math games',
      icon: FiGamepad2,
      path: '/mini-games',
      color: 'purple'
    },
    {
      title: t('stories'),
      description: 'Math adventures await',
      icon: FiBookOpen,
      path: '/stories',
      color: 'orange'
    },
    {
      title: t('shop'),
      description: 'Spend your coins',
      icon: FiShoppingBag,
      path: '/shop',
      color: 'pink'
    }
  ];

  const stats = [
    {
      label: 'Total Problems',
      value: user?.stats?.totalProblems || 0,
      icon: FiTarget,
      color: 'blue'
    },
    {
      label: 'Accuracy',
      value: `${user?.stats?.accuracy || 0}%`,
      icon: FiTrendingUp,
      color: 'green'
    },
    {
      label: 'Current Streak',
      value: user?.streak || 0,
      icon: FiClock,
      color: 'orange'
    },
    {
      label: 'Achievements',
      value: user?.achievements?.length || 0,
      icon: FiAward,
      color: 'purple'
    }
  ];

  const handleQuickAction = (path) => {
    playSound('click');
    navigate(path);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <motion.h1 
                className="text-4xl font-bold mb-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Welcome back, {user?.name}! 👋
              </motion.h1>
              <motion.p 
                className="text-xl opacity-90"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Ready for your next math adventure?
              </motion.p>
            </div>
            <motion.div
              className="text-8xl"
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🦸‍♂️
            </motion.div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-4 right-20 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute bottom-4 left-20 w-24 h-24 bg-white rounded-full"></div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-full bg-${stat.color}-100 flex items-center justify-center`}>
                <SafeIcon icon={stat.icon} className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <motion.div
                className="text-3xl font-bold text-gray-800"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
              >
                {stat.value}
              </motion.div>
            </div>
            <p className="text-gray-600 font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <motion.h2 
          className="text-3xl font-bold text-gray-800 mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          Quick Actions 🚀
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleQuickAction(action.path)}
            >
              <div className={`w-16 h-16 rounded-2xl bg-${action.color}-100 flex items-center justify-center mb-4 mx-auto`}>
                <SafeIcon icon={action.icon} className={`w-8 h-8 text-${action.color}-600`} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">{action.title}</h3>
              <p className="text-gray-600 text-center text-sm">{action.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Achievements */}
      {user?.achievements?.length > 0 && (
        <div>
          <motion.h2 
            className="text-3xl font-bold text-gray-800 mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            Recent Achievements 🏆
          </motion.h2>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {user.achievements.slice(-3).map((achievement, index) => (
                <motion.div
                  key={achievement}
                  className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-xl"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-2xl">🏆</div>
                  <div>
                    <div className="font-bold text-gray-800">{achievement}</div>
                    <div className="text-sm text-gray-600">Achievement unlocked!</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Daily Challenge */}
      <motion.div
        className="bg-gradient-to-r from-green-500 to-blue-500 rounded-3xl p-8 text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Daily Challenge 🎯</h2>
            <p className="text-xl opacity-90 mb-4">
              Complete 10 multiplication problems to earn bonus coins!
            </p>
            <motion.button
              className="bg-white text-green-600 font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/practice')}
            >
              Start Challenge
            </motion.button>
          </div>
          <motion.div
            className="text-6xl"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            🎯
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;