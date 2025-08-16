import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { 
  Award, 
  Star, 
  Trophy, 
  Target, 
  Zap, 
  Crown,
  Gift,
  Lock,
  Sparkles
} from 'lucide-react';
import { getGameStats } from '../utils/localStorage';

const achievements = [
  {
    id: 'first_win',
    name: 'First Victory',
    description: 'Complete your first magic square',
    icon: Trophy,
    color: 'from-emerald-500 to-teal-600',
    requirement: { type: 'gamesWon', value: 1 }
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Complete a puzzle in under 60 seconds',
    icon: Zap,
    color: 'from-yellow-500 to-orange-600',
    requirement: { type: 'bestTime', value: 60000 }
  },
  {
    id: 'perfect_game',
    name: 'Perfect Game',
    description: 'Win without using hints on first attempt',
    icon: Star,
    color: 'from-blue-500 to-indigo-600',
    requirement: { type: 'special', value: 'perfect' }
  },
  {
    id: 'persistent',
    name: 'Persistent Player',
    description: 'Play 25 games',
    icon: Target,
    color: 'from-purple-500 to-pink-600',
    requirement: { type: 'gamesPlayed', value: 25 }
  },
  {
    id: 'master_player',
    name: 'Master Player',
    description: 'Win 10 games on Master difficulty',
    icon: Crown,
    color: 'from-indigo-500 to-purple-600',
    requirement: { type: 'masterWins', value: 10 }
  },
  {
    id: 'high_scorer',
    name: 'High Scorer',
    description: 'Reach 25,000 total score',
    icon: Award,
    color: 'from-amber-500 to-yellow-600',
    requirement: { type: 'totalScore', value: 25000 }
  },
  {
    id: 'dedication',
    name: 'Dedicated',
    description: 'Play 100 games',
    icon: Gift,
    color: 'from-green-500 to-emerald-600',
    requirement: { type: 'gamesPlayed', value: 100 }
  },
  {
    id: 'speed_master',
    name: 'Speed Master',
    description: 'Complete 5 puzzles under 30 seconds',
    icon: Sparkles,
    color: 'from-orange-500 to-red-600',
    requirement: { type: 'special', value: 'speedMaster' }
  }
];

const AchievementPanel = ({ gameStats, newAchievements = [] }) => {
  const [stats, setStats] = useState(gameStats || getGameStats());
  const [showNewAchievements, setShowNewAchievements] = useState(false);

  useEffect(() => {
    if (gameStats) {
      setStats(gameStats);
    }
  }, [gameStats]);

  useEffect(() => {
    if (newAchievements.length > 0) {
      setShowNewAchievements(true);
      const timer = setTimeout(() => {
        setShowNewAchievements(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [newAchievements]);

  const checkAchievementProgress = (achievement) => {
    const { requirement } = achievement;
    
    switch (requirement.type) {
      case 'gamesWon':
        return Math.min((stats.gamesWon || 0) / requirement.value, 1);
      case 'gamesPlayed':
        return Math.min((stats.gamesPlayed || 0) / requirement.value, 1);
      case 'totalScore':
        return Math.min((stats.totalScore || 0) / requirement.value, 1);
      case 'bestTime':
        return (stats.bestTime && stats.bestTime <= requirement.value) ? 1 : 0;
      case 'masterWins':
        return Math.min((stats.difficultyStats?.master?.won || 0) / requirement.value, 1);
      case 'special':
        // These are tracked differently and require manual checking
        return (stats.achievements || []).includes(achievement.id) ? 1 : 0;
      default:
        return 0;
    }
  };

  const isAchievementUnlocked = (achievementId) => {
    return (stats.achievements || []).includes(achievementId);
  };

  const getProgressText = (achievement) => {
    const { requirement } = achievement;
    const progress = checkAchievementProgress(achievement);
    
    if (progress >= 1) return 'Unlocked!';
    
    switch (requirement.type) {
      case 'gamesWon':
        return `${stats.gamesWon || 0}/${requirement.value}`;
      case 'gamesPlayed':
        return `${stats.gamesPlayed || 0}/${requirement.value}`;
      case 'totalScore':
        return `${(stats.totalScore || 0).toLocaleString()}/${requirement.value.toLocaleString()}`;
      case 'bestTime':
        return stats.bestTime ? `${Math.floor(stats.bestTime / 1000)}s best` : 'No record';
      case 'masterWins':
        return `${stats.difficultyStats?.master?.won || 0}/${requirement.value}`;
      default:
        return 'In progress';
    }
  };

  const unlockedCount = achievements.filter(a => isAchievementUnlocked(a.id)).length;
  const totalCount = achievements.length;

  return (
    <>
      {/* New Achievement Notification */}
      {showNewAchievements && newAchievements.length > 0 && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-up">
          {newAchievements.map((achievementId) => {
            const achievement = achievements.find(a => a.id === achievementId);
            if (!achievement) return null;
            
            const Icon = achievement.icon;
            
            return (
              <Card key={achievementId} className="mb-2 border-0 shadow-2xl bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-full">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-bold">Achievement Unlocked!</div>
                    <div className="text-sm opacity-90">{achievement.name}</div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              Achievements
            </div>
            <Badge variant="outline" className="text-sm">
              {unlockedCount}/{totalCount}
            </Badge>
          </CardTitle>
          
          <div className="space-y-2">
            <Progress value={(unlockedCount / totalCount) * 100} className="h-2" />
            <div className="text-xs text-slate-600 text-center">
              {Math.round((unlockedCount / totalCount) * 100)}% Complete
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3 max-h-96 overflow-y-auto">
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            const isUnlocked = isAchievementUnlocked(achievement.id);
            const progress = checkAchievementProgress(achievement);
            const progressText = getProgressText(achievement);
            
            return (
              <div
                key={achievement.id}
                className={`p-3 rounded-lg border transition-all duration-200 ${
                  isUnlocked
                    ? `bg-gradient-to-r ${achievement.color} text-white shadow-lg`
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${
                    isUnlocked 
                      ? 'bg-white/20' 
                      : 'bg-slate-200'
                  }`}>
                    {isUnlocked ? (
                      <Icon className="h-5 w-5" />
                    ) : (
                      <Lock className="h-5 w-5 text-slate-400" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`font-semibold text-sm ${
                        isUnlocked ? 'text-white' : 'text-slate-800'
                      }`}>
                        {achievement.name}
                      </h4>
                      <Badge 
                        variant={isUnlocked ? "secondary" : "outline"}
                        className={`text-xs ${
                          isUnlocked 
                            ? 'bg-white/20 text-white border-white/30' 
                            : 'text-slate-600'
                        }`}
                      >
                        {progressText}
                      </Badge>
                    </div>
                    
                    <p className={`text-xs mb-2 ${
                      isUnlocked ? 'text-white/90' : 'text-slate-600'
                    }`}>
                      {achievement.description}
                    </p>
                    
                    {!isUnlocked && progress > 0 && (
                      <Progress 
                        value={progress * 100} 
                        className="h-1"
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </>
  );
};

export default AchievementPanel;