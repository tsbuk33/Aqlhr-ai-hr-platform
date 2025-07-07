import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const FoodHousingTransport = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Food, Housing & Transport Monitoring</h1>
        <p className="text-muted-foreground">Employee welfare facilities management</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Housing Units</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">487</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Transport Routes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">23</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Meal Quality</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">4.2/5</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Satisfaction Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">91.3%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FoodHousingTransport;