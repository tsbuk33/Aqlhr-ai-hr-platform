import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SaudizationOptimizer from "@/components/saudization/SaudizationOptimizer";
import Vision2030Dashboard from "@/components/saudization/Vision2030Dashboard";
import { Target, Eye, TrendingUp } from "lucide-react";

export default function SaudizationOptimizationTest() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Phase 7: Saudization Optimization System
          </h1>
          <p className="text-xl text-muted-foreground">
            Strategic Workforce Intelligence & Vision 2030 Alignment
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Real-time Analytics</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">✓ Active</div>
              <p className="text-xs text-muted-foreground">
                Live monitoring & predictions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Recommendations</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">✓ Active</div>
              <p className="text-xs text-muted-foreground">
                Strategic hiring insights
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vision 2030 Tracking</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">✓ Active</div>
              <p className="text-xs text-muted-foreground">
                National goals alignment
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="optimizer" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="optimizer">Saudization Optimizer</TabsTrigger>
            <TabsTrigger value="vision2030">Vision 2030 Dashboard</TabsTrigger>
          </TabsList>

          <TabsContent value="optimizer" className="space-y-4">
            <SaudizationOptimizer />
          </TabsContent>

          <TabsContent value="vision2030" className="space-y-4">
            <Vision2030Dashboard />
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Phase 7 Deliverables Status</CardTitle>
            <CardDescription>
              Critical deliverables for strategic workforce intelligence
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>✅ Real-time Saudization analytics</span>
                  <span className="text-green-600 font-semibold">100%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>✅ AI hiring recommendations</span>
                  <span className="text-green-600 font-semibold">100%</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>✅ Vision 2030 alignment tracking</span>
                  <span className="text-green-600 font-semibold">100%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>✅ Strategic planning capabilities</span>
                  <span className="text-green-600 font-semibold">100%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}