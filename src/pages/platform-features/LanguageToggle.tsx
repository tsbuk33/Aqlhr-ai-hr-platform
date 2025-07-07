import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const LanguageToggleFeature = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Arabic/English Language Toggle</h1>
        <p className="text-muted-foreground">RTL/LTR language switching capabilities</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Supported Languages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">2</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Translation Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">98.7%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Switch Speed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">0.2s</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>User Preference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">67% AR</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LanguageToggleFeature;