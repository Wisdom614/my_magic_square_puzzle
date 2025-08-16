import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  TrendingUp, 
  Clock, 
  Trophy, 
  Target, 
  Award,
  BarChart3 
} from 'lucide-react';

const GameStats = ({ stats }) => {
  const formatTime = (ms) => {
    if (!ms || ms === Infinity) return '--:--';
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes.toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const winRate = stats.gamesPlayed > 0 ? (stats.gamesWon / stats.gamesPlayed * 100) : 0;
  const avgTime = stats.gamesWon > 0 ? stats.totalTime / stats.gamesWon : 0;

  return (
    <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-slate-600" />
          Game Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Win Rate */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium">Win Rate</span>
            </div>
            <Badge variant="outline" className="text-sm">
              {winRate.toFixed(1)}%
            </Badge>
          </div>
          <Progress value={winRate} className="h-2" />
        </div>

        {/* Games Played */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">Games Played</span>
          </div>
          <Badge variant="outline">
            {stats.gamesPlayed || 0}
          </Badge>
        </div>

        {/* Games Won */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-emerald-500" />
            <span className="text-sm font-medium">Games Won</span>
          </div>
          <Badge variant="outline">
            {stats.gamesWon || 0}
          </Badge>
        </div>

        {/* Best Time */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-medium">Best Time</span>
          </div>
          <Badge variant="outline" className="font-mono">
            {formatTime(stats.bestTime)}
          </Badge>
        </div>

        {/* Average Time */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-indigo-500" />
            <span className="text-sm font-medium">Avg Time</span>
          </div>
          <Badge variant="outline" className="font-mono">
            {formatTime(avgTime)}
          </Badge>
        </div>

        {/* Total Score */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-gold-500" />
            <span className="text-sm font-medium">Total Score</span>
          </div>
          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
            {(stats.totalScore || 0).toLocaleString()}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameStats;