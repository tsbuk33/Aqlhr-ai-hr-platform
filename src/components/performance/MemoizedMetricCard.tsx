import React, { memo } from 'react';
import { MetricCard } from '@/components/MetricCard';

interface MemoizedMetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: {
    value: string | number;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "secondary" | "accent" | "success" | "warning" | "danger";
  className?: string;
  type?: 'currency' | 'number' | 'percentage' | 'days' | 'hours' | 'text';
  currency?: 'SAR' | 'USD';
}

export const MemoizedMetricCard = memo<MemoizedMetricCardProps>(
  ({ ...props }) => <MetricCard {...props} />,
  (prevProps, nextProps) => {
    // Custom comparison to prevent unnecessary re-renders
    return (
      prevProps.title === nextProps.title &&
      prevProps.value === nextProps.value &&
      prevProps.description === nextProps.description &&
      prevProps.variant === nextProps.variant &&
      prevProps.type === nextProps.type &&
      prevProps.currency === nextProps.currency &&
      prevProps.trend?.value === nextProps.trend?.value &&
      prevProps.trend?.isPositive === nextProps.trend?.isPositive
    );
  }
);

MemoizedMetricCard.displayName = 'MemoizedMetricCard';