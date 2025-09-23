import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, TrendingUp, Users, DollarSign } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';

interface CrossCompanyPerformanceProps {
  screenSize: 'mobile' | 'tablet' | 'desktop';
}

export const CrossCompanyPerformance: React.FC<CrossCompanyPerformanceProps> = ({ screenSize }) => {
  const [selectedCompany, setSelectedCompany] = useState('all');

  const companiesData = [
    { name: 'AqlHR Main', revenue: 3600000, employees: 278, growth: 18.5, status: 'excellent' },
    { name: 'AqlHR Tech', revenue: 1200000, employees: 85, growth: 22.3, status: 'excellent' },
    { name: 'AqlHR Consulting', revenue: 800000, employees: 42, growth: 15.8, status: 'good' },
    { name: 'AqlHR International', revenue: 450000, employees: 28, growth: 28.9, status: 'excellent' }
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'warning': return 'bg-yellow-500';
      default: return 'bg-red-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Building2 className="h-6 w-6 text-blue-500" />
        <div>
          <h3 className="text-lg font-semibold">Cross-Company Performance</h3>
          <p className="text-sm text-muted-foreground">Multi-entity performance overview</p>
        </div>
      </div>

      {/* Company Cards */}
      <div className={`grid gap-4 ${screenSize === 'mobile' ? 'grid-cols-1' : 'grid-cols-2'}`}>
        {companiesData.map((company, index) => (
          <Card key={company.name} className="border-l-4 border-l-primary">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">{company.name}</CardTitle>
                <Badge className={`${getStatusColor(company.status)} text-white`}>
                  {company.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Revenue</span>
                  <span className="text-sm font-bold">${(company.revenue / 1000000).toFixed(1)}M</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Employees</span>
                  <span className="text-sm font-bold">{company.employees}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Growth</span>
                  <span className="text-sm font-bold text-green-600">+{company.growth}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={companiesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                <Tooltip formatter={(value) => [`$${(value as number / 1000000).toFixed(1)}M`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};