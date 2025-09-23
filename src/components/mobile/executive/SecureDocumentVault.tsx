import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { supabase } from '@/integrations/supabase/client';
import { 
  Lock, 
  Shield, 
  FileText, 
  Download, 
  Eye, 
  Search,
  Filter,
  Star,
  Clock,
  User
} from 'lucide-react';

interface SecureDocument {
  id: string;
  title: string;
  titleAr: string;
  category: string;
  classification: 'confidential' | 'restricted' | 'top-secret';
  size: string;
  lastModified: string;
  owner: string;
  starred: boolean;
  thumbnail?: string;
}

export const SecureDocumentVault: React.FC = () => {
  const { lang: locale } = useUnifiedLocale();
  const [documents, setDocuments] = useState<SecureDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedClassification, setSelectedClassification] = useState('all');
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  const mockDocuments: SecureDocument[] = [
    {
      id: '1',
      title: 'Q4 Financial Strategy',
      titleAr: 'استراتيجية الربع الرابع المالية',
      category: 'Financial',
      classification: 'confidential',
      size: '2.3 MB',
      lastModified: '2024-01-15',
      owner: 'CFO Office',
      starred: true
    },
    {
      id: '2',
      title: 'Government Relations Report',
      titleAr: 'تقرير العلاقات الحكومية',
      category: 'Government',
      classification: 'restricted',
      size: '1.8 MB',
      lastModified: '2024-01-12',
      owner: 'Legal Department',
      starred: false
    },
    {
      id: '3',
      title: 'Strategic Partnership Agreement',
      titleAr: 'اتفاقية الشراكة الاستراتيجية',
      category: 'Legal',
      classification: 'top-secret',
      size: '5.1 MB',
      lastModified: '2024-01-10',
      owner: 'CEO Office',
      starred: true
    }
  ];

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      // For now, use mock data
      // In production, this would query the secure documents table
      setDocuments(mockDocuments);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentAccess = async (documentId: string) => {
    try {
      const { data } = await supabase.functions.invoke('access-secure-document', {
        body: { documentId }
      });
      
      if (data?.accessUrl) {
        window.open(data.accessUrl, '_blank');
      }
    } catch (error) {
      console.error('Error accessing document:', error);
    }
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'top-secret': return 'bg-destructive text-destructive-foreground';
      case 'confidential': return 'bg-orange-500 text-white';
      case 'restricted': return 'bg-yellow-500 text-black';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getClassificationIcon = (classification: string) => {
    switch (classification) {
      case 'top-secret': return <Shield className="h-3 w-3" />;
      case 'confidential': return <Lock className="h-3 w-3" />;
      case 'restricted': return <Eye className="h-3 w-3" />;
      default: return <FileText className="h-3 w-3" />;
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.titleAr.includes(searchQuery);
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesClassification = selectedClassification === 'all' || doc.classification === selectedClassification;
    
    return matchesSearch && matchesCategory && matchesClassification;
  });

  const categories = ['all', 'Financial', 'Government', 'Legal', 'Strategic', 'Operations'];
  const classifications = ['all', 'confidential', 'restricted', 'top-secret'];

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {locale === 'ar' ? 'خزانة الوثائق الآمنة' : 'Secure Document Vault'}
          </h2>
          <p className="text-muted-foreground">
            {locale === 'ar' ? 'الوصول الآمن للوثائق التنفيذية' : 'Secure access to executive documents'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <Badge variant="secondary">
            {locale === 'ar' ? 'آمن' : 'Secure'}
          </Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={locale === 'ar' ? 'البحث في الوثائق...' : 'Search documents...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {locale === 'ar' ? 'الفئة:' : 'Category:'}
                </span>
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="text-sm bg-background border rounded px-2 py-1"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? (locale === 'ar' ? 'الكل' : 'All') : cat}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {locale === 'ar' ? 'التصنيف:' : 'Classification:'}
                </span>
                <select 
                  value={selectedClassification}
                  onChange={(e) => setSelectedClassification(e.target.value)}
                  className="text-sm bg-background border rounded px-2 py-1"
                >
                  {classifications.map(cls => (
                    <option key={cls} value={cls}>
                      {cls === 'all' ? (locale === 'ar' ? 'الكل' : 'All') : cls}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Grid */}
      <div className="grid gap-4">
        {filteredDocuments.map((doc) => (
          <Card key={doc.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-foreground">
                      {locale === 'ar' ? doc.titleAr : doc.title}
                    </h3>
                    {doc.starred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{doc.owner}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{doc.lastModified}</span>
                    </div>
                    <span>{doc.size}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline">{doc.category}</Badge>
                    <Badge className={getClassificationColor(doc.classification)}>
                      {getClassificationIcon(doc.classification)}
                      <span className="ml-1 capitalize">{doc.classification}</span>
                    </Badge>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleDocumentAccess(doc.id)}
                    className="w-full"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    {locale === 'ar' ? 'عرض' : 'View'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDocumentAccess(doc.id)}
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    {locale === 'ar' ? 'تحميل' : 'Download'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {locale === 'ar' ? 'لا توجد وثائق' : 'No Documents Found'}
            </h3>
            <p className="text-muted-foreground">
              {locale === 'ar' ? 'لم يتم العثور على وثائق تطابق معايير البحث' : 'No documents match your search criteria'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};