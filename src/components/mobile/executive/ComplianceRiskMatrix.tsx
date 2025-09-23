import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle } from 'lucide-react';

interface ComplianceRiskMatrixProps {
  screenSize: 'mobile' | 'tablet' | 'desktop';
}

export const ComplianceRiskMatrix: React.FC<ComplianceRiskMatrixProps> = ({ screenSize }) => {
  const complianceItems = [
    { area: 'Labor Law', status: 'Compliant', risk: 'Low', lastAudit: '2024-01-15' },
    { area: 'Data Privacy', status: 'Compliant', risk: 'Low', lastAudit: '2024-02-01' },
    { area: 'Financial Reporting', status: 'Compliant', risk: 'Medium', lastAudit: '2024-01-30' },
    { area: 'Safety Standards', status: 'Under Review', risk: 'Medium', lastAudit: '2024-01-10' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-6 w-6 text-pink-500" />
        <div>
          <h3 className="text-lg font-semibold">Compliance Risk Matrix</h3>
          <p className="text-sm text-muted-foreground">Regulatory compliance monitoring</p>
        </div>
      </div>

      <div className="space-y-4">
        {complianceItems.map((item, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{item.area}</p>
                  <p className="text-xs text-muted-foreground">Last Audit: {item.lastAudit}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={item.status === 'Compliant' ? 'bg-green-500' : 'bg-yellow-500'}>
                    {item.status === 'Compliant' && <CheckCircle className="h-3 w-3 mr-1" />}
                    {item.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};