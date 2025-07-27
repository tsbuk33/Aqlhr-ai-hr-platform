#!/usr/bin/env ts-node

import { Project, SyntaxKind, Node } from 'ts-morph';

interface Change {
  line: number;
  original: string;
  fixed: string;
  type: 'module' | 'submodule' | 'tool' | 'sub-tool';
}

class TestHeadingFixer {
  private project: Project;
  private changes: Change[] = [];

  constructor() {
    this.project = new Project({
      useInMemoryFileSystem: true,
    });
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
    
    // Skip if too short
    if (cleanText.length < 3) return null;

    // Module patterns (Title Case) - main system names
    if (/^(core hr|payroll|employee data|analytics|government|strategic|consulting|health safety)/i.test(cleanText)) {
      const transformed = this.toTitleCase(cleanText);
      if (transformed !== text) {
        return { type: 'module', transformed };
      }
    }
    
    // Tool patterns (UPPERCASE) - keywords that indicate tools/engines
    else if (/(tool|engine|processor|analyzer|generator|calculator|manager|dashboard|system|platform)/i.test(cleanText)) {
      const transformed = this.toUpperCase(cleanText);
      if (transformed !== text) {
        return { type: 'tool', transformed };
      }
    }
    
    // Sub-tool patterns (lowercase) - utility functions
    else if (/(parser|validator|formatter|converter|helper|utility|handler)/i.test(cleanText)) {
      const transformed = this.toLowerCase(cleanText);
      if (transformed !== text) {
        return { type: 'sub-tool', transformed };
      }
    }
    
    // Submodule patterns (Sentence case) - features and modules
    else if (/^[a-zA-Z\s_-]+$/i.test(cleanText)) {
      const transformed = this.toSentenceCase(cleanText);
      if (transformed !== text) {
        return { type: 'submodule', transformed };
      }
    }
    
    return null;
  }

  private processNode(node: Node): void {
    if (Node.isStringLiteral(node)) {
      const text = node.getLiteralValue();
      const result = this.classifyAndTransform(text);
      
      if (result) {
        this.changes.push({
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

  public processTestFile(): void {
    const testContent = `// Test sample with various heading formats that need fixing
import React from 'react';

const TestComponent = () => {
  return (
    <div>
      {/* Module headings - should be Title Case */}
      <h1>core hr management</h1>
      <h1>payroll system</h1>
      <h1>employee data export</h1>
      
      {/* Tool headings - should be UPPERCASE */}
      <h2>data export tool</h2>
      <h2>ai analyzer engine</h2>
      <h2>report generator</h2>
      
      {/* Sub-tool headings - should be lowercase */}
      <span>Data Parser</span>
      <span>File Converter</span>
      <span>Validation Helper</span>
      
      {/* Submodule headings - should be Sentence case */}
      <div title="employee management system">Content</div>
      <Card title="performance tracking module">Content</Card>
      <Button name="attendance calculator">Calculate</Button>
      
      {/* Document names */}
      <p>employee_data_export_december_2024.xlsx</p>
      <p>PAYROLL_REPORT_Q4.pdf</p>
      <p>hr_analytics_dashboard</p>
    </div>
  );
};

export default TestComponent;`;

    const sourceFile = this.project.createSourceFile('test.tsx', testContent);
    
    sourceFile.forEachDescendant((node) => {
      this.processNode(node);
    });

    console.log('🔍 ORIGINAL CODE:');
    console.log('='.repeat(80));
    console.log(testContent);
    
    console.log('\n✅ FIXED CODE:');
    console.log('='.repeat(80));
    console.log(sourceFile.getFullText());
    
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
        console.log(`  📍 Line ${change.line}:`);
        console.log(`    ❌ "${change.original}"`);
        console.log(`    ✅ "${change.fixed}"`);
        console.log('');
      });
    });

    console.log(`\n🎉 Total changes applied: ${this.changes.length}`);
  }
}

// Run the test
console.log('🚀 AqlHR Heading Case Fixer - TEST RUN');
console.log('======================================\n');

const fixer = new TestHeadingFixer();
fixer.processTestFile();