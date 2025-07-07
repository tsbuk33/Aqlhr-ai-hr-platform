import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Download, Users, TrendingUp } from "lucide-react";

const WorkforcePlanning = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Strategic Workforce Planning</h1>
          <p className="text-muted-foreground">Future workforce scenario modeling and planning</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline"><Upload className="h-4 w-4 mr-2" />Upload Excel</Button>
          <Button variant="outline"><Download className="h-4 w-4 mr-2" />Export Report</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-brand-primary" />
              Current Headcount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">2,847</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-brand-success" />
              Projected Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">+15%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Skills Gaps Identified</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">89</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Planning Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">94.2%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkforcePlanning;