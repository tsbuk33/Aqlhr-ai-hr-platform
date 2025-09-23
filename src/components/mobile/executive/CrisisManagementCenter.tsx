import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  Shield, 
  Phone, 
  Users, 
  FileText,
  Clock,
  MapPin,
  Activity,
  CheckCircle,
  XCircle,
  MessageSquare,
  Siren,
  Building,
  Globe,
  Zap,
  Heart,
  Eye,
  Radio
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface CrisisEvent {
  id: string;
  type: 'security' | 'safety' | 'operational' | 'financial' | 'regulatory' | 'natural';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  location?: string;
  reportedBy: string;
  reportedAt: Date;
  status: 'active' | 'investigating' | 'resolved' | 'escalated';
  affectedDepartments: string[];
  estimatedImpact: string;
  currentActions: string[];
}

interface EmergencyContact {
  id: string;
  name: string;
  nameAr: string;
  role: string;
  roleAr: string;
  department: string;
  phone: string;
  email: string;
  availability: 'available' | 'busy' | 'unavailable';
  responseTime: string;
  specialties: string[];
}

interface CrisisManagementCenterProps {
  isArabic?: boolean;
  onEmergencyActivated?: (event: CrisisEvent) => void;
}

export const CrisisManagementCenter: React.FC<CrisisManagementCenterProps> = ({ 
  isArabic = false,
  onEmergencyActivated 
}) => {
  const [activeIncidents, setActiveIncidents] = useState<CrisisEvent[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [systemStatus, setSystemStatus] = useState<'normal' | 'alert' | 'emergency'>('normal');

  useEffect(() => {
    loadCrisisData();
    const interval = setInterval(loadCrisisData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadCrisisData = async () => {
    try {
      // Load active incidents (mock data - would come from database)
      const mockIncidents: CrisisEvent[] = [
        {
          id: 'crisis_001',
          type: 'safety',
          severity: 'high',
          title: 'Workplace Safety Incident',
          titleAr: 'حادث سلامة في مكان العمل',
          description: 'Minor injury reported in manufacturing floor - Area 3',
          descriptionAr: 'إصابة طفيفة تم الإبلاغ عنها في أرضية التصنيع - المنطقة 3',
          location: 'Manufacturing Floor - Area 3',
          reportedBy: 'Safety Officer Ahmad',
          reportedAt: new Date(Date.now() - 1800000), // 30 minutes ago
          status: 'investigating',
          affectedDepartments: ['Manufacturing', 'Safety', 'HR'],
          estimatedImpact: 'Low operational impact, high safety priority',
          currentActions: ['Medical response dispatched', 'Area cordoned off', 'Investigation initiated']
        }
      ];

      // Load emergency contacts (mock data)
      const mockContacts: EmergencyContact[] = [
        {
          id: 'contact_001',
          name: 'Dr. Sarah Al-Mahmoud',
          nameAr: 'د. سارة المحمود',
          role: 'Chief Medical Officer',
          roleAr: 'كبير المسؤولين الطبيين',
          department: 'Medical',
          phone: '+966-50-123-4567',
          email: 'sarah.almahmoud@company.com',
          availability: 'available',
          responseTime: '< 5 min',
          specialties: ['Medical Emergency', 'Health & Safety']
        },
        {
          id: 'contact_002',
          name: 'Ahmed Al-Rashid',
          nameAr: 'أحمد الراشد',
          role: 'Security Chief',
          roleAr: 'رئيس الأمن',
          department: 'Security',
          phone: '+966-50-234-5678',
          email: 'ahmed.alrashid@company.com',
          availability: 'available',
          responseTime: '< 3 min',
          specialties: ['Physical Security', 'Emergency Response']
        },
        {
          id: 'contact_003',
          name: 'Fatima Al-Zahra',
          nameAr: 'فاطمة الزهراء',
          role: 'Legal Counsel',
          roleAr: 'المستشار القانوني',
          department: 'Legal',
          phone: '+966-50-345-6789',
          email: 'fatima.alzahra@company.com',
          availability: 'busy',
          responseTime: '< 15 min',
          specialties: ['Regulatory Compliance', 'Crisis Legal Support']
        }
      ];

      setActiveIncidents(mockIncidents);
      setEmergencyContacts(mockContacts);
      setLastUpdate(new Date());

      // Determine system status based on incidents
      const criticalIncidents = mockIncidents.filter(i => i.severity === 'critical').length;
      const highIncidents = mockIncidents.filter(i => i.severity === 'high').length;
      
      if (criticalIncidents > 0) {
        setSystemStatus('emergency');
      } else if (highIncidents > 0) {
        setSystemStatus('alert');
      } else {
        setSystemStatus('normal');
      }

    } catch (error) {
      console.error('Failed to load crisis data:', error);
    }
  };

  const activateEmergencyProtocol = async (type: CrisisEvent['type'], severity: CrisisEvent['severity']) => {
    try {
      setIsEmergencyMode(true);
      
      const newIncident: CrisisEvent = {
        id: `crisis_${Date.now()}`,
        type,
        severity,
        title: 'Emergency Protocol Activated',
        titleAr: 'تم تفعيل بروتوكول الطوارئ',
        description: `Emergency protocol activated for ${type} incident`,
        descriptionAr: `تم تفعيل بروتوكول الطوارئ لحادث ${type}`,
        reportedBy: 'Executive System',
        reportedAt: new Date(),
        status: 'active',
        affectedDepartments: ['All Departments'],
        estimatedImpact: `${severity} impact emergency`,
        currentActions: ['Emergency team notified', 'Crisis protocol initiated']
      };

      // Call emergency notification edge function
      const { data, error } = await supabase.functions.invoke('emergency-notification', {
        body: {
          incident: newIncident,
          notifyContacts: true,
          activateProtocols: true,
          language: isArabic ? 'ar' : 'en'
        }
      });

      if (error) throw error;

      setActiveIncidents(prev => [newIncident, ...prev]);
      onEmergencyActivated?.(newIncident);

      toast.error(
        isArabic 
          ? 'تم تفعيل بروتوكول الطوارئ - جاري إخطار جميع الفرق المعنية' 
          : 'Emergency protocol activated - Notifying all relevant teams'
      );

    } catch (error) {
      console.error('Failed to activate emergency protocol:', error);
      toast.error(
        isArabic 
          ? 'فشل في تفعيل بروتوكول الطوارئ' 
          : 'Failed to activate emergency protocol'
      );
    }
  };

  const contactEmergencyPersonnel = async (contactId: string, method: 'call' | 'message') => {
    const contact = emergencyContacts.find(c => c.id === contactId);
    if (!contact) return;

    try {
      if (method === 'call') {
        // Trigger call (would integrate with phone system)
        window.open(`tel:${contact.phone}`);
        toast.info(
          isArabic 
            ? `جاري الاتصال بـ ${contact.nameAr || contact.name}` 
            : `Calling ${contact.name}`
        );
      } else {
        // Send emergency message
        const { data, error } = await supabase.functions.invoke('send-emergency-message', {
          body: {
            contactId,
            message: isArabic 
              ? 'رسالة طوارئ من التطبيق التنفيذي - يرجى الرد فوراً' 
              : 'Emergency message from executive app - Please respond immediately',
            priority: 'urgent',
            language: isArabic ? 'ar' : 'en'
          }
        });

        if (error) throw error;

        toast.success(
          isArabic 
            ? `تم إرسال رسالة طوارئ إلى ${contact.nameAr || contact.name}` 
            : `Emergency message sent to ${contact.name}`
        );
      }
    } catch (error) {
      console.error('Failed to contact emergency personnel:', error);
      toast.error(
        isArabic 
          ? 'فشل في الاتصال بموظف الطوارئ' 
          : 'Failed to contact emergency personnel'
      );
    }
  };

  const updateIncidentStatus = async (incidentId: string, newStatus: CrisisEvent['status']) => {
    try {
      setActiveIncidents(prev => 
        prev.map(incident => 
          incident.id === incidentId 
            ? { ...incident, status: newStatus }
            : incident
        )
      );

      toast.success(
        isArabic 
          ? 'تم تحديث حالة الحادث' 
          : 'Incident status updated'
      );
    } catch (error) {
      console.error('Failed to update incident status:', error);
    }
  };

  const getSeverityColor = (severity: CrisisEvent['severity']) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: CrisisEvent['status']) => {
    switch (status) {
      case 'active': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'investigating': return <Activity className="h-4 w-4 text-orange-500 animate-pulse" />;
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'escalated': return <Siren className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getAvailabilityColor = (availability: EmergencyContact['availability']) => {
    switch (availability) {
      case 'available': return 'text-green-600';
      case 'busy': return 'text-yellow-600';
      case 'unavailable': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* System Status Alert */}
      {systemStatus !== 'normal' && (
        <Alert className={`border-2 ${systemStatus === 'emergency' ? 'border-red-500 bg-red-50' : 'border-orange-500 bg-orange-50'}`}>
          <AlertTriangle className={`h-4 w-4 ${systemStatus === 'emergency' ? 'text-red-600' : 'text-orange-600'}`} />
          <AlertDescription className="font-medium">
            {systemStatus === 'emergency' ? (
              isArabic ? 'حالة طوارئ نشطة - يرجى اتباع البروتوكولات المحددة' : 'EMERGENCY STATUS ACTIVE - Follow designated protocols'
            ) : (
              isArabic ? 'تنبيه نشط - مراقبة مستمرة مطلوبة' : 'ALERT STATUS - Continuous monitoring required'
            )}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard" className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {isArabic ? 'لوحة التحكم' : 'Dashboard'}
          </TabsTrigger>
          <TabsTrigger value="incidents" className="flex items-center gap-1">
            <AlertTriangle className="h-4 w-4" />
            {isArabic ? 'الحوادث' : 'Incidents'}
          </TabsTrigger>
          <TabsTrigger value="contacts" className="flex items-center gap-1">
            <Phone className="h-4 w-4" />
            {isArabic ? 'جهات الاتصال' : 'Contacts'}
          </TabsTrigger>
          <TabsTrigger value="protocols" className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            {isArabic ? 'البروتوكولات' : 'Protocols'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                {isArabic ? 'حالة النظام' : 'System Status'}
              </CardTitle>
              <CardDescription>
                {isArabic ? 'مراقبة شاملة لحالة الطوارئ والأمان' : 'Comprehensive emergency and safety status monitoring'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${systemStatus === 'emergency' ? 'text-red-600' : systemStatus === 'alert' ? 'text-orange-600' : 'text-green-600'}`}>
                    {activeIncidents.length}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {isArabic ? 'حوادث نشطة' : 'Active Incidents'}
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {emergencyContacts.filter(c => c.availability === 'available').length}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {isArabic ? 'جهات اتصال متاحة' : 'Available Contacts'}
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    < 5
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {isArabic ? 'وقت الاستجابة (دقائق)' : 'Response Time (min)'}
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    99.8%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {isArabic ? 'جاهزية النظام' : 'System Readiness'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Action Buttons */}
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">
                {isArabic ? 'إجراءات الطوارئ الفورية' : 'Immediate Emergency Actions'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Button 
                  variant="destructive"
                  className="h-20 flex flex-col gap-2"
                  onClick={() => activateEmergencyProtocol('safety', 'critical')}
                >
                  <Heart className="h-6 w-6" />
                  <span className="text-sm">
                    {isArabic ? 'طوارئ طبية' : 'Medical Emergency'}
                  </span>
                </Button>

                <Button 
                  variant="destructive"
                  className="h-20 flex flex-col gap-2"
                  onClick={() => activateEmergencyProtocol('security', 'critical')}
                >
                  <Shield className="h-6 w-6" />
                  <span className="text-sm">
                    {isArabic ? 'طوارئ أمنية' : 'Security Emergency'}
                  </span>
                </Button>

                <Button 
                  variant="destructive"
                  className="h-20 flex flex-col gap-2"
                  onClick={() => activateEmergencyProtocol('natural', 'critical')}
                >
                  <Zap className="h-6 w-6" />
                  <span className="text-sm">
                    {isArabic ? 'كارثة طبيعية' : 'Natural Disaster'}
                  </span>
                </Button>

                <Button 
                  variant="outline"
                  className="h-20 flex flex-col gap-2 border-orange-500 text-orange-600"
                  onClick={() => activateEmergencyProtocol('operational', 'high')}
                >
                  <Building className="h-6 w-6" />
                  <span className="text-sm">
                    {isArabic ? 'طوارئ تشغيلية' : 'Operational Crisis'}
                  </span>
                </Button>

                <Button 
                  variant="outline"
                  className="h-20 flex flex-col gap-2 border-red-500 text-red-600"
                  onClick={() => activateEmergencyProtocol('regulatory', 'high')}
                >
                  <FileText className="h-6 w-6" />
                  <span className="text-sm">
                    {isArabic ? 'أزمة تنظيمية' : 'Regulatory Crisis'}
                  </span>
                </Button>

                <Button 
                  variant="outline"
                  className="h-20 flex flex-col gap-2 border-purple-500 text-purple-600"
                  onClick={() => activateEmergencyProtocol('financial', 'high')}
                >
                  <Globe className="h-6 w-6" />
                  <span className="text-sm">
                    {isArabic ? 'أزمة مالية' : 'Financial Crisis'}
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incidents" className="space-y-4">
          {activeIncidents.map((incident) => (
            <Card key={incident.id} className={`border-l-4 ${getSeverityColor(incident.severity)}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(incident.status)}
                    <div>
                      <CardTitle className="text-base">
                        {isArabic ? incident.titleAr : incident.title}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {isArabic ? incident.descriptionAr : incident.description}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={getSeverityColor(incident.severity)}>
                    {incident.severity.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">{isArabic ? 'الموقع:' : 'Location:'}</span>
                    <p className="text-muted-foreground">{incident.location || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium">{isArabic ? 'المُبلغ:' : 'Reported by:'}</span>
                    <p className="text-muted-foreground">{incident.reportedBy}</p>
                  </div>
                  <div>
                    <span className="font-medium">{isArabic ? 'الوقت:' : 'Time:'}</span>
                    <p className="text-muted-foreground">
                      {incident.reportedAt.toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <div>
                  <span className="font-medium text-sm">{isArabic ? 'الإجراءات الحالية:' : 'Current Actions:'}</span>
                  <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                    {incident.currentActions.map((action, index) => (
                      <li key={index}>{action}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" onClick={() => updateIncidentStatus(incident.id, 'investigating')}>
                    {isArabic ? 'قيد التحقيق' : 'Under Investigation'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => updateIncidentStatus(incident.id, 'resolved')}>
                    {isArabic ? 'تم الحل' : 'Resolved'}
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => updateIncidentStatus(incident.id, 'escalated')}>
                    {isArabic ? 'تصعيد' : 'Escalate'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {activeIncidents.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {isArabic ? 'لا توجد حوادث نشطة' : 'No Active Incidents'}
                </h3>
                <p className="text-muted-foreground">
                  {isArabic ? 'جميع الأنظمة تعمل بشكل طبيعي' : 'All systems operating normally'}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="contacts" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emergencyContacts.map((contact) => (
              <Card key={contact.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">
                        {isArabic ? contact.nameAr : contact.name}
                      </CardTitle>
                      <CardDescription>
                        {isArabic ? contact.roleAr : contact.role}
                      </CardDescription>
                    </div>
                    <Badge className={getAvailabilityColor(contact.availability)}>
                      {contact.availability === 'available' && (isArabic ? 'متاح' : 'Available')}
                      {contact.availability === 'busy' && (isArabic ? 'مشغول' : 'Busy')}
                      {contact.availability === 'unavailable' && (isArabic ? 'غير متاح' : 'Unavailable')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{isArabic ? 'وقت الاستجابة:' : 'Response time:'} {contact.responseTime}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {contact.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => contactEmergencyPersonnel(contact.id, 'call')}
                      disabled={contact.availability === 'unavailable'}
                    >
                      <Phone className="h-3 w-3 mr-1" />
                      {isArabic ? 'اتصال' : 'Call'}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => contactEmergencyPersonnel(contact.id, 'message')}
                    >
                      <MessageSquare className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="protocols" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  {isArabic ? 'بروتوكول الطوارئ الطبية' : 'Medical Emergency Protocol'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>{isArabic ? 'تقييم فوري للحالة' : 'Immediate assessment of situation'}</li>
                  <li>{isArabic ? 'استدعاء الطاقم الطبي' : 'Call medical team'}</li>
                  <li>{isArabic ? 'تأمين المنطقة' : 'Secure the area'}</li>
                  <li>{isArabic ? 'توثيق الحادث' : 'Document the incident'}</li>
                  <li>{isArabic ? 'متابعة وتقرير' : 'Follow-up and reporting'}</li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  {isArabic ? 'بروتوكول الطوارئ الأمنية' : 'Security Emergency Protocol'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>{isArabic ? 'تفعيل إنذار الأمن' : 'Activate security alert'}</li>
                  <li>{isArabic ? 'إخلاء المنطقة المتأثرة' : 'Evacuate affected area'}</li>
                  <li>{isArabic ? 'إخطار السلطات' : 'Notify authorities'}</li>
                  <li>{isArabic ? 'تأمين الأدلة' : 'Secure evidence'}</li>
                  <li>{isArabic ? 'التحقيق والمتابعة' : 'Investigation and follow-up'}</li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-orange-500" />
                  {isArabic ? 'بروتوكول الأزمة التشغيلية' : 'Operational Crisis Protocol'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>{isArabic ? 'تحديد نطاق التأثير' : 'Determine scope of impact'}</li>
                  <li>{isArabic ? 'تفعيل خطة الاستمرارية' : 'Activate continuity plan'}</li>
                  <li>{isArabic ? 'إخطار أصحاب المصلحة' : 'Notify stakeholders'}</li>
                  <li>{isArabic ? 'تنفيذ الحلول البديلة' : 'Implement workarounds'}</li>
                  <li>{isArabic ? 'مراقبة التعافي' : 'Monitor recovery'}</li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Radio className="h-5 w-5 text-purple-500" />
                  {isArabic ? 'بروتوكول الاتصالات الطارئة' : 'Emergency Communication Protocol'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>{isArabic ? 'تحديد المستلمين' : 'Identify recipients'}</li>
                  <li>{isArabic ? 'صياغة الرسالة' : 'Draft message'}</li>
                  <li>{isArabic ? 'اختيار قنوات الاتصال' : 'Select communication channels'}</li>
                  <li>{isArabic ? 'الإرسال والتأكيد' : 'Send and confirm receipt'}</li>
                  <li>{isArabic ? 'المتابعة المستمرة' : 'Continuous follow-up'}</li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};