import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, PieChart, BarChart3 } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from 'recharts';

interface FinancialPerformanceMetricsProps {
  screenSize: 'mobile' | 'tablet' | 'desktop';
}

export const FinancialPerformanceMetrics: React.FC<FinancialPerformanceMetricsProps> = ({ screenSize }) => {
  const financialData = [
    { month: 'Jan', revenue: 3200000, expenses: 2400000, profit: 800000, margin: 25 },
    { month: 'Feb', revenue: 3350000, expenses: 2450000, profit: 900000, margin: 26.9 },
    { month: 'Mar', revenue: 3500000, expenses: 2500000, profit: 1000000, margin: 28.6 },
    { month: 'Apr', revenue: 3650000, expenses: 2520000, profit: 1130000, margin: 31 },
    { month: 'May', revenue: 3800000, expenses: 2550000, profit: 1250000, margin: 32.9 },
    { month: 'Jun', revenue: 3950000, expenses: 2580000, profit: 1370000, margin: 34.7 }
  ];

  const kpiMetrics = [
    { label: 'Monthly Revenue', value: '$3.95M', change: '+18.5%', trend: 'up' },
    { label: 'Profit Margin', value: '34.7%', change: '+6.2%', trend: 'up' },
    { label: 'Operating Costs', value: '$2.58M', change: '-2.1%', trend: 'down' },
    { label: 'EBITDA', value: '$1.37M', change: '+28.3%', trend: 'up' }
  ];

  const getTrendColor = (trend: string) => trend === 'up' ? 'text-green-600' : 'text-red-600';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <DollarSign className="h-6 w-6 text-green-500" />
        <div>
          <h3 className="text-lg font-semibold">Financial Performance</h3>
          <p className="text-sm text-muted-foreground">Revenue, profit, and cost analysis</p>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className={`grid gap-4 ${screenSize === 'mobile' ? 'grid-cols-2' : 'grid-cols-4'}`}>
        {kpiMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">{metric.label}</p>
                <p className="text-lg font-bold">{metric.value}</p>
                <p className={`text-xs font-medium ${getTrendColor(metric.trend)}`}>
                  {metric.change}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue vs Profit Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Revenue vs Profit Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financialData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                <Tooltip formatter={(value) => [`$${(value as number / 1000000).toFixed(2)}M`]} />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stackId="1" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.3}
                  name="Revenue"
                />
                <Area 
                  type="monotone" 
                  dataKey="profit" 
                  stackId="2" 
                  stroke="#10b981" 
                  fill="#10b981" 
                  fillOpacity={0.6}
                  name="Profit"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Profit Margin Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Profit Margin Evolution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={financialData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, 'Profit Margin']} />
                <Line 
                  type="monotone" 
                  dataKey="margin" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  name="Profit Margin %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};