import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Target, BookOpen, TrendingUp, Users, Brain, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguageCompat";
import EduBox from "@/components/EduBox";

const SkillsGapAnalyzer = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            AI Skills Gap Analyzer
          </h1>
          <p className="text-muted-foreground mt-2">
            Compare employee skills vs role requirements and suggest personalized training
          </p>
        </div>
        <EduBox
          title="AI Skills Gap Analyzer"
          description="Advanced AI tool that analyzes skill gaps between current employee capabilities and role requirements, providing targeted training recommendations"
          howToUse="Upload job descriptions and employee profiles to get comprehensive skills analysis and training suggestions"
          linkedFeatures={['Skills Assessment', 'Training Recommendations', 'Performance Analytics']}
          userLevel="hr_admin"
        >
          <Brain className="h-5 w-5" />
        </EduBox>
      </div>

      {/* AI Tool Configuration */}
      <Card className="border-brand-secondary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-brand-secondary" />
            ChatGPT Configuration
          </CardTitle>
          <CardDescription>AI parameters for skills gap analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Model</div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">gpt-4-turbo</Badge>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Temperature</div>
              <Badge variant="outline" className="bg-green-50 text-green-700">0.2</Badge>
            </div>
          </div>
          <div className="pt-4 border-t">
            <div className="text-sm font-medium text-muted-foreground mb-2">Prompt Template</div>
            <div className="p-3 bg-muted rounded-md text-sm font-mono">
              "Analyze skills gap for &#123;&#123; role &#125;&#125; position. Current skills: &#123;&#123; employee_skills &#125;&#125;. Required skills: &#123;&#123; job_requirements &#125;&#125;. Provide detailed gap analysis and prioritized training recommendations."
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gap Detection Accuracy</CardTitle>
            <Target className="h-4 w-4 text-brand-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-success">94.2%</div>
            <p className="text-xs text-muted-foreground">Validated against manager assessments</p>
            <Progress value={94.2} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Training Uptake Rate</CardTitle>
            <BookOpen className="h-4 w-4 text-brand-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-accent">78.5%</div>
            <p className="text-xs text-muted-foreground">Employees enrolling in suggested training</p>
            <Progress value={78.5} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Skills Gap Analysis Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-brand-warning" />
              Critical Skills Gaps
            </CardTitle>
            <CardDescription>Areas requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { skill: "Data Analytics", gap: "85%", employees: 23, priority: "High" },
                { skill: "Digital Marketing", gap: "72%", employees: 18, priority: "High" },
                { skill: "Cloud Computing", gap: "68%", employees: 31, priority: "Medium" },
                { skill: "AI/ML Basics", gap: "91%", employees: 45, priority: "High" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{item.skill}</span>
                      <Badge 
                        variant={item.priority === 'High' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {item.priority} Priority
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {item.employees} employees affected
                    </div>
                    <Progress value={parseInt(item.gap)} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-brand-primary" />
              Recommended Training Programs
            </CardTitle>
            <CardDescription>AI-suggested learning paths</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { 
                  program: "Data Analytics Bootcamp",
                  duration: "6 weeks",
                  provider: "Internal + Coursera",
                  targetEmployees: 23,
                  estimatedCost: "SAR 15,000"
                },
                {
                  program: "Digital Marketing Fundamentals",
                  duration: "4 weeks", 
                  provider: "LinkedIn Learning",
                  targetEmployees: 18,
                  estimatedCost: "SAR 8,500"
                },
                {
                  program: "AWS Cloud Practitioner",
                  duration: "8 weeks",
                  provider: "AWS Training",
                  targetEmployees: 31,
                  estimatedCost: "SAR 22,000"
                },
              ].map((program, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-foreground">{program.program}</div>
                      <div className="text-sm text-muted-foreground">{program.provider}</div>
                    </div>
                    <Button size="sm" variant="outline">Enroll</Button>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Duration</div>
                      <div className="font-medium">{program.duration}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Employees</div>
                      <div className="font-medium">{program.targetEmployees}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Cost</div>
                      <div className="font-medium">{program.estimatedCost}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SkillsGapAnalyzer;