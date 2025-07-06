import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Documents = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Document Management</h1>
        <p className="text-muted-foreground">Automated collection and verification</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Documents Processed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">15,678</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-success">98.9%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-warning">156</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Storage Used</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-accent">2.3 TB</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>ID Verification</CardTitle>
            <CardDescription>Automatic ID document processing</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">99.1% accuracy rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contract Management</CardTitle>
            <CardDescription>Digital contract storage</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">2,847 contracts active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compliance Tracking</CardTitle>
            <CardDescription>Document expiry monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Auto notifications enabled</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Documents;