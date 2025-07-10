import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useSound } from '../contexts/SoundContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import confetti from 'canvas-confetti';

const { FiShoppingBag, FiPackage, FiCheckCircle } = FiIcons;

const Shop = () => {
  const { user, purchaseItem, addCoins } = useUser();
  const { t } = useLanguage();
  const { playSound } = useSound();

  const [activeTab, setActiveTab] = useState('shop');
  const [purchaseStatus, setPurchaseStatus] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

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

  const handleItemPreview = (item) => {
    setPreviewItem(item);
    setShowPreview(true);
    playSound('click');
  };

  const closePreview = () => {
    setShowPreview(false);
    setPreviewItem(null);
  };

  const handlePurchase = (item) => {
    setSelectedItem(item);
    // Check if user already owns the item
    if (user?.ownedItems?.includes(item.id)) {
      setPurchaseStatus('already_owned');
      return;
    }
    
    // Check if user has enough coins
    if ((user?.coins || 0) < item.price) {
      setPurchaseStatus('insufficient_funds');
      return;
    }
    
    // Show confirmation dialog
    setPurchaseStatus('confirming');
  };

  const confirmPurchase = () => {
    // Process purchase
    const success = purchaseItem({
      id: selectedItem.id,
      price: selectedItem.price
    });
    
    if (success) {
      // Play success sound and animation
      playSound('coin');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      setPurchaseStatus('success');
    } else {
      setPurchaseStatus('error');
    }
  };

  const closeDialog = () => {
    setPurchaseStatus(null);
    setSelectedItem(null);
  };

  // For debugging/demo purposes - add coins button
  const addTestCoins = () => {
    addCoins(100);
    playSound('coin');
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FFA500']
    });
  };

  const userOwnedItems = shopItems.filter(item => user?.ownedItems?.includes(item.id));

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
            <SafeIcon icon={FiShoppingBag} className="w-12 h-12 text-pink-600" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-800">Math Hero Shop</h1>
          <motion.div
            animate={{ rotate: [0, -360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <SafeIcon icon={FiShoppingBag} className="w-12 h-12 text-blue-600" />
          </motion.div>
        </div>
        <p className="text-xl text-gray-600">
          Spend your hard-earned coins on fun items! 🪙
        </p>
      </motion.div>

      {/* User Coins */}
      <motion.div
        className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl p-6 text-white shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Your Coins</h2>
            <p className="opacity-90">Use your math coins to purchase items!</p>
          </div>
          <div className="flex items-center space-x-4">
            <motion.div
              className="text-5xl font-bold flex items-center space-x-2"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-6xl">🪙</span>
              <span>{user?.coins || 0}</span>
            </motion.div>
            
            {/* Add Coins for testing/demo */}
            <motion.button
              onClick={addTestCoins}
              className="bg-yellow-300 text-yellow-800 px-3 py-2 rounded-lg text-sm font-bold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              + Add 100 Coins (Demo)
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="flex border-b">
          <motion.button
            className={`flex-1 py-4 font-bold text-lg ${
              activeTab === 'shop'
                ? 'text-pink-600 border-b-4 border-pink-500'
                : 'text-gray-500'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('shop')}
          >
            <div className="flex items-center justify-center space-x-2">
              <SafeIcon icon={FiShoppingBag} />
              <span>Shop</span>
            </div>
          </motion.button>
          <motion.button
            className={`flex-1 py-4 font-bold text-lg ${
              activeTab === 'inventory'
                ? 'text-blue-600 border-b-4 border-blue-500'
                : 'text-gray-500'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('inventory')}
          >
            <div className="flex items-center justify-center space-x-2">
              <SafeIcon icon={FiPackage} />
              <span>{t('myItems')}</span>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {user?.ownedItems?.length || 0}
              </span>
            </div>
          </motion.button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'shop' ? (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Items</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {shopItems.map((item, index) => {
                  const isOwned = user?.ownedItems?.includes(item.id);
                  const canAfford = (user?.coins || 0) >= item.price;
                  return (
                    <motion.div
                      key={item.id}
                      className={`bg-white rounded-xl shadow-md overflow-hidden border-2 ${
                        isOwned
                          ? 'border-green-400'
                          : canAfford
                          ? 'border-gray-200 hover:border-pink-400'
                          : 'border-gray-200 opacity-70'
                      } transition-all`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + (index * 0.05) }}
                    >
                      {/* Item Image */}
                      <motion.div
                        className={`h-32 bg-gradient-to-br ${item.color} flex items-center justify-center cursor-pointer`}
                        onClick={() => handleItemPreview(item)}
                        whileHover={{ scale: 1.05 }}
                      >
                        <motion.div
                          className="text-6xl"
                          animate={{
                            y: [0, -10, 0],
                            rotate: isOwned ? [0, 10, -10, 0] : 0
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {item.icon}
                        </motion.div>
                      </motion.div>

                      {/* Item Details */}
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                          {isOwned && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                              <SafeIcon icon={FiCheckCircle} className="mr-1" />
                              {t('owned')}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-4">{item.description}</p>

                        {/* Price and Buy Button */}
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-1">
                            <span className="text-xl">🪙</span>
                            <span className="font-bold text-gray-800">{item.price}</span>
                          </div>
                          <motion.button
                            onClick={() => handlePurchase(item)}
                            className={`px-4 py-2 rounded-lg font-bold text-sm ${
                              isOwned
                                ? 'bg-green-100 text-green-800 cursor-default'
                                : canAfford
                                ? 'bg-pink-500 text-white hover:bg-pink-600'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                            whileHover={!isOwned && canAfford ? { scale: 1.05 } : {}}
                            whileTap={!isOwned && canAfford ? { scale: 0.95 } : {}}
                            disabled={isOwned || !canAfford}
                          >
                            {isOwned ? 'Owned' : t('buy')}
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Items</h2>
              {userOwnedItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {userOwnedItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      className="bg-white rounded-xl shadow-md overflow-hidden border-2 border-green-400"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index, type: "spring" }}
                      onClick={() => handleItemPreview(item)}
                      whileHover={{ scale: 1.05 }}
                      style={{ cursor: 'pointer' }}
                    >
                      {/* Item Image */}
                      <div className={`h-40 bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                        <motion.div
                          className="text-7xl"
                          animate={{ y: [0, -10, 0], rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {item.icon}
                        </motion.div>
                      </div>

                      {/* Item Details */}
                      <div className="p-4 text-center">
                        <h3 className="text-lg font-bold text-gray-800 mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <div className="text-5xl mb-4">🛍️</div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">No Items Yet</h3>
                  <p className="text-gray-600 mb-4">
                    You haven't purchased any items yet. Visit the shop to buy something!
                  </p>
                  <motion.button
                    onClick={() => setActiveTab('shop')}
                    className="px-6 py-3 bg-blue-500 text-white font-bold rounded-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Go to Shop
                  </motion.button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Item Preview Modal */}
      <AnimatePresence>
        {showPreview && previewItem && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl p-8 max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="text-center">
                <motion.div
                  className="text-[150px] mb-6 mx-auto"
                  animate={{
                    rotate: [0, 10, -10, 0],
                    y: [0, -20, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  {previewItem.icon}
                </motion.div>
                
                <h2 className="text-3xl font-bold text-gray-800 mb-4">{previewItem.name}</h2>
                <p className="text-xl text-gray-600 mb-6">{previewItem.description}</p>
                
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Price:</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">🪙</span>
                      <span className="text-2xl font-bold">{previewItem.price}</span>
                    </div>
                  </div>
                  
                  {user?.ownedItems?.includes(previewItem.id) && (
                    <div className="mt-2 bg-green-100 text-green-800 px-3 py-2 rounded-lg flex items-center justify-center space-x-2">
                      <SafeIcon icon={FiCheckCircle} />
                      <span>You own this item!</span>
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-4">
                  <motion.button
                    onClick={closePreview}
                    className="flex-1 py-3 bg-gray-500 text-white font-bold rounded-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Close
                  </motion.button>
                  
                  {!user?.ownedItems?.includes(previewItem.id) && (
                    <motion.button
                      onClick={() => {
                        closePreview();
                        handlePurchase(previewItem);
                      }}
                      className={`flex-1 py-3 font-bold rounded-xl ${
                        (user?.coins || 0) >= previewItem.price
                          ? 'bg-pink-500 text-white'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      whileHover={(user?.coins || 0) >= previewItem.price ? { scale: 1.05 } : {}}
                      whileTap={(user?.coins || 0) >= previewItem.price ? { scale: 0.95 } : {}}
                      disabled={(user?.coins || 0) < previewItem.price}
                    >
                      {(user?.coins || 0) >= previewItem.price
                        ? `Buy for 🪙 ${previewItem.price}`
                        : `Need 🪙 ${previewItem.price - (user?.coins || 0)} more`}
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Purchase Dialog */}
      <AnimatePresence>
        {purchaseStatus && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl p-8 max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              {purchaseStatus === 'confirming' && (
                <>
                  <div className="text-center mb-6">
                    <motion.div
                      className="text-7xl mb-4 mx-auto"
                      animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      {selectedItem.icon}
                    </motion.div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      Confirm Purchase
                    </h2>
                    <p className="text-gray-600">
                      Are you sure you want to buy {selectedItem.name} for 🪙 {selectedItem.price} coins?
                    </p>
                  </div>
                  <div className="flex space-x-4">
                    <motion.button
                      onClick={closeDialog}
                      className="flex-1 py-3 bg-gray-500 text-white font-bold rounded-xl"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      onClick={confirmPurchase}
                      className="flex-1 py-3 bg-pink-500 text-white font-bold rounded-xl"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Buy Now
                    </motion.button>
                  </div>
                </>
              )}

              {purchaseStatus === 'success' && (
                <>
                  <div className="text-center mb-6">
                    <motion.div
                      className="text-7xl mb-4 mx-auto"
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.4, 1], rotate: [0, 20, -20, 0] }}
                      transition={{ duration: 0.7 }}
                    >
                      {selectedItem.icon}
                    </motion.div>
                    <h2 className="text-2xl font-bold text-green-600 mb-2">
                      Purchase Complete!
                    </h2>
                    <p className="text-gray-600">
                      You now own the {selectedItem.name}! Check your inventory to see it.
                    </p>
                  </div>
                  <motion.button
                    onClick={() => {
                      closeDialog();
                      setActiveTab('inventory');
                    }}
                    className="w-full py-3 bg-green-500 text-white font-bold rounded-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View My Items
                  </motion.button>
                </>
              )}

              {purchaseStatus === 'insufficient_funds' && (
                <>
                  <div className="text-center mb-6">
                    <div className="text-7xl mb-4 mx-auto">😢</div>
                    <h2 className="text-2xl font-bold text-red-600 mb-2">
                      Not Enough Coins
                    </h2>
                    <p className="text-gray-600 mb-4">
                      You need {selectedItem.price} coins to buy this item, but you only have {user?.coins || 0}.
                    </p>
                    <div className="bg-yellow-50 rounded-xl p-4 text-left">
                      <h3 className="font-bold text-yellow-800 mb-2">How to get more coins:</h3>
                      <ul className="text-yellow-700 text-sm space-y-1">
                        <li>• Practice math problems to earn coins</li>
                        <li>• Play mini-games to win bonus coins</li>
                        <li>• Complete daily challenges for extra rewards</li>
                        <li>• Maintain your streak for multipliers</li>
                      </ul>
                    </div>
                  </div>
                  <motion.button
                    onClick={closeDialog}
                    className="w-full py-3 bg-blue-500 text-white font-bold rounded-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Got It
                  </motion.button>
                </>
              )}

              {purchaseStatus === 'already_owned' && (
                <>
                  <div className="text-center mb-6">
                    <div className="text-7xl mb-4 mx-auto">{selectedItem.icon}</div>
                    <h2 className="text-2xl font-bold text-blue-600 mb-2">
                      Already Owned
                    </h2>
                    <p className="text-gray-600">
                      You already own the {selectedItem.name}! Check your inventory to see it.
                    </p>
                  </div>
                  <motion.button
                    onClick={() => {
                      closeDialog();
                      setActiveTab('inventory');
                    }}
                    className="w-full py-3 bg-blue-500 text-white font-bold rounded-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View My Items
                  </motion.button>
                </>
              )}

              {purchaseStatus === 'error' && (
                <>
                  <div className="text-center mb-6">
                    <div className="text-7xl mb-4 mx-auto">❌</div>
                    <h2 className="text-2xl font-bold text-red-600 mb-2">
                      Purchase Failed
                    </h2>
                    <p className="text-gray-600">
                      There was an error processing your purchase. Please try again later.
                    </p>
                  </div>
                  <motion.button
                    onClick={closeDialog}
                    className="w-full py-3 bg-gray-500 text-white font-bold rounded-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Close
                  </motion.button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Shop;