import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MessageCircle, Users, Clock, TrendingUp, Bot, CheckCircle } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguageCompat";
import EduBox from "@/components/EduBox";

const OnboardingAssistant = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            AI Onboarding Assistant
          </h1>
          <p className="text-muted-foreground mt-2">
            Interactive Q&A guide powered by GPT for seamless new hire experience
          </p>
        </div>
        <EduBox
          title="AI Onboarding Assistant"
          description="ChatGPT-powered interactive guide that personalizes the onboarding experience for new hires with real-time Q&A support"
          howToUse="New employees interact with the AI assistant during their first days to get instant answers and guidance"
          linkedFeatures={['Employee Onboarding', 'Q&A System', 'Progress Tracking']}
          userLevel="hr_admin"
        >
          <Bot className="h-5 w-5" />
        </EduBox>
      </div>

      {/* AI Tool Configuration */}
      <Card className="border-brand-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-brand-primary" />
            ChatGPT Configuration
          </CardTitle>
          <CardDescription>AI parameters and performance metrics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Model</div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">gpt-4-turbo</Badge>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Temperature</div>
              <Badge variant="outline" className="bg-green-50 text-green-700">0.3</Badge>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Max Tokens</div>
              <Badge variant="outline" className="bg-purple-50 text-purple-700">512</Badge>
            </div>
          </div>
          <div className="pt-4 border-t">
            <div className="text-sm font-medium text-muted-foreground mb-2">Prompt Template</div>
            <div className="p-3 bg-muted rounded-md text-sm font-mono">
              "You are a helpful HR onboarding assistant. Guide new employee &#123;&#123; employee_name &#125;&#125; through their first day at &#123;&#123; company_name &#125;&#125;. Answer questions about policies, procedures, and next steps."
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Session Completions</CardTitle>
            <CheckCircle className="h-4 w-4 text-brand-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-success">89.7%</div>
            <p className="text-xs text-muted-foreground">+5.2% from last month</p>
            <Progress value={89.7} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Interaction Time</CardTitle>
            <Clock className="h-4 w-4 text-brand-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-accent">12.4 min</div>
            <p className="text-xs text-muted-foreground">Target: &lt;15 min</p>
            <Progress value={83} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-brand-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-warning">4.8/5</div>
            <p className="text-xs text-muted-foreground">+0.3 from last month</p>
            <Progress value={96} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-brand-primary" />
            Active Onboarding Sessions
          </CardTitle>
          <CardDescription>Real-time new hire interactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: "Ahmed Al-Rashid", department: "Engineering", progress: 75, timeSpent: "45 min", questionsAsked: 12 },
              { name: "Sarah Johnson", department: "Marketing", progress: 60, timeSpent: "32 min", questionsAsked: 8 },
              { name: "Mohammed Hassan", department: "Finance", progress: 90, timeSpent: "58 min", questionsAsked: 15 },
            ].map((session, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold">
                    {session.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-medium">{session.name}</div>
                    <div className="text-sm text-muted-foreground">{session.department}</div>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <div className="font-medium">{session.progress}%</div>
                    <div className="text-muted-foreground">Progress</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{session.timeSpent}</div>
                    <div className="text-muted-foreground">Time Spent</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{session.questionsAsked}</div>
                    <div className="text-muted-foreground">Questions</div>
                  </div>
                  <Button size="sm" variant="outline">
                    View Chat
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingAssistant;