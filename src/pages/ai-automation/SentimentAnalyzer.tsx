import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Heart, TrendingUp, MessageSquare, Users, Brain, BarChart3 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import EduBox from "@/components/EduBox";

const SentimentAnalyzer = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Employee Sentiment Analyzer
          </h1>
          <p className="text-muted-foreground mt-2">
            Analyze engagement survey free-text for mood trends and key topics
          </p>
        </div>
        <EduBox
          title="Employee Sentiment Analyzer"
          description="AI-powered tool that analyzes employee feedback and survey responses to detect sentiment patterns and identify key engagement topics"
          howToUse="Upload survey responses or feedback forms to get real-time sentiment analysis and topic detection"
          linkedFeatures={['Employee Engagement', 'Survey Analysis', 'Mood Tracking']}
          userLevel="hr_admin"
        >
          <Heart className="h-5 w-5" />
        </EduBox>
      </div>

      {/* AI Tool Configuration */}
      <Card className="border-brand-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-brand-accent" />
            ChatGPT Configuration
          </CardTitle>
          <CardDescription>AI parameters for sentiment analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Model</div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">gpt-3.5-turbo</Badge>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Temperature</div>
              <Badge variant="outline" className="bg-green-50 text-green-700">0.0</Badge>
            </div>
          </div>
          <div className="pt-4 border-t">
            <div className="text-sm font-medium text-muted-foreground mb-2">Prompt Template</div>
            <div className="p-3 bg-muted rounded-md text-sm font-mono">
              "Analyze sentiment and extract key topics from employee feedback: &#123;&#123; feedback_text &#125;&#125;. Provide sentiment score (positive/neutral/negative) and identify main themes and concerns."
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sentiment Change Trend</CardTitle>
            <TrendingUp className="h-4 w-4 text-brand-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-success">+12.3%</div>
            <p className="text-xs text-muted-foreground">Positive sentiment increase this quarter</p>
            <Progress value={74.3} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Topic Detection Accuracy</CardTitle>
            <MessageSquare className="h-4 w-4 text-brand-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-accent">89.7%</div>
            <p className="text-xs text-muted-foreground">Validated against manual review</p>
            <Progress value={89.7} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Current Sentiment Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-brand-primary" />
            Current Sentiment Overview
          </CardTitle>
          <CardDescription>Real-time employee mood analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto">
                <span className="text-white text-2xl font-bold">67%</span>
              </div>
              <div>
                <div className="text-lg font-semibold text-brand-success">Positive</div>
                <div className="text-sm text-muted-foreground">1,247 responses</div>
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto">
                <span className="text-white text-2xl font-bold">23%</span>
              </div>
              <div>
                <div className="text-lg font-semibold text-brand-warning">Neutral</div>
                <div className="text-sm text-muted-foreground">428 responses</div>
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-r from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto">
                <span className="text-white text-2xl font-bold">10%</span>
              </div>
              <div>
                <div className="text-lg font-semibold text-brand-danger">Negative</div>
                <div className="text-sm text-muted-foreground">186 responses</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Topics and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-brand-primary" />
              Top Discussion Topics
            </CardTitle>
            <CardDescription>Most frequently mentioned themes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { topic: "Work-Life Balance", mentions: 342, sentiment: "positive", trend: "+15%" },
                { topic: "Career Development", mentions: 298, sentiment: "mixed", trend: "+8%" },
                { topic: "Management Support", mentions: 256, sentiment: "positive", trend: "+22%" },
                { topic: "Workload Concerns", mentions: 189, sentiment: "negative", trend: "-5%" },
                { topic: "Team Collaboration", mentions: 167, sentiment: "positive", trend: "+12%" },
              ].map((topic, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{topic.topic}</span>
                      <Badge 
                        variant={topic.sentiment === 'positive' ? 'default' : topic.sentiment === 'negative' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {topic.sentiment}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{topic.mentions} mentions</span>
                      <span className={topic.trend.startsWith('+') ? 'text-brand-success' : 'text-brand-danger'}>
                        {topic.trend}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-brand-secondary" />
              Department Sentiment Breakdown
            </CardTitle>
            <CardDescription>Sentiment analysis by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { dept: "Engineering", positive: 78, neutral: 18, negative: 4, total: 156 },
                { dept: "Marketing", positive: 65, neutral: 25, negative: 10, total: 89 },
                { dept: "Sales", positive: 72, neutral: 20, negative: 8, total: 134 },
                { dept: "HR", positive: 83, neutral: 12, negative: 5, total: 67 },
                { dept: "Finance", positive: 58, neutral: 32, negative: 10, total: 78 },
              ].map((dept, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{dept.dept}</span>
                    <span className="text-sm text-muted-foreground">{dept.total} responses</span>
                  </div>
                  <div className="flex rounded-lg overflow-hidden h-3">
                    <div 
                      className="bg-brand-success" 
                      style={{ width: `${dept.positive}%` }}
                    ></div>
                    <div 
                      className="bg-brand-warning" 
                      style={{ width: `${dept.neutral}%` }}
                    ></div>
                    <div 
                      className="bg-brand-danger" 
                      style={{ width: `${dept.negative}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{dept.positive}% positive</span>
                    <span>{dept.neutral}% neutral</span>
                    <span>{dept.negative}% negative</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-brand-accent" />
            Recommended Actions
          </CardTitle>
          <CardDescription>AI-suggested improvements based on sentiment analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                action: "Address Workload Concerns in Engineering",
                priority: "High",
                impact: "Reduce negative sentiment by 15%",
                timeline: "2 weeks"
              },
              {
                action: "Expand Career Development Programs", 
                priority: "Medium",
                impact: "Increase positive sentiment by 8%",
                timeline: "1 month"
              },
              {
                action: "Improve Manager Training",
                priority: "High", 
                impact: "Better management support scores",
                timeline: "3 weeks"
              },
              {
                action: "Enhance Team Building Activities",
                priority: "Low",
                impact: "Strengthen collaboration sentiment",
                timeline: "Ongoing"
              },
            ].map((action, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium text-foreground">{action.action}</div>
                    <div className="text-sm text-muted-foreground">Timeline: {action.timeline}</div>
                  </div>
                  <Badge 
                    variant={action.priority === 'High' ? 'destructive' : action.priority === 'Medium' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {action.priority}
                  </Badge>
                </div>
                <div className="text-sm text-brand-accent">{action.impact}</div>
                <Button size="sm" variant="outline" className="w-full">
                  Create Action Plan
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SentimentAnalyzer;