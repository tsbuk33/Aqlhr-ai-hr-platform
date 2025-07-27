import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock, AlertTriangle, TrendingUp, Users, AlertCircle } from "lucide-react";
import { AIRecommendation } from "@/hooks/useAIRecommendations";
import EduBox from "@/components/EduBox";

interface AIRecommendationCardProps {
  recommendation: AIRecommendation;
  onStatusUpdate: (id: string, status: AIRecommendation['status']) => void;
  compact?: boolean;
}

const AIRecommendationCard: React.FC<AIRecommendationCardProps> = ({
  recommendation,
  onStatusUpdate,
  compact = false
}) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'promotion': return <TrendingUp className="h-4 w-4" />;
      case 'transfer': return <Users className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'retention': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'promotion': return 'bg-brand-success text-primary-foreground';
      case 'transfer': return 'bg-brand-primary text-primary-foreground';
      case 'warning': return 'bg-brand-warning text-primary-foreground';
      case 'retention': return 'bg-brand-danger text-primary-foreground';
      case 'training': return 'bg-brand-accent text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-brand-danger text-primary-foreground';
      case 'high': return 'bg-brand-warning text-primary-foreground';
      case 'medium': return 'bg-brand-primary text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-brand-success';
      case 'rejected': return 'text-brand-danger';
      case 'implemented': return 'text-brand-primary';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className={compact ? "pb-3" : ""}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {getTypeIcon(recommendation.recommendation_type)}
              <CardTitle className="text-lg capitalize">
                {recommendation.recommendation_type.replace('_', ' ')}
              </CardTitle>
              <EduBox
                title="AI Recommendation"
                description="AI-generated recommendation based on employee performance, attendance, and historical data"
                howToUse="Review the reasoning and confidence score before taking action on recommendations"
                linkedFeatures={['Performance Management', 'HR Analytics', 'Employee Development']}
                userLevel="hr_admin"
              >
                <></>
              </EduBox>
            </div>
            
            {recommendation.employee && (
              <CardDescription>
                For {recommendation.employee.first_name} {recommendation.employee.last_name} - {recommendation.employee.position}
              </CardDescription>
            )}
          </div>
          
          <div className="flex flex-col gap-2 items-end">
            <Badge className={getTypeColor(recommendation.recommendation_type)}>
              {recommendation.recommendation_type}
            </Badge>
            <Badge className={getPriorityColor(recommendation.priority)}>
              {recommendation.priority}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Confidence Score */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Confidence Score</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brand-primary rounded-full transition-all"
                  style={{ width: `${recommendation.confidence_score * 100}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-foreground">
                {Math.round(recommendation.confidence_score * 100)}%
              </span>
            </div>
          </div>

          {/* Reasoning */}
          {!compact && (
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">AI Analysis</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {recommendation.reasoning}
              </p>
            </div>
          )}

          {/* Recommended Action */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Recommended Action</h4>
            <p className="text-sm text-foreground bg-surface-secondary p-3 rounded-md">
              {recommendation.recommended_action}
            </p>
          </div>

          {/* Status and Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Status:</span>
              <span className={`text-sm font-medium capitalize ${getStatusColor(recommendation.status)}`}>
                {recommendation.status}
              </span>
            </div>

            {recommendation.status === 'pending' && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onStatusUpdate(recommendation.id, 'rejected')}
                  className="text-brand-danger border-brand-danger hover:bg-brand-danger hover:text-primary-foreground"
                >
                  <XCircle className="h-3 w-3 mr-1" />
                  Reject
                </Button>
                <Button
                  size="sm"
                  onClick={() => onStatusUpdate(recommendation.id, 'approved')}
                  className="bg-brand-success hover:bg-brand-success/90 text-primary-foreground"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Approve
                </Button>
              </div>
            )}
          </div>

          {/* Implementation Deadline */}
          {recommendation.implementation_deadline && (
            <div className="text-xs text-muted-foreground">
              Deadline: {new Date(recommendation.implementation_deadline).toLocaleDateString()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIRecommendationCard;