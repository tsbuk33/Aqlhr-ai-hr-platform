import { SimpleMetricCard } from "@/components/SimpleMetricCard";
import { RecentActivitiesSection } from "@/components/landing/RecentActivitiesSection";
import { AnnouncementsSection } from "@/components/landing/AnnouncementsSection";
import { ExecutiveCenter } from "@/components/landing/ExecutiveCenter";
import { OfficialLogos } from "@/components/OfficialLogos";
import { CompanyDataUpload } from "@/components/CompanyDataUpload";
import { SaudiHeroSection } from "@/components/saudi/SaudiHeroSection";
import { VirtualAssistant as AdvancedVirtualAssistant } from "@/components/ai/VirtualAssistant";
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";
import { 
  Users, 
  Calendar, 
  Brain, 
  Shield, 
  Award, 
  UserCheck 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { LinkL } from '@/lib/i18n/LinkL';
import { useSimpleLanguage } from "@/contexts/SimpleLanguageContext";
import { useAIDashboard } from "@/hooks/useAIDashboard";
import { AqlHRAIAssistant } from '@/components/ai';

const Index = () => {
  const { isArabic } = useSimpleLanguage();
  const aiMetrics = useAIDashboard();

  return (
    <div className={`min-h-screen bg-background ${isArabic ? 'rtl-container' : 'ltr-container'}`}>
      {/* Saudi Government Hero Section */}
      <SaudiHeroSection />
      
      {/* Executive Header */}
      <div className="bg-surface border-b border-border dark:bg-surface dark:border-border">
        <div className="max-width-container py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground dark:text-foreground mb-4">
              {isArabic ? 'نظام إيه كيو إل إتش ار للموارد البشرية' : 'AqlHR Executive Dashboard'}
            </h1>
            <p className="text-foreground-muted dark:text-foreground-muted text-lg max-w-4xl mx-auto mb-6">
              {isArabic ? 'منصة ذكية ومتطورة لإدارة الموارد البشرية في المملكة العربية السعودية' : 'Advanced Intelligent Platform for Human Resources Management in Saudi Arabia'}
            </p>
            <div className={`flex items-center justify-center gap-4 ${isArabic ? 'flex-rtl' : ''}`}>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-status-success rounded-full"></div>
                <span className="text-sm text-foreground-muted dark:text-foreground-muted">
                  {isArabic ? 'جميع الأنظمة تعمل' : 'All Systems Operational'}
                </span>
              </div>
              <LinkL to="/auth" className="no-underline">
                <Button variant="default" className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                  <UserCheck className="h-4 w-4" />
                  {isArabic ? 'تسجيل الدخول' : 'Sign In'}
                </Button>
              </LinkL>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <Brain className="h-4 w-4" />
                    {isArabic ? 'رؤى الذكاء الاصطناعي' : 'AI Insights'}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className={`text-lg font-semibold ${isArabic ? 'text-right' : ''}`}>
                      {isArabic ? 'رؤى الذكاء الاصطناعي للموارد البشرية' : 'AI-Powered HR Insights'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className={`p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg ${isArabic ? 'text-right' : ''}`}>
                      <h4 className="font-semibold mb-2">
                        {isArabic ? 'وظائف لوحة الموارد البشرية الرئيسية:' : 'Key HR Dashboard Functions:'}
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li>• {isArabic ? 'مراقبة الموارد البشرية - تتبع المقاييس الرئيسية وتحديد الاتجاهات' : 'HR Monitoring - Track key metrics and identify trends'}</li>
                        <li>• {isArabic ? 'معلومات الإدارة - رؤى حول ديناميكيات الفريق والقسم' : 'Management Information - Insights into team & department dynamics'}</li>
                        <li>• {isArabic ? 'التحليلات التنبؤية - توقع احتياجات الموارد البشرية المستقبلية' : 'Predictive Analytics - Forecast future HR needs'}</li>
                        <li>• {isArabic ? 'تحسين الأداء - تحديد فرص التحسين' : 'Performance Optimization - Identify improvement opportunities'}</li>
                      </ul>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-12">
        
        {/* Executive Summary - Key Metrics */}
        <section>
          <div className="section-header">
            <h2 className="section-title">
              {isArabic ? 'الملخص التنفيذي' : 'Executive Summary'}
            </h2>
            <p className="section-subtitle">
              {isArabic ? 'نظرة عامة على مؤشرات الأداء الرئيسية للموارد البشرية' : 'Overview of key human resources performance indicators'}
            </p>
          </div>
          
          <div className="statistics-grid">
            <div className="statistic-card">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="statistic-label">
                {isArabic ? 'إجمالي الموظفين' : 'Total Employees'}
              </div>
              <div className="statistic-number">
                {aiMetrics.loading ? '...' : '2,847'}
              </div>
              <div className="statistic-sublabel">
                {isArabic ? '+12% مقابل الشهر الماضي' : '+12% vs last month'}
              </div>
            </div>

            <div className="statistic-card">
              <Brain className="h-8 w-8 text-purple-600" />
              <div className="statistic-label">
                {isArabic ? 'العمليات بالذكاء الاصطناعي' : 'AI Processes'}
              </div>
              <div className="statistic-number">
                {aiMetrics.loading ? '...' : '156'}
              </div>
              <div className="statistic-sublabel">
                {isArabic ? '+24 أداة نشطة' : '+24 active tools'}
              </div>
            </div>

            <div className="statistic-card">
              <Shield className="h-8 w-8 text-green-600" />
              <div className="statistic-label">
                {isArabic ? 'التكامل الحكومي' : 'Gov Integrations'}
              </div>
              <div className="statistic-number">
                {aiMetrics.loading ? '...' : '46'}
              </div>
              <div className="statistic-sublabel">
                {isArabic ? '22 مكتملة + 24 أداة' : 'Complete 22 Gov + 24 Tools'}
              </div>
            </div>

            <div className="statistic-card">
              <Award className="h-8 w-8 text-orange-600" />
              <div className="statistic-label">
                {isArabic ? 'نقاط الامتثال' : 'Compliance Score'}
              </div>
              <div className="statistic-number">
                {aiMetrics.loading ? '...' : '94%'}
              </div>
              <div className="statistic-sublabel">
                {isArabic ? '+2.1% مقابل الشهر الماضي - الامتثال التنظيمي' : '+2.1% vs last month - regulatory compliance'}
              </div>
            </div>
          </div>
        </section>

        {/* Executive Center Section */}
        <section className="w-full section-spacing">
          <div className="section-header">
            <h2 className="section-title">
              {isArabic ? 'المركز التنفيذي' : 'Executive Center'}
            </h2>
            <p className="section-subtitle">
              {isArabic ? 'أدوات وميزات متقدمة للقيادة التنفيذية' : 'Advanced tools and features for executive leadership'}
            </p>
          </div>
          <ExecutiveCenter />
        </section>

        {/* Two Column Layout - Activities and Announcements */}
        <div className="w-full max-w-7xl mx-auto section-spacing">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <div className="space-y-8">
              <section className="w-full">
                <div className="section-header">
                  <h2 className="section-title">
                    {isArabic ? 'النشاط الأخير' : 'Recent Activity'}
                  </h2>
                  <p className="section-subtitle">
                    {isArabic ? 'آخر الأنشطة والتحديثات في النظام' : 'Latest system activities and updates'}
                  </p>
                </div>
                <div className="w-full">
                  <RecentActivitiesSection />
                </div>
              </section>
            </div>

            {/* Announcements and Partnerships */}
            <div className="space-y-8">
              {/* Official Announcements */}
              <section className="w-full">
                <div className="section-header">
                  <h2 className="section-title">
                    {isArabic ? 'الإعلانات الرسمية' : 'Official Announcements'}
                  </h2>
                  <p className="section-subtitle">
                    {isArabic ? 'آخر الإعلانات والتحديثات من الجهات الحكومية' : 'Latest announcements and updates from government entities'}
                  </p>
                </div>
                <div className="w-full">
                  <AnnouncementsSection />
                </div>
              </section>

              {/* Official Partnerships */}
              <section className="w-full">
                <div className="section-header">
                  <h2 className="section-title">
                    {isArabic ? 'الشراكات الرسمية' : 'Official Partnerships'}
                  </h2>
                  <p className="section-subtitle">
                    {isArabic ? 'شراكاتنا مع الجهات الحكومية' : 'Our government partnerships'}
                  </p>
                </div>
                <div className="w-full bg-card rounded-xl border border-border p-6 center-xy">
                  <OfficialLogos />
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Company Data Upload */}
        <section className="section-spacing">
          <div className="bg-white rounded-xl border border-border p-8">
            <div className="section-header">
              <h2 className="section-title">
                {isArabic ? 'رفع بيانات الشركة' : 'Company Data Upload'}
              </h2>
              <p className="section-subtitle">
                {isArabic ? 'ارفع ملفات بيانات الشركة للتحليل والمعالجة' : 'Upload company data files for analysis and processing'}
              </p>
            </div>
            <CompanyDataUpload />
          </div>
        </section>

        {/* Footer Action Buttons */}
        <section className="w-full section-spacing">
          <div className="footer-buttons-container">
            <Button className="footer-button footer-button-primary" size="lg">
              <Calendar className="h-5 w-5" />
              {isArabic ? 'حجز موعد' : 'Book Appointment'}
            </Button>
            <Button className="footer-button footer-button-secondary" size="lg">
              <Brain className="h-5 w-5" />
              {isArabic ? 'المساعد الافتراضي' : 'Virtual Assistant'}
            </Button>
          </div>
        </section>
      </div>
      
      {/* Advanced Virtual Assistant with Autonomous AI */}
      <div className="fixed bottom-6 right-6 z-50">
        <AdvancedVirtualAssistant 
          moduleContext="homepage_assistant" 
          companyId="demo-company"
          className="w-96 h-[500px] shadow-2xl"
        />
      </div>
      
      {/* Super-Intelligent AI Agent */}
      <AqlHRAIAssistant 
        moduleContext="dashboard.executive" 
        position="fixed"
        className="dashboard-ai-agent"
      />
      
      {/* AI Integration for Landing Page */}
      <UniversalAIIntegrator 
        pageType="platform" 
        moduleName="landing-page" 
        companyId="demo-company" 
        enabledFeatures={['contextual-help', 'onboarding-assistance', 'feature-discovery', 'user-guidance']}
      />
    </div>
  );
};

export default Index;