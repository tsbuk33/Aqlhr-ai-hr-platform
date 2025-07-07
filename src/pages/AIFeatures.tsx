import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Zap, TrendingUp, FileText, MessageSquare, Settings } from "lucide-react";
import AISyncDashboard from "@/components/AISyncDashboard";
import AIRecommendationCard from "@/components/AIRecommendationCard";
import { useAIRecommendations } from "@/hooks/useAIRecommendations";
import EduBox from "@/components/EduBox";

const AIFeatures = () => {
  const { recommendations, loading, generateRecommendation, updateRecommendationStatus } = useAIRecommendations();

  const handleStatusUpdate = async (id: string, status: any) => {
    try {
      await updateRecommendationStatus(id, status);
    } catch (error) {
      console.error('Failed to update recommendation status:', error);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Brain className="h-8 w-8 text-brand-primary" />
            AI Features & Automation
            <EduBox
              title="SanadHR AI Suite"
              description="Advanced AI modules that automate HR processes, provide predictive analytics, and generate intelligent recommendations"
              linkedModules={['AI Sync Engine', 'Smart Recommendations', 'Predictive Analytics', 'Document Intelligence']}
            />
          </h1>
          <p className="text-muted-foreground">Intelligent HR automation powered by advanced AI</p>
        </div>
        <Badge className="bg-brand-primary text-white px-3 py-1">
          <Zap className="h-3 w-3 mr-1" />
          5 AI Engines Active
        </Badge>
      </div>

      <Tabs defaultValue="sync-engine" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="sync-engine">Sync Engine</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="nlp">NLP</TabsTrigger>
        </TabsList>

        <TabsContent value="sync-engine">
          <AISyncDashboard />
        </TabsContent>

        <TabsContent value="recommendations">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">Smart Recommendations</h2>
                <p className="text-muted-foreground">AI-powered employee development recommendations</p>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
              </div>
            ) : recommendations.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Brain className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No recommendations yet</h3>
                  <p className="text-muted-foreground text-center">AI recommendations will appear as data is analyzed</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {recommendations.map((recommendation) => (
                  <AIRecommendationCard
                    key={recommendation.id}
                    recommendation={recommendation}
                    onStatusUpdate={handleStatusUpdate}
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Predictive Models</CardTitle>
                <CardDescription>12 active models</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-brand-primary">87.3%</div>
                <p className="text-sm text-muted-foreground">Average accuracy</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Document Intelligence</CardTitle>
              <CardDescription>AI-powered document processing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-brand-success">2,456</div>
              <p className="text-sm text-muted-foreground">Documents processed</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nlp">
          <Card>
            <CardHeader>
              <CardTitle>Arabic-English NLP</CardTitle>
              <CardDescription>Bilingual processing engine</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-brand-accent">98.2%</div>
              <p className="text-sm text-muted-foreground">Processing accuracy</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIFeatures;