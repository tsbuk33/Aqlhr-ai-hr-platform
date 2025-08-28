import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DocumentUploadButton } from './DocumentUploadButton';
import { useToast } from '@/hooks/use-toast';
import { useTenant } from '@/lib/useTenant';
import { useLocale } from '@/i18n/locale';
import { supabase } from '@/integrations/supabase/client';
import { 
  User, 
  FileText, 
  Search, 
  Download, 
  Eye, 
  Link2,
  Unlink,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Hash,
  Building2,
  Tags,
  Loader2,
  Plus,
  ExternalLink
} from 'lucide-react';
import { format, parseISO, isAfter, isBefore, addDays } from 'date-fns';
import { ar } from 'date-fns/locale';

export interface EmployeeDocSectionProps {
  /** Employee ID to display documents for */
  employeeId: string;
  /** Employee display name */
  employeeName?: string;
  /** Employee Iqama ID */
  employeeIqamaId?: string;
  /** Employee National ID */
  employeeNationalId?: string;
  /** Section title override */
  title?: string;
  /** Additional CSS classes */
  className?: string;
  /** Maximum height for document sections */
  maxHeight?: string;
  /** Show document statistics */
  showStats?: boolean;
  /** Show document linking features */
  showLinking?: boolean;
  /** Compact mode (reduced padding and spacing) */
  compact?: boolean;
}

interface DocumentRecord {
  id: string;
  title: string;
  doc_type: string;
  storage_bucket: string;
  storage_path: string;
  portal?: string;
  lang: string;
  employee_id: string | null;
  iqama_id: string | null;
  national_id: string | null;
  effective_date: string | null;
  expiry_date: string | null;
  ocr_text: string | null;
  ai_tags: string[];
  created_at: string;
  file_size?: number;
  mime_type?: string;
}

interface DocumentStats {
  employee_docs: number;
  linked_gov_docs: number;
  unlinked_gov_docs: number;
  expiring_soon: number;
}

interface LinkableGovDocument {
  id: string;
  title: string;
  doc_type: string;
  portal: string;
  iqama_id: string | null;
  national_id: string | null;
  created_at: string;
  similarity_score?: number;
}

export const EmployeeDocSection: React.FC<EmployeeDocSectionProps> = ({
  employeeId,
  employeeName,
  employeeIqamaId,
  employeeNationalId,
  title,
  className = '',
  maxHeight = '300px',
  showStats = true,
  showLinking = true,
  compact = false,
}) => {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [linkableGovDocs, setLinkableGovDocs] = useState<LinkableGovDocument[]>([]);
  const [stats, setStats] = useState<DocumentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [linking, setLinking] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBucket, setFilterBucket] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'expiry'>('date');
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const { tenantId } = useTenant();
  const { locale, t } = useLocale();
  const { toast } = useToast();
  const isRTL = locale === 'ar';

  useEffect(() => {
    if (tenantId && employeeId) {
      loadDocuments();
      if (showLinking) {
        loadLinkableGovDocuments();
      }
    }
  }, [tenantId, employeeId]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      
      // Load all documents related to this employee
      let query = supabase
        .from('documents')
        .select('*')
        .eq('tenant_id', tenantId);

      // Get documents directly linked to employee OR matching by Iqama/National ID
      const conditions = [`employee_id.eq.${employeeId}`];
      if (employeeIqamaId) {
        conditions.push(`iqama_id.eq.${employeeIqamaId}`);
      }
      if (employeeNationalId) {
        conditions.push(`national_id.eq.${employeeNationalId}`);
      }

      const { data: documentsData, error: docsError } = await supabase
        .from('documents')
        .select('*')
        .eq('tenant_id', tenantId)
        .or(conditions.join(','))
        .order('created_at', { ascending: false });

      if (docsError) throw docsError;

      setDocuments(documentsData || []);

      // Calculate stats if enabled
      if (showStats && documentsData) {
        const now = new Date();
        const expiryThreshold = addDays(now, 30);

        const employeeDocs = documentsData.filter(doc => doc.storage_bucket === 'employee_docs');
        const linkedGovDocs = documentsData.filter(doc => 
          doc.storage_bucket === 'gov_docs' && doc.employee_id === employeeId
        );
        const unlinkedGovDocs = documentsData.filter(doc => 
          doc.storage_bucket === 'gov_docs' && !doc.employee_id &&
          (doc.iqama_id === employeeIqamaId || doc.national_id === employeeNationalId)
        );
        
        const stats: DocumentStats = {
          employee_docs: employeeDocs.length,
          linked_gov_docs: linkedGovDocs.length,
          unlinked_gov_docs: unlinkedGovDocs.length,
          expiring_soon: documentsData.filter(doc => 
            doc.expiry_date && 
            isAfter(parseISO(doc.expiry_date), now) && 
            isBefore(parseISO(doc.expiry_date), expiryThreshold)
          ).length,
        };

        setStats(stats);
      }

    } catch (error: any) {
      console.error('Error loading employee documents:', error);
      toast({
        title: isRTL ? 'خطأ في تحميل المستندات' : 'Error Loading Documents',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadLinkableGovDocuments = async () => {
    try {
      // Find government documents that could be linked to this employee
      // but are not currently linked
      const conditions = [];
      if (employeeIqamaId) {
        conditions.push(`iqama_id.eq.${employeeIqamaId}`);
      }
      if (employeeNationalId) {
        conditions.push(`national_id.eq.${employeeNationalId}`);
      }

      if (conditions.length === 0) return;

      const { data: govDocs, error } = await supabase
        .from('documents')
        .select('id, title, doc_type, portal, iqama_id, national_id, created_at')
        .eq('tenant_id', tenantId)
        .eq('storage_bucket', 'gov_docs')
        .is('employee_id', null) // Not yet linked
        .or(conditions.join(','))
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Calculate similarity scores based on matching IDs
      const scored = (govDocs || []).map(doc => {
        let similarity_score = 0;
        if (doc.iqama_id === employeeIqamaId) similarity_score += 0.5;
        if (doc.national_id === employeeNationalId) similarity_score += 0.5;
        
        return { ...doc, similarity_score };
      }).sort((a, b) => (b.similarity_score || 0) - (a.similarity_score || 0));

      setLinkableGovDocs(scored);

    } catch (error: any) {
      console.error('Error loading linkable documents:', error);
    }
  };

  const linkDocument = async (documentId: string) => {
    try {
      setLinking(true);
      
      const { data, error } = await supabase.functions.invoke('doc-attach-v1', {
        body: {
          action: 'attach',
          document_id: documentId,
          employee_id: employeeId,
          tenant_id: tenantId,
        },
      });

      if (error) throw error;

      toast({
        title: isRTL ? 'تم ربط المستند' : 'Document Linked',
        description: isRTL ? 'تم ربط المستند بالموظف بنجاح' : 'Document successfully linked to employee',
      });

      // Reload documents
      await loadDocuments();
      if (showLinking) {
        await loadLinkableGovDocuments();
      }

    } catch (error: any) {
      console.error('Error linking document:', error);
      toast({
        title: isRTL ? 'خطأ في ربط المستند' : 'Error Linking Document',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLinking(false);
    }
  };

  const unlinkDocument = async (documentId: string) => {
    try {
      setLinking(true);
      
      const { data, error } = await supabase.functions.invoke('doc-attach-v1', {
        body: {
          action: 'detach',
          document_id: documentId,
          tenant_id: tenantId,
        },
      });

      if (error) throw error;

      toast({
        title: isRTL ? 'تم إلغاء ربط المستند' : 'Document Unlinked',
        description: isRTL ? 'تم إلغاء ربط المستند من الموظف' : 'Document unlinked from employee',
      });

      // Reload documents
      await loadDocuments();
      if (showLinking) {
        await loadLinkableGovDocuments();
      }

    } catch (error: any) {
      console.error('Error unlinking document:', error);
      toast({
        title: isRTL ? 'خطأ في إلغاء ربط المستند' : 'Error Unlinking Document',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLinking(false);
    }
  };

  const handleUploadComplete = (documentId: string) => {
    console.log('Document uploaded for employee:', documentId);
    loadDocuments(); // Reload documents
  };

  const downloadDocument = async (doc: DocumentRecord) => {
    try {
      const { data, error } = await supabase.storage
        .from(doc.storage_bucket)
        .download(doc.storage_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.title;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      toast({
        title: isRTL ? 'خطأ في التحميل' : 'Download Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const getDocumentTypeLabel = (type: string, bucket: string) => {
    if (bucket === 'gov_docs') {
      const typeLabels: Record<string, { en: string; ar: string }> = {
        iqama: { en: 'Iqama', ar: 'إقامة' },
        passport: { en: 'Passport', ar: 'جواز سفر' },
        visa: { en: 'Visa', ar: 'تأشيرة' },
        nitaqat_certificate: { en: 'Nitaqat Certificate', ar: 'شهادة نطاقات' },
        gosi_certificate: { en: 'GOSI Certificate', ar: 'شهادة التأمينات' },
        labor_office_document: { en: 'Labor Office Document', ar: 'مستند مكتب العمل' },
        ministry_document: { en: 'Ministry Document', ar: 'مستند الوزارة' },
        other: { en: 'Other', ar: 'أخرى' },
      };
      return typeLabels[type]?.[locale] || type;
    } else {
      const typeLabels: Record<string, { en: string; ar: string }> = {
        contract: { en: 'Employment Contract', ar: 'عقد عمل' },
        offer_letter: { en: 'Job Offer Letter', ar: 'خطاب عرض عمل' },
        resignation: { en: 'Resignation', ar: 'استقالة' },
        disciplinary: { en: 'Disciplinary Action', ar: 'إجراء تأديبي' },
        performance_review: { en: 'Performance Review', ar: 'تقييم أداء' },
        training_certificate: { en: 'Training Certificate', ar: 'شهادة تدريب' },
        medical_report: { en: 'Medical Report', ar: 'تقرير طبي' },
        other: { en: 'Other', ar: 'أخرى' },
      };
      return typeLabels[type]?.[locale] || type;
    }
  };

  const getExpiryStatus = (expiryDate: string | null) => {
    if (!expiryDate) return null;
    
    const now = new Date();
    const expiry = parseISO(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) {
      return { status: 'expired', days: Math.abs(daysUntilExpiry), color: 'bg-red-500' };
    } else if (daysUntilExpiry <= 30) {
      return { status: 'expiring', days: daysUntilExpiry, color: 'bg-orange-500' };
    } else {
      return { status: 'valid', days: daysUntilExpiry, color: 'bg-green-500' };
    }
  };

  const filteredDocuments = documents
    .filter(doc => {
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        if (!doc.title.toLowerCase().includes(searchLower) &&
            !doc.doc_type?.toLowerCase().includes(searchLower) &&
            !doc.ai_tags.some(tag => tag.toLowerCase().includes(searchLower))) {
          return false;
        }
      }
      
      if (filterBucket !== 'all' && doc.storage_bucket !== filterBucket) {
        return false;
      }
      
      if (filterType !== 'all' && doc.doc_type !== filterType) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'expiry':
          if (!a.expiry_date && !b.expiry_date) return 0;
          if (!a.expiry_date) return 1;
          if (!b.expiry_date) return -1;
          return new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime();
        case 'date':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  const employeeDocs = filteredDocuments.filter(doc => doc.storage_bucket === 'employee_docs');
  const govDocs = filteredDocuments.filter(doc => doc.storage_bucket === 'gov_docs');
  const uniqueDocTypes = Array.from(new Set(documents.map(doc => doc.doc_type).filter(Boolean)));

  const sectionPadding = compact ? 'p-3' : 'p-4';
  const headerPadding = compact ? 'pb-2' : 'pb-4';

  return (
    <Card className={className}>
      <CardHeader className={headerPadding}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20 text-blue-600">
              <User className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">
                {title || (isRTL ? 'مستندات الموظف' : 'Employee Documents')}
              </CardTitle>
              {employeeName && (
                <p className="text-sm text-muted-foreground mt-1">
                  {employeeName}
                  {employeeIqamaId && ` • ${isRTL ? 'الإقامة' : 'Iqama'}: ${employeeIqamaId}`}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadDocuments}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            
            {showLinking && linkableGovDocs.length > 0 && (
              <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Link2 className="h-4 w-4" />
                    <span className="ml-1">{linkableGovDocs.length}</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>
                      {isRTL ? 'ربط المستندات الحكومية' : 'Link Government Documents'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {linkableGovDocs.map(doc => (
                      <div key={doc.id} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{doc.title}</h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Badge variant="outline">{getDocumentTypeLabel(doc.doc_type, 'gov_docs')}</Badge>
                            {doc.portal && (
                              <Badge variant="secondary">{doc.portal.toUpperCase()}</Badge>
                            )}
                            {doc.similarity_score && doc.similarity_score > 0 && (
                              <Badge variant="default" className="bg-green-500">
                                {Math.round(doc.similarity_score * 100)}% {isRTL ? 'تطابق' : 'Match'}
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {doc.iqama_id && `${isRTL ? 'إقامة' : 'Iqama'}: ${doc.iqama_id}`}
                            {doc.national_id && ` • ${isRTL ? 'هوية' : 'ID'}: ${doc.national_id}`}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => linkDocument(doc.id)}
                          disabled={linking}
                        >
                          <Link2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            )}
            
            <DocumentUploadButton
              bucket="employee_docs"
              employeeId={employeeId}
              variant="default"
              size="sm"
              onUploadComplete={handleUploadComplete}
            />
          </div>
        </div>

        {/* Statistics */}
        {showStats && stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
            <div className="text-center p-2 bg-muted/50 rounded-lg">
              <div className="text-xl font-bold text-blue-600">
                {stats.employee_docs}
              </div>
              <div className="text-xs text-muted-foreground">
                {isRTL ? 'مستندات الموظف' : 'Employee Docs'}
              </div>
            </div>
            
            <div className="text-center p-2 bg-muted/50 rounded-lg">
              <div className="text-xl font-bold text-green-600">
                {stats.linked_gov_docs}
              </div>
              <div className="text-xs text-muted-foreground">
                {isRTL ? 'مستندات مربوطة' : 'Linked Gov Docs'}
              </div>
            </div>
            
            <div className="text-center p-2 bg-muted/50 rounded-lg">
              <div className="text-xl font-bold text-orange-600">
                {stats.unlinked_gov_docs}
              </div>
              <div className="text-xs text-muted-foreground">
                {isRTL ? 'غير مربوطة' : 'Unlinked'}
              </div>
            </div>
            
            <div className="text-center p-2 bg-muted/50 rounded-lg">
              <div className="text-xl font-bold text-red-600">
                {stats.expiring_soon}
              </div>
              <div className="text-xs text-muted-foreground">
                {isRTL ? 'تنتهي قريباً' : 'Expiring Soon'}
              </div>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className={sectionPadding}>
        {/* Filters and Search */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="flex-1 min-w-48">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={isRTL ? 'البحث في المستندات...' : 'Search documents...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                size={compact ? 'sm' : 'default'}
              />
            </div>
          </div>
          
          <Select value={filterBucket} onValueChange={setFilterBucket}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder={isRTL ? 'نوع المصدر' : 'Source'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isRTL ? 'جميع المصادر' : 'All Sources'}</SelectItem>
              <SelectItem value="employee_docs">{isRTL ? 'مستندات الموظف' : 'Employee Docs'}</SelectItem>
              <SelectItem value="gov_docs">{isRTL ? 'مستندات حكومية' : 'Government Docs'}</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={(value: 'date' | 'name' | 'expiry') => setSortBy(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">{isRTL ? 'التاريخ' : 'Date'}</SelectItem>
              <SelectItem value="name">{isRTL ? 'الاسم' : 'Name'}</SelectItem>
              <SelectItem value="expiry">{isRTL ? 'انتهاء الصلاحية' : 'Expiry'}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator className="mb-4" />

        {/* Document Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">
              {isRTL ? `جميع المستندات (${filteredDocuments.length})` : `All Documents (${filteredDocuments.length})`}
            </TabsTrigger>
            <TabsTrigger value="employee">
              {isRTL ? `الموظف (${employeeDocs.length})` : `Employee (${employeeDocs.length})`}
            </TabsTrigger>
            <TabsTrigger value="government">
              {isRTL ? `حكومية (${govDocs.length})` : `Government (${govDocs.length})`}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            <DocumentList 
              documents={filteredDocuments}
              loading={loading}
              isRTL={isRTL}
              maxHeight={maxHeight}
              onDownload={downloadDocument}
              onLink={showLinking ? linkDocument : undefined}
              onUnlink={showLinking ? unlinkDocument : undefined}
              getDocumentTypeLabel={getDocumentTypeLabel}
              getExpiryStatus={getExpiryStatus}
              linking={linking}
              compact={compact}
              employeeId={employeeId}
            />
          </TabsContent>
          
          <TabsContent value="employee" className="mt-4">
            <DocumentList 
              documents={employeeDocs}
              loading={loading}
              isRTL={isRTL}
              maxHeight={maxHeight}
              onDownload={downloadDocument}
              getDocumentTypeLabel={getDocumentTypeLabel}
              getExpiryStatus={getExpiryStatus}
              compact={compact}
              employeeId={employeeId}
            />
          </TabsContent>
          
          <TabsContent value="government" className="mt-4">
            <DocumentList 
              documents={govDocs}
              loading={loading}
              isRTL={isRTL}
              maxHeight={maxHeight}
              onDownload={downloadDocument}
              onLink={showLinking ? linkDocument : undefined}
              onUnlink={showLinking ? unlinkDocument : undefined}
              getDocumentTypeLabel={getDocumentTypeLabel}
              getExpiryStatus={getExpiryStatus}
              linking={linking}
              compact={compact}
              employeeId={employeeId}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Helper component for rendering document lists
const DocumentList: React.FC<{
  documents: DocumentRecord[];
  loading: boolean;
  isRTL: boolean;
  maxHeight: string;
  onDownload: (doc: DocumentRecord) => void;
  onLink?: (documentId: string) => void;
  onUnlink?: (documentId: string) => void;
  getDocumentTypeLabel: (type: string, bucket: string) => string;
  getExpiryStatus: (expiryDate: string | null) => any;
  linking?: boolean;
  compact?: boolean;
  employeeId: string;
}> = ({
  documents,
  loading,
  isRTL,
  maxHeight,
  onDownload,
  onLink,
  onUnlink,
  getDocumentTypeLabel,
  getExpiryStatus,
  linking = false,
  compact = false,
  employeeId,
}) => {
  const itemPadding = compact ? 'p-2' : 'p-3';
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2 text-muted-foreground">
          {isRTL ? 'جاري التحميل...' : 'Loading...'}
        </span>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p>{isRTL ? 'لا توجد مستندات' : 'No documents found'}</p>
        <p className="text-sm mt-1">
          {isRTL ? 'ارفع مستندات لهذا الموظف' : 'Upload documents for this employee'}
        </p>
      </div>
    );
  }

  return (
    <div 
      className="space-y-2 overflow-y-auto"
      style={{ maxHeight }}
    >
      {documents.map((doc) => {
        const expiryStatus = getExpiryStatus(doc.expiry_date);
        const isLinked = doc.employee_id === employeeId;
        const canLink = doc.storage_bucket === 'gov_docs' && !isLinked && onLink;
        const canUnlink = doc.storage_bucket === 'gov_docs' && isLinked && onUnlink;
        
        return (
          <div
            key={doc.id}
            className={`flex items-center justify-between ${itemPadding} border rounded-lg hover:bg-muted/50 transition-colors`}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {doc.storage_bucket === 'gov_docs' ? (
                  <Building2 className="h-4 w-4 flex-shrink-0 text-blue-600" />
                ) : (
                  <User className="h-4 w-4 flex-shrink-0 text-green-600" />
                )}
                <h4 className={`font-medium truncate ${compact ? 'text-sm' : ''}`}>
                  {doc.title}
                </h4>
                <Badge variant="outline" className="text-xs">
                  {getDocumentTypeLabel(doc.doc_type, doc.storage_bucket)}
                </Badge>
                {doc.portal && (
                  <Badge variant="secondary" className="text-xs">
                    {doc.portal.toUpperCase()}
                  </Badge>
                )}
                {doc.lang === 'ar' && (
                  <Badge variant="secondary" className="text-xs">
                    العربية
                  </Badge>
                )}
                {isLinked && (
                  <Badge variant="default" className="text-xs bg-green-500">
                    <Link2 className="h-3 w-3 mr-1" />
                    {isRTL ? 'مربوط' : 'Linked'}
                  </Badge>
                )}
              </div>
              
              <div className={`flex items-center gap-3 text-muted-foreground ${compact ? 'text-xs' : 'text-sm'}`}>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(parseISO(doc.created_at), compact ? 'P' : 'PPp', {
                    locale: isRTL ? ar : undefined
                  })}
                </span>
                
                {doc.iqama_id && (
                  <span className="flex items-center gap-1">
                    <Hash className="h-3 w-3" />
                    {doc.iqama_id}
                  </span>
                )}
                
                {expiryStatus && (
                  <span className="flex items-center gap-1">
                    {expiryStatus.status === 'expired' ? (
                      <AlertTriangle className="h-3 w-3 text-red-500" />
                    ) : expiryStatus.status === 'expiring' ? (
                      <Clock className="h-3 w-3 text-orange-500" />
                    ) : (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    )}
                    <Badge 
                      variant="outline" 
                      className={`text-xs text-white ${expiryStatus.color}`}
                    >
                      {expiryStatus.status === 'expired'
                        ? (isRTL ? `منتهية منذ ${expiryStatus.days} يوم` : `Expired ${expiryStatus.days}d ago`)
                        : expiryStatus.status === 'expiring'
                        ? (isRTL ? `تنتهي خلال ${expiryStatus.days} يوم` : `Expires in ${expiryStatus.days}d`)
                        : (isRTL ? `سارية ${expiryStatus.days} يوم` : `Valid ${expiryStatus.days}d`)
                      }
                    </Badge>
                  </span>
                )}
              </div>
              
              {doc.ai_tags.length > 0 && (
                <div className="flex items-center gap-1 mt-1">
                  <Tags className="h-3 w-3 text-muted-foreground" />
                  <div className="flex gap-1 flex-wrap">
                    {doc.ai_tags.slice(0, 2).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        🤖 {tag}
                      </Badge>
                    ))}
                    {doc.ai_tags.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{doc.ai_tags.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-1 ml-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDownload(doc)}
              >
                <Download className="h-4 w-4" />
              </Button>
              
              {canLink && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onLink(doc.id)}
                  disabled={linking}
                >
                  <Link2 className="h-4 w-4" />
                </Button>
              )}
              
              {canUnlink && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onUnlink(doc.id)}
                  disabled={linking}
                >
                  <Unlink className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};