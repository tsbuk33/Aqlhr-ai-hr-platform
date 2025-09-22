import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Clock, 
  Users,
  AlertCircle,
  CheckCircle,
  Calendar,
  Filter,
  Search,
  Send
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  assignedTo: string[];
  assignedBy: string;
  status: 'pending' | 'in_progress' | 'review' | 'completed' | 'overdue';
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  createdAt: string;
  estimatedHours: number;
  category: 'project' | 'maintenance' | 'training' | 'admin';
  tags: string[];
}

interface TeamMember {
  id: string;
  name: string;
  nameAr: string;
  availability: 'available' | 'busy' | 'offline';
  workload: number; // 0-100%
}

interface TaskAssignmentInterfaceProps {
  isArabic: boolean;
}

export const TaskAssignmentInterface: React.FC<TaskAssignmentInterfaceProps> = ({ isArabic }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'overdue'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newTask, setNewTask] = useState({
    title: '',
    titleAr: '',
    description: '',
    descriptionAr: '',
    assignedTo: [] as string[],
    priority: 'medium' as Task['priority'],
    dueDate: '',
    estimatedHours: 0,
    category: 'project' as Task['category']
  });

  useEffect(() => {
    loadTasksData();
    loadTeamMembers();
  }, []);

  const loadTasksData = () => {
    setTasks([
      {
        id: 'task_001',
        title: 'Complete Q1 Reports',
        titleAr: 'إكمال تقارير الربع الأول',
        description: 'Prepare comprehensive quarterly reports',
        descriptionAr: 'إعداد التقارير الفصلية الشاملة',
        assignedTo: ['emp_001', 'emp_002'],
        assignedBy: 'manager_001',
        status: 'in_progress',
        priority: 'high',
        dueDate: '2024-03-15',
        createdAt: '2024-02-20',
        estimatedHours: 16,
        category: 'project',
        tags: ['reports', 'quarterly']
      },
      {
        id: 'task_002',
        title: 'Update Employee Handbook',
        titleAr: 'تحديث دليل الموظفين',
        description: 'Review and update company policies',
        descriptionAr: 'مراجعة وتحديث سياسات الشركة',
        assignedTo: ['emp_003'],
        assignedBy: 'manager_001',
        status: 'pending',
        priority: 'medium',
        dueDate: '2024-03-20',
        createdAt: '2024-02-25',
        estimatedHours: 8,
        category: 'admin',
        tags: ['policies', 'handbook']
      },
      {
        id: 'task_003',
        title: 'Safety Training Module',
        titleAr: 'وحدة تدريب السلامة',
        description: 'Develop new safety training content',
        descriptionAr: 'تطوير محتوى تدريبي جديد للسلامة',
        assignedTo: ['emp_004', 'emp_005'],
        assignedBy: 'manager_001',
        status: 'overdue',
        priority: 'high',
        dueDate: '2024-02-28',
        createdAt: '2024-02-01',
        estimatedHours: 24,
        category: 'training',
        tags: ['safety', 'training']
      }
    ]);
  };

  const loadTeamMembers = () => {
    setTeamMembers([
      { id: 'emp_001', name: 'Ahmed Al-Rashid', nameAr: 'أحمد الراشد', availability: 'available', workload: 65 },
      { id: 'emp_002', name: 'Fatima Al-Zahra', nameAr: 'فاطمة الزهراء', availability: 'busy', workload: 85 },
      { id: 'emp_003', name: 'Mohammed Al-Saud', nameAr: 'محمد السعود', availability: 'available', workload: 45 },
      { id: 'emp_004', name: 'Nora Al-Qasimi', nameAr: 'نورا القاسمي', availability: 'available', workload: 70 },
      { id: 'emp_005', name: 'Omar Al-Harbi', nameAr: 'عمر الحربي', availability: 'offline', workload: 30 }
    ]);
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 text-white';
      case 'in_progress':
        return 'bg-blue-500 text-white';
      case 'review':
        return 'bg-yellow-500 text-white';
      case 'overdue':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-red-500 bg-red-50';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-green-500 bg-green-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  };

  const getAvailabilityColor = (availability: TeamMember['availability']) => {
    switch (availability) {
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

  const handleCreateTask = () => {
    if (!newTask.title || !newTask.dueDate || newTask.assignedTo.length === 0) {
      return;
    }

    const task: Task = {
      id: `task_${Date.now()}`,
      title: newTask.title,
      titleAr: newTask.titleAr || newTask.title,
      description: newTask.description,
      descriptionAr: newTask.descriptionAr || newTask.description,
      assignedTo: newTask.assignedTo,
      assignedBy: 'current_manager',
      status: 'pending',
      priority: newTask.priority,
      dueDate: newTask.dueDate,
      createdAt: new Date().toISOString(),
      estimatedHours: newTask.estimatedHours,
      category: newTask.category,
      tags: []
    };

    setTasks([...tasks, task]);
    setNewTask({
      title: '', titleAr: '', description: '', descriptionAr: '',
      assignedTo: [], priority: 'medium', dueDate: '', estimatedHours: 0, category: 'project'
    });
    setShowNewTaskForm(false);
  };

  const formatNumber = (num: number) => {
    if (isArabic) {
      return num.toString().replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)]);
    }
    return num.toString();
  };

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' || task.status === filter;
    const matchesSearch = searchQuery === '' || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.titleAr.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            {isArabic ? 'تعيين المهام' : 'Task Assignment'}
          </div>
          <Button 
            size="sm" 
            onClick={() => setShowNewTaskForm(!showNewTaskForm)}
          >
            <Plus className="h-4 w-4 mr-1" />
            {isArabic ? 'مهمة جديدة' : 'New Task'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search and Filter */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={isArabic ? 'البحث في المهام...' : 'Search tasks...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto">
            {[
              { key: 'all', label: isArabic ? 'الكل' : 'All' },
              { key: 'pending', label: isArabic ? 'معلق' : 'Pending' },
              { key: 'in_progress', label: isArabic ? 'قيد التنفيذ' : 'In Progress' },
              { key: 'overdue', label: isArabic ? 'متأخر' : 'Overdue' }
            ].map((tab) => (
              <Button
                key={tab.key}
                variant={filter === tab.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(tab.key as any)}
                className="whitespace-nowrap"
              >
                {tab.label}
              </Button>
            ))}
          </div>

          {/* New Task Form */}
          {showNewTaskForm && (
            <Card className="border-2 border-primary/20">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <h4 className="font-medium">
                    {isArabic ? 'إنشاء مهمة جديدة' : 'Create New Task'}
                  </h4>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <Input
                      placeholder={isArabic ? 'عنوان المهمة' : 'Task Title'}
                      value={newTask.title}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    />
                    
                    <Textarea
                      placeholder={isArabic ? 'وصف المهمة' : 'Task Description'}
                      value={newTask.description}
                      onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                      rows={2}
                    />
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                      />
                      <Input
                        type="number"
                        placeholder={isArabic ? 'ساعات العمل' : 'Hours'}
                        value={newTask.estimatedHours}
                        onChange={(e) => setNewTask({...newTask, estimatedHours: parseInt(e.target.value) || 0})}
                      />
                    </div>

                    {/* Team Member Selection */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium">
                        {isArabic ? 'تعيين إلى' : 'Assign To'}
                      </p>
                      <div className="space-y-1">
                        {teamMembers.map((member) => (
                          <div key={member.id} className="flex items-center justify-between p-2 border rounded">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${getAvailabilityColor(member.availability)}`} />
                              <span className="text-sm">
                                {isArabic ? member.nameAr : member.name}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {formatNumber(member.workload)}%
                              </Badge>
                            </div>
                            <input
                              type="checkbox"
                              checked={newTask.assignedTo.includes(member.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewTask({...newTask, assignedTo: [...newTask.assignedTo, member.id]});
                                } else {
                                  setNewTask({...newTask, assignedTo: newTask.assignedTo.filter(id => id !== member.id)});
                                }
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleCreateTask} className="flex-1">
                      <Send className="h-4 w-4 mr-1" />
                      {isArabic ? 'إنشاء المهمة' : 'Create Task'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowNewTaskForm(false)}
                    >
                      {isArabic ? 'إلغاء' : 'Cancel'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tasks List */}
          <div className="space-y-3">
            {filteredTasks.map((task) => {
              const daysUntilDue = Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              
              return (
                <Card key={task.id} className={`border-l-4 ${getPriorityColor(task.priority)}`}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">
                            {isArabic ? task.titleAr : task.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {isArabic ? task.descriptionAr : task.description}
                          </p>
                        </div>
                        <Badge className={getStatusColor(task.status)}>
                          {task.status}
                        </Badge>
                      </div>

                      {/* Details */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>{formatNumber(task.assignedTo.length)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatNumber(task.estimatedHours)}h</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {daysUntilDue > 0 
                                ? `${formatNumber(daysUntilDue)} ${isArabic ? 'يوم' : 'days'}`
                                : `${formatNumber(Math.abs(daysUntilDue))} ${isArabic ? 'متأخر' : 'overdue'}`
                              }
                            </span>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {task.priority}
                        </Badge>
                      </div>

                      {/* Assigned Members */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {isArabic ? 'مُعين إلى:' : 'Assigned to:'}
                        </span>
                        <div className="flex gap-1">
                          {task.assignedTo.map((memberId) => {
                            const member = teamMembers.find(m => m.id === memberId);
                            return member ? (
                              <Badge key={memberId} variant="secondary" className="text-xs">
                                {isArabic ? member.nameAr : member.name}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredTasks.length === 0 && (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                {isArabic ? 'لا توجد مهام في هذه الفئة' : 'No tasks in this category'}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};