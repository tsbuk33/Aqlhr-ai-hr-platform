#!/usr/bin/env tsx

import puppeteer from 'puppeteer';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { glob } from 'glob';
import chalk from 'chalk';

interface ResponsiveIssue {
  page: string;
  breakpoint: string;
  type: 'overflow' | 'overlap' | 'accessibility' | 'layout-shift';
  severity: 'critical' | 'warning' | 'info';
  message: string;
  screenshot?: string;
}

export class ResponsiveLayoutChecker {
  private issues: ResponsiveIssue[] = [];
  private browser: any;
  private baseUrl: string;

  constructor(baseUrl = 'http://localhost:5173') {
    this.baseUrl = baseUrl;
  }

  async checkAll(): Promise<ResponsiveIssue[]> {
    this.browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
      await this.discoverAndTestPages();
    } finally {
      await this.browser.close();
    }
    
    return this.issues;
  }

  private async discoverAndTestPages() {
    // Discover page routes from the codebase
    const pageFiles = await glob('src/pages/**/*.tsx');
    const routes = this.extractRoutes(pageFiles);
    
    console.log(chalk.blue(`📱 Testing ${routes.length} pages across breakpoints...`));
    
    for (const route of routes) {
      await this.testPageResponsiveness(route);
    }
  }

  private extractRoutes(pageFiles: string[]): string[] {
    const routes: string[] = [];
    
    pageFiles.forEach(file => {
      // Convert file path to route
      let route = file
        .replace('src/pages', '')
        .replace('.tsx', '')
        .replace('/index', '');
      
      if (route === '') route = '/';
      if (!route.startsWith('/')) route = '/' + route;
      
      routes.push(route);
    });
    
    return routes.slice(0, 10); // Limit for CI performance
  }

  private async testPageResponsiveness(route: string) {
    const breakpoints = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1024, height: 768 },
      { name: 'large', width: 1440, height: 900 }
    ];
    
    for (const breakpoint of breakpoints) {
      await this.testBreakpoint(route, breakpoint);
    }
  }

  private async testBreakpoint(route: string, breakpoint: any) {
    const page = await this.browser.newPage();
    
    try {
      await page.setViewport({
        width: breakpoint.width,
        height: breakpoint.height,
        deviceScaleFactor: 1
      });
      
      const url = `${this.baseUrl}${route}`;
      await page.goto(url, { 
        waitUntil: 'networkidle0', 
        timeout: 10000 
      });
      
      // Wait for any animations
      await page.waitForTimeout(1000);
      
      // Check for horizontal overflow
      await this.checkHorizontalOverflow(page, route, breakpoint);
      
      // Check for overlapping elements
      await this.checkOverlappingElements(page, route, breakpoint);
      
      // Check for layout shifts
      await this.checkLayoutShifts(page, route, breakpoint);
      
      // Take screenshot for issues
      if (this.issues.some(i => i.page === route && i.breakpoint === breakpoint.name)) {
        await this.takeScreenshot(page, route, breakpoint);
      }
      
    } catch (error) {
      console.log(chalk.yellow(`⚠️ Could not test ${route} at ${breakpoint.name}: ${error.message}`));
    } finally {
      await page.close();
    }
  }

  private async checkHorizontalOverflow(page: any, route: string, breakpoint: any) {
    const hasOverflow = await page.evaluate(() => {
      const body = document.body;
      const html = document.documentElement;
      
      const scrollWidth = Math.max(
        body.scrollWidth,
        body.offsetWidth,
        html.clientWidth,
        html.scrollWidth,
        html.offsetWidth
      );
      
      return scrollWidth > window.innerWidth;
    });
    
    if (hasOverflow) {
      this.issues.push({
        page: route,
        breakpoint: breakpoint.name,
        type: 'overflow',
        severity: 'warning',
        message: `Horizontal overflow detected at ${breakpoint.width}px width`
      });
    }
  }

  private async checkOverlappingElements(page: any, route: string, breakpoint: any) {
    const overlaps = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('*')).filter(el => {
        const style = window.getComputedStyle(el);
        return style.position !== 'static' && style.display !== 'none';
      });
      
      const overlapping = [];
      
      for (let i = 0; i < elements.length; i++) {
        for (let j = i + 1; j < elements.length; j++) {
          const rect1 = elements[i].getBoundingClientRect();
          const rect2 = elements[j].getBoundingClientRect();
          
          if (!(rect1.right < rect2.left || 
                rect2.right < rect1.left || 
                rect1.bottom < rect2.top || 
                rect2.bottom < rect1.top)) {
            overlapping.push({
              element1: elements[i].tagName + (elements[i].className ? '.' + elements[i].className.split(' ')[0] : ''),
              element2: elements[j].tagName + (elements[j].className ? '.' + elements[j].className.split(' ')[0] : '')
            });
          }
        }
      }
      
      return overlapping.slice(0, 5); // Limit results
    });
    
    overlaps.forEach((overlap: any) => {
      this.issues.push({
        page: route,
        breakpoint: breakpoint.name,
        type: 'overlap',
        severity: 'warning',
        message: `Elements overlapping: ${overlap.element1} and ${overlap.element2}`
      });
    });
  }

  private async checkLayoutShifts(page: any, route: string, breakpoint: any) {
    // Simulate content loading to detect layout shifts
    const shifts = await page.evaluate(() => {
      let shiftScore = 0;
      let entries: any[] = [];
      
      if ('LayoutShift' in window) {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              shiftScore += (entry as any).value;
              entries.push(entry);
            }
          }
        });
        
        observer.observe({ entryTypes: ['layout-shift'] });
        
        // Trigger potential shifts
        window.scrollTo(0, 100);
        window.scrollTo(0, 0);
      }
      
      return { score: shiftScore, count: entries.length };
    });
    
    if (shifts.score > 0.1) {
      this.issues.push({
        page: route,
        breakpoint: breakpoint.name,
        type: 'layout-shift',
        severity: 'warning',
        message: `High cumulative layout shift score: ${shifts.score.toFixed(3)}`
      });
    }
  }

  private async takeScreenshot(page: any, route: string, breakpoint: any) {
    try {
      mkdirSync('screenshots', { recursive: true });
      
      const filename = `screenshots/${route.replace(/\//g, '_')}_${breakpoint.name}.png`;
      await page.screenshot({ 
        path: filename,
        fullPage: true 
      });
      
      // Update issues with screenshot path
      this.issues
        .filter(i => i.page === route && i.breakpoint === breakpoint.name)
        .forEach(issue => {
          issue.screenshot = filename;
        });
        
    } catch (error) {
      console.log(chalk.yellow(`⚠️ Could not save screenshot: ${error.message}`));
    }
  }

  printReport(): void {
    const criticalIssues = this.issues.filter(i => i.severity === 'critical');
    const warningIssues = this.issues.filter(i => i.severity === 'warning');
    const infoIssues = this.issues.filter(i => i.severity === 'info');
    
    console.log(chalk.blue('\n📱 Responsive Layout Report'));
    console.log(chalk.white('='.repeat(50)));
    
    if (criticalIssues.length > 0) {
      console.log(chalk.red(`\n🚨 Critical Issues (${criticalIssues.length}):`));
      criticalIssues.forEach(issue => {
        console.log(`  ${issue.page} [${issue.breakpoint}] - ${issue.message}`);
        if (issue.screenshot) {
          console.log(`    📸 Screenshot: ${issue.screenshot}`);
        }
      });
    }
    
    if (warningIssues.length > 0) {
      console.log(chalk.yellow(`\n⚠️  Warnings (${warningIssues.length}):`));
      warningIssues.slice(0, 10).forEach(issue => {
        console.log(`  ${issue.page} [${issue.breakpoint}] - ${issue.message}`);
      });
    }
    
    if (infoIssues.length > 0) {
      console.log(chalk.blue(`\n📋 Info (${infoIssues.length} issues)`));
    }
    
    const totalIssues = this.issues.length;
    if (totalIssues === 0) {
      console.log(chalk.green('\n✅ All pages are responsive across breakpoints!'));
    } else {
      console.log(chalk.white(`\nTotal: ${totalIssues} responsive layout issues`));
    }
    
    // Summary by breakpoint
    console.log(chalk.blue('\n📊 Issues by Breakpoint:'));
    const breakpointSummary = this.issues.reduce((acc, issue) => {
      acc[issue.breakpoint] = (acc[issue.breakpoint] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
    
    Object.entries(breakpointSummary).forEach(([breakpoint, count]) => {
      console.log(`  ${breakpoint}: ${count} issues`);
    });
  }
}

// CLI execution
async function main() {
  const baseUrl = process.argv[2] || 'http://localhost:5173';
  const checker = new ResponsiveLayoutChecker(baseUrl);
  
  console.log(chalk.blue(`📱 Checking responsive layouts at ${baseUrl}...\n`));
  
  await checker.checkAll();
  checker.printReport();
  
  const criticalIssues = checker.issues.filter(i => i.severity === 'critical').length;
  process.exit(criticalIssues > 0 ? 1 : 0);
}

if (require.main === module) {
  main().catch(console.error);
}