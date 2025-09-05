import React, { useEffect } from 'react';
import { useLanguage } from "@/hooks/useLanguageCompat";
import { DatabaseOrchestrator } from '@/components/database/DatabaseOrchestrator';
import { IntegrationGateway } from '@/components/integration/IntegrationGateway';
import { SecurityManager } from '@/components/security/SecurityManager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, Globe, Shield, Zap, CheckCircle, Activity } from 'lucide-react';

const DataFoundationTest = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  useEffect(() => {
    document.title = 'AqlHR Data Foundation Test - Database & Integration Layer';
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          {isArabic ? 'اختبار طبقة البيانات والتكامل' : 'Data Foundation & Integration Layer Test'}
        </h1>
        <p className="text-muted-foreground">
          {isArabic 
            ? 'اختبار وتقييم أنظمة قواعد البيانات المتقدمة والتكامل مع الحكومة السعودية'
            : 'Testing and validation of advanced database systems and Saudi government integration'
          }
        </p>
      </div>

      {/* System Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            {isArabic ? 'حالة النظام' : 'System Status'}
          </CardTitle>
          <CardDescription>
            {isArabic 
              ? 'نظرة عامة على حالة أنظمة البيانات والأمان والتكامل'
              : 'Overview of database, security, and integration system status'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                <span className="text-sm">Database Health</span>
              </div>
              <Badge variant="default">95%</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="text-sm">Integrations</span>
              </div>
              <Badge variant="default">5 Connected</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="text-sm">Security Score</span>
              </div>
              <Badge variant="default">92%</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span className="text-sm">Automation</span>
              </div>
              <Badge variant="default">Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Systems Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <DatabaseOrchestrator />
        <IntegrationGateway />
        <SecurityManager />
      </div>

      {/* Architecture Overview */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isArabic ? 'هندسة البيانات المتقدمة' : 'Advanced Data Architecture'}
          </CardTitle>
          <CardDescription>
            {isArabic 
              ? 'نظرة شاملة على البنية التحتية للبيانات والأمان'
              : 'Comprehensive overview of data infrastructure and security'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Database className="h-4 w-4" />
                Database Architecture
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>PostgreSQL Operational Database</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>Analytics Views & Functions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>Data Lake Architecture</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>Automated Backup & Recovery</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Integration Framework
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>API Gateway Implementation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>Government API Integration (Qiwa, GOSI, Absher)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>Real-time Data Synchronization</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>Event-driven Architecture</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Security Implementation
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>Saudi PDPL Compliance</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>AES-256 Encryption (Rest & Transit)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>Row-Level Security (RLS)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>Comprehensive Audit Logging</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Automation Features
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>Automated Health Monitoring</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>Performance Optimization</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>Compliance Automation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>Threat Detection & Response</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Testing Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isArabic ? 'تعليمات الاختبار' : 'Testing Instructions'}
          </CardTitle>
          <CardDescription>
            {isArabic 
              ? 'كيفية اختبار أنظمة البيانات والتكامل المختلفة'
              : 'How to test the different data foundation and integration systems'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/20">
            <p className="text-sm">
              <strong>Database Orchestrator:</strong> Test health checks, backups, analytics setup, and performance optimization.
            </p>
          </div>
          <div className="p-3 border-l-4 border-green-500 bg-green-50 dark:bg-green-950/20">
            <p className="text-sm">
              <strong>Integration Gateway:</strong> Test connections to Qiwa, GOSI, Absher, MOL, and internal systems.
            </p>
          </div>
          <div className="p-3 border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-950/20">
            <p className="text-sm">
              <strong>Security Manager:</strong> Run security audits, compliance checks, encryption, and threat scans.
            </p>
          </div>
          <div className="p-3 border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-950/20">
            <p className="text-sm">
              <strong>Automation:</strong> Systems operate autonomously with real-time monitoring and automated responses.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataFoundationTest;