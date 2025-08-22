import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Clock, FileText, Zap, TrendingUp, Share2, Calendar, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ShareData {
  company: {
    name: string;
    name_arabic?: string;
    industry?: string;
    size_category?: string;
  };
  kpi_summary: {
    total_employees: number;
    saudization_rate: number;
    compliance_score: number;
    hse_safety_score: number;
    employee_experience_10: number;
  };
  trend_data: Array<{
    d: string;
    total_employees: number;
    saudization_rate: number;
    hse_safety_score: number;
    docs_processed: number;
    training_hours: number;
    compliance_score: number;
    employee_experience_10: number;
    predictive_risk_high: number;
  }>;
  integrations: {
    total: number;
    connected: number;
    connection_rate: number;
  };
  share_info: {
    created_at: string;
    expires_at: string;
    kind: string;
  };
  generated_at: string;
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

      const { data, error } = await supabase.functions.invoke('share_view_dashboard_v1', {
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

  const { company, kpi_summary, trend_data, integrations } = shareData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-6">
      <div className="container mx-auto max-w-6xl space-y-6">
        {/* Watermark Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-blue-800 font-medium">
            🔒 AqlHR Read-Only Snapshot – PDPL Safe
          </p>
          <p className="text-blue-600 text-sm">
            This dashboard contains aggregated data only. No personally identifiable information (PII) is included.
          </p>
        </div>

        {/* Expiry Warning */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
          <p className="text-amber-800">
            ⏰ Link expires on {new Date(shareData.share_info.expires_at).toLocaleString()}
          </p>
        </div>

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">{company.name}</h1>
          <p className="text-xl text-muted-foreground">HR Performance Dashboard Snapshot</p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Generated: {new Date(shareData.generated_at).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <Share2 className="h-4 w-4" />
              Powered by AqlHR
            </div>
          </div>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {kpi_summary.total_employees}
              </div>
              <p className="text-xs text-muted-foreground">
                Active workforce
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saudization Rate</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {kpi_summary.saudization_rate.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Saudi nationals
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {kpi_summary.compliance_score.toFixed(0)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Overall compliance
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">HSE Safety</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {kpi_summary.hse_safety_score.toFixed(0)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Safety score
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Trend Chart */}
        {trend_data && trend_data.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>30-Day Performance Trend</CardTitle>
              <CardDescription>
                Key performance indicators over the last 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={trend_data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="d" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis />
                  <RechartsTooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="saudization_rate" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Saudization %"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="compliance_score" 
                    stroke="hsl(var(--secondary))" 
                    strokeWidth={2}
                    name="Compliance %"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="hse_safety_score" 
                    stroke="hsl(var(--accent))" 
                    strokeWidth={2}
                    name="HSE Safety %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Integration Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Integration Status</CardTitle>
            <CardDescription>
              Connected systems and data sources
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary mb-2">
                  {integrations.connected}
                </div>
                <div className="text-sm text-muted-foreground">
                  Connected Systems
                </div>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {integrations.total}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Available
                </div>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {integrations.connection_rate}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Connection Rate
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShareViewer;