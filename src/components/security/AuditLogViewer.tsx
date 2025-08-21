import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { 
  Search, 
  Eye, 
  Shield, 
  AlertTriangle, 
  Clock,
  Filter
} from 'lucide-react';
import { useSecurityAudit } from '@/hooks/useSecurityAudit';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';

const AuditLogViewer: React.FC = () => {
  const { isArabic } = useSimpleLanguage();
  const { auditLogs, loading, searchAuditLogs, fetchAuditLogs } = useSecurityAudit();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('');
  const [selectedLog, setSelectedLog] = useState<any>(null);

  const handleSearch = () => {
    searchAuditLogs(searchTerm);
  };

  const handleFilter = () => {
    fetchAuditLogs(50, selectedCategory || undefined, selectedSeverity || undefined);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'employee_management':
        return '👥';
      case 'task_management':
        return '✅';
      case 'security':
        return '🔒';
      case 'admin_action':
        return '⚙️';
      default:
        return '📝';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            {isArabic ? 'سجل المراجعة الأمنية' : 'Security Audit Log'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={isArabic ? 'البحث في السجلات...' : 'Search logs...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={isArabic ? 'الفئة' : 'Category'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                <SelectItem value="employee_management">Employee Mgmt</SelectItem>
                <SelectItem value="task_management">Task Mgmt</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="admin_action">Admin Actions</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder={isArabic ? 'الأهمية' : 'Severity'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Levels</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleFilter} variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              {isArabic ? 'فلتر' : 'Filter'}
            </Button>
          </div>

          {/* Audit Logs */}
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">
                    {isArabic ? 'جاري التحميل...' : 'Loading...'}
                  </p>
                </div>
              ) : auditLogs.length === 0 ? (
                <div className="text-center py-8">
                  <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    {isArabic ? 'لا توجد سجلات مراجعة' : 'No audit logs found'}
                  </p>
                </div>
              ) : (
                auditLogs.map((log) => (
                  <Card key={log.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{getCategoryIcon(log.category)}</span>
                            <div>
                              <h4 className="font-medium text-sm">{log.action}</h4>
                              <p className="text-xs text-muted-foreground">
                                {log.user_email} • {log.table_name}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge className={getSeverityColor(log.severity)}>
                              {log.severity}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {log.category}
                            </Badge>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {formatTimestamp(log.created_at)}
                            </div>
                          </div>
                        </div>

                        <Sheet>
                          <SheetTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedLog(log)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </SheetTrigger>
                          <SheetContent className="w-[600px] sm:w-[700px]">
                            <SheetHeader>
                              <SheetTitle>Audit Log Details</SheetTitle>
                            </SheetHeader>
                            {selectedLog && (
                              <div className="mt-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <strong>Action:</strong> {selectedLog.action}
                                  </div>
                                  <div>
                                    <strong>User:</strong> {selectedLog.user_email}
                                  </div>
                                  <div>
                                    <strong>Role:</strong> {selectedLog.user_role}
                                  </div>
                                  <div>
                                    <strong>Table:</strong> {selectedLog.table_name}
                                  </div>
                                  <div>
                                    <strong>IP Address:</strong> {selectedLog.ip_address || 'N/A'}
                                  </div>
                                  <div>
                                    <strong>Session:</strong> {selectedLog.session_id || 'N/A'}
                                  </div>
                                </div>

                                {selectedLog.old_values && (
                                  <div>
                                    <h4 className="font-medium mb-2">Previous Values:</h4>
                                    <pre className="text-xs bg-muted p-3 rounded overflow-auto">
                                      {JSON.stringify(selectedLog.old_values, null, 2)}
                                    </pre>
                                  </div>
                                )}

                                {selectedLog.new_values && (
                                  <div>
                                    <h4 className="font-medium mb-2">New Values:</h4>
                                    <pre className="text-xs bg-muted p-3 rounded overflow-auto">
                                      {JSON.stringify(selectedLog.new_values, null, 2)}
                                    </pre>
                                  </div>
                                )}

                                {selectedLog.user_agent && (
                                  <div>
                                    <h4 className="font-medium mb-2">User Agent:</h4>
                                    <p className="text-xs bg-muted p-2 rounded">
                                      {selectedLog.user_agent}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </SheetContent>
                        </Sheet>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLogViewer;