import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Brain, Target, TrendingUp, Users, Star, Award, Lightbulb, BarChart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const SmartRecommendations = () => {
  const { t } = useLanguage();
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          {t('ai.smart_recommendations')}
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('ai.smart_recommendations_desc')}
        </p>
      </div>

      {/* AI Process Explanation */}
      <Card className="p-8">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Brain className="h-6 w-6 text-brand-primary" />
            {t('ai.how_sanadhr_creates')}
          </CardTitle>
          <CardDescription>{t('ai.advanced_ml_desc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                <BarChart className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg">Data Collection</h3>
              <p className="text-sm text-muted-foreground">
                AI analyzes performance metrics, skills, experience, and behavioral patterns
              </p>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                50+ Data Points
              </Badge>
            </div>

            <ArrowRight className="hidden md:block h-6 w-6 text-muted-foreground self-center justify-self-center" />

            {/* Step 2 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg">AI Matching</h3>
              <p className="text-sm text-muted-foreground">
                Machine learning models calculate compatibility scores across multiple dimensions
              </p>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Neural Networks
              </Badge>
            </div>

            <ArrowRight className="hidden md:block h-6 w-6 text-muted-foreground self-center justify-self-center" />

            {/* Step 3 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg">Smart Ranking</h3>
              <p className="text-sm text-muted-foreground">
                Recommendations are ranked by success probability and strategic alignment
              </p>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                87.6% Accuracy
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-primary opacity-10 rounded-full -translate-y-12 translate-x-12"></div>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-muted-foreground">Total Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-brand-primary">342</div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-brand-success" />
                <span className="text-brand-success">+47 this month</span>
              </div>
              <p className="text-xs text-muted-foreground">Across 12 departments</p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-secondary opacity-10 rounded-full -translate-y-12 translate-x-12"></div>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-muted-foreground">Prediction Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-4xl font-bold text-brand-success">87.6%</div>
              <Progress value={87.6} className="h-2" />
              <p className="text-xs text-muted-foreground">Based on historical outcomes</p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-accent opacity-10 rounded-full -translate-y-12 translate-x-12"></div>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-muted-foreground">Implemented Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-brand-accent">289</div>
              <div className="flex items-center gap-2 text-sm">
                <Award className="h-4 w-4 text-brand-accent" />
                <span className="text-muted-foreground">84% acceptance rate</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-hero opacity-10 rounded-full -translate-y-12 translate-x-12"></div>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-muted-foreground">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-brand-warning">94.1%</div>
              <div className="flex items-center gap-2 text-sm">
                <Star className="h-4 w-4 text-brand-warning" />
                <span className="text-muted-foreground">Post-implementation performance</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis Tabs */}
      <Tabs defaultValue="recommendations" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="recommendations">Current Recommendations</TabsTrigger>
          <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
          <TabsTrigger value="factors">Decision Factors</TabsTrigger>
          <TabsTrigger value="outcomes">Success Tracking</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Talent Recommendations</CardTitle>
              <CardDescription>AI-generated suggestions based on real-time analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { 
                    employee: "Sarah Al-Rashid", 
                    current: "Senior Analyst", 
                    recommended: "Team Lead - Data Analytics", 
                    score: 94, 
                    reason: "Strong leadership potential, exceptional technical skills",
                    department: "Analytics"
                  },
                  { 
                    employee: "Ahmed Hassan", 
                    current: "HR Specialist", 
                    recommended: "HR Business Partner", 
                    score: 89, 
                    reason: "Deep business understanding, excellent stakeholder management",
                    department: "Human Resources"
                  },
                  { 
                    employee: "Nora Abdulla", 
                    current: "Finance Associate", 
                    recommended: "Transfer to Strategic Planning", 
                    score: 87, 
                    reason: "Analytical mindset, strategic thinking, cross-functional experience",
                    department: "Finance → Strategy"
                  }
                ].map((rec, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-lg">{rec.employee}</h4>
                        <p className="text-sm text-muted-foreground">{rec.current} → {rec.recommended}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-brand-success">{rec.score}%</div>
                        <p className="text-xs text-muted-foreground">Match Score</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground italic">"{rec.reason}"</p>
                      <Badge variant="outline">{rec.department}</Badge>
                    </div>
                    <Progress value={rec.score} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Analysis Framework</CardTitle>
              <CardDescription>How our machine learning models evaluate talent potential</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-lg mb-4">Performance Metrics Analysis</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Historical Performance</span>
                      <span className="text-sm font-medium">25% weight</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Skill Assessments</span>
                      <span className="text-sm font-medium">20% weight</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Growth Trajectory</span>
                      <span className="text-sm font-medium">15% weight</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Peer Feedback</span>
                      <span className="text-sm font-medium">15% weight</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium text-lg mb-4">Behavioral Analysis</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Leadership Indicators</span>
                      <span className="text-sm font-medium">10% weight</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Adaptability Score</span>
                      <span className="text-sm font-medium">8% weight</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Cultural Fit</span>
                      <span className="text-sm font-medium">4% weight</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Career Aspirations</span>
                      <span className="text-sm font-medium">3% weight</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="factors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Key Decision Factors</CardTitle>
              <CardDescription>Critical elements that influence recommendation accuracy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Role Requirements Matching
                  </h4>
                  <p className="text-sm text-blue-700">AI compares candidate skills against detailed job requirements and success profiles</p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Performance Trajectory Analysis  
                  </h4>
                  <p className="text-sm text-green-700">Historical performance trends predict future success probability in new roles</p>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Team Dynamics & Cultural Fit
                  </h4>
                  <p className="text-sm text-purple-700">Social network analysis ensures recommendations consider team chemistry and culture</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outcomes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Success Tracking & Outcomes</CardTitle>
              <CardDescription>How we measure and improve recommendation effectiveness</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-brand-success">94.1%</div>
                  <p className="text-sm text-muted-foreground">6-month success rate</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-brand-primary">23%</div>
                  <p className="text-sm text-muted-foreground">Performance improvement</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-brand-accent">156</div>
                  <p className="text-sm text-muted-foreground">Successful placements</p>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                <h4 className="font-medium">Recent Success Stories</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 border-l-4 border-green-400">
                    <p className="text-sm text-green-800">Promoted analyst achieved 34% better performance in new role within 3 months</p>
                  </div>
                  <div className="p-3 bg-blue-50 border-l-4 border-blue-400">
                    <p className="text-sm text-blue-800">Cross-department transfer resulted in 28% productivity increase for receiving team</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Center */}
      <Card>
        <CardHeader>
          <CardTitle>Recommendation Management</CardTitle>
          <CardDescription>Review and act on AI-generated talent recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button className="bg-gradient-primary hover:opacity-90">
              <Lightbulb className="h-4 w-4 mr-2" />
              Review New Recommendations
            </Button>
            <Button variant="outline">
              <Target className="h-4 w-4 mr-2" />
              Set Recommendation Criteria
            </Button>
            <Button variant="outline">
              <BarChart className="h-4 w-4 mr-2" />
              View Success Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartRecommendations;