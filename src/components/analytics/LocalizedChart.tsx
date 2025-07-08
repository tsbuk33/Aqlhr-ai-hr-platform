import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, BarChart3 } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
  name: string;
  nameAr: string;
  value: number;
  [key: string]: any;
}

interface LocalizedChartProps {
  title: string;
  titleAr: string;
  description?: string;
  descriptionAr?: string;
  data: ChartData[];
  type: 'line' | 'bar' | 'pie';
  dataKey?: string;
  showExport?: boolean;
  culturalContext?: {
    insight: string;
    insightAr: string;
    kpi?: string;
    kpiAr?: string;
  };
}

const SAUDI_COLORS = ['#006C35', '#FFFFFF', '#000000', '#CD212A', '#FF6B35'];

export const LocalizedChart = ({ 
  title, 
  titleAr, 
  description, 
  descriptionAr, 
  data, 
  type, 
  dataKey = 'value',
  showExport = true,
  culturalContext 
}: LocalizedChartProps) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const exportReport = (format: 'pdf' | 'excel') => {
    // Simulate export functionality
    console.log(`Exporting ${isRTL ? titleAr : title} as ${format} in ${language}`);
    // In real implementation, would generate localized reports
  };

  const renderChart = () => {
    const localizedData = data.map(item => ({
      ...item,
      name: isRTL ? item.nameAr : item.name
    }));

    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={localizedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => isRTL ? value : value}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                labelFormatter={(label) => isRTL ? label : label}
                formatter={(value, name) => [value, isRTL ? name : name]}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey={dataKey} 
                stroke={SAUDI_COLORS[0]} 
                strokeWidth={2}
                name={isRTL ? 'القيمة' : 'Value'}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={localizedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                interval={0}
                angle={isRTL ? 45 : -45}
                textAnchor={isRTL ? 'start' : 'end'}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar 
                dataKey={dataKey} 
                fill={SAUDI_COLORS[0]}
                name={isRTL ? 'القيمة' : 'Value'}
              />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={localizedData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey={dataKey}
              >
                {localizedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={SAUDI_COLORS[index % SAUDI_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className={isRTL ? 'text-right' : 'text-left'}>
              {isRTL ? titleAr : title}
            </CardTitle>
            {(description || descriptionAr) && (
              <CardDescription className={isRTL ? 'text-right' : 'text-left'}>
                {isRTL ? descriptionAr : description}
              </CardDescription>
            )}
          </div>
          {showExport && (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => exportReport('pdf')}
                className="gap-2"
              >
                <FileText className="h-4 w-4" />
                PDF
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => exportReport('excel')}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Excel
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className={`space-y-4 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
          {renderChart()}
          
          {culturalContext && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">
                  {isRTL ? 'رؤى ثقافية' : 'Cultural Insights'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {isRTL ? culturalContext.insightAr : culturalContext.insight}
              </p>
              {culturalContext.kpi && (
                <div className="mt-2 text-xs text-primary font-medium">
                  KPI: {isRTL ? culturalContext.kpiAr : culturalContext.kpi}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};