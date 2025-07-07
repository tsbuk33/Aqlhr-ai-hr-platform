import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AIFeatures = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">AI-Powered Features</h1>
        <p className="text-muted-foreground">Advanced AI capabilities for HR automation</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Market Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">95.2%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Annual Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-success">SAR 2.3M</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-accent">94.7%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documents Processed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">15,678</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>AI Salary Benchmarking</CardTitle>
            <CardDescription>Real-time market analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">95.2% Saudi market coverage</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Predictive Analytics</CardTitle>
            <CardDescription>Turnover and performance prediction</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">12.3% turnover prediction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Document Processing AI</CardTitle>
            <CardDescription>OCR and NLP capabilities</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">98.9% accuracy rate</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIFeatures;