import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Clock, FileText, Zap, Download, Share2, Calendar } from 'lucide-react';
import { useROI } from '@/hooks/useROI';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ROIDashboard = () => {
  const [tenantId, setTenantId] = useState<string | null>(null);
  const { summary, trend, loading, fetchROISummary, fetchROITrend, backfillSnapshots, createShareLink } = useROI();

  useEffect(() => {
    const getTenantId = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('user_roles')
          .select('company_id')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        setTenantId(data.company_id);
      } catch (err) {
        toast.error('Failed to get tenant ID');
      }
    };

    getTenantId();
  }, []);

  useEffect(() => {
    if (tenantId) {
      fetchROISummary(tenantId);
      fetchROITrend(tenantId);
    }
  }, [tenantId]);

  const handleBackfill = () => {
    if (tenantId) {
      backfillSnapshots(tenantId, 30);
    }
  };

  const handleShareDashboard = async () => {
    if (!tenantId || !summary) return;
    
    const payload = {
      summary,
      trend: trend.slice(-7), // Last 7 days
      generated_at: new Date().toISOString()
    };

    const token = await createShareLink(tenantId, 'dashboard_snapshot', payload);
    if (token) {
      const shareUrl = `${window.location.origin}/share/${token}`;
      navigator.clipboard.writeText(shareUrl);
      toast.success('Share link copied to clipboard!');
    }
  };

  const formatHours = (hours: number) => {
    return `${hours.toFixed(1)}h`;
  };

  const calculateSavings = (hours: number) => {
    const hourlyRate = 150; // SAR per hour
    return (hours * hourlyRate).toFixed(0);
  };

  if (!summary && !loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-muted-foreground mb-4">
            No ROI Data Available
          </h2>
          <p className="text-muted-foreground mb-6">
            Start using AqlHR features to see your ROI metrics here.
          </p>
          <Button onClick={handleBackfill}>
            Generate Sample Data
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">ROI Dashboard</h1>
          <p className="text-muted-foreground">
            Track the value AqlHR delivers to your organization
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleBackfill} disabled={loading}>
            <Calendar className="h-4 w-4 mr-2" />
            Backfill Data
          </Button>
          <Button onClick={handleShareDashboard} disabled={loading || !summary}>
            <Share2 className="h-4 w-4 mr-2" />
            Share Dashboard
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {summary ? formatHours(summary.hours_saved) : '---'}
            </div>
            <p className="text-xs text-muted-foreground">
              ≈ {summary ? calculateSavings(summary.hours_saved) : '---'} SAR saved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Created</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary?.tasks || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Automated workflows
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Letters Generated</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary?.letters || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Compliance documents
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Autopilot Runs</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary?.autopilot_runs || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Automated compliance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hours Saved Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Time Savings Trend</CardTitle>
            <CardDescription>
              Daily hours saved over the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="d" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: number) => [formatHours(value), 'Hours Saved']}
                />
                <Line 
                  type="monotone" 
                  dataKey="hours_saved" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Activity Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Breakdown</CardTitle>
            <CardDescription>
              Last 7 days activity summary
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trend.slice(-7)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="d" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { weekday: 'short' })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Bar dataKey="tasks" stackId="a" fill="hsl(var(--primary))" name="Tasks" />
                <Bar dataKey="letters" stackId="a" fill="hsl(var(--secondary))" name="Letters" />
                <Bar dataKey="autopilot_runs" stackId="a" fill="hsl(var(--accent))" name="Autopilot" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ROI Insights */}
      <Card>
        <CardHeader>
          <CardTitle>ROI Impact Summary</CardTitle>
          <CardDescription>
            How AqlHR is delivering value to your organization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary mb-2">
                {summary ? Math.round((summary.hours_saved / 30) * 100) : 0}%
              </div>
              <div className="text-sm text-muted-foreground">
                Efficiency Improvement
              </div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {summary ? calculateSavings(summary.hours_saved * 12) : '0'} SAR
              </div>
              <div className="text-sm text-muted-foreground">
                Annual Cost Savings
              </div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {summary ? (summary.tasks + summary.letters + summary.autopilot_runs) : 0}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Automations
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              Documents: {summary?.docs || 0} processed
            </Badge>
            <Badge variant="secondary">
              Exports: {summary?.exports || 0} generated
            </Badge>
            <Badge variant="outline">
              Last 30 days
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ROIDashboard;