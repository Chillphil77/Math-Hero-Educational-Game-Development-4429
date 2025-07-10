import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useSound } from '../contexts/SoundContext';

const Onboarding = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  const { language, changeLanguage, t } = useLanguage();
  const { playSound } = useSound();

  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState({
    name: '',
    age: '',
    email: '',
    location: '',
    difficulty: 'medium',
    language: language,
    avatar: 'bear'
  });

  const steps = [
    { title: t('selectLanguage'), component: LanguageStep, icon: '🌍' },
    { title: t('enterName'), component: NameStep, icon: '👋' },
    { title: t('enterAge'), component: AgeStep, icon: '🎂' },
    { title: t('chooseAvatar'), component: AvatarStep, icon: '🎨' },
    { title: t('enterEmail'), component: EmailStep, icon: '📧' },
    { title: t('enterLocation'), component: LocationStep, icon: '🗺️' },
    { title: t('chooseDifficulty'), component: DifficultyStep, icon: '🎯' },
    { title: t('welcome'), component: WelcomeStep, icon: '🎉' }
  ];

  const nextStep = () => {
    playSound('click');
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      // Complete onboarding
      const userWithId = {
        ...userData,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        coins: 100,
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
          difficulty: userData.difficulty,
          soundEnabled: true,
          theme: 'default'
        },
        isPremium: true, // All premium features available
        createdAt: new Date().toISOString()
      };
      
      login(userWithId);
      navigate('/dashboard');
    }
  };

  const prevStep = () => {
    playSound('click');
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const updateUserData = (field, value) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  const CurrentStepComponent = steps[step].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <motion.div
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-600">
              Step {step + 1} of {steps.length}
            </span>
            <span className="text-2xl">{steps[step].icon}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
              {steps[step].title}
            </h2>
            
            <CurrentStepComponent
              userData={userData}
              updateUserData={updateUserData}
              onNext={nextStep}
              onPrev={prevStep}
              canGoNext={step === steps.length - 1 || validateStep(step, userData)}
              changeLanguage={changeLanguage}
              language={language}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <motion.button
            onClick={prevStep}
            disabled={step === 0}
            className="px-6 py-3 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            whileHover={{ scale: step === 0 ? 1 : 1.05 }}
            whileTap={{ scale: step === 0 ? 1 : 0.95 }}
          >
            {t('back')}
          </motion.button>
          
          <motion.button
            onClick={nextStep}
            disabled={!validateStep(step, userData)}
            className="px-6 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            whileHover={{ scale: validateStep(step, userData) ? 1.05 : 1 }}
            whileTap={{ scale: validateStep(step, userData) ? 0.95 : 1 }}
          >
            {step === steps.length - 1 ? t('start') : t('next')}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

// Step Components
const LanguageStep = ({ language, changeLanguage }) => {
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' }
  ];

  return (
    <div className="space-y-4">
      {languages.map((lang, index) => (
        <motion.button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          className={`w-full p-4 rounded-xl border-2 transition-all ${
            language === lang.code 
              ? 'border-blue-500 bg-blue-50 text-blue-700' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{lang.flag}</span>
            <span className="font-medium">{lang.name}</span>
          </div>
        </motion.button>
      ))}
    </div>
  );
};

const NameStep = ({ userData, updateUserData }) => {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <motion.div
          className="text-6xl mb-4"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          👋
        </motion.div>
        <p className="text-gray-600">What should we call you, future Math Hero?</p>
      </div>
      
      <input
        type="text"
        value={userData.name}
        onChange={(e) => updateUserData('name', e.target.value)}
        placeholder="Enter your name"
        className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors text-center text-lg"
        autoFocus
      />
    </div>
  );
};

const AgeStep = ({ userData, updateUserData }) => {
  const ages = Array.from({ length: 7 }, (_, i) => i + 6);

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <motion.div
          className="text-6xl mb-4"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🎂
        </motion.div>
        <p className="text-gray-600">This helps us customize your experience!</p>
      </div>
      
      <div className="grid grid-cols-4 gap-3">
        {ages.map((age) => (
          <motion.button
            key={age}
            onClick={() => updateUserData('age', age)}
            className={`p-4 rounded-xl border-2 transition-all ${
              userData.age === age 
                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {age}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

const AvatarStep = ({ userData, updateUserData }) => {
  const avatars = [
    { id: 'bear', emoji: '🐻', name: 'Bear' },
    { id: 'cat', emoji: '🐱', name: 'Cat' },
    { id: 'dog', emoji: '🐶', name: 'Dog' },
    { id: 'fox', emoji: '🦊', name: 'Fox' },
    { id: 'rabbit', emoji: '🐰', name: 'Rabbit' },
    { id: 'panda', emoji: '🐼', name: 'Panda' },
    { id: 'koala', emoji: '🐨', name: 'Koala' },
    { id: 'lion', emoji: '🦁', name: 'Lion' },
    { id: 'unicorn', emoji: '🦄', name: 'Unicorn' },
    { id: 'dragon', emoji: '🐉', name: 'Dragon' },
    { id: 'owl', emoji: '🦉', name: 'Owl' },
    { id: 'penguin', emoji: '🐧', name: 'Penguin' }
  ];

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <motion.div
          className="text-6xl mb-4"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🎨
        </motion.div>
        <p className="text-gray-600">Choose your avatar!</p>
      </div>
      
      <div className="grid grid-cols-4 gap-3">
        {avatars.map((avatar) => (
          <motion.button
            key={avatar.id}
            onClick={() => updateUserData('avatar', avatar.id)}
            className={`p-3 rounded-xl border-2 transition-all ${
              userData.avatar === avatar.id 
                ? 'border-blue-500 bg-blue-50 scale-110' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            whileHover={{ scale: userData.avatar === avatar.id ? 1.1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="text-center">
              <div className="text-3xl mb-1">{avatar.emoji}</div>
              <div className="text-xs text-gray-600">{avatar.name}</div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

const EmailStep = ({ userData, updateUserData }) => {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <motion.div
          className="text-6xl mb-4"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          📧
        </motion.div>
        <p className="text-gray-600">Optional - for progress tracking and updates</p>
      </div>
      
      <input
        type="email"
        value={userData.email}
        onChange={(e) => updateUserData('email', e.target.value)}
        placeholder="your@email.com (optional)"
        className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors text-center text-lg"
      />
    </div>
  );
};

const LocationStep = ({ userData, updateUserData }) => {
  const locations = [
    'United States',
    'Germany', 
    'France',
    'Switzerland',
    'United Kingdom',
    'Canada',
    'Australia',
    'Spain',
    'Italy',
    'Netherlands',
    'Austria',
    'Other'
  ];

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <motion.div
          className="text-6xl mb-4"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        >
          🗺️
        </motion.div>
        <p className="text-gray-600">Where are you joining us from?</p>
      </div>
      
      <select
        value={userData.location}
        onChange={(e) => updateUserData('location', e.target.value)}
        className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors text-center text-lg"
      >
        <option value="">Select your location</option>
        {locations.map((location) => (
          <option key={location} value={location}>{location}</option>
        ))}
      </select>
    </div>
  );
};

const DifficultyStep = ({ userData, updateUserData }) => {
  const difficulties = [
    { level: 'easy', name: 'Easy', icon: '🌱', description: 'Perfect for beginners', color: 'green' },
    { level: 'medium', name: 'Medium', icon: '🌟', description: 'Balanced challenge', color: 'blue' },
    { level: 'hard', name: 'Hard', icon: '🔥', description: 'For math champions', color: 'red' }
  ];

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <motion.div
          className="text-6xl mb-4"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          🎯
        </motion.div>
        <p className="text-gray-600">Choose your challenge level</p>
      </div>
      
      <div className="space-y-3">
        {difficulties.map((diff, index) => (
          <motion.button
            key={diff.level}
            onClick={() => updateUserData('difficulty', diff.level)}
            className={`w-full p-4 rounded-xl border-2 transition-all ${
              userData.difficulty === diff.level 
                ? `border-${diff.color}-500 bg-${diff.color}-50 text-${diff.color}-700` 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{diff.icon}</span>
              <div className="text-left">
                <div className="font-medium">{diff.name}</div>
                <div className="text-sm text-gray-500">{diff.description}</div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

const WelcomeStep = ({ userData }) => {
  const getAvatarEmoji = (avatarId) => {
    const avatars = {
      bear: '🐻', cat: '🐱', dog: '🐶', fox: '🦊',
      rabbit: '🐰', panda: '🐼', koala: '🐨', lion: '🦁',
      unicorn: '🦄', dragon: '🐉', owl: '🦉', penguin: '🐧'
    };
    return avatars[avatarId] || '🐻';
  };

  return (
    <div className="text-center space-y-6">
      <motion.div
        className="text-8xl mb-6"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        🎉
      </motion.div>
      
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome, {userData.name}!
        </h3>
        <p className="text-gray-600 mb-6">
          Your Math Hero adventure is about to begin! 🚀
        </p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
        <h4 className="font-bold text-gray-800 mb-4">Your Profile:</h4>
        <div className="space-y-2 text-sm text-gray-600">
          <div>👤 Name: {userData.name}</div>
          <div>🎂 Age: {userData.age}</div>
          <div>{getAvatarEmoji(userData.avatar)} Avatar: {userData.avatar}</div>
          <div>🎯 Difficulty: {userData.difficulty}</div>
          <div>🌍 Language: {userData.language}</div>
          {userData.location && <div>🗺️ Location: {userData.location}</div>}
        </div>
      </div>

      <motion.div
        className="text-lg text-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Ready to become a Math Hero? Let's go! 🦸‍♂️
      </motion.div>
    </div>
  );
};

// Validation function
const validateStep = (step, userData) => {
  switch (step) {
    case 0: return true; // Language always valid
    case 1: return userData.name.trim().length > 0;
    case 2: return userData.age !== '';
    case 3: return userData.avatar !== '';
    case 4: return true; // Email is optional
    case 5: return true; // Location is optional
    case 6: return userData.difficulty !== '';
    case 7: return true; // Welcome step
    default: return false;
  }
};

export default Onboarding;