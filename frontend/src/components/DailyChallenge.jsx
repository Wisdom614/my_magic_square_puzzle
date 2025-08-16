import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Calendar, 
  Star, 
  Trophy, 
  Clock, 
  Target,
  Gift,
  Flame
} from 'lucide-react';
import { generateDailyChallenge } from '../utils/gameLogic';
import { getDailyProgress, saveDailyProgress, isDailyChallengeCompleted } from '../utils/localStorage';

const DailyChallenge = ({ onStartChallenge }) => {
  const [todayChallenge, setTodayChallenge] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
  const [progress, setProgress] = useState({});

  useEffect(() => {
    // Generate today's challenge
    const challenge = generateDailyChallenge();
    setTodayChallenge(challenge);
    
    // Check if already completed
    setIsCompleted(isDailyChallengeCompleted());
    
    // Load progress data
    const dailyProgress = getDailyProgress();
    setProgress(dailyProgress);
    
    // Calculate current streak
    calculateStreak(dailyProgress);
  }, []);

  const calculateStreak = (progressData) => {
    const today = new Date();
    let streak = 0;
    let currentDate = new Date(today);
    
    // Count consecutive days going backwards
    while (true) {
      const dateStr = currentDate.toDateString();
      if (progressData[dateStr]?.completed) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    setStreakCount(streak);
  };

  const handleStartChallenge = () => {
    if (todayChallenge && onStartChallenge) {
      onStartChallenge({
        ...todayChallenge,
        isDaily: true
      });
    }
  };

  const getTimeUntilMidnight = () => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const diff = midnight - now;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const getRewardLevel = () => {
    if (streakCount >= 30) return { level: 'Legendary', color: 'from-purple-500 to-pink-500', icon: '👑' };
    if (streakCount >= 14) return { level: 'Master', color: 'from-yellow-500 to-orange-500', icon: '🏆' };
    if (streakCount >= 7) return { level: 'Expert', color: 'from-blue-500 to-indigo-500', icon: '⭐' };
    if (streakCount >= 3) return { level: 'Rising', color: 'from-green-500 to-teal-500', icon: '🌟' };
    return { level: 'Beginner', color: 'from-gray-400 to-gray-500', icon: '🎯' };
  };

  const reward = getRewardLevel();

  if (!todayChallenge) {
    return (
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-2 text-slate-600">Generating daily challenge...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-purple-50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-center flex items-center justify-center gap-2">
          <Calendar className="h-6 w-6 text-indigo-600" />
          Daily Challenge
        </CardTitle>
        <div className="text-center text-sm text-slate-600">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Challenge Info */}
        <div className="bg-white/80 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium">Difficulty:</span>
            <Badge className={`bg-gradient-to-r ${
              todayChallenge.difficulty === 'easy' ? 'from-green-500 to-emerald-600' :
              todayChallenge.difficulty === 'normal' ? 'from-blue-500 to-indigo-600' :
              todayChallenge.difficulty === 'hard' ? 'from-orange-500 to-red-600' :
              'from-purple-500 to-pink-600'
            } text-white`}>
              {todayChallenge.difficulty.charAt(0).toUpperCase() + todayChallenge.difficulty.slice(1)}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="font-medium">Magic Constant:</span>
            <Badge variant="outline" className="font-mono">
              {todayChallenge.constant}
            </Badge>
          </div>
        </div>

        {/* Current Streak */}
        <div className="bg-white/80 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="font-medium">Current Streak</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-600">{streakCount}</div>
              <div className="text-xs text-slate-500">days</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm">{reward.icon}</span>
            <Badge className={`bg-gradient-to-r ${reward.color} text-white`}>
              {reward.level}
            </Badge>
          </div>
          
          {/* Streak Progress */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-600">
              <span>Next reward at {Math.max(3, 7, 14, 30) - (streakCount % Math.max(3, 7, 14, 30))} days</span>
            </div>
            <Progress 
              value={(streakCount % 30) / 30 * 100} 
              className="h-2"
            />
          </div>
        </div>

        {/* Action Button */}
        {isCompleted ? (
          <div className="text-center space-y-3">
            <div className="bg-emerald-100 rounded-lg p-4">
              <Trophy className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
              <div className="font-semibold text-emerald-800">Challenge Completed!</div>
              <div className="text-sm text-emerald-600">Great job! Come back tomorrow for a new challenge.</div>
            </div>
            
            <div className="text-sm text-slate-600">
              <Clock className="h-4 w-4 inline mr-1" />
              Next challenge in {getTimeUntilMidnight()}
            </div>
          </div>
        ) : (
          <Button 
            onClick={handleStartChallenge}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
            size="lg"
          >
            <Target className="h-4 w-4 mr-2" />
            Start Daily Challenge
          </Button>
        )}

        {/* Recent Performance */}
        <div className="bg-white/80 rounded-lg p-4">
          <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-500" />
            This Week
          </h4>
          
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 7 }, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - (6 - i));
              const dateStr = date.toDateString();
              const dayProgress = progress[dateStr];
              
              return (
                <div
                  key={i}
                  className={`aspect-square rounded text-xs flex items-center justify-center font-medium ${
                    dayProgress?.completed 
                      ? 'bg-emerald-200 text-emerald-800' 
                      : 'bg-slate-100 text-slate-400'
                  }`}
                  title={date.toLocaleDateString()}
                >
                  {date.getDate()}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyChallenge;