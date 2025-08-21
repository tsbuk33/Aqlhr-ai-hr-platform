import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface SparklineData {
  date: string;
  value: number;
}

interface SparklineProps {
  data: SparklineData[];
  color?: string;
  height?: number;
  className?: string;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  color = 'hsl(var(--brand-primary))',
  height = 40,
  className = ''
}) => {
  if (!data || data.length === 0) return null;

  return (
    <div className={className} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};