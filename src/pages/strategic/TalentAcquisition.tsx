import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const TalentAcquisition = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Talent Acquisition</h1>
        <p className="text-muted-foreground">Strategic hiring and talent sourcing</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Open Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">45</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Time to Fill</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">21 days</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cost per Hire</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">SAR 12,500</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quality Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">8.4/10</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TalentAcquisition;