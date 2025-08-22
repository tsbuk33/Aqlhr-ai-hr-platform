import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useUserCompany } from '@/hooks/useUserCompany';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { 
  FileText, 
  Download, 
  Search, 
  Filter,
  Calendar,
  Building2,
  Shield,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';

interface GovDocument {
  id: string;
  tenant_id: string;
  system: string;
  title: string | null;
  storage_path: string | null;
  meta: any;
  created_at: string;
}

const GovernmentEvidence: React.FC = () => {
  const { companyId } = useUserCompany();
  const { isArabic } = useSimpleLanguage();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [systemFilter, setSystemFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  // Fetch government documents
  const { data: documents, isLoading } = useQuery({
    queryKey: ['gov-documents', companyId, systemFilter, dateFilter],
    queryFn: async () => {
      if (!companyId) return [];

      let query = supabase
        .from('gov_documents')
        .select('*')
        .eq('tenant_id', companyId)
        .order('created_at', { ascending: false });

      if (systemFilter && systemFilter !== 'all') {
        query = query.eq('system', systemFilter);
      }

      if (dateFilter && dateFilter !== 'all') {
        const now = new Date();
        let dateThreshold: Date;
        
        switch (dateFilter) {
          case 'today':
            dateThreshold = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
          case 'week':
            dateThreshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'month':
            dateThreshold = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
          default:
            dateThreshold = new Date(0);
        }
        
        query = query.gte('created_at', dateThreshold.toISOString());
      }

      const { data, error } = await query.limit(100);

      if (error) throw error;
      return data as GovDocument[];
    },
    enabled: !!companyId
  });

  // Filter documents by search term
  const filteredDocuments = documents?.filter(doc => 
    !searchTerm || 
    doc.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.system.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getSystemDisplayName = (system: string) => {
    const names: Record<string, { en: string; ar: string }> = {
      qiwa: { en: 'Qiwa', ar: 'قوى' },
      gosi: { en: 'GOSI', ar: 'التأمينات الاجتماعية' },
      absher: { en: 'Absher', ar: 'أبشر' }
    };
    return names[system] ? names[system][isArabic ? 'ar' : 'en'] : system;
  };

  const getSystemIcon = (system: string) => {
    switch (system) {
      case 'qiwa':
        return <Building2 className="h-4 w-4" />;
      case 'gosi':
        return <Shield className="h-4 w-4" />;
      case 'absher':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const handleDownload = async (doc: GovDocument) => {
    if (!doc.storage_path) {
      // Demo document - create a simple demo PDF
      const content = `${getSystemDisplayName(doc.system)} Document
      
Generated: ${format(new Date(doc.created_at), 'PPP')}
Document ID: ${doc.id}
System: ${doc.system}

This is a demo document for ${doc.title || 'Government Integration'}.

In a live system, this would contain:
- Official government document data
- Digital signatures and verification
- Compliance certificates
- Transaction records

Status: Demo Mode
`;
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = `${doc.system}_${doc.id.slice(0, 8)}.txt`;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      // In a real system, this would download from Supabase storage
      console.log('Would download from:', doc.storage_path);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {isArabic ? 'الأدلة الحكومية' : 'Government Evidence'}
        </h1>
        <p className="text-muted-foreground">
          {isArabic 
            ? 'الوثائق والأدلة من التكاملات الحكومية'
            : 'Documents and evidence from government integrations'
          }
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            {isArabic ? 'فلاتر البحث' : 'Search Filters'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={isArabic ? 'البحث في الوثائق...' : 'Search documents...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={systemFilter} onValueChange={setSystemFilter}>
              <SelectTrigger>
                <SelectValue placeholder={isArabic ? 'كل الأنظمة' : 'All Systems'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isArabic ? 'كل الأنظمة' : 'All Systems'}</SelectItem>
                <SelectItem value="qiwa">{getSystemDisplayName('qiwa')}</SelectItem>
                <SelectItem value="gosi">{getSystemDisplayName('gosi')}</SelectItem>
                <SelectItem value="absher">{getSystemDisplayName('absher')}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder={isArabic ? 'كل التواريخ' : 'All Dates'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isArabic ? 'كل التواريخ' : 'All Dates'}</SelectItem>
                <SelectItem value="today">{isArabic ? 'اليوم' : 'Today'}</SelectItem>
                <SelectItem value="week">{isArabic ? 'هذا الأسبوع' : 'This Week'}</SelectItem>
                <SelectItem value="month">{isArabic ? 'هذا الشهر' : 'This Month'}</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {filteredDocuments.length} {isArabic ? 'وثيقة' : 'documents'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <div className="space-y-3">
        {filteredDocuments.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">
                {isArabic ? 'لا توجد وثائق' : 'No Documents Found'}
              </h3>
              <p className="text-muted-foreground">
                {searchTerm || systemFilter !== 'all' || dateFilter !== 'all'
                  ? (isArabic ? 'لا توجد وثائق تطابق معايير البحث' : 'No documents match your search criteria')
                  : (isArabic ? 'لم يتم العثور على وثائق حكومية' : 'No government documents found')
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredDocuments.map((document) => (
            <Card key={document.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center gap-2">
                      {getSystemIcon(document.system)}
                      <Badge variant="secondary">
                        {getSystemDisplayName(document.system)}
                      </Badge>
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-medium">
                        {document.title || `${getSystemDisplayName(document.system)} Document`}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {isArabic ? 'تم الإنشاء في' : 'Created on'} {format(new Date(document.created_at), 'PPp')}
                      </p>
                      {document.meta && (
                        <p className="text-xs text-muted-foreground mt-1">
                          ID: {document.id.slice(0, 8)}...
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(document)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {isArabic ? 'تحميل' : 'Download'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {isArabic ? 'عرض' : 'View'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default GovernmentEvidence;