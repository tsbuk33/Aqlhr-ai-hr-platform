import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Zap, Star, PlayCircle, Brain, FileText } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguageCompat";
import EduBox from "@/components/EduBox";

const ContentGenerator = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Learning Content Generator
          </h1>
          <p className="text-muted-foreground mt-2">
            Auto-generate micro-learning modules based on identified skill gaps
          </p>
        </div>
        <EduBox
          title="Learning Content Generator"
          description="AI-powered tool that creates personalized micro-learning content tailored to specific skill gaps and learning objectives"
          howToUse="Select skill gaps from analysis reports to automatically generate targeted learning modules"
          linkedFeatures={['Skills Gap Analysis', 'Learning Paths', 'Content Library']}
          userLevel="hr_admin"
        >
          <BookOpen className="h-5 w-5" />
        </EduBox>
      </div>

      {/* AI Tool Configuration */}
      <Card className="border-brand-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-brand-primary" />
            ChatGPT Configuration
          </CardTitle>
          <CardDescription>AI parameters for content generation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Model</div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">gpt-4-turbo</Badge>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Temperature</div>
              <Badge variant="outline" className="bg-green-50 text-green-700">0.7</Badge>
            </div>
          </div>
          <div className="pt-4 border-t">
            <div className="text-sm font-medium text-muted-foreground mb-2">Prompt Template</div>
            <div className="p-3 bg-muted rounded-md text-sm font-mono">
              "Create a micro-learning module for &#123;&#123; skill_topic &#125;&#125; targeting &#123;&#123; proficiency_level &#125;&#125; learners. Include: objectives, key concepts, practical exercises, and assessment questions."
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Quality Score</CardTitle>
            <Star className="h-4 w-4 text-brand-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-warning">4.6/5</div>
            <p className="text-xs text-muted-foreground">Average learner rating</p>
            <Progress value={92} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Usage Rate</CardTitle>
            <PlayCircle className="h-4 w-4 text-brand-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-success">84.3%</div>
            <p className="text-xs text-muted-foreground">Modules completed by learners</p>
            <Progress value={84.3} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Recently Generated Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-brand-primary" />
            Recently Generated Content
          </CardTitle>
          <CardDescription>Latest AI-created learning modules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                title: "Data Analytics Fundamentals",
                topic: "Data Science",
                duration: "15 min",
                level: "Beginner",
                modules: 5,
                enrollments: 23,
                rating: 4.8,
                status: "Published"
              },
              {
                title: "Digital Marketing Metrics",
                topic: "Marketing",
                duration: "12 min", 
                level: "Intermediate",
                modules: 4,
                enrollments: 18,
                rating: 4.5,
                status: "Published"
              },
              {
                title: "AWS Cloud Basics",
                topic: "Cloud Computing",
                duration: "20 min",
                level: "Beginner", 
                modules: 6,
                enrollments: 31,
                rating: 4.7,
                status: "Published"
              },
              {
                title: "Machine Learning Introduction",
                topic: "AI/ML",
                duration: "18 min",
                level: "Beginner",
                modules: 5,
                enrollments: 45,
                rating: 4.9,
                status: "Under Review"
              },
            ].map((content, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="font-medium text-foreground">{content.title}</div>
                    <Badge variant="outline" className="text-xs">{content.level}</Badge>
                    <Badge 
                      variant={content.status === 'Published' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {content.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <span>{content.topic}</span>
                    <span>{content.duration}</span>
                    <span>{content.modules} modules</span>
                    <span>{content.enrollments} enrolled</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current text-brand-warning" />
                      <span>{content.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    Preview
                  </Button>
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content Generation Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-brand-accent" />
              Quick Generate
            </CardTitle>
            <CardDescription>Create new learning content instantly</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Skill Topic</label>
                <select className="w-full mt-1 p-2 border rounded-md">
                  <option value="">Select from skill gaps...</option>
                  <option value="data-analytics">Data Analytics</option>
                  <option value="digital-marketing">Digital Marketing</option>
                  <option value="cloud-computing">Cloud Computing</option>
                  <option value="ai-ml">AI/Machine Learning</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Target Level</label>
                <select className="w-full mt-1 p-2 border rounded-md">
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Module Duration</label>
                <select className="w-full mt-1 p-2 border rounded-md">
                  <option value="5">5 minutes</option>
                  <option value="10">10 minutes</option>
                  <option value="15">15 minutes</option>
                  <option value="20">20 minutes</option>
                </select>
              </div>
              <Button className="w-full" size="lg">
                <Zap className="h-4 w-4 mr-2" />
                Generate Content
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-brand-secondary" />
              Content Library Stats
            </CardTitle>
            <CardDescription>Overview of generated learning content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-brand-primary">127</div>
                <div className="text-sm text-muted-foreground">Total Modules</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-brand-success">89.4%</div>
                <div className="text-sm text-muted-foreground">Completion Rate</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-brand-accent">1,847</div>
                <div className="text-sm text-muted-foreground">Total Learners</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-brand-warning">4.6</div>
                <div className="text-sm text-muted-foreground">Avg Rating</div>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <div className="text-sm font-medium">Popular Content Topics</div>
              {[
                { topic: "Data Analytics", modules: 23, popularity: 92 },
                { topic: "Digital Marketing", modules: 18, popularity: 78 },
                { topic: "Cloud Computing", modules: 31, popularity: 85 },
                { topic: "AI/ML", modules: 19, popularity: 96 }
              ].map((topic, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>{topic.topic}</span>
                      <span className="text-muted-foreground">{topic.modules} modules</span>
                    </div>
                    <Progress value={topic.popularity} className="h-1 mt-1" />
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

export default ContentGenerator;