import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Download, 
  Eye, 
  Edit, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Users,
  Brain,
  Zap,
  Archive,
  Search,
  Plus,
  Calendar
} from 'lucide-react';
import { CurrencyIcon } from '@/components/shared/CurrencyIcon';
import { useToast } from "@/hooks/use-toast";

interface ContractTemplate {
  id: string;
  name: string;
  type: string;
  language: 'en' | 'ar' | 'both';
  lastModified: Date;
  usageCount: number;
  aiGenerated: boolean;
  status: 'active' | 'draft' | 'archived';
}

interface GeneratedContract {
  id: string;
  employeeName: string;
  position: string;
  contractType: string;
  salary: number;
  startDate: Date;
  status: 'draft' | 'pending_review' | 'approved' | 'signed';
  generatedAt: Date;
  templateUsed: string;
  aiConfidence: number;
}

interface ContractData {
  employeeName: string;
  position: string;
  department: string;
  salary: number;
  contractType: string;
  startDate: string;
  probationPeriod: number;
  workingHours: string;
  benefits: string[];
  specialClauses: string;
}

export const AutomatedContractGeneration: React.FC = () => {
  const [templates, setTemplates] = useState<ContractTemplate[]>([]);
  const [contracts, setContracts] = useState<GeneratedContract[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [contractData, setContractData] = useState<ContractData>({
    employeeName: '',
    position: '',
    department: '',
    salary: 0,
    contractType: 'permanent',
    startDate: '',
    probationPeriod: 90,
    workingHours: '40',
    benefits: [],
    specialClauses: ''
  });
  const [activeTab, setActiveTab] = useState('generate');
  const { toast } = useToast();

  useEffect(() => {
    loadTemplatesAndContracts();
  }, []);

  const loadTemplatesAndContracts = async () => {
    // Mock data - replace with actual API calls
    setTemplates([
      {
        id: '1',
        name: 'Standard Employment Contract',
        type: 'Employment',
        language: 'both',
        lastModified: new Date(Date.now() - 86400000 * 2),
        usageCount: 147,
        aiGenerated: true,
        status: 'active'
      },
      {
        id: '2',
        name: 'Fixed-Term Contract Template',
        type: 'Fixed-Term',
        language: 'both',
        lastModified: new Date(Date.now() - 86400000 * 7),
        usageCount: 89,
        aiGenerated: true,
        status: 'active'
      },
      {
        id: '3',
        name: 'Part-Time Employment Contract',
        type: 'Part-Time',
        language: 'en',
        lastModified: new Date(Date.now() - 86400000 * 14),
        usageCount: 34,
        aiGenerated: false,
        status: 'active'
      },
      {
        id: '4',
        name: 'Consulting Agreement Template',
        type: 'Consulting',
        language: 'both',
        lastModified: new Date(Date.now() - 86400000 * 30),
        usageCount: 23,
        aiGenerated: true,
        status: 'draft'
      }
    ]);

    setContracts([
      {
        id: '1',
        employeeName: 'Ahmed Al-Rahman',
        position: 'Senior Software Engineer',
        contractType: 'permanent',
        salary: 12000,
        startDate: new Date('2024-09-15'),
        status: 'signed',
        generatedAt: new Date(Date.now() - 86400000 * 5),
        templateUsed: 'Standard Employment Contract',
        aiConfidence: 0.95
      },
      {
        id: '2',
        employeeName: 'Sarah Johnson',
        position: 'Marketing Manager',
        contractType: 'permanent',
        salary: 9500,
        startDate: new Date('2024-09-20'),
        status: 'pending_review',
        generatedAt: new Date(Date.now() - 86400000 * 2),
        templateUsed: 'Standard Employment Contract',
        aiConfidence: 0.92
      },
      {
        id: '3',
        employeeName: 'Mohammed Hassan',
        position: 'Data Analyst',
        contractType: 'fixed-term',
        salary: 7500,
        startDate: new Date('2024-10-01'),
        status: 'draft',
        generatedAt: new Date(Date.now() - 86400000 * 1),
        templateUsed: 'Fixed-Term Contract Template',
        aiConfidence: 0.88
      }
    ]);
  };

  const generateContract = async () => {
    if (!contractData.employeeName || !contractData.position || !contractData.salary) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before generating the contract.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Simulate AI contract generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newContract: GeneratedContract = {
        id: Date.now().toString(),
        employeeName: contractData.employeeName,
        position: contractData.position,
        contractType: contractData.contractType,
        salary: contractData.salary,
        startDate: new Date(contractData.startDate),
        status: 'draft',
        generatedAt: new Date(),
        templateUsed: 'Standard Employment Contract',
        aiConfidence: 0.93
      };

      setContracts(prev => [newContract, ...prev]);
      
      toast({
        title: "Contract Generated",
        description: `Employment contract for ${contractData.employeeName} has been generated successfully.`,
      });
      
      // Reset form
      setContractData({
        employeeName: '',
        position: '',
        department: '',
        salary: 0,
        contractType: 'permanent',
        startDate: '',
        probationPeriod: 90,
        workingHours: '40',
        benefits: [],
        specialClauses: ''
      });
      
      setActiveTab('contracts');
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate contract. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'signed': return 'bg-accent text-accent-foreground';
      case 'approved': return 'bg-primary text-primary-foreground';
      case 'pending_review': return 'bg-secondary text-secondary-foreground';
      case 'draft': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'signed': return <CheckCircle className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'pending_review': return <Clock className="h-4 w-4" />;
      case 'draft': return <Edit className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Automated Contract Generation</h1>
          <p className="text-muted-foreground">AI-powered contract drafting and management system</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            New Template
          </Button>
          <Button className="gap-2">
            <Brain className="h-4 w-4" />
            AI Assistant
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Templates</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {templates.filter(t => t.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {templates.length} total templates
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Generated This Month</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contracts.length}</div>
            <p className="text-xs text-muted-foreground">
              +23% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">
              {contracts.filter(c => c.status === 'pending_review').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg AI Confidence</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(contracts.reduce((acc, c) => acc + c.aiConfidence, 0) / contracts.length * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              High accuracy
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="generate">Generate Contract</TabsTrigger>
          <TabsTrigger value="contracts">Recent Contracts</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contract Generation Form</CardTitle>
              <CardDescription>
                Fill in the employee details to generate an AI-powered employment contract
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Employee Name *</label>
                  <Input
                    value={contractData.employeeName}
                    onChange={(e) => setContractData(prev => ({ ...prev, employeeName: e.target.value }))}
                    placeholder="Enter employee full name"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Position *</label>
                  <Input
                    value={contractData.position}
                    onChange={(e) => setContractData(prev => ({ ...prev, position: e.target.value }))}
                    placeholder="Enter job position"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Department</label>
                  <Select value={contractData.department} onValueChange={(value) => setContractData(prev => ({ ...prev, department: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="hr">Human Resources</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Monthly Salary (SAR) *</label>
                  <Input
                    type="number"
                    value={contractData.salary || ''}
                    onChange={(e) => setContractData(prev => ({ ...prev, salary: Number(e.target.value) }))}
                    placeholder="Enter monthly salary"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Contract Type</label>
                  <Select value={contractData.contractType} onValueChange={(value) => setContractData(prev => ({ ...prev, contractType: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="permanent">Permanent</SelectItem>
                      <SelectItem value="fixed-term">Fixed Term</SelectItem>
                      <SelectItem value="part-time">Part Time</SelectItem>
                      <SelectItem value="consulting">Consulting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <Input
                    type="date"
                    value={contractData.startDate}
                    onChange={(e) => setContractData(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Probation Period (Days)</label>
                  <Input
                    type="number"
                    value={contractData.probationPeriod}
                    onChange={(e) => setContractData(prev => ({ ...prev, probationPeriod: Number(e.target.value) }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Working Hours/Week</label>
                  <Input
                    value={contractData.workingHours}
                    onChange={(e) => setContractData(prev => ({ ...prev, workingHours: e.target.value }))}
                    placeholder="e.g., 40 hours"
                  />
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <label className="text-sm font-medium">Special Clauses</label>
                <Textarea
                  value={contractData.specialClauses}
                  onChange={(e) => setContractData(prev => ({ ...prev, specialClauses: e.target.value }))}
                  placeholder="Enter any special clauses or conditions"
                  rows={3}
                />
              </div>
              
              <div className="mt-6">
                <Button onClick={generateContract} disabled={isGenerating} className="gap-2">
                  {isGenerating ? (
                    <>
                      <Brain className="h-4 w-4 animate-spin" />
                      Generating Contract...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4" />
                      Generate AI Contract
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contracts" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Generated Contracts</h3>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search contracts..." className="pl-8" />
              </div>
            </div>
          </div>
          
          <div className="grid gap-4">
            {contracts.map((contract) => (
              <Card key={contract.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        {contract.employeeName}
                      </CardTitle>
                      <CardDescription>
                        {contract.position} • Generated {contract.generatedAt.toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(contract.status)}>
                        {getStatusIcon(contract.status)}
                        {contract.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Contract Type</p>
                      <p className="font-medium">{contract.contractType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Salary</p>
                      <p className="font-medium flex items-center gap-1">
                        <CurrencyIcon className="h-3 w-3" />
                        {contract.salary.toLocaleString()} SAR
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Start Date</p>
                      <p className="font-medium flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {contract.startDate.toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">AI Confidence</p>
                      <p className="font-medium">{(contract.aiConfidence * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Eye className="h-4 w-4" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Contract Templates</h3>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Template
            </Button>
          </div>
          
          <div className="grid gap-4">
            {templates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        {template.name}
                      </CardTitle>
                      <CardDescription>
                        {template.type} • Last modified {template.lastModified.toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {template.aiGenerated && (
                        <Badge variant="secondary" className="gap-1">
                          <Brain className="h-3 w-3" />
                          AI Generated
                        </Badge>
                      )}
                      <Badge className={getStatusColor(template.status)}>
                        {template.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Language Support</p>
                      <p className="font-medium">
                        {template.language === 'both' ? 'Arabic & English' : 
                         template.language === 'ar' ? 'Arabic' : 'English'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Usage Count</p>
                      <p className="font-medium">{template.usageCount} times</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Template Type</p>
                      <p className="font-medium">{template.type}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Eye className="h-4 w-4" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Archive className="h-4 w-4" />
                      Archive
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Contract Generation Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Generation Trends</h4>
                    <p className="text-sm text-muted-foreground">
                      Contract generation has increased by 34% this month, with permanent contracts being the most common type (67%).
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Template Performance</h4>
                    <p className="text-sm text-muted-foreground">
                      Standard Employment Contract template has the highest usage (147 times) with 95% approval rate.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">AI Accuracy</h4>
                    <p className="text-sm text-muted-foreground">
                      Average AI confidence score is 92.1%, with 89% of generated contracts approved without major revisions.
                    </p>
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