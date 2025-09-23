import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { supabase } from '@/integrations/supabase/client';
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Target, 
  Award,
  Building,
  Users,
  DollarSign,
  BarChart3,
  Globe,
  AlertTriangle,
  Star,
  Zap
} from 'lucide-react';

interface Competitor {
  id: string;
  name: string;
  nameAr: string;
  marketShare: number;
  revenue: string;
  employees: number;
  sector: string;
  sectorAr: string;
  growth: number;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  strengths: string[];
  weaknesses: string[];
  recentMoves: CompetitorMove[];
}

interface CompetitorMove {
  id: string;
  type: 'acquisition' | 'partnership' | 'expansion' | 'product' | 'regulatory';
  title: string;
  titleAr: string;
  date: string;
  impact: 'positive' | 'negative' | 'neutral';
  severity: number;
}

interface MarketIntelligence {
  marketSize: string;
  growthRate: number;
  keyTrends: string[];
  regulatoryChanges: string[];
  threats: string[];
  opportunities: string[];
}

export const CompetitiveIntelligence: React.FC = () => {
  const { lang: locale } = useUnifiedLocale();
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [marketIntelligence, setMarketIntelligence] = useState<MarketIntelligence | null>(null);
  const [selectedCompetitor, setSelectedCompetitor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  const mockCompetitors: Competitor[] = [
    {
      id: '1',
      name: 'Saudi Aramco',
      nameAr: 'أرامكو السعودية',
      marketShare: 35.2,
      revenue: '$400B',
      employees: 68000,
      sector: 'Energy',
      sectorAr: 'الطاقة',
      growth: 12.5,
      threatLevel: 'critical',
      strengths: ['Market dominance', 'Government backing', 'Infrastructure'],
      weaknesses: ['Diversification limited', 'Oil dependency'],
      recentMoves: [
        {
          id: '1',
          type: 'expansion',
          title: 'New refinery in Jazan',
          titleAr: 'مصفاة جديدة في جازان',
          date: '2024-01-10',
          impact: 'negative',
          severity: 8
        }
      ]
    },
    {
      id: '2',
      name: 'SABIC',
      nameAr: 'سابك',
      marketShare: 18.7,
      revenue: '$45B',
      employees: 33000,
      sector: 'Chemicals',
      sectorAr: 'الكيماويات',
      growth: 8.3,
      threatLevel: 'high',
      strengths: ['Innovation', 'Global presence', 'Sustainability focus'],
      weaknesses: ['Price volatility', 'Raw material dependency'],
      recentMoves: [
        {
          id: '2',
          type: 'partnership',
          title: 'Green hydrogen partnership',
          titleAr: 'شراكة الهيدروجين الأخضر',
          date: '2024-01-08',
          impact: 'positive',
          severity: 6
        }
      ]
    },
    {
      id: '3',
      name: 'STC Group',
      nameAr: 'مجموعة الاتصالات السعودية',
      marketShare: 22.1,
      revenue: '$15B',
      employees: 18000,
      sector: 'Telecommunications',
      sectorAr: 'الاتصالات',
      growth: 15.2,
      threatLevel: 'medium',
      strengths: ['5G leadership', 'Digital transformation', 'Market penetration'],
      weaknesses: ['Regulatory pressure', 'Competition'],
      recentMoves: [
        {
          id: '3',
          type: 'acquisition',
          title: 'Fintech company acquisition',
          titleAr: 'استحواذ على شركة تقنية مالية',
          date: '2024-01-05',
          impact: 'neutral',
          severity: 4
        }
      ]
    }
  ];

  const mockMarketIntelligence: MarketIntelligence = {
    marketSize: '$2.3T',
    growthRate: 8.7,
    keyTrends: [
      'Digital transformation acceleration',
      'Sustainability focus increase',
      'Government mega-projects',
      'Foreign investment growth'
    ],
    regulatoryChanges: [
      'New environmental regulations',
      'Foreign ownership limits relaxed',
      'Digital nomad visa program',
      'Carbon tax implementation'
    ],
    threats: [
      'Global economic uncertainty',
      'Geopolitical tensions',
      'Oil price volatility',
      'Talent shortage'
    ],
    opportunities: [
      'Vision 2030 initiatives',
      'NEOM development',
      'Green energy transition',
      'Tourism sector growth'
    ]
  };

  useEffect(() => {
    loadCompetitiveData();
  }, []);

  const loadCompetitiveData = async () => {
    setLoading(true);
    try {
      // For now, use mock data
      // In production, this would query competitive intelligence data
      setCompetitors(mockCompetitors);
      setMarketIntelligence(mockMarketIntelligence);
    } catch (error) {
      console.error('Error loading competitive data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getThreatLevelText = (level: string) => {
    if (locale === 'ar') {
      switch (level) {
        case 'critical': return 'حرج';
        case 'high': return 'عالي';
        case 'medium': return 'متوسط';
        case 'low': return 'منخفض';
        default: return 'غير محدد';
      }
    }
    return level.charAt(0).toUpperCase() + level.slice(1);
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'negative': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Target className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {locale === 'ar' ? 'الاستخبارات التنافسية' : 'Competitive Intelligence'}
          </h2>
          <p className="text-muted-foreground">
            {locale === 'ar' ? 'مراقبة المنافسين وتحليل السوق' : 'Monitor competitors and market analysis'}
          </p>
        </div>
        <Button size="sm">
          <Eye className="h-4 w-4 mr-1" />
          {locale === 'ar' ? 'تحديث البيانات' : 'Refresh Data'}
        </Button>
      </div>

      {/* Market Overview */}
      {marketIntelligence && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {locale === 'ar' ? 'نظرة عامة على السوق' : 'Market Overview'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{marketIntelligence.marketSize}</div>
                <div className="text-sm text-muted-foreground">
                  {locale === 'ar' ? 'حجم السوق' : 'Market Size'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">+{marketIntelligence.growthRate}%</div>
                <div className="text-sm text-muted-foreground">
                  {locale === 'ar' ? 'معدل النمو' : 'Growth Rate'}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-sm mb-2 text-green-600">
                  {locale === 'ar' ? 'الفرص' : 'Opportunities'}
                </h4>
                <ul className="space-y-1 text-xs">
                  {marketIntelligence.opportunities.slice(0, 2).map((opp, idx) => (
                    <li key={idx} className="text-muted-foreground">• {opp}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-2 text-red-600">
                  {locale === 'ar' ? 'التهديدات' : 'Threats'}
                </h4>
                <ul className="space-y-1 text-xs">
                  {marketIntelligence.threats.slice(0, 2).map((threat, idx) => (
                    <li key={idx} className="text-muted-foreground">• {threat}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Competitors List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground">
          {locale === 'ar' ? 'المنافسون الرئيسيون' : 'Key Competitors'}
        </h3>
        
        {competitors.map((competitor) => (
          <Card key={competitor.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-foreground">
                      {locale === 'ar' ? competitor.nameAr : competitor.name}
                    </h3>
                    <Badge variant="outline">{locale === 'ar' ? competitor.sectorAr : competitor.sector}</Badge>
                    <div className={`w-2 h-2 rounded-full ${getThreatLevelColor(competitor.threatLevel)}`} />
                    <span className="text-xs text-muted-foreground">
                      {getThreatLevelText(competitor.threatLevel)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div className="text-center">
                      <div className="text-lg font-bold">{competitor.marketShare}%</div>
                      <div className="text-xs text-muted-foreground">
                        {locale === 'ar' ? 'حصة السوق' : 'Market Share'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">{competitor.revenue}</div>
                      <div className="text-xs text-muted-foreground">
                        {locale === 'ar' ? 'الإيرادات' : 'Revenue'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">+{competitor.growth}%</div>
                      <div className="text-xs text-muted-foreground">
                        {locale === 'ar' ? 'النمو' : 'Growth'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="text-xs text-muted-foreground mb-1">
                      {locale === 'ar' ? 'حصة السوق' : 'Market Share'}
                    </div>
                    <Progress value={competitor.marketShare} className="h-2" />
                  </div>
                  
                  {competitor.recentMoves.length > 0 && (
                    <div className="border-t pt-3">
                      <div className="text-xs font-semibold text-muted-foreground mb-2">
                        {locale === 'ar' ? 'آخر التحركات' : 'Recent Moves'}
                      </div>
                      {competitor.recentMoves.slice(0, 1).map((move) => (
                        <div key={move.id} className="flex items-center gap-2 text-xs">
                          {getImpactIcon(move.impact)}
                          <span className="text-muted-foreground">
                            {locale === 'ar' ? move.titleAr : move.title} ({move.date})
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedCompetitor(competitor.id)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  {locale === 'ar' ? 'تفاصيل' : 'Details'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {competitors.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {locale === 'ar' ? 'لا توجد بيانات منافسين' : 'No Competitor Data'}
            </h3>
            <p className="text-muted-foreground">
              {locale === 'ar' ? 'لا توجد بيانات متاحة للمنافسين' : 'No competitor data available'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};