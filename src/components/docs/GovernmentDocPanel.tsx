import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DocumentUploadButton } from './DocumentUploadButton';
import { useToast } from '@/hooks/use-toast';
import { useTenant } from '@/lib/useTenant';
import { useLocale } from '@/i18n/locale';
import { supabase } from '@/integrations/supabase/client';
import { 
  Building2, 
  FileText, 
  Search, 
  Download, 
  Eye, 
  Filter,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  ExternalLink,
  Hash,
  User,
  Tags,
  Loader2
} from 'lucide-react';
import { format, parseISO, isAfter, isBefore, addDays } from 'date-fns';
import { ar } from 'date-fns/locale';

export interface GovernmentDocPanelProps {
  /** Government portal identifier */
  portal: 'qiwa' | 'gosi' | 'absher' | 'mudad' | 'mol' | 'other';
  /** Panel title override */
  title?: string;
  /** Panel description override */
  description?: string;
  /** Additional CSS classes */
  className?: string;
  /** Maximum height for document list */
  maxHeight?: string;
  /** Show document statistics */
  showStats?: boolean;
  /** Show quick actions */
  showActions?: boolean;
  /** Custom portal color theme */
  portalColor?: string;
}

interface DocumentRecord {
  id: string;
  title: string;
  doc_type: string;
  storage_path: string;
  portal: string;
  lang: string;
  effective_date: string | null;
  expiry_date: string | null;
  iqama_id: string | null;
  national_id: string | null;
  ocr_text: string | null;
  ai_tags: string[];
  created_at: string;
  file_size?: number;
  mime_type?: string;
}

interface DocumentStats {
  total_documents: number;
  expiring_soon: number;
  by_type: Record<string, number>;
  by_language: Record<string, number>;
}

const PORTAL_CONFIG = {
  qiwa: {
    name: { en: 'Qiwa Platform', ar: 'منصة قوى' },
    color: '#1e40af',
    icon: Building2,
    url: 'https://qiwa.sa'
  },
  gosi: {
    name: { en: 'GOSI', ar: 'التأمينات الاجتماعية' },
    color: '#059669',
    icon: Building2,
    url: 'https://www.gosi.gov.sa'
  },
  absher: {
    name: { en: 'Absher', ar: 'أبشر' },
    color: '#7c3aed',
    icon: Building2,
    url: 'https://www.absher.sa'
  },
  mudad: {
    name: { en: 'Mudad', ar: 'مداد' },
    color: '#dc2626',
    icon: Building2,
    url: 'https://mudad.gov.sa'
  },
  mol: {
    name: { en: 'Ministry of Labor', ar: 'وزارة الموارد البشرية' },
    color: '#ea580c',
    icon: Building2,
    url: 'https://hrsd.gov.sa'
  },
  other: {
    name: { en: 'Other Government', ar: 'جهة حكومية أخرى' },
    color: '#64748b',
    icon: Building2,
    url: '#'
  }
};

export const GovernmentDocPanel: React.FC<GovernmentDocPanelProps> = ({
  portal,
  title,
  description,
  className = '',
  maxHeight = '400px',
  showStats = true,
  showActions = true,
  portalColor,
}) => {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [stats, setStats] = useState<DocumentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterLanguage, setFilterLanguage] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'expiry'>('date');
  const { tenantId } = useTenant();
  const { locale, t } = useLocale();
  const { toast } = useToast();
  const isRTL = locale === 'ar';

  const portalConfig = PORTAL_CONFIG[portal];
  const themeColor = portalColor || portalConfig.color;

  useEffect(() => {
    if (tenantId) {
      loadDocuments();
    }
  }, [tenantId, portal]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      
      // Load documents
      const { data: documentsData, error: docsError } = await supabase
        .from('documents')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('storage_bucket', 'gov_docs')
        .eq('portal', portal)
        .order('created_at', { ascending: false });

      if (docsError) throw docsError;

      setDocuments(documentsData || []);

      // Calculate stats if enabled
      if (showStats && documentsData) {
        const now = new Date();
        const expiryThreshold = addDays(now, 30); // 30 days threshold

        const stats: DocumentStats = {
          total_documents: documentsData.length,
          expiring_soon: documentsData.filter(doc => 
            doc.expiry_date && 
            isAfter(parseISO(doc.expiry_date), now) && 
            isBefore(parseISO(doc.expiry_date), expiryThreshold)
          ).length,
          by_type: {},
          by_language: {}
        };

        // Group by document type
        documentsData.forEach(doc => {
          const type = doc.doc_type || 'unknown';
          stats.by_type[type] = (stats.by_type[type] || 0) + 1;
          
          const lang = doc.lang || 'en';
          stats.by_language[lang] = (stats.by_language[lang] || 0) + 1;
        });

        setStats(stats);
      }

    } catch (error: any) {
      console.error('Error loading government documents:', error);
      toast({
        title: isRTL ? 'خطأ في تحميل المستندات' : 'Error Loading Documents',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUploadComplete = (documentId: string) => {
    console.log('Document uploaded:', documentId);
    loadDocuments(); // Reload documents
  };

  const downloadDocument = async (doc: DocumentRecord) => {
    try {
      const { data, error } = await supabase.storage
        .from('gov_docs')
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

  const getDocumentTypeLabel = (type: string) => {
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
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        if (!doc.title.toLowerCase().includes(searchLower) &&
            !doc.doc_type?.toLowerCase().includes(searchLower) &&
            !doc.iqama_id?.toLowerCase().includes(searchLower) &&
            !doc.national_id?.toLowerCase().includes(searchLower) &&
            !doc.ai_tags.some(tag => tag.toLowerCase().includes(searchLower))) {
          return false;
        }
      }
      
      // Type filter
      if (filterType !== 'all' && doc.doc_type !== filterType) {
        return false;
      }
      
      // Language filter
      if (filterLanguage !== 'all' && doc.lang !== filterLanguage) {
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

  const uniqueDocTypes = Array.from(new Set(documents.map(doc => doc.doc_type).filter(Boolean)));

  return (
    <Card className={`${className}`} style={{ borderColor: `${themeColor}20` }}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="p-2 rounded-lg text-white"
              style={{ backgroundColor: themeColor }}
            >
              <portalConfig.icon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">
                {title || portalConfig.name[locale]}
              </CardTitle>
              {description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {description}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {showActions && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadDocuments}
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
                
                {portalConfig.url !== '#' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(portalConfig.url, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
              </>
            )}
            
            <DocumentUploadButton
              bucket="gov_docs"
              portal={portal}
              variant="default"
              size="sm"
              onUploadComplete={handleUploadComplete}
              style={{ backgroundColor: themeColor }}
            />
          </div>
        </div>

        {/* Statistics */}
        {showStats && stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold" style={{ color: themeColor }}>
                {stats.total_documents}
              </div>
              <div className="text-xs text-muted-foreground">
                {isRTL ? 'إجمالي المستندات' : 'Total Documents'}
              </div>
            </div>
            
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {stats.expiring_soon}
              </div>
              <div className="text-xs text-muted-foreground">
                {isRTL ? 'تنتهي قريباً' : 'Expiring Soon'}
              </div>
            </div>
            
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {Object.keys(stats.by_type).length}
              </div>
              <div className="text-xs text-muted-foreground">
                {isRTL ? 'أنواع المستندات' : 'Document Types'}
              </div>
            </div>
            
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {stats.by_language.ar || 0}
              </div>
              <div className="text-xs text-muted-foreground">
                {isRTL ? 'مستندات عربية' : 'Arabic Documents'}
              </div>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Filters and Search */}
        <div className="flex flex-wrap gap-2">
          <div className="flex-1 min-w-48">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={isRTL ? 'البحث في المستندات...' : 'Search documents...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={isRTL ? 'نوع المستند' : 'Document Type'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isRTL ? 'جميع الأنواع' : 'All Types'}</SelectItem>
              {uniqueDocTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {getDocumentTypeLabel(type)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={filterLanguage} onValueChange={setFilterLanguage}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder={isRTL ? 'اللغة' : 'Language'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isRTL ? 'جميع اللغات' : 'All Languages'}</SelectItem>
              <SelectItem value="en">{isRTL ? 'إنجليزي' : 'English'}</SelectItem>
              <SelectItem value="ar">{isRTL ? 'عربي' : 'Arabic'}</SelectItem>
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

        <Separator />

        {/* Document List */}
        <div 
          className="space-y-3 overflow-y-auto"
          style={{ maxHeight }}
        >
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2 text-muted-foreground">
                {isRTL ? 'جاري التحميل...' : 'Loading...'}
              </span>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>
                {searchTerm || filterType !== 'all' || filterLanguage !== 'all'
                  ? (isRTL ? 'لا توجد مستندات تطابق المرشحات' : 'No documents match the filters')
                  : (isRTL ? 'لا توجد مستندات' : 'No documents found')
                }
              </p>
              <p className="text-sm mt-1">
                {isRTL ? 'ابدأ برفع مستندات من منصة' : 'Start by uploading documents from'} {portalConfig.name[locale]}
              </p>
            </div>
          ) : (
            filteredDocuments.map((doc) => {
              const expiryStatus = getExpiryStatus(doc.expiry_date);
              
              return (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="h-4 w-4 flex-shrink-0" />
                      <h4 className="font-medium truncate">{doc.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {getDocumentTypeLabel(doc.doc_type)}
                      </Badge>
                      {doc.lang === 'ar' && (
                        <Badge variant="secondary" className="text-xs">
                          العربية
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(parseISO(doc.created_at), 'PPp', {
                          locale: isRTL ? ar : undefined
                        })}
                      </span>
                      
                      {doc.iqama_id && (
                        <span className="flex items-center gap-1">
                          <Hash className="h-3 w-3" />
                          {doc.iqama_id}
                        </span>
                      )}
                      
                      {doc.national_id && (
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {doc.national_id}
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
                      <div className="flex items-center gap-1 mt-2">
                        <Tags className="h-3 w-3 text-muted-foreground" />
                        <div className="flex gap-1 flex-wrap">
                          {doc.ai_tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              🤖 {tag}
                            </Badge>
                          ))}
                          {doc.ai_tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{doc.ai_tags.length - 3}
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
                      onClick={() => downloadDocument(doc)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};