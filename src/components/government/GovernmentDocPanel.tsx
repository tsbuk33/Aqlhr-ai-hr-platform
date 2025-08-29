import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Search, 
  Filter, 
  Upload, 
  Bot, 
  Download, 
  Eye, 
  Calendar,
  Building2,
  Users,
  CheckCircle,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { useLocale } from '@/i18n/locale';
import { UniversalDocumentManager } from '@/components/common/UniversalDocumentManager';
import { AqlHRAIAssistant } from '@/components/ai/AqlHRAIAssistant';
import { supabase } from '@/integrations/supabase/client';
import { getTenantIdOrDemo } from '@/lib/api/osi';
import { toast } from '@/hooks/use-toast';

interface GovernmentDocPanelProps {
  platform: 'qiwa' | 'gosi' | 'absher' | 'mudad' | 'mol';
  platformName: string;
  platformNameAr: string;
  companyId?: string;
  className?: string;
}

interface DocumentItem {
  id: string;
  filename: string;
  doc_type: string;
  employee_id?: string;
  uploaded_at: string;
  file_size: number;
  status: 'processing' | 'completed' | 'error';
  portal: string;
}

const GovernmentDocPanel: React.FC<GovernmentDocPanelProps> = ({
  platform,
  platformName,
  platformNameAr,
  companyId,
  className = ''
}) => {
  const { t, locale } = useLocale();
  const isArabic = locale === 'ar';
  
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [docTypeFilter, setDocTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('documents');

  // Load documents for this platform
  useEffect(() => {
    loadDocuments();
  }, [platform]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const tenantId = await getTenantIdOrDemo();
      
      const { data, error } = await supabase
        .from('documents_ingestion')
        .select(`
          id,
          filename,
          doc_type,
          employee_id,
          uploaded_at,
          file_size,
          status,
          portal
        `)
        .eq('company_id', tenantId)
        .eq('portal', platform)
        .order('uploaded_at', { ascending: false });

      if (error) {
        console.error('Error loading documents:', error);
        toast({
          title: isArabic ? 'خطأ في تحميل المستندات' : 'Error Loading Documents',
          description: isArabic ? 'حدث خطأ أثناء تحميل المستندات' : 'Failed to load documents',
          variant: 'destructive',
        });
      } else {
        setDocuments(data || []);
      }
    } catch (error) {
      console.error('Error loading documents:', error);
      toast({
        title: isArabic ? 'خطأ في النظام' : 'System Error',
        description: isArabic ? 'حدث خطأ غير متوقع' : 'Unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = !searchTerm || 
      doc.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.doc_type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDocType = docTypeFilter === 'all' || doc.doc_type === docTypeFilter;
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    
    return matchesSearch && matchesDocType && matchesStatus;
  });

  const getDocTypeStats = () => {
    const stats = documents.reduce((acc, doc) => {
      acc[doc.doc_type] = (acc[doc.doc_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(stats).map(([type, count]) => ({ type, count }));
  };

  const getStatusStats = () => {
    const stats = documents.reduce((acc, doc) => {
      acc[doc.status] = (acc[doc.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      processing: stats.processing || 0,
      completed: stats.completed || 0,
      error: stats.error || 0,
      total: documents.length
    };
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const statusStats = getStatusStats();
  const docTypeStats = getDocTypeStats();

  return (
    <div className={`space-y-6 ${className}`} dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6" />
            {isArabic ? `${t('documents', 'platform_documents')} ${platformNameAr}` : `${platformName} ${t('documents', 'title')}`}
          </h2>
          <p className="text-muted-foreground mt-1">
            t('documents', 'manage_track_documents').replace('{platform}', isArabic ? platformNameAr : platformName)
          </p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            {statusStats.completed} {t('documents', 'completed')}
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {statusStats.processing} {t('documents', 'processing')}
          </Badge>
          {statusStats.error > 0 && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              {statusStats.error} {t('documents', 'error')}
            </Badge>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="documents">
            {t('documents', 'title')} ({documents.length})
          </TabsTrigger>
          <TabsTrigger value="upload">
            {t('documents', 'upload_documents')}
          </TabsTrigger>
          <TabsTrigger value="ai-search">
            {t('documents', 'ai_search')}
          </TabsTrigger>
        </TabsList>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-4">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t('documents', 'search_documents')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Select value={docTypeFilter} onValueChange={setDocTypeFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder={t('documents', 'document_type')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('documents', 'all_types')}</SelectItem>
                      {docTypeStats.map(({ type }) => (
                        <SelectItem key={type} value={type}>
                          {type} ({docTypeStats.find(s => s.type === type)?.count || 0})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder={t('documents', 'status')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('documents', 'all_status')}</SelectItem>
                      <SelectItem value="completed">{t('documents', 'completed')}</SelectItem>
                      <SelectItem value="processing">{t('documents', 'processing')}</SelectItem>
                      <SelectItem value="error">{t('documents', 'error')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents List */}
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <Card>
              <CardContent className="text-center p-8">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {t('documents', 'no_documents')}
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm || docTypeFilter !== 'all' || statusFilter !== 'all'
                    ? t('documents', 'no_documents_filters')
                    : t('documents', 'no_documents_uploaded')
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredDocuments.map((doc) => (
                <Card key={doc.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex-shrink-0">
                          <FileText className="h-8 w-8 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{doc.filename}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{doc.doc_type}</span>
                            <span>{formatFileSize(doc.file_size)}</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(doc.uploaded_at).toLocaleDateString(isArabic ? 'ar-SA' : 'en-US')}
                            </span>
                            {doc.employee_id && (
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {doc.employee_id}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={
                            doc.status === 'completed' ? 'default' : 
                            doc.status === 'processing' ? 'secondary' : 'destructive'
                          }
                        >
                          {doc.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                          {doc.status === 'processing' && <Clock className="h-3 w-3 mr-1" />}
                          {doc.status === 'error' && <AlertTriangle className="h-3 w-3 mr-1" />}
                          {doc.status === 'completed' ? (isArabic ? 'مكتمل' : 'Completed') :
                           doc.status === 'processing' ? (isArabic ? 'معالجة' : 'Processing') :
                           (isArabic ? 'خطأ' : 'Error')}
                        </Badge>
                        
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Upload Tab */}
        <TabsContent value="upload" className="space-y-4">
          <UniversalDocumentManager
            moduleName={isArabic ? platformNameAr : platformName}
            moduleNameAr={platformNameAr}
            description={isArabic 
              ? `رفع وإدارة مستندات منصة ${platformNameAr} مع معالجة ذكية بالذكاء الاصطناعي`
              : `Upload and manage ${platformName} platform documents with AI-powered processing`
            }
            descriptionAr={`رفع وإدارة مستندات منصة ${platformNameAr} مع معالجة ذكية بالذكاء الاصطناعي`}
            platform={platform}
            moduleType="government"
            acceptedTypes={['.pdf', '.xlsx', '.xls', '.doc', '.docx', '.jpg', '.jpeg', '.png']}
            maxFileSize={20 * 1024 * 1024}
            maxFiles={50}
            onUploadSuccess={loadDocuments}
          />
        </TabsContent>

        {/* AI Search Tab */}
        <TabsContent value="ai-search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                {t('documents', 'smart_document_search')}
              </CardTitle>
              <CardDescription>
                t('documents', 'ask_about_documents').replace('{platform}', isArabic ? platformNameAr : platformName)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AqlHRAIAssistant
                moduleContext="government"
                companyId={companyId}
                position="static"
                className="border-0 shadow-none"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GovernmentDocPanel;