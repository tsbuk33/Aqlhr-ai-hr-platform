import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Calendar, Download, FileText, Users, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FeatureGate, LockedButton } from '@/components/plans/FeatureGate';
import { useComplianceAutopilot } from '@/hooks/useComplianceAutopilot';
import { useComplianceLetters } from '@/hooks/useComplianceLetters';

export default function ComplianceAutopilot() {
  return (
    <FeatureGate 
      feature="compliance_autopilot" 
      upsellTitle="Compliance Autopilot - Premium Feature"
      upsellDescription="Automated Nitaqat & Iqama monitoring with proactive task creation"
    >
      <ComplianceAutopilotContent />
    </FeatureGate>
  );
}

function ComplianceAutopilotContent() {
  const { toast } = useToast();
  const { 
    complianceData, 
    upcomingExpiries, 
    nitaqatStatus, 
    loading, 
    runAutopilot, 
    downloadLetter 
  } = useComplianceAutopilot();
  
  const { generateLetterPDF } = useComplianceLetters();

  const getNitaqatColor = (status: string) => {
    const colors = {
      'platinum': 'bg-gray-100 text-gray-800',
      'green': 'bg-green-100 text-green-800',
      'yellow': 'bg-yellow-100 text-yellow-800',
      'red': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'urgent': 'bg-red-100 text-red-800',
      'high': 'bg-orange-100 text-orange-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'low': 'bg-blue-100 text-blue-800'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleRunAutopilot = async () => {
    try {
      await runAutopilot();
      toast({
        title: "Compliance Scan Complete",
        description: "Autopilot has analyzed compliance status and created necessary tasks.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to run compliance autopilot. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Compliance Autopilot</h1>
          <p className="text-muted-foreground">
            Automated Nitaqat & Iqama monitoring with proactive task creation
          </p>
        </div>
        <LockedButton
          feature="compliance_autopilot"
          onClick={handleRunAutopilot} 
          className="gap-2"
        >
          <TrendingUp className="h-4 w-4" />
          Run Scan Now
        </LockedButton>
      </div>

      {/* Status Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nitaqat Status</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge className={getNitaqatColor(nitaqatStatus?.color || 'green')}>
                {nitaqatStatus?.color?.toUpperCase() || 'GREEN'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Current: {nitaqatStatus?.current_rate?.toFixed(1) || '0.0'}% | 
              Target: {nitaqatStatus?.target_rate || 60}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent Expiries</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {upcomingExpiries?.urgent || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Next 7 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expiries</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {upcomingExpiries?.total || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Next 90 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Views */}
      <Tabs defaultValue="expiries" className="w-full">
        <TabsList>
          <TabsTrigger value="expiries">Upcoming Expiries</TabsTrigger>
          <TabsTrigger value="tasks">Auto-Generated Tasks</TabsTrigger>
          <TabsTrigger value="history">Action History</TabsTrigger>
        </TabsList>

        <TabsContent value="expiries">
          <Card>
            <CardHeader>
              <CardTitle>Next 90 Days - Iqama Expiries</CardTitle>
              <CardDescription>
                Employees requiring Iqama renewal in the next 90 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              {complianceData?.upcomingExpiries?.length > 0 ? (
                <div className="space-y-4">
                  {complianceData.upcomingExpiries.map((employee: any) => (
                    <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{employee.full_name_en}</div>
                        <div className="text-sm text-muted-foreground">
                          ID: {employee.employee_no} | Expires: {employee.iqama_expiry}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(employee.priority)}>
                          {employee.days_until_expiry} days
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadLetter(employee)}
                          className="gap-1 mr-1"
                        >
                          <Download className="h-3 w-3" />
                          EN
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => generateLetterPDF(employee, 'ar')}
                          className="gap-1"
                        >
                          <Download className="h-3 w-3" />
                          AR
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No upcoming expiries in the next 90 days
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Auto-Generated Tasks</CardTitle>
              <CardDescription>
                Tasks created by the compliance autopilot system
              </CardDescription>
            </CardHeader>
            <CardContent>
              {complianceData?.autoTasks?.length > 0 ? (
                <div className="space-y-4">
                  {complianceData.autoTasks.map((task: any) => (
                    <div key={task.id} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{task.title}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {task.description}
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                          Created: {new Date(task.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <Badge variant={task.status === 'completed' ? 'default' : 'secondary'}>
                          {task.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No auto-generated tasks yet
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Autopilot Action History</CardTitle>
              <CardDescription>
                Log of all automated compliance actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {complianceData?.actionHistory?.length > 0 ? (
                <div className="space-y-4">
                  {complianceData.actionHistory.map((action: any) => (
                    <div key={action.id} className="flex items-start gap-3 p-4 border rounded-lg">
                      <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <div className="font-medium">{action.action_description}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(action.created_at).toLocaleString()}
                        </div>
                      </div>
                      <Badge variant="outline">
                        {action.action_type.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No action history available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}