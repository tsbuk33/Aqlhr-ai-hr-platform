import React, { useMemo } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Position,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLocale } from '@/i18n/locale';

interface OrganizationalChartRendererProps {
  structureType: string;
  companyData?: any;
}

// Custom node component for organizational positions
const PositionNode = ({ data }: { data: any }) => {
  const { locale } = useLocale();
  const isArabic = locale === 'ar';
  
  const getPositionLevel = (level: number) => {
    const levels = {
      1: { color: 'bg-red-100 border-red-300 text-red-800', label: isArabic ? 'تنفيذي أعلى' : 'C-Level' },
      2: { color: 'bg-orange-100 border-orange-300 text-orange-800', label: isArabic ? 'إدارة عليا' : 'Senior Mgmt' },
      3: { color: 'bg-yellow-100 border-yellow-300 text-yellow-800', label: isArabic ? 'إدارة متوسطة' : 'Middle Mgmt' },
      4: { color: 'bg-green-100 border-green-300 text-green-800', label: isArabic ? 'مشرف' : 'Supervisor' },
      5: { color: 'bg-blue-100 border-blue-300 text-blue-800', label: isArabic ? 'موظف' : 'Employee' }
    };
    return levels[level as keyof typeof levels] || levels[5];
  };

  const levelInfo = getPositionLevel(data.level);
  
  return (
    <Card className={`p-4 min-w-[180px] border-2 ${levelInfo.color} transition-all hover:shadow-lg`}>
      <div className="text-center space-y-2">
        <div className="font-semibold text-sm">
          {isArabic ? data.title_ar : data.title_en}
        </div>
        <Badge variant="secondary" className="text-xs">
          {levelInfo.label}
        </Badge>
        <div className="text-xs text-muted-foreground space-y-1">
          <div>{data.department}</div>
          <div className="flex justify-between">
            <span>{isArabic ? 'الموظفون:' : 'Staff:'} {data.headcount}</span>
            <span>{isArabic ? 'سعودة:' : 'Saudi:'} {data.saudization}%</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

const nodeTypes = {
  position: PositionNode,
};

export const OrganizationalChartRenderer: React.FC<OrganizationalChartRendererProps> = ({
  structureType,
  companyData
}) => {
  const { locale } = useLocale();
  const isArabic = locale === 'ar';

  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    return generateChartData(structureType, isArabic);
  }, [structureType, isArabic]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="w-full h-[600px] border rounded-lg bg-gray-50/50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        style={{ backgroundColor: "#fafafa" }}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

// Generate chart data based on structure type
function generateChartData(structureType: string, isArabic: boolean) {
  const baseNodes: Node[] = [];
  const baseEdges: Edge[] = [];

  switch (structureType) {
    case 'hierarchical':
      return generateHierarchicalChart(isArabic);
    case 'functional':
      return generateFunctionalChart(isArabic);
    case 'divisional':
      return generateDivisionalChart(isArabic);
    case 'matrix':
      return generateMatrixChart(isArabic);
    case 'flat':
      return generateFlatChart(isArabic);
    case 'network':
      return generateNetworkChart(isArabic);
    case 'hybrid':
      return generateHybridChart(isArabic);
    case 'team_based':
      return generateTeamBasedChart(isArabic);
    case 'geographic':
      return generateGeographicChart(isArabic);
    case 'product_based':
      return generateProductBasedChart(isArabic);
    default:
      return { nodes: baseNodes, edges: baseEdges };
  }
}

function generateHierarchicalChart(isArabic: boolean) {
  const nodes: Node[] = [
    {
      id: '1',
      type: 'position',
      position: { x: 400, y: 50 },
      data: {
        title_en: 'Chief Executive Officer',
        title_ar: 'الرئيس التنفيذي',
        level: 1,
        department: isArabic ? 'الإدارة التنفيذية' : 'Executive',
        headcount: 1,
        saudization: 100
      }
    },
    {
      id: '2',
      type: 'position',
      position: { x: 200, y: 200 },
      data: {
        title_en: 'Chief Operations Officer',
        title_ar: 'مدير العمليات التنفيذي',
        level: 2,
        department: isArabic ? 'العمليات' : 'Operations',
        headcount: 45,
        saudization: 67
      }
    },
    {
      id: '3',
      type: 'position',
      position: { x: 600, y: 200 },
      data: {
        title_en: 'Chief Financial Officer',
        title_ar: 'المدير المالي التنفيذي',
        level: 2,
        department: isArabic ? 'المالية' : 'Finance',
        headcount: 23,
        saudization: 78
      }
    },
    {
      id: '4',
      type: 'position',
      position: { x: 100, y: 350 },
      data: {
        title_en: 'HR Manager',
        title_ar: 'مدير الموارد البشرية',
        level: 3,
        department: isArabic ? 'الموارد البشرية' : 'Human Resources',
        headcount: 12,
        saudization: 83
      }
    },
    {
      id: '5',
      type: 'position',
      position: { x: 300, y: 350 },
      data: {
        title_en: 'IT Manager',
        title_ar: 'مدير تقنية المعلومات',
        level: 3,
        department: isArabic ? 'تقنية المعلومات' : 'Information Technology',
        headcount: 18,
        saudization: 56
      }
    }
  ];

  const edges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e1-3', source: '1', target: '3', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e2-4', source: '2', target: '4', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e2-5', source: '2', target: '5', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } }
  ];

  return { nodes, edges };
}

function generateFunctionalChart(isArabic: boolean) {
  const nodes: Node[] = [
    {
      id: '1',
      type: 'position',
      position: { x: 400, y: 50 },
      data: {
        title_en: 'Chief Executive Officer',
        title_ar: 'الرئيس التنفيذي',
        level: 1,
        department: isArabic ? 'الإدارة التنفيذية' : 'Executive',
        headcount: 1,
        saudization: 100
      }
    },
    {
      id: '2',
      type: 'position',
      position: { x: 100, y: 200 },
      data: {
        title_en: 'HR Department',
        title_ar: 'قسم الموارد البشرية',
        level: 2,
        department: isArabic ? 'الموارد البشرية' : 'Human Resources',
        headcount: 25,
        saudization: 88
      }
    },
    {
      id: '3',
      type: 'position',
      position: { x: 300, y: 200 },
      data: {
        title_en: 'Finance Department',
        title_ar: 'القسم المالي',
        level: 2,
        department: isArabic ? 'المالية' : 'Finance',
        headcount: 18,
        saudization: 72
      }
    },
    {
      id: '4',
      type: 'position',
      position: { x: 500, y: 200 },
      data: {
        title_en: 'Marketing Department',
        title_ar: 'قسم التسويق',
        level: 2,
        department: isArabic ? 'التسويق' : 'Marketing',
        headcount: 15,
        saudization: 65
      }
    },
    {
      id: '5',
      type: 'position',
      position: { x: 700, y: 200 },
      data: {
        title_en: 'IT Department',
        title_ar: 'قسم تقنية المعلومات',
        level: 2,
        department: isArabic ? 'تقنية المعلومات' : 'Information Technology',
        headcount: 22,
        saudization: 45
      }
    }
  ];

  const edges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e1-3', source: '1', target: '3', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e1-4', source: '1', target: '4', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e1-5', source: '1', target: '5', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } }
  ];

  return { nodes, edges };
}

function generateDivisionalChart(isArabic: boolean) {
  const nodes: Node[] = [
    {
      id: '1',
      type: 'position',
      position: { x: 400, y: 50 },
      data: {
        title_en: 'Corporate Headquarters',
        title_ar: 'المقر الرئيسي للشركة',
        level: 1,
        department: isArabic ? 'الإدارة العامة' : 'Corporate',
        headcount: 8,
        saudization: 100
      }
    },
    {
      id: '2',
      type: 'position',
      position: { x: 150, y: 200 },
      data: {
        title_en: 'Western Region Division',
        title_ar: 'قسم المنطقة الغربية',
        level: 2,
        department: isArabic ? 'المنطقة الغربية' : 'Western Region',
        headcount: 45,
        saudization: 72
      }
    },
    {
      id: '3',
      type: 'position',
      position: { x: 400, y: 200 },
      data: {
        title_en: 'Central Region Division',
        title_ar: 'قسم المنطقة الوسطى',
        level: 2,
        department: isArabic ? 'المنطقة الوسطى' : 'Central Region',
        headcount: 67,
        saudization: 78
      }
    },
    {
      id: '4',
      type: 'position',
      position: { x: 650, y: 200 },
      data: {
        title_en: 'Eastern Region Division',
        title_ar: 'قسم المنطقة الشرقية',
        level: 2,
        department: isArabic ? 'المنطقة الشرقية' : 'Eastern Region',
        headcount: 38,
        saudization: 65
      }
    }
  ];

  const edges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e1-3', source: '1', target: '3', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e1-4', source: '1', target: '4', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } }
  ];

  return { nodes, edges };
}

function generateMatrixChart(isArabic: boolean) {
  const nodes: Node[] = [
    {
      id: '1',
      type: 'position',
      position: { x: 400, y: 50 },
      data: {
        title_en: 'Executive Team',
        title_ar: 'الفريق التنفيذي',
        level: 1,
        department: isArabic ? 'الإدارة التنفيذية' : 'Executive',
        headcount: 5,
        saudization: 100
      }
    },
    {
      id: '2',
      type: 'position',
      position: { x: 200, y: 150 },
      data: {
        title_en: 'Project Manager A',
        title_ar: 'مدير المشروع أ',
        level: 2,
        department: isArabic ? 'إدارة المشاريع' : 'Project Management',
        headcount: 12,
        saudization: 75
      }
    },
    {
      id: '3',
      type: 'position',
      position: { x: 600, y: 150 },
      data: {
        title_en: 'Project Manager B',
        title_ar: 'مدير المشروع ب',
        level: 2,
        department: isArabic ? 'إدارة المشاريع' : 'Project Management',
        headcount: 15,
        saudization: 67
      }
    },
    {
      id: '4',
      type: 'position',
      position: { x: 100, y: 300 },
      data: {
        title_en: 'Technical Team',
        title_ar: 'الفريق التقني',
        level: 3,
        department: isArabic ? 'التقنية' : 'Technical',
        headcount: 20,
        saudization: 55
      }
    },
    {
      id: '5',
      type: 'position',
      position: { x: 700, y: 300 },
      data: {
        title_en: 'Business Team',
        title_ar: 'فريق الأعمال',
        level: 3,
        department: isArabic ? 'الأعمال' : 'Business',
        headcount: 18,
        saudization: 72
      }
    }
  ];

  const edges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e1-3', source: '1', target: '3', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e2-4', source: '2', target: '4', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e3-5', source: '3', target: '5', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
    // Matrix connections (dotted lines for dual reporting)
    { id: 'e2-5', source: '2', target: '5', type: 'smoothstep', style: { strokeDasharray: '5,5' }, markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e3-4', source: '3', target: '4', type: 'smoothstep', style: { strokeDasharray: '5,5' }, markerEnd: { type: MarkerType.ArrowClosed } }
  ];

  return { nodes, edges };
}

function generateFlatChart(isArabic: boolean) {
  const nodes: Node[] = [
    {
      id: '1',
      type: 'position',
      position: { x: 400, y: 100 },
      data: {
        title_en: 'Leadership Team',
        title_ar: 'فريق القيادة',
        level: 1,
        department: isArabic ? 'القيادة' : 'Leadership',
        headcount: 3,
        saudization: 100
      }
    },
    {
      id: '2',
      type: 'position',
      position: { x: 150, y: 250 },
      data: {
        title_en: 'Development Team',
        title_ar: 'فريق التطوير',
        level: 2,
        department: isArabic ? 'التطوير' : 'Development',
        headcount: 25,
        saudization: 60
      }
    },
    {
      id: '3',
      type: 'position',
      position: { x: 400, y: 250 },
      data: {
        title_en: 'Operations Team',
        title_ar: 'فريق العمليات',
        level: 2,
        department: isArabic ? 'العمليات' : 'Operations',
        headcount: 20,
        saudization: 75
      }
    },
    {
      id: '4',
      type: 'position',
      position: { x: 650, y: 250 },
      data: {
        title_en: 'Support Team',
        title_ar: 'فريق الدعم',
        level: 2,
        department: isArabic ? 'الدعم' : 'Support',
        headcount: 15,
        saudization: 80
      }
    }
  ];

  const edges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e1-3', source: '1', target: '3', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e1-4', source: '1', target: '4', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } }
  ];

  return { nodes, edges };
}

function generateNetworkChart(isArabic: boolean) {
  const nodes: Node[] = [
    {
      id: '1',
      type: 'position',
      position: { x: 400, y: 200 },
      data: {
        title_en: 'Core Hub',
        title_ar: 'المركز الأساسي',
        level: 1,
        department: isArabic ? 'المركز' : 'Core',
        headcount: 8,
        saudization: 100
      }
    },
    {
      id: '2',
      type: 'position',
      position: { x: 200, y: 100 },
      data: {
        title_en: 'Innovation Hub',
        title_ar: 'مركز الابتكار',
        level: 2,
        department: isArabic ? 'الابتكار' : 'Innovation',
        headcount: 15,
        saudization: 67
      }
    },
    {
      id: '3',
      type: 'position',
      position: { x: 600, y: 100 },
      data: {
        title_en: 'Client Hub',
        title_ar: 'مركز العملاء',
        level: 2,
        department: isArabic ? 'العملاء' : 'Client Services',
        headcount: 20,
        saudization: 75
      }
    },
    {
      id: '4',
      type: 'position',
      position: { x: 200, y: 300 },
      data: {
        title_en: 'Delivery Hub',
        title_ar: 'مركز التسليم',
        level: 2,
        department: isArabic ? 'التسليم' : 'Delivery',
        headcount: 25,
        saudization: 68
      }
    },
    {
      id: '5',
      type: 'position',
      position: { x: 600, y: 300 },
      data: {
        title_en: 'Strategy Hub',
        title_ar: 'مركز الاستراتيجية',
        level: 2,
        department: isArabic ? 'الاستراتيجية' : 'Strategy',
        headcount: 12,
        saudization: 83
      }
    }
  ];

  const edges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', type: 'smoothstep' },
    { id: 'e1-3', source: '1', target: '3', type: 'smoothstep' },
    { id: 'e1-4', source: '1', target: '4', type: 'smoothstep' },
    { id: 'e1-5', source: '1', target: '5', type: 'smoothstep' },
    { id: 'e2-3', source: '2', target: '3', type: 'smoothstep', style: { strokeDasharray: '3,3' } },
    { id: 'e2-4', source: '2', target: '4', type: 'smoothstep', style: { strokeDasharray: '3,3' } },
    { id: 'e3-5', source: '3', target: '5', type: 'smoothstep', style: { strokeDasharray: '3,3' } },
    { id: 'e4-5', source: '4', target: '5', type: 'smoothstep', style: { strokeDasharray: '3,3' } }
  ];

  return { nodes, edges };
}

function generateHybridChart(isArabic: boolean) {
  const nodes: Node[] = [
    {
      id: '1',
      type: 'position',
      position: { x: 400, y: 50 },
      data: {
        title_en: 'Executive Board',
        title_ar: 'مجلس الإدارة التنفيذي',
        level: 1,
        department: isArabic ? 'مجلس الإدارة' : 'Executive Board',
        headcount: 5,
        saudization: 100
      }
    },
    {
      id: '2',
      type: 'position',
      position: { x: 200, y: 150 },
      data: {
        title_en: 'Business Units',
        title_ar: 'وحدات الأعمال',
        level: 2,
        department: isArabic ? 'وحدات الأعمال' : 'Business Units',
        headcount: 45,
        saudization: 72
      }
    },
    {
      id: '3',
      type: 'position',
      position: { x: 600, y: 150 },
      data: {
        title_en: 'Shared Services',
        title_ar: 'الخدمات المشتركة',
        level: 2,
        department: isArabic ? 'الخدمات المشتركة' : 'Shared Services',
        headcount: 28,
        saudization: 85
      }
    },
    {
      id: '4',
      type: 'position',
      position: { x: 400, y: 250 },
      data: {
        title_en: 'Cross-functional Teams',
        title_ar: 'الفرق متعددة الوظائف',
        level: 3,
        department: isArabic ? 'الفرق المتخصصة' : 'Cross-functional',
        headcount: 35,
        saudization: 64
      }
    }
  ];

  const edges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e1-3', source: '1', target: '3', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e2-4', source: '2', target: '4', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e3-4', source: '3', target: '4', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } }
  ];

  return { nodes, edges };
}

function generateTeamBasedChart(isArabic: boolean) {
  const nodes: Node[] = [
    {
      id: '1',
      type: 'position',
      position: { x: 400, y: 100 },
      data: {
        title_en: 'Coordination Council',
        title_ar: 'مجلس التنسيق',
        level: 1,
        department: isArabic ? 'التنسيق' : 'Coordination',
        headcount: 6,
        saudization: 100
      }
    },
    {
      id: '2',
      type: 'position',
      position: { x: 150, y: 250 },
      data: {
        title_en: 'Product Team Alpha',
        title_ar: 'فريق المنتج ألفا',
        level: 2,
        department: isArabic ? 'فريق المنتج' : 'Product Team',
        headcount: 12,
        saudization: 67
      }
    },
    {
      id: '3',
      type: 'position',
      position: { x: 400, y: 250 },
      data: {
        title_en: 'Product Team Beta',
        title_ar: 'فريق المنتج بيتا',
        level: 2,
        department: isArabic ? 'فريق المنتج' : 'Product Team',
        headcount: 15,
        saudization: 73
      }
    },
    {
      id: '4',
      type: 'position',
      position: { x: 650, y: 250 },
      data: {
        title_en: 'Platform Team',
        title_ar: 'فريق المنصة',
        level: 2,
        department: isArabic ? 'فريق المنصة' : 'Platform Team',
        headcount: 18,
        saudization: 56
      }
    }
  ];

  const edges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', type: 'smoothstep' },
    { id: 'e1-3', source: '1', target: '3', type: 'smoothstep' },
    { id: 'e1-4', source: '1', target: '4', type: 'smoothstep' },
    { id: 'e2-3', source: '2', target: '3', type: 'smoothstep', style: { strokeDasharray: '3,3' } },
    { id: 'e3-4', source: '3', target: '4', type: 'smoothstep', style: { strokeDasharray: '3,3' } }
  ];

  return { nodes, edges };
}

function generateGeographicChart(isArabic: boolean) {
  const nodes: Node[] = [
    {
      id: '1',
      type: 'position',
      position: { x: 400, y: 50 },
      data: {
        title_en: 'National Headquarters',
        title_ar: 'المقر الوطني',
        level: 1,
        department: isArabic ? 'المقر الرئيسي' : 'National HQ',
        headcount: 15,
        saudization: 100
      }
    },
    {
      id: '2',
      type: 'position',
      position: { x: 100, y: 200 },
      data: {
        title_en: 'Riyadh Branch',
        title_ar: 'فرع الرياض',
        level: 2,
        department: isArabic ? 'فرع الرياض' : 'Riyadh Branch',
        headcount: 85,
        saudization: 82
      }
    },
    {
      id: '3',
      type: 'position',
      position: { x: 400, y: 200 },
      data: {
        title_en: 'Jeddah Branch',
        title_ar: 'فرع جدة',
        level: 2,
        department: isArabic ? 'فرع جدة' : 'Jeddah Branch',
        headcount: 65,
        saudization: 75
      }
    },
    {
      id: '4',
      type: 'position',
      position: { x: 700, y: 200 },
      data: {
        title_en: 'Dammam Branch',
        title_ar: 'فرع الدمام',
        level: 2,
        department: isArabic ? 'فرع الدمام' : 'Dammam Branch',
        headcount: 42,
        saudization: 68
      }
    }
  ];

  const edges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e1-3', source: '1', target: '3', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e1-4', source: '1', target: '4', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } }
  ];

  return { nodes, edges };
}

function generateProductBasedChart(isArabic: boolean) {
  const nodes: Node[] = [
    {
      id: '1',
      type: 'position',
      position: { x: 400, y: 50 },
      data: {
        title_en: 'Corporate Leadership',
        title_ar: 'القيادة المؤسسية',
        level: 1,
        department: isArabic ? 'القيادة المؤسسية' : 'Corporate Leadership',
        headcount: 8,
        saudization: 100
      }
    },
    {
      id: '2',
      type: 'position',
      position: { x: 150, y: 200 },
      data: {
        title_en: 'Digital Solutions',
        title_ar: 'الحلول الرقمية',
        level: 2,
        department: isArabic ? 'الحلول الرقمية' : 'Digital Solutions',
        headcount: 35,
        saudization: 63
      }
    },
    {
      id: '3',
      type: 'position',
      position: { x: 400, y: 200 },
      data: {
        title_en: 'Consulting Services',
        title_ar: 'الخدمات الاستشارية',
        level: 2,
        department: isArabic ? 'الخدمات الاستشارية' : 'Consulting Services',
        headcount: 28,
        saudization: 79
      }
    },
    {
      id: '4',
      type: 'position',
      position: { x: 650, y: 200 },
      data: {
        title_en: 'Training Programs',
        title_ar: 'برامج التدريب',
        level: 2,
        department: isArabic ? 'برامج التدريب' : 'Training Programs',
        headcount: 22,  
        saudization: 86
      }
    }
  ];

  const edges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e1-3', source: '1', target: '3', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e1-4', source: '1', target: '4', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } }
  ];

  return { nodes, edges };
}