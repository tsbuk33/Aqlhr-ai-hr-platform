import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, MapPin, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';

interface GeographicPerformanceDistributionProps {
  screenSize: 'mobile' | 'tablet' | 'desktop';
}

export const GeographicPerformanceDistribution: React.FC<GeographicPerformanceDistributionProps> = ({ screenSize }) => {
  const regionData = [
    { region: 'Riyadh', revenue: 2100000, employees: 156, growth: 19.2, marketShare: 45 },
    { region: 'Jeddah', revenue: 980000, employees: 78, growth: 16.8, marketShare: 22 },
    { region: 'Dammam', revenue: 720000, employees: 52, growth: 22.1, marketShare: 16 },
    { region: 'Other Cities', revenue: 350000, employees: 34, growth: 14.5, marketShare: 17 }
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Globe className="h-6 w-6 text-cyan-500" />
        <div>
          <h3 className="text-lg font-semibold">Geographic Performance</h3>
          <p className="text-sm text-muted-foreground">Regional distribution and growth</p>
        </div>
      </div>

      {/* Regional Overview */}
      <div className={`grid gap-4 ${screenSize === 'mobile' ? 'grid-cols-1' : 'grid-cols-2'}`}>
        {regionData.map((region, index) => (
          <Card key={region.region}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {region.region}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Revenue</span>
                  <span className="text-sm font-bold">${(region.revenue / 1000000).toFixed(1)}M</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Market Share</span>
                  <span className="text-sm font-bold">{region.marketShare}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Growth</span>
                  <span className="text-sm font-bold text-green-600">+{region.growth}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Geographic Distribution Charts */}
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Region</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={regionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ region, value }) => `${region}: $${(value / 1000000).toFixed(1)}M`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="revenue"
                  >
                    {regionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${(value as number / 1000000).toFixed(1)}M`, 'Revenue']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Growth Rate by Region</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="region" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}%`, 'Growth Rate']} />
                  <Bar dataKey="growth" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};