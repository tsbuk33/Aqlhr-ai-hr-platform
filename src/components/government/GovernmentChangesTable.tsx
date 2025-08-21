import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Check, Clock, AlertTriangle } from 'lucide-react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';

interface GovernmentChange {
  id: string;
  system: string;
  change_type: string;
  reference: string;
  effective_date: string;
  processed: boolean;
  created_at: string;
}

interface GovernmentChangesTableProps {
  changes: GovernmentChange[];
  onCreateTask: (change: GovernmentChange) => void;
  onMarkProcessed: (changeId: string) => void;
  canCreateTasks?: boolean;
}

export const GovernmentChangesTable: React.FC<GovernmentChangesTableProps> = ({
  changes,
  onCreateTask,
  onMarkProcessed,
  canCreateTasks = true
}) => {
  const { isArabic } = useSimpleLanguage();

  const getChangeTypeDisplayName = (type: string) => {
    const names = {
      new_hire: isArabic ? 'توظيف جديد' : 'New Hire',
      termination: isArabic ? 'إنهاء خدمة' : 'Termination',
      iqama_update: isArabic ? 'تحديث إقامة' : 'Iqama Update',
      saudization_rate: isArabic ? 'معدل السعودة' : 'Saudization Rate',
      contract_update: isArabic ? 'تحديث عقد' : 'Contract Update'
    };
    return names[type as keyof typeof names] || type;
  };

  const getSystemDisplayName = (system: string) => {
    const names = {
      MOL: isArabic ? 'وزارة العمل' : 'MOL',
      QIWA: isArabic ? 'قوى' : 'Qiwa',
      GOSI: isArabic ? 'التأمينات' : 'GOSI',
      ABSHER: isArabic ? 'أبشر' : 'Absher'
    };
    return names[system as keyof typeof names] || system;
  };

  const getChangeTypeIcon = (type: string) => {
    switch (type) {
      case 'new_hire':
        return <Plus className="h-4 w-4 text-green-500" />;
      case 'termination':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'iqama_update':
      case 'contract_update':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'saudization_rate':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(isArabic ? 'ar-SA' : 'en-US');
  };

  const getChangeTypePriority = (type: string) => {
    const priorities = {
      new_hire: 'high',
      termination: 'high',
      iqama_update: 'medium',
      saudization_rate: 'medium',
      contract_update: 'medium'
    };
    return priorities[type as keyof typeof priorities] || 'low';
  };

  const getPriorityBadge = (type: string) => {
    const priority = getChangeTypePriority(type);
    const variant = priority === 'high' ? 'destructive' : 
                   priority === 'medium' ? 'default' : 'secondary';
    const text = isArabic ? {
      high: 'عالية',
      medium: 'متوسطة',
      low: 'منخفضة'
    }[priority] : priority;

    return <Badge variant={variant}>{text}</Badge>;
  };

  if (changes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {isArabic ? 'التغييرات الأخيرة' : 'Recent Changes'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {isArabic ? 'لا توجد تغييرات حديثة من الأنظمة الحكومية' : 'No recent changes from government systems'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          {isArabic ? 'التغييرات الأخيرة' : 'Recent Changes'}
          <Badge variant="secondary">{changes.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{isArabic ? 'النظام' : 'System'}</TableHead>
                <TableHead>{isArabic ? 'نوع التغيير' : 'Change Type'}</TableHead>
                <TableHead>{isArabic ? 'المرجع' : 'Reference'}</TableHead>
                <TableHead>{isArabic ? 'تاريخ السريان' : 'Effective Date'}</TableHead>
                <TableHead>{isArabic ? 'الأولوية' : 'Priority'}</TableHead>
                <TableHead>{isArabic ? 'الحالة' : 'Status'}</TableHead>
                <TableHead className="text-right">{isArabic ? 'الإجراءات' : 'Actions'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {changes.map((change) => (
                <TableRow key={change.id}>
                  <TableCell>
                    <Badge variant="outline">
                      {getSystemDisplayName(change.system)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getChangeTypeIcon(change.change_type)}
                      <span className="text-sm">
                        {getChangeTypeDisplayName(change.change_type)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{change.reference}</TableCell>
                  <TableCell>{formatDate(change.effective_date)}</TableCell>
                  <TableCell>{getPriorityBadge(change.change_type)}</TableCell>
                  <TableCell>
                    {change.processed ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <Check className="h-4 w-4" />
                        <span className="text-sm">
                          {isArabic ? 'تم المعالجة' : 'Processed'}
                        </span>
                      </div>
                    ) : (
                      <Badge variant="secondary">
                        {isArabic ? 'في الانتظار' : 'Pending'}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      {canCreateTasks ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onCreateTask(change)}
                          disabled={change.processed}
                        >
                          <Plus className="h-3 w-3" />
                          {isArabic ? 'إنشاء مهمة' : 'Create Task'}
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" disabled>
                          <Plus className="h-3 w-3" />
                          {isArabic ? 'إنشاء مهمة' : 'Create Task'}
                        </Button>
                      )}
                      {!change.processed && canCreateTasks && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onMarkProcessed(change.id)}
                        >
                          <Check className="h-3 w-3" />
                          {isArabic ? 'تم' : 'Mark Done'}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};