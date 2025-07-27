#!/usr/bin/env ts-node

import { Project, SyntaxKind, Node } from 'ts-morph';
import { glob } from 'glob';
import path from 'path';

interface Change {
  file: string;
  line: number;
  original: string;
  fixed: string;
  type: 'module' | 'submodule' | 'tool' | 'sub-tool';
}

interface CaseRule {
  pattern: RegExp;
  type: 'module' | 'submodule' | 'tool' | 'sub-tool';
  transformer: (text: string) => string;
}

class HeadingCaseFixer {
  private project: Project;
  private changes: Change[] = [];

  constructor() {
    this.project = new Project({
      tsConfigFilePath: 'tsconfig.json',
    });
  }

  // Case transformation functions
  private toTitleCase(str: string): string {
    return str.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }

  private toSentenceCase(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  private toUpperCase(str: string): string {
    return str.toUpperCase();
  }

  private toLowerCase(str: string): string {
    return str.toLowerCase();
  }

  // Classification rules for different heading types
  private getCaseRules(): CaseRule[] {
    return [
      // Module patterns (Title Case)
      {
        pattern: /^(Core HR|Analytics|Government|Payroll|Strategic|Consulting|AI Features|Health Safety|Legal Consultant|Organization|Self Service|Tools|Documents|Employees|Help|About|ISOManagement|NRCManagement|WelfareConsultancy|ProcessesAndForms|NotFound|Index|TestHarness|SystemEngineer|ExecutiveIntelligenceCenter)/i,
        type: 'module',
        transformer: this.toTitleCase
      },
      // Tool patterns (UPPERCASE) - keywords that indicate tools
      {
        pattern: /(TOOL|ENGINE|PROCESSOR|ANALYZER|GENERATOR|CALCULATOR|MANAGER|DASHBOARD|SYSTEM|PLATFORM|INTEGRATION)/i,
        type: 'tool',
        transformer: this.toUpperCase
      },
      // Sub-tool patterns (lowercase) - utility functions
      {
        pattern: /(parser|validator|formatter|converter|helper|utility|handler|processor)/i,
        type: 'sub-tool',
        transformer: this.toLowerCase
      },
      // Submodule patterns (Sentence case) - everything else that looks like a feature
      {
        pattern: /^[a-zA-Z\s]+$/,
        type: 'submodule',
        transformer: this.toSentenceCase
      }
    ];
  }

  private classifyAndTransform(text: string): { type: 'module' | 'submodule' | 'tool' | 'sub-tool'; transformed: string } | null {
    const cleanText = text.replace(/[_-]/g, ' ').trim();
    
    // Skip if already properly formatted or too short
    if (cleanText.length < 3) return null;

    const rules = this.getCaseRules();
    
    for (const rule of rules) {
      if (rule.pattern.test(cleanText)) {
        const transformed = rule.transformer(cleanText);
        if (transformed !== text) {
          return { type: rule.type, transformed };
        }
        break;
      }
    }
    
    return null;
  }

  private processStringLiteral(node: Node, filePath: string): void {
    if (Node.isStringLiteral(node)) {
      const text = node.getLiteralValue();
      const result = this.classifyAndTransform(text);
      
      if (result) {
        this.changes.push({
          file: filePath,
          line: node.getStartLineNumber(),
          original: text,
          fixed: result.transformed,
          type: result.type
        });
        
        node.replaceWithText(`"${result.transformed}"`);
      }
    }
  }

  private processJsxText(node: Node, filePath: string): void {
    if (Node.isJsxText(node)) {
      const text = node.getText().trim();
      if (text) {
        const result = this.classifyAndTransform(text);
        
        if (result) {
          this.changes.push({
            file: filePath,
            line: node.getStartLineNumber(),
            original: text,
            fixed: result.transformed,
            type: result.type
          });
          
          node.replaceWithText(result.transformed);
        }
      }
    }
  }

  private processJsxAttribute(node: Node, filePath: string): void {
    if (Node.isJsxAttribute(node)) {
      const name = node.getName();
      const titleAttributes = ['title', 'name', 'label', 'header', 'heading'];
      
      if (titleAttributes.includes(name.toLowerCase())) {
        const initializer = node.getInitializer();
        if (Node.isStringLiteral(initializer)) {
          const text = initializer.getLiteralValue();
          const result = this.classifyAndTransform(text);
          
          if (result) {
            this.changes.push({
              file: filePath,
              line: initializer.getStartLineNumber(),
              original: text,
              fixed: result.transformed,
              type: result.type
            });
            
            initializer.replaceWithText(`"${result.transformed}"`);
          }
        }
      }
    }
  }

  private processFile(filePath: string): void {
    console.log(`Processing: ${filePath}`);
    
    const sourceFile = this.project.addSourceFileAtPath(filePath);
    
    sourceFile.forEachDescendant((node) => {
      // Process JSX text content
      this.processJsxText(node, filePath);
      
      // Process JSX attributes (title, name, etc.)
      this.processJsxAttribute(node, filePath);
      
      // Process string literals in general
      this.processStringLiteral(node, filePath);
      
      // Process template literals and other text nodes
      if (Node.isTemplateExpression(node) || Node.isNoSubstitutionTemplateLiteral(node)) {
        // Handle template literals if needed
      }
    });

    sourceFile.saveSync();
  }

  public async run(): Promise<void> {
    console.log('🔍 Scanning for React files...');
    
    // Find all .tsx and .jsx files in src/pages and src/components
    const patterns = [
      'src/pages/**/*.{tsx,jsx}',
      'src/components/**/*.{tsx,jsx}'
    ];

    let allFiles: string[] = [];
    for (const pattern of patterns) {
      const files = await glob(pattern, { ignore: ['node_modules/**', 'dist/**'] });
      allFiles = allFiles.concat(files);
    }

    console.log(`📁 Found ${allFiles.length} files to process`);

    // Process each file
    for (const file of allFiles) {
      this.processFile(path.resolve(file));
    }

    // Report results
    this.reportChanges();
  }

  private reportChanges(): void {
    console.log('\n📊 SUMMARY OF CHANGES');
    console.log('='.repeat(80));

    if (this.changes.length === 0) {
      console.log('✅ No changes needed - all headings are already properly formatted!');
      return;
    }

    // Group changes by type
    const changesByType = this.changes.reduce((acc, change) => {
      if (!acc[change.type]) acc[change.type] = [];
      acc[change.type].push(change);
      return acc;
    }, {} as Record<string, Change[]>);

    Object.entries(changesByType).forEach(([type, changes]) => {
      console.log(`\n🏷️  ${type.toUpperCase()} (${changes.length} changes):`);
      changes.forEach(change => {
        console.log(`  📄 ${change.file}:${change.line}`);
        console.log(`    ❌ "${change.original}"`);
        console.log(`    ✅ "${change.fixed}"`);
        console.log('');
      });
    });

    console.log(`\n🎉 Total changes applied: ${this.changes.length}`);
    console.log('💾 All files have been updated in place');
  }
}

// Run the script
async function main() {
  console.log('🚀 AqlHR Heading Case Fixer');
  console.log('==========================\n');

  const fixer = new HeadingCaseFixer();
  await fixer.run();
}

if (require.main === module) {
  main().catch(console.error);
}