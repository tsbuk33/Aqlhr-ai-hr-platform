import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface RiskScoreCardProps {
  title: string
  score: number
  maxScore?: number
  variant?: 'default' | 'critical' | 'warning' | 'safe'
  className?: string
}

export function RiskScoreCard({ 
  title, 
  score, 
  maxScore = 10, 
  variant = 'default',
  className 
}: RiskScoreCardProps) {
  const percentage = (score / maxScore) * 100
  
  const getVariantStyles = () => {
    if (score >= 8) return 'border-destructive bg-destructive/5'
    if (score >= 6) return 'border-warning bg-warning/5'
    if (score >= 4) return 'border-muted bg-muted/5'
    return 'border-success bg-success/5'
  }

  const getScoreColor = () => {
    if (score >= 8) return 'text-destructive'
    if (score >= 6) return 'text-warning'
    if (score >= 4) return 'text-muted-foreground'
    return 'text-success'
  }

  return (
    <Card className={cn(getVariantStyles(), className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className={cn('text-2xl font-bold', getScoreColor())}>
            {score.toFixed(1)}
          </span>
          <span className="text-sm text-muted-foreground">
            / {maxScore}
          </span>
        </div>
        <div className="mt-2 w-full bg-muted rounded-full h-2">
          <div 
            className={cn(
              'h-2 rounded-full transition-all',
              score >= 8 ? 'bg-destructive' :
              score >= 6 ? 'bg-warning' :
              score >= 4 ? 'bg-muted-foreground' : 'bg-success'
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </CardContent>
    </Card>
  )
}