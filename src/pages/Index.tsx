import { MetricCard } from "@/components/MetricCard";
import { RecentActivity } from "@/components/RecentActivity";
import { OfficialLogos } from "@/components/OfficialLogos";
import { CompanyDataUpload } from "@/components/CompanyDataUpload";
import { AIAnalysisReport } from "@/components/AIAnalysisReport";
import PolicyUploadSystem from "@/components/PolicyUploadSystem";
import { Users, Calendar, FileText, Clock, BookOpen, Check, ArrowUp, ArrowDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const { t } = useLanguage();

  return (
    <div className="p-6 space-y-6 bg-background min-h-full">
      {/* Welcome Section */}
      <div className="bg-gradient-hero rounded-2xl p-8 text-white">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold mb-2">{t('dashboard.title')}</h1>
          <p className="text-white/90 text-lg mb-4">
            {t('dashboard.subtitle')}
          </p>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-status-success rounded-full"></div>
              <span>{t('dashboard.all_systems_operational')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-status-success rounded-full"></div>
              <span>106 {t('dashboard.modules_active')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-status-success rounded-full"></div>
              <span>{t('dashboard.government_integrations_live')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title={t('dashboard.total_employees')}
          value="2,847"
          description={t('dashboard.complete_profile_management')}
          icon={<Users className="h-6 w-6" />}
          variant="primary"
          trend={{ value: "+12%", isPositive: true }}
        />
        <MetricCard
          title={t('dashboard.ai_processes')}
          value="34"
          description="AI Tools + Tool Integrations"
          icon={<Check className="h-6 w-6" />}
          variant="secondary"
          trend={{ value: "+24", isPositive: true }}
        />
        <MetricCard
          title={t('dashboard.gov_integrations')}
          value="46"
          description="22 Gov + 24 Tools"
          icon={<FileText className="h-6 w-6" />}
          variant="accent"
          trend={{ value: "All Tools Integrated", isPositive: true }}
        />
        <MetricCard
          title={t('dashboard.compliance_score')}
          value="96.8%"
          description={t('dashboard.regulatory_compliance')}
          icon={<ArrowUp className="h-6 w-6" />}
          variant="success"
          trend={{ value: "+2.1%", isPositive: true }}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title={t('dashboard.saudization_rate')}
          value="67.2%"
          description={t('dashboard.green_nitaqat_target')}
          icon={<Calendar className="h-6 w-6" />}
          trend={{ value: "+1.8%", isPositive: true }}
        />
        <MetricCard
          title={t('dashboard.active_users')}
          value="1,847"
          description={t('dashboard.employee_self_service')}
          icon={<Users className="h-6 w-6" />}
          trend={{ value: "+156", isPositive: true }}
        />
        <MetricCard
          title={t('dashboard.documents_processed')}
          value="15,678"
          description={t('dashboard.ai_powered_verification')}
          icon={<FileText className="h-6 w-6" />}
          trend={{ value: "+1,234", isPositive: true }}
        />
        <MetricCard
          title={t('dashboard.training_hours')}
          value="1,247"
          description={t('dashboard.skills_development_completed')}
          icon={<BookOpen className="h-6 w-6" />}
          trend={{ value: "+89h", isPositive: true }}
        />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities - Takes 2 columns */}
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <MetricCard
            title={t('dashboard.monthly_payroll')}
            value="SAR 456K"
            description={t('dashboard.december_2024_processed')}
            icon={<Calendar className="h-6 w-6" />}
            variant="warning"
          />
          <MetricCard
            title={t('dashboard.attendance_rate')}
            value="98.2%"
            description={t('dashboard.real_time_tracking')}
            icon={<Clock className="h-6 w-6" />}
            variant="default"
            trend={{ value: "+0.5%", isPositive: true }}
          />
        </div>
      </div>

      {/* Platform Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface rounded-xl p-6 border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">{t('dashboard.platform_status_overview')}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-status-success">12</div>
              <div className="text-sm text-muted-foreground">{t('dashboard.core_hr_modules')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-primary">8</div>
              <div className="text-sm text-muted-foreground">{t('dashboard.payroll_modules')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-accent">10</div>
              <div className="text-sm text-muted-foreground">{t('dashboard.ai_features')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-secondary">109</div>
              <div className="text-sm text-muted-foreground">{t('dashboard.active_workflows')}</div>
            </div>
          </div>
        </div>

        {/* Official Logos */}
        <OfficialLogos />
      </div>

      {/* AI & Automation Analysis Report */}
      <AIAnalysisReport />

      {/* HR Policy Management System */}
      <PolicyUploadSystem />

      {/* Company Data Integration */}
      <div className="flex justify-center">
        <CompanyDataUpload />
      </div>
    </div>
  );
};

export default Index;
