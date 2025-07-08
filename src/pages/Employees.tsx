import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Employees = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('employees.master_data')}</h1>
          <p className="text-muted-foreground">{t('employees.complete_profile_mgmt')}</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          {t('employees.add_employee_short')}
        </Button>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          {t('common.search')}
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          {t('common.filter')}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('employees.total_employees')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-primary">2,847</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('employees.active_contracts')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-success">2,847</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('core_hr.saudization_rate')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-accent">67.2%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('employees.compliance_score')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-primary">96.8%</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('employees.employee_directory')}</CardTitle>
          <CardDescription>{t('employees.manage_profiles')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">{t('employees.table_implemented')}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Employees;