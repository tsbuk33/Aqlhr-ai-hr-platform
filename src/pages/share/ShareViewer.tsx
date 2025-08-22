import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Clock, FileText, Zap, TrendingUp, Share2, Calendar, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ShareData {
  kind: string;
  payload: any;
  company: {
    name: string;
    company_name_arabic: string;
  };
  created_at: string;
  expires_at: string;
}

const ShareViewer = () => {
  const { token } = useParams<{ token: string }>();
  const [shareData, setShareData] = useState<ShareData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      fetchShareData(token);
    }
  }, [token]);

  const fetchShareData = async (shareToken: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.functions.invoke('share-viewer', {
        body: { token: shareToken }
      });

      if (error) throw error;
      setShareData(data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load share data';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const formatHours = (hours: number) => {
    return `${hours.toFixed(1)}h`;
  };

  const calculateSavings = (hours: number) => {
    const hourlyRate = 150; // SAR per hour
    return (hours * hourlyRate).toFixed(0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-6">
        <div className="container mx-auto max-w-6xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded-lg w-1/3"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1,2,3,4].map((i) => (
                <div key={i} className="h-32 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !shareData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-6 flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="p-8">
            <div className="text-6xl mb-4">🔗</div>
            <h2 className="text-2xl font-bold text-destructive mb-2">
              Share Link Not Found
            </h2>
            <p className="text-muted-foreground mb-4">
              {error || 'This share link may have expired or been removed.'}
            </p>
            <Button asChild>
              <a href="https://aqlhr.com" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Learn about AqlHR
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { payload, company } = shareData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-6">
      <div className="container mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">{company.name}</h1>
          <p className="text-xl text-muted-foreground">HR Performance Dashboard</p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Generated: {new Date(shareData.created_at).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <Share2 className="h-4 w-4" />
              Powered by AqlHR
            </div>
          </div>
        </div>

        {shareData.kind === 'dashboard_snapshot' && payload.summary && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {formatHours(payload.summary.hours_saved)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    ≈ {calculateSavings(payload.summary.hours_saved)} SAR saved
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tasks Automated</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {payload.summary.tasks}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Workflow automations
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Documents Generated</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {payload.summary.letters}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Compliance letters
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
                    {payload.summary.autopilot_runs}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Automated processes
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            {payload.trend && payload.trend.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Hours Saved Trend */}
                <Card>
                  <CardHeader>
                    <CardTitle>Time Savings Trend</CardTitle>
                    <CardDescription>
                      Daily hours saved over the last 7 days
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={payload.trend}>
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
                      <BarChart data={payload.trend}>
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
            )}

            {/* ROI Summary */}
            <Card>
              <CardHeader>
                <CardTitle>ROI Impact Summary</CardTitle>
                <CardDescription>
                  How AqlHR delivers measurable value
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary mb-2">
                      {Math.round((payload.summary.hours_saved / 30) * 100)}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Efficiency Improvement
                    </div>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      {calculateSavings(payload.summary.hours_saved * 12)} SAR
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Annual Cost Savings
                    </div>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      {payload.summary.tasks + payload.summary.letters + payload.summary.autopilot_runs}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Automations
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    Documents: {payload.summary.docs} processed
                  </Badge>
                  <Badge variant="secondary">
                    Exports: {payload.summary.exports} generated
                  </Badge>
                  <Badge variant="outline">
                    Last 30 days
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Footer */}
        <Card className="text-center">
          <CardContent className="p-6">
            <p className="text-muted-foreground mb-4">
              Want to see how AqlHR can transform your HR operations?
            </p>
            <Button size="lg" asChild>
              <a href="https://aqlhr.com" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-5 w-5 mr-2" />
                Learn More About AqlHR
              </a>
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              This dashboard snapshot expires on {new Date(shareData.expires_at).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShareViewer;