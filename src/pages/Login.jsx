import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useSound } from '../contexts/SoundContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  const { t } = useLanguage();
  const { playSound } = useSound();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendWelcomeEmail = async (userData) => {
    try {
      // Send email to admin
      const emailData = {
        to: 'Philipp.jeker@gmail.com',
        subject: 'New Math Hero Registration',
        html: `
          <h2>New User Registration</h2>
          <p><strong>Name:</strong> ${userData.name}</p>
          <p><strong>Email:</strong> ${userData.email}</p>
          <p><strong>Registration Date:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>User ID:</strong> ${userData.id}</p>
        `
      };

      // In a real app, this would be an API call to your backend
      console.log('Sending welcome email:', emailData);
      
      // For demo purposes, we'll simulate the email send
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Failed to send welcome email:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      playSound('incorrect');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (isLogin) {
        // Login logic
        const userData = {
          id: Date.now().toString(),
          name: formData.email.split('@')[0], // Use email prefix as name
          email: formData.email,
          coins: 0, // Start with 0 coins
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
          },
          preferences: {
            difficulty: 'medium',
            soundEnabled: true,
            backgroundMusic: true,
            theme: 'default',
            enablePercentages: false
          },
          isPremium: false, // All users start as free
          createdAt: new Date().toISOString(),
          avatar: 'bear'
        };

        login(userData);
        playSound('achievement');
        navigate('/dashboard');
      } else {
        // Registration logic
        const userData = {
          id: Date.now().toString(),
          name: formData.name,
          email: formData.email,
          coins: 0, // Start with 0 coins
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
          },
          preferences: {
            difficulty: 'medium',
            soundEnabled: true,
            backgroundMusic: true,
            theme: 'default',
            enablePercentages: false
          },
          isPremium: false, // All users start as free
          createdAt: new Date().toISOString(),
          avatar: 'bear'
        };

        // Send welcome email
        await sendWelcomeEmail(userData);

        login(userData);
        playSound('achievement');
        navigate('/onboarding');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setErrors({ submit: 'An error occurred. Please try again.' });
      playSound('incorrect');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <motion.div
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full"
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-4xl">🦸‍♂️</span>
          </motion.div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Math Hero
          </h1>
          <p className="text-gray-600 mt-2">
            {isLogin ? t('loginToAccount') : t('createAccount')}
          </p>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full p-4 rounded-xl border-2 ${
                  errors.name ? 'border-red-300' : 'border-gray-200'
                } focus:border-blue-500 focus:outline-none transition-colors`}
                placeholder="Enter your name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </motion.div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('email')}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full p-4 rounded-xl border-2 ${
                errors.email ? 'border-red-300' : 'border-gray-200'
              } focus:border-blue-500 focus:outline-none transition-colors`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('password')}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full p-4 rounded-xl border-2 ${
                errors.password ? 'border-red-300' : 'border-gray-200'
              } focus:border-blue-500 focus:outline-none transition-colors`}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {!isLogin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('confirmPassword')}
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full p-4 rounded-xl border-2 ${
                  errors.confirmPassword ? 'border-red-300' : 'border-gray-200'
                } focus:border-blue-500 focus:outline-none transition-colors`}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </motion.div>
          )}

          {errors.submit && (
            <p className="text-red-500 text-sm text-center">{errors.submit}</p>
          )}

          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Processing...</span>
              </div>
            ) : (
              isLogin ? t('signIn') : t('signUp')
            )}
          </motion.button>
        </form>

        {/* Toggle */}
        <motion.div
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-gray-600">
            {isLogin ? t('dontHaveAccount') : t('alreadyHaveAccount')}
          </p>
          <motion.button
            onClick={() => {
              setIsLogin(!isLogin);
              setFormData({ email: '', password: '', confirmPassword: '', name: '' });
              setErrors({});
              playSound('click');
            }}
            className="text-blue-600 font-bold hover:text-blue-800 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLogin ? t('signUp') : t('signIn')}
          </motion.button>
        </motion.div>

        {/* Floating Animation Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 10 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl opacity-20"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                y: [0, -30, 0],
                rotate: [0, 360],
                opacity: [0.2, 0.5, 0.2]
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

export default Login;