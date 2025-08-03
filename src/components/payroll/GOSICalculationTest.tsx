import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calculator, Users, DollarSign } from 'lucide-react';
import { useGOSI } from '@/hooks/useGOSI';

interface TestEmployee {
  id: string;
  name: string;
  nationality: 'SAUDI' | 'NON_SAUDI';
  systemType: 'OLD' | 'NEW';
  hireDate: string;
  salary: number;
}

export const GOSICalculationTest: React.FC = () => {
  const { calculateGOSIContribution, loading, error } = useGOSI();
  const [results, setResults] = useState<any[]>([]);

  const testEmployees: TestEmployee[] = [
    {
      id: 'saudi-new-system',
      name: 'Ahmed Al-Rashid (Saudi - NEW System)',
      nationality: 'SAUDI' as const,
      systemType: 'NEW' as const,
      hireDate: '2025-08-01',
      salary: 15000
    },
    {
      id: 'saudi-old-system', 
      name: 'Fatima Al-Zahra (Saudi - OLD System)',
      nationality: 'SAUDI' as const,
      systemType: 'OLD' as const,
      hireDate: '2024-01-15',
      salary: 12000
    },
    {
      id: 'non-saudi-new-system',
      name: 'John Smith (Non-Saudi - NEW System)',
      nationality: 'NON_SAUDI' as const,
      systemType: 'NEW' as const,
      hireDate: '2025-09-01',
      salary: 18000
    },
    {
      id: 'non-saudi-old-system',
      name: 'Maria Garcia (Non-Saudi - OLD System)',
      nationality: 'NON_SAUDI' as const,
      systemType: 'OLD' as const,
      hireDate: '2023-05-10',
      salary: 14000
    }
  ];

  const runCalculations = async () => {
    const calculationResults = [];
    
    for (const employee of testEmployees) {
      const result = await calculateGOSIContribution(
        employee.id,
        employee.salary,
        '2024-08-03' // Using current date to test new rates
      );
      
      if (result) {
        calculationResults.push({
          employee,
          calculation: result
        });
      }
    }
    
    setResults(calculationResults);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getSystemBadgeColor = (systemType: string) => {
    return systemType === 'NEW' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';
  };

  const getNationalityBadgeColor = (nationality: string) => {
    return nationality === 'SAUDI' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          GOSI Calculation Test - 2024 Rates
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Testing new GOSI rates effective July 3, 2024 for both Saudi and non-Saudi employees
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-4">
          <Button 
            onClick={runCalculations} 
            disabled={loading}
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            {loading ? 'Calculating...' : 'Run Test Calculations'}
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800 font-medium">Error:</p>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Calculation Results
            </h3>
            
            <div className="grid gap-4">
              {results.map(({ employee, calculation }) => (
                <Card key={employee.id} className="border-l-4 border-l-primary">
                  <CardContent className="pt-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">{employee.name}</h4>
                        <div className="flex flex-wrap gap-2">
                          <Badge className={getNationalityBadgeColor(employee.nationality)}>
                            {employee.nationality}
                          </Badge>
                          <Badge className={getSystemBadgeColor(employee.systemType)}>
                            {employee.systemType} System
                          </Badge>
                          <Badge variant="outline">
                            Hired: {employee.hireDate}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="text-center">
                          <p className="text-muted-foreground">Salary</p>
                          <p className="font-semibold">{formatCurrency(employee.salary)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-muted-foreground">Employee Rate</p>
                          <p className="font-semibold">{calculation.rates.employee_rate}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-muted-foreground">Employer Rate</p>
                          <p className="font-semibold">{calculation.rates.employer_rate}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-muted-foreground">Total</p>
                          <p className="font-semibold text-primary">
                            {formatCurrency(calculation.contributions.total)}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                      <div className="bg-blue-50 p-3 rounded-md">
                        <p className="text-xs text-blue-600 uppercase tracking-wide">Employee Contribution</p>
                        <p className="text-lg font-bold text-blue-700">
                          {formatCurrency(calculation.contributions.employee)}
                        </p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-md">
                        <p className="text-xs text-green-600 uppercase tracking-wide">Employer Contribution</p>
                        <p className="text-lg font-bold text-green-700">
                          {formatCurrency(calculation.contributions.employer)}
                        </p>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-md">
                        <p className="text-xs text-purple-600 uppercase tracking-wide">Total GOSI</p>
                        <p className="text-lg font-bold text-purple-700">
                          {formatCurrency(calculation.contributions.total)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <h4 className="font-medium text-yellow-800 mb-2">2024 GOSI Rate Summary:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• <strong>Saudi Employees (NEW System):</strong> 9.75% employee + 11.75% employer = 21.5% total</li>
                <li>• <strong>Saudi Employees (OLD System):</strong> 9% employee + 9% employer = 18% total</li>
                <li>• <strong>Non-Saudi Employees (All Systems):</strong> 0% employee + 2% employer = 2% total</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};