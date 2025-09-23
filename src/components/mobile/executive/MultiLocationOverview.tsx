import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { supabase } from '@/integrations/supabase/client';
import { 
  MapPin, 
  Building, 
  Users, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  Globe,
  Activity
} from 'lucide-react';

interface Location {
  id: string;
  name: string;
  nameAr: string;
  city: string;
  cityAr: string;
  country: string;
  countryAr: string;
  type: 'headquarters' | 'branch' | 'subsidiary' | 'office' | 'factory';
  status: 'operational' | 'under-construction' | 'planning' | 'maintenance';
  employees: number;
  revenue: string;
  performance: number;
  kpis: LocationKPI[];
  lastUpdate: string;
  timezone: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface LocationKPI {
  metric: string;
  metricAr: string;
  value: string | number;
  trend: 'up' | 'down' | 'stable';
  change: number;
  target: number;
}

export const MultiLocationOverview: React.FC = () => {
  const { lang: locale } = useUnifiedLocale();
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  const mockLocations: Location[] = [
    {
      id: '1',
      name: 'Riyadh Headquarters',
      nameAr: 'المقر الرئيسي بالرياض',
      city: 'Riyadh',
      cityAr: 'الرياض',
      country: 'Saudi Arabia',
      countryAr: 'المملكة العربية السعودية',
      type: 'headquarters',
      status: 'operational',
      employees: 2500,
      revenue: '$450M',
      performance: 94,
      timezone: 'Asia/Riyadh',
      coordinates: { lat: 24.7136, lng: 46.6753 },
      lastUpdate: '2024-01-15 09:30',
      kpis: [
        {
          metric: 'Revenue Growth',
          metricAr: 'نمو الإيرادات',
          value: '12.5%',
          trend: 'up',
          change: 2.3,
          target: 15
        },
        {
          metric: 'Employee Satisfaction',
          metricAr: 'رضا الموظفين',
          value: '88%',
          trend: 'up',
          change: 3.2,
          target: 90
        }
      ]
    },
    {
      id: '2',
      name: 'Dubai Regional Office',
      nameAr: 'المكتب الإقليمي بدبي',
      city: 'Dubai',
      cityAr: 'دبي',
      country: 'UAE',
      countryAr: 'الإمارات العربية المتحدة',
      type: 'office',
      status: 'operational',
      employees: 850,
      revenue: '$180M',
      performance: 87,
      timezone: 'Asia/Dubai',
      coordinates: { lat: 25.2048, lng: 55.2708 },
      lastUpdate: '2024-01-15 10:15',
      kpis: [
        {
          metric: 'Market Penetration',
          metricAr: 'اختراق السوق',
          value: '32%',
          trend: 'up',
          change: 5.1,
          target: 40
        },
        {
          metric: 'Operational Efficiency',
          metricAr: 'الكفاءة التشغيلية',
          value: '91%',
          trend: 'stable',
          change: 0.5,
          target: 95
        }
      ]
    },
    {
      id: '3',
      name: 'Jeddah Manufacturing',
      nameAr: 'مصنع جدة',
      city: 'Jeddah',
      cityAr: 'جدة',
      country: 'Saudi Arabia',
      countryAr: 'المملكة العربية السعودية',
      type: 'factory',
      status: 'operational',
      employees: 1200,
      revenue: '$320M',
      performance: 91,
      timezone: 'Asia/Riyadh',
      coordinates: { lat: 21.4858, lng: 39.1925 },
      lastUpdate: '2024-01-15 08:45',
      kpis: [
        {
          metric: 'Production Capacity',
          metricAr: 'الطاقة الإنتاجية',
          value: '87%',
          trend: 'up',
          change: 4.2,
          target: 90
        },
        {
          metric: 'Quality Score',
          metricAr: 'نقاط الجودة',
          value: '96%',
          trend: 'stable',
          change: 0.8,
          target: 98
        }
      ]
    },
    {
      id: '4',
      name: 'NEOM Innovation Hub',
      nameAr: 'مركز نيوم للابتكار',
      city: 'NEOM',
      cityAr: 'نيوم',
      country: 'Saudi Arabia',
      countryAr: 'المملكة العربية السعودية',
      type: 'office',
      status: 'under-construction',
      employees: 150,
      revenue: '$25M',
      performance: 76,
      timezone: 'Asia/Riyadh',
      coordinates: { lat: 28.0000, lng: 35.0000 },
      lastUpdate: '2024-01-15 07:20',
      kpis: [
        {
          metric: 'Innovation Index',
          metricAr: 'مؤشر الابتكار',
          value: '78%',
          trend: 'up',
          change: 12.5,
          target: 85
        },
        {
          metric: 'Talent Acquisition',
          metricAr: 'استقطاب المواهب',
          value: '45%',
          trend: 'up',
          change: 15.3,
          target: 70
        }
      ]
    }
  ];

  useEffect(() => {
    loadLocationsData();
  }, []);

  const loadLocationsData = async () => {
    setLoading(true);
    try {
      // For now, use mock data
      // In production, this would query locations data from database
      setLocations(mockLocations);
    } catch (error) {
      console.error('Error loading locations data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLocationTypeIcon = (type: string) => {
    switch (type) {
      case 'headquarters': return <Building className="h-4 w-4 text-blue-600" />;
      case 'factory': return <Zap className="h-4 w-4 text-green-600" />;
      case 'office': return <Globe className="h-4 w-4 text-purple-600" />;
      case 'branch': return <MapPin className="h-4 w-4 text-orange-600" />;
      default: return <Building className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-500';
      case 'under-construction': return 'bg-yellow-500';
      case 'planning': return 'bg-blue-500';
      case 'maintenance': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    if (locale === 'ar') {
      switch (status) {
        case 'operational': return 'تشغيلي';
        case 'under-construction': return 'قيد الإنشاء';
        case 'planning': return 'التخطيط';
        case 'maintenance': return 'الصيانة';
        default: return 'غير محدد';
      }
    }
    return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down': return <TrendingDown className="h-3 w-3 text-red-500" />;
      default: return <Activity className="h-3 w-3 text-gray-500" />;
    }
  };

  const calculateTotalEmployees = () => {
    return locations.reduce((total, location) => total + location.employees, 0);
  };

  const calculateAveragePerformance = () => {
    const total = locations.reduce((sum, location) => sum + location.performance, 0);
    return Math.round(total / locations.length);
  };

  const getOperationalLocations = () => {
    return locations.filter(location => location.status === 'operational').length;
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {locale === 'ar' ? 'نظرة عامة متعددة المواقع' : 'Multi-Location Overview'}
          </h2>
          <p className="text-muted-foreground">
            {locale === 'ar' ? 'مراقبة الأداء عبر جميع المواقع' : 'Monitor performance across all locations'}
          </p>
        </div>
        <Button size="sm">
          <Activity className="h-4 w-4 mr-1" />
          {locale === 'ar' ? 'تحديث البيانات' : 'Refresh Data'}
        </Button>
      </div>

      {/* Global Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {locale === 'ar' ? 'النظرة الشاملة' : 'Global Overview'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{locations.length}</div>
              <div className="text-sm text-muted-foreground">
                {locale === 'ar' ? 'إجمالي المواقع' : 'Total Locations'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{calculateTotalEmployees().toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">
                {locale === 'ar' ? 'إجمالي الموظفين' : 'Total Employees'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{calculateAveragePerformance()}%</div>
              <div className="text-sm text-muted-foreground">
                {locale === 'ar' ? 'متوسط الأداء' : 'Avg Performance'}
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm text-muted-foreground">
                {getOperationalLocations()} {locale === 'ar' ? 'تشغيلي' : 'Operational'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-sm text-muted-foreground">
                {locations.filter(l => l.status === 'under-construction').length} {locale === 'ar' ? 'قيد الإنشاء' : 'Under Construction'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Locations List */}
      <div className="space-y-4">
        {locations.map((location) => (
          <Card key={location.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getLocationTypeIcon(location.type)}
                    <h3 className="font-semibold text-foreground">
                      {locale === 'ar' ? location.nameAr : location.name}
                    </h3>
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(location.status)}`} />
                    <Badge variant="outline" className="text-xs">
                      {getStatusText(location.status)}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>
                        {locale === 'ar' 
                          ? `${location.cityAr}, ${location.countryAr}` 
                          : `${location.city}, ${location.country}`
                        }
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3" />
                      <span>{locale === 'ar' ? 'آخر تحديث:' : 'Last updated:'} {location.lastUpdate}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <div className="font-semibold">{location.employees.toLocaleString()}</div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {locale === 'ar' ? 'موظفين' : 'Employees'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <DollarSign className="h-3 w-3 text-muted-foreground" />
                        <div className="font-semibold">{location.revenue}</div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {locale === 'ar' ? 'الإيرادات' : 'Revenue'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-green-600">{location.performance}%</div>
                      <div className="text-xs text-muted-foreground">
                        {locale === 'ar' ? 'الأداء' : 'Performance'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>{locale === 'ar' ? 'الأداء العام' : 'Overall Performance'}</span>
                      <span>{location.performance}%</span>
                    </div>
                    <Progress value={location.performance} className="h-2" />
                  </div>
                  
                  {/* Key KPIs */}
                  {location.kpis.length > 0 && (
                    <div className="border-t pt-3">
                      <div className="text-xs font-semibold text-muted-foreground mb-2">
                        {locale === 'ar' ? 'مؤشرات الأداء الرئيسية' : 'Key Performance Indicators'}
                      </div>
                      <div className="space-y-2">
                        {location.kpis.slice(0, 2).map((kpi, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              {getTrendIcon(kpi.trend)}
                              <span className="text-muted-foreground">
                                {locale === 'ar' ? kpi.metricAr : kpi.metric}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="font-semibold">{kpi.value}</span>
                              <span className={`text-xs ${kpi.trend === 'up' ? 'text-green-500' : kpi.trend === 'down' ? 'text-red-500' : 'text-gray-500'}`}>
                                ({kpi.trend === 'up' ? '+' : kpi.trend === 'down' ? '-' : ''}{Math.abs(kpi.change)}%)
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedLocation(location.id)}
                >
                  <MapPin className="h-4 w-4 mr-1" />
                  {locale === 'ar' ? 'تفاصيل' : 'Details'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {locations.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {locale === 'ar' ? 'لا توجد مواقع' : 'No Locations Found'}
            </h3>
            <p className="text-muted-foreground">
              {locale === 'ar' ? 'لا توجد مواقع متاحة للعرض' : 'No locations available to display'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};