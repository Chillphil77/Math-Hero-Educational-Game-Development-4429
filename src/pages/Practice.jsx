import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import { useLanguage } from '../contexts/LanguageContext';
import MathProblem from '../components/MathProblem';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiMinus, FiX, FiDivide, FiSettings, FiPlay, FiPause, FiGrid, FiPercent } = FiIcons;

const Practice = () => {
  const { user } = useUser();
  const { t } = useLanguage();

  const [selectedOperation, setSelectedOperation] = useState('addition');
  const [difficulty, setDifficulty] = useState(user?.preferences?.difficulty || 'medium');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [timeLimit, setTimeLimit] = useState(null);
  const [showMultipleChoice, setShowMultipleChoice] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [enablePercentages, setEnablePercentages] = useState(user?.preferences?.enablePercentages || false);

  const operations = [
    {
      id: 'addition',
      name: t('addition'),
      icon: FiPlus,
      symbol: '+',
      color: 'green',
      description: 'Add numbers together'
    },
    {
      id: 'subtraction',
      name: t('subtraction'),
      icon: FiMinus,
      symbol: '-',
      color: 'red',
      description: 'Subtract numbers'
    },
    {
      id: 'multiplication',
      name: t('multiplication'),
      icon: FiX,
      symbol: '×',
      color: 'blue',
      description: 'Multiply numbers'
    },
    {
      id: 'multiplicationTables',
      name: t('multiplicationTables'),
      icon: FiGrid,
      symbol: '×',
      color: 'purple',
      description: 'Practice times tables (2×, 3×, etc.)'
    },
    {
      id: 'division',
      name: t('division'),
      icon: FiDivide,
      symbol: '÷',
      color: 'orange',
      description: 'Divide numbers'
    }
  ];

  // Add percentages if enabled
  if (enablePercentages) {
    operations.push({
      id: 'percentages',
      name: t('percentages'),
      icon: FiPercent,
      symbol: '%',
      color: 'pink',
      description: 'Calculate percentages'
    });
  }

  // Filter operations based on age
  const availableOperations = operations.filter(op => {
    if (user?.age <= 7) {
      return ['addition', 'subtraction'].includes(op.id);
    }
    if (user?.age <= 9) {
      return ['addition', 'subtraction', 'multiplication', 'multiplicationTables'].includes(op.id);
    }
    return true;
  });

  const multiplicationTables = [
    { number: 2, name: '2er Reihe', color: 'bg-red-100 text-red-700' },
    { number: 3, name: '3er Reihe', color: 'bg-blue-100 text-blue-700' },
    { number: 4, name: '4er Reihe', color: 'bg-green-100 text-green-700' },
    { number: 5, name: '5er Reihe', color: 'bg-yellow-100 text-yellow-700' },
    { number: 6, name: '6er Reihe', color: 'bg-purple-100 text-purple-700' },
    { number: 7, name: '7er Reihe', color: 'bg-pink-100 text-pink-700' },
    { number: 8, name: '8er Reihe', color: 'bg-indigo-100 text-indigo-700' },
    { number: 9, name: '9er Reihe', color: 'bg-orange-100 text-orange-700' },
    { number: 10, name: '10er Reihe', color: 'bg-gray-100 text-gray-700' }
  ];

  const difficulties = [
    {
      id: 'easy',
      name: t('easy'),
      description: 'Small numbers, no time limit'
    },
    {
      id: 'medium',
      name: t('medium'),
      description: 'Medium numbers, optional timer'
    },
    {
      id: 'hard',
      name: t('hard'),
      description: 'Large numbers, timed challenges'
    }
  ];

  const handleOperationSelect = (operation) => {
    setSelectedOperation(operation);
    setIsPlaying(false);
    if (operation !== 'multiplicationTables') {
      setSelectedTable(null);
    }
  };

  const handleTableSelect = (tableNumber) => {
    setSelectedTable(tableNumber);
    setSelectedOperation('multiplicationTables');
  };

  const handleStartPractice = () => {
    setIsPlaying(true);
    setShowSettings(false);
  };

  const handleCorrectAnswer = (streak) => {
    console.log('Correct answer! Streak:', streak);
  };

  const handleIncorrectAnswer = () => {
    console.log('Incorrect answer');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Math Practice 📚
        </h1>
        <p className="text-xl text-gray-600">
          Choose an operation and start practicing!
        </p>
      </motion.div>

      {!isPlaying ? (
        <>
          {/* Operation Selection */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Choose Operation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableOperations.map((operation, index) => (
                <motion.div
                  key={operation.id}
                  className={`bg-white rounded-2xl p-6 shadow-lg cursor-pointer transition-all ${
                    selectedOperation === operation.id 
                      ? `ring-4 ring-${operation.color}-300 shadow-xl` 
                      : 'hover:shadow-xl'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleOperationSelect(operation.id)}
                >
                  <div className={`w-16 h-16 rounded-2xl bg-${operation.color}-100 flex items-center justify-center mb-4 mx-auto`}>
                    <SafeIcon icon={operation.icon} className={`w-8 h-8 text-${operation.color}-600`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
                    {operation.name}
                  </h3>
                  <p className="text-gray-600 text-center text-sm mb-4">
                    {operation.description}
                  </p>
                  <div className={`text-center text-3xl font-bold text-${operation.color}-600`}>
                    {operation.symbol}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Multiplication Tables Selection */}
          {selectedOperation === 'multiplicationTables' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                {t('multiplicationTables')} - Choose a Table
              </h2>
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {multiplicationTables.map((table) => (
                  <motion.button
                    key={table.number}
                    onClick={() => handleTableSelect(table.number)}
                    className={`p-4 rounded-xl font-bold transition-all ${
                      selectedTable === table.number 
                        ? 'ring-4 ring-blue-300 scale-105' 
                        : 'hover:scale-105'
                    } ${table.color}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="text-2xl font-bold">{table.number}×</div>
                    <div className="text-sm">{table.name}</div>
                  </motion.button>
                ))}
              </div>

              {selectedTable && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 p-4 bg-blue-50 rounded-xl"
                >
                  <h3 className="text-lg font-bold text-blue-800 mb-3">
                    {selectedTable}er Reihe Preview:
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                    {Array.from({ length: 10 }, (_, i) => (
                      <div key={i} className="text-blue-700">
                        {selectedTable} × {i + 1} = {selectedTable * (i + 1)}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Settings */}
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
              <motion.button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <SafeIcon icon={FiSettings} className="w-6 h-6 text-gray-600" />
              </motion.button>
            </div>

            {showSettings && (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {/* Enable Percentages */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">{t('enablePercentages')}</h3>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={enablePercentages}
                      onChange={(e) => setEnablePercentages(e.target.checked)}
                      className="w-5 h-5 text-pink-600 rounded focus:ring-pink-500"
                    />
                    <span>Enable percentage calculations (15% of 80, etc.)</span>
                  </label>
                </div>

                {/* Difficulty */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Difficulty</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {difficulties.map((diff) => (
                      <motion.button
                        key={diff.id}
                        onClick={() => setDifficulty(diff.id)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          difficulty === diff.id
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="font-semibold">{diff.name}</div>
                        <div className="text-sm text-gray-600">{diff.description}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Time Limit */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Time Limit</h3>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={timeLimit !== null}
                        onChange={(e) => setTimeLimit(e.target.checked ? 30 : null)}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span>Enable timer</span>
                    </label>
                    {timeLimit !== null && (
                      <select
                        value={timeLimit}
                        onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={15}>15 seconds</option>
                        <option value={30}>30 seconds</option>
                        <option value={60}>1 minute</option>
                      </select>
                    )}
                  </div>
                </div>

                {/* Multiple Choice */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Answer Format</h3>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={showMultipleChoice}
                        onChange={(e) => setShowMultipleChoice(e.target.checked)}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span>Multiple choice</span>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Start Button */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.button
              onClick={handleStartPractice}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold text-xl px-12 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!selectedOperation || (selectedOperation === 'multiplicationTables' && !selectedTable)}
            >
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiPlay} className="w-6 h-6" />
                <span>Start Practice</span>
              </div>
            </motion.button>
          </motion.div>
        </>
      ) : (
        <>
          {/* Practice Session */}
          <div className="text-center mb-8">
            <motion.button
              onClick={() => setIsPlaying(false)}
              className="bg-gray-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-gray-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiPause} className="w-5 h-5" />
                <span>Stop Practice</span>
              </div>
            </motion.button>
          </div>

          <MathProblem
            operation={selectedOperation}
            difficulty={difficulty}
            onCorrect={handleCorrectAnswer}
            onIncorrect={handleIncorrectAnswer}
            showMultipleChoice={showMultipleChoice}
            timeLimit={timeLimit}
            selectedTable={selectedTable}
            enablePercentages={enablePercentages}
          />
        </>
      )}
    </div>
  );
};

export default Practice;