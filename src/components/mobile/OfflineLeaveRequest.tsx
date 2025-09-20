import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, FileText, Clock } from 'lucide-react';

interface OfflineLeaveRequestProps {
  isArabic: boolean;
  employeeId: string;
  isOnline: boolean;
}

export const OfflineLeaveRequest: React.FC<OfflineLeaveRequestProps> = ({
  isArabic,
  employeeId,
  isOnline
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {isArabic ? 'طلب إجازة' : 'Leave Request'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button className="w-full">
          <FileText className="h-4 w-4 mr-2" />
          {isArabic ? 'تقديم طلب إجازة' : 'Submit Leave Request'}
        </Button>
      </CardContent>
    </Card>
  );
};