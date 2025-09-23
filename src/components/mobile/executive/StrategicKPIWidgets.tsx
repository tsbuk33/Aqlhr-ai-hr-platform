import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
  BarChart3,
  Settings,
  RefreshCw,
  Eye
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface StrategicKPIWidgetsProps {
  screenSize: 'mobile' | 'tablet' | 'desktop';
}

export const StrategicKPIWidgets: React.FC<StrategicKPIWidgetsProps> = ({ screenSize }) => {
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);

  const kpiData = [
    {
      id: 'revenue',
      title: 'Revenue Growth',
      value: '$2.4M',
      change: '+18.5%',
      trend: 'up',
      priority: 'critical',
      data: [
        { month: 'Jan', value: 1800000 },
        { month: 'Feb', value: 1950000 },
        { month: 'Mar', value: 2100000 },
        { month: 'Apr', value: 2200000 },
        { month: 'May', value: 2350000 },
        { month: 'Jun', value: 2400000 }
      ]
    },
    {
      id: 'productivity',
      title: 'Employee Productivity',
      value: '94.2%',
      change: '+5.3%',
      trend: 'up',
      priority: 'high',
      data: [
        { month: 'Jan', value: 89 },
        { month: 'Feb', value: 91 },
        { month: 'Mar', value: 92 },
        { month: 'Apr', value: 93 },
        { month: 'May', value: 94 },
        { month: 'Jun', value: 94.2 }
      ]
    },
    {
      id: 'retention',
      title: 'Employee Retention',
      value: '96.8%',
      change: '+2.1%',
      trend: 'up',
      priority: 'high',
      data: [
        { month: 'Jan', value: 94.7 },
        { month: 'Feb', value: 95.1 },
        { month: 'Mar', value: 95.8 },
        { month: 'Apr', value: 96.2 },
        { month: 'May', value: 96.5 },
        { month: 'Jun', value: 96.8 }
      ]
    },
    {
      id: 'costs',
      title: 'Operational Costs',
      value: '$1.2M',
      change: '-8.7%',
      trend: 'down',
      priority: 'medium',
      data: [
        { month: 'Jan', value: 1350000 },
        { month: 'Feb', value: 1320000 },
        { month: 'Mar', value: 1280000 },
        { month: 'Apr', value: 1250000 },
        { month: 'May', value: 1220000 },
        { month: 'Jun', value: 1200000 }
      ]
    }
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Strategic KPI Widgets</h3>
          <p className="text-sm text-muted-foreground">Customizable executive dashboard metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {!refreshing && <span className="ml-2">Refresh</span>}
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
            <span className="ml-2">Customize</span>
          </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className={`grid gap-4 ${screenSize === 'mobile' ? 'grid-cols-1' : 'grid-cols-2'}`}>
        {kpiData.map((kpi) => (
          <Card key={kpi.id} className="border-l-4 border-l-primary">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                <Badge 
                  className={`${getPriorityColor(kpi.priority)} text-white text-xs`}
                >
                  {kpi.priority.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{kpi.value}</span>
                  <div className={`flex items-center gap-1 ${getTrendColor(kpi.trend)}`}>
                    {getTrendIcon(kpi.trend)}
                    <span className="text-sm font-medium">{kpi.change}</span>
                  </div>
                </div>
                
                {/* Mini Chart */}
                <div className="h-16">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={kpi.data}>
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke={kpi.trend === 'up' ? '#10b981' : '#ef4444'}
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Analytics */}
      <div className="grid gap-6">
        {/* Revenue Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Revenue Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={kpiData[0].data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${(value as number).toLocaleString()}`, 'Revenue']} />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Performance Metrics Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {kpiData.slice(1).map((kpi, index) => (
                <div key={kpi.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{kpi.title}</span>
                    <span className="text-sm font-bold">{kpi.value}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-green-500' : 'bg-purple-500'}`}
                      style={{ width: `${parseFloat(kpi.value)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Button>
        <Button variant="outline" size="sm">
          <Target className="h-4 w-4 mr-2" />
          Set Goals
        </Button>
        <Button variant="outline" size="sm">
          <Users className="h-4 w-4 mr-2" />
          Team Analysis
        </Button>
      </div>
    </div>
  );
};