import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Shield, AlertTriangle } from 'lucide-react';

interface EmergencyContactsProps {
  isArabic: boolean;
}

export const EmergencyContacts: React.FC<EmergencyContactsProps> = ({ isArabic }) => {
  const contacts = [
    { name: isArabic ? 'الطوارئ العامة' : 'General Emergency', number: '999' },
    { name: isArabic ? 'أمن الشركة' : 'Company Security', number: '+966-11-123-4567' },
    { name: isArabic ? 'الموارد البشرية' : 'HR Department', number: '+966-11-234-5678' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          {isArabic ? 'جهات الاتصال الطارئة' : 'Emergency Contacts'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {contacts.map((contact, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm">{contact.name}</span>
              <Button size="sm" variant="outline">
                <Phone className="h-3 w-3 mr-1" />
                {contact.number}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};