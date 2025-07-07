import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const BenchmarkingAnalysis = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Benchmarking Analysis</h1>
        <p className="text-muted-foreground">Market comparison and competitive analysis</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Market Position</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">Top 25%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Peer Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">156</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Data Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">2,847</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Accuracy Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">96.8%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BenchmarkingAnalysis;