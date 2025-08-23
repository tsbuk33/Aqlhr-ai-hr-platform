import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { useCCIEvidence } from '@/hooks/useCCIEvidence';
import { EvidenceUploadDialog } from '@/components/cci/EvidenceUploadDialog';
import { useLocale } from '@/i18n/locale';
import { 
  FileText, 
  Image, 
  Link, 
  StickyNote,
  Search,
  Filter,
  Upload,
  Tags,
  Calendar,
  User,
  Brain,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

const Evidence: React.FC = () => {
  const { locale } = useLocale();
  const isArabic = locale === 'ar';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  
  const { 
    evidence, 
    loading, 
    uploading, 
    uploadEvidence, 
    updateEvidenceTags,
    deleteEvidence 
  } = useCCIEvidence();

  // Filter evidence based on search and type
  const filteredEvidence = evidence.filter(item => {
    const matchesSearch = !searchTerm || 
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.ai_tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedType === 'all' || item.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  // Statistics
  const stats = {
    total: evidence.length,
    processed: evidence.filter(e => e.processing_status === 'completed').length,
    aiTagged: evidence.filter(e => e.ai_tags && e.ai_tags.length > 0).length,
    types: [...new Set(evidence.map(e => e.type))].length
  };

  const getTypeIcon = (type?: string) => {
    switch (type) {
      case 'document': return <FileText className="h-4 w-4" />;
      case 'image': return <Image className="h-4 w-4" />;
      case 'link': return <Link className="h-4 w-4" />;
      case 'note': return <StickyNote className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type?: string) => {
    switch (type) {
      case 'document': return 'text-blue-600 bg-blue-100';
      case 'image': return 'text-green-600 bg-green-100';
      case 'link': return 'text-purple-600 bg-purple-100';
      case 'note': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'processing': return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'pending': return <Clock className="h-4 w-4 text-orange-600" />;
      case 'rejected': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className={`min-h-screen bg-background p-6 ${isArabic ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isArabic ? 'جدار الأدلة' : 'Evidence Wall'}
            </h1>
            <p className="text-muted-foreground">
              {isArabic ? 'عقل للموارد البشرية - توثيق الأدلة الثقافية' : 'AqlHR — Cultural Evidence Documentation'}
            </p>
          </div>
          <div className="flex gap-2">
            <EvidenceUploadDialog onUpload={uploadEvidence} uploading={uploading}>
              <Button disabled={uploading}>
                {uploading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                {isArabic ? 'رفع دليل' : 'Upload Evidence'}
              </Button>
            </EvidenceUploadDialog>
            <Button variant="outline">
              <Tags className="mr-2 h-4 w-4" />
              {isArabic ? 'إدارة العلامات' : 'Manage Tags'}
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder={isArabic ? 'البحث في الأدلة...' : 'Search evidence...'}
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  {isArabic ? 'فلترة' : 'Filter'}
                </Button>
                <Button variant="outline" size="sm">
                  {isArabic ? 'النوع' : 'Type'}
                </Button>
                <Button variant="outline" size="sm">
                  {isArabic ? 'التاريخ' : 'Date'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Evidence Tabs */}
        <Tabs value={selectedType} onValueChange={setSelectedType} className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">{isArabic ? 'الكل' : 'All'} ({evidence.length})</TabsTrigger>
            <TabsTrigger value="document">{isArabic ? 'المستندات' : 'Documents'} ({evidence.filter(e => e.type === 'document').length})</TabsTrigger>
            <TabsTrigger value="image">{isArabic ? 'الصور' : 'Images'} ({evidence.filter(e => e.type === 'image').length})</TabsTrigger>
            <TabsTrigger value="link">{isArabic ? 'الروابط' : 'Links'} ({evidence.filter(e => e.type === 'link').length})</TabsTrigger>
            <TabsTrigger value="note">{isArabic ? 'الملاحظات' : 'Notes'} ({evidence.filter(e => e.type === 'note').length})</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedType} className="space-y-4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-16 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredEvidence.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm ? 'No evidence matches your search' : 'No evidence uploaded yet'}
                </p>
                {!searchTerm && (
                  <EvidenceUploadDialog onUpload={uploadEvidence} uploading={uploading}>
                    <Button className="mt-4">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload First Evidence
                    </Button>
                  </EvidenceUploadDialog>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEvidence.map((item) => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-full ${getTypeColor(item.type)}`}>
                            {getTypeIcon(item.type)}
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {item.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(item.processing_status)}
                          {item.ai_confidence && (
                            <Badge variant="outline" className="text-xs">
                              {Math.round(item.ai_confidence * 100)}%
                            </Badge>
                          )}
                        </div>
                      </div>
                      <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Processing Status */}
                      {item.processing_status === 'processing' && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-blue-600">
                            <Brain className="h-4 w-4" />
                            AI Processing...
                          </div>
                          <Progress value={50} className="h-2" />
                        </div>
                      )}

                      {/* Manual Tags */}
                      {item.tags && item.tags.length > 0 && (
                        <div>
                          <div className="text-xs font-medium text-muted-foreground mb-1">
                            {isArabic ? 'العلامات' : 'Tags'}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {item.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* AI Generated Tags */}
                      {item.ai_tags && item.ai_tags.length > 0 && (
                        <div>
                          <div className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                            <Brain className="h-3 w-3" />
                            {isArabic ? 'علامات الذكاء الاصطناعي' : 'AI Tags'}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {item.ai_tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Metadata */}
                      <div className="pt-2 border-t space-y-1">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(item.uploaded_at).toLocaleDateString()}
                        </div>
                        {item.processed_at && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <CheckCircle className="h-3 w-3" />
                            Processed {new Date(item.processed_at).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

        </Tabs>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-xs text-muted-foreground">
                {isArabic ? 'إجمالي الأدلة' : 'Total Evidence'}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{stats.processed}</div>
              <div className="text-xs text-muted-foreground">
                {isArabic ? 'معالج' : 'Processed'}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{stats.aiTagged}</div>
              <div className="text-xs text-muted-foreground">
                {isArabic ? 'علامات الذكاء الاصطناعي' : 'AI Tagged'}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">
                {stats.total > 0 ? Math.round((stats.processed / stats.total) * 100) : 0}%
              </div>
              <div className="text-xs text-muted-foreground">
                {isArabic ? 'معدل المعالجة' : 'Processing Rate'}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Evidence;