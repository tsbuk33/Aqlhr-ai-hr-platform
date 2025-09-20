import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  Shield, 
  Phone, 
  Users, 
  MessageSquare,
  Clock,
  MapPin,
  Activity,
  Bell,
  Zap,
  Target,
  CheckCircle,
  XCircle,
  AlertCircle,
  Radio,
  Siren
} from 'lucide-react';

interface CrisisEvent {
  id: string;
  title: string;
  titleAr: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'active' | 'escalated' | 'monitoring' | 'resolved';
  type: 'security' | 'operational' | 'financial' | 'reputational' | 'natural' | 'cyber';
  startTime: string;
  location?: string;
  affectedDepartments: string[];
  responseTeam: string[];
  description: string;
  descriptionAr: string;
  actions: CrisisAction[];
}

interface CrisisAction {
  id: string;
  description: string;
  descriptionAr: string;
  assignedTo: string;
  status: 'completed' | 'in_progress' | 'pending';
  priority: 'urgent' | 'high' | 'normal';
  timestamp: string;
}

interface EmergencyContact {
  id: string;
  name: string;
  nameAr: string;
  role: string;
  roleAr: string;
  phone: string;
  email: string;
  department: string;
  available: boolean;
}

interface CrisisManagementToolsProps {
  isArabic: boolean;
  expanded?: boolean;
}

export const CrisisManagementTools: React.FC<CrisisManagementToolsProps> = ({ 
  isArabic, 
  expanded = false 
}) => {
  const [crises, setCrises] = useState<CrisisEvent[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [activeAlert, setActiveAlert] = useState<string | null>(null);
  const [selectedCrisis, setSelectedCrisis] = useState<string | null>(null);

  useEffect(() => {
    loadCrisisData();
    loadEmergencyContacts();
  }, []);

  const loadCrisisData = () => {
    const crisisData: CrisisEvent[] = [
      {
        id: 'crisis_001',
        title: 'Data Center Power Outage',
        titleAr: 'انقطاع الطاقة في مركز البيانات',
        severity: 'critical',
        status: 'active',
        type: 'operational',
        startTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        location: 'Primary Data Center, Riyadh',
        affectedDepartments: ['IT', 'Operations', 'Customer Service'],
        responseTeam: ['IT Team', 'Facilities', 'Crisis Manager'],
        description: 'Primary data center experiencing complete power failure affecting all systems',
        descriptionAr: 'مركز البيانات الأساسي يواجه انقطاع كامل في الطاقة يؤثر على جميع الأنظمة',
        actions: [
          {
            id: 'action_001',
            description: 'Activate backup generators',
            descriptionAr: 'تفعيل المولدات الاحتياطية',
            assignedTo: 'Facilities Team',
            status: 'completed',
            priority: 'urgent',
            timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString()
          },
          {
            id: 'action_002',
            description: 'Failover to secondary data center',
            descriptionAr: 'التحويل إلى مركز البيانات الثانوي',
            assignedTo: 'IT Operations',
            status: 'in_progress',
            priority: 'urgent',
            timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString()
          },
          {
            id: 'action_003',
            description: 'Notify all stakeholders',
            descriptionAr: 'إخطار جميع أصحاب المصلحة',
            assignedTo: 'Communications Team',
            status: 'pending',
            priority: 'high',
            timestamp: new Date().toISOString()
          }
        ]
      },
      {
        id: 'crisis_002',
        title: 'Cybersecurity Breach Detected',
        titleAr: 'تم اكتشاف خرق أمني سيبراني',
        severity: 'high',
        status: 'escalated',
        type: 'cyber',
        startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        affectedDepartments: ['IT Security', 'Legal', 'Communications'],
        responseTeam: ['CISO', 'Security Team', 'Legal Counsel'],
        description: 'Unauthorized access attempt detected on financial systems',
        descriptionAr: 'تم اكتشاف محاولة وصول غير مصرح بها على الأنظمة المالية',
        actions: [
          {
            id: 'action_004',
            description: 'Isolate affected systems',
            descriptionAr: 'عزل الأنظمة المتأثرة',
            assignedTo: 'Security Team',
            status: 'completed',
            priority: 'urgent',
            timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString()
          },
          {
            id: 'action_005',
            description: 'Contact law enforcement',
            descriptionAr: 'الاتصال بإنفاذ القانون',
            assignedTo: 'Legal Team',
            status: 'in_progress',
            priority: 'high',
            timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString()
          }
        ]
      },
      {
        id: 'crisis_003',
        title: 'Major Client Contract Dispute',
        titleAr: 'نزاع عقد عميل رئيسي',
        severity: 'medium',
        status: 'monitoring',
        type: 'reputational',
        startTime: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        affectedDepartments: ['Sales', 'Legal', 'Executive'],
        responseTeam: ['Account Manager', 'Legal Counsel', 'CEO'],
        description: 'Key client threatening contract termination over service delivery issues',
        descriptionAr: 'عميل رئيسي يهدد بإنهاء العقد بسبب مشاكل تسليم الخدمة',
        actions: [
          {
            id: 'action_006',
            description: 'Schedule emergency meeting with client',
            descriptionAr: 'جدولة اجتماع طارئ مع العميل',
            assignedTo: 'Account Manager',
            status: 'completed',
            priority: 'high',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
          }
        ]
      }
    ];

    setCrises(crisisData);
  };

  const loadEmergencyContacts = () => {
    const contactsData: EmergencyContact[] = [
      {
        id: 'contact_001',
        name: 'Ahmed Al-Rashid',
        nameAr: 'أحمد الراشد',
        role: 'Crisis Manager',
        roleAr: 'مدير الأزمات',
        phone: '+966-50-123-4567',
        email: 'ahmed.crisis@company.com',
        department: 'Operations',
        available: true
      },
      {
        id: 'contact_002',
        name: 'Sarah Al-Mahmoud',
        nameAr: 'سارة المحمود',
        role: 'Chief Security Officer',
        roleAr: 'مدير الأمن الرئيسي',
        phone: '+966-50-234-5678',
        email: 'sarah.security@company.com',
        department: 'Security',
        available: true
      },
      {
        id: 'contact_003',
        name: 'Mohammad Al-Faisal',
        nameAr: 'محمد الفيصل',
        role: 'IT Director',
        roleAr: 'مدير تقنية المعلومات',
        phone: '+966-50-345-6789',
        email: 'mohammad.it@company.com',
        department: 'IT',
        available: false
      },
      {
        id: 'contact_004',
        name: 'Fatima Al-Zahra',
        nameAr: 'فاطمة الزهراء',
        role: 'Legal Counsel',
        roleAr: 'المستشار القانوني',
        phone: '+966-50-456-7890',
        email: 'fatima.legal@company.com',
        department: 'Legal',
        available: true
      }
    ];

    setEmergencyContacts(contactsData);
  };

  const getSeverityColor = (severity: CrisisEvent['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-300';
    }
  };

  const getStatusColor = (status: CrisisEvent['status']) => {
    switch (status) {
      case 'active':
        return 'bg-red-500 text-white';
      case 'escalated':
        return 'bg-orange-500 text-white';
      case 'monitoring':
        return 'bg-blue-500 text-white';
      case 'resolved':
        return 'bg-green-500 text-white';
    }
  };

  const getTypeIcon = (type: CrisisEvent['type']) => {
    switch (type) {
      case 'security':
        return <Shield className="h-4 w-4" />;
      case 'operational':
        return <Activity className="h-4 w-4" />;
      case 'financial':
        return <Target className="h-4 w-4" />;
      case 'reputational':
        return <Users className="h-4 w-4" />;
      case 'natural':
        return <AlertTriangle className="h-4 w-4" />;
      case 'cyber':
        return <Zap className="h-4 w-4" />;
    }
  };

  const getActionStatusIcon = (status: CrisisAction['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
    }
  };

  const activateCrisisAlert = (crisisId: string) => {
    setActiveAlert(crisisId);
    // In real implementation, this would trigger emergency notifications
    setTimeout(() => setActiveAlert(null), 5000);
  };

  const getActiveCrises = () => {
    return crises.filter(crisis => crisis.status === 'active' || crisis.status === 'escalated');
  };

  const formatTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return isArabic ? `منذ ${hours} ساعة` : `${hours}h ago`;
    }
    return isArabic ? `منذ ${minutes} دقيقة` : `${minutes}m ago`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Siren className="h-5 w-5 text-red-500" />
          {isArabic ? 'أدوات إدارة الأزمات' : 'Crisis Management Tools'}
        </CardTitle>
        
        {/* Alert Banner */}
        {getActiveCrises().length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-red-600 animate-pulse" />
              <span className="text-sm font-medium text-red-800">
                {isArabic ? 
                  `${getActiveCrises().length} أزمة نشطة تتطلب انتباه فوري` :
                  `${getActiveCrises().length} active crisis requiring immediate attention`
                }
              </span>
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Active Crises */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            {isArabic ? 'الأزمات النشطة' : 'Active Crises'}
          </h4>
          
          <div className="space-y-3">
            {getActiveCrises().map((crisis) => (
              <Card key={crisis.id} className={`border-l-4 ${getSeverityColor(crisis.severity).replace('bg-', 'border-l-')}`}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        {getTypeIcon(crisis.type)}
                        <div className="min-w-0 flex-1">
                          <h5 className="font-medium text-sm">
                            {isArabic ? crisis.titleAr : crisis.title}
                          </h5>
                          <p className="text-xs text-muted-foreground mt-1">
                            {isArabic ? crisis.descriptionAr : crisis.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(crisis.status)}>
                          {crisis.status.toUpperCase()}
                        </Badge>
                        <Badge className={`${getSeverityColor(crisis.severity)} border`}>
                          {crisis.severity.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatTimeAgo(crisis.startTime)}</span>
                      </div>
                      {crisis.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{crisis.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{crisis.responseTeam.length} {isArabic ? 'فريق' : 'team'}</span>
                      </div>
                    </div>

                    {expanded && (
                      <>
                        {/* Affected Departments */}
                        <div className="space-y-2">
                          <span className="text-xs font-medium">
                            {isArabic ? 'الأقسام المتأثرة:' : 'Affected Departments:'}
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {crisis.affectedDepartments.map((dept, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {dept}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-2">
                          <span className="text-xs font-medium">
                            {isArabic ? 'الإجراءات:' : 'Actions:'}
                          </span>
                          <div className="space-y-2">
                            {crisis.actions.slice(0, 3).map((action) => (
                              <div key={action.id} className="flex items-center gap-2 text-xs">
                                {getActionStatusIcon(action.status)}
                                <span className="flex-1">
                                  {isArabic ? action.descriptionAr : action.description}
                                </span>
                                <span className="text-muted-foreground">
                                  {action.assignedTo}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    <div className="flex gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => activateCrisisAlert(crisis.id)}
                        disabled={activeAlert === crisis.id}
                      >
                        {activeAlert === crisis.id ? (
                          <>
                            <Radio className="h-4 w-4 mr-2 animate-pulse" />
                            {isArabic ? 'تم الإرسال' : 'Broadcasting'}
                          </>
                        ) : (
                          <>
                            <Bell className="h-4 w-4 mr-2" />
                            {isArabic ? 'تنبيه طارئ' : 'Emergency Alert'}
                          </>
                        )}
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        {isArabic ? 'اتصال' : 'Communicate'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedCrisis(
                          selectedCrisis === crisis.id ? null : crisis.id
                        )}
                      >
                        {isArabic ? 'تفاصيل' : 'Details'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <Phone className="h-4 w-4" />
            {isArabic ? 'جهات الاتصال الطارئة' : 'Emergency Contacts'}
          </h4>
          
          <div className="grid grid-cols-1 gap-2">
            {emergencyContacts.filter(contact => contact.available).slice(0, expanded ? 6 : 3).map((contact) => (
              <Card key={contact.id} className="border">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${contact.available ? 'bg-green-500' : 'bg-red-500'}`} />
                      <div>
                        <h6 className="font-medium text-sm">
                          {isArabic ? contact.nameAr : contact.name}
                        </h6>
                        <p className="text-xs text-muted-foreground">
                          {isArabic ? contact.roleAr : contact.role}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Crisis Status Summary */}
        <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-red-600">
                  {crises.filter(c => c.status === 'active').length}
                </div>
                <div className="text-xs text-muted-foreground">
                  {isArabic ? 'نشطة' : 'Active'}
                </div>
              </div>
              <div>
                <div className="text-xl font-bold text-orange-600">
                  {crises.filter(c => c.status === 'escalated').length}
                </div>
                <div className="text-xs text-muted-foreground">
                  {isArabic ? 'مصعدة' : 'Escalated'}
                </div>
              </div>
              <div>
                <div className="text-xl font-bold text-green-600">
                  {crises.filter(c => c.status === 'resolved').length}
                </div>
                <div className="text-xs text-muted-foreground">
                  {isArabic ? 'محلولة' : 'Resolved'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};