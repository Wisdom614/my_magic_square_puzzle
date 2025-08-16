import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useToast } from '../hooks/use-toast';
import { 
  Play, 
  RotateCcw, 
  Lightbulb, 
  Eye, 
  Trophy, 
  Timer, 
  Target,
  Grid3X3,
  Sparkles,
  Award,
  Calendar,
  Settings,
  Volume2,
  VolumeX
} from 'lucide-react';
import GameGrid from './GameGrid';
import NumberPool from './NumberPool';
import GameStats from './GameStats';
import DifficultySelector from './DifficultySelector';
import DailyChallenge from './DailyChallenge';
import AchievementPanel from './AchievementPanel';
import GridSizeSelector from './GridSizeSelector';
import { generateMagicSquare, shuffleArray, calculateScore } from '../utils/gameLogic';
import { saveGameStats, getGameStats, checkAndUnlockAchievements } from '../utils/localStorage';
import soundManager from '../utils/soundEffects';

const MagicSquareGame = () => {
  const { toast } = useToast();
  
  // Game state
  const [currentLevel, setCurrentLevel] = useState('normal');
  const [gridSize, setGridSize] = useState(3);
  const [gameActive, setGameActive] = useState(false);
  const [currentNumbers, setCurrentNumbers] = useState(Array(9).fill(null));
  const [solution, setSolution] = useState([]);
  const [numberPool, setNumberPool] = useState([]);
  const [magicConstant, setMagicConstant] = useState(0);
  
  // Game mechanics
  const [selectedCell, setSelectedCell] = useState(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  
  // Stats and features
  const [gameStats, setGameStats] = useState(getGameStats());
  const [currentTab, setCurrentTab] = useState('game');
  const [dailyChallenge, setDailyChallenge] = useState(null);
  const [newAchievements, setNewAchievements] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Timer effect
  useEffect(() => {
    let interval;
    if (gameActive && gameStartTime) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - gameStartTime);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [gameActive, gameStartTime]);

  // Initialize new game
  const initializeGame = useCallback((challengeData = null) => {
    let gameConfig;
    
    if (challengeData) {
      // Use provided challenge data (daily challenge)
      gameConfig = challengeData;
      setDailyChallenge(challengeData);
    } else {
      // Generate new random game
      gameConfig = generateMagicSquare(currentLevel, gridSize);
      setDailyChallenge(null);
    }
    
    const { solution: newSolution, numbers, constant } = gameConfig;
    
    setSolution(newSolution);
    setNumberPool(shuffleArray([...numbers]));
    setMagicConstant(constant);
    setCurrentNumbers(Array(gridSize * gridSize).fill(null));
    setSelectedCell(null);
    setHintsUsed(0);
    setAttempts(0);
    setElapsedTime(0);
    setIsCompleted(false);
    setShowSolution(false);
    setGameActive(true);
    setGameStartTime(Date.now());
    
    // Play sound effect
    if (soundEnabled) {
      soundManager.playNewGame();
    }
    
    toast({
      title: challengeData ? "Daily Challenge Started!" : "New Game Started!",
      description: `Magic constant: ${constant}`,
    });
  }, [currentLevel, gridSize, soundEnabled, toast]);

  // Start game on level/size change
  useEffect(() => {
    initializeGame();
  }, [currentLevel, gridSize, initializeGame]);

  // Place number in cell
  const placeNumber = useCallback((cellIndex, number) => {
    if (!gameActive || isCompleted) return;

    const newCurrentNumbers = [...currentNumbers];
    
    // If cell already has a number, return it to pool
    if (newCurrentNumbers[cellIndex] !== null) {
      const oldNumber = newCurrentNumbers[cellIndex];
      setNumberPool(prev => prev.map(n => n === oldNumber ? oldNumber : n));
    }

    // Place new number
    newCurrentNumbers[cellIndex] = number;
    setCurrentNumbers(newCurrentNumbers);
    
    // Remove number from pool
    setNumberPool(prev => prev.filter((n, index) => {
      const firstIndex = prev.findIndex(poolNum => poolNum === number);
      return index !== firstIndex;
    }));

    setSelectedCell(null);
    
    // Play sound effect
    if (soundEnabled) {
      soundManager.playPlaceNumber();
    }
  }, [currentNumbers, gameActive, isCompleted, soundEnabled]);

  // Remove number from cell
  const removeNumber = useCallback((cellIndex) => {
    if (!gameActive || isCompleted) return;

    const number = currentNumbers[cellIndex];
    if (number === null) return;

    const newCurrentNumbers = [...currentNumbers];
    newCurrentNumbers[cellIndex] = null;
    setCurrentNumbers(newCurrentNumbers);
    
    // Return number to pool
    setNumberPool(prev => [...prev, number].sort((a, b) => a - b));
    
    // Play sound effect
    if (soundEnabled) {
      soundManager.playRemoveNumber();
    }
  }, [currentNumbers, gameActive, isCompleted, soundEnabled]);

  // Check if solution is correct
  const checkSolution = useCallback(() => {
    if (!gameActive || isCompleted) return;
    
    setAttempts(prev => prev + 1);
    
    // Check if all cells are filled
    if (currentNumbers.includes(null)) {
      toast({
        title: "Incomplete!",
        description: "Please fill all cells before checking.",
        variant: "destructive"
      });
      return;
    }

    // Validate magic square
    const isValid = validateMagicSquare(currentNumbers, gridSize, magicConstant);
    
    if (isValid) {
      // Game completed successfully
      setGameActive(false);
      setIsCompleted(true);
      
      const finalTime = Date.now() - gameStartTime;
      const score = calculateScore(finalTime, hintsUsed, attempts, currentLevel);
      
      // Update stats
      const newStats = {
        ...gameStats,
        gamesPlayed: gameStats.gamesPlayed + 1,
        gamesWon: gameStats.gamesWon + 1,
        totalTime: gameStats.totalTime + finalTime,
        bestTime: Math.min(gameStats.bestTime || Infinity, finalTime),
        totalScore: gameStats.totalScore + score
      };
      setGameStats(newStats);
      saveGameStats(newStats);
      
      toast({
        title: "🎉 Congratulations!",
        description: `You solved it! Score: ${score.toLocaleString()}`,
      });
    } else {
      toast({
        title: "Not quite right!",
        description: "Check your sums - some rows, columns, or diagonals don't match the magic constant.",
        variant: "destructive"
      });
    }
  }, [gameActive, isCompleted, currentNumbers, gridSize, magicConstant, gameStartTime, hintsUsed, attempts, currentLevel, gameStats, toast]);

  // Provide hint
  const giveHint = useCallback(() => {
    if (!gameActive || hintsUsed >= 3 || isCompleted) return;

    // Find incorrect or empty cells
    const incorrectCells = [];
    currentNumbers.forEach((num, index) => {
      if (num === null || num !== solution[index]) {
        incorrectCells.push(index);
      }
    });

    if (incorrectCells.length === 0) {
      toast({
        title: "Perfect!",
        description: "All placed numbers are correct!",
      });
      return;
    }

    // Pick random incorrect cell
    const hintIndex = incorrectCells[Math.floor(Math.random() * incorrectCells.length)];
    const correctNumber = solution[hintIndex];
    
    placeNumber(hintIndex, correctNumber);
    setHintsUsed(prev => prev + 1);
    
    toast({
      title: "💡 Hint Used",
      description: `Placed ${correctNumber} in the correct position`,
    });
  }, [gameActive, hintsUsed, isCompleted, currentNumbers, solution, placeNumber, toast]);

  // Show solution
  const revealSolution = useCallback(() => {
    if (!gameActive) return;
    
    setGameActive(false);
    setShowSolution(true);
    setCurrentNumbers([...solution]);
    
    // Update stats (game not won)
    const newStats = {
      ...gameStats,
      gamesPlayed: gameStats.gamesPlayed + 1
    };
    setGameStats(newStats);
    saveGameStats(newStats);
    
    toast({
      title: "Solution Revealed",
      description: "Try a new game to test your skills!",
    });
  }, [gameActive, solution, gameStats]);

  // Reset current game
  const resetGame = useCallback(() => {
    if (!gameActive) {
      initializeGame();
      return;
    }
    
    setCurrentNumbers(Array(gridSize * gridSize).fill(null));
    setNumberPool(shuffleArray([...solution]));
    setSelectedCell(null);
    setHintsUsed(0);
    setAttempts(0);
    setElapsedTime(0);
    setGameStartTime(Date.now());
    
    toast({
      title: "Game Reset",
      description: "Grid cleared, try again!",
    });
  }, [gameActive, gridSize, solution, initializeGame, toast]);

  // Format time display
  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes.toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                <Grid3X3 className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Magic Square Puzzle
              </CardTitle>
            </div>
            <p className="text-gray-600 text-lg">
              Arrange numbers so all rows, columns, and diagonals sum to <span className="font-bold text-emerald-600">{magicConstant}</span>
            </p>
          </CardHeader>
        </Card>

        {/* Game Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Controls & Stats */}
          <div className="space-y-4">
            <DifficultySelector 
              currentLevel={currentLevel} 
              onLevelChange={setCurrentLevel}
            />
            
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4 text-emerald-600" />
                    <span className="font-medium">Time</span>
                  </div>
                  <Badge variant="outline" className="text-lg font-mono">
                    {formatTime(elapsedTime)}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    <span className="font-medium">Hints</span>
                  </div>
                  <Badge variant="outline">
                    {3 - hintsUsed} left
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Attempts</span>
                  </div>
                  <Badge variant="outline">
                    {attempts}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={checkSolution}
                disabled={!gameActive || currentNumbers.includes(null)}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
              >
                <Trophy className="h-4 w-4 mr-2" />
                Check
              </Button>
              
              <Button 
                onClick={giveHint}
                disabled={!gameActive || hintsUsed >= 3}
                variant="outline"
                className="border-amber-200 text-amber-700 hover:bg-amber-50"
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                Hint
              </Button>
              
              <Button 
                onClick={resetGame}
                variant="outline"
                className="border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              
              <Button 
                onClick={revealSolution}
                disabled={!gameActive}
                variant="outline"
                className="border-red-200 text-red-700 hover:bg-red-50"
              >
                <Eye className="h-4 w-4 mr-2" />
                Solution
              </Button>
            </div>

            <Button 
              onClick={initializeGame}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            >
              <Play className="h-4 w-4 mr-2" />
              New Game
            </Button>
          </div>

          {/* Center Column - Game Grid */}
          <div className="space-y-4">
            <GameGrid
              gridSize={gridSize}
              currentNumbers={currentNumbers}
              solution={showSolution ? solution : null}
              selectedCell={selectedCell}
              onCellSelect={setSelectedCell}
              onNumberPlace={placeNumber}
              onNumberRemove={removeNumber}
              isCompleted={isCompleted}
              gameActive={gameActive}
            />
            
            <NumberPool
              numbers={numberPool}
              selectedCell={selectedCell}
              onNumberSelect={(number) => {
                if (selectedCell !== null) {
                  placeNumber(selectedCell, number);
                }
              }}
            />
          </div>

          {/* Right Column - Stats */}
          <div className="space-y-4">
            <GameStats stats={gameStats} />
            
            {isCompleted && (
              <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                <CardContent className="p-6 text-center">
                  <Award className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Puzzle Solved!</h3>
                  <p className="text-emerald-100 mb-4">
                    Time: {formatTime(elapsedTime)}
                  </p>
                  <Button 
                    onClick={initializeGame}
                    variant="secondary"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Play Again
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to validate magic square
const validateMagicSquare = (grid, size, targetSum) => {
  // Check rows
  for (let i = 0; i < size; i++) {
    let rowSum = 0;
    for (let j = 0; j < size; j++) {
      rowSum += grid[i * size + j] || 0;
    }
    if (rowSum !== targetSum) return false;
  }
  
  // Check columns
  for (let j = 0; j < size; j++) {
    let colSum = 0;
    for (let i = 0; i < size; i++) {
      colSum += grid[i * size + j] || 0;
    }
    if (colSum !== targetSum) return false;
  }
  
  // Check main diagonal
  let diag1Sum = 0;
  for (let i = 0; i < size; i++) {
    diag1Sum += grid[i * size + i] || 0;
  }
  if (diag1Sum !== targetSum) return false;
  
  // Check anti-diagonal
  let diag2Sum = 0;
  for (let i = 0; i < size; i++) {
    diag2Sum += grid[i * size + (size - 1 - i)] || 0;
  }
  if (diag2Sum !== targetSum) return false;
  
  return true;
};

export default MagicSquareGame;