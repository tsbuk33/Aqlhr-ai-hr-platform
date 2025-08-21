import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface TimeSeriesData {
  d: string;
  total_employees: number;
  saudization_rate: number;
  hse_safety_score: number;
  compliance_score: number;
  employee_experience_10: number;
  predictive_risk_high: number;
}

interface TimeSeriesChartProps {
  data: TimeSeriesData[];
  title?: string;
  isArabic?: boolean;
}

export const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({
  data,
  title = 'Operational Metrics over Time',
  isArabic = false
}) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border-subtle rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-2">{formatDate(label)}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-foreground-muted">{entry.name}:</span>
              <span className="font-medium text-foreground">
                {entry.name === 'Employee Experience' 
                  ? `${entry.value}/10`
                  : entry.name.includes('Rate') || entry.name.includes('Score')
                  ? `${entry.value}%` 
                  : entry.value
                }
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-gradient-to-br from-surface to-surface-subtle border-border-subtle">
      <CardHeader className={`flex flex-row items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
        <div className="p-2 rounded-lg bg-brand-primary/10">
          <TrendingUp className="h-5 w-5 text-brand-primary" />
        </div>
        <div>
          <CardTitle className={`text-lg font-semibold text-foreground ${isArabic ? 'text-right' : 'text-left'}`}>
            {isArabic ? 'المؤشرات التشغيلية عبر الوقت' : title}
          </CardTitle>
          <p className={`text-sm text-foreground-muted ${isArabic ? 'text-right' : 'text-left'}`}>
            {isArabic ? 'آخر 30 يوم' : 'Last 30 days'}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div style={{ height: '400px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border-subtle))" />
              <XAxis 
                dataKey="d"
                tickFormatter={formatDate}
                stroke="hsl(var(--foreground-muted))"
                fontSize={12}
              />
              <YAxis stroke="hsl(var(--foreground-muted))" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              <Line
                type="monotone"
                dataKey="saudization_rate"
                name={isArabic ? 'نسبة السعودة' : 'Saudization Rate'}
                stroke="hsl(var(--brand-primary))"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="hse_safety_score"
                name={isArabic ? 'نقاط السلامة' : 'HSE Safety Score'}
                stroke="hsl(var(--status-success))"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="compliance_score"
                name={isArabic ? 'نقاط الامتثال' : 'Compliance Score'}
                stroke="hsl(var(--brand-secondary))"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="employee_experience_10"
                name={isArabic ? 'تجربة الموظف' : 'Employee Experience'}
                stroke="hsl(var(--brand-accent))"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="predictive_risk_high"
                name={isArabic ? 'المخاطر التنبؤية' : 'High-Risk Employees'}
                stroke="hsl(var(--status-danger))"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};