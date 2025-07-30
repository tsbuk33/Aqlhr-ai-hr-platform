import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, Users, Award, BarChart3 } from 'lucide-react';

interface KPIStats {
  totalJobTitles: number;
  totalKPIs: number;
  totalAssignments: number;
  activeAssignments: number;
  avgAchievement: number;
}

interface KPIOverviewCardProps {
  stats: KPIStats;
  loading?: boolean;
}

export const KPIOverviewCard: React.FC<KPIOverviewCardProps> = ({ stats, loading = false }) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Smart KPI System Overview
          </CardTitle>
          <CardDescription>
            Loading KPI performance metrics...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-8 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const achievementColor = stats.avgAchievement >= 90 ? 'bg-green-500' :
                          stats.avgAchievement >= 70 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Smart KPI System Overview
        </CardTitle>
        <CardDescription>
          Comprehensive performance management linked to job titles from employee master data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="flex flex-col items-center p-4 bg-background/50 rounded-lg border">
            <Users className="h-6 w-6 text-blue-500 mb-2" />
            <span className="text-2xl font-bold text-foreground">{stats.totalJobTitles}</span>
            <span className="text-sm text-muted-foreground">Job Titles</span>
          </div>
          
          <div className="flex flex-col items-center p-4 bg-background/50 rounded-lg border">
            <Target className="h-6 w-6 text-purple-500 mb-2" />
            <span className="text-2xl font-bold text-foreground">{stats.totalKPIs}</span>
            <span className="text-sm text-muted-foreground">Smart KPIs</span>
          </div>
          
          <div className="flex flex-col items-center p-4 bg-background/50 rounded-lg border">
            <Award className="h-6 w-6 text-orange-500 mb-2" />
            <span className="text-2xl font-bold text-foreground">{stats.totalAssignments}</span>
            <span className="text-sm text-muted-foreground">Total Assignments</span>
          </div>
          
          <div className="flex flex-col items-center p-4 bg-background/50 rounded-lg border">
            <TrendingUp className="h-6 w-6 text-green-500 mb-2" />
            <span className="text-2xl font-bold text-foreground">{stats.activeAssignments}</span>
            <span className="text-sm text-muted-foreground">Active Now</span>
          </div>
          
          <div className="flex flex-col items-center p-4 bg-background/50 rounded-lg border">
            <div className={`h-6 w-6 rounded-full ${achievementColor} mb-2 flex items-center justify-center`}>
              <span className="text-white text-xs font-bold">%</span>
            </div>
            <span className="text-2xl font-bold text-foreground">{stats.avgAchievement}%</span>
            <span className="text-sm text-muted-foreground">Avg Achievement</span>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <h4 className="font-semibold text-primary mb-2">✨ New Features Implemented:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">NEW</Badge>
              <span>Job Title Master Data Integration</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">NEW</Badge>
              <span>Smart KPI Templates</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">NEW</Badge>
              <span>Performance Agreement System</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">NEW</Badge>
              <span>Employee KPI Assignments</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};