import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAdvancedPayroll } from '@/hooks/useAdvancedPayroll';
import { Loader2, Award, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const EOSCalculator: React.FC = () => {
  const { calculateEOS, isCalculatingEOS } = useAdvancedPayroll();
  const { toast } = useToast();
  const [eosData, setEosData] = useState({
    employeeId: '',
    terminationType: 'resignation',
    lastWorkingDay: ''
  });

  const [calculation, setCalculation] = useState<any>(null);

  const handleCalculateEOS = async () => {
    if (!eosData.employeeId || !eosData.lastWorkingDay) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      calculateEOS({
        employee_id: eosData.employeeId,
        calculation_date: eosData.lastWorkingDay,
        reason: eosData.terminationType as 'resignation' | 'termination' | 'retirement' | 'death'
      });

      toast({
        title: "EOS Calculation Started",
        description: "End of service calculation has been initiated"
      });
    } catch (error) {
      toast({
        title: "Calculation Error",
        description: "Failed to calculate end of service",
        variant: "destructive"
      });
    }
  };

  const terminationTypes = [
    { value: 'resignation', label: 'Employee Resignation', description: 'Voluntary resignation by employee' },
    { value: 'termination', label: 'Company Termination', description: 'Termination by company' },
    { value: 'contract_end', label: 'Contract End', description: 'Natural end of contract' },
    { value: 'retirement', label: 'Retirement', description: 'Employee retirement' },
    { value: 'death', label: 'Death', description: 'Employee death in service' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          End of Service Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="employeeId">Employee ID</Label>
            <Input
              id="employeeId"
              value={eosData.employeeId}
              onChange={(e) => setEosData({ ...eosData, employeeId: e.target.value })}
              placeholder="Enter employee ID"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="terminationType">Termination Type</Label>
            <Select value={eosData.terminationType} onValueChange={(value) => setEosData({ ...eosData, terminationType: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {terminationTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="lastWorkingDay">Last Working Day</Label>
            <Input
              id="lastWorkingDay"
              type="date"
              value={eosData.lastWorkingDay}
              onChange={(e) => setEosData({ ...eosData, lastWorkingDay: e.target.value })}
            />
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button onClick={handleCalculateEOS} disabled={isCalculatingEOS}>
            {isCalculatingEOS ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <TrendingUp className="mr-2 h-4 w-4" />}
            Calculate EOS
          </Button>
        </div>

        {calculation && (
          <div className="mt-6 p-4 border rounded-lg bg-muted/50">
            <h4 className="font-medium mb-3">End of Service Calculation</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-muted-foreground">Service Years</span>
                  <p className="font-medium">{calculation.service_years} years</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Basic Salary</span>
                  <p className="font-medium">{calculation.basic_salary} SAR</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Last Month Salary</span>
                  <p className="font-medium">{calculation.last_month_salary} SAR</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-muted-foreground">EOS Rate</span>
                  <p className="font-medium">{calculation.eos_rate}%</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Unused Leave</span>
                  <p className="font-medium">{calculation.unused_leave_amount} SAR</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <span className="text-sm text-muted-foreground">Total EOS Amount</span>
                  <p className="text-lg font-bold text-primary">{calculation.total_eos_amount} SAR</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 border-t">
          <h4 className="font-medium mb-2">Saudi Labor Law EOS Rules</h4>
          <div className="space-y-2">
            <Badge variant="outline" className="bg-green-100 text-green-800">
              First 5 years: Half month salary per year
            </Badge>
            <Badge variant="outline" className="bg-blue-100 text-blue-800">
              After 5 years: One month salary per year
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};