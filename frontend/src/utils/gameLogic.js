// Magic Square Game Logic Utilities

// Generate a magic square with specified difficulty and size
export const generateMagicSquare = (difficulty, size = 3) => {
  // For now, we'll focus on 3x3 magic squares
  // Future versions can extend to larger sizes
  
  if (size !== 3) {
    // For non-3x3 grids, we'll use a simple approach
    return generateGenericMagicSquare(size, difficulty);
  }

  // Base 3x3 magic square (Lo Shu square)
  const baseMagicSquare = [8, 1, 6, 3, 5, 7, 4, 9, 2];
  
  // Apply offset based on difficulty
  const offset = getDifficultyOffset(difficulty);
  const solution = baseMagicSquare.map(num => num + offset);
  
  // Calculate magic constant
  const magicConstant = solution[0] + solution[1] + solution[2];
  
  return {
    solution,
    numbers: [...solution],
    constant: magicConstant
  };
};

// Get offset range based on difficulty
const getDifficultyOffset = (difficulty, seed = null) => {
  let minOffset, maxOffset;
  
  switch (difficulty) {
    case 'easy':
      minOffset = -7; // Results in 1-20 range
      maxOffset = 12;
      break;
    case 'normal':
      minOffset = -55; // Results in -50 to 50 range  
      maxOffset = 45;
      break;
    case 'hard':
      minOffset = -205; // Results in -200 to 200 range
      maxOffset = 195;
      break;
    case 'master':
      minOffset = -1005; // Results in -1000 to 1000 range
      maxOffset = 995;
      break;
    default:
      minOffset = -55;
      maxOffset = 45;
  }
  
  if (seed !== null) {
    // Use seed for deterministic generation (for daily challenges)
    const range = maxOffset - minOffset + 1;
    return minOffset + (seed % range);
  }
  
  return Math.floor(Math.random() * (maxOffset - minOffset + 1)) + minOffset;
};

// Generate magic square for larger sizes (basic implementation)
const generateGenericMagicSquare = (size, difficulty) => {
  // This is a simplified version - real implementation would be more complex
  const solution = [];
  const total = size * size;
  const magicConstant = size * (total + 1) / 2;
  
  // For demo purposes, create a simple sequence
  for (let i = 1; i <= total; i++) {
    solution.push(i);
  }
  
  return {
    solution,
    numbers: [...solution],
    constant: magicConstant
  };
};

// Shuffle array utility
export const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Calculate score based on performance
export const calculateScore = (timeMs, hintsUsed, attempts, difficulty) => {
  const baseScore = 10000;
  const timeSeconds = Math.floor(timeMs / 1000);
  
  // Time penalty (10 points per second)
  const timePenalty = timeSeconds * 10;
  
  // Hint penalty (1000 points per hint)
  const hintPenalty = hintsUsed * 1000;
  
  // Attempt penalty (500 points per failed attempt)
  const attemptPenalty = (attempts - 1) * 500;
  
  // Difficulty multiplier
  const difficultyMultiplier = getDifficultyMultiplier(difficulty);
  
  // Calculate final score
  const rawScore = Math.max(0, baseScore - timePenalty - hintPenalty - attemptPenalty);
  const finalScore = Math.floor(rawScore * difficultyMultiplier);
  
  return Math.max(100, finalScore); // Minimum score of 100
};

// Get multiplier based on difficulty
const getDifficultyMultiplier = (difficulty) => {
  switch (difficulty) {
    case 'easy': return 0.5;
    case 'normal': return 1.0;
    case 'hard': return 1.5;
    case 'master': return 2.0;
    default: return 1.0;
  }
};

// Validate if a grid forms a valid magic square
export const validateMagicSquare = (grid, size, targetSum) => {
  // Check if all cells are filled
  if (grid.includes(null)) return false;
  
  // Check rows
  for (let i = 0; i < size; i++) {
    let rowSum = 0;
    for (let j = 0; j < size; j++) {
      rowSum += grid[i * size + j];
    }
    if (rowSum !== targetSum) return false;
  }
  
  // Check columns
  for (let j = 0; j < size; j++) {
    let colSum = 0;
    for (let i = 0; i < size; i++) {
      colSum += grid[i * size + j];
    }
    if (colSum !== targetSum) return false;
  }
  
  // Check main diagonal (top-left to bottom-right)
  let diag1Sum = 0;
  for (let i = 0; i < size; i++) {
    diag1Sum += grid[i * size + i];
  }
  if (diag1Sum !== targetSum) return false;
  
  // Check anti-diagonal (top-right to bottom-left)
  let diag2Sum = 0;
  for (let i = 0; i < size; i++) {
    diag2Sum += grid[i * size + (size - 1 - i)];
  }
  if (diag2Sum !== targetSum) return false;
  
  return true;
};

// Generate daily challenge (deterministic based on date)
export const generateDailyChallenge = () => {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
  
  // Use day of year as seed for consistent daily puzzles
  const difficulties = ['easy', 'normal', 'hard', 'master'];
  const difficulty = difficulties[dayOfYear % difficulties.length];
  
  // Create deterministic offset based on date
  const dateString = today.toDateString();
  let seed = 0;
  for (let i = 0; i < dateString.length; i++) {
    seed += dateString.charCodeAt(i);
  }
  
  // Generate magic square with deterministic seed
  const baseSquare = [8, 1, 6, 3, 5, 7, 4, 9, 2];
  const offset = getDifficultyOffset(difficulty, seed);
  const solution = baseSquare.map(num => num + offset);
  const magicConstant = solution[0] + solution[1] + solution[2];
  
  return {
    solution,
    numbers: [...solution],
    constant: magicConstant,
    difficulty,
    isDaily: true
  };
};

// Preset puzzle configurations for specific challenges
export const getPresetPuzzles = () => {
  return [
    {
      id: 'classic',
      name: 'Classic Lo Shu',
      difficulty: 'easy',
      solution: [8, 1, 6, 3, 5, 7, 4, 9, 2],
      description: 'The traditional Chinese magic square'
    },
    {
      id: 'negative',
      name: 'Negative Challenge',
      difficulty: 'normal',
      solution: [-4, -11, -2, -9, -5, -1, -8, -3, -10],
      description: 'All negative numbers magic square'
    },
    {
      id: 'large',
      name: 'Big Numbers',
      difficulty: 'hard',
      solution: [108, 101, 106, 103, 105, 107, 104, 109, 102],
      description: 'Large positive numbers challenge'
    },
    {
      id: 'extreme',
      name: 'Extreme Range',
      difficulty: 'master',
      solution: [-492, -499, -494, -497, -495, -493, -496, -491, -498],
      description: 'Maximum difficulty with extreme numbers'
    }
  ];
};