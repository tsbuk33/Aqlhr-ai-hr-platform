import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const DocumentIntelligence = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Document Intelligence</h1>
        <p className="text-muted-foreground">OCR/NLP processing for document automation</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Documents Processed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">8,943</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Accuracy Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">96.8%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Processing Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">1.2s</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Languages Supported</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">15</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DocumentIntelligence;