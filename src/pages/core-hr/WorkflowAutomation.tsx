import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SanadAIFileProcessor } from "@/components/sanad/SanadAIFileProcessor";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

const WorkflowAutomation = () => {
  const { t } = useLanguage();
  const { toast } = useToast();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('core_hr.workflow_automation')}</h1>
        <p className="text-muted-foreground">{t('core_hr.workflow_automation_desc')}</p>
      </div>
      
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                {t('core_hr.upload_documents') || 'Upload Documents'}
              </CardTitle>
              <CardDescription>
                {t('core_hr.upload_workflow_docs') || 'Upload workflow automation files for AI processing'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SanadAIFileProcessor
                platform="workflow-automation"
                moduleType="core-hr"
                onFileProcessed={(file) => {
                  toast({
                    title: t('core_hr.file_processed') || "File processed successfully",
                    description: t('core_hr.file_processed_desc') || `${file.name} has been processed and analyzed.`,
                  });
                }}
                acceptedTypes={['.pdf', '.docx', '.xlsx', '.csv']}
                maxFileSize={10}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkflowAutomation;