import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useSound } from '../contexts/SoundContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUser, FiEdit, FiSave, FiSettings, FiBarChart2, FiAward, FiTrendingUp, FiClock } = FiIcons;

const Profile = () => {
  const { user, updateUser } = useUser();
  const { t } = useLanguage();
  const { playSound } = useSound();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    age: user?.age || '',
    email: user?.email || '',
    location: user?.location || ''
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSaveProfile = () => {
    playSound('click');
    
    // Validate form data
    if (!formData.name.trim()) {
      alert('Name is required');
      return;
    }
    
    updateUser(formData);
    setIsEditing(false);
  };
  
  const calculateAccuracy = () => {
    if (!user?.stats) return 0;
    const { correctAnswers, totalProblems } = user.stats;
    if (!totalProblems) return 0;
    return Math.round((correctAnswers / totalProblems) * 100);
  };
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Login Required</h2>
          <p className="text-gray-600">Please login to view your profile.</p>
        </div>
      </div>
    );
  }
  
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
            <SafeIcon icon={FiUser} className="w-12 h-12 text-indigo-600" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-800">My Profile</h1>
          <motion.div
            animate={{ rotate: [0, -360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <SafeIcon icon={FiUser} className="w-12 h-12 text-blue-600" />
          </motion.div>
        </div>
        <p className="text-xl text-gray-600">
          View and manage your Math Hero journey! 🚀
        </p>
      </motion.div>
      
      {/* Profile Header */}
      <motion.div 
        className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-8 text-white relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex flex-wrap items-center justify-between relative z-10">
          <div className="flex items-center space-x-6 mb-4 md:mb-0">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl shadow-lg">
              🦸‍♂️
            </div>
            <div>
              <h2 className="text-3xl font-bold">{user.name}</h2>
              <p className="opacity-90">
                Level {user.level} Math Hero
                {user.isPremium && (
                  <span className="ml-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                    PREMIUM
                  </span>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-6">
            <div className="text-center">
              <div className="text-3xl font-bold">{user.coins}</div>
              <div className="text-sm opacity-90">Coins</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{user.level}</div>
              <div className="text-sm opacity-90">Level</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{user.streak}</div>
              <div className="text-sm opacity-90">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{calculateAccuracy()}%</div>
              <div className="text-sm opacity-90">Accuracy</div>
            </div>
          </div>
        </div>
        
        {/* XP Progress Bar */}
        <div className="mt-6 relative z-10">
          <div className="flex justify-between text-sm mb-1">
            <span>XP: {user.xp}</span>
            <span>Next Level: {(Math.floor(user.xp / 100) + 1) * 100}</span>
          </div>
          <div className="w-full bg-white bg-opacity-20 rounded-full h-4">
            <motion.div 
              className="h-4 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${user.xp % 100}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-10 w-40 h-40 bg-white rounded-full"></div>
          <div className="absolute bottom-8 left-20 w-28 h-28 bg-white rounded-full"></div>
        </div>
      </motion.div>
      
      {/* Tabs Navigation */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="flex border-b">
          <motion.button
            className={`flex-1 py-4 font-bold text-lg ${activeTab === 'overview' ? 'text-indigo-600 border-b-4 border-indigo-500' : 'text-gray-500'}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('overview')}
          >
            <div className="flex items-center justify-center space-x-2">
              <SafeIcon icon={FiUser} />
              <span>Overview</span>
            </div>
          </motion.button>
          
          <motion.button
            className={`flex-1 py-4 font-bold text-lg ${activeTab === 'stats' ? 'text-blue-600 border-b-4 border-blue-500' : 'text-gray-500'}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('stats')}
          >
            <div className="flex items-center justify-center space-x-2">
              <SafeIcon icon={FiBarChart2} />
              <span>Statistics</span>
            </div>
          </motion.button>
          
          <motion.button
            className={`flex-1 py-4 font-bold text-lg ${activeTab === 'achievements' ? 'text-yellow-600 border-b-4 border-yellow-500' : 'text-gray-500'}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('achievements')}
          >
            <div className="flex items-center justify-center space-x-2">
              <SafeIcon icon={FiAward} />
              <span>Achievements</span>
            </div>
          </motion.button>
          
          <motion.button
            className={`flex-1 py-4 font-bold text-lg ${activeTab === 'settings' ? 'text-green-600 border-b-4 border-green-500' : 'text-gray-500'}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('settings')}
          >
            <div className="flex items-center justify-center space-x-2">
              <SafeIcon icon={FiSettings} />
              <span>Settings</span>
            </div>
          </motion.button>
        </div>
        
        {/* Tab Content */}
        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
                <motion.button
                  onClick={() => {
                    if (isEditing) {
                      handleSaveProfile();
                    } else {
                      setIsEditing(true);
                      playSound('click');
                    }
                  }}
                  className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center space-x-2 ${
                    isEditing ? 'bg-green-500 text-white' : 'bg-indigo-500 text-white'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isEditing ? (
                    <>
                      <SafeIcon icon={FiSave} />
                      <span>Save Changes</span>
                    </>
                  ) : (
                    <>
                      <SafeIcon icon={FiEdit} />
                      <span>Edit Profile</span>
                    </>
                  )}
                </motion.button>
              </div>
              
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Age</label>
                    <select
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select age</option>
                      {Array.from({ length: 7 }, (_, i) => i + 6).map(age => (
                        <option key={age} value={age}>{age}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Email (Optional)</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Your email"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Location</label>
                    <select
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select location</option>
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                      <option value="Spain">Spain</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="text-sm text-gray-500 mb-1">Name</div>
                    <div className="text-lg font-medium text-gray-800">{user.name}</div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="text-sm text-gray-500 mb-1">Age</div>
                    <div className="text-lg font-medium text-gray-800">{user.age}</div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="text-sm text-gray-500 mb-1">Email</div>
                    <div className="text-lg font-medium text-gray-800">
                      {user.email || 'Not provided'}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="text-sm text-gray-500 mb-1">Location</div>
                    <div className="text-lg font-medium text-gray-800">
                      {user.location || 'Not provided'}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Account Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="text-sm text-gray-500 mb-1">Account Type</div>
                    <div className="flex items-center">
                      <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                        user.isPremium 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.isPremium ? 'Premium' : 'Free'}
                      </div>
                      
                      {!user.isPremium && (
                        <motion.button
                          onClick={() => {
                            playSound('click');
                            window.location.href = '/premium';
                          }}
                          className="ml-3 text-xs px-2 py-1 bg-yellow-500 text-white rounded-full"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Upgrade
                        </motion.button>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="text-sm text-gray-500 mb-1">Member Since</div>
                    <div className="text-lg font-medium text-gray-800">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="text-sm text-gray-500 mb-1">Difficulty</div>
                    <div className="text-lg font-medium text-gray-800 capitalize">
                      {user.preferences?.difficulty || 'Medium'}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Statistics Tab */}
          {activeTab === 'stats' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Learning Statistics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <motion.div 
                  className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl p-6 text-white"
                  whileHover={{ scale: 1.03 }}
                >
                  <SafeIcon icon={FiTrendingUp} className="w-8 h-8 mb-3 opacity-80" />
                  <div className="text-3xl font-bold mb-1">{user.stats?.totalProblems || 0}</div>
                  <div className="text-sm opacity-90">Total Problems Solved</div>
                </motion.div>
                
                <motion.div 
                  className="bg-gradient-to-r from-green-400 to-green-600 rounded-xl p-6 text-white"
                  whileHover={{ scale: 1.03 }}
                >
                  <SafeIcon icon={FiTrendingUp} className="w-8 h-8 mb-3 opacity-80" />
                  <div className="text-3xl font-bold mb-1">{calculateAccuracy()}%</div>
                  <div className="text-sm opacity-90">Accuracy Rate</div>
                </motion.div>
                
                <motion.div 
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl p-6 text-white"
                  whileHover={{ scale: 1.03 }}
                >
                  <SafeIcon icon={FiClock} className="w-8 h-8 mb-3 opacity-80" />
                  <div className="text-3xl font-bold mb-1">{user.stats?.averageTime || 0}s</div>
                  <div className="text-sm opacity-90">Average Response Time</div>
                </motion.div>
                
                <motion.div 
                  className="bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl p-6 text-white"
                  whileHover={{ scale: 1.03 }}
                >
                  <SafeIcon icon={FiClock} className="w-8 h-8 mb-3 opacity-80" />
                  <div className="text-3xl font-bold mb-1">{user.stats?.gamesPlayed || 0}</div>
                  <div className="text-sm opacity-90">Games Played</div>
                </motion.div>
              </div>
              
              {/* Learning Progress */}
              <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Learning Progress</h3>
                <div className="space-y-4">
                  {[
                    { name: 'Addition', progress: 85, color: 'bg-blue-500' },
                    { name: 'Subtraction', progress: 70, color: 'bg-green-500' },
                    { name: 'Multiplication', progress: 60, color: 'bg-yellow-500' },
                    { name: 'Division', progress: 40, color: 'bg-red-500' },
                    { name: 'Fractions', progress: 20, color: 'bg-purple-500' }
                  ].map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">{skill.name}</span>
                        <span className="text-gray-600">{skill.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <motion.div 
                          className={`h-3 rounded-full ${skill.color}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.progress}%` }}
                          transition={{ duration: 1, delay: 0.1 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-3">
                      🎮
                    </div>
                    <div>
                      <div className="font-bold text-gray-800">Played Pac-Man Math</div>
                      <div className="text-sm text-gray-600">Score: 750 • 2 days ago</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-500 mr-3">
                      📚
                    </div>
                    <div>
                      <div className="font-bold text-gray-800">Practiced Multiplication</div>
                      <div className="text-sm text-gray-600">20 problems • 3 days ago</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-500 mr-3">
                      🏆
                    </div>
                    <div>
                      <div className="font-bold text-gray-800">Earned Achievement</div>
                      <div className="text-sm text-gray-600">Multiplication Master • 5 days ago</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Achievements</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { 
                    name: 'Multiplication Master', 
                    description: 'Solve 50 multiplication problems correctly', 
                    icon: '🧮', 
                    progress: 85, 
                    unlocked: true,
                    color: 'from-yellow-400 to-yellow-600'
                  },
                  { 
                    name: '7-Day Streak', 
                    description: 'Practice math for 7 consecutive days', 
                    icon: '🔥', 
                    progress: 100, 
                    unlocked: true,
                    color: 'from-red-400 to-red-600'
                  },
                  { 
                    name: 'Game Champion', 
                    description: 'Win 10 mini-games with a perfect score', 
                    icon: '🎮', 
                    progress: 70, 
                    unlocked: false,
                    color: 'from-blue-400 to-blue-600'
                  },
                  { 
                    name: 'Math Explorer', 
                    description: 'Try all available math operations', 
                    icon: '🧭', 
                    progress: 80, 
                    unlocked: false,
                    color: 'from-green-400 to-green-600'
                  },
                  { 
                    name: 'Speed Demon', 
                    description: 'Answer 20 questions in under 1 minute', 
                    icon: '⚡', 
                    progress: 40, 
                    unlocked: false,
                    color: 'from-purple-400 to-purple-600'
                  },
                  { 
                    name: 'Shopping Spree', 
                    description: 'Purchase 5 items from the shop', 
                    icon: '🛍️', 
                    progress: 20, 
                    unlocked: false,
                    color: 'from-pink-400 to-pink-600'
                  }
                ].map((achievement, index) => (
                  <motion.div
                    key={achievement.name}
                    className={`bg-white rounded-xl shadow-md overflow-hidden ${
                      achievement.unlocked ? 'border-2 border-yellow-400' : ''
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.03 }}
                  >
                    <div className={`h-24 bg-gradient-to-r ${achievement.color} flex items-center justify-center relative`}>
                      <div className="text-4xl">{achievement.icon}</div>
                      {achievement.unlocked && (
                        <div className="absolute top-2 right-2 bg-yellow-300 text-yellow-800 rounded-full w-8 h-8 flex items-center justify-center">
                          ✓
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-800 mb-1">{achievement.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                        <motion.div 
                          className={`h-2 rounded-full ${achievement.unlocked ? 'bg-yellow-500' : 'bg-blue-500'}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${achievement.progress}%` }}
                          transition={{ duration: 1, delay: 0.2 + (0.1 * index) }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 text-right">
                        {achievement.progress}% complete
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
          
          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Preferences</h2>
              
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Learning Preferences</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Difficulty Level</label>
                      <select
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={user.preferences?.difficulty || 'medium'}
                        onChange={(e) => {
                          updateUser({
                            preferences: {
                              ...user.preferences,
                              difficulty: e.target.value
                            }
                          });
                        }}
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                          checked={user.preferences?.soundEnabled !== false}
                          onChange={(e) => {
                            updateUser({
                              preferences: {
                                ...user.preferences,
                                soundEnabled: e.target.checked
                              }
                            });
                          }}
                        />
                        <span className="ml-2 text-gray-700">Enable sound effects</span>
                      </label>
                    </div>
                    
                    <div>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                          checked={user.preferences?.showVisualAids !== false}
                          onChange={(e) => {
                            updateUser({
                              preferences: {
                                ...user.preferences,
                                showVisualAids: e.target.checked
                              }
                            });
                          }}
                        />
                        <span className="ml-2 text-gray-700">Show visual aids (for younger learners)</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Theme Preferences</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">App Theme</label>
                      <div className="grid grid-cols-3 gap-3">
                        {['default', 'space', 'ocean', 'jungle'].map(theme => (
                          <motion.button
                            key={theme}
                            className={`p-3 rounded-lg capitalize border-2 ${
                              (user.preferences?.theme || 'default') === theme
                                ? 'border-green-500 bg-green-50 text-green-700'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              updateUser({
                                preferences: {
                                  ...user.preferences,
                                  theme: theme
                                }
                              });
                            }}
                          >
                            {theme}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Notification Preferences</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                          checked={user.preferences?.dailyReminder !== false}
                          onChange={(e) => {
                            updateUser({
                              preferences: {
                                ...user.preferences,
                                dailyReminder: e.target.checked
                              }
                            });
                          }}
                        />
                        <span className="ml-2 text-gray-700">Daily practice reminder</span>
                      </label>
                    </div>
                    
                    <div>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                          checked={user.preferences?.achievementNotifications !== false}
                          onChange={(e) => {
                            updateUser({
                              preferences: {
                                ...user.preferences,
                                achievementNotifications: e.target.checked
                              }
                            });
                          }}
                        />
                        <span className="ml-2 text-gray-700">Achievement notifications</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Account Actions */}
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Account Actions</h2>
                
                <div className="space-y-4">
                  {!user.isPremium && (
                    <motion.button
                      onClick={() => {
                        playSound('click');
                        window.location.href = '/premium';
                      }}
                      className="w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold rounded-xl flex items-center justify-center space-x-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>⭐</span>
                      <span>Upgrade to Premium</span>
                    </motion.button>
                  )}
                  
                  <motion.button
                    onClick={() => {
                      if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
                        playSound('click');
                        updateUser({
                          coins: 0,
                          level: 1,
                          xp: 0,
                          streak: 0,
                          achievements: [],
                          ownedItems: [],
                          stats: {
                            totalProblems: 0,
                            correctAnswers: 0,
                            accuracy: 0,
                            averageTime: 0,
                            gamesPlayed: 0
                          }
                        });
                      }
                    }}
                    className="w-full py-3 bg-red-500 text-white font-bold rounded-xl"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Reset All Progress
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;