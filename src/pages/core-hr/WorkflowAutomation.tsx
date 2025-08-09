import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UniversalDocumentManager } from "@/components/common/UniversalDocumentManager";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { PageLayout } from "@/components/layout/PageLayout";
import { Upload } from "lucide-react";
import { AqlHRAIAssistant } from '@/components/ai';

const WorkflowAutomation = () => {
  const { t } = useLanguage();
  const { toast } = useToast();

  return (
    <PageLayout
      title={t('core_hr.workflow_automation')}
      description={t('core_hr.workflow_automation_desc')}
    >
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('core_hr.active_workflows')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">34</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('core_hr.automated_tasks')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">1,234</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('core_hr.time_saved')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">456 hrs</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('core_hr.success_rate')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">98.7%</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">{t('core_hr.overview') || 'Overview'}</TabsTrigger>
          <TabsTrigger value="documents">{t('core_hr.documents') || 'Documents'}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('core_hr.workflow_automation')}</CardTitle>
              <CardDescription>
                {t('core_hr.workflow_automation_overview') || 'Comprehensive workflow automation and process management'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t('core_hr.workflow_automation_content') || 'Automate HR processes, track workflow efficiency, and manage task automation.'}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <UniversalDocumentManager
            moduleName="Workflow Automation"
            moduleNameAr="أتمتة سير العمل"
            description="Upload workflow diagrams, process documentation, automation scripts, and system configurations"
            descriptionAr="رفع مخططات سير العمل ووثائق العمليات ونصوص الأتمتة وتكوينات النظام"
            platform="workflow-automation"
            moduleType="hr"
            acceptedTypes={['.pdf', '.docx', '.xlsx', '.csv', '.bpmn', '.json', '.xml']}
            maxFileSize={25 * 1024 * 1024}
            maxFiles={35}
          />
        </TabsContent>
      </Tabs>
      
      <AqlHRAIAssistant moduleContext="core-hr.workflowAutomation" />
    </PageLayout>
  );
};

export default WorkflowAutomation;