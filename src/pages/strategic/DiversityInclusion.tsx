import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const DiversityInclusion = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Diversity & Inclusion</h1>
        <p className="text-muted-foreground">Building inclusive workplace culture</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Gender Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">42%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Inclusion Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">8.1/10</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Leadership Diversity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">35%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>D&I Programs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">18</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DiversityInclusion;