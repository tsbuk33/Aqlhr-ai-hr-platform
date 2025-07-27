#!/usr/bin/env ts-node

import { Project, Node } from 'ts-morph';

interface Change {
  file: string;
  line: number;
  original: string;
  fixed: string;
  type: 'module' | 'submodule' | 'tool' | 'sub-tool';
}

class HeadingFixerDemo {
  private changes: Change[] = [];

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
    
    if (cleanText.length < 3) return null;

    // Module patterns (Title Case) - main system names
    if (/^(core hr|payroll|employee data|analytics|government|strategic|consulting|health safety|about|tools)/i.test(cleanText)) {
      const transformed = this.toTitleCase(cleanText);
      if (transformed !== text) {
        return { type: 'module', transformed };
      }
    }
    
    // Tool patterns (UPPERCASE) - keywords that indicate tools/engines
    else if (/(tool|engine|processor|analyzer|generator|calculator|manager|dashboard|system|platform|integration|suite)$/i.test(cleanText)) {
      const transformed = this.toUpperCase(cleanText);
      if (transformed !== text) {
        return { type: 'tool', transformed };
      }
    }
    
    // Sub-tool patterns (lowercase) - utility functions
    else if (/(parser|validator|formatter|converter|helper|utility|handler)$/i.test(cleanText)) {
      const transformed = this.toLowerCase(cleanText);
      if (transformed !== text) {
        return { type: 'sub-tool', transformed };
      }
    }
    
    // Document/file patterns and submodules
    else if (/^[a-zA-Z\s_-]+$/i.test(cleanText) && cleanText.includes(' ')) {
      const transformed = this.toSentenceCase(cleanText);
      if (transformed !== text) {
        return { type: 'submodule', transformed };
      }
    }
    
    return null;
  }

  public async run(): Promise<void> {
    console.log('🚀 AqlHR Heading Case Fixer - Demo Run');
    console.log('=====================================\n');

    // Test the EmployeeMasterData file which we know has issues
    console.log('🔍 Testing on EmployeeMasterData.tsx...\n');

    const project = new Project();
    
    try {
      const sourceFile = project.addSourceFileAtPath('src/pages/core-hr/EmployeeMasterData.tsx');
      
      sourceFile.forEachDescendant((node) => {
        if (Node.isStringLiteral(node)) {
          const text = node.getLiteralValue();
          const result = this.classifyAndTransform(text);
          
          if (result) {
            this.changes.push({
              file: 'src/pages/core-hr/EmployeeMasterData.tsx',
              line: node.getStartLineNumber(),
              original: text,
              fixed: result.transformed,
              type: result.type
            });
            
            // Actually apply the change for demo
            node.replaceWithText(`"${result.transformed}"`);
          }
        }
      });

      // Save changes
      sourceFile.saveSync();
      
      this.reportChanges();
      
    } catch (error) {
      console.error('Error processing file:', error);
    }
  }

  private reportChanges(): void {
    console.log('📊 CHANGES FOUND AND APPLIED:');
    console.log('='.repeat(50));

    if (this.changes.length === 0) {
      console.log('✅ No changes needed in this file');
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
        console.log(`  📍 Line ${change.line}:`);
        console.log(`    ❌ "${change.original}"`);
        console.log(`    ✅ "${change.fixed}"`);
        console.log('');
      });
    });

    console.log(`🎉 Total changes applied: ${this.changes.length}`);
    console.log('\n✅ Demo completed! File has been updated.');
  }
}

// Run the demo
new HeadingFixerDemo().run().catch(console.error);