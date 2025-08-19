import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  User
} from 'lucide-react';

const Evidence: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const evidenceItems = [
    {
      id: 1,
      type: 'document',
      title: isArabic ? 'دليل السياسات والإجراءات 2024' : 'Policy & Procedures Manual 2024',
      description: isArabic ? 'الإصدار المحدث من دليل السياسات الداخلية' : 'Updated version of internal policy guidelines',
      tags: [isArabic ? 'سياسات' : 'policies', isArabic ? 'إجراءات' : 'procedures', isArabic ? 'حوكمة' : 'governance'],
      aiTags: [isArabic ? 'هيكل تنظيمي' : 'organizational structure', isArabic ? 'سلطة' : 'authority'],
      date: '2024-01-15',
      author: isArabic ? 'فريق الموارد البشرية' : 'HR Team'
    },
    {
      id: 2,
      type: 'image',
      title: isArabic ? 'صور اجتماع الفريق الربع سنوي' : 'Quarterly Team Meeting Photos',
      description: isArabic ? 'توثيق مرئي لاجتماع الفريق الربع سنوي' : 'Visual documentation of quarterly team meeting',
      tags: [isArabic ? 'اجتماعات' : 'meetings', isArabic ? 'فريق عمل' : 'teamwork', isArabic ? 'تعاون' : 'collaboration'],
      aiTags: [isArabic ? 'تفاعل اجتماعي' : 'social interaction', isArabic ? 'ثقافة الفريق' : 'team culture'],
      date: '2024-01-10',
      author: isArabic ? 'أحمد الخالد' : 'Ahmed Al-Khalid'
    },
    {
      id: 3,
      type: 'link',
      title: isArabic ? 'نتائج استطلاع رضا الموظفين' : 'Employee Satisfaction Survey Results',
      description: isArabic ? 'رابط لنتائج استطلاع الرضا الوظيفي للربع الأخير' : 'Link to latest quarterly employee satisfaction results',
      tags: [isArabic ? 'رضا' : 'satisfaction', isArabic ? 'استطلاع' : 'survey', isArabic ? 'تقييم' : 'feedback'],
      aiTags: [isArabic ? 'معنويات' : 'morale', isArabic ? 'مشاركة' : 'engagement'],
      date: '2024-01-08',
      author: isArabic ? 'فاطمة النوري' : 'Fatima Al-Nouri'
    },
    {
      id: 4,
      type: 'note',
      title: isArabic ? 'ملاحظات من جلسة العصف الذهني' : 'Brainstorming Session Notes',
      description: isArabic ? 'ملاحظات مهمة من جلسة العصف الذهني حول تطوير الثقافة' : 'Key insights from culture development brainstorming session',
      tags: [isArabic ? 'عصف ذهني' : 'brainstorming', isArabic ? 'أفكار' : 'ideas', isArabic ? 'إبداع' : 'innovation'],
      aiTags: [isArabic ? 'تفكير إبداعي' : 'creative thinking', isArabic ? 'حل المشاكل' : 'problem solving'],
      date: '2024-01-05',
      author: isArabic ? 'سارة المطيري' : 'Sarah Al-Mutairi'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText className="h-4 w-4" />;
      case 'image': return <Image className="h-4 w-4" />;
      case 'link': return <Link className="h-4 w-4" />;
      case 'note': return <StickyNote className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'document': return 'blue';
      case 'image': return 'green';
      case 'link': return 'purple';
      case 'note': return 'orange';
      default: return 'gray';
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
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              {isArabic ? 'رفع دليل' : 'Upload Evidence'}
            </Button>
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
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">{isArabic ? 'الكل' : 'All'}</TabsTrigger>
            <TabsTrigger value="documents">{isArabic ? 'المستندات' : 'Documents'}</TabsTrigger>
            <TabsTrigger value="images">{isArabic ? 'الصور' : 'Images'}</TabsTrigger>
            <TabsTrigger value="links">{isArabic ? 'الروابط' : 'Links'}</TabsTrigger>
            <TabsTrigger value="notes">{isArabic ? 'الملاحظات' : 'Notes'}</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {evidenceItems.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-full bg-${getTypeColor(item.type)}-100 text-${getTypeColor(item.type)}-600`}>
                          {getTypeIcon(item.type)}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {item.type}
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Manual Tags */}
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

                    {/* AI Generated Tags */}
                    <div>
                      <div className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                        <Tags className="h-3 w-3" />
                        {isArabic ? 'علامات الذكاء الاصطناعي' : 'AI Tags'}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {item.aiTags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="pt-2 border-t space-y-1">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {item.date}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        {item.author}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="documents">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {evidenceItems
                .filter(item => item.type === 'document')
                .map((item) => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow">
                    {/* Same card structure as above */}
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs text-muted-foreground">
                        {isArabic ? 'مستند PDF' : 'PDF Document'} • {item.date}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          {/* Similar structure for other tabs */}
          <TabsContent value="images">
            <div className="text-center py-8">
              <Image className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {isArabic ? 'عرض الصور والمحتوى المرئي' : 'Image gallery and visual content view'}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="links">
            <div className="text-center py-8">
              <Link className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {isArabic ? 'مجموعة الروابط والمصادر الخارجية' : 'Collection of links and external resources'}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="notes">
            <div className="text-center py-8">
              <StickyNote className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {isArabic ? 'الملاحظات والأفكار المدونة' : 'Written notes and insights'}
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">127</div>
              <div className="text-xs text-muted-foreground">
                {isArabic ? 'إجمالي الأدلة' : 'Total Evidence'}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">45</div>
              <div className="text-xs text-muted-foreground">
                {isArabic ? 'علامات الذكاء الاصطناعي' : 'AI Tags'}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">23</div>
              <div className="text-xs text-muted-foreground">
                {isArabic ? 'مساهمين' : 'Contributors'}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">89%</div>
              <div className="text-xs text-muted-foreground">
                {isArabic ? 'معدل التصنيف' : 'Tagged Rate'}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Evidence;