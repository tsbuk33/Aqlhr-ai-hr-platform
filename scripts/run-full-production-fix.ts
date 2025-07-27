#!/usr/bin/env ts-node

import { Project, Node } from 'ts-morph';
import { glob } from 'glob';
import path from 'path';

interface Change {
  file: string;
  line: number;
  original: string;
  fixed: string;
  type: 'module' | 'submodule' | 'tool' | 'sub-tool';
}

class ProductionHeadingFixer {
  private project: Project;
  private changes: Change[] = [];
  private errors: { file: string; error: string }[] = [];
  private processedFiles: number = 0;

  constructor() {
    this.project = new Project();
  }

  // Case transformation functions
  private toTitleCase(str: string): string {
    return str.replace(/[_-]/g, ' ')
              .replace(/\w\S*/g, (txt) => 
                txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
              );
  }

  private toSentenceCase(str: string): string {
    const cleaned = str.replace(/[_-]/g, ' ');
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
  }

  private toUpperCase(str: string): string {
    return str.replace(/[_-]/g, ' ').toUpperCase();
  }

  private toLowerCase(str: string): string {
    return str.replace(/[_-]/g, ' ').toLowerCase();
  }

  private classifyAndTransform(text: string): { type: 'module' | 'submodule' | 'tool' | 'sub-tool'; transformed: string } | null {
    const cleanText = text.replace(/[_-]/g, ' ').trim();
    
    if (cleanText.length < 3 || !/[a-zA-Z]/.test(cleanText)) return null;

    // Module patterns (Title Case) - main system names
    if (/^(core hr|payroll|employee data|analytics|government|strategic|consulting|health safety|about|tools|documents|employees|help|ai features|legal consultant|organization|self service|iso management|nrc management|welfare consultancy|executive intelligence|system engineer)/i.test(cleanText) ||
        /^(master data|time attendance|recruitment|performance|benefits|training|succession|workflow|compliance|reporting)/i.test(cleanText)) {
      const transformed = this.toTitleCase(cleanText);
      if (transformed !== text) {
        return { type: 'module', transformed };
      }
    }
    
    // Tool patterns (UPPERCASE) - keywords that indicate tools/engines
    else if (/(tool|engine|processor|analyzer|generator|calculator|manager|dashboard|system|platform|integration|suite|processor|sync|automation|intelligence)$/i.test(cleanText) ||
             /^(report generator|data export|ai analyzer|sync engine|automation workflow|document intelligence|translation engine|recommendation engine)/i.test(cleanText)) {
      const transformed = this.toUpperCase(cleanText);
      if (transformed !== text) {
        return { type: 'tool', transformed };
      }
    }
    
    // Sub-tool patterns (lowercase) - utility functions
    else if (/(parser|validator|formatter|converter|helper|utility|handler|processor|extractor|builder)$/i.test(cleanText)) {
      const transformed = this.toLowerCase(cleanText);
      if (transformed !== text) {
        return { type: 'sub-tool', transformed };
      }
    }
    
    // Document/file patterns and submodules (sentence case)
    else if (/^[a-zA-Z\s_-]+$/i.test(cleanText) && 
             (cleanText.includes('_') || cleanText.includes('-') || cleanText.split(' ').length > 1)) {
      const transformed = this.toSentenceCase(cleanText);
      if (transformed !== text) {
        return { type: 'submodule', transformed };
      }
    }
    
    return null;
  }

  private processNode(node: Node, filePath: string): void {
    try {
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
    } catch (error) {
      // Skip problematic nodes but continue processing
    }
  }

  private processFile(filePath: string): boolean {
    try {
      const sourceFile = this.project.addSourceFileAtPath(filePath);
      
      sourceFile.forEachDescendant((node) => {
        this.processNode(node, filePath);
      });

      sourceFile.saveSync();
      this.processedFiles++;
      return true;
    } catch (error) {
      this.errors.push({
        file: filePath,
        error: error instanceof Error ? error.message : String(error)
      });
      return false;
    }
  }

  public async run(): Promise<void> {
    console.log('🚀 AqlHR Heading Case Fixer - Full Production Run');
    console.log('='.repeat(60));
    console.log('🔍 Scanning all configured directories...\n');

    // Scan patterns for all relevant directories
    const scanPatterns = [
      'src/pages/**/*.{tsx,jsx}',
      'src/components/**/*.{tsx,jsx}',
      'src/modules/**/*.{tsx,jsx}',
      'src/features/**/*.{tsx,jsx}',
      'src/layouts/**/*.{tsx,jsx}'
    ];

    console.log('📂 Scan paths:');
    scanPatterns.forEach(pattern => console.log(`  - ${pattern}`));

    let allFiles: string[] = [];
    for (const pattern of scanPatterns) {
      try {
        const files = await glob(pattern, { 
          ignore: ['node_modules/**', 'dist/**', 'build/**', '**/*.test.*', '**/*.spec.*'] 
        });
        allFiles = allFiles.concat(files);
      } catch (error) {
        console.warn(`⚠️ Error scanning pattern ${pattern}: ${error}`);
      }
    }

    // Remove duplicates
    allFiles = [...new Set(allFiles)];

    console.log(`\n📁 Found ${allFiles.length} files to process`);
    console.log('🏷️ Classification Rules:');
    console.log('  - Modules → Title Case (Core HR Management)');
    console.log('  - Tools → UPPERCASE (DATA EXPORT TOOL)');
    console.log('  - Sub-tools → lowercase (data parser)');
    console.log('  - Submodules → Sentence case (Employee management)');

    console.log('\n🔄 Processing files...');
    
    const progressInterval = Math.max(1, Math.floor(allFiles.length / 10));
    
    for (let i = 0; i < allFiles.length; i++) {
      const file = allFiles[i];
      this.processFile(path.resolve(file));
      
      if ((i + 1) % progressInterval === 0 || i === allFiles.length - 1) {
        console.log(`  ⏳ Processed ${i + 1}/${allFiles.length} files...`);
      }
    }

    console.log(`\n✅ Successfully processed ${this.processedFiles}/${allFiles.length} files`);
    
    if (this.errors.length > 0) {
      console.log(`⚠️ Skipped ${this.errors.length} files due to errors`);
    }

    this.reportChanges();
  }

  private reportChanges(): void {
    console.log('\n' + '='.repeat(60));
    console.log('📊 FINAL RESULTS - HEADING CASE FIXES');
    console.log('='.repeat(60));

    if (this.changes.length === 0) {
      console.log('✅ No changes needed - all headings already properly formatted!');
      console.log('ℹ️ Note: Running again will produce same result (idempotent)');
      return;
    }

    // Group changes by type
    const changesByType = this.changes.reduce((acc, change) => {
      if (!acc[change.type]) acc[change.type] = [];
      acc[change.type].push(change);
      return acc;
    }, {} as Record<string, Change[]>);

    Object.entries(changesByType).forEach(([type, changes]) => {
      console.log(`\n🏷️ ${type.toUpperCase()} (${changes.length} changes):`);
      
      // Show first 5 examples for each type
      const examples = changes.slice(0, 5);
      examples.forEach(change => {
        const fileName = change.file.split('/').pop();
        console.log(`  📄 ${fileName}:${change.line}`);
        console.log(`    ❌ "${change.original}"`);
        console.log(`    ✅ "${change.fixed}"`);
        console.log('');
      });
      
      if (changes.length > 5) {
        console.log(`    ... and ${changes.length - 5} more changes\n`);
      }
    });

    console.log(`🎉 TOTAL CHANGES APPLIED: ${this.changes.length}`);
    console.log('💾 All files updated in place');
    
    if (this.errors.length > 0) {
      console.log(`\n⚠️ ERRORS (${this.errors.length}):`);
      this.errors.slice(0, 3).forEach(({ file, error }) => {
        console.log(`  ❌ ${file.split('/').pop()}: ${error}`);
      });
      if (this.errors.length > 3) {
        console.log(`  ... and ${this.errors.length - 3} more errors`);
      }
    }
    
    console.log('\n✨ NEXT STEPS:');
    console.log('1. git checkout -b fix/heading-case-consistency');
    console.log('2. git add .');
    console.log('3. git commit -m "feat: standardize heading case across all modules/tools"');
    console.log('4. git push origin fix/heading-case-consistency');
    console.log('5. Open PR for team review');
    
    console.log('\nℹ️ This script is idempotent - safe to run multiple times');
  }
}

// Execute the production run
new ProductionHeadingFixer().run().catch(console.error);