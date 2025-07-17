import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Crown,
  Brain,
  Network,
  Target,
  TrendingUp,
  Shield,
  Zap,
  Globe,
  Users,
  BarChart3,
  Settings,
  AlertTriangle
} from 'lucide-react';
import MasterIntelligenceDashboard from '@/components/executive/MasterIntelligenceDashboard';
import CrossModuleIntelligence from '@/components/executive/CrossModuleIntelligence';
import StrategicDecisionSupport from '@/components/executive/StrategicDecisionSupport';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';

const ExecutiveCenter: React.FC = () => {
  const { isArabic } = useSimpleLanguage();
  const [activeModule, setActiveModule] = useState('intelligence');

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Executive Header */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20 p-8">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground flex items-center">
                <Crown className="h-10 w-10 mr-4 text-primary" />
                AqlHR Executive Intelligence Center
              </h1>
              <p className="text-xl text-muted-foreground mt-2">
                The Ultimate HR Operating System - Orchestrating 105+ Modules with AI Excellence
              </p>
            </div>
            <div className="text-right space-y-2">
              <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                <Globe className="h-3 w-3 mr-1" />
                Global Enterprise Ready
              </Badge>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                <Brain className="h-3 w-3 mr-1" />
                26 AI Capabilities Active
              </Badge>
              <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">
                <Shield className="h-3 w-3 mr-1" />
                22 Gov Integrations Live
              </Badge>
            </div>
          </div>
          
          {/* Strategic Capabilities Overview */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
            <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <div className="text-2xl font-bold text-primary">105+</div>
              <div className="text-sm text-muted-foreground">Integrated Modules</div>
            </div>
            <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <div className="text-2xl font-bold text-success">99.9%</div>
              <div className="text-sm text-muted-foreground">System Uptime</div>
            </div>
            <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <div className="text-2xl font-bold text-warning">Real-Time</div>
              <div className="text-sm text-muted-foreground">Data Processing</div>
            </div>
            <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <div className="text-2xl font-bold text-accent">Enterprise</div>
              <div className="text-sm text-muted-foreground">Scale Ready</div>
            </div>
            <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <div className="text-2xl font-bold text-primary">Saudi</div>
              <div className="text-sm text-muted-foreground">Market Leader</div>
            </div>
          </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-primary rounded-full transform -translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-accent rounded-full transform translate-x-20 translate-y-20"></div>
          <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-warning rounded-full transform -translate-x-12 -translate-y-12"></div>
        </div>
      </div>

      {/* Executive Navigation */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button
              variant={activeModule === 'intelligence' ? 'default' : 'outline'}
              onClick={() => setActiveModule('intelligence')}
              className="h-auto p-4 flex flex-col items-center space-y-2"
            >
              <Brain className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Master Intelligence</div>
                <div className="text-xs text-muted-foreground">Strategic Overview</div>
              </div>
            </Button>

            <Button
              variant={activeModule === 'correlation' ? 'default' : 'outline'}
              onClick={() => setActiveModule('correlation')}
              className="h-auto p-4 flex flex-col items-center space-y-2"
            >
              <Network className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Cross-Module Intelligence</div>
                <div className="text-xs text-muted-foreground">AI Correlations</div>
              </div>
            </Button>

            <Button
              variant={activeModule === 'decisions' ? 'default' : 'outline'}
              onClick={() => setActiveModule('decisions')}
              className="h-auto p-4 flex flex-col items-center space-y-2"
            >
              <Target className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Strategic Decisions</div>
                <div className="text-xs text-muted-foreground">Scenario Planning</div>
              </div>
            </Button>

            <Button
              variant={activeModule === 'insights' ? 'default' : 'outline'}
              onClick={() => setActiveModule('insights')}
              className="h-auto p-4 flex flex-col items-center space-y-2"
            >
              <TrendingUp className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Predictive Insights</div>
                <div className="text-xs text-muted-foreground">AI Forecasting</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Strategic Alert Banner */}
      <Card className="border-warning/20 bg-gradient-to-r from-warning/10 to-warning/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <div>
                <div className="font-medium text-warning">Strategic Opportunity Detected</div>
                <div className="text-sm text-muted-foreground">
                  AI analysis suggests implementing advanced workforce planning could increase ROI by 340%
                </div>
              </div>
            </div>
            <Button size="sm" variant="outline" className="border-warning/20 text-warning hover:bg-warning/10">
              View Recommendation
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Executive Interface */}
      <div className="space-y-6">
        {activeModule === 'intelligence' && <MasterIntelligenceDashboard />}
        {activeModule === 'correlation' && <CrossModuleIntelligence />}
        {activeModule === 'decisions' && <StrategicDecisionSupport />}
        {activeModule === 'insights' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Advanced Predictive Insights
              </CardTitle>
              <CardDescription>
                AI-powered strategic forecasting across all operational dimensions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Brain className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  Advanced Predictive Analytics Module
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  This module will provide deep AI-powered insights including workforce trend predictions, 
                  market analysis, competitive intelligence, and strategic recommendations.
                </p>
                <Button className="mt-4" variant="outline">
                  <Zap className="h-4 w-4 mr-2" />
                  Coming Soon - Advanced Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Performance Summary Footer */}
      <Card className="bg-gradient-to-r from-accent/10 to-primary/10 border-accent/20">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-bold text-foreground">
              AqlHR: The World's Most Advanced HR Operating System
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-primary">105+</div>
                <div className="text-muted-foreground">Modules</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-success">26</div>
                <div className="text-muted-foreground">AI Capabilities</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-warning">22</div>
                <div className="text-muted-foreground">Gov Integrations</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-accent">15+</div>
                <div className="text-muted-foreground">Real-Time Features</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-primary">45+</div>
                <div className="text-muted-foreground">Database Tables</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-success">Enterprise</div>
                <div className="text-muted-foreground">Scale</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Transforming Saudi Arabia's workforce with AI-powered intelligence that surpasses global leaders. 
              Ready to impress Oracle, SAP, and establish market dominance.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExecutiveCenter;