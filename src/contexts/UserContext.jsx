import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('mathHeroUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (userData) => {
    const userWithDefaults = {
      ...userData,
      coins: userData.coins || 0, // Start with 0 coins
      level: userData.level || 1,
      xp: userData.xp || 0,
      streak: userData.streak || 0,
      achievements: userData.achievements || [], // Ensure it's an array
      ownedItems: userData.ownedItems || [],
      stats: userData.stats || {
        totalProblems: 0,
        correctAnswers: 0,
        accuracy: 0,
        averageTime: 0,
        gamesPlayed: 0
      },
      preferences: userData.preferences || {
        difficulty: 'medium',
        soundEnabled: true,
        theme: 'default'
      },
      isPremium: false, // Start as free user
      createdAt: userData.createdAt || new Date().toISOString(),
      avatar: userData.avatar || 'bear'
    };

    setUser(userWithDefaults);
    setIsAuthenticated(true);

    // Save with unique user ID to prevent shared progress
    const userKey = `mathHeroUser_${userWithDefaults.id || Date.now()}`;
    localStorage.setItem(userKey, JSON.stringify(userWithDefaults));
    localStorage.setItem('mathHeroCurrentUser', userKey);
    localStorage.setItem('mathHeroUser', JSON.stringify(userWithDefaults));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('mathHeroCurrentUser'); // Don't remove the user data, just the current session
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);

    // Update with user-specific key
    const userKey = localStorage.getItem('mathHeroCurrentUser') || `mathHeroUser_${user.id}`;
    localStorage.setItem(userKey, JSON.stringify(updatedUser));
    localStorage.setItem('mathHeroUser', JSON.stringify(updatedUser));
  };

  const addCoins = (amount) => {
    console.log(`Adding ${amount} coins to user with current balance: ${user.coins || 0}`);
    const newCoins = (user.coins || 0) + amount;
    updateUser({ coins: newCoins });
    return newCoins;
  };

  const spendCoins = (amount) => {
    console.log(`Spending ${amount} coins. Current balance: ${user.coins || 0}`);
    if ((user.coins || 0) >= amount) {
      const newCoins = user.coins - amount;
      updateUser({ coins: newCoins });
      return true;
    }
    return false;
  };

  const addXP = (amount) => {
    const newXP = (user.xp || 0) + amount;
    const newLevel = Math.floor(newXP / 100) + 1;
    updateUser({
      xp: newXP,
      level: newLevel > user.level ? newLevel : user.level
    });
  };

  const updateStats = (newStats) => {
    const updatedStats = { ...(user.stats || {}), ...newStats };
    updateUser({ stats: updatedStats });
  };

  const addAchievement = (achievement) => {
    if (!user.achievements.includes(achievement)) {
      const newAchievements = [...user.achievements, achievement];
      updateUser({ achievements: newAchievements });
    }
  };

  const purchaseItem = (item) => {
    console.log(`Attempting to purchase item: ${item.id} for ${item.price} coins`);
    if (spendCoins(item.price)) {
      const newOwnedItems = [...(user.ownedItems || []), item.id];
      updateUser({ ownedItems: newOwnedItems });
      return true;
    }
    return false;
  };

  const getAvatarEmoji = () => {
    const avatars = {
      bear: '🐻',
      cat: '🐱',
      dog: '🐶',
      fox: '🦊',
      rabbit: '🐰',
      panda: '🐼',
      koala: '🐨',
      lion: '🦁',
      unicorn: '🦄',
      dragon: '🐉',
      owl: '🦉',
      penguin: '🐧'
    };
    return avatars[user?.avatar] || '🐻';
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    updateUser,
    addCoins,
    spendCoins,
    addXP,
    updateStats,
    addAchievement,
    purchaseItem,
    getAvatarEmoji
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};