import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { SoundProvider } from './contexts/SoundContext';
import { GameProvider } from './contexts/GameContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Practice from './pages/Practice';
import MiniGames from './pages/MiniGames';
import PacManMath from './pages/games/PacManMath';
import SlotMachine from './pages/games/SlotMachine';
import MemoryGame from './pages/games/MemoryGame';
import BattleshipMath from './pages/games/BattleshipMath';
import SudokuGame from './pages/games/SudokuGame';
import MathPuzzles from './pages/games/MathPuzzles';
import PizzaFractions from './pages/games/PizzaFractions';
import HangmanMath from './pages/games/HangmanMath';
import MathStories from './pages/MathStories';
import PirateTreasure from './pages/stories/PirateTreasure';
import DinoEggs from './pages/stories/DinoEggs';
import Shop from './pages/Shop';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Premium from './pages/Premium';
import './App.css';

function App() {
  return (
    <Router>
      <UserProvider>
        <LanguageProvider>
          <SoundProvider>
            <GameProvider>
              <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/*" element={
                    <Layout>
                      <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/practice" element={<Practice />} />
                        <Route path="/mini-games" element={<MiniGames />} />
                        <Route path="/games/pacman" element={<PacManMath />} />
                        <Route path="/games/slot-machine" element={<SlotMachine />} />
                        <Route path="/games/memory" element={<MemoryGame />} />
                        <Route path="/games/battleship" element={<BattleshipMath />} />
                        <Route path="/games/sudoku" element={<SudokuGame />} />
                        <Route path="/games/math-puzzles" element={<MathPuzzles />} />
                        <Route path="/games/pizza-fractions" element={<PizzaFractions />} />
                        <Route path="/games/hangman" element={<HangmanMath />} />
                        <Route path="/stories" element={<MathStories />} />
                        <Route path="/stories/pirate-treasure" element={<PirateTreasure />} />
                        <Route path="/stories/dino-eggs" element={<DinoEggs />} />
                        <Route path="/shop" element={<Shop />} />
                        <Route path="/leaderboard" element={<Leaderboard />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/premium" element={<Premium />} />
                      </Routes>
                    </Layout>
                  } />
                </Routes>
              </div>
            </GameProvider>
          </SoundProvider>
        </LanguageProvider>
      </UserProvider>
    </Router>
  );
}

export default App;