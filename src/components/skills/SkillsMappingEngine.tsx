import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  User, 
  Users, 
  Star, 
  Award, 
  BookOpen, 
  TrendingDown,
  Network,
  Target,
  FileText,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Activity
} from 'lucide-react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

// Skills data
const individualSkillsData = [
  {
    id: '1',
    name: 'Ahmed Al-Mansouri',
    name_ar: 'أحمد المنصوري',
    department: 'Engineering',
    skills: [
      { name: 'React Development', level: 4, category: 'Technical', certified: true, lastAssessed: '2024-01-15' },
      { name: 'Team Leadership', level: 3, category: 'Soft Skills', certified: false, lastAssessed: '2024-01-10' },
      { name: 'DevOps', level: 2, category: 'Technical', certified: true, lastAssessed: '2024-01-12' },
      { name: 'Communication', level: 5, category: 'Soft Skills', certified: false, lastAssessed: '2024-01-18' }
    ],
    totalSkills: 12,
    certifications: 3,
    learningPathways: 2
  },
  {
    id: '2',
    name: 'Fatima Al-Zahra',
    name_ar: 'فاطمة الزهراء',
    department: 'Marketing',
    skills: [
      { name: 'Digital Marketing', level: 5, category: 'Technical', certified: true, lastAssessed: '2024-01-20' },
      { name: 'Analytics', level: 4, category: 'Technical', certified: true, lastAssessed: '2024-01-16' },
      { name: 'Project Management', level: 4, category: 'Soft Skills', certified: true, lastAssessed: '2024-01-14' },
      { name: 'Creativity', level: 5, category: 'Soft Skills', certified: false, lastAssessed: '2024-01-22' }
    ],
    totalSkills: 15,
    certifications: 5,
    learningPathways: 1
  }
];

const departmentSkillsMatrix = [
  {
    department: 'Engineering',
    department_ar: 'الهندسة',
    criticalSkills: [
      { skill: 'React/Vue.js', current: 85, required: 95, gap: -10 },
      { skill: 'Cloud Architecture', current: 70, required: 90, gap: -20 },
      { skill: 'DevOps', current: 60, required: 80, gap: -20 },
      { skill: 'AI/ML', current: 40, required: 70, gap: -30 }
    ],
    totalEmployees: 45,
    skillsAssessed: 42,
    avgSkillLevel: 3.2
  },
  {
    department: 'Marketing',
    department_ar: 'التسويق',
    criticalSkills: [
      { skill: 'Digital Marketing', current: 90, required: 95, gap: -5 },
      { skill: 'Data Analytics', current: 75, required: 85, gap: -10 },
      { skill: 'Content Strategy', current: 80, required: 90, gap: -10 },
      { skill: 'SEO/SEM', current: 65, required: 80, gap: -15 }
    ],
    totalEmployees: 28,
    skillsAssessed: 26,
    avgSkillLevel: 3.8
  }
];

const skillsInventoryData = [
  { category: 'Technical Skills', total: 156, proficient: 98, developing: 45, beginner: 13 },
  { category: 'Soft Skills', total: 134, proficient: 89, developing: 34, beginner: 11 },
  { category: 'Leadership', total: 67, proficient: 23, developing: 32, beginner: 12 },
  { category: 'Industry Knowledge', total: 89, proficient: 56, developing: 24, beginner: 9 }
];

const skillDecayData = [
  { skill: 'Old Framework Skills', month: 'Jan', decay: 5 },
  { skill: 'Old Framework Skills', month: 'Feb', decay: 12 },
  { skill: 'Old Framework Skills', month: 'Mar', decay: 18 },
  { skill: 'Legacy Systems', month: 'Jan', decay: 8 },
  { skill: 'Legacy Systems', month: 'Feb', decay: 15 },
  { skill: 'Legacy Systems', month: 'Mar', decay: 22 }
];

export const SkillsMappingEngine: React.FC = () => {
  const { isArabic } = useSimpleLanguage();
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('individual');

  return (
    <div className="space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Skills Mapping Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              {isArabic ? 'الملفات الشخصية للمهارات' : 'Individual Skills Profiles'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">847</div>
            <div className="text-sm text-muted-foreground">
              {isArabic ? 'موظف مع تقييم مهارات كامل' : 'Employees with complete skills assessment'}
            </div>
            <div className="mt-2">
              <Progress value={85} className="h-2" />
              <div className="text-xs text-muted-foreground mt-1">85% {isArabic ? 'مكتمل' : 'completed'}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Network className="w-5 h-5 text-green-600" />
              {isArabic ? 'جرد المهارات التنظيمية' : 'Organizational Skills Inventory'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">1,247</div>
            <div className="text-sm text-muted-foreground">
              {isArabic ? 'مهارة فريدة مسجلة' : 'Unique skills registered'}
            </div>
            <div className="mt-2">
              <Progress value={92} className="h-2" />
              <div className="text-xs text-muted-foreground mt-1">92% {isArabic ? 'مُعيَّن' : 'mapped'}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-600" />
              {isArabic ? 'المهارات الحرجة' : 'Critical Skills'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">23</div>
            <div className="text-sm text-muted-foreground">
              {isArabic ? 'مهارات تحتاج تطوير عاجل' : 'Skills need urgent development'}
            </div>
            <div className="mt-2">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  {isArabic ? 'تحتاج انتباه فوري' : 'Requires immediate attention'}
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skills Mapping Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="individual">
            {isArabic ? 'الملفات الشخصية للأفراد' : 'Individual Profiles'}
          </TabsTrigger>
          <TabsTrigger value="organizational">
            {isArabic ? 'الجرد التنظيمي' : 'Organizational Inventory'}
          </TabsTrigger>
        </TabsList>

        {/* Individual Skills Profiles */}
        <TabsContent value="individual" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                {isArabic ? 'الملفات الشخصية للمهارات الفردية' : 'Individual Skills Profiles'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Employee List */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">
                    {isArabic ? 'قائمة الموظفين' : 'Employee Directory'}
                  </h3>
                  {individualSkillsData.map((employee) => (
                    <Card 
                      key={employee.id} 
                      className={`cursor-pointer transition-all ${
                        selectedEmployee === employee.id ? 'ring-2 ring-primary' : 'hover:shadow-md'
                      }`}
                      onClick={() => setSelectedEmployee(employee.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">
                              {isArabic ? employee.name_ar : employee.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">{employee.department}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm font-medium">
                                {(employee.skills.reduce((acc, skill) => acc + skill.level, 0) / employee.skills.length).toFixed(1)}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {employee.totalSkills} {isArabic ? 'مهارة' : 'skills'}
                            </p>
                          </div>
                        </div>
                        
                        {/* Skills Overview */}
                        <div className="grid grid-cols-2 gap-2 mt-3">
                          <div className="flex items-center gap-1 text-sm">
                            <Award className="w-4 h-4 text-blue-500" />
                            <span>{employee.certifications} {isArabic ? 'شهادة' : 'certs'}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <BookOpen className="w-4 h-4 text-green-500" />
                            <span>{employee.learningPathways} {isArabic ? 'مسار' : 'paths'}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Employee Skills Detail */}
                {selectedEmployee && (
                  <div className="space-y-4">
                    {(() => {
                      const employee = individualSkillsData.find(e => e.id === selectedEmployee);
                      if (!employee) return null;
                      
                      return (
                        <>
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">
                                {isArabic ? 'تفاصيل المهارات' : 'Skills Breakdown'}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                {employee.skills.map((skill, index) => (
                                  <div key={index} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium">{skill.name}</span>
                                        {skill.certified && (
                                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                            <Award className="w-3 h-3 mr-1" />
                                            {isArabic ? 'معتمد' : 'Certified'}
                                          </Badge>
                                        )}
                                      </div>
                                      <Badge variant={skill.category === 'Technical' ? 'default' : 'secondary'}>
                                        {isArabic && skill.category === 'Technical' ? 'تقني' :
                                         isArabic && skill.category === 'Soft Skills' ? 'مهارات شخصية' : 
                                         skill.category}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Progress value={skill.level * 20} className="flex-1 h-2" />
                                      <span className="text-sm font-medium">{skill.level}/5</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      {isArabic ? 'آخر تقييم:' : 'Last assessed:'} {skill.lastAssessed}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>

                          {/* Skill Decay Prediction */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg flex items-center gap-2">
                                <TrendingDown className="w-5 h-5 text-orange-500" />
                                {isArabic ? 'توقع تآكل المهارات' : 'Skill Decay Predictions'}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={skillDecayData}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="month" />
                                  <YAxis />
                                  <Tooltip />
                                  <Line type="monotone" dataKey="decay" stroke="#f59e0b" strokeWidth={2} />
                                </LineChart>
                              </ResponsiveContainer>
                            </CardContent>
                          </Card>
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Organizational Skills Inventory */}
        <TabsContent value="organizational" className="space-y-6">
          {/* Department Skills Matrix */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                {isArabic ? 'مصفوفة المهارات حسب القسم' : 'Department-wise Skills Matrix'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {departmentSkillsMatrix.map((dept, index) => (
                  <Card key={index} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">
                          {isArabic ? dept.department_ar : dept.department}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{dept.totalEmployees} {isArabic ? 'موظف' : 'employees'}</span>
                          <span>{dept.skillsAssessed} {isArabic ? 'مُقيَّم' : 'assessed'}</span>
                          <span>{isArabic ? 'متوسط المهارات:' : 'Avg Skills:'} {dept.avgSkillLevel}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {dept.criticalSkills.map((skill, skillIndex) => (
                          <div key={skillIndex} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{skill.skill}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm">{skill.current}%</span>
                                {skill.gap < 0 && (
                                  <Badge variant="destructive" className="text-xs">
                                    {skill.gap}%
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="relative">
                              <Progress value={skill.current} className="h-2" />
                              <div 
                                className="absolute top-0 h-2 border-r-2 border-orange-500"
                                style={{ left: `${skill.required}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>{isArabic ? 'الحالي:' : 'Current:'} {skill.current}%</span>
                              <span>{isArabic ? 'المطلوب:' : 'Required:'} {skill.required}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Skills Inventory Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="w-5 h-5" />
                  {isArabic ? 'توزيع المهارات' : 'Skills Distribution'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={skillsInventoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="proficient" stackId="a" fill="#10b981" />
                    <Bar dataKey="developing" stackId="a" fill="#f59e0b" />
                    <Bar dataKey="beginner" stackId="a" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  {isArabic ? 'خريطة نقل المعرفة' : 'Knowledge Transfer Map'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      {isArabic 
                        ? 'تم تحديد 12 خبيرًا في المجال يمكنهم نقل المعرفة'
                        : '12 subject matter experts identified for knowledge transfer'
                      }
                    </AlertDescription>
                  </Alert>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">34</div>
                      <div className="text-sm text-muted-foreground">
                        {isArabic ? 'مجلسات معرفة نشطة' : 'Active knowledge sessions'}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">89%</div>
                      <div className="text-sm text-muted-foreground">
                        {isArabic ? 'معدل نجاح النقل' : 'Transfer success rate'}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};