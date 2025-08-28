/**
 * Context Engineering Dashboard
 * Advanced prompt engineering and AI context optimization interface
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Brain, Zap, Target, Sparkles, BookOpen, Settings, CheckCircle2, ArrowRight } from 'lucide-react';
import { contextEngineeringService } from '@/services/context-engineering.service';
import { ContextTemplate, ContextEngineering, ContextOptimization } from '@/types/context-engineering';

export default function ContextDashboard() {
  const [templates, setTemplates] = useState<ContextTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ContextTemplate | null>(null);
  const [variables, setVariables] = useState<Record<string, any>>({});
  const [generatedContext, setGeneratedContext] = useState<ContextEngineering | null>(null);
  const [optimization, setOptimization] = useState<ContextOptimization | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [activeTab, setActiveTab] = useState('templates');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const templateData = await contextEngineeringService.getTemplates();
      setTemplates(templateData);
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    setSelectedTemplate(template || null);
    
    // Initialize variables with default values
    const initialVariables: Record<string, any> = {};
    template?.variables.forEach(variable => {
      initialVariables[variable.id] = variable.defaultValue || '';
    });
    setVariables(initialVariables);
  };

  const handleVariableChange = (variableId: string, value: any) => {
    setVariables(prev => ({
      ...prev,
      [variableId]: value
    }));
  };

  const generateContext = async () => {
    if (!selectedTemplate) return;
    
    setIsGenerating(true);
    try {
      const result = await contextEngineeringService.executeContextEngineering(
        selectedTemplate.id,
        variables,
        'manus-ai'
      );
      setGeneratedContext(result);
    } catch (error) {
      console.error('Error generating context:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const optimizePrompt = async () => {
    if (!customPrompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const result = await contextEngineeringService.optimizePrompt(customPrompt);
      setOptimization(result);
    } catch (error) {
      console.error('Error optimizing prompt:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'hr_policy': return <Settings className="h-4 w-4" />;
      case 'recruitment': return <Target className="h-4 w-4" />;
      case 'performance': return <Zap className="h-4 w-4" />;
      case 'compliance': return <CheckCircle2 className="h-4 w-4" />;
      case 'training': return <BookOpen className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'hr_policy': return 'bg-blue-500/10 text-blue-700';
      case 'recruitment': return 'bg-green-500/10 text-green-700';
      case 'performance': return 'bg-purple-500/10 text-purple-700';
      case 'compliance': return 'bg-orange-500/10 text-orange-700';
      case 'training': return 'bg-indigo-500/10 text-indigo-700';
      default: return 'bg-gray-500/10 text-gray-700';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Brain className="h-8 w-8 text-primary" />
            Context Engineering
          </h1>
          <p className="text-muted-foreground mt-1">
            Advanced prompt engineering and AI context optimization for Saudi HR workflows
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{templates.length}</p>
                <p className="text-xs text-muted-foreground">Available Templates</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {templates.filter(t => t.saudiCompliance).length}
                </p>
                <p className="text-xs text-muted-foreground">Saudi Compliant</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {templates.filter(t => t.islamicConsiderations).length}
                </p>
                <p className="text-xs text-muted-foreground">Islamic Values</p>
              </div>
              <Sparkles className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">95%</p>
                <p className="text-xs text-muted-foreground">Avg Effectiveness</p>
              </div>
              <Target className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="templates">Template Library</TabsTrigger>
          <TabsTrigger value="generator">Context Generator</TabsTrigger>
          <TabsTrigger value="optimizer">Prompt Optimizer</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Templates</CardTitle>
              <CardDescription>
                Pre-built templates for common Saudi HR scenarios with Islamic values integration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {templates.map((template) => (
                  <Card key={template.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${getCategoryColor(template.category)}`}>
                            {getCategoryIcon(template.category)}
                          </div>
                          <h3 className="font-semibold">{template.name}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {template.description}
                        </p>
                        <div className="flex gap-2">
                          {template.saudiCompliance && (
                            <Badge variant="secondary" className="text-xs">
                              Saudi Compliant
                            </Badge>
                          )}
                          {template.islamicConsiderations && (
                            <Badge variant="secondary" className="text-xs">
                              Islamic Values
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {template.variables.length} variables
                          </Badge>
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          handleTemplateSelect(template.id);
                          setActiveTab('generator');
                        }}
                        size="sm"
                      >
                        Use Template
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generator" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Template Configuration</CardTitle>
                <CardDescription>
                  Configure variables for your selected template
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Template</Label>
                  <Select value={selectedTemplate?.id || ''} onValueChange={handleTemplateSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedTemplate && (
                  <>
                    {selectedTemplate.variables.map((variable) => (
                      <div key={variable.id} className="space-y-2">
                        <Label>
                          {variable.name}
                          {variable.required && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                        {variable.type === 'select' ? (
                          <Select
                            value={variables[variable.id] || ''}
                            onValueChange={(value) => handleVariableChange(variable.id, value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={`Select ${variable.name}`} />
                            </SelectTrigger>
                            <SelectContent>
                              {variable.options?.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : variable.type === 'number' ? (
                          <Input
                            type="number"
                            value={variables[variable.id] || ''}
                            onChange={(e) => handleVariableChange(variable.id, e.target.value)}
                            placeholder={variable.description}
                          />
                        ) : (
                          <Input
                            value={variables[variable.id] || ''}
                            onChange={(e) => handleVariableChange(variable.id, e.target.value)}
                            placeholder={variable.description}
                          />
                        )}
                        <p className="text-xs text-muted-foreground">
                          {variable.description}
                        </p>
                      </div>
                    ))}

                    <Button 
                      onClick={generateContext} 
                      disabled={isGenerating}
                      className="w-full"
                    >
                      {isGenerating ? (
                        <>
                          <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                          Generating Context...
                        </>
                      ) : (
                        <>
                          <Brain className="h-4 w-4 mr-2" />
                          Generate Context
                        </>
                      )}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {generatedContext && (
              <Card>
                <CardHeader>
                  <CardTitle>Generated Context</CardTitle>
                  <CardDescription>
                    AI-optimized prompt with Saudi compliance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {generatedContext.effectiveness}%
                      </div>
                      <div className="text-xs text-muted-foreground">Effectiveness</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {generatedContext.saudiLawAlignment}%
                      </div>
                      <div className="text-xs text-muted-foreground">Saudi Law</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {generatedContext.culturalSensitivity}%
                      </div>
                      <div className="text-xs text-muted-foreground">Cultural</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Generated Prompt</Label>
                    <Textarea
                      value={generatedContext.generatedPrompt}
                      readOnly
                      rows={8}
                      className="font-mono text-sm"
                    />
                  </div>

                  {generatedContext.response && (
                    <div className="space-y-2">
                      <Label>AI Response</Label>
                      <Textarea
                        value={generatedContext.response}
                        readOnly
                        rows={6}
                        className="text-sm"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="optimizer" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Prompt Optimization</CardTitle>
                <CardDescription>
                  Enhance your prompts with Saudi-specific context and Islamic values
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Original Prompt</Label>
                  <Textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Enter your original prompt here..."
                    rows={6}
                  />
                </div>

                <Button 
                  onClick={optimizePrompt} 
                  disabled={!customPrompt.trim() || isGenerating}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                      Optimizing Prompt...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Optimize Prompt
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {optimization && (
              <Card>
                <CardHeader>
                  <CardTitle>Optimization Results</CardTitle>
                  <CardDescription>
                    Enhanced prompt with {optimization.estimatedImprovement}% improvement
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Progress value={optimization.estimatedImprovement} className="flex-1" />
                    <span className="text-sm font-medium">
                      {optimization.estimatedImprovement}%
                    </span>
                  </div>

                  <div className="space-y-2">
                    <Label>Optimized Prompt</Label>
                    <Textarea
                      value={optimization.optimizedPrompt}
                      readOnly
                      rows={6}
                      className="font-mono text-sm"
                    />
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-sm">Improvements Applied</h4>
                      <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                        {optimization.improvements.map((improvement, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <ArrowRight className="h-3 w-3 mt-0.5 flex-shrink-0" />
                            {improvement}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm">Saudi-Specific Enhancements</h4>
                      <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                        {optimization.saudiSpecificEnhancements.map((enhancement, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <ArrowRight className="h-3 w-3 mt-0.5 flex-shrink-0" />
                            {enhancement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}