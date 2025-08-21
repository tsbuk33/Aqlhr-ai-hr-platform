import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Check, AlertCircle, Clock, Play } from 'lucide-react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';

interface GovIntegration {
  id: string;
  system: string;
  is_connected: boolean;
  is_enabled: boolean;
  last_sync_at: string | null;
  last_sync_status: string | null;
  sync_frequency: string;
  last_error_message: string | null;
}

interface IntegrationCardProps {
  integration: GovIntegration;
  onTest: () => void;
  loading: boolean;
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({ integration, onTest, loading }) => {
  const { isArabic } = useSimpleLanguage();

  const getSystemDisplayName = (system: string) => {
    const names: Record<string, {ar: string, en: string}> = {
      'mol': { ar: 'وزارة العمل', en: 'Ministry of Labor' },
      'qiwa': { ar: 'منصة قوى', en: 'Qiwa Platform' },
      'gosi': { ar: 'التأمينات الاجتماعية', en: 'GOSI' },
      'absher': { ar: 'منصة أبشر', en: 'Absher Platform' }
    };
    return names[system] ? (isArabic ? names[system].ar : names[system].en) : system;
  };

  const getStatusIcon = () => {
    if (loading) return <Loader2 className="w-4 h-4 animate-spin" />;
    if (integration.is_connected && integration.last_sync_status === 'success') 
      return <Check className="w-4 h-4 text-green-500" />;
    if (integration.last_error_message) 
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    return <Clock className="w-4 h-4 text-yellow-500" />;
  };

  const getStatusBadge = () => {
    if (integration.is_connected) {
      return (
        <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
          {isArabic ? 'متصل' : 'Connected'}
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-gray-50 text-gray-600">
        {isArabic ? 'غير متصل' : 'Not Connected'}
      </Badge>
    );
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {getStatusIcon()}
            {getSystemDisplayName(integration.system)}
          </CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm text-muted-foreground">
          {integration.last_sync_at && (
            <div>
              <strong>{isArabic ? 'آخر مزامنة:' : 'Last Sync:'}</strong>{' '}
              {new Date(integration.last_sync_at).toLocaleString()}
            </div>
          )}
          
          <div>
            <strong>{isArabic ? 'تكرار المزامنة:' : 'Sync Frequency:'}</strong>{' '}
            {integration.sync_frequency}
          </div>
          
          {integration.last_sync_status && (
            <div>
              <strong>{isArabic ? 'حالة المزامنة:' : 'Sync Status:'}</strong>{' '}
              <Badge 
                variant={integration.last_sync_status === 'success' ? 'default' : 'destructive'}
                className="text-xs"
              >
                {integration.last_sync_status}
              </Badge>
            </div>
          )}
          
          {integration.last_error_message && (
            <div className="text-red-600">
              <strong>{isArabic ? 'الخطأ الأخير:' : 'Last Error:'}</strong>{' '}
              {integration.last_error_message}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={onTest}
            disabled={loading}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            {isArabic ? 'اختبار التكامل' : 'Test Integration'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default IntegrationCard;