import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, RefreshCw, Database, Zap, CheckCircle, Clock, Network, Activity, Shield } from "lucide-react";

const AISyncEngine = () => {
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          AI Sync Engine
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Intelligent real-time data synchronization that keeps all 106 HR modules perfectly aligned and updated
        </p>
      </div>

      {/* Sync Process Visualization */}
      <Card className="p-8">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <RefreshCw className="h-6 w-6 text-brand-primary" />
            How SanadHR Maintains Real-Time Data Sync
          </CardTitle>
          <CardDescription>Advanced distributed architecture ensures instant data consistency across all modules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                <Activity className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg">Event Detection</h3>
              <p className="text-sm text-muted-foreground">
                AI monitors all data changes in real-time across every module and system
              </p>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Microsecond Detection
              </Badge>
            </div>

            <ArrowRight className="hidden md:block h-6 w-6 text-muted-foreground self-center justify-self-center" />

            {/* Step 2 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto">
                <Network className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg">Smart Routing</h3>
              <p className="text-sm text-muted-foreground">
                Intelligent routing determines which modules need updates and prioritizes critical paths
              </p>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                AI-Prioritized
              </Badge>
            </div>

            <ArrowRight className="hidden md:block h-6 w-6 text-muted-foreground self-center justify-self-center" />

            {/* Step 3 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto">
                <Database className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg">Atomic Updates</h3>
              <p className="text-sm text-muted-foreground">
                All related data is updated simultaneously ensuring perfect consistency
              </p>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                99.97% Success
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-primary opacity-10 rounded-full -translate-y-12 translate-x-12"></div>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-muted-foreground">Daily Sync Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-brand-primary">15,678</div>
              <div className="flex items-center gap-2 text-sm">
                <Activity className="h-4 w-4 text-brand-success" />
                <span className="text-brand-success">Real-time processing</span>
              </div>
              <p className="text-xs text-muted-foreground">Peak: 2,341 events/hour</p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-secondary opacity-10 rounded-full -translate-y-12 translate-x-12"></div>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-muted-foreground">Sync Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-4xl font-bold text-brand-success">99.97%</div>
              <Progress value={99.97} className="h-2" />
              <p className="text-xs text-muted-foreground">24/7 monitoring</p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-accent opacity-10 rounded-full -translate-y-12 translate-x-12"></div>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-muted-foreground">Average Latency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-brand-accent">0.23s</div>
              <div className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4 text-brand-accent" />
                <span className="text-muted-foreground">Lightning fast</span>
              </div>
              <p className="text-xs text-muted-foreground">Target: &lt;0.5s</p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-hero opacity-10 rounded-full -translate-y-12 translate-x-12"></div>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-muted-foreground">Connected Modules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-brand-warning">106</div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-brand-success" />
                <span className="text-brand-success">All systems online</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Sync Analysis */}
      <Tabs defaultValue="status" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="status">Sync Status</TabsTrigger>
          <TabsTrigger value="architecture">Architecture</TabsTrigger>
          <TabsTrigger value="monitoring">Real-time Monitoring</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="status" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Module Synchronization Status</CardTitle>
              <CardDescription>Real-time status of all connected HR modules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Core HR Modules</h4>
                  {[
                    { name: "Employee Data", status: "Synced", latency: "0.12s", events: "1,234" },
                    { name: "Payroll Processing", status: "Synced", latency: "0.18s", events: "892" },
                    { name: "Performance Management", status: "Synced", latency: "0.21s", events: "567" },
                    { name: "Time & Attendance", status: "Synced", latency: "0.09s", events: "2,341" }
                  ].map((module, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-brand-success rounded-full"></div>
                        <span className="font-medium">{module.name}</span>
                      </div>
                      <div className="text-right text-sm">
                        <div className="text-muted-foreground">{module.latency}</div>
                        <div className="text-xs text-muted-foreground">{module.events} events/day</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Government Integrations</h4>
                  {[
                    { name: "GOSI Integration", status: "Synced", latency: "0.31s", events: "234" },
                    { name: "Qiwa Platform", status: "Synced", latency: "0.28s", events: "156" },
                    { name: "Mudad Integration", status: "Synced", latency: "0.25s", events: "89" },
                    { name: "ZATCA Compliance", status: "Synced", latency: "0.33s", events: "67" }
                  ].map((module, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-brand-success rounded-full"></div>
                        <span className="font-medium">{module.name}</span>
                      </div>
                      <div className="text-right text-sm">
                        <div className="text-muted-foreground">{module.latency}</div>
                        <div className="text-xs text-muted-foreground">{module.events} events/day</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="architecture" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sync Engine Architecture</CardTitle>
              <CardDescription>How our distributed system maintains data consistency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Event-Driven Architecture
                  </h4>
                  <p className="text-sm text-blue-700">Every data change triggers events that are instantly propagated to relevant modules</p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2 flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Distributed Database Sync
                  </h4>
                  <p className="text-sm text-green-700">Advanced replication ensures data consistency across multiple database instances</p>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Fault Tolerance & Recovery
                  </h4>
                  <p className="text-sm text-purple-700">Automatic retry mechanisms and rollback procedures ensure data integrity</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Real-time Monitoring Dashboard</CardTitle>
              <CardDescription>Live sync performance metrics and health monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-brand-success">100%</div>
                  <p className="text-sm text-muted-foreground">System Uptime (30 days)</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-brand-primary">0.23s</div>
                  <p className="text-sm text-muted-foreground">Average Sync Latency</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-brand-accent">3</div>
                  <p className="text-sm text-muted-foreground">Failed Syncs (Today)</p>
                </div>
              </div>
              <div className="mt-6">
                <h4 className="font-medium mb-4">Recent Sync Activity</h4>
                <div className="space-y-3">
                  {[
                    { time: "14:23:12", module: "Employee Master Data", event: "Profile Update", status: "Success" },
                    { time: "14:23:08", module: "Payroll System", event: "Salary Adjustment", status: "Success" },
                    { time: "14:22:56", module: "Time Attendance", event: "Clock In/Out", status: "Success" },
                    { time: "14:22:45", module: "GOSI Integration", event: "Contribution Update", status: "Retry" }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-mono">{activity.time}</span>
                        <span className="text-sm">{activity.module}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{activity.event}</span>
                        <Badge variant={activity.status === "Success" ? "default" : "secondary"}>
                          {activity.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
              <CardDescription>Sync engine performance trends and optimization insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Performance Trends</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Average Latency</span>
                      <span className="text-sm font-medium text-brand-success">↓ 12% this month</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Success Rate</span>
                      <span className="text-sm font-medium text-brand-success">↑ 0.3% improvement</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Throughput</span>
                      <span className="text-sm font-medium text-brand-primary">↑ 23% increase</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Optimization Insights</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 border-l-4 border-blue-400">
                      <p className="text-sm text-blue-800">Database connection pooling reduced latency by 18%</p>
                    </div>
                    <div className="p-3 bg-green-50 border-l-4 border-green-400">
                      <p className="text-sm text-green-800">AI-powered load balancing improved throughput by 31%</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Control Center */}
      <Card>
        <CardHeader>
          <CardTitle>Sync Engine Control Center</CardTitle>
          <CardDescription>Monitor and manage real-time data synchronization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button className="bg-gradient-primary hover:opacity-90">
              <RefreshCw className="h-4 w-4 mr-2" />
              Force Full Sync
            </Button>
            <Button variant="outline">
              <Activity className="h-4 w-4 mr-2" />
              View Sync Logs
            </Button>
            <Button variant="outline">
              <Shield className="h-4 w-4 mr-2" />
              Run Health Check
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AISyncEngine;