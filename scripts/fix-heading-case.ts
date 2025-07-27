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
  description: string;
}

interface ScanConfig {
  paths: string[];
  extensions: string[];
  excludePatterns: string[];
}

interface ClassificationConfig {
  module: {
    description: string;
    patterns: RegExp[];
    transformer: (text: string) => string;
  };
  tool: {
    description: string;
    patterns: RegExp[];
    transformer: (text: string) => string;
  };
  subTool: {
    description: string;
    patterns: RegExp[];
    transformer: (text: string) => string;
  };
  submodule: {
    description: string;
    patterns: RegExp[];
    transformer: (text: string) => string;
  };
}

class HeadingCaseFixer {
  private project: Project;
  private changes: Change[] = [];
  private errors: { file: string; error: string }[] = [];
  private skippedFiles: string[] = [];

  // Configuration for scanning
  private scanConfig: ScanConfig = {
    paths: [
      'src/pages/**/*.{tsx,jsx}',
      'src/components/**/*.{tsx,jsx}',
      'src/modules/**/*.{tsx,jsx}',
      'src/features/**/*.{tsx,jsx}',
      'src/layouts/**/*.{tsx,jsx}'
    ],
    extensions: ['tsx', 'jsx'],
    excludePatterns: ['node_modules/**', 'dist/**', 'build/**', '**/*.test.*', '**/*.spec.*']
  };

  // Classification rules configuration
  private classificationConfig: ClassificationConfig = {
    module: {
      description: 'Main system/module names → Title Case',
      patterns: [
        /^(Core HR|Analytics|Government|Payroll|Strategic|Consulting|AI Features|Health Safety|Legal Consultant|Organization|Self Service|Tools|Documents|Employees|Help|About|ISO Management|NRC Management|Welfare Consultancy|Processes And Forms|Executive Intelligence|System Engineer)/i,
        /^(employee data export|payroll system|hr management|analytics dashboard)/i
      ],
      transformer: this.toTitleCase
    },
    tool: {
      description: 'Tools/Engines/Systems → UPPERCASE',
      patterns: [
        /(TOOL|ENGINE|PROCESSOR|ANALYZER|GENERATOR|CALCULATOR|MANAGER|DASHBOARD|SYSTEM|PLATFORM|INTEGRATION)$/i,
        /^(data export tool|ai analyzer|report generator|sync engine)/i
      ],
      transformer: this.toUpperCase
    },
    subTool: {
      description: 'Utility functions/helpers → lowercase',
      patterns: [
        /(parser|validator|formatter|converter|helper|utility|handler|processor)$/i,
        /^(data parser|file converter|validation helper)/i
      ],
      transformer: this.toLowerCase
    },
    submodule: {
      description: 'Features/submodules → Sentence case',
      patterns: [
        /^[a-zA-Z\s_-]+$/
      ],
      transformer: this.toSentenceCase
    }
  };

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

  private classifyAndTransform(text: string): { type: 'module' | 'submodule' | 'tool' | 'sub-tool'; transformed: string } | null {
    const cleanText = text.replace(/[_-]/g, ' ').trim();
    
    // Skip if already properly formatted or too short
    if (cleanText.length < 3) return null;

    // Check each classification type in priority order
    const classifications = [
      { key: 'module', config: this.classificationConfig.module, type: 'module' as const },
      { key: 'tool', config: this.classificationConfig.tool, type: 'tool' as const },
      { key: 'subTool', config: this.classificationConfig.subTool, type: 'sub-tool' as const },
      { key: 'submodule', config: this.classificationConfig.submodule, type: 'submodule' as const }
    ];
    
    for (const { config, type } of classifications) {
      for (const pattern of config.patterns) {
        if (pattern.test(cleanText)) {
          const transformed = config.transformer.call(this, cleanText);
          if (transformed !== text) {
            return { type, transformed };
          }
          return null; // Already properly formatted
        }
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

  private processFile(filePath: string): boolean {
    try {
      console.log(`Processing: ${filePath}`);
      
      const sourceFile = this.project.addSourceFileAtPath(filePath);
      
      sourceFile.forEachDescendant((node) => {
        try {
          // Process JSX text content
          this.processJsxText(node, filePath);
          
          // Process JSX attributes (title, name, etc.)
          this.processJsxAttribute(node, filePath);
          
          // Process string literals in general
          this.processStringLiteral(node, filePath);
        } catch (nodeError) {
          console.warn(`⚠️  Error processing node in ${filePath}: ${nodeError}`);
        }
      });

      sourceFile.saveSync();
      return true;
    } catch (error) {
      this.errors.push({
        file: filePath,
        error: error instanceof Error ? error.message : String(error)
      });
      this.skippedFiles.push(filePath);
      console.warn(`⚠️  Skipping ${filePath}: ${error}`);
      return false;
    }
  }

  public async run(): Promise<void> {
    console.log('🚀 AqlHR Heading Case Fixer');
    console.log('==========================\n');
    console.log('🔍 Scanning for React files...');
    
    // Display scan configuration
    console.log('📂 Scan paths:');
    this.scanConfig.paths.forEach(path => console.log(`  - ${path}`));
    
    // Find all files using the scan configuration
    let allFiles: string[] = [];
    for (const pattern of this.scanConfig.paths) {
      try {
        const files = await glob(pattern, { ignore: this.scanConfig.excludePatterns });
        allFiles = allFiles.concat(files);
      } catch (error) {
        console.warn(`⚠️  Error scanning pattern ${pattern}: ${error}`);
      }
    }

    // Remove duplicates
    allFiles = [...new Set(allFiles)];

    console.log(`📁 Found ${allFiles.length} files to process`);

    if (allFiles.length === 0) {
      console.log('❌ No files found to process. Check your paths and file patterns.');
      return;
    }

    // Display classification rules
    console.log('\n🏷️  Classification Rules:');
    Object.entries(this.classificationConfig).forEach(([key, config]) => {
      console.log(`  ${key}: ${config.description}`);
    });

    console.log('\n🔄 Processing files...');
    
    // Process each file with error handling
    let successCount = 0;
    for (const file of allFiles) {
      if (this.processFile(path.resolve(file))) {
        successCount++;
      }
    }

    console.log(`\n✅ Successfully processed ${successCount}/${allFiles.length} files`);
    
    if (this.skippedFiles.length > 0) {
      console.log(`⚠️  Skipped ${this.skippedFiles.length} files due to errors`);
    }

    // Report results
    this.reportChanges();
  }

  private reportChanges(): void {
    console.log('\n📊 SUMMARY OF CHANGES');
    console.log('='.repeat(80));

    if (this.changes.length === 0) {
      console.log('✅ No changes needed - all headings are already properly formatted!');
      console.log('ℹ️  Note: Running this script again will produce the same result (idempotent)');
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
    
    // Report any errors
    if (this.errors.length > 0) {
      console.log('\n⚠️  ERRORS ENCOUNTERED:');
      this.errors.forEach(({ file, error }) => {
        console.log(`  ❌ ${file}: ${error}`);
      });
    }
    
    console.log('\nℹ️  Note: This script is idempotent - running it again will make no further changes');
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