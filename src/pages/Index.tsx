import { MetricCard } from "@/components/MetricCard";
import { RecentActivity } from "@/components/RecentActivity";
import { OfficialLogos } from "@/components/OfficialLogos";
import { Users, Calendar, FileText, Clock, BookOpen, Check, ArrowUp, ArrowDown } from "lucide-react";

const Index = () => {
  return (
    <div className="p-6 space-y-6 bg-background min-h-full">
      {/* Welcome Section */}
      <div className="bg-gradient-hero rounded-2xl p-8 text-white">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold mb-2">Welcome to SanadHR</h1>
          <p className="text-white/90 text-lg mb-4">
            Complete HR Management Platform - Designed for Excellence in Saudi Arabia
          </p>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-status-success rounded-full"></div>
              <span>All Systems Operational</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-status-success rounded-full"></div>
              <span>85+ Modules Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-status-success rounded-full"></div>
              <span>Government Integrations Live</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Employees"
          value="2,847"
          description="Complete profile management"
          icon={<Users className="h-6 w-6" />}
          variant="primary"
          trend={{ value: "+12%", isPositive: true }}
        />
        <MetricCard
          title="AI Processes"
          value="18"
          description="Automated workflows active"
          icon={<Check className="h-6 w-6" />}
          variant="secondary"
          trend={{ value: "+3", isPositive: true }}
        />
        <MetricCard
          title="Gov Integrations"
          value="8"
          description="Connected platforms"
          icon={<FileText className="h-6 w-6" />}
          variant="accent"
        />
        <MetricCard
          title="Compliance Score"
          value="96.8%"
          description="Regulatory compliance"
          icon={<ArrowUp className="h-6 w-6" />}
          variant="success"
          trend={{ value: "+2.1%", isPositive: true }}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Saudization Rate"
          value="67.2%"
          description="Target: 70% (Green Nitaqat)"
          icon={<Calendar className="h-6 w-6" />}
          trend={{ value: "+1.8%", isPositive: true }}
        />
        <MetricCard
          title="Active Users"
          value="1,847"
          description="Employee self-service"
          icon={<Users className="h-6 w-6" />}
          trend={{ value: "+156", isPositive: true }}
        />
        <MetricCard
          title="Documents Processed"
          value="15,678"
          description="AI-powered verification"
          icon={<FileText className="h-6 w-6" />}
          trend={{ value: "+1,234", isPositive: true }}
        />
        <MetricCard
          title="Training Hours"
          value="1,247"
          description="Skills development completed"
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
            title="Monthly Payroll"
            value="SAR 456K"
            description="December 2024 processed"
            icon={<Calendar className="h-6 w-6" />}
            variant="warning"
          />
          <MetricCard
            title="Attendance Rate"
            value="98.2%"
            description="Real-time tracking"
            icon={<Clock className="h-6 w-6" />}
            variant="default"
            trend={{ value: "+0.5%", isPositive: true }}
          />
        </div>
      </div>

      {/* Platform Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface rounded-xl p-6 border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Platform Status Overview</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-status-success">12</div>
              <div className="text-sm text-muted-foreground">Core HR Modules</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-primary">8</div>
              <div className="text-sm text-muted-foreground">Payroll Modules</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-accent">8</div>
              <div className="text-sm text-muted-foreground">AI Features</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-secondary">47</div>
              <div className="text-sm text-muted-foreground">Active Workflows</div>
            </div>
          </div>
        </div>

        {/* Official Logos */}
        <OfficialLogos />
      </div>
    </div>
  );
};

export default Index;
