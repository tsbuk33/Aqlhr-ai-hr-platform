import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { Search, Loader2, TrendingUp, Target, Globe, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface SalaryData {
  minimum: number;
  midpoint: number;
  maximum: number;
  confidence: number;
  competitiveness: number;
  sources: string[];
  recommendations: string[];
  marketTrend: number;
}

interface Position {
  id: string;
  title: string;
  department: string;
  level: string;
}

export const SalarySearchEngine = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPosition, setSelectedPosition] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [salaryData, setSalaryData] = useState<SalaryData | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [filteredPositions, setFilteredPositions] = useState<Position[]>([]);

  const translations = {
    en: {
      salary_search_engine: "Salary Band Search Engine",
      search_placeholder: "Search job positions...",
      department: "Department",
      level: "Level",
      location: "Location",
      search_button: "Search Salary Data",
      salary_band_results: "Salary Band Results",
      minimum_salary: "Minimum",
      midpoint_salary: "Midpoint",
      maximum_salary: "Maximum",
      recommended_salary: "Recommended Salary",
      confidence_score: "Confidence Score",
      market_competitiveness: "Market Competitiveness",
      data_sources: "Data Sources",
      market_intelligence: "Market Intelligence",
      recommendations: "AI Recommendations",
      market_trend: "Market Trend",
      currency: "SAR",
      no_data: "No salary data available for this position",
      searching: "Searching market data...",
      select_department: "Select Department",
      select_level: "Select Level",
      all_departments: "All Departments",
      all_levels: "All Levels",
      // Tooltips
      salary_engine_tooltip: "Advanced search engine using real-time market data from multiple sources",
      confidence_tooltip: "Data quality and reliability score based on number of sources and data points",
      competitiveness_tooltip: "How competitive this salary is compared to market standards",
      recommendations_tooltip: "AI-powered recommendations based on market analysis and trends"
    },
    ar: {
      salary_search_engine: "محرك البحث عن نطاقات الرواتب",
      search_placeholder: "البحث عن المناصب الوظيفية...",
      department: "القسم",
      level: "المستوى",
      location: "الموقع",
      search_button: "البحث في بيانات الراتب",
      salary_band_results: "نتائج نطاق الراتب",
      minimum_salary: "الحد الأدنى",
      midpoint_salary: "النقطة الوسطى",
      maximum_salary: "الحد الأقصى",
      recommended_salary: "الراتب المُوصى به",
      confidence_score: "نقاط الثقة",
      market_competitiveness: "التنافسية السوقية",
      data_sources: "مصادر البيانات",
      market_intelligence: "الذكاء السوقي",
      recommendations: "توصيات الذكاء الاصطناعي",
      market_trend: "اتجاه السوق",
      currency: "ريال",
      no_data: "لا توجد بيانات راتب متاحة لهذا المنصب",
      searching: "البحث في بيانات السوق...",
      select_department: "اختر القسم",
      select_level: "اختر المستوى",
      all_departments: "جميع الأقسام",
      all_levels: "جميع المستويات",
      // Tooltips
      salary_engine_tooltip: "محرك بحث متقدم يستخدم بيانات السوق في الوقت الفعلي من مصادر متعددة",
      confidence_tooltip: "نقاط جودة وموثوقية البيانات بناءً على عدد المصادر ونقاط البيانات",
      competitiveness_tooltip: "مدى تنافسية هذا الراتب مقارنة بمعايير السوق",
      recommendations_tooltip: "توصيات مدعومة بالذكاء الاصطناعي بناءً على تحليل السوق والاتجاهات"
    }
  };

  const t = (key: string) => translations[language][key] || key;

  // Sample positions data (would come from employee master data)
  useEffect(() => {
    const samplePositions: Position[] = [
      { id: "1", title: "Software Engineer", department: "IT", level: "Mid" },
      { id: "2", title: "Senior Software Engineer", department: "IT", level: "Senior" },
      { id: "3", title: "HR Manager", department: "HR", level: "Senior" },
      { id: "4", title: "Sales Manager", department: "Sales", level: "Senior" },
      { id: "5", title: "Marketing Specialist", department: "Marketing", level: "Junior" },
      { id: "6", title: "Data Analyst", department: "IT", level: "Mid" },
      { id: "7", title: "Project Manager", department: "Operations", level: "Senior" },
      { id: "8", title: "Financial Analyst", department: "Finance", level: "Mid" },
      { id: "9", title: "UX Designer", department: "Design", level: "Mid" },
      { id: "10", title: "DevOps Engineer", department: "IT", level: "Senior" }
    ];
    setPositions(samplePositions);
    setFilteredPositions(samplePositions);
  }, []);

  // Filter positions based on search and filters
  useEffect(() => {
    let filtered = positions;

    if (searchTerm) {
      filtered = filtered.filter(pos => 
        pos.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDepartment && selectedDepartment !== "all") {
      filtered = filtered.filter(pos => pos.department === selectedDepartment);
    }

    if (selectedLevel && selectedLevel !== "all") {
      filtered = filtered.filter(pos => pos.level === selectedLevel);
    }

    setFilteredPositions(filtered);
  }, [searchTerm, selectedDepartment, selectedLevel, positions]);

  const handleSearch = async () => {
    if (!selectedPosition && !searchTerm) {
      toast({
        title: "Search Required",
        description: "Please select a position or enter a search term",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setSalaryData(null);

    try {
      const position = selectedPosition || searchTerm;
      const { data, error } = await supabase.functions.invoke('salary-market-intelligence', {
        body: {
          position,
          department: selectedDepartment,
          level: selectedLevel,
          location: "Saudi Arabia"
        }
      });

      if (error) throw error;

      setSalaryData(data);
      toast({
        title: "Search Complete",
        description: "Salary data retrieved successfully",
      });
    } catch (error) {
      console.error('Error fetching salary data:', error);
      toast({
        title: "Search Failed",
        description: "Could not retrieve salary data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getCompetitivenessColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  const departments = [...new Set(positions.map(p => p.department))];
  const levels = [...new Set(positions.map(p => p.level))];

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Search className="h-6 w-6 text-brand-primary" />
          <h2 className="text-2xl font-bold text-foreground">{t('salary_search_engine')}</h2>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{t('salary_engine_tooltip')}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Search Interface */}
        <Card>
          <CardHeader>
            <CardTitle>Position Search Interface</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {t('search_placeholder')}
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t('search_placeholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    list="positions"
                  />
                  <datalist id="positions">
                    {filteredPositions.map((pos) => (
                      <option key={pos.id} value={pos.title} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {t('department')}
                </label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('select_department')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('all_departments')}</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {t('level')}
                </label>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('select_level')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('all_levels')}</SelectItem>
                    {levels.map((level) => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Action</label>
                <Button 
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {t('searching')}
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      {t('search_button')}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Salary Band Results */}
        {salaryData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-brand-primary" />
                {t('salary_band_results')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Salary Range Visualization */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>{t('minimum_salary')}</span>
                  <span>{t('midpoint_salary')}</span>
                  <span>{t('maximum_salary')}</span>
                </div>
                <div className="relative">
                  <Progress value={50} className="h-8" />
                  <div className="absolute inset-0 flex justify-between items-center px-2">
                    <span className="text-xs font-medium text-white">
                      {formatCurrency(salaryData.minimum)}
                    </span>
                    <span className="text-xs font-bold text-white bg-brand-primary px-2 py-1 rounded">
                      {formatCurrency(salaryData.midpoint)}
                    </span>
                    <span className="text-xs font-medium text-white">
                      {formatCurrency(salaryData.maximum)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recommended Salary & Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-700 mb-1">
                      {formatCurrency(salaryData.midpoint)}
                    </div>
                    <p className="text-sm text-blue-600">{t('recommended_salary')}</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className={`text-2xl font-bold ${getConfidenceColor(salaryData.confidence)}`}>
                        {salaryData.confidence}%
                      </div>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{t('confidence_tooltip')}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className="text-sm text-green-600">{t('confidence_score')}</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className={`text-2xl font-bold ${getCompetitivenessColor(salaryData.competitiveness)}`}>
                        {salaryData.competitiveness}%
                      </div>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{t('competitiveness_tooltip')}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className="text-sm text-purple-600">{t('market_competitiveness')}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Market Intelligence */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      {t('data_sources')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {salaryData.sources.map((source, index) => (
                        <Badge key={index} variant="secondary" className="mr-2 mb-2">
                          {source}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      {t('market_intelligence')}
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{t('recommendations_tooltip')}</p>
                        </TooltipContent>
                      </Tooltip>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{t('market_trend')}:</span>
                        <span className={`font-medium ${salaryData.marketTrend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {salaryData.marketTrend > 0 ? '+' : ''}{salaryData.marketTrend}%
                        </span>
                      </div>
                      {salaryData.recommendations.map((rec, index) => (
                        <p key={index} className="text-sm text-muted-foreground">
                          • {rec}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        )}

        {salaryData === null && !isLoading && (
          <Card>
            <CardContent className="p-8 text-center">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">{t('no_data')}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
};