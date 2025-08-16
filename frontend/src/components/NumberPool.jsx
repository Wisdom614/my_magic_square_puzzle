import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Hash } from 'lucide-react';

const NumberPool = ({ numbers, selectedCell, onNumberSelect }) => {
  const handleNumberClick = (number) => {
    if (selectedCell !== null) {
      onNumberSelect(number);
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-center flex items-center justify-center gap-2">
          <Hash className="h-5 w-5 text-slate-600" />
          Number Pool
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-5 gap-2 max-w-sm mx-auto">
          {numbers.map((number, index) => (
            <button
              key={`${number}-${index}`}
              onClick={() => handleNumberClick(number)}
              disabled={selectedCell === null}
              className={`
                h-12 w-12 rounded-lg font-bold text-sm transition-all duration-200
                ${selectedCell !== null 
                  ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 hover:scale-105 cursor-pointer shadow-lg hover:shadow-xl' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }
              `}
            >
              {number}
            </button>
          ))}
        </div>
        {selectedCell !== null && (
          <p className="text-sm text-center text-slate-600 mt-3">
            Click a number to place it in the selected cell
          </p>
        )}
        {selectedCell === null && numbers.length > 0 && (
          <p className="text-sm text-center text-slate-500 mt-3">
            Select a cell in the grid first
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default NumberPool;