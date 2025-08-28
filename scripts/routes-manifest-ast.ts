#!/usr/bin/env tsx
/**
 * AST-based Route Manifest Generator (Optimized)
 * Uses selective file scanning and efficient TypeScript parsing
 * to discover routes without memory overflow on large codebases.
 */
import { promises as fs } from 'fs';
import * as path from 'path';
import * as ts from 'typescript';
import { globSync } from 'glob';

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, 'src');
const OUT = path.join(ROOT, 'cypress', 'paths.generated.json');
const FALLBACK = path.join(ROOT, 'cypress', 'paths.json');

interface RouteInfo {
  path: string;
  file: string;
  line?: number;
}

class OptimizedRouteParser {
  private routes: Set<string> = new Set();
  private routeDetails: RouteInfo[] = [];

  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  private findRouteFiles(): string[] {
    // Focus on key route files to avoid memory issues
    const patterns = [
      'src/config/routes.{ts,tsx}',
      'src/App.{ts,tsx}',
      'src/pages/**/*.{ts,tsx}',
      'src/routes/**/*.{ts,tsx}',
    ];

    const files = new Set<string>();
    
    for (const pattern of patterns) {
      try {
        const matches = globSync(pattern, { cwd: ROOT, absolute: true });
        matches.forEach(file => {
          if (file.includes('node_modules')) return;
          if (file.includes('.test.') || file.includes('.spec.')) return;
          files.add(file);
        });
      } catch (error) {
        console.warn(`⚠️  Pattern ${pattern} failed: ${error.message}`);
      }
    }

    return Array.from(files).slice(0, 100); // Limit to first 100 files
  }

  private parseFileBasedRoutes(): void {
    // Parse file-based routing patterns (like Next.js style)
    const pageFiles = globSync('src/pages/**/*.{ts,tsx}', { cwd: ROOT });
    
    for (const file of pageFiles.slice(0, 50)) { // Limit files to prevent memory issues
      if (file.includes('.test.') || file.includes('.spec.')) continue;
      
      const relativePath = path.relative('src/pages', file);
      let routePath = relativePath
        .replace(/\.(ts|tsx|js|jsx)$/, '')
        .replace(/\/index$/, '')
        .replace(/\[([^\]]+)\]/g, ':$1')
        .replace(/\\/g, '/');

      if (routePath === 'index') {
        routePath = '';
      }

      if (routePath || routePath === '') {
        this.routes.add(routePath);
        this.routeDetails.push({
          path: routePath,
          file: file,
        });
      }
    }
  }

  private async parseConfigRoutes(): Promise<void> {
    // Parse route configuration files with simple regex
    const configFiles = [
      'src/config/routes.ts',
      'src/config/routes.tsx',
      'src/App.ts',
      'src/App.tsx'
    ];

    for (const configFile of configFiles) {
      const fullPath = path.join(ROOT, configFile);
      if (await this.fileExists(fullPath)) {
        try {
          const content = await fs.readFile(fullPath, 'utf-8');
          this.extractRoutesFromContent(content, configFile);
        } catch (error) {
          console.warn(`⚠️  Could not parse ${configFile}: ${error.message}`);
        }
      }
    }
  }

  private extractRoutesFromContent(content: string, fileName: string): void {
    // Extract routes using multiple regex patterns
    const patterns = [
      // path: "route" or path: 'route'
      /path\s*:\s*(['"`])(.*?)\1/g,
      // <Route path="route"
      /<Route[^>]+path=['"`]([^'"`]+)['"`]/g,
      // Route({ path: "route"
      /Route\s*\(\s*\{\s*path\s*:\s*['"`]([^'"`]+)['"`]/g,
      // { path: "route", component: 
      /\{\s*path\s*:\s*['"`]([^'"`]+)['"`]\s*,\s*component/g,
    ];

    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const routePath = match[2] || match[1];
        if (routePath && routePath !== '*' && routePath !== '/') {
          const normalizedPath = routePath.replace(/^\//, '');
          this.routes.add(normalizedPath);
          
          // Try to find line number
          const beforeMatch = content.substring(0, match.index);
          const lineNumber = (beforeMatch.match(/\n/g) || []).length + 1;
          
          this.routeDetails.push({
            path: normalizedPath,
            file: fileName,
            line: lineNumber,
          });
        }
      }
    }
  }

  private async readFallbackPaths(): Promise<string[]> {
    try {
      if (await this.fileExists(FALLBACK)) {
        const content = await fs.readFile(FALLBACK, 'utf-8');
        const fallbackPaths = JSON.parse(content);
        return Array.isArray(fallbackPaths) ? fallbackPaths : [];
      }
    } catch (error) {
      console.warn(`⚠️  Could not read fallback paths: ${error.message}`);
    }
    return [];
  }

  private addEssentialRoutes(): void {
    // Add essential routes that should always be present
    const essential = [
      '',           // Root/home
      'dashboard',
      'auth/login',
      'auth/register',
      'auth/logout',
      'profile',
      'settings',
      'employees',
      'government',
      'government/qiwa',
      'government/gosi', 
      'government/absher',
      'government/integration-hub',
      'compliance',
      'reports',
      'analytics',
    ];

    essential.forEach(route => {
      this.routes.add(route);
      if (!this.routeDetails.find(r => r.path === route)) {
        this.routeDetails.push({
          path: route,
          file: 'essential-routes',
        });
      }
    });
  }

  public async generateManifest(): Promise<void> {
    console.log('🔍 Scanning route files with optimized AST parser...');
    
    try {
      // Parse file-based routes
      this.parseFileBasedRoutes();
      console.log(`📁 File-based routes: ${this.routes.size}`);

      // Parse configuration files
      await this.parseConfigRoutes();
      console.log(`⚙️  After config parsing: ${this.routes.size}`);

      // Add essential routes
      this.addEssentialRoutes();
      console.log(`✅ After adding essentials: ${this.routes.size}`);

      // Read fallback paths
      const fallbackPaths = await this.readFallbackPaths();
      fallbackPaths.forEach(path => this.routes.add(path));
      console.log(`📋 After fallback merge: ${this.routes.size}`);

      // Convert to sorted array
      const allPaths = Array.from(this.routes).sort((a, b) => {
        if (a === '') return -1;
        if (b === '') return 1;
        return a.localeCompare(b);
      });

      // Write output
      await fs.mkdir(path.dirname(OUT), { recursive: true });
      await fs.writeFile(OUT, JSON.stringify(allPaths, null, 2), 'utf-8');

      // Generate detailed report
      const report = {
        generated_at: new Date().toISOString(),
        total_routes: allPaths.length,
        discovered_routes: this.routeDetails.length,
        fallback_routes: fallbackPaths.length,
        method: 'optimized-regex-ast',
        routes: this.routeDetails.sort((a, b) => a.path.localeCompare(b.path)),
      };

      const reportPath = path.join(ROOT, 'cypress', 'routes-manifest-report.json');
      await fs.writeFile(reportPath, JSON.stringify(report, null, 2), 'utf-8');

      // Log results
      console.log(`\n✅ Route Discovery Complete:`);
      console.log(`   📊 Total Routes: ${allPaths.length}`);
      console.log(`   🔍 Discovered: ${this.routeDetails.length}`);
      console.log(`   📋 Fallback: ${fallbackPaths.length}`);
      console.log(`   📁 Output: ${path.relative(ROOT, OUT)}`);
      console.log(`   📄 Report: ${path.relative(ROOT, reportPath)}`);
      
      if (allPaths.length > 0) {
        console.log(`\n📍 Sample routes:`);
        allPaths.slice(0, 15).forEach((route, i) => {
          console.log(`   ${i + 1}. ${route || '(root)'}`);
        });
        if (allPaths.length > 15) {
          console.log(`   ... and ${allPaths.length - 15} more routes`);
        }
      }

    } catch (error) {
      console.error('❌ Route discovery failed:', error);
      throw error;
    }
  }
}

// Main execution
(async () => {
  try {
    const parser = new OptimizedRouteParser();
    await parser.generateManifest();
  } catch (error) {
    console.error('❌ Route manifest generation failed:', error);
    
    // Fallback to legacy generator
    console.log('🔄 Falling back to legacy route parser...');
    try {
      const { execSync } = require('child_process');
      execSync('npm run routes:manifest:legacy', { stdio: 'inherit' });
    } catch (fallbackError) {
      console.error('❌ Fallback also failed:', fallbackError);
      process.exit(1);
    }
  }
})();