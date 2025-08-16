import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Grid3X3, Square, SquareStack } from 'lucide-react';

const gridSizes = [
  {
    size: 3,
    name: '3×3 Classic',
    icon: Grid3X3,
    description: 'Traditional magic square',
    difficulty: 'Standard',
    color: 'from-emerald-500 to-teal-600'
  },
  {
    size: 4,
    name: '4×4 Advanced',
    icon: Square,
    description: 'More challenging grid',
    difficulty: 'Advanced',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    size: 5,
    name: '5×5 Expert',
    icon: SquareStack,
    description: 'Ultimate challenge',
    difficulty: 'Expert',
    color: 'from-purple-500 to-pink-600'
  }
];

const GridSizeSelector = ({ currentSize, onSizeChange, disabled = false }) => {
  return (
    <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-center">
          Grid Size
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {gridSizes.map((gridOption) => {
          const Icon = gridOption.icon;
          const isActive = currentSize === gridOption.size;
          const isDisabled = disabled || (gridOption.size > 3); // Disable 4x4 and 5x5 for now
          
          return (
            <Button
              key={gridOption.size}
              onClick={() => !isDisabled && onSizeChange(gridOption.size)}
              variant={isActive ? "default" : "outline"}
              disabled={isDisabled}
              className={`
                w-full h-auto p-3 text-left transition-all duration-200 relative
                ${isActive 
                  ? `bg-gradient-to-r ${gridOption.color} text-white hover:opacity-90` 
                  : isDisabled
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:border-slate-300 hover:bg-slate-50'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-6 w-6 ${isActive ? 'text-white' : 'text-slate-600'}`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm">{gridOption.name}</span>
                    <Badge 
                      variant={isActive ? "secondary" : "outline"}
                      className={`text-xs ${
                        isActive 
                          ? 'bg-white/20 text-white border-white/30' 
                          : 'text-slate-600'
                      }`}
                    >
                      {gridOption.difficulty}
                    </Badge>
                  </div>
                  <p className={`text-xs ${
                    isActive ? 'text-white/90' : 'text-slate-500'
                  }`}>
                    {gridOption.description}
                  </p>
                </div>
              </div>
              
              {isDisabled && gridOption.size > 3 && (
                <div className="absolute inset-0 bg-slate-100/50 rounded-lg flex items-center justify-center">
                  <Badge variant="outline" className="text-xs bg-white">
                    Coming Soon
                  </Badge>
                </div>
              )}
            </Button>
          );
        })}
        
        <div className="text-xs text-center text-slate-500 mt-3 pt-2 border-t">
          Larger grids coming in future updates!
        </div>
      </CardContent>
    </Card>
  );
};

export default GridSizeSelector;