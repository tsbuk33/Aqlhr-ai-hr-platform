import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  MessageCircle, 
  AlertTriangle, 
  Shield, 
  Users,
  Clock,
  MapPin,
  Video,
  Siren,
  Zap
} from 'lucide-react';

interface EmergencyContact {
  id: string;
  name: string;
  nameAr: string;
  role: string;
  roleAr: string;
  phone: string;
  status: 'available' | 'busy' | 'offline';
  location?: string;
  responseTime: string;
  priority: 'high' | 'medium' | 'low';
}

interface EmergencyTeamContactProps {
  isArabic: boolean;
}

export const EmergencyTeamContact: React.FC<EmergencyTeamContactProps> = ({ isArabic }) => {
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [contacts] = useState<EmergencyContact[]>([
    {
      id: 'emergency_001',
      name: 'Ahmed Al-Rashid',
      nameAr: 'أحمد الراشد',
      role: 'Security Head',
      roleAr: 'رئيس الأمن',
      phone: '+966-11-123-4567',
      status: 'available',
      location: 'Riyadh HQ',
      responseTime: '< 2 min',
      priority: 'high'
    },
    {
      id: 'emergency_002',
      name: 'Dr. Fatima Al-Zahra',
      nameAr: 'د. فاطمة الزهراء',
      role: 'Medical Officer',
      roleAr: 'المسؤول الطبي',
      phone: '+966-11-234-5678',
      status: 'available',
      location: 'Medical Center',
      responseTime: '< 5 min',
      priority: 'high'
    },
    {
      id: 'emergency_003',
      name: 'Mohammed Al-Saud',
      nameAr: 'محمد السعود',
      role: 'IT Emergency',
      roleAr: 'طوارئ تقنية المعلومات',
      phone: '+966-11-345-6789',
      status: 'available',
      location: 'IT Center',
      responseTime: '< 3 min',
      priority: 'medium'
    },
    {
      id: 'emergency_004',
      name: 'Nora Al-Qasimi',
      nameAr: 'نورا القاسمي',
      role: 'Facilities Manager',
      roleAr: 'مدير المرافق',
      phone: '+966-11-456-7890',
      status: 'busy',
      location: 'Building A',
      responseTime: '< 10 min',
      priority: 'medium'
    }
  ]);

  const handleEmergencyCall = (contact: EmergencyContact) => {
    console.log(`Emergency call initiated to ${contact.name} (${contact.phone})`);
    // In a real app, this would initiate an actual call
    window.open(`tel:${contact.phone}`);
  };

  const handleEmergencyMessage = (contact: EmergencyContact) => {
    console.log(`Emergency message to ${contact.name}`);
    // In a real app, this would send an emergency message/SMS
    const message = isArabic 
      ? `طوارئ في المكتب - يرجى الاتصال فوراً`
      : `Office emergency - please respond immediately`;
    window.open(`sms:${contact.phone}?body=${encodeURIComponent(message)}`);
  };

  const handleVideoCall = (contact: EmergencyContact) => {
    console.log(`Emergency video call to ${contact.name}`);
    // In a real app, this would initiate a video call
  };

  const activateEmergencyMode = () => {
    setEmergencyActive(true);
    console.log('Emergency mode activated - notifying all contacts');
    
    // In a real app, this would:
    // 1. Send alerts to all emergency contacts
    // 2. Log the emergency event
    // 3. Notify relevant authorities
    // 4. Activate emergency protocols
    
    setTimeout(() => {
      setEmergencyActive(false);
    }, 30000); // Auto-deactivate after 30 seconds for demo
  };

  const getStatusColor = (status: EmergencyContact['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'busy':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: EmergencyContact['status']) => {
    if (isArabic) {
      switch (status) {
        case 'available':
          return 'متاح';
        case 'busy':
          return 'مشغول';
        case 'offline':
          return 'غير متصل';
        default:
          return 'غير معروف';
      }
    } else {
      switch (status) {
        case 'available':
          return 'Available';
        case 'busy':
          return 'Busy';
        case 'offline':
          return 'Offline';
        default:
          return 'Unknown';
      }
    }
  };

  const getPriorityColor = (priority: EmergencyContact['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-red-500';
      case 'medium':
        return 'border-yellow-500';
      case 'low':
        return 'border-green-500';
      default:
        return 'border-gray-500';
    }
  };

  return (
    <Card className={emergencyActive ? 'border-red-500 bg-red-50' : ''}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className={`h-5 w-5 ${emergencyActive ? 'text-red-500' : 'text-blue-500'}`} />
            {isArabic ? 'جهات الاتصال الطارئة' : 'Emergency Team Contacts'}
          </div>
          {emergencyActive && (
            <Badge variant="destructive" className="animate-pulse">
              {isArabic ? 'حالة طوارئ نشطة' : 'EMERGENCY ACTIVE'}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Emergency Activation Button */}
        {!emergencyActive ? (
          <Button 
            onClick={activateEmergencyMode}
            variant="destructive"
            className="w-full h-12 text-lg font-semibold"
          >
            <Siren className="h-5 w-5 mr-2" />
            {isArabic ? 'تفعيل حالة الطوارئ' : 'ACTIVATE EMERGENCY'}
          </Button>
        ) : (
          <div className="p-4 bg-red-100 border border-red-300 rounded-lg">
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5 animate-pulse" />
              <span className="font-semibold">
                {isArabic ? 'حالة الطوارئ مفعلة - جميع جهات الاتصال تم تنبيهها' : 'Emergency Mode Active - All contacts notified'}
              </span>
            </div>
          </div>
        )}

        {/* Quick Emergency Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" onClick={() => window.open('tel:911')}>
            <Phone className="h-4 w-4 mr-1" />
            {isArabic ? 'الطوارئ العامة' : 'Emergency 911'}
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.open('tel:998')}>
            <Phone className="h-4 w-4 mr-1" />
            {isArabic ? 'الإسعاف' : 'Ambulance 998'}
          </Button>
        </div>

        {/* Emergency Contacts List */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <Users className="h-4 w-4" />
            {isArabic ? 'فريق الطوارئ' : 'Emergency Team'}
          </h4>
          
          {contacts.map((contact) => (
            <div key={contact.id} className={`p-3 border rounded-lg border-l-4 ${getPriorityColor(contact.priority)}`}>
              <div className="space-y-2">
                {/* Contact Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(contact.status)}`} />
                    <div>
                      <p className="font-medium text-sm">
                        {isArabic ? contact.nameAr : contact.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {isArabic ? contact.roleAr : contact.role}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {getStatusText(contact.status)}
                  </Badge>
                </div>

                {/* Contact Details */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    <span>{contact.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    <span>{contact.responseTime}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant={contact.status === 'available' ? 'default' : 'secondary'}
                    onClick={() => handleEmergencyCall(contact)}
                    disabled={contact.status === 'offline'}
                    className="flex-1"
                  >
                    <Phone className="h-3 w-3 mr-1" />
                    {isArabic ? 'اتصال' : 'Call'}
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEmergencyMessage(contact)}
                    disabled={contact.status === 'offline'}
                    className="flex-1"
                  >
                    <MessageCircle className="h-3 w-3 mr-1" />
                    {isArabic ? 'رسالة' : 'Message'}
                  </Button>

                  {contact.status === 'available' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleVideoCall(contact)}
                      className="px-2"
                    >
                      <Video className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Emergency Instructions */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">
                {isArabic ? 'تعليمات الطوارئ:' : 'Emergency Instructions:'}
              </p>
              <ul className="text-xs space-y-1">
                <li>
                  {isArabic 
                    ? '• للحالات الطبية الطارئة: اتصل بالدكتورة فاطمة أو الإسعاف 998'
                    : '• For medical emergencies: Call Dr. Fatima or Ambulance 998'
                  }
                </li>
                <li>
                  {isArabic 
                    ? '• للحالات الأمنية: اتصل بأحمد (رئيس الأمن) أو الطوارئ العامة'
                    : '• For security issues: Call Ahmed (Security Head) or Emergency 911'
                  }
                </li>
                <li>
                  {isArabic 
                    ? '• للمشاكل التقنية الحرجة: اتصل بمحمد (طوارئ تقنية المعلومات)'
                    : '• For critical IT issues: Call Mohammed (IT Emergency)'
                  }
                </li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};