import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAdvancedPayroll } from '@/hooks/useAdvancedPayroll';
import { Loader2, Calendar, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const LeaveCalculator: React.FC = () => {
  const { calculateLeaves, allowancesLoading } = useAdvancedPayroll();
  const { toast } = useToast();
  const [leaveData, setLeaveData] = useState({
    employeeId: '',
    leaveType: 'annual',
    startDate: '',
    endDate: '',
    includingWeekends: false
  });

  const [calculation, setCalculation] = useState<any>(null);

  const handleCalculateLeave = async () => {
    if (!leaveData.employeeId || !leaveData.startDate || !leaveData.endDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      calculateLeaves({
        employee_id: leaveData.employeeId,
        year: new Date(leaveData.startDate).getFullYear()
      });

      toast({
        title: "Leave Calculation Started",
        description: "Leave calculation has been initiated"
      });
    } catch (error) {
      toast({
        title: "Calculation Error",
        description: "Failed to calculate leave",
        variant: "destructive"
      });
    }
  };

  const leaveTypes = [
    { value: 'annual', label: 'Annual Leave', color: 'bg-blue-100 text-blue-800' },
    { value: 'sick', label: 'Sick Leave', color: 'bg-red-100 text-red-800' },
    { value: 'maternity', label: 'Maternity Leave', color: 'bg-pink-100 text-pink-800' },
    { value: 'paternity', label: 'Paternity Leave', color: 'bg-green-100 text-green-800' },
    { value: 'hajj', label: 'Hajj Leave', color: 'bg-purple-100 text-purple-800' },
    { value: 'bereavement', label: 'Bereavement Leave', color: 'bg-gray-100 text-gray-800' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Leave Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="employeeId">Employee ID</Label>
            <Input
              id="employeeId"
              value={leaveData.employeeId}
              onChange={(e) => setLeaveData({ ...leaveData, employeeId: e.target.value })}
              placeholder="Enter employee ID"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="leaveType">Leave Type</Label>
            <Select value={leaveData.leaveType} onValueChange={(value) => setLeaveData({ ...leaveData, leaveType: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {leaveTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={leaveData.startDate}
              onChange={(e) => setLeaveData({ ...leaveData, startDate: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={leaveData.endDate}
              onChange={(e) => setLeaveData({ ...leaveData, endDate: e.target.value })}
            />
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button onClick={handleCalculateLeave} disabled={allowancesLoading}>
            {allowancesLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Clock className="mr-2 h-4 w-4" />}
            Calculate Leave
          </Button>
        </div>

        {calculation && (
          <div className="mt-6 p-4 border rounded-lg bg-muted/50">
            <h4 className="font-medium mb-3">Leave Calculation Results</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="text-sm text-muted-foreground">Total Days</span>
                <p className="font-medium">{calculation.total_days}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Working Days</span>
                <p className="font-medium">{calculation.working_days}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Weekends</span>
                <p className="font-medium">{calculation.weekend_days}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Pay Impact</span>
                <p className="font-medium">{calculation.salary_deduction ? `${calculation.salary_deduction} SAR` : 'Paid Leave'}</p>
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 border-t">
          <h4 className="font-medium mb-2">Saudi Labor Law Leave Types</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {leaveTypes.map((type) => (
              <Badge key={type.value} variant="outline" className={type.color}>
                {type.label}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};