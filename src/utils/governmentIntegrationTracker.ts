// Government Integration Progress Tracker
// Maintains sequential development and complete documentation

export interface PortalStatus {
  portalCode: string;
  portalName: string;
  sequence: number;
  status: 'not-started' | 'in-progress' | 'testing' | 'completed' | 'failed';
  testsStatus: {
    total: number;
    passed: number;
    failed: number;
    lastRun?: Date;
  };
  deploymentStatus: {
    github: boolean;
    vercel: boolean;
    performance: boolean;
    compliance: boolean;
  };
  documentation: {
    apiDocs: boolean;
    integrationGuide: boolean;
    complianceChecklist: boolean;
    lastUpdated?: Date;
  };
  completedAt?: Date;
}

export interface IntegrationProgress {
  totalPortals: number;
  completedPortals: number;
  currentPortal?: string;
  nextPortal?: string;
  overallProgress: number;
  portals: PortalStatus[];
}

export class GovernmentIntegrationTracker {
  private static instance: GovernmentIntegrationTracker;
  private progress: IntegrationProgress;

  private constructor() {
    this.progress = {
      totalPortals: 14,
      completedPortals: 0,
      overallProgress: 0,
      portals: this.initializePortals()
    };
  }

  public static getInstance(): GovernmentIntegrationTracker {
    if (!GovernmentIntegrationTracker.instance) {
      GovernmentIntegrationTracker.instance = new GovernmentIntegrationTracker();
    }
    return GovernmentIntegrationTracker.instance;
  }

  private initializePortals(): PortalStatus[] {
    const portals = [
      { code: 'MUDAD', name: 'Ministry of Labor Services', sequence: 1 },
      { code: 'ETIMAD', name: 'Contractor Verification System', sequence: 2 },
      { code: 'TAWAKKALNA', name: 'Health Compliance Platform', sequence: 3 },
      { code: 'ESNAD', name: 'Digital Notarization Platform', sequence: 4 },
      { code: 'QIWA', name: 'Labor Market Platform', sequence: 5 },
      { code: 'ABSHER', name: 'Government Services Platform', sequence: 6 },
      { code: 'MUQEEM', name: 'Resident Services Platform', sequence: 7 },
      { code: 'NAJIZ', name: 'Business Gateway Platform', sequence: 8 },
      { code: 'SADAD', name: 'Payment Platform', sequence: 9 },
      { code: 'GOSI', name: 'Social Insurance Platform', sequence: 10 },
      { code: 'NITAQAT', name: 'Saudization Compliance Platform', sequence: 11 },
      { code: 'TVTC', name: 'Technical and Vocational Training Corporation', sequence: 12 },
      { code: 'MOL', name: 'Ministry of Labor Platform', sequence: 13 },
      { code: 'ELM', name: 'Education & Learning Management', sequence: 14 }
    ];

    return portals.map(portal => ({
      portalCode: portal.code,
      portalName: portal.name,
      sequence: portal.sequence,
      status: 'not-started' as const,
      testsStatus: {
        total: 38,
        passed: 0,
        failed: 0
      },
      deploymentStatus: {
        github: false,
        vercel: false,
        performance: false,
        compliance: false
      },
      documentation: {
        apiDocs: false,
        integrationGuide: false,
        complianceChecklist: false
      }
    }));
  }

  public updatePortalStatus(portalCode: string, updates: Partial<PortalStatus>): void {
    const portalIndex = this.progress.portals.findIndex(p => p.portalCode === portalCode);
    if (portalIndex !== -1) {
      this.progress.portals[portalIndex] = {
        ...this.progress.portals[portalIndex],
        ...updates
      };
      
      if (updates.status === 'completed') {
        this.progress.portals[portalIndex].completedAt = new Date();
        this.updateOverallProgress();
      }
    }
  }

  public completePortalTesting(portalCode: string, testResults: { passed: number; failed: number }): void {
    this.updatePortalStatus(portalCode, {
      testsStatus: {
        total: 38,
        passed: testResults.passed,
        failed: testResults.failed,
        lastRun: new Date()
      },
      status: testResults.failed === 0 ? 'completed' : 'failed'
    });
  }

  public completePortalDeployment(portalCode: string): void {
    this.updatePortalStatus(portalCode, {
      deploymentStatus: {
        github: true,
        vercel: true,
        performance: true,
        compliance: true
      },
      status: 'completed'
    });
  }

  public updateDocumentation(portalCode: string, docs: Partial<PortalStatus['documentation']>): void {
    const portal = this.progress.portals.find(p => p.portalCode === portalCode);
    if (portal) {
      portal.documentation = {
        ...portal.documentation,
        ...docs,
        lastUpdated: new Date()
      };
    }
  }

  private updateOverallProgress(): void {
    this.progress.completedPortals = this.progress.portals.filter(p => p.status === 'completed').length;
    this.progress.overallProgress = (this.progress.completedPortals / this.progress.totalPortals) * 100;
    
    const currentPortal = this.progress.portals.find(p => 
      p.status === 'in-progress' || p.status === 'testing'
    );
    this.progress.currentPortal = currentPortal?.portalCode;
    
    const nextPortal = this.progress.portals.find(p => 
      p.status === 'not-started' && p.sequence === (currentPortal?.sequence || 0) + 1
    );
    this.progress.nextPortal = nextPortal?.portalCode;
  }

  public getProgress(): IntegrationProgress {
    return { ...this.progress };
  }

  public getPortalStatus(portalCode: string): PortalStatus | undefined {
    return this.progress.portals.find(p => p.portalCode === portalCode);
  }

  public canStartPortal(portalCode: string): boolean {
    const portal = this.getPortalStatus(portalCode);
    if (!portal) return false;
    
    // Check if previous portal is completed
    if (portal.sequence === 1) return true;
    
    const previousPortal = this.progress.portals.find(p => p.sequence === portal.sequence - 1);
    return previousPortal?.status === 'completed';
  }

  public generateProgressReport(): string {
    const report = [
      '📊 GOVERNMENT INTEGRATION PROGRESS REPORT',
      '=' .repeat(60),
      `Overall Progress: ${this.progress.completedPortals}/${this.progress.totalPortals} (${this.progress.overallProgress.toFixed(1)}%)`,
      `Current Portal: ${this.progress.currentPortal || 'None'}`,
      `Next Portal: ${this.progress.nextPortal || 'None'}`,
      '',
      'Portal Status Summary:',
      '-'.repeat(40)
    ];

    this.progress.portals.forEach(portal => {
      const statusIcon = portal.status === 'completed' ? '✅' : 
                        portal.status === 'testing' ? '🧪' :
                        portal.status === 'in-progress' ? '🔄' :
                        portal.status === 'failed' ? '❌' : '⏳';
      
      report.push(`${statusIcon} ${portal.sequence}. ${portal.portalName} (${portal.status.toUpperCase()})`);
      
      if (portal.status !== 'not-started') {
        report.push(`   Tests: ${portal.testsStatus.passed}/${portal.testsStatus.total} passed`);
        if (portal.completedAt) {
          report.push(`   Completed: ${portal.completedAt.toLocaleDateString()}`);
        }
      }
    });

    return report.join('\n');
  }
}

// Export singleton instance
export const integrationTracker = GovernmentIntegrationTracker.getInstance();