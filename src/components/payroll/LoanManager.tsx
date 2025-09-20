import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAdvancedPayroll } from '@/hooks/useAdvancedPayroll';
import { Loader2, Plus, Calculator } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const LoanManager: React.FC = () => {
  const { createLoan, allowancesLoading } = useAdvancedPayroll();
  const { toast } = useToast();
  const [loanData, setLoanData] = useState({
    employeeId: '',
    loanAmount: '',
    interestRate: '0',
    termMonths: '',
    loanType: 'personal'
  });

  const handleCalculateLoan = async () => {
    if (!loanData.employeeId || !loanData.loanAmount || !loanData.termMonths) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      createLoan({
        employee_id: loanData.employeeId,
        loan_type: loanData.loanType as any,
        loan_amount: parseFloat(loanData.loanAmount),
        monthly_deduction: parseFloat(loanData.loanAmount) / parseInt(loanData.termMonths),
        installments_total: parseInt(loanData.termMonths),
        installments_paid: 0,
        remaining_amount: parseFloat(loanData.loanAmount),
        status: 'active',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + parseInt(loanData.termMonths) * 30 * 24 * 60 * 60 * 1000).toISOString()
      });

      toast({
        title: "Loan Created",
        description: "Employee loan has been created successfully"
      });
    } catch (error) {
      toast({
        title: "Creation Error",
        description: "Failed to create loan",
        variant: "destructive"
      });
    }
  };

  const loanTypes = [
    { value: 'personal', label: 'Personal Loan' },
    { value: 'emergency', label: 'Emergency Loan' },
    { value: 'advance', label: 'Salary Advance' },
    { value: 'housing', label: 'Housing Loan' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Loan & Advance Manager
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="employeeId">Employee ID</Label>
            <Input
              id="employeeId"
              value={loanData.employeeId}
              onChange={(e) => setLoanData({ ...loanData, employeeId: e.target.value })}
              placeholder="Enter employee ID"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="loanType">Loan Type</Label>
            <Select value={loanData.loanType} onValueChange={(value) => setLoanData({ ...loanData, loanType: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {loanTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="loanAmount">Loan Amount (SAR)</Label>
            <Input
              id="loanAmount"
              type="number"
              value={loanData.loanAmount}
              onChange={(e) => setLoanData({ ...loanData, loanAmount: e.target.value })}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="interestRate">Interest Rate (%)</Label>
            <Input
              id="interestRate"
              type="number"
              step="0.01"
              value={loanData.interestRate}
              onChange={(e) => setLoanData({ ...loanData, interestRate: e.target.value })}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="termMonths">Term (Months)</Label>
            <Input
              id="termMonths"
              type="number"
              value={loanData.termMonths}
              onChange={(e) => setLoanData({ ...loanData, termMonths: e.target.value })}
              placeholder="12"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button onClick={handleCalculateLoan} disabled={allowancesLoading}>
            {allowancesLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Calculator className="mr-2 h-4 w-4" />}
            Calculate Loan
          </Button>
        </div>

        <div className="pt-4 border-t">
          <h4 className="font-medium mb-2">Loan Types Information</h4>
          <div className="grid grid-cols-2 gap-2">
            {loanTypes.map((type) => (
              <Badge key={type.value} variant="outline">
                {type.label}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};