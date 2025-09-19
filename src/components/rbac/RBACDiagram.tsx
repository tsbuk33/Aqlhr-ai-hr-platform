import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileImage } from 'lucide-react';
import { toast } from 'sonner';

interface Role {
  id: string;
  icon: string;
  nameEn: string;
  nameAr: string;
  color: string;
  count: number;
  interfaces: string[];
}

export const RBACDiagram: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  const roles: Role[] = [
    {
      id: 'employee',
      icon: '👤',
      nameEn: 'Employee (Self-Service User)',
      nameAr: 'الموظف (الخدمة الذاتية)',
      color: '#3B82F6',
      count: 9,
      interfaces: [
        'Personal Profile | الملف الشخصي',
        'Attendance/Timesheet | الحضور والانصراف',
        'Leave Requests | طلبات الإجازة',
        'Payroll View | عرض الراتب',
        'Benefits Enrollment | تسجيل المزايا',
        'Performance Reviews (Self) | تقييمات الأداء (الذاتي)',
        'Training Certificates | شهادات التدريب',
        'Document Upload | رفع المستندات',
        'Notifications | الإشعارات'
      ]
    },
    {
      id: 'manager',
      icon: '👔',
      nameEn: 'Line Manager / Supervisor',
      nameAr: 'المدير المباشر',
      color: '#10B981',
      count: 12,
      interfaces: [
        'Team Dashboard | لوحة الفريق',
        'Team Attendance | حضور الفريق',
        'Leave Approvals | الموافقة على الإجازات',
        'Performance Reviews (Team) | تقييمات الأداء (الفريق)',
        'Recruitment Support | دعم التوظيف',
        'Team Reports | تقارير الفريق',
        'Budget Oversight | مراقبة الميزانية',
        'Goal Setting | وضع الأهداف',
        'Employee Development | تطوير الموظفين',
        'Disciplinary Actions | الإجراءات التأديبية',
        'Schedule Management | إدارة الجداول',
        'Task Assignment | تخصيص المهام'
      ]
    },
    {
      id: 'hr',
      icon: '🧑‍💼',
      nameEn: 'HR Manager / HR Specialist',
      nameAr: 'مدير/أخصائي الموارد البشرية',
      color: '#F59E0B',
      count: 24,
      interfaces: [
        'Employee Management | إدارة الموظفين',
        'Recruitment & Onboarding | التوظيف والإدماج',
        'Performance Management | إدارة الأداء',
        'Learning & Development | التعلم والتطوير',
        'Compensation & Benefits | التعويضات والمزايا',
        'Attendance Management | إدارة الحضور',
        'Leave Management | إدارة الإجازات',
        'Compliance & Reports | الامتثال والتقارير',
        'Document Management | إدارة المستندات',
        'Analytics Dashboard | لوحة التحليلات',
        'Policy Management | إدارة السياسات',
        'Employee Relations | العلاقات الوظيفية',
        'Exit Management | إدارة الخروج',
        'Payroll Management | إدارة الرواتب',
        'Government Integration | التكامل الحكومي',
        'Audit Trail | سجل المراجعة',
        'Survey Management | إدارة الاستطلاعات',
        'Succession Planning | تخطيط الخلافة',
        'Organizational Chart | الهيكل التنظيمي',
        'Budget Planning | تخطيط الميزانية',
        'Contract Management | إدارة العقود',
        'Disciplinary Management | إدارة الإجراءات التأديبية',
        'Training Administration | إدارة التدريب',
        'Benefits Administration | إدارة المزايا'
      ]
    },
    {
      id: 'executive',
      icon: '📊',
      nameEn: 'Executive / Director / Board Member',
      nameAr: 'الإدارة التنفيذية / المدير العام',
      color: '#8B5CF6',
      count: 11,
      interfaces: [
        'Executive Dashboard | لوحة الإدارة التنفيذية',
        'Strategic Analytics | التحليلات الاستراتيجية',
        'Financial Reports | التقارير المالية',
        'Organizational Metrics | مقاييس المؤسسة',
        'Board Reporting | تقارير مجلس الإدارة',
        'Risk Management | إدارة المخاطر',
        'Strategic Planning | التخطيط الاستراتيجي',
        'Budget Approval | الموافقة على الميزانية',
        'Policy Approval | الموافقة على السياسات',
        'Compliance Overview | نظرة عامة على الامتثال',
        'Succession Planning Overview | نظرة عامة على تخطيط الخلافة'
      ]
    },
    {
      id: 'admin',
      icon: '🛠️',
      nameEn: 'System Admin / IT',
      nameAr: 'مسؤول النظام',
      color: '#EF4444',
      count: 8,
      interfaces: [
        'User Management | إدارة المستخدمين',
        'System Configuration | إعدادات النظام',
        'Security Settings | إعدادات الأمان',
        'Data Backup & Recovery | النسخ الاحتياطي واستعادة البيانات',
        'Integration Management | إدارة التكامل',
        'Audit Logs | سجلات المراجعة',
        'System Monitoring | مراقبة النظام',
        'Database Management | إدارة قواعد البيانات'
      ]
    }
  ];

  const downloadSVG = () => {
    if (!svgRef.current) return;
    
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'aqlhr-rbac-diagram.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('SVG diagram downloaded successfully!');
  };

  const downloadPNG = () => {
    if (!svgRef.current) return;
    
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    canvas.width = 1200;
    canvas.height = 1600;
    
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'aqlhr-rbac-diagram.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        toast.success('PNG diagram downloaded successfully!');
      }, 'image/png');
    };
    
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    img.src = url;
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AqlHR Role-Based Access Control (RBAC) Matrix</h2>
          <p className="text-muted-foreground">مصفوفة التحكم في الوصول القائم على الأدوار</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={downloadSVG} variant="outline" className="flex items-center gap-2">
            <Download size={16} />
            Download SVG
          </Button>
          <Button onClick={downloadPNG} variant="outline" className="flex items-center gap-2">
            <FileImage size={16} />
            Download PNG
          </Button>
        </div>
      </div>

      <div className="border rounded-lg p-4 bg-background overflow-x-auto">
        <svg 
          ref={svgRef}
          viewBox="0 0 1200 1600" 
          className="w-full h-auto"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background */}
          <rect width="1200" height="1600" fill="white"/>
          
          {/* Header */}
          <text x="600" y="40" textAnchor="middle" className="text-2xl font-bold" fill="#1f2937">
            AqlHR Role-Based Access Control (RBAC) Matrix
          </text>
          <text x="600" y="65" textAnchor="middle" className="text-lg" fill="#6b7280">
            مصفوفة التحكم في الوصول القائم على الأدوار
          </text>

          {/* Legend */}
          <rect x="50" y="90" width="1100" height="120" fill="#f9fafb" stroke="#e5e7eb" strokeWidth="1" rx="8"/>
          <text x="70" y="115" className="text-lg font-semibold" fill="#374151">Legend | المفتاح</text>
          
          {roles.map((role, index) => (
            <g key={role.id}>
              <circle cx={120 + index * 200} cy={140} r="8" fill={role.color}/>
              <text x={140 + index * 200} y={135} className="text-sm font-medium" fill="#374151">
                {role.icon} {role.nameEn.split(' ')[0]}
              </text>
              <text x={140 + index * 200} y={150} className="text-sm" fill="#6b7280">
                {role.nameAr.split(' ')[0]}
              </text>
              <text x={140 + index * 200} y={165} className="text-xs" fill="#9ca3af">
                ({role.count} interfaces)
              </text>
            </g>
          ))}

          {/* Main diagram */}
          {roles.map((role, roleIndex) => {
            const yStart = 250 + roleIndex * 280;
            
            return (
              <g key={role.id}>
                {/* Role box */}
                <rect 
                  x="50" 
                  y={yStart} 
                  width="300" 
                  height="60" 
                  fill={role.color} 
                  rx="8"
                  fillOpacity="0.1"
                  stroke={role.color}
                  strokeWidth="2"
                />
                
                {/* Role icon and title */}
                <text x="70" y={yStart + 25} className="text-xl" fill={role.color}>
                  {role.icon}
                </text>
                <text x="100" y={yStart + 25} className="text-sm font-semibold" fill="#374151">
                  {role.nameEn}
                </text>
                <text x="100" y={yStart + 42} className="text-sm" fill="#6b7280">
                  {role.nameAr}
                </text>
                <text x="100" y={yStart + 55} className="text-xs font-medium" fill={role.color}>
                  {role.count} Interfaces | {role.count} واجهات
                </text>

                {/* Connection line */}
                <line 
                  x1="350" 
                  y1={yStart + 30} 
                  x2="400" 
                  y2={yStart + 30} 
                  stroke={role.color} 
                  strokeWidth="2"
                />
                
                {/* Interfaces box */}
                <rect 
                  x="400" 
                  y={yStart} 
                  width="750" 
                  height={Math.max(60, role.interfaces.length * 12 + 20)} 
                  fill="white" 
                  stroke="#e5e7eb" 
                  strokeWidth="1" 
                  rx="8"
                />
                
                {/* Interfaces list */}
                {role.interfaces.slice(0, Math.min(8, role.interfaces.length)).map((interfaceItem, index) => (
                  <text 
                    key={index}
                    x="420" 
                    y={yStart + 25 + index * 15} 
                    className="text-xs" 
                    fill="#374151"
                  >
                    • {interfaceItem}
                  </text>
                ))}
                
                {role.interfaces.length > 8 && (
                  <text 
                    x="420" 
                    y={yStart + 25 + 8 * 15} 
                    className="text-xs font-medium" 
                    fill={role.color}
                  >
                    ... and {role.interfaces.length - 8} more interfaces | و {role.interfaces.length - 8} واجهات أخرى
                  </text>
                )}
              </g>
            );
          })}

          {/* Summary */}
          <rect x="50" y="1450" width="1100" height="100" fill="#f0f9ff" stroke="#0ea5e9" strokeWidth="1" rx="8"/>
          <text x="70" y="1475" className="text-lg font-semibold" fill="#0369a1">
            Summary | الملخص
          </text>
          <text x="70" y="1495" className="text-sm" fill="#374151">
            Total Unique Interfaces: 64 | إجمالي الواجهات الفريدة: 64
          </text>
          <text x="70" y="1510" className="text-sm" fill="#374151">
            Role-based access ensures proper data security and user experience optimization
          </text>
          <text x="70" y="1525" className="text-sm" fill="#6b7280">
            التحكم القائم على الأدوار يضمن أمان البيانات وتحسين تجربة المستخدم
          </text>
        </svg>
      </div>
    </div>
  );
};