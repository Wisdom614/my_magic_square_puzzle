import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { X, Sparkles } from 'lucide-react';

const GameGrid = ({ 
  gridSize, 
  currentNumbers, 
  solution, 
  selectedCell, 
  onCellSelect, 
  onNumberPlace, 
  onNumberRemove,
  isCompleted,
  gameActive 
}) => {
  const handleCellClick = (index) => {
    if (!gameActive) return;
    onCellSelect(selectedCell === index ? null : index);
  };

  const handleRemoveNumber = (index, e) => {
    e.stopPropagation();
    onNumberRemove(index);
  };

  const getCellStyle = (index) => {
    let baseStyle = "relative w-20 h-20 border-2 rounded-lg flex items-center justify-center text-2xl font-bold transition-all duration-200 cursor-pointer group ";
    
    if (isCompleted) {
      baseStyle += "bg-gradient-to-br from-emerald-100 to-teal-100 border-emerald-300 text-emerald-700 ";
    } else if (selectedCell === index) {
      baseStyle += "bg-gradient-to-br from-blue-100 to-indigo-100 border-blue-400 text-blue-700 ring-2 ring-blue-300 ";
    } else if (currentNumbers[index] !== null) {
      if (solution && solution[index] === currentNumbers[index]) {
        baseStyle += "bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-300 text-emerald-700 ";
      } else if (solution) {
        baseStyle += "bg-gradient-to-br from-red-50 to-pink-50 border-red-300 text-red-700 ";
      } else {
        baseStyle += "bg-gradient-to-br from-slate-50 to-gray-50 border-slate-300 text-slate-700 hover:border-slate-400 ";
      }
    } else {
      baseStyle += "bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:bg-slate-50 ";
    }
    
    return baseStyle;
  };

  return (
    <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm p-6">
      <div 
        className={`grid gap-3 mx-auto w-fit`}
        style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
      >
        {currentNumbers.map((number, index) => (
          <div
            key={index}
            className={getCellStyle(index)}
            onClick={() => handleCellClick(index)}
          >
            {number !== null && (
              <>
                <span className="select-none">
                  {number}
                </span>
                {gameActive && !isCompleted && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-red-500 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => handleRemoveNumber(index, e)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </>
            )}
            {number === null && selectedCell === index && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              </div>
            )}
            {isCompleted && (
              <div className="absolute -top-1 -right-1">
                <Sparkles className="h-4 w-4 text-emerald-500 animate-pulse" />
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default GameGrid;