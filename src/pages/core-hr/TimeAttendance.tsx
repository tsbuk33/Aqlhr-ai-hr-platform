import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const TimeAttendance = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Time & Attendance</h1>
        <p className="text-muted-foreground">Integrated time tracking with Absher platform</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Today's Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">98.2%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Absher Integration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">Active</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Mobile Check-ins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">2,456</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Overtime Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">234</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TimeAttendance;