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
    pirateTreasureStory5: "Perfect! The treasure is at coordinates (8, 8). Let's dig there and see what we find!",
    pirateTreasureStory6: "We found a chest! But it has a combination lock. The numbers are: 3 × 4 = ?",
    pirateTreasureStory7: "Amazing! The chest opens and reveals 100 gold coins! You're a true math pirate! 🏆",

    dinoEggsStory1: "Hi there! I'm Tina T-Rex, and I need your help! I found some dinosaur eggs that need to be put in nests! 🦖",
    dinoEggsStory2: "I found 12 dinosaur eggs and I have 3 nests. How many eggs should go in each nest so they're all equal?",
    dinoEggsStory3: "Great job! 4 eggs in each nest. But wait, I found more eggs! Now I have 6 nests with 3 eggs each. How many eggs is that total?",
    dinoEggsStory4: "Fantastic! 18 eggs total! Oh no, some baby dinosaurs hatched! If 5 eggs hatched, how many eggs are left?",
    dinoEggsStory5: "Perfect! 13 eggs are still left. The baby dinosaurs are so cute! Let's count them: 2 + 2 + 1 = ?",
    dinoEggsStory6: "Excellent! 5 baby dinosaurs! You're an amazing helper! Thanks for helping me organize all the eggs and count the babies! 🎉",

    // Math Detective
    mathDetectiveStory1: "Welcome to the Math Detective Agency! I'm Detective Numbers, and we have a mystery to solve. Someone has stolen all the numbers from the math museum!",
    mathDetectiveStory2: "Our first clue: The thief left behind a note saying 'I took 15 items, but gave back 7. How many did I keep?'",
    mathDetectiveStory3: "Excellent detective work! We found 8 missing numbers. Now, let's check the security footage. The camera shows the thief was here for 45 minutes, but left for 12 minutes. How long were they actually in the museum?",
    mathDetectiveStory4: "Great! The thief was in the museum for 33 minutes. We found another clue: footprints leading to 3 different rooms, with 4 footprints in each room. How many footprints total?",
    mathDetectiveStory5: "Perfect! 12 footprints total. Our final clue: The thief left a coded message: '24 ÷ 3 = the room number where I hid the stolen numbers!'",
    mathDetectiveStory6: "Amazing detective work! You found room 8 and recovered all the stolen numbers! The Math Museum is safe again thanks to your brilliant mathematical detective skills! 🎉",

    // Space Mission
    spaceMissionStory1: "Welcome, Space Cadet! I'm Commander Cosmos. Our mission: travel to Planet Math to deliver important supplies. But first, we need to calculate our rocket fuel!",
    spaceMissionStory2: "Our rocket uses 8 fuel units per hour. If our journey takes 6 hours, how much fuel do we need total?",
    spaceMissionStory3: "Perfect! 48 fuel units loaded. Now we're approaching the asteroid belt. There are 3 rows of asteroids, each with 7 asteroids. How many asteroids must we navigate around?",
    spaceMissionStory4: "Excellent navigation! We safely passed 21 asteroids. Now we're at Planet Math! The aliens need us to distribute 24 math books equally among 4 schools. How many books per school?",
    spaceMissionStory5: "Fantastic! 6 books per school. The aliens are so grateful! They're giving us 15 space crystals as thanks, plus 9 more from their treasure vault. How many crystals total?",
    spaceMissionStory6: "Mission accomplished! You collected 24 space crystals and successfully completed the mission to Planet Math! You're now a certified Space Math Explorer! 🌟",

    // Bakery Fractions
    bakeryFractionsStory1: "Welcome to Baker Betty's Bakery! I'm Betty, and I need your help making delicious treats using fractions. Let's start baking! 👩‍🍳",
    bakeryFractionsStory2: "First, let's make cupcakes! I need 1/2 cup of flour. I have a 1-cup measuring cup. What fraction of the cup should I fill?",
    bakeryFractionsStory3: "Perfect! Now let's make cookies. The recipe needs 3/4 cup of sugar. Look at this measuring cup divided into fourths. How many fourths should we fill?",
    bakeryFractionsStory4: "Excellent! Now for our specialty cake. I need 2/3 cup of milk. My measuring cup is divided into 3 equal parts. How many parts should I fill?",
    bakeryFractionsStory5: "Wonderful! For our final recipe - chocolate pie - I need 1/4 cup of chocolate chips. My measuring cup has 4 equal sections. How many sections should I fill?",
    bakeryFractionsStory6: "Amazing work! You've helped me bake cupcakes, cookies, cake, and pie using fractions! You're now an expert baker and fraction master! 🏆",

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
    pirateTreasureStory5: "Perfekt! Der Schatz ist bei Koordinaten (8, 8). Lass uns dort graben und schauen, was wir finden!",
    pirateTreasureStory6: "Wir haben eine Truhe gefunden! Aber sie hat ein Zahlenschloss. Die Zahlen sind: 3 × 4 = ?",
    pirateTreasureStory7: "Fantastisch! Die Truhe öffnet sich und enthüllt 100 Goldmünzen! Du bist ein wahrer Mathe-Pirat! 🏆",

    dinoEggsStory1: "Hallo! Ich bin Tina T-Rex und brauche deine Hilfe! Ich habe Dinosaurier-Eier gefunden, die in Nester gelegt werden müssen! 🦖",
    dinoEggsStory2: "Ich habe 12 Dinosaurier-Eier gefunden und habe 3 Nester. Wie viele Eier sollen in jedes Nest, damit alle gleich sind?",
    dinoEggsStory3: "Gut gemacht! 4 Eier in jedem Nest. Aber warte, ich habe mehr Eier gefunden! Jetzt habe ich 6 Nester mit 3 Eiern in jedem. Wie viele Eier sind das insgesamt?",
    dinoEggsStory4: "Fantastisch! 18 Eier insgesamt! Oh nein, einige Baby-Dinosaurier sind geschlüpft! Wenn 5 Eier geschlüpft sind, wie viele Eier sind übrig?",
    dinoEggsStory5: "Perfekt! 13 Eier sind noch übrig. Die Baby-Dinosaurier sind so süß! Lass uns sie zählen: 2 + 2 + 1 = ?",
    dinoEggsStory6: "Ausgezeichnet! 5 Baby-Dinosaurier! Du bist eine großartige Hilfe! Danke, dass du mir geholfen hast, alle Eier zu organisieren und die Babys zu zählen! 🎉",

    // Math Detective
    mathDetectiveStory1: "Willkommen bei der Mathe-Detektiv Agentur! Ich bin Detektiv Zahlen, und wir haben ein Rätsel zu lösen. Jemand hat alle Zahlen aus dem Mathe-Museum gestohlen!",
    mathDetectiveStory2: "Unser erster Hinweis: Der Dieb hat eine Notiz hinterlassen, auf der steht 'Ich habe 15 Gegenstände genommen, aber 7 zurückgegeben. Wie viele habe ich behalten?'",
    mathDetectiveStory3: "Ausgezeichnete Detektivarbeit! Wir haben 8 fehlende Zahlen gefunden. Jetzt schauen wir uns die Sicherheitsaufnahmen an. Die Kamera zeigt, dass der Dieb 45 Minuten hier war, aber für 12 Minuten wegging. Wie lange war er tatsächlich im Museum?",
    mathDetectiveStory4: "Super! Der Dieb war 33 Minuten im Museum. Wir haben einen weiteren Hinweis gefunden: Fußspuren führen zu 3 verschiedenen Räumen, mit 4 Fußabdrücken in jedem Raum. Wie viele Fußabdrücke sind das insgesamt?",
    mathDetectiveStory5: "Perfekt! 12 Fußabdrücke insgesamt. Unser letzter Hinweis: Der Dieb hat eine verschlüsselte Nachricht hinterlassen: '24 ÷ 3 = die Raumnummer, wo ich die gestohlenen Zahlen versteckt habe!'",
    mathDetectiveStory6: "Erstaunliche Detektivarbeit! Du hast Raum 8 gefunden und alle gestohlenen Zahlen zurückgeholt! Das Mathe-Museum ist dank deiner brillanten mathematischen Detektivfähigkeiten wieder sicher! 🎉",

    // Space Mission
    spaceMissionStory1: "Willkommen, Weltraum-Kadett! Ich bin Kommandant Kosmos. Unsere Mission: zum Planeten Mathe reisen, um wichtige Vorräte zu liefern. Aber zuerst müssen wir unseren Raketentreibstoff berechnen!",
    spaceMissionStory2: "Unsere Rakete verbraucht 8 Treibstoffeinheiten pro Stunde. Wenn unsere Reise 6 Stunden dauert, wie viel Treibstoff brauchen wir insgesamt?",
    spaceMissionStory3: "Perfekt! 48 Treibstoffeinheiten geladen. Jetzt nähern wir uns dem Asteroidengürtel. Es gibt 3 Reihen von Asteroiden, jede mit 7 Asteroiden. Um wie viele Asteroiden müssen wir navigieren?",
    spaceMissionStory4: "Ausgezeichnete Navigation! Wir haben 21 Asteroiden sicher passiert. Jetzt sind wir auf Planet Mathe! Die Außerirdischen brauchen unsere Hilfe, um 24 Mathebücher gleichmäßig auf 4 Schulen zu verteilen. Wie viele Bücher pro Schule?",
    spaceMissionStory5: "Fantastisch! 6 Bücher pro Schule. Die Außerirdischen sind so dankbar! Sie geben uns 15 Weltraumkristalle als Dank, plus 9 weitere aus ihrer Schatzkammer. Wie viele Kristalle insgesamt?",
    spaceMissionStory6: "Mission erfüllt! Du hast 24 Weltraumkristalle gesammelt und die Mission zum Planeten Mathe erfolgreich abgeschlossen! Du bist jetzt ein zertifizierter Weltraum-Mathe-Entdecker! 🌟",

    // Bakery Fractions
    bakeryFractionsStory1: "Willkommen in Betty's Bäckerei! Ich bin Betty und brauche deine Hilfe, um mit Brüchen leckere Leckereien zu backen. Lass uns mit dem Backen beginnen! 👩‍🍳",
    bakeryFractionsStory2: "Zuerst machen wir Cupcakes! Ich brauche 1/2 Tasse Mehl. Ich habe einen 1-Tasse-Messbecher. Welchen Bruchteil der Tasse sollte ich füllen?",
    bakeryFractionsStory3: "Perfekt! Jetzt backen wir Kekse. Das Rezept benötigt 3/4 Tasse Zucker. Schau dir diesen Messbecher an, der in Viertel eingeteilt ist. Wie viele Viertel sollten wir füllen?",
    bakeryFractionsStory4: "Ausgezeichnet! Jetzt unser Spezialkuchen. Ich brauche 2/3 Tasse Milch. Mein Messbecher ist in 3 gleiche Teile eingeteilt. Wie viele Teile sollte ich füllen?",
    bakeryFractionsStory5: "Wunderbar! Für unser letztes Rezept - Schokoladenkuchen - brauche ich 1/4 Tasse Schokoladenstückchen. Mein Messbecher hat 4 gleiche Abschnitte. Wie viele Abschnitte sollte ich füllen?",
    bakeryFractionsStory6: "Erstaunliche Arbeit! Du hast mir geholfen, Cupcakes, Kekse, Kuchen und Torte mit Brüchen zu backen! Du bist jetzt ein Experte für Backen und Brüche! 🏆",

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
    pirateTreasureStory5: "Parfait! Le trésor est aux coordonnées (8, 8). Creusons là et voyons ce que nous trouvons!",
    pirateTreasureStory6: "Nous avons trouvé un coffre! Mais il a une serrure à combinaison. Les nombres sont: 3 × 4 = ?",
    pirateTreasureStory7: "Incroyable! Le coffre s'ouvre et révèle 100 pièces d'or! Vous êtes un vrai pirate des maths! 🏆",

    dinoEggsStory1: "Salut! Je suis Tina T-Rex et j'ai besoin de votre aide! J'ai trouvé des œufs de dinosaure qui doivent être mis dans des nids! 🦖",
    dinoEggsStory2: "J'ai trouvé 12 œufs de dinosaure et j'ai 3 nids. Combien d'œufs devraient aller dans chaque nid pour qu'ils soient tous égaux?",
    dinoEggsStory3: "Bon travail! 4 œufs dans chaque nid. Mais attendez, j'ai trouvé plus d'œufs! Maintenant j'ai 6 nids avec 3 œufs chacun. Combien d'œufs cela fait-il au total?",
    dinoEggsStory4: "Fantastique! 18 œufs au total! Oh non, certains bébés dinosaures ont éclos! Si 5 œufs ont éclos, combien d'œufs reste-t-il?",
    dinoEggsStory5: "Parfait! Il reste encore 13 œufs. Les bébés dinosaures sont si mignons! Comptons-les: 2 + 2 + 1 = ?",
    dinoEggsStory6: "Excellent! 5 bébés dinosaures! Vous êtes une aide formidable! Merci de m'avoir aidé à organiser tous les œufs et à compter les bébés! 🎉",

    // Math Detective
    mathDetectiveStory1: "Bienvenue à l'Agence de Détective Math! Je suis Détective Nombres, et nous avons un mystère à résoudre. Quelqu'un a volé tous les nombres du musée des mathématiques!",
    mathDetectiveStory2: "Notre premier indice: Le voleur a laissé une note disant 'J'ai pris 15 objets, mais j'en ai rendu 7. Combien en ai-je gardé?'",
    mathDetectiveStory3: "Excellent travail de détective! Nous avons trouvé 8 nombres manquants. Maintenant, vérifions les images de surveillance. La caméra montre que le voleur était ici pendant 45 minutes, mais est parti pendant 12 minutes. Combien de temps était-il réellement dans le musée?",
    mathDetectiveStory4: "Génial! Le voleur était dans le musée pendant 33 minutes. Nous avons trouvé un autre indice: des empreintes menant à 3 salles différentes, avec 4 empreintes dans chaque salle. Combien d'empreintes au total?",
    mathDetectiveStory5: "Parfait! 12 empreintes au total. Notre dernier indice: Le voleur a laissé un message codé: '24 ÷ 3 = le numéro de la salle où j'ai caché les nombres volés!'",
    mathDetectiveStory6: "Incroyable travail de détective! Vous avez trouvé la salle 8 et récupéré tous les nombres volés! Le Musée des Mathématiques est à nouveau en sécurité grâce à vos brillantes compétences de détective mathématique! 🎉",

    // Space Mission
    spaceMissionStory1: "Bienvenue, Cadet Spatial! Je suis le Commandant Cosmos. Notre mission: voyager vers la Planète Math pour livrer des fournitures importantes. Mais d'abord, nous devons calculer notre carburant de fusée!",
    spaceMissionStory2: "Notre fusée utilise 8 unités de carburant par heure. Si notre voyage prend 6 heures, combien de carburant avons-nous besoin au total?",
    spaceMissionStory3: "Parfait! 48 unités de carburant chargées. Maintenant nous approchons de la ceinture d'astéroïdes. Il y a 3 rangées d'astéroïdes, chacune avec 7 astéroïdes. Combien d'astéroïdes devons-nous contourner?",
    spaceMissionStory4: "Navigation excellente! Nous avons dépassé en toute sécurité 21 astéroïdes. Maintenant nous sommes sur la Planète Math! Les extraterrestres ont besoin que nous distribuions 24 livres de mathématiques également entre 4 écoles. Combien de livres par école?",
    spaceMissionStory5: "Fantastique! 6 livres par école. Les extraterrestres sont si reconnaissants! Ils nous donnent 15 cristaux spatiaux en remerciement, plus 9 autres de leur chambre forte. Combien de cristaux au total?",
    spaceMissionStory6: "Mission accomplie! Vous avez collecté 24 cristaux spatiaux et terminé avec succès la mission à la Planète Math! Vous êtes maintenant un Explorateur Math Spatial certifié! 🌟",

    // Bakery Fractions
    bakeryFractionsStory1: "Bienvenue à la Boulangerie de Betty! Je suis Betty, et j'ai besoin de votre aide pour faire de délicieuses friandises en utilisant des fractions. Commençons à cuisiner! 👩‍🍳",
    bakeryFractionsStory2: "D'abord, faisons des cupcakes! J'ai besoin de 1/2 tasse de farine. J'ai une tasse à mesurer d'1 tasse. Quelle fraction de la tasse dois-je remplir?",
    bakeryFractionsStory3: "Parfait! Maintenant faisons des biscuits. La recette a besoin de 3/4 de tasse de sucre. Regardez cette tasse à mesurer divisée en quarts. Combien de quarts devons-nous remplir?",
    bakeryFractionsStory4: "Excellent! Maintenant pour notre gâteau spécial. J'ai besoin de 2/3 de tasse de lait. Ma tasse à mesurer est divisée en 3 parties égales. Combien de parties dois-je remplir?",
    bakeryFractionsStory5: "Merveilleux! Pour notre dernière recette - tarte au chocolat - j'ai besoin de 1/4 de tasse de pépites de chocolat. Ma tasse à mesurer a 4 sections égales. Combien de sections dois-je remplir?",
    bakeryFractionsStory6: "Travail incroyable! Vous m'avez aidé à faire des cupcakes, des biscuits, du gâteau et de la tarte en utilisant des fractions! Vous êtes maintenant un expert boulanger et maître des fractions! 🏆",

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