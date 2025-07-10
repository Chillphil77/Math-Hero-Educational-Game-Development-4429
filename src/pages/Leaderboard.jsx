import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import { useLanguage } from '../contexts/LanguageContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTrendingUp, FiUsers, FiAward, FiClock, FiCalendar } = FiIcons;

const Leaderboard = () => {
  const { user } = useUser();
  const { t } = useLanguage();
  
  const [timeFilter, setTimeFilter] = useState('week');
  const [scopeFilter, setScopeFilter] = useState('global');
  
  // Mock data for the leaderboard
  const mockLeaderboard = [
    { id: 1, name: 'MathWhiz123', score: 9850, level: 15, streak: 12, avatar: '👨‍🚀' },
    { id: 2, name: 'NumberNinja', score: 8720, level: 14, streak: 8, avatar: '🥷' },
    { id: 3, name: 'CalculusKid', score: 7650, level: 12, streak: 15, avatar: '👧' },
    { id: 4, name: 'AlgebraAce', score: 6980, level: 11, streak: 7, avatar: '🧙‍♂️' },
    { id: 5, name: 'MathMaster', score: 6540, level: 10, streak: 9, avatar: '👨‍🎓' },
    { id: 6, name: 'GeometryGenius', score: 5870, level: 9, streak: 5, avatar: '👸' },
    { id: 7, name: 'FractionFan', score: 5320, level: 8, streak: 11, avatar: '🧠' },
    { id: 8, name: 'DecimalDude', score: 4780, level: 8, streak: 4, avatar: '🤖' },
    { id: 9, name: 'StatisticsStella', score: 4250, level: 7, streak: 6, avatar: '👩‍🔬' },
    { id: 10, name: 'ProbabilityPro', score: 3920, level: 7, streak: 3, avatar: '🦸‍♀️' }
  ];
  
  // Insert the current user at a random position if they're not already in the top 10
  const leaderboardWithUser = [...mockLeaderboard];
  if (user && !mockLeaderboard.some(player => player.id === user.id)) {
    const userRank = Math.floor(Math.random() * 5) + 11; // Rank 11-15
    const userScore = 3500 - (userRank - 10) * 300;
    leaderboardWithUser.push({
      id: user.id,
      name: user.name,
      score: userScore,
      level: user.level,
      streak: user.streak,
      avatar: '🦸‍♂️',
      isCurrentUser: true,
      rank: userRank
    });
  }
  
  // Filter leaderboard based on time and scope
  const filteredLeaderboard = leaderboardWithUser
    .filter(player => {
      // In a real app, this would filter based on actual data
      // For demo purposes, we'll just return all players
      return true;
    })
    .sort((a, b) => b.score - a.score)
    .map((player, index) => ({
      ...player,
      rank: player.rank || index + 1
    }));
  
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
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <SafeIcon icon={FiTrendingUp} className="w-12 h-12 text-red-600" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-800">Leaderboard</h1>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          >
            <SafeIcon icon={FiAward} className="w-12 h-12 text-yellow-500" />
          </motion.div>
        </div>
        <p className="text-xl text-gray-600">
          See how you rank against other Math Heroes! 🏆
        </p>
      </motion.div>
      
      {/* Filters */}
      <motion.div 
        className="bg-white rounded-2xl p-4 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex flex-wrap gap-4">
          {/* Time Filter */}
          <div className="flex-grow">
            <div className="flex items-center mb-2 text-sm text-gray-600">
              <SafeIcon icon={FiCalendar} className="mr-2" />
              <span>Time Period</span>
            </div>
            <div className="flex bg-gray-100 rounded-lg p-1">
              {['day', 'week', 'month', 'all'].map(period => (
                <motion.button
                  key={period}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold ${
                    timeFilter === period
                      ? 'bg-red-500 text-white'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: timeFilter !== period ? 1.05 : 1 }}
                  whileTap={{ scale: timeFilter !== period ? 0.95 : 1 }}
                  onClick={() => setTimeFilter(period)}
                >
                  {period === 'day' && 'Daily'}
                  {period === 'week' && 'Weekly'}
                  {period === 'month' && 'Monthly'}
                  {period === 'all' && 'All Time'}
                </motion.button>
              ))}
            </div>
          </div>
          
          {/* Scope Filter */}
          <div>
            <div className="flex items-center mb-2 text-sm text-gray-600">
              <SafeIcon icon={FiUsers} className="mr-2" />
              <span>Leaderboard Scope</span>
            </div>
            <div className="flex bg-gray-100 rounded-lg p-1">
              {['global', 'friends'].map(scope => (
                <motion.button
                  key={scope}
                  className={`py-2 px-4 rounded-lg text-sm font-bold ${
                    scopeFilter === scope
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: scopeFilter !== scope ? 1.05 : 1 }}
                  whileTap={{ scale: scopeFilter !== scope ? 0.95 : 1 }}
                  onClick={() => setScopeFilter(scope)}
                >
                  {scope === 'global' && 'Global'}
                  {scope === 'friends' && 'Friends'}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Leaderboard Table */}
      <motion.div
        className="bg-white rounded-2xl shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="bg-gradient-to-r from-red-500 to-orange-500 p-4 text-white">
          <h2 className="text-xl font-bold">
            {timeFilter === 'day' && 'Daily'}
            {timeFilter === 'week' && 'Weekly'}
            {timeFilter === 'month' && 'Monthly'}
            {timeFilter === 'all' && 'All-Time'}
            {' '}
            {scopeFilter === 'global' ? 'Global' : 'Friends'}
            {' Leaderboard'}
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="py-3 px-4 text-left text-sm font-bold text-gray-600">Rank</th>
                <th className="py-3 px-4 text-left text-sm font-bold text-gray-600">Player</th>
                <th className="py-3 px-4 text-left text-sm font-bold text-gray-600">Score</th>
                <th className="py-3 px-4 text-left text-sm font-bold text-gray-600">Level</th>
                <th className="py-3 px-4 text-left text-sm font-bold text-gray-600">Streak</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaderboard.map((player, index) => (
                <motion.tr
                  key={player.id}
                  className={`border-b ${
                    player.isCurrentUser
                      ? 'bg-blue-50'
                      : index % 2 === 0
                        ? 'bg-white'
                        : 'bg-gray-50'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + (index * 0.05) }}
                  whileHover={{ backgroundColor: player.isCurrentUser ? '#e6f7ff' : '#f9fafb' }}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      {player.rank <= 3 ? (
                        <span className="text-2xl mr-2">
                          {player.rank === 1 && '🥇'}
                          {player.rank === 2 && '🥈'}
                          {player.rank === 3 && '🥉'}
                        </span>
                      ) : (
                        <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-700 mr-2">
                          {player.rank}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{player.avatar}</div>
                      <div>
                        <div className="font-bold text-gray-800">
                          {player.name}
                          {player.isCurrentUser && (
                            <span className="ml-2 text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                              YOU
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-bold text-gray-800">{player.score.toLocaleString()}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center font-bold text-purple-600 mr-2">
                        {player.level}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <span className="text-orange-500 mr-1">🔥</span>
                      <span className="font-bold text-gray-800">{player.streak} days</span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
      
      {/* Recent Achievements */}
      <motion.div 
        className="bg-white rounded-2xl shadow-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center mb-6">
          <SafeIcon icon={FiAward} className="text-yellow-500 w-6 h-6 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">Recent Achievements</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div 
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl p-4 text-white"
            whileHover={{ scale: 1.03 }}
          >
            <div className="text-3xl mb-2">🏆</div>
            <h3 className="font-bold text-lg mb-1">Multiplication Master</h3>
            <p className="text-sm opacity-90">Solve 50 multiplication problems correctly</p>
          </motion.div>
          
          <motion.div 
            className="bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl p-4 text-white"
            whileHover={{ scale: 1.03 }}
          >
            <div className="text-3xl mb-2">🔥</div>
            <h3 className="font-bold text-lg mb-1">7-Day Streak</h3>
            <p className="text-sm opacity-90">Practice math for 7 consecutive days</p>
          </motion.div>
          
          <motion.div 
            className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl p-4 text-white"
            whileHover={{ scale: 1.03 }}
          >
            <div className="text-3xl mb-2">🎮</div>
            <h3 className="font-bold text-lg mb-1">Game Champion</h3>
            <p className="text-sm opacity-90">Win 10 mini-games with a perfect score</p>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Leaderboard Info */}
      <motion.div 
        className="bg-gray-100 rounded-2xl p-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="text-xl font-bold text-gray-800 mb-2">How to Climb the Leaderboard</h3>
        <p className="text-gray-600 mb-4">
          Keep practicing, play games, and maintain your streak to earn more points!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-3xl mb-2">🧠</div>
            <h4 className="font-bold text-gray-800 mb-1">Daily Practice</h4>
            <p className="text-sm text-gray-600">Practice math problems every day to earn points</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-3xl mb-2">🎯</div>
            <h4 className="font-bold text-gray-800 mb-1">Win Mini-Games</h4>
            <p className="text-sm text-gray-600">Play games to earn bonus points and rewards</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-3xl mb-2">🔥</div>
            <h4 className="font-bold text-gray-800 mb-1">Keep Your Streak</h4>
            <p className="text-sm text-gray-600">Maintain your streak for multiplier bonuses</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Leaderboard;