import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useSound } from '../contexts/SoundContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiBookOpen, FiCompass, FiSearch } = FiIcons;

const MathStories = () => {
  const { user } = useUser();
  const { t } = useLanguage();
  const { playSound } = useSound();
  const navigate = useNavigate();

  const stories = [
    {
      id: 'pirate-treasure',
      title: 'Pirate Treasure Adventure',
      description: 'Help Captain Math find the hidden treasure by dividing gold coins among the crew and calculating map coordinates.',
      icon: '🏴‍☠️',
      color: 'from-blue-400 to-blue-600',
      premium: false,
      topics: ['division', 'addition'],
      age: '6-8',
      estimatedTime: '10 min',
      path: '/stories/pirate-treasure'
    },
    {
      id: 'dino-eggs',
      title: 'Dinosaur Egg Hunt',
      description: 'Join Tina T-Rex as she finds and distributes dinosaur eggs evenly across nests. Help her with division!',
      icon: '🦖',
      color: 'from-green-400 to-green-600',
      premium: false,
      topics: ['division', 'counting'],
      age: '6-8',
      estimatedTime: '8 min',
      path: '/stories/dino-eggs'
    },
    {
      id: 'detective-case',
      title: 'Math Detective Agency',
      description: 'Solve the mystery of the missing numbers as a math detective. Use subtraction to find important clues!',
      icon: '🕵️',
      color: 'from-purple-400 to-purple-600',
      premium: false, // Changed to free
      topics: ['subtraction', 'logic'],
      age: '7-10',
      estimatedTime: '15 min'
    },
    {
      id: 'space-mission',
      title: 'Space Mission: Planet Math',
      description: 'Navigate your spaceship through the galaxy by solving multiplication problems to calculate rocket thrust.',
      icon: '🚀',
      color: 'from-indigo-400 to-indigo-600',
      premium: false, // Changed to free
      topics: ['multiplication', 'estimation'],
      age: '8-12',
      estimatedTime: '12 min'
    },
    {
      id: 'bakery-fractions',
      title: 'Bakery Fraction Fun',
      description: 'Help the baker make delicious treats by measuring ingredients using fractions. Perfect for learning parts of a whole!',
      icon: '🧁',
      color: 'from-pink-400 to-pink-600',
      premium: false, // Changed to free
      topics: ['fractions', 'measurement'],
      age: '9-12',
      estimatedTime: '15 min'
    }
  ];

  const handleStoryClick = (story) => {
    playSound('click');
    
    if (story.path) {
      navigate(story.path);
    } else {
      // For stories without implemented paths
      alert(`The story "${story.title}" is coming soon! We're still working on it.`);
    }
  };

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
            animate={{ rotateY: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <SafeIcon icon={FiBookOpen} className="w-12 h-12 text-orange-600" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-800">Math Stories</h1>
          <motion.div
            animate={{ rotateY: [0, -360] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <SafeIcon icon={FiBookOpen} className="w-12 h-12 text-blue-600" />
          </motion.div>
        </div>
        <p className="text-xl text-gray-600">
          Learn math through exciting adventures and stories! 📚
        </p>
      </motion.div>

      {/* Search & Filter */}
      <motion.div
        className="bg-white rounded-2xl p-4 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-grow">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search stories..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <select className="px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500">
            <option value="">All Topics</option>
            <option value="addition">Addition</option>
            <option value="subtraction">Subtraction</option>
            <option value="multiplication">Multiplication</option>
            <option value="division">Division</option>
            <option value="fractions">Fractions</option>
          </select>
          <select className="px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500">
            <option value="">All Ages</option>
            <option value="6-8">Ages 6-8</option>
            <option value="7-10">Ages 7-10</option>
            <option value="8-12">Ages 8-12</option>
          </select>
        </div>
      </motion.div>

      {/* All Stories Available */}
      <div>
        <motion.h2
          className="text-3xl font-bold text-gray-800 mb-6 flex items-center space-x-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <SafeIcon icon={FiCompass} className="text-orange-600" />
          <span>Adventure Stories</span>
          <motion.span
            className="bg-green-400 text-green-900 text-sm px-3 py-1 rounded-full font-bold"
            animate={{ pulse: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ALL FREE!
          </motion.span>
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stories.map((story, index) => (
            <motion.div
              key={story.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:shadow-xl"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleStoryClick(story)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + (index * 0.1) }}
            >
              {/* Header with gradient */}
              <div className={`h-32 bg-gradient-to-br ${story.color} relative`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl shadow-lg">
                    {story.icon}
                  </div>
                </div>
                
                {/* Free Badge */}
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
                <h3 className="text-xl font-bold text-gray-800 mb-2">{story.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{story.description}</p>

                {/* Story Stats */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <span>📚</span>
                    <span>{story.topics.join(', ')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>⏱️</span>
                    <span>{story.estimatedTime}</span>
                  </div>
                </div>

                {/* Read Button */}
                <button className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-orange-400 to-orange-600 hover:shadow-lg">
                  📖 Read Story
                </button>
              </div>
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
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">More Stories Coming Soon!</h3>
        <p className="text-gray-600">
          We're writing exciting new math adventures every week. Check back soon for more stories!
        </p>
      </motion.div>
    </div>
  );
};

export default MathStories;