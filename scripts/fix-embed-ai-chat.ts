#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { Project, SyntaxKind, SourceFile } from 'ts-morph';

interface EmbedResult {
  file: string;
  moduleKey: string;
  status: 'injected' | 'already-exists' | 'skipped' | 'error';
  reason?: string;
}

class AIchatEmbedder {
  private project: Project;
  private results: EmbedResult[] = [];

  constructor() {
    this.project = new Project({
      tsConfigFilePath: 'tsconfig.json',
    });
  }

  private generateModuleKey(filePath: string): string {
    // Convert path like 'src/pages/payroll/ExpenseManagement.tsx' to 'payroll.expenseManagement'
    const relativePath = filePath.replace(/^src\/pages\//, '').replace(/\.tsx?$/, '');
    const parts = relativePath.split('/');
    
    if (parts.length === 1) {
      // Single file in pages root
      return this.camelCase(parts[0]);
    }
    
    // Multi-level path
    const folder = parts.slice(0, -1).join('.');
    const fileName = this.camelCase(parts[parts.length - 1]);
    return `${folder}.${fileName}`;
  }

  private camelCase(str: string): string {
    return str.charAt(0).toLowerCase() + str.slice(1);
  }

  private hasAIChatImport(sourceFile: SourceFile): boolean {
    const imports = sourceFile.getImportDeclarations();
    return imports.some(imp => {
      const moduleSpecifier = imp.getModuleSpecifierValue();
      return moduleSpecifier.includes('ModuleAIChat') || 
             moduleSpecifier.includes('EnhancedModuleAIChat');
    });
  }

  private hasAIChatComponent(sourceFile: SourceFile): boolean {
    const jsxElements = sourceFile.getDescendantsOfKind(SyntaxKind.JsxOpeningElement);
    return jsxElements.some(element => {
      const tagName = element.getTagNameNode().getText();
      return tagName === 'ModuleAIChat' || tagName === 'EnhancedModuleAIChat';
    });
  }

  private addImports(sourceFile: SourceFile): void {
    const existingImports = sourceFile.getImportDeclarations();
    const hasModuleAIChat = existingImports.some(imp => 
      imp.getModuleSpecifierValue().includes('ModuleAIChat')
    );
    const hasDocumentUploader = existingImports.some(imp => 
      imp.getModuleSpecifierValue().includes('ModuleDocumentUploader')
    );

    if (!hasModuleAIChat) {
      sourceFile.addImportDeclaration({
        moduleSpecifier: '@/components/universal/ModuleAIChat',
        defaultImport: 'ModuleAIChat'
      });
    }

    if (!hasDocumentUploader) {
      sourceFile.addImportDeclaration({
        moduleSpecifier: '@/components/universal/ModuleDocumentUploader',
        defaultImport: 'ModuleDocumentUploader'
      });
    }
  }

  private injectAIComponents(sourceFile: SourceFile, moduleKey: string): boolean {
    try {
      // Find the default export function
      const defaultExport = sourceFile.getDefaultExportSymbol();
      if (!defaultExport) return false;

      const exportedDeclarations = defaultExport.getDeclarations();
      if (exportedDeclarations.length === 0) return false;

      // Look for function component
      const functionComponent = exportedDeclarations.find(decl => 
        decl.getKind() === SyntaxKind.FunctionDeclaration ||
        decl.getKind() === SyntaxKind.ArrowFunction ||
        decl.getKind() === SyntaxKind.VariableDeclaration
      );

      if (!functionComponent) return false;

      // Find the return statement with JSX
      const returnStatements = functionComponent.getDescendantsOfKind(SyntaxKind.ReturnStatement);
      const jsxReturn = returnStatements.find(ret => {
        const expression = ret.getExpression();
        return expression && (
          expression.getKind() === SyntaxKind.JsxElement ||
          expression.getKind() === SyntaxKind.JsxFragment ||
          expression.getKind() === SyntaxKind.JsxSelfClosingElement
        );
      });

      if (!jsxReturn) return false;

      const jsxExpression = jsxReturn.getExpression();
      if (!jsxExpression) return false;

      // Check if it's already wrapped with CenteredLayout or has AI chat
      const jsxText = jsxExpression.getText();
      if (jsxText.includes('ModuleAIChat') || jsxText.includes('EnhancedModuleAIChat')) {
        return false; // Already has AI chat
      }

      // Inject the AI components
      const isArabicPattern = /const\s+isArabic\s*=\s*language\s*===\s*['"]ar['"]/.test(sourceFile.getText());
      const languageVar = isArabicPattern ? 'language' : "'en'";

      const aiChatComponent = `
        {/* AI Assistant Panel */}
        <div className="fixed bottom-4 right-4 z-50">
          <ModuleAIChat 
            moduleKey="${moduleKey}"
            context={{
              moduleName: "${moduleKey}",
              currentData: {}
            }}
            className="w-80 h-96 shadow-2xl rounded-lg"
          />
        </div>

        {/* Document Upload Panel */}
        <div className="mb-6">
          <ModuleDocumentUploader 
            moduleKey="${moduleKey}"
            maxFiles={5}
            maxSize={10 * 1024 * 1024}
            acceptedTypes={['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']}
          />
        </div>`;

      // If the JSX is wrapped in parentheses, we need to handle it carefully
      if (jsxText.startsWith('(') && jsxText.endsWith(')')) {
        // Extract the inner JSX
        const innerJsx = jsxText.slice(1, -1).trim();
        
        if (innerJsx.startsWith('<>') && innerJsx.endsWith('</>')) {
          // It's a fragment, add our components inside
          const fragmentContent = innerJsx.slice(2, -3);
          jsxExpression.replaceWithText(`(
            <>
              ${fragmentContent}
              ${aiChatComponent}
            </>
          )`);
        } else {
          // Wrap in fragment with our components
          jsxExpression.replaceWithText(`(
            <>
              ${innerJsx}
              ${aiChatComponent}
            </>
          )`);
        }
      } else {
        // Not wrapped in parentheses
        if (jsxText.startsWith('<>') && jsxText.endsWith('</>')) {
          // It's a fragment
          const fragmentContent = jsxText.slice(2, -3);
          jsxExpression.replaceWithText(`<>
            ${fragmentContent}
            ${aiChatComponent}
          </>`);
        } else {
          // Wrap in fragment
          jsxExpression.replaceWithText(`<>
            ${jsxText}
            ${aiChatComponent}
          </>`);
        }
      }

      return true;
    } catch (error) {
      console.error(`Error injecting AI components: ${error}`);
      return false;
    }
  }

  async processFile(filePath: string): Promise<void> {
    try {
      const sourceFile = this.project.addSourceFileAtPath(filePath);
      const moduleKey = this.generateModuleKey(filePath);

      // Check if already has AI chat
      if (this.hasAIChatImport(sourceFile) && this.hasAIChatComponent(sourceFile)) {
        this.results.push({
          file: filePath,
          moduleKey,
          status: 'already-exists',
          reason: 'AI chat already implemented'
        });
        return;
      }

      // Add imports
      this.addImports(sourceFile);

      // Inject AI components
      const injected = this.injectAIComponents(sourceFile, moduleKey);

      if (injected) {
        await sourceFile.save();
        this.results.push({
          file: filePath,
          moduleKey,
          status: 'injected'
        });
      } else {
        this.results.push({
          file: filePath,
          moduleKey,
          status: 'skipped',
          reason: 'Could not find suitable injection point'
        });
      }
    } catch (error) {
      this.results.push({
        file: filePath,
        moduleKey: this.generateModuleKey(filePath),
        status: 'error',
        reason: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async run(): Promise<void> {
    console.log('🚀 Starting AI Chat Embedder...\n');

    // Find all React page files
    const pageFiles = await glob('src/pages/**/*.{tsx,jsx}', {
      ignore: ['**/*.test.*', '**/*.spec.*', '**/test/**', '**/tests/**']
    });

    console.log(`Found ${pageFiles.length} page files to process...\n`);

    // Process each file
    for (const filePath of pageFiles) {
      await this.processFile(filePath);
    }

    // Print results
    this.printResults();
  }

  private printResults(): void {
    console.log('\n📊 AI Chat Embedding Results:\n');

    const byStatus = this.results.reduce((acc, result) => {
      acc[result.status] = (acc[result.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('Summary:');
    Object.entries(byStatus).forEach(([status, count]) => {
      const emoji = {
        'injected': '✅',
        'already-exists': '📋',
        'skipped': '⚠️',
        'error': '❌'
      }[status] || '❓';
      console.log(`  ${emoji} ${status}: ${count}`);
    });

    console.log('\nDetailed Results:');
    this.results.forEach(result => {
      const emoji = {
        'injected': '✅',
        'already-exists': '📋',
        'skipped': '⚠️',
        'error': '❌'
      }[result.status] || '❓';
      
      console.log(`${emoji} ${result.file}`);
      console.log(`   Module Key: ${result.moduleKey}`);
      if (result.reason) {
        console.log(`   Reason: ${result.reason}`);
      }
      console.log('');
    });

    // Summary message
    const injected = byStatus['injected'] || 0;
    const alreadyExists = byStatus['already-exists'] || 0;
    const total = this.results.length;

    console.log(`\n🎉 Completed! ${injected} files injected, ${alreadyExists} already had AI chat, ${total} total files processed.`);
    
    if (injected > 0) {
      console.log('\n💡 Next steps:');
      console.log('1. Test the AI chat on a few pages to ensure it works');
      console.log('2. Run the migration to create the uploaded_documents table');
      console.log('3. Update any styling if needed');
      console.log('4. Add E2E tests to verify AI chat presence');
    }
  }
}

// Run the embedder
if (require.main === module) {
  const embedder = new AIchatEmbedder();
  embedder.run().catch(console.error);
}

export default AIchatEmbedder;