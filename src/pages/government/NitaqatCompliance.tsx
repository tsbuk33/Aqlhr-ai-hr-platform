import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { SanadAIFileProcessor } from "@/components/sanad/SanadAIFileProcessor";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

const NitaqatCompliance = () => {
  const { isRTL } = useLanguage();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Nitaqat Compliance</h1>
          <p className="text-muted-foreground">Saudization monitoring and compliance tracking</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-status-success text-white">Green Zone</Badge>
          <Button variant="outline">Generate Report</Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="targets">Targets</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
          <TabsTrigger value="upload">{isRTL ? 'رفع الملفات' : 'File Upload'}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Rate</CardTitle>
                <CardDescription>Saudization percentage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-brand-primary">67.2%</div>
                <Progress value={67.2} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">Above target by 2.2%</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Target Rate</CardTitle>
                <CardDescription>Required minimum</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-brand-success">65%</div>
                <Badge className="mt-2 bg-status-success text-white">Achieved</Badge>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Nitaqat Status</CardTitle>
                <CardDescription>Current classification</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-brand-accent">Green</div>
                <p className="text-xs text-muted-foreground mt-2">Excellent compliance</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Saudi Employees</CardTitle>
                <CardDescription>Total Saudi workforce</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-brand-warning">1,913</div>
                <p className="text-xs text-muted-foreground mt-2">+45 this quarter</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="targets">
          <Card>
            <CardHeader>
              <CardTitle>Saudization Targets</CardTitle>
              <CardDescription>Track progress against Nitaqat requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Small Entities (50-100)</span>
                    <Badge className="bg-status-success text-white">10% Required</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Medium Entities (101-500)</span>
                    <Badge className="bg-status-success text-white">15% Required</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Large Entities (500+)</span>
                    <Badge className="bg-status-warning text-white">20% Required</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Current Classification</h4>
                  <p className="text-lg font-bold text-brand-primary">Large Entity</p>
                  <p className="text-sm text-muted-foreground">2,847 total employees</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Workforce Analysis</CardTitle>
              <CardDescription>Detailed breakdown of employee demographics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Saudi Nationals</h4>
                  <p className="text-2xl font-bold text-brand-success">1,913 (67.2%)</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Non-Saudi</h4>
                  <p className="text-2xl font-bold text-brand-accent">934 (32.8%)</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Total Workforce</h4>
                  <p className="text-2xl font-bold text-brand-primary">2,847</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="forecasting">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Forecasting</CardTitle>
              <CardDescription>Predict future compliance based on hiring trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Q1 2024 Projection</span>
                  <Badge className="bg-status-success text-white">68.1%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Q2 2024 Projection</span>
                  <Badge className="bg-status-success text-white">69.2%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Year-end Target</span>
                  <Badge className="bg-status-success text-white">70%</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="upload" className="space-y-6">
          <SanadAIFileProcessor
            platform="nitaqat"
            moduleType="government"
            onFileProcessed={(file) => {
              setUploadedFiles(prev => [...prev, file]);
              toast({
                title: isRTL ? "تم رفع الملف بنجاح" : "File uploaded successfully",
                description: isRTL ? `تم رفع ${file.name} بنجاح` : `${file.name} uploaded successfully`
              });
            }}
            acceptedTypes={['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']}
            maxFileSize={10}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NitaqatCompliance;