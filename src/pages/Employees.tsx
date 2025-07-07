import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter } from "lucide-react";

const Employees = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Employee Master Data</h1>
          <p className="text-muted-foreground">Complete profile management with Saudi compliance</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Employee
        </Button>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          Search
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">2,847</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Contracts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-success">2,847</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Saudization Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-accent">67.2%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compliance Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">96.8%</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employee Directory</CardTitle>
          <CardDescription>Manage employee profiles and information</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">Employee table will be implemented here</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Employees;