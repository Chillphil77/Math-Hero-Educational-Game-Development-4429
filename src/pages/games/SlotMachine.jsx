import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../contexts/GameContext';
import { useUser } from '../../contexts/UserContext';
import { useSound } from '../../contexts/SoundContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

const SlotMachine = () => {
  const { generateMathProblem } = useGame();
  const { user, addCoins, addXP, updateUser, purchaseItem } = useUser();
  const { playSound } = useSound();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [gameState, setGameState] = useState({
    reels: [
      ['11×9', '8+7', '20÷4'],
      ['15×6', '9+8', '24÷3'],
      ['12×7', '6+9', '35÷5']
    ],
    spinning: false,
    currentProblem: null,
    userAnswer: '',
    credits: 20,
    bet: 1,
    totalWinnings: 0,
    streak: 0,
    lastWin: 0,
    showProblem: false,
    problemSolved: false,
    canSpin: true,
    showWinningItem: false,
    winningItem: null
  });

  // Shop items for slot machine prizes
  const shopItems = [
    {id: 'lollipop', name: 'Math Lollipop', description: 'A sweet treat for your virtual desk!', icon: '🍭', price: 20, color: 'from-pink-400 to-pink-600'},
    {id: 'teddy', name: 'Number Teddy Bear', description: 'A cuddly bear who loves counting!', icon: '🧸', price: 50, color: 'from-amber-400 to-amber-600'},
    {id: 'pirate_hat', name: 'Pirate Captain Hat', description: 'Look like a true math pirate captain!', icon: '🏴‍☠️', price: 75, color: 'from-blue-400 to-blue-600'},
    {id: 'dino', name: 'Dinosaur Figure', description: 'A prehistoric math buddy for your collection!', icon: '🦖', price: 100, color: 'from-green-400 to-green-600'},
    {id: 'robot', name: 'Math Robot', description: 'A helpful robot to assist with calculations!', icon: '🤖', price: 150, color: 'from-gray-400 to-gray-600'},
    {id: 'wizard_hat', name: 'Wizard Hat', description: 'Perform magical math spells!', icon: '🧙‍♂️', price: 200, color: 'from-purple-400 to-purple-600'},
    {id: 'rocket', name: 'Space Rocket', description: 'Blast off into the math universe!', icon: '🚀', price: 250, color: 'from-indigo-400 to-indigo-600'},
    {id: 'crown', name: 'Math Champion Crown', description: 'Show everyone you\'re a math royalty!', icon: '👑', price: 500, color: 'from-yellow-400 to-yellow-600'}
  ];

  // Slot symbols based on shop items
  const slotSymbols = shopItems.map(item => item.icon);

  const mathExpressions = [
    '11×9', '8+7', '20÷4', '15×6', '9+8', '24÷3', '12×7', '6+9', '35÷5',
    '14×5', '7+8', '45÷9', '13×4', '9+6', '28÷7', '16×3', '8+9', '36÷6'
  ];

  useEffect(() => {
    generateNewProblem();
  }, []);

  const generateNewProblem = () => {
    const operations = ['addition', 'subtraction', 'multiplication', 'division', 'percentages'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    const problem = generateMathProblem(operation, 'medium', user?.age || 8, true);
    setGameState(prev => ({
      ...prev,
      currentProblem: problem,
      userAnswer: '',
      problemSolved: false
    }));
  };

  const spinReels = () => {
    if (gameState.credits < gameState.bet) {
      playSound('incorrect');
      return;
    }

    setGameState(prev => ({
      ...prev,
      spinning: true,
      credits: prev.credits - prev.bet,
      showProblem: false,
      problemSolved: false,
      canSpin: false,
      showWinningItem: false,
      winningItem: null
    }));

    playSound('whoosh');

    // Animate reels spinning with shop items instead of math expressions
    const spinDuration = 2000;
    const intervals = [];
    
    // Create new reels with shop item symbols
    const newReels = Array(3).fill().map(() => 
      Array(3).fill().map(() => slotSymbols[Math.floor(Math.random() * slotSymbols.length)])
    );

    // Initial random spinning
    gameState.reels.forEach((_, reelIndex) => {
      const interval = setInterval(() => {
        setGameState(prev => {
          const updatedReels = [...prev.reels];
          updatedReels[reelIndex] = [
            slotSymbols[Math.floor(Math.random() * slotSymbols.length)],
            slotSymbols[Math.floor(Math.random() * slotSymbols.length)],
            slotSymbols[Math.floor(Math.random() * slotSymbols.length)]
          ];
          return { ...prev, reels: updatedReels };
        });
      }, 100);
      
      intervals.push(interval);

      // Stop each reel at different times
      setTimeout(() => {
        clearInterval(interval);
        
        setGameState(prev => {
          const updatedReels = [...prev.reels];
          updatedReels[reelIndex] = newReels[reelIndex];
          return { ...prev, reels: updatedReels };
        });
        
        if (reelIndex === gameState.reels.length - 1) {
          // All reels stopped
          setTimeout(() => {
            setGameState(prev => {
              const centerRow = [prev.reels[0][1], prev.reels[1][1], prev.reels[2][1]];
              const allSame = centerRow[0] === centerRow[1] && centerRow[1] === centerRow[2];
              
              if (allSame) {
                // Player won an item!
                const matchingItem = shopItems.find(item => item.icon === centerRow[0]);
                
                // Check if player already owns this item
                if (matchingItem && !user?.ownedItems?.includes(matchingItem.id)) {
                  // Award the item directly
                  return {
                    ...prev, 
                    spinning: false,
                    showWinningItem: true,
                    winningItem: matchingItem
                  };
                }
              }
              
              // No win or already owns item, show math problem
              return {
                ...prev,
                spinning: false,
                showProblem: true
              };
            });
          }, 300);
        }
      }, spinDuration + (reelIndex * 300));
    });
  };

  const handleAnswerSubmit = () => {
    if (!gameState.userAnswer.trim()) return;
    
    const isCorrect = parseInt(gameState.userAnswer) === gameState.currentProblem.answer;
    
    if (isCorrect) {
      playSound('correct');
      
      const winMultiplier = calculateWinMultiplier();
      const winAmount = gameState.bet * winMultiplier;
      const newStreak = gameState.streak + 1;
      const newCredits = gameState.credits + winAmount;
      const newTotalWinnings = gameState.totalWinnings + winAmount;
      
      setGameState(prev => ({
        ...prev,
        credits: newCredits,
        totalWinnings: newTotalWinnings,
        streak: newStreak,
        lastWin: winAmount,
        problemSolved: true,
        showProblem: false,
        canSpin: true
      }));
      
      // Add coins to user account
      addCoins(winAmount);
      addXP(15);
      
      if (winMultiplier > 1) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFD700', '#FFA500', '#FF6347']
        });
      }
      
      // Generate new problem for next spin
      setTimeout(() => {
        generateNewProblem();
      }, 2000);
    } else {
      playSound('incorrect');
      setGameState(prev => ({
        ...prev,
        streak: 0,
        lastWin: 0,
        userAnswer: ''
      }));
    }
  };

  const calculateWinMultiplier = () => {
    const reels = gameState.reels;
    const centerRow = [reels[0][1], reels[1][1], reels[2][1]];
    
    // Check for matches
    if (centerRow[0] === centerRow[1] && centerRow[1] === centerRow[2]) {
      // Three of a kind
      return 10;
    } else if (centerRow[0] === centerRow[1] || centerRow[1] === centerRow[2] || centerRow[0] === centerRow[2]) {
      // Two of a kind
      return 2;
    }
    return 1; // No match, but correct answer still wins bet back
  };

  const claimItem = () => {
    if (gameState.winningItem) {
      // Add item to user's inventory
      const newOwnedItems = [...(user?.ownedItems || []), gameState.winningItem.id];
      updateUser({ ownedItems: newOwnedItems });
      
      // Show celebration
      confetti({
        particleCount: 200,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#FF6347']
      });
      playSound('achievement');
      
      // Reset game state
      setGameState(prev => ({
        ...prev,
        showWinningItem: false,
        winningItem: null,
        canSpin: true
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          className="bg-white rounded-2xl p-6 mb-6 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-center space-x-4 mb-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              🎰
            </motion.div>
            <h1 className="text-4xl font-bold text-gray-800">Lucky Math Slots</h1>
            <motion.div
              animate={{ rotate: [0, -360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              🎰
            </motion.div>
          </div>
          <p className="text-xl text-gray-600">
            Solve math problems to spin and win! Match items to win prizes! 🎲
          </p>
        </motion.div>

        {/* Game Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <motion.div className="bg-white rounded-xl p-4 text-center" whileHover={{ scale: 1.05 }}>
            <div className="text-2xl font-bold text-blue-600">{gameState.credits}</div>
            <div className="text-sm text-gray-600">Credits</div>
          </motion.div>
          <motion.div className="bg-white rounded-xl p-4 text-center" whileHover={{ scale: 1.05 }}>
            <div className="text-2xl font-bold text-green-600">{gameState.totalWinnings}</div>
            <div className="text-sm text-gray-600">Total Winnings</div>
          </motion.div>
          <motion.div className="bg-white rounded-xl p-4 text-center" whileHover={{ scale: 1.05 }}>
            <div className="text-2xl font-bold text-orange-600">{gameState.streak}</div>
            <div className="text-sm text-gray-600">Streak</div>
          </motion.div>
          <motion.div className="bg-white rounded-xl p-4 text-center" whileHover={{ scale: 1.05 }}>
            <div className="text-2xl font-bold text-purple-600">{user?.coins || 0}</div>
            <div className="text-sm text-gray-600">Your Coins</div>
          </motion.div>
        </div>

        {/* Slot Machine */}
        <motion.div
          className="bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-3xl p-8 mb-6 shadow-2xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {/* Machine Header */}
          <div className="text-center mb-6">
            <motion.div
              className="text-6xl mb-4"
              animate={{
                scale: gameState.spinning ? [1, 1.2, 1] : 1,
                rotate: gameState.spinning ? [0, 360] : 0
              }}
              transition={{ duration: 0.5, repeat: gameState.spinning ? Infinity : 0 }}
            >
              🎰
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800">Lucky Math Slots</h2>
          </div>

          {/* Reels - Now showing shop items */}
          <div className="bg-black rounded-2xl p-6 mb-6">
            <div className="grid grid-cols-3 gap-4">
              {gameState.reels.map((reel, reelIndex) => (
                <div key={reelIndex} className="bg-white rounded-xl overflow-hidden">
                  {reel.map((symbol, symbolIndex) => (
                    <motion.div
                      key={`${reelIndex}-${symbolIndex}`}
                      className="h-20 flex items-center justify-center text-lg font-bold border-b border-gray-200 last:border-b-0"
                      animate={{
                        y: gameState.spinning ? [0, -10, 0] : 0,
                        scale: gameState.spinning ? [1, 1.1, 1] : 1
                      }}
                      transition={{
                        duration: 0.1,
                        repeat: gameState.spinning ? Infinity : 0,
                        delay: reelIndex * 0.1
                      }}
                    >
                      <span className="text-4xl">
                        {symbol}
                      </span>
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-800">Bet</div>
                <select
                  value={gameState.bet}
                  onChange={(e) => setGameState(prev => ({ ...prev, bet: parseInt(e.target.value) }))}
                  className="px-3 py-2 rounded-lg border border-gray-300 font-bold"
                  disabled={gameState.spinning}
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={5}>5</option>
                </select>
              </div>
              {gameState.lastWin > 0 && (
                <motion.div
                  className="bg-green-500 text-white px-4 py-2 rounded-xl font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  Won: {gameState.lastWin}
                </motion.div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={spinReels}
                disabled={gameState.spinning || gameState.credits < gameState.bet || !gameState.canSpin}
                className="bg-red-500 text-white px-8 py-4 rounded-xl font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{
                  scale:
                    !gameState.spinning && gameState.credits >= gameState.bet && gameState.canSpin
                      ? 1.05
                      : 1
                }}
                whileTap={{
                  scale:
                    !gameState.spinning && gameState.credits >= gameState.bet && gameState.canSpin
                      ? 0.95
                      : 1
                }}
              >
                {gameState.spinning ? 'SPINNING...' : 'SPIN'}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Math Problem Modal */}
      <AnimatePresence>
        {gameState.showProblem && gameState.currentProblem && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl p-8 max-w-md w-full text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="text-6xl mb-4">🧮</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Solve to Win!</h2>
              <div className="text-4xl font-bold text-blue-600 mb-6">
                {gameState.currentProblem.question} = ?
              </div>
              <input
                type="number"
                value={gameState.userAnswer}
                onChange={(e) => setGameState(prev => ({ ...prev, userAnswer: e.target.value }))}
                className="w-full text-center text-2xl font-bold py-4 px-6 rounded-xl border-2 border-blue-300 focus:border-blue-500 focus:outline-none mb-6"
                placeholder="Your answer"
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAnswerSubmit();
                  }
                }}
              />
              <motion.button
                onClick={handleAnswerSubmit}
                disabled={!gameState.userAnswer.trim()}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-4 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: gameState.userAnswer.trim() ? 1.05 : 1 }}
                whileTap={{ scale: gameState.userAnswer.trim() ? 0.95 : 1 }}
              >
                Submit Answer
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Winning Item Modal */}
      <AnimatePresence>
        {gameState.showWinningItem && gameState.winningItem && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl p-8 max-w-md w-full text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <motion.div
                className="text-9xl mb-6"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {gameState.winningItem.icon}
              </motion.div>
              <h2 className="text-3xl font-bold text-green-600 mb-4">Jackpot! You Won!</h2>
              <p className="text-gray-600 mb-6">
                Congratulations! You've won a <strong>{gameState.winningItem.name}</strong>!
              </p>
              <div className="bg-green-50 p-4 rounded-xl mb-6">
                <p className="text-green-700">{gameState.winningItem.description}</p>
                <div className="mt-2 text-sm text-green-600">
                  Value: 🪙 {gameState.winningItem.price} coins
                </div>
              </div>
              <motion.button
                onClick={claimItem}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-4 px-6 rounded-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Claim Prize! 🎁
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Paytable */}
      <motion.div
        className="bg-white rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Paytable</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { symbols: 'Match 3 items', multiplier: 'Win the item!' },
            { symbols: 'Match 3 symbols', multiplier: '10x Bet' },
            { symbols: 'Match 2 symbols', multiplier: '2x Bet' },
            { symbols: 'Correct Answer', multiplier: '1x Bet' },
            { symbols: 'Wrong Answer', multiplier: 'Lose Bet' }
          ].map((item, index) => (
            <motion.div
              key={index}
              className="text-center p-3 bg-gray-50 rounded-lg"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-lg mb-2 font-mono">{item.symbols}</div>
              <div className="font-bold text-sm">{item.multiplier}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Back Button */}
      <motion.div
        className="text-center mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          onClick={() => navigate('/mini-games')}
          className="bg-gray-600 text-white font-bold px-8 py-4 rounded-xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {t('back')} to Games
        </motion.button>
      </motion.div>
    </div>
  );
};

export default SlotMachine;