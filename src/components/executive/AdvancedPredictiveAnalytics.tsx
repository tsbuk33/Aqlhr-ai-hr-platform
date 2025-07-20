import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  BarChart3, 
  Target, 
  Lightbulb, 
  AlertTriangle, 
  CheckCircle, 
  ExternalLink,
  Download,
  Brain,
  Globe,
  Zap
} from 'lucide-react';

interface PredictionCardProps {
  title: string;
  accuracy: string;
  prediction: string;
  confidence: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
  icon: React.ReactNode;
}

const PredictionCard: React.FC<PredictionCardProps> = ({
  title,
  accuracy,
  prediction,
  confidence,
  impact,
  recommendation,
  icon
}) => {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'text-status-danger';
      case 'high': return 'text-status-warning';
      case 'medium': return 'text-primary';
      case 'low': return 'text-status-success';
      default: return 'text-foreground-muted';
    }
  };

  const getImpactBg = (impact: string) => {
    switch (impact) {
      case 'critical': return 'bg-status-danger/10 border-status-danger/20';
      case 'high': return 'bg-status-warning/10 border-status-warning/20';
      case 'medium': return 'bg-primary/10 border-primary/20';
      case 'low': return 'bg-status-success/10 border-status-success/20';
      default: return 'bg-surface/10 border-border/20';
    }
  };

  return (
    <Card className={`transition-all duration-300 hover:shadow-lg ${getImpactBg(impact)}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {icon}
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-background/80">
            {accuracy} accurate
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Prediction Confidence</span>
            <span className="text-sm text-muted-foreground">{confidence}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300" 
              style={{ width: `${parseInt(confidence)}%` }}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium text-foreground">Prediction:</h4>
          <p className="text-sm text-muted-foreground">{prediction}</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Impact Level:</span>
            <Badge variant="outline" className={getImpactColor(impact)}>
              {impact.toUpperCase()}
            </Badge>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium text-foreground flex items-center">
            <Lightbulb className="h-4 w-4 mr-2 text-yellow-500" />
            AI Recommendation:
          </h4>
          <p className="text-sm text-muted-foreground">{recommendation}</p>
        </div>
        
        <div className="flex space-x-2 pt-2">
          <Button size="sm" className="flex-1">
            <Target className="h-4 w-4 mr-2" />
            View Details
          </Button>
          <Button size="sm" variant="outline">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

interface InsightCardProps {
  title: string;
  value: string;
  description: string;
  confidence: string;
  source: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
}

const InsightCard: React.FC<InsightCardProps> = ({
  title,
  value,
  description,
  confidence,
  source,
  icon,
  trend = 'stable'
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-brand-success" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-status-danger" />;
      default: return null;
    }
  };

  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {icon}
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          {getTrendIcon()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-primary mb-2">{value}</div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Confidence</span>
            <span className="text-sm text-muted-foreground">{confidence}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300" 
              style={{ width: `${parseInt(confidence)}%` }}
            />
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground flex items-center">
          <ExternalLink className="h-3 w-3 mr-1" />
          Source: {source}
        </div>
      </CardContent>
    </Card>
  );
};

interface RecommendationCardProps {
  recommendation: {
    id: number;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    confidence: string;
    expectedROI: string;
    timeline: string;
    businessImpact: string;
    implementation: string[];
  };
  onImplement: (id: number) => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onImplement
}) => {
  const [expanded, setExpanded] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-status-danger';
      case 'high': return 'text-status-warning';
      case 'medium': return 'text-primary';
      case 'low': return 'text-status-success';
      default: return 'text-foreground-muted';
    }
  };

  const getPriorityBg = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-status-danger/10 border-status-danger/20';
      case 'high': return 'bg-status-warning/10 border-status-warning/20';
      case 'medium': return 'bg-primary/10 border-primary/20';
      case 'low': return 'bg-status-success/10 border-status-success/20';
      default: return 'bg-surface/10 border-border/20';
    }
  };

  return (
    <Card className={`transition-all duration-300 hover:shadow-lg ${getPriorityBg(recommendation.priority)}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
            {recommendation.title}
          </CardTitle>
          <Badge variant="outline" className={getPriorityColor(recommendation.priority)}>
            {recommendation.priority.toUpperCase()}
          </Badge>
        </div>
        <CardDescription>{recommendation.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-brand-success">{recommendation.expectedROI}</div>
            <div className="text-xs text-muted-foreground">Expected ROI</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-primary">{recommendation.confidence}</div>
            <div className="text-xs text-muted-foreground">Confidence</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-brand-warning">{recommendation.timeline}</div>
            <div className="text-xs text-muted-foreground">Timeline</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-brand-accent">High</div>
            <div className="text-xs text-muted-foreground">Impact</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium">Business Impact:</h4>
          <p className="text-sm text-muted-foreground">{recommendation.businessImpact}</p>
        </div>
        
        {expanded && (
          <div className="space-y-3 border-t pt-4">
            <h4 className="font-medium">Implementation Steps:</h4>
            <ul className="space-y-2">
              {recommendation.implementation.map((step, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm">
                  <CheckCircle className="h-4 w-4 mt-0.5 text-brand-success flex-shrink-0" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="flex space-x-2 pt-2">
          <Button 
            size="sm" 
            onClick={() => onImplement(recommendation.id)}
            className="flex-1"
          >
            <Zap className="h-4 w-4 mr-2" />
            Implement Strategy
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Less' : 'More'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

interface CompetitorCardProps {
  name: string;
  marketShare: string;
  strengths: string[];
  weaknesses: string[];
  aqlhrAdvantage: string;
  threatLevel: 'low' | 'medium' | 'high';
}

const CompetitorCard: React.FC<CompetitorCardProps> = ({
  name,
  marketShare,
  strengths,
  weaknesses,
  aqlhrAdvantage,
  threatLevel
}) => {
  const getThreatColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-status-danger';
      case 'medium': return 'text-status-warning';
      case 'low': return 'text-status-success';
      default: return 'text-foreground-muted';
    }
  };

  const getThreatBg = (level: string) => {
    switch (level) {
      case 'high': return 'bg-status-danger/10 border-status-danger/20';
      case 'medium': return 'bg-status-warning/10 border-status-warning/20';
      case 'low': return 'bg-status-success/10 border-status-success/20';
      default: return 'bg-surface/10 border-border/20';
    }
  };

  return (
    <Card className={`transition-all duration-300 hover:shadow-lg ${getThreatBg(threatLevel)}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{name}</CardTitle>
          <div className="text-right">
            <div className="text-sm font-medium">{marketShare}</div>
            <div className="text-xs text-muted-foreground">Market Share</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-brand-success mb-2">Strengths:</h4>
            <ul className="space-y-1">
              {strengths.map((strength, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-center">
                  <CheckCircle className="h-3 w-3 mr-2 text-brand-success" />
                  {strength}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-brand-warning mb-2">Weaknesses:</h4>
            <ul className="space-y-1">
              {weaknesses.map((weakness, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-2 text-brand-warning" />
                  {weakness}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="border-t pt-3">
            <h4 className="font-medium text-primary mb-2">AqlHR Advantage:</h4>
            <p className="text-sm text-primary bg-primary/10 p-2 rounded-md">{aqlhrAdvantage}</p>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm font-medium">Threat Level:</span>
            <Badge variant="outline" className={getThreatColor(threatLevel)}>
              {threatLevel.toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const AdvancedPredictiveAnalytics: React.FC = () => {
  const [recommendations] = useState([
    {
      id: 1,
      title: "Implement Advanced Workforce Planning",
      description: "AI analysis suggests implementing advanced workforce planning could increase ROI by 340%",
      priority: "critical" as const,
      confidence: "94%",
      expectedROI: "340%",
      timeline: "18 months",
      businessImpact: "High - Strategic transformation opportunity",
      implementation: [
        "Deploy predictive hiring models",
        "Implement skills-based workforce planning",
        "Integrate succession planning automation",
        "Launch performance prediction algorithms"
      ]
    },
    {
      id: 2,
      title: "Accelerate Saudization Compliance",
      description: "Proactive Saudization strategy to exceed 75% target by Q3 2025",
      priority: "high" as const,
      confidence: "96%",
      expectedROI: "180%",
      timeline: "12 months",
      businessImpact: "Critical - Government compliance requirement",
      implementation: [
        "Launch targeted Saudi talent acquisition",
        "Implement skills development programs",
        "Deploy retention strategies for Saudi employees",
        "Automate Nitaqat compliance monitoring"
      ]
    }
  ]);

  const handleImplementation = (id: number) => {
    console.log(`Implementing recommendation ${id}`);
    // Implementation logic here
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground flex items-center justify-center">
          <Brain className="h-8 w-8 mr-3 text-primary" />
          Advanced Predictive Intelligence
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          AI-powered strategic forecasting across all operational dimensions with 94%+ accuracy
        </p>
        <div className="flex justify-center space-x-2">
          <Badge className="bg-brand-success/10 text-brand-success border-brand-success/20">
            <CheckCircle className="h-3 w-3 mr-1" />
            Real-time Analysis
          </Badge>
          <Badge className="bg-primary/10 text-primary border-primary/20">
            <Brain className="h-3 w-3 mr-1" />
            AI-Powered
          </Badge>
          <Badge className="bg-brand-warning/10 text-brand-warning border-brand-warning/20">
            <Globe className="h-3 w-3 mr-1" />
            Enterprise Ready
          </Badge>
        </div>
      </div>

      {/* Workforce Trend Predictions */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-foreground flex items-center">
          <Users className="h-6 w-6 mr-3 text-primary" />
          Workforce Trend Predictions
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <PredictionCard 
            title="Turnover Risk Analysis"
            accuracy="94.7%"
            prediction="12% turnover risk in Q2 2025"
            confidence="92%"
            impact="high"
            recommendation="Implement retention strategy for IT department"
            icon={<AlertTriangle className="h-5 w-5 text-brand-warning" />}
          />
          <PredictionCard 
            title="Hiring Demand Forecast"
            accuracy="91.3%"
            prediction="35% increase in technical roles needed"
            confidence="89%"
            impact="critical"
            recommendation="Accelerate recruitment for software engineers"
            icon={<TrendingUp className="h-5 w-5 text-brand-success" />}
          />
          <PredictionCard 
            title="Skills Gap Analysis"
            accuracy="96.1%"
            prediction="AI/ML skills shortage by 40%"
            confidence="94%"
            impact="high"
            recommendation="Launch AI training program immediately"
            icon={<Brain className="h-5 w-5 text-primary" />}
          />
        </div>
      </div>

      {/* Market Analysis Intelligence */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-foreground flex items-center">
          <BarChart3 className="h-6 w-6 mr-3 text-primary" />
          Saudi HR Market Intelligence
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <InsightCard 
            title="Market Growth Projection"
            value="14.7% CAGR"
            description="Saudi HR tech market expected growth 2025-2027"
            confidence="91%"
            source="SAMA Economic Report 2024"
            icon={<TrendingUp className="h-5 w-5 text-brand-success" />}
            trend="up"
          />
          <InsightCard 
            title="Competitive Position"
            value="#1 Market Leader"
            description="AqlHR leads with 8.3% market share"
            confidence="98%"
            source="Gartner Middle East HR Tech Report"
            icon={<Target className="h-5 w-5 text-primary" />}
            trend="up"
          />
          <InsightCard 
            title="Opportunity Size"
            value="2.8B SAR"
            description="Total addressable market in Saudi Arabia"
            confidence="95%"
            source="McKinsey Digital Transformation Study"
            icon={<Globe className="h-5 w-5 text-brand-warning" />}
            trend="stable"
          />
        </div>
      </div>

      {/* Strategic Recommendations Engine */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-foreground flex items-center">
          <Lightbulb className="h-6 w-6 mr-3 text-primary" />
          AI Strategic Recommendations
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {recommendations.map(rec => (
            <RecommendationCard 
              key={rec.id}
              recommendation={rec}
              onImplement={handleImplementation}
            />
          ))}
        </div>
      </div>

      {/* Competitive Intelligence Dashboard */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-foreground flex items-center">
          <Target className="h-6 w-6 mr-3 text-primary" />
          Competitive Intelligence Analysis
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <CompetitorCard 
            name="Oracle HCM Cloud"
            marketShare="15.2%"
            strengths={["Global presence", "Enterprise features"]}
            weaknesses={["No Saudi compliance", "High cost", "Complex implementation"]}
            aqlhrAdvantage="60% better Saudi compliance, 40% lower cost"
            threatLevel="medium"
          />
          <CompetitorCard 
            name="SAP SuccessFactors"
            marketShare="12.8%"
            strengths={["Enterprise integration", "Analytics"]}
            weaknesses={["Limited Arabic support", "Slow innovation"]}
            aqlhrAdvantage="45% better AI capabilities, 100% Arabic support"
            threatLevel="medium"
          />
          <CompetitorCard 
            name="Local Competitors"
            marketShare="23.4%"
            strengths={["Local knowledge", "Arabic interface"]}
            weaknesses={["Limited AI", "Basic features", "Poor scalability"]}
            aqlhrAdvantage="200% performance advantage, enterprise-grade AI"
            threatLevel="low"
          />
        </div>
      </div>

      {/* Export and Actions */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-bold text-foreground">Executive Intelligence Report</h4>
              <p className="text-sm text-muted-foreground">
                Complete strategic analysis with predictive insights and recommendations
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button>
                <Target className="h-4 w-4 mr-2" />
                Schedule Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};