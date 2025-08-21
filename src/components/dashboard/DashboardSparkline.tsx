import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface SparklineProps {
  data: { date: string; value: number }[];
  color?: string;
  className?: string;
}

export function DashboardSparkline({ 
  data, 
  color = 'hsl(var(--primary))', 
  className = "h-8 w-full" 
}: SparklineProps) {
  if (!data || data.length === 0) {
    return <div className={className} />;
  }

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
            activeDot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}