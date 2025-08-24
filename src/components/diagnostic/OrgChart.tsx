import React from 'react';
import { useLocale } from '@/i18n/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Building2 } from 'lucide-react';
import type { OSILayerData } from '@/hooks/useOSI';

interface OrgChartProps {
  layers: OSILayerData[];
}

export const OrgChart: React.FC<OrgChartProps> = ({ layers }) => {
  const { locale, t } = useLocale();

  const sortedLayers = [...layers].sort((a, b) => a.layer_order - b.layer_order);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          {t('osi', 'organizational_chart')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedLayers.map((layer, index) => {
            const isAboveTarget = layer.saudization_rate >= layer.target_rate;
            
            return (
              <div
                key={layer.layer_code}
                className="relative"
                style={{ marginLeft: `${index * 20}px` }}
              >
                {/* Connection line to parent layer */}
                {index > 0 && (
                  <div className="absolute -left-4 top-1/2 w-4 h-px bg-border"></div>
                )}
                
                {/* Layer card */}
                <div className="flex items-center gap-3 p-4 border rounded-lg bg-card">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">
                      {locale === 'ar' ? layer.name_ar : layer.name_en}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{layer.headcount} {t('osi', 'employees')}</span>
                      <span>•</span>
                      <span>{layer.saudi_hc} {t('osi', 'saudi')}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant={isAboveTarget ? 'default' : 'destructive'}>
                      {layer.saudization_rate.toFixed(1)}%
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {t('osi', 'target')}: {layer.target_rate}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {layers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{t('osi', 'no_org_data')}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};