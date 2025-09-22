import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, RadialBarChart, RadialBar } from 'recharts';
import { Users, Briefcase, Clock, AlertTriangle, CheckCircle, Activity } from 'lucide-react';

interface WorkloadDistributionProps {
  screenSize: 'mobile' | 'tablet' | 'desktop';
}

export const WorkloadDistribution: React.FC<WorkloadDistributionProps> = ({ screenSize }) => {
  const { t } = useTranslation();

  // Dummy workload data
  const teamWorkload = [
    { 
      team: 'Engineering', 
      members: 12, 
      tasks: 45, 
      avgLoad: 89, 
      capacity: 95,
      status: 'high',
      efficiency: 92
    },
    { 
      team: 'Sales', 
      members: 8, 
      tasks: 32, 
      avgLoad: 76, 
      capacity: 85,
      status: 'normal',
      efficiency: 88
    },
    { 
      team: 'Marketing', 
      members: 6, 
      tasks: 28, 
      avgLoad: 82, 
      capacity: 90,
      status: 'normal',
      efficiency: 85
    },
    { 
      team: 'Support', 
      members: 5, 
      tasks: 38, 
      avgLoad: 94, 
      capacity: 80,
      status: 'overloaded',
      efficiency: 78
    },
    { 
      team: 'HR', 
      members: 4, 
      tasks: 18, 
      avgLoad: 65, 
      capacity: 75,
      status: 'light',
      efficiency: 82
    }
  ];

  const workloadByPriority = [
    { priority: 'High', count: 23, color: '#ef4444' },
    { priority: 'Medium', count: 41, color: '#f59e0b' },
    { priority: 'Low', count: 18, color: '#22c55e' },
    { priority: 'Critical', count: 8, color: '#dc2626' }
  ];

  const individualWorkload = [
    { name: 'Ahmed Al-Rashid', tasks: 12, capacity: 15, utilization: 80 },
    { name: 'Sara Hassan', tasks: 14, capacity: 16, utilization: 88 },
    { name: 'Omar Khalil', tasks: 18, capacity: 18, utilization: 100 },
    { name: 'Fatima Al-Zahra', tasks: 10, capacity: 14, utilization: 71 },
    { name: 'Mohamed Farid', tasks: 16, capacity: 15, utilization: 107 }
  ];

  const departmentCapacity = [
    { dept: 'Engineering', used: 89, available: 11 },
    { dept: 'Sales', used: 76, available: 24 },
    { dept: 'Marketing', used: 82, available: 18 },
    { dept: 'Support', used: 94, available: 6 },
    { dept: 'HR', used: 65, available: 35 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overloaded': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'normal': return 'bg-green-100 text-green-800';
      case 'light': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'overloaded': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'high': return <Activity className="h-4 w-4 text-orange-500" />;
      case 'normal': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'light': return <Clock className="h-4 w-4 text-blue-500" />;
      default: return <div className="h-4 w-4" />;
    }
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization > 100) return 'text-red-600';
    if (utilization > 90) return 'text-orange-600';
    if (utilization > 70) return 'text-green-600';
    return 'text-blue-600';
  };

  return (
    <div className="space-y-6">
      {/* Workload Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t('analytics.total_tasks')}</p>
                <p className="text-xl font-bold">161</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t('analytics.team_members')}</p>
                <p className="text-xl font-bold">35</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t('analytics.avg_utilization')}</p>
                <p className="text-xl font-bold">81%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t('analytics.overloaded_teams')}</p>
                <p className="text-xl font-bold text-red-600">1</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Workload Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {t('analytics.team_workload_status')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamWorkload.map((team) => (
              <div key={team.team} className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{team.team}</span>
                    {getStatusIcon(team.status)}
                    <Badge className={getStatusColor(team.status)}>
                      {team.status}
                    </Badge>
                  </div>
                  <div className="text-right text-sm">
                    <div>{team.members} {t('analytics.members')}</div>
                    <div>{team.tasks} {t('analytics.tasks')}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">{t('analytics.workload')}</p>
                    <Progress value={team.avgLoad} className="h-2 mt-1" />
                    <p className="font-medium mt-1">{team.avgLoad}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('analytics.capacity')}</p>
                    <Progress value={team.capacity} className="h-2 mt-1" />
                    <p className="font-medium mt-1">{team.capacity}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('analytics.efficiency')}</p>
                    <Progress value={team.efficiency} className="h-2 mt-1" />
                    <p className="font-medium mt-1">{team.efficiency}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Workload by Priority */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('analytics.workload_by_priority')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`${screenSize === 'mobile' ? 'h-48' : 'h-64'}`}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={workloadByPriority}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={screenSize === 'mobile' ? 60 : 80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {workloadByPriority.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('analytics.department_capacity')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`${screenSize === 'mobile' ? 'h-48' : 'h-64'}`}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentCapacity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dept" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="used" stackId="a" fill="#3b82f6" name={t('analytics.used')} />
                  <Bar dataKey="available" stackId="a" fill="#e5e7eb" name={t('analytics.available')} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Individual Workload */}
      <Card>
        <CardHeader>
          <CardTitle>{t('analytics.individual_workload_top_5')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {individualWorkload.map((person, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{person.name}</span>
                  <div className="text-right text-sm">
                    <span className={`font-bold ${getUtilizationColor(person.utilization)}`}>
                      {person.tasks}/{person.capacity}
                    </span>
                    <span className="text-muted-foreground ml-2">
                      ({person.utilization}%)
                    </span>
                  </div>
                </div>
                <Progress 
                  value={Math.min(person.utilization, 100)} 
                  className="h-2"
                />
                {person.utilization > 100 && (
                  <div className="flex items-center gap-1 text-xs text-red-600">
                    <AlertTriangle className="h-3 w-3" />
                    <span>{t('analytics.overloaded')}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Workload Distribution Insights */}
      <Card>
        <CardHeader>
          <CardTitle>{t('analytics.workload_insights')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-red-900">{t('analytics.overload_alert')}</p>
                <p className="text-sm text-red-700">
                  {t('analytics.overload_alert_insight')}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-yellow-900">{t('analytics.capacity_optimization')}</p>
                <p className="text-sm text-yellow-700">
                  {t('analytics.capacity_optimization_insight')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-blue-900">{t('analytics.resource_reallocation')}</p>
                <p className="text-sm text-blue-700">
                  {t('analytics.resource_reallocation_insight')}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};