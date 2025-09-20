import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Upload, 
  Search, 
  BookOpen, 
  Building2,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useSaudiDocumentProcessor, DocumentProcessingResult } from '@/hooks/useSaudiDocumentProcessor';
import { useSaudiKnowledgeBase } from '@/hooks/useSaudiKnowledgeBase';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';

export const SaudiDocumentCenter: React.FC = () => {
  const { isRTL } = useUnifiedLocale();
  const { processDocument, getProcessingHistory, isProcessing } = useSaudiDocumentProcessor();
  const { 
    legalFrameworks, 
    govEntities, 
    searchLegalFramework, 
    searchGovEntities, 
    loading: knowledgeLoading 
  } = useSaudiKnowledgeBase();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [processingResults, setProcessingResults] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    loadProcessingHistory();
  }, []);

  const loadProcessingHistory = async () => {
    setHistoryLoading(true);
    try {
      const history = await getProcessingHistory();
      setProcessingResults(history);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleProcessDocument = async () => {
    if (!selectedFile) return;

    const result = await processDocument(selectedFile);
    if (result) {
      setProcessingResults(prev => [result, ...prev]);
      setSelectedFile(null);
      // Reset file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    await Promise.all([
      searchLegalFramework(searchQuery),
      searchGovEntities(searchQuery)
    ]);
  };

  const getStatusIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (score >= 60) return <Clock className="h-4 w-4 text-yellow-500" />;
    return <AlertCircle className="h-4 w-4 text-red-500" />;
  };

  return (
    <div className="container mx-auto p-6 space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">
          {isRTL ? 'مركز المستندات السعودية' : 'Saudi Document Center'}
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {isRTL 
            ? 'مركز شامل لمعالجة المستندات بالذكاء الاصطناعي مع قاعدة المعرفة السعودية'
            : 'Comprehensive AI-powered document processing with Saudi knowledge base'
          }
        </p>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            {isRTL ? 'رفع المستندات' : 'Upload Documents'}
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            {isRTL ? 'قاعدة المعرفة' : 'Knowledge Base'}
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {isRTL ? 'سجل المعالجة' : 'Processing History'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                {isRTL ? 'معالجة المستندات' : 'Document Processing'}
              </CardTitle>
              <CardDescription>
                {isRTL 
                  ? 'قم برفع مستند لمعالجته بالذكاء الاصطناعي وتحليل الامتثال السعودي'
                  : 'Upload a document for AI processing and Saudi compliance analysis'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".pdf,.docx,.txt,.doc"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button
                    onClick={() => document.getElementById('file-upload')?.click()}
                    variant="outline"
                    className="mb-2"
                  >
                    {isRTL ? 'اختيار ملف' : 'Choose File'}
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    {isRTL 
                      ? 'يدعم PDF، Word، النصوص (الحد الأقصى 10MB)'
                      : 'Supports PDF, Word, Text files (Max 10MB)'
                    }
                  </p>
                </div>
              </div>

              {selectedFile && (
                <div className="bg-muted p-4 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{selectedFile.name}</span>
                    <Badge variant="outline">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </Badge>
                  </div>
                  <Button 
                    onClick={handleProcessDocument}
                    disabled={isProcessing}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        {isRTL ? 'جاري المعالجة...' : 'Processing...'}
                      </>
                    ) : (
                      isRTL ? 'معالجة المستند' : 'Process Document'
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                {isRTL ? 'البحث في قاعدة المعرفة' : 'Knowledge Base Search'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder={isRTL ? 'ابحث في القوانين والجهات الحكومية...' : 'Search laws and government entities...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={knowledgeLoading}>
                  {knowledgeLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    {isRTL ? 'القوانين السعودية' : 'Saudi Legal Framework'}
                  </h3>
                  {legalFrameworks.map((law) => (
                    <Card key={law.id} className="p-4">
                      <h4 className="font-medium">
                        {isRTL ? law.law_name_ar : law.law_name_en}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {isRTL ? law.description_ar : law.description_en}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {law.keywords.map((keyword, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    {isRTL ? 'الجهات الحكومية' : 'Government Entities'}
                  </h3>
                  {govEntities.map((entity) => (
                    <Card key={entity.id} className="p-4">
                      <h4 className="font-medium">
                        {isRTL ? entity.entity_name_ar : entity.entity_name_en}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {isRTL ? entity.description_ar : entity.description_en}
                      </p>
                      <Badge variant="outline" className="mt-2">
                        {entity.entity_type}
                      </Badge>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {isRTL ? 'سجل معالجة المستندات' : 'Document Processing History'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {historyLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {isRTL ? 'جاري تحميل السجل...' : 'Loading history...'}
                  </p>
                </div>
              ) : processingResults.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {isRTL ? 'لا توجد مستندات معالجة حتى الآن' : 'No processed documents yet'}
                </div>
              ) : (
                <div className="space-y-4">
                  {processingResults.map((result) => (
                    <Card key={result.id} className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(result.saudi_compliance_score)}
                          <div>
                            <h4 className="font-medium">{result.id}</h4>
                            <p className="text-sm text-muted-foreground">
                              {isRTL ? 'نقاط الامتثال:' : 'Compliance Score:'} {result.saudi_compliance_score}%
                            </p>
                          </div>
                        </div>
                        <Progress value={result.saudi_compliance_score} className="w-24" />
                      </div>
                      
                      <Separator className="my-3" />
                      
                      <div className="space-y-2">
                        <p className="text-sm"><strong>{isRTL ? 'الملخص:' : 'Summary:'}</strong> {result.summary}</p>
                        
                        <div className="flex flex-wrap gap-1">
                          <span className="text-sm font-medium">{isRTL ? 'الكلمات المفتاحية:' : 'Keywords:'}</span>
                          {result.keywords.map((keyword, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>

                        {result.legal_entities.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            <span className="text-sm font-medium">{isRTL ? 'الكيانات القانونية:' : 'Legal Entities:'}</span>
                            {result.legal_entities.map((entity, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {entity}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};