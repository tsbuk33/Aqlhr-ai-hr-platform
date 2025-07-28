#!/usr/bin/env tsx

import fs from 'fs';
import { glob } from 'glob';

interface TestResult {
  file: string;
  moduleKey: string;
  hasAIChat: boolean;
  hasDocumentUploader: boolean;
  hasCorrectModuleKey: boolean;
}

class AIChatPresenceTest {
  private results: TestResult[] = [];

  private generateModuleKey(filePath: string): string {
    const relativePath = filePath.replace(/^src\/pages\//, '').replace(/\.tsx?$/, '');
    const parts = relativePath.split('/');
    
    if (parts.length === 1) {
      return this.camelCase(parts[0]);
    }
    
    const folder = parts.slice(0, -1).join('.');
    const fileName = this.camelCase(parts[parts.length - 1]);
    return `${folder}.${fileName}`;
  }

  private camelCase(str: string): string {
    return str.charAt(0).toLowerCase() + str.slice(1);
  }

  async testFile(filePath: string): Promise<void> {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const moduleKey = this.generateModuleKey(filePath);
      
      // More robust checking with regex patterns
      const aiChatPattern = /(<ModuleAIChat|<EnhancedModuleAIChat)/;
      const docUploaderPattern = /<ModuleDocumentUploader/;
      const moduleKeyPattern = new RegExp(`moduleKey\\s*=\\s*["']${moduleKey}["']`);
      
      const hasAIChat = aiChatPattern.test(content);
      const hasDocumentUploader = docUploaderPattern.test(content);
      const hasCorrectModuleKey = moduleKeyPattern.test(content);

      this.results.push({
        file: filePath,
        moduleKey,
        hasAIChat,
        hasDocumentUploader,
        hasCorrectModuleKey: hasAIChat ? hasCorrectModuleKey : true // Only check module key if AI chat exists
      });
    } catch (error) {
      console.error(`Error testing file ${filePath}:`, error);
    }
  }

  async run(): Promise<void> {
    console.log('🧪 Testing AI Chat Presence...\n');
    console.log('Current working directory:', process.cwd());
    
    try {
      const pageFiles = await glob('src/pages/**/*.{tsx,jsx}', {
        ignore: ['**/*.test.*', '**/*.spec.*', '**/test/**', '**/tests/**']
      });

      console.log(`Found ${pageFiles.length} page files:`);
      pageFiles.forEach(file => console.log(`  - ${file}`));
      console.log('\n');

      if (pageFiles.length === 0) {
        console.log('❌ No page files found! Make sure you are in the correct directory.');
        return;
      }

      for (const filePath of pageFiles) {
        console.log(`Testing file: ${filePath}`);
        await this.testFile(filePath);
      }

      this.printResults();
    } catch (error) {
      console.error('❌ Error during execution:', error);
    }
  }

  private printResults(): void {
    console.log('📊 AI Chat Presence Test Results:\n');

    const withAIChat = this.results.filter(r => r.hasAIChat).length;
    const withUploader = this.results.filter(r => r.hasDocumentUploader).length;
    const withCorrectKeys = this.results.filter(r => r.hasCorrectModuleKey).length;
    const total = this.results.length;

    console.log('Summary:');
    console.log(`✅ Files with AI Chat: ${withAIChat}/${total}`);
    console.log(`📁 Files with Document Uploader: ${withUploader}/${total}`);
    console.log(`🔑 Files with Correct Module Keys: ${withCorrectKeys}/${total}`);

    console.log('\nMissing Components:');
    this.results.forEach(result => {
      const missing = [];
      if (!result.hasAIChat) missing.push('AI Chat');
      if (!result.hasDocumentUploader) missing.push('Document Uploader');
      if (!result.hasCorrectModuleKey && result.hasAIChat) missing.push('Correct Module Key');

      if (missing.length > 0) {
        console.log(`❌ ${result.file}`);
        console.log(`   Module Key: ${result.moduleKey}`);
        console.log(`   Missing: ${missing.join(', ')}`);
      }
    });

    if (withAIChat === total && withUploader === total && withCorrectKeys === total) {
      console.log('\n🎉 All tests passed! Every page has AI chat with correct configuration.');
    } else {
      console.log('\n⚠️  Some pages are missing AI chat components. Run fix:embed-chat to fix them.');
    }
  }
}

// Run the test
const tester = new AIChatPresenceTest();
tester.run().catch(console.error);

export default AIChatPresenceTest;