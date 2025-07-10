import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    practice: 'Practice',
    miniGames: 'Mini Games',
    stories: 'Math Stories',
    shop: 'Shop',
    leaderboard: 'Leaderboard',
    profile: 'Profile',
    premium: 'Premium',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',

    // Auth
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    loginToAccount: 'Login to your account',
    createAccount: 'Create new account',
    forgotPassword: 'Forgot password?',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",
    signIn: 'Sign In',
    signUp: 'Sign Up',

    // Common
    start: 'Start',
    play: 'Play',
    next: 'Next',
    back: 'Back',
    continue: 'Continue',
    correct: 'Correct!',
    incorrect: 'Try Again!',
    wellDone: 'Well Done!',
    amazing: 'Amazing!',
    fantastic: 'Fantastic!',
    timeUp: "Time's up!",
    theAnswerWas: 'The answer was',

    // Onboarding
    welcome: 'Welcome to Math Hero!',
    selectLanguage: 'Select Language',
    enterName: 'Enter your name',
    enterAge: 'How old are you?',
    chooseAvatar: 'Choose your avatar',
    enterEmail: 'Enter email (optional)',
    enterLocation: 'Where are you from?',
    chooseDifficulty: 'Choose difficulty',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',

    // Math Operations
    addition: 'Addition',
    subtraction: 'Subtraction',
    multiplication: 'Multiplication',
    division: 'Division',
    fractions: 'Fractions',
    percentages: 'Percentages',
    multiplicationTables: 'Multiplication Tables',

    // Games
    pacmanMath: 'Pac-Man Math',
    slotMachine: 'Slot Machine Math',
    memoryGame: 'Memory Pairs',
    battleshipMath: 'Battleship Math',
    sudokuGame: 'Math Sudoku',
    hangmanMath: 'Hangman Math',
    pizzaFractions: 'Pizza Fractions',

    // Shop
    coins: 'Coins',
    buy: 'Buy',
    owned: 'Owned',
    myItems: 'My Items',

    // Achievements
    achievements: 'Achievements',
    streak: 'Streak',
    level: 'Level',

    // Premium
    upgradeToPremium: 'Upgrade to Premium',
    unlockAllGames: 'Unlock All Games',
    monthly: 'Monthly',
    yearly: 'Yearly',

    // Stories
    pirateTreasure: 'Pirate Treasure Adventure',
    dinoEggs: 'Dinosaur Egg Hunt',
    mathDetective: 'Math Detective Agency',
    spaceMission: 'Space Mission: Planet Math',
    bakeryFractions: 'Bakery Fraction Fun',

    // Story Content
    pirateTreasureStory1: "Ahoy there, matey! I'm Captain Math, and I need your help to find my buried treasure! 🏴‍☠️",
    pirateTreasureStory2: "I have 24 gold coins that I need to divide equally among my 3 crew members. How many coins will each pirate get?",
    pirateTreasureStory3: "Excellent work! Each pirate gets 8 coins. Now we need to find the treasure location using map coordinates!",
    pirateTreasureStory4: "The treasure map shows X marks the spot at coordinates (5 + 3, 6 + 2). What are the exact coordinates?",
    pirateTreasureStory5: "Perfect! The treasure is at coordinates (8,8). Let's dig there and see what we find!",
    pirateTreasureStory6: "We found a chest! But it has a combination lock. The numbers are: 3 × 4 = ?",
    pirateTreasureStory7: "Amazing! The chest opens and reveals 100 gold coins! You're a true math pirate! 🏆",

    dinoEggsStory1: "Hi there! I'm Tina T-Rex, and I need your help! I found some dinosaur eggs that need to be put in nests! 🦖",
    dinoEggsStory2: "I found 12 dinosaur eggs and I have 3 nests. How many eggs should go in each nest so they're all equal?",
    dinoEggsStory3: "Great job! 4 eggs in each nest. But wait, I found more eggs! Now I have 6 nests with 3 eggs each. How many eggs is that total?",
    dinoEggsStory4: "Fantastic! 18 eggs total! Oh no, some baby dinosaurs hatched! If 5 eggs hatched, how many eggs are left?",
    dinoEggsStory5: "Perfect! 13 eggs are still left. The baby dinosaurs are so cute! Let's count them: 2 + 2 + 1 = ?",
    dinoEggsStory6: "Excellent! 5 baby dinosaurs! You're an amazing helper! Thanks for helping me organize all the eggs and count the babies! 🎉",

    // Hangman Math
    solveToReveal: 'Solve math problems to reveal the number!',
    hangmanHint: 'Solve the math problem to save the stick figure!',
    mathProblem: 'Math Problem',
    selectAnswer: 'Select the correct answer:',
    wrongAnswer: 'Wrong answer! Try again!',
    correctAnswer: 'Correct! Well done!',
    gameOver: 'Game Over!',
    youWin: 'You Win!',

    // Settings
    backgroundMusic: 'Background Music',
    soundEffects: 'Sound Effects',
    enablePercentages: 'Enable Percentages'
  },

  de: {
    // Navigation
    dashboard: 'Dashboard',
    practice: 'Üben',
    miniGames: 'Mini-Spiele',
    stories: 'Mathe-Geschichten',
    shop: 'Shop',
    leaderboard: 'Bestenliste',
    profile: 'Profil',
    premium: 'Premium',
    login: 'Anmelden',
    register: 'Registrieren',
    logout: 'Abmelden',

    // Auth
    email: 'E-Mail',
    password: 'Passwort',
    confirmPassword: 'Passwort bestätigen',
    loginToAccount: 'In Ihr Konto einloggen',
    createAccount: 'Neues Konto erstellen',
    forgotPassword: 'Passwort vergessen?',
    alreadyHaveAccount: 'Haben Sie bereits ein Konto?',
    dontHaveAccount: 'Haben Sie noch kein Konto?',
    signIn: 'Einloggen',
    signUp: 'Registrieren',

    // Common
    start: 'Start',
    play: 'Spielen',
    next: 'Weiter',
    back: 'Zurück',
    continue: 'Weiter',
    correct: 'Richtig!',
    incorrect: 'Versuche es nochmal!',
    wellDone: 'Gut gemacht!',
    amazing: 'Fantastisch!',
    fantastic: 'Großartig!',
    timeUp: 'Zeit ist um!',
    theAnswerWas: 'Die Antwort war',

    // Onboarding
    welcome: 'Willkommen bei Math Hero!',
    selectLanguage: 'Sprache wählen',
    enterName: 'Gib deinen Namen ein',
    enterAge: 'Wie alt bist du?',
    chooseAvatar: 'Wähle deinen Avatar',
    enterEmail: 'E-Mail eingeben (optional)',
    enterLocation: 'Wo kommst du her?',
    chooseDifficulty: 'Schwierigkeit wählen',
    easy: 'Einfach',
    medium: 'Mittel',
    hard: 'Schwer',

    // Math Operations
    addition: 'Addition',
    subtraction: 'Subtraktion',  
    multiplication: 'Multiplikation',
    division: 'Division',
    fractions: 'Brüche',
    percentages: 'Prozente',
    multiplicationTables: 'Einmaleins',

    // Games
    pacmanMath: 'Pac-Man Mathe',
    slotMachine: 'Spielautomat Mathe',
    memoryGame: 'Memory Paare',
    battleshipMath: 'Schiffe versenken Mathe',
    sudokuGame: 'Mathe Sudoku',
    hangmanMath: 'Galgenmännchen Mathe',
    pizzaFractions: 'Pizza Brüche',

    // Shop
    coins: 'Münzen',
    buy: 'Kaufen',
    owned: 'Besitzt',
    myItems: 'Meine Gegenstände',

    // Achievements
    achievements: 'Erfolge',
    streak: 'Serie',
    level: 'Level',

    // Premium
    upgradeToPremium: 'Premium upgraden',
    unlockAllGames: 'Alle Spiele freischalten',
    monthly: 'Monatlich',
    yearly: 'Jährlich',

    // Stories
    pirateTreasure: 'Piraten-Schatz Abenteuer',
    dinoEggs: 'Dinosaurier-Eier Jagd',
    mathDetective: 'Mathe-Detektiv Agentur',
    spaceMission: 'Weltraum-Mission: Planet Mathe',
    bakeryFractions: 'Bäckerei Bruch-Spaß',

    // Story Content
    pirateTreasureStory1: "Ahoi Matrose! Ich bin Kapitän Mathe und brauche deine Hilfe, meinen vergrabenen Schatz zu finden! 🏴‍☠️",
    pirateTreasureStory2: "Ich habe 24 Goldmünzen, die ich gleichmäßig unter meinen 3 Besatzungsmitgliedern aufteilen muss. Wie viele Münzen bekommt jeder Pirat?",
    pirateTreasureStory3: "Ausgezeichnete Arbeit! Jeder Pirat bekommt 8 Münzen. Jetzt müssen wir den Schatzort mit Kartenkoordinaten finden!",
    pirateTreasureStory4: "Die Schatzkarte zeigt X markiert die Stelle bei Koordinaten (5 + 3, 6 + 2). Was sind die genauen Koordinaten?",
    pirateTreasureStory5: "Perfekt! Der Schatz ist bei Koordinaten (8,8). Lass uns dort graben und schauen, was wir finden!",
    pirateTreasureStory6: "Wir haben eine Truhe gefunden! Aber sie hat ein Zahlenschloss. Die Zahlen sind: 3 × 4 = ?",
    pirateTreasureStory7: "Fantastisch! Die Truhe öffnet sich und enthüllt 100 Goldmünzen! Du bist ein wahrer Mathe-Pirat! 🏆",

    dinoEggsStory1: "Hallo! Ich bin Tina T-Rex und brauche deine Hilfe! Ich habe Dinosaurier-Eier gefunden, die in Nester gelegt werden müssen! 🦖",
    dinoEggsStory2: "Ich habe 12 Dinosaurier-Eier gefunden und habe 3 Nester. Wie viele Eier sollen in jedes Nest, damit alle gleich sind?",
    dinoEggsStory3: "Gut gemacht! 4 Eier in jedem Nest. Aber warte, ich habe mehr Eier gefunden! Jetzt habe ich 6 Nester mit 3 Eiern in jedem. Wie viele Eier sind das insgesamt?",
    dinoEggsStory4: "Fantastisch! 18 Eier insgesamt! Oh nein, einige Baby-Dinosaurier sind geschlüpft! Wenn 5 Eier geschlüpft sind, wie viele Eier sind übrig?",
    dinoEggsStory5: "Perfekt! 13 Eier sind noch übrig. Die Baby-Dinosaurier sind so süß! Lass uns sie zählen: 2 + 2 + 1 = ?",
    dinoEggsStory6: "Ausgezeichnet! 5 Baby-Dinosaurier! Du bist eine großartige Hilfe! Danke, dass du mir geholfen hast, alle Eier zu organisieren und die Babys zu zählen! 🎉",

    // Hangman Math
    solveToReveal: 'Löse Mathe-Aufgaben, um die Zahl zu enthüllen!',
    hangmanHint: 'Löse die Mathe-Aufgabe, um das Strichmännchen zu retten!',
    mathProblem: 'Mathe-Aufgabe',
    selectAnswer: 'Wähle die richtige Antwort:',
    wrongAnswer: 'Falsche Antwort! Versuche es nochmal!',
    correctAnswer: 'Richtig! Gut gemacht!',
    gameOver: 'Spiel vorbei!',
    youWin: 'Du gewinnst!',

    // Settings
    backgroundMusic: 'Hintergrundmusik',
    soundEffects: 'Soundeffekte',
    enablePercentages: 'Prozente aktivieren'
  },

  fr: {
    // Navigation
    dashboard: 'Tableau de bord',
    practice: 'Pratique',
    miniGames: 'Mini-jeux',
    stories: 'Histoires mathématiques',
    shop: 'Boutique',
    leaderboard: 'Classement',
    profile: 'Profil',
    premium: 'Premium',
    login: 'Se connecter',
    register: "S'inscrire",
    logout: 'Se déconnecter',

    // Auth
    email: 'Email',
    password: 'Mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    loginToAccount: 'Connectez-vous à votre compte',
    createAccount: 'Créer un nouveau compte',
    forgotPassword: 'Mot de passe oublié?',
    alreadyHaveAccount: 'Vous avez déjà un compte?',
    dontHaveAccount: "Vous n'avez pas de compte?",
    signIn: 'Se connecter',
    signUp: "S'inscrire",

    // Common
    start: 'Commencer',
    play: 'Jouer',
    next: 'Suivant',
    back: 'Retour',
    continue: 'Continuer',
    correct: 'Correct!',
    incorrect: 'Essayez encore!',
    wellDone: 'Bien joué!',
    amazing: 'Incroyable!',
    fantastic: 'Fantastique!',
    timeUp: 'Temps écoulé!',
    theAnswerWas: 'La réponse était',

    // Onboarding
    welcome: 'Bienvenue dans Math Hero!',
    selectLanguage: 'Sélectionner la langue',
    enterName: 'Entrez votre nom',
    enterAge: 'Quel âge avez-vous?',
    chooseAvatar: 'Choisissez votre avatar',
    enterEmail: 'Entrez votre email (optionnel)',
    enterLocation: 'D\'où venez-vous?',
    chooseDifficulty: 'Choisir la difficulté',
    easy: 'Facile',
    medium: 'Moyen',
    hard: 'Difficile',

    // Math Operations
    addition: 'Addition',
    subtraction: 'Soustraction',
    multiplication: 'Multiplication',
    division: 'Division',
    fractions: 'Fractions',
    percentages: 'Pourcentages',
    multiplicationTables: 'Tables de multiplication',

    // Games
    pacmanMath: 'Pac-Man Math',
    slotMachine: 'Machine à sous Math',
    memoryGame: 'Paires mémoire',
    battleshipMath: 'Bataille navale Math',
    sudokuGame: 'Sudoku Math',
    hangmanMath: 'Pendu Math',
    pizzaFractions: 'Fractions de Pizza',

    // Shop
    coins: 'Pièces',
    buy: 'Acheter',
    owned: 'Possédé',
    myItems: 'Mes objets',

    // Achievements
    achievements: 'Succès',
    streak: 'Série',
    level: 'Niveau',

    // Premium
    upgradeToPremium: 'Passer à Premium',
    unlockAllGames: 'Débloquer tous les jeux',
    monthly: 'Mensuel',
    yearly: 'Annuel',

    // Stories
    pirateTreasure: 'Aventure du Trésor de Pirate',
    dinoEggs: 'Chasse aux Œufs de Dinosaure',
    mathDetective: 'Agence de Détective Math',
    spaceMission: 'Mission Spatiale: Planète Math',
    bakeryFractions: 'Plaisir des Fractions de Boulangerie',

    // Story Content
    pirateTreasureStory1: "Ahoy matelot! Je suis le Capitaine Math et j'ai besoin de votre aide pour trouver mon trésor enfoui! 🏴‍☠️",
    pirateTreasureStory2: "J'ai 24 pièces d'or que je dois diviser équitablement entre mes 3 membres d'équipage. Combien de pièces chaque pirate aura-t-il?",
    pirateTreasureStory3: "Excellent travail! Chaque pirate reçoit 8 pièces. Maintenant, nous devons trouver l'emplacement du trésor en utilisant les coordonnées de la carte!",
    pirateTreasureStory4: "La carte au trésor montre que X marque l'endroit aux coordonnées (5 + 3, 6 + 2). Quelles sont les coordonnées exactes?",
    pirateTreasureStory5: "Parfait! Le trésor est aux coordonnées (8,8). Creusons là et voyons ce que nous trouvons!",
    pirateTreasureStory6: "Nous avons trouvé un coffre! Mais il a une serrure à combinaison. Les nombres sont: 3 × 4 = ?",
    pirateTreasureStory7: "Incroyable! Le coffre s'ouvre et révèle 100 pièces d'or! Vous êtes un vrai pirate des maths! 🏆",

    dinoEggsStory1: "Salut! Je suis Tina T-Rex et j'ai besoin de votre aide! J'ai trouvé des œufs de dinosaure qui doivent être mis dans des nids! 🦖",
    dinoEggsStory2: "J'ai trouvé 12 œufs de dinosaure et j'ai 3 nids. Combien d'œufs devraient aller dans chaque nid pour qu'ils soient tous égaux?",
    dinoEggsStory3: "Bon travail! 4 œufs dans chaque nid. Mais attendez, j'ai trouvé plus d'œufs! Maintenant j'ai 6 nids avec 3 œufs chacun. Combien d'œufs cela fait-il au total?",
    dinoEggsStory4: "Fantastique! 18 œufs au total! Oh non, certains bébés dinosaures ont éclos! Si 5 œufs ont éclos, combien d'œufs reste-t-il?",
    dinoEggsStory5: "Parfait! Il reste encore 13 œufs. Les bébés dinosaures sont si mignons! Comptons-les: 2 + 2 + 1 = ?",
    dinoEggsStory6: "Excellent! 5 bébés dinosaures! Vous êtes une aide formidable! Merci de m'avoir aidé à organiser tous les œufs et à compter les bébés! 🎉",

    // Hangman Math
    solveToReveal: 'Résolvez les problèmes de maths pour révéler le nombre!',
    hangmanHint: 'Résolvez le problème de maths pour sauver le bonhomme!',
    mathProblem: 'Problème de Math',
    selectAnswer: 'Sélectionnez la bonne réponse:',
    wrongAnswer: 'Mauvaise réponse! Essayez encore!',
    correctAnswer: 'Correct! Bien joué!',
    gameOver: 'Jeu terminé!',
    youWin: 'Vous gagnez!',

    // Settings
    backgroundMusic: 'Musique de fond',
    soundEffects: 'Effets sonores',
    enablePercentages: 'Activer les pourcentages'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('mathHeroLanguage');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('mathHeroLanguage', lang);
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  const value = {
    language,
    changeLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};