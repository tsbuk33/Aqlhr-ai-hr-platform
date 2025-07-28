import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ModuleTooltip, HowToUsePanel, ModuleDocumentUploader, ModuleAIChat, ModuleDiagnosticPanel } from '@/components/universal';
import CenteredLayout from '@/components/layout/CenteredLayout';
import { useAPITranslations } from '@/hooks/useAPITranslations';
import { useLanguage } from '@/hooks/useLanguageCompat';

const ExpenseManagement = () => {
  const { t } = useAPITranslations();
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <CenteredLayout 
      title={t('payroll.expenseManagement.title')}
      description={t('payroll.expenseManagement.description')}
      className="space-y-6"
    >
      {/* Universal Features */}
      <ModuleTooltip moduleKey="payroll.expenseManagement" showIcon>
        <HowToUsePanel moduleKey="payroll.expenseManagement" />
      </ModuleTooltip>
      
      <ModuleDocumentUploader moduleKey="payroll.expenseManagement" />
      <ModuleAIChat moduleKey="payroll.expenseManagement" />
      <ModuleDiagnosticPanel moduleKey="payroll.expenseManagement" />
      
      {/* Original Content */}
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Expense Management</h1>
        <p className="text-muted-foreground">Employee expenses and reimbursements</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">SAR 78,900</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">23</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">2.1 days</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Reimbursed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">SAR 65K</div>
          </CardContent>
        </Card>
      </div>
    </div>
    </CenteredLayout>
  );
};

export default ExpenseManagement;