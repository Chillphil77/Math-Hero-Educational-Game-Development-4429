import React, { createContext, useContext, useState } from 'react';

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }) => {
  const [currentGame, setCurrentGame] = useState(null);
  const [gameState, setGameState] = useState({});
  const [gameHistory, setGameHistory] = useState([]);

  const startGame = (gameType, config = {}) => {
    setCurrentGame(gameType);
    setGameState({
      ...config,
      startTime: Date.now(),
      score: 0,
      lives: 3,
      level: 1,
      isPlaying: true
    });
  };

  const updateGameState = (updates) => {
    setGameState(prev => ({ ...prev, ...updates }));
  };

  const endGame = (finalScore, stats = {}) => {
    const gameRecord = {
      gameType: currentGame,
      score: finalScore,
      duration: Date.now() - gameState.startTime,
      timestamp: new Date().toISOString(),
      ...stats
    };
    setGameHistory(prev => [...prev, gameRecord]);
    setCurrentGame(null);
    setGameState({});
    return gameRecord;
  };

  const generateMathProblem = (operation, difficulty = 'medium', age = 8, enablePercentages = false) => {
    const getRange = (diff) => {
      switch (diff) {
        case 'easy': return age <= 7 ? [1, 5] : [1, 10];
        case 'medium': return age <= 7 ? [1, 10] : [1, 50];
        case 'hard': return age <= 7 ? [1, 20] : [1, 100];
        default: return [1, 10];
      }
    };

    const [min, max] = getRange(difficulty);
    let num1, num2, answer, question;

    switch (operation) {
      case 'addition':
        num1 = Math.floor(Math.random() * max) + min;
        num2 = Math.floor(Math.random() * max) + min;
        answer = num1 + num2;
        question = `${num1} + ${num2}`;
        break;
      case 'subtraction':
        num1 = Math.floor(Math.random() * max) + min;
        num2 = Math.floor(Math.random() * num1) + 1;
        answer = num1 - num2;
        question = `${num1} - ${num2}`;
        break;
      case 'multiplication':
        num1 = Math.floor(Math.random() * (difficulty === 'easy' ? 5 : 10)) + 1;
        num2 = Math.floor(Math.random() * (difficulty === 'easy' ? 5 : 10)) + 1;
        answer = num1 * num2;
        question = `${num1} × ${num2}`;
        break;
      case 'division':
        num2 = Math.floor(Math.random() * (difficulty === 'easy' ? 5 : 10)) + 1;
        answer = Math.floor(Math.random() * (difficulty === 'easy' ? 10 : 20)) + 1;
        num1 = num2 * answer;
        question = `${num1} ÷ ${num2}`;
        break;
      case 'percentages':
        if (enablePercentages) {
          // Simple percentage calculations
          const percentage = [5, 10, 15, 20, 25, 30, 50, 75][Math.floor(Math.random() * 8)];
          const baseNumber = Math.floor(Math.random() * 100) + 10;
          answer = Math.round((percentage / 100) * baseNumber);
          question = `${percentage}% of ${baseNumber}`;
          break;
        }
        // Fall through to default if percentages not enabled
      default:
        num1 = Math.floor(Math.random() * max) + min;
        num2 = Math.floor(Math.random() * max) + min;
        answer = num1 + num2;
        question = `${num1} + ${num2}`;
    }

    return { question, answer, num1, num2, operation };
  };

  const generateMultipleChoice = (correctAnswer, count = 4) => {
    const choices = [correctAnswer];
    const range = Math.max(10, Math.floor(correctAnswer * 0.5));

    while (choices.length < count) {
      const wrongAnswer = correctAnswer + Math.floor(Math.random() * range * 2) - range;
      if (wrongAnswer !== correctAnswer && wrongAnswer > 0 && !choices.includes(wrongAnswer)) {
        choices.push(wrongAnswer);
      }
    }

    return choices.sort(() => Math.random() - 0.5);
  };

  const value = {
    currentGame,
    gameState,
    gameHistory,
    startGame,
    updateGameState,
    endGame,
    generateMathProblem,
    generateMultipleChoice
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};