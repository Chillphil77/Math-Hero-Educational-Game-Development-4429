import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useSound } from '../contexts/SoundContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiStar, FiCheck, FiLock, FiUnlock, FiCrown } = FiIcons;

const Premium = () => {
  const { user, updateUser } = useUser();
  const { playSound } = useSound();
  const navigate = useNavigate();
  const [plan, setPlan] = useState('monthly');

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
            animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <SafeIcon icon={FiStar} className="w-12 h-12 text-yellow-500" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-800">Math Hero - All Free!</h1>
          <motion.div
            animate={{ rotate: [0, -360], scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          >
            <SafeIcon icon={FiStar} className="w-12 h-12 text-yellow-500" />
          </motion.div>
        </div>
        <p className="text-xl text-gray-600">
          Enjoy all features completely free! No premium restrictions! 🎉
        </p>
      </motion.div>

      {/* All Features Available */}
      <motion.div
        className="bg-gradient-to-r from-green-500 via-green-400 to-green-500 rounded-3xl p-8 text-center text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div
          className="text-9xl mb-6 mx-auto"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          🎉
        </motion.div>
        <h2 className="text-4xl font-bold mb-4">Everything is FREE!</h2>
        <p className="text-xl opacity-90 mb-8">
          All games, stories, and features are available to everyone at no cost!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white bg-opacity-20 rounded-xl p-4">
            <div className="text-3xl mb-2">🎮</div>
            <h3 className="font-bold">All Games Unlocked</h3>
            <p className="text-sm opacity-80">Play any game anytime</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-xl p-4">
            <div className="text-3xl mb-2">📚</div>
            <h3 className="font-bold">All Stories Available</h3>
            <p className="text-sm opacity-80">Read every adventure</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-xl p-4">
            <div className="text-3xl mb-2">🚀</div>
            <h3 className="font-bold">Full Features</h3>
            <p className="text-sm opacity-80">No limitations</p>
          </div>
        </div>

        <motion.button
          onClick={() => navigate('/dashboard')}
          className="bg-white text-green-600 font-bold px-8 py-4 rounded-xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Learning Now!
        </motion.button>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        className="bg-white rounded-3xl p-8 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          What You Get (All Free!)
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'All Mini Games',
              description: 'Play all math games including Pac-Man Math, Slot Machine, Battleship, and more!',
              icon: '🎮'
            },
            {
              title: 'Math Stories',
              description: 'Enjoy our complete library of interactive math stories with animated characters',
              icon: '📚'
            },
            {
              title: 'No Advertisements',
              description: 'Clean learning environment without any distractions',
              icon: '🚫'
            },
            {
              title: 'Progress Tracking',
              description: 'Track your learning progress and achievements',
              icon: '📊'
            },
            {
              title: 'Unlimited Practice',
              description: 'Practice math problems as much as you want',
              icon: '♾️'
            },
            {
              title: 'All Avatars',
              description: 'Choose from all available avatars and customizations',
              icon: '👑'
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (index * 0.1) }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
              <div className="mt-4 flex items-center justify-center">
                <SafeIcon icon={FiCheck} className="text-green-500 mr-2" />
                <span className="text-green-600 font-bold">FREE</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Why Free? */}
      <motion.div
        className="bg-white rounded-3xl p-8 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Why is Math Hero Free?
        </h2>
        
        <div className="max-w-3xl mx-auto space-y-6">
          {[
            {
              question: 'Our Mission',
              answer: 'We believe every child deserves access to quality math education. By making Math Hero completely free, we ensure that learning opportunities are available to everyone, regardless of economic background.'
            },
            {
              question: 'Educational Impact',
              answer: 'Our goal is to make math fun and accessible. When children enjoy learning, they perform better. Free access removes barriers and allows more kids to discover the joy of mathematics.'
            },
            {
              question: 'Community Support',
              answer: 'Math Hero is supported by educators and parents who believe in free, quality education. Together, we\'re building a community where every child can succeed in math.'
            },
            {
              question: 'Future Sustainability',
              answer: 'We maintain the platform through educational partnerships and optional donations from those who want to support our mission. Your learning always remains free!'
            }
          ].map((faq, index) => (
            <motion.div
              key={index}
              className="border border-gray-200 rounded-xl p-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + (index * 0.1) }}
            >
              <h3 className="font-bold text-gray-800 mb-2">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Math Adventure?</h2>
          <p className="text-xl mb-6 opacity-90">
            Join thousands of students already learning with Math Hero!
          </p>
          
          <div className="flex justify-center space-x-4">
            <motion.button
              onClick={() => navigate('/practice')}
              className="bg-white text-blue-600 font-bold px-8 py-4 rounded-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Practicing
            </motion.button>
            
            <motion.button
              onClick={() => navigate('/mini-games')}
              className="bg-yellow-400 text-yellow-900 font-bold px-8 py-4 rounded-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Play Games
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Trust Indicators */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <p className="text-gray-600 mb-4">
          Trusted by educators and loved by students worldwide
        </p>
        <div className="flex justify-center space-x-8 text-4xl">
          <span>⭐</span>
          <span>⭐</span>
          <span>⭐</span>
          <span>⭐</span>
          <span>⭐</span>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          5/5 stars from happy learners and families
        </p>
      </motion.div>
    </div>
  );
};

export default Premium;