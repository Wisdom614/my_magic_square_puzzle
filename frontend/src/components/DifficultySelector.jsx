import React from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Zap, Target, Flame, Crown } from 'lucide-react';

const difficulties = [
  {
    id: 'easy',
    name: 'Simple',
    icon: Zap,
    color: 'from-green-500 to-emerald-600',
    description: 'Small positive numbers',
    range: '1-20'
  },
  {
    id: 'normal',
    name: 'Normal',
    icon: Target,
    color: 'from-blue-500 to-indigo-600',
    description: 'Medium range numbers',
    range: '-50 to 50'
  },
  {
    id: 'hard',
    name: 'Hard',
    icon: Flame,
    color: 'from-orange-500 to-red-600',
    description: 'Larger number range',
    range: '-200 to 200'
  },
  {
    id: 'master',
    name: 'Master',
    icon: Crown,
    color: 'from-purple-500 to-pink-600',
    description: 'Extreme challenge',
    range: '-1000 to 1000'
  }
];

const DifficultySelector = ({ currentLevel, onLevelChange }) => {
  return (
    <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-2">
          {difficulties.map((difficulty) => {
            const Icon = difficulty.icon;
            const isActive = currentLevel === difficulty.id;
            
            return (
              <Button
                key={difficulty.id}
                onClick={() => onLevelChange(difficulty.id)}
                variant={isActive ? "default" : "outline"}
                className={`
                  h-auto p-3 text-left transition-all duration-200
                  ${isActive 
                    ? `bg-gradient-to-r ${difficulty.color} text-white hover:opacity-90 ring-2 ring-offset-2 ring-opacity-50` 
                    : 'hover:border-slate-300 hover:bg-slate-50'
                  }
                `}
              >
                <div className="flex flex-col items-center gap-2">
                  <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-600'}`} />
                  <div className="text-center">
                    <div className="font-semibold text-sm">{difficulty.name}</div>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs mt-1 ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}
                    >
                      {difficulty.range}
                    </Badge>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default DifficultySelector;