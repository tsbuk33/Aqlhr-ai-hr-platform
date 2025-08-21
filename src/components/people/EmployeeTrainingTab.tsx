import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GraduationCap, Award, Calendar, Clock, BookOpen, AlertCircle } from 'lucide-react';
import type { Employee } from '@/hooks/useEmployees';

interface EmployeeTrainingTabProps {
  employee: Employee;
}

export const EmployeeTrainingTab: React.FC<EmployeeTrainingTabProps> = ({ employee }) => {
  // Mock training data - in real implementation, this would come from API
  const trainingRecords = [
    {
      id: '1',
      course_name: 'Workplace Safety Training',
      course_type: 'HSE',
      status: 'completed',
      completion_date: '2024-01-15',
      expiry_date: '2025-01-15',
      certification_number: 'HSE-2024-001',
      training_provider: 'Saudi Safety Institute'
    },
    {
      id: '2',
      course_name: 'Leadership Development Program',
      course_type: 'Leadership',
      status: 'in_progress',
      completion_date: null,
      expiry_date: null,
      certification_number: null,
      training_provider: 'HR Development Center'
    }
  ];

  const upcomingTraining = [
    {
      id: '1',
      course_name: 'Advanced Excel Training',
      scheduled_date: '2024-02-15',
      training_provider: 'Tech Training Institute'
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: { variant: 'default' as const, text: 'Completed' },
      in_progress: { variant: 'secondary' as const, text: 'In Progress' },
      expired: { variant: 'destructive' as const, text: 'Expired' },
      scheduled: { variant: 'outline' as const, text: 'Scheduled' }
    };
    
    const config = variants[status] || variants.scheduled;
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const isExpiringSoon = (expiryDate: string | null) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);
    return expiry <= thirtyDaysFromNow && expiry > now;
  };

  return (
    <div className="space-y-6">
      {/* Training Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-primary" />
            <div>
              <div className="text-2xl font-bold">{trainingRecords.filter(t => t.status === 'completed').length}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-blue-500" />
            <div>
              <div className="text-2xl font-bold">{trainingRecords.filter(t => t.status === 'in_progress').length}</div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Award className="h-8 w-8 text-yellow-500" />
            <div>
              <div className="text-2xl font-bold">{trainingRecords.filter(t => t.certification_number).length}</div>
              <div className="text-sm text-muted-foreground">Certifications</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-8 w-8 text-orange-500" />
            <div>
              <div className="text-2xl font-bold">{trainingRecords.filter(t => t.expiry_date && isExpiringSoon(t.expiry_date)).length}</div>
              <div className="text-sm text-muted-foreground">Expiring Soon</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Current Training Records */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Training History
            </CardTitle>
            <Button>Add Training Record</Button>
          </div>
        </CardHeader>
        <CardContent>
          {trainingRecords.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No training records found</p>
              <p className="text-sm">Add training records to track employee development</p>
            </div>
          ) : (
            <div className="space-y-4">
              {trainingRecords.map(training => (
                <div key={training.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{training.course_name}</h4>
                        {getStatusBadge(training.status)}
                        {training.expiry_date && isExpiringSoon(training.expiry_date) && (
                          <Badge variant="outline" className="text-orange-600 border-orange-200">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Expires Soon
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4" />
                          <span>{training.course_type}</span>
                        </div>
                        
                        {training.completion_date && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>Completed: {new Date(training.completion_date).toLocaleDateString()}</span>
                          </div>
                        )}
                        
                        {training.expiry_date && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>Expires: {new Date(training.expiry_date).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        Provider: {training.training_provider}
                        {training.certification_number && (
                          <span className="ml-4">Certificate: {training.certification_number}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">View Details</Button>
                      {training.certification_number && (
                        <Button variant="outline" size="sm">Download Certificate</Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Training */}
      {upcomingTraining.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Training
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingTraining.map(training => (
                <div key={training.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{training.course_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(training.scheduled_date).toLocaleDateString()} • {training.training_provider}
                    </div>
                  </div>
                  <Badge variant="outline">Scheduled</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Required Training */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Required Training
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 border rounded-lg bg-orange-50 border-orange-200">
              <div className="flex items-center gap-2 font-medium text-orange-800">
                <AlertCircle className="h-4 w-4" />
                HSE Safety Refresher Training
              </div>
              <div className="text-sm text-orange-700 mt-1">
                Due by: March 1, 2024 (Required annually)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Training Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Training Matrix & Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Training matrix and skills assessment would be displayed here based on job role requirements
          </div>
          <Button variant="outline" className="mt-4">
            View Full Training Matrix
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};