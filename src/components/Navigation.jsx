import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiHome, FiBook, FiGamepad2, FiBookOpen, FiShoppingBag, FiTrendingUp, FiUser, FiStar } = FiIcons;

const Navigation = () => {
  const { t } = useLanguage();
  const { user } = useUser();

  const navItems = [
    { path: '/dashboard', icon: FiHome, label: t('dashboard'), color: 'text-blue-600' },
    { path: '/practice', icon: FiBook, label: t('practice'), color: 'text-green-600' },
    { path: '/mini-games', icon: FiGamepad2, label: t('miniGames'), color: 'text-purple-600' },
    { path: '/stories', icon: FiBookOpen, label: t('stories'), color: 'text-orange-600' },
    { path: '/shop', icon: FiShoppingBag, label: t('shop'), color: 'text-pink-600' },
    { path: '/leaderboard', icon: FiTrendingUp, label: t('leaderboard'), color: 'text-red-600' },
    { path: '/profile', icon: FiUser, label: t('profile'), color: 'text-indigo-600' },
    { path: '/premium', icon: FiStar, label: t('premium'), color: 'text-yellow-600' },
  ];

  return (
    <motion.nav 
      className="fixed left-0 top-16 h-full w-64 bg-white shadow-lg border-r-4 border-primary-400 z-40 hidden md:block"
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className="p-4 space-y-2">
        {navItems.map((item, index) => (
          <motion.div
            key={item.path}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-100 text-primary-700 shadow-md border-l-4 border-primary-500'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <SafeIcon 
                      icon={item.icon} 
                      className={`w-6 h-6 ${isActive ? 'text-primary-600' : item.color}`} 
                    />
                  </motion.div>
                  <span className="font-medium">{item.label}</span>
                  {item.path === '/premium' && !user?.isPremium && (
                    <motion.span 
                      className="ml-auto bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-bold"
                      animate={{ pulse: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      NEW
                    </motion.span>
                  )}
                </>
              )}
            </NavLink>
          </motion.div>
        ))}
      </div>
    </motion.nav>
  );
};

export default Navigation;