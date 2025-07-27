#!/usr/bin/env tsx

/**
 * AqlHR Edge Function Locale Audit
 * Ensures all Supabase Edge Functions properly handle locale parameters
 */

import { promises as fs } from 'fs';
import { glob } from 'glob';
import * as path from 'path';
import chalk from 'chalk';

interface LocaleAuditResult {
  functionName: string;
  filePath: string;
  hasLocaleHandling: boolean;
  localeParameters: string[];
  issues: string[];
  recommendations: string[];
}

interface LocaleAuditSummary {
  totalFunctions: number;
  compliantFunctions: number;
  nonCompliantFunctions: number;
  auditResults: LocaleAuditResult[];
  overallScore: number;
}

class EdgeFunctionLocaleAuditor {
  private requiredLocalePatterns = [
    /language\s*[=:]\s*['"`]?(en|ar|arabic|english)['"`]?/i,
    /locale\s*[=:]\s*['"`]?(en|ar|arabic|english)['"`]?/i,
    /lang\s*[=:]\s*['"`]?(en|ar|arabic|english)['"`]?/i,
    /req\.json\(\).*language/i,
    /headers\['accept-language'\]/i,
    /headers\.get\(['"`]accept-language['"`]\)/i,
    /getLocale|determineLanguage|getLanguage/i,
    /systemPrompt.*language.*\$\{.*\}/i
  ];

  async scanEdgeFunction(filePath: string): Promise<LocaleAuditResult> {
    const functionName = path.basename(path.dirname(filePath));
    const content = await fs.readFile(filePath, 'utf-8');
    
    const result: LocaleAuditResult = {
      functionName,
      filePath,
      hasLocaleHandling: false,
      localeParameters: [],
      issues: [],
      recommendations: []
    };

    // Check for locale handling patterns
    const foundPatterns: string[] = [];
    for (const pattern of this.requiredLocalePatterns) {
      const matches = content.match(pattern);
      if (matches) {
        foundPatterns.push(matches[0]);
        result.hasLocaleHandling = true;
      }
    }

    result.localeParameters = foundPatterns;

    // Analyze specific issues
    await this.analyzeLocaleIssues(content, result);
    
    return result;
  }

  private async analyzeLocaleIssues(content: string, result: LocaleAuditResult): Promise<void> {
    // Check for OpenAI API calls without locale context
    if (content.includes('openai') || content.includes('gpt-') || content.includes('chat/completions')) {
      if (!content.includes('language') && !content.includes('locale')) {
        result.issues.push('OpenAI API calls detected without locale context');
        result.recommendations.push('Add language parameter to AI prompts');
      }
    }

    // Check for database operations without locale awareness
    if (content.includes('supabase.from') || content.includes('.insert') || content.includes('.select')) {
      if (!result.hasLocaleHandling) {
        result.issues.push('Database operations without locale consideration');
        result.recommendations.push('Consider locale-specific data filtering');
      }
    }

    // Check for response formatting without locale
    if (content.includes('Response') || content.includes('return')) {
      if (!result.hasLocaleHandling && result.functionName.includes('ai')) {
        result.issues.push('AI responses may not be locale-aware');
        result.recommendations.push('Ensure responses match user language preference');
      }
    }

    // Check for hardcoded strings
    const hardcodedEnglish = content.match(/["'`][A-Z][a-z\s]{10,}["'`]/g);
    if (hardcodedEnglish && hardcodedEnglish.length > 2) {
      result.issues.push(`${hardcodedEnglish.length} potential hardcoded English strings`);
      result.recommendations.push('Use locale-based string templates');
    }

    // Check for proper header extraction
    if (!content.includes('accept-language') && !content.includes('x-locale') && result.functionName.includes('ai')) {
      result.issues.push('Missing locale header extraction');
      result.recommendations.push('Extract locale from request headers (Accept-Language)');
    }

    // Check for system prompt localization
    if (content.includes('systemPrompt') && !content.includes('language')) {
      result.issues.push('System prompt appears to be language-agnostic');
      result.recommendations.push('Localize system prompts based on user language');
    }
  }

  async generateFixSuggestions(result: LocaleAuditResult): Promise<string[]> {
    const suggestions: string[] = [];

    if (!result.hasLocaleHandling) {
      suggestions.push(`
// Add locale extraction at the beginning of ${result.functionName}
const locale = req.headers.get('accept-language')?.split(',')[0] || 'en';
const { language = locale } = await req.json();
`);
    }

    if (result.issues.some(issue => issue.includes('OpenAI'))) {
      suggestions.push(`
// Update system prompt to be locale-aware
const systemPrompt = \`You are AqlHR AI assistant. Respond in \${language === 'ar' ? 'Arabic' : 'English'}.\`;
`);
    }

    if (result.issues.some(issue => issue.includes('Database'))) {
      suggestions.push(`
// Add locale filtering to database queries
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('language', language);
`);
    }

    return suggestions;
  }

  async auditAllEdgeFunctions(): Promise<LocaleAuditSummary> {
    console.log(chalk.blue.bold('🌍 Starting Edge Function Locale Audit...\n'));

    const functionFiles = await glob('supabase/functions/*/index.ts');
    console.log(chalk.blue(`Found ${functionFiles.length} Edge Functions to audit`));

    const auditResults: LocaleAuditResult[] = [];

    for (const filePath of functionFiles) {
      const result = await this.scanEdgeFunction(filePath);
      auditResults.push(result);
      
      const status = result.hasLocaleHandling ? 
        chalk.green('✓') : 
        (result.issues.length > 0 ? chalk.red('✗') : chalk.yellow('?'));
      
      console.log(`${status} ${result.functionName} ${chalk.gray(`(${result.issues.length} issues)`)}`);
    }

    const compliantFunctions = auditResults.filter(r => r.hasLocaleHandling && r.issues.length === 0).length;
    const nonCompliantFunctions = auditResults.length - compliantFunctions;
    const overallScore = (compliantFunctions / auditResults.length) * 100;

    return {
      totalFunctions: auditResults.length,
      compliantFunctions,
      nonCompliantFunctions,
      auditResults,
      overallScore
    };
  }

  async generateAuditReport(summary: LocaleAuditSummary): Promise<void> {
    const report = `# AqlHR Edge Function Locale Audit Report
Generated: ${new Date().toISOString()}

## Audit Summary
- **Total Functions**: ${summary.totalFunctions}
- **Compliant Functions**: ${summary.compliantFunctions} ✅
- **Non-Compliant Functions**: ${summary.nonCompliantFunctions} ❌
- **Overall Compliance Score**: ${summary.overallScore.toFixed(1)}%

## Status: ${summary.overallScore >= 80 ? '✅ GOOD' : summary.overallScore >= 60 ? '⚠️ NEEDS IMPROVEMENT' : '❌ CRITICAL'}

## Detailed Results

${summary.auditResults.map(result => `
### ${result.functionName}
- **Status**: ${result.hasLocaleHandling ? '✅ Locale-Aware' : '❌ Not Locale-Aware'}
- **Issues**: ${result.issues.length}
- **Locale Parameters Found**: ${result.localeParameters.length}

${result.issues.length > 0 ? `
**Issues Detected:**
${result.issues.map(issue => `- ${issue}`).join('\n')}

**Recommendations:**
${result.recommendations.map(rec => `- ${rec}`).join('\n')}
` : ''}
`).join('\n')}

## Critical Functions Requiring Immediate Attention

${summary.auditResults
  .filter(r => r.functionName.includes('ai') && !r.hasLocaleHandling)
  .map(r => `- **${r.functionName}**: ${r.issues.length} issues`)
  .join('\n')}

## Best Practices for Locale Handling

1. **Extract Language from Headers**
   \`\`\`typescript
   const locale = req.headers.get('accept-language')?.split(',')[0] || 'en';
   \`\`\`

2. **Localize AI System Prompts**
   \`\`\`typescript
   const systemPrompt = \`Respond in \${language === 'ar' ? 'Arabic' : 'English'}\`;
   \`\`\`

3. **Filter Database Queries by Locale**
   \`\`\`typescript
   .eq('language', language)
   \`\`\`

4. **Return Locale-Appropriate Responses**
   \`\`\`typescript
   return new Response(JSON.stringify({ 
     message: language === 'ar' ? 'نجحت العملية' : 'Operation successful'
   }));
   \`\`\`

## Action Items

${summary.nonCompliantFunctions > 0 ? `
1. **High Priority**: Fix ${summary.auditResults.filter(r => r.functionName.includes('ai') && !r.hasLocaleHandling).length} AI functions without locale support
2. **Medium Priority**: Add locale handling to remaining ${summary.nonCompliantFunctions} functions
3. **Documentation**: Update function documentation with locale parameter requirements
4. **Testing**: Add locale-specific test cases for all functions
` : '✅ All functions are locale-compliant!'}

---
*Generated by AqlHR Edge Function Locale Auditor*
`;

    await fs.writeFile('docs/EDGE_FUNCTION_LOCALE_AUDIT.md', report);
    console.log(chalk.blue('📄 Generated locale audit report: docs/EDGE_FUNCTION_LOCALE_AUDIT.md'));
  }

  async runAudit(): Promise<boolean> {
    const summary = await this.auditAllEdgeFunctions();
    await this.generateAuditReport(summary);

    console.log(chalk.blue.bold('\n📊 Locale Audit Summary:'));
    console.log(`Total Functions: ${summary.totalFunctions}`);
    console.log(`Compliant: ${chalk.green(summary.compliantFunctions)}`);
    console.log(`Non-Compliant: ${chalk.red(summary.nonCompliantFunctions)}`);
    console.log(`Compliance Score: ${summary.overallScore.toFixed(1)}%`);

    const passed = summary.overallScore >= 80; // 80% threshold
    console.log(`\nOverall Status: ${passed ? chalk.green('PASSED') : chalk.red('FAILED')}`);

    if (!passed) {
      console.log(chalk.red('\n❌ Locale Audit Failed:'));
      console.log(chalk.red(`  ${summary.nonCompliantFunctions} functions need locale handling`));
      
      const criticalFunctions = summary.auditResults.filter(
        r => r.functionName.includes('ai') && !r.hasLocaleHandling
      );
      if (criticalFunctions.length > 0) {
        console.log(chalk.red(`  ${criticalFunctions.length} critical AI functions are not locale-aware`));
      }
    } else {
      console.log(chalk.green('\n✅ Locale audit passed! Functions are properly internationalized.'));
    }

    return passed;
  }
}

// CLI execution
if (require.main === module) {
  const auditor = new EdgeFunctionLocaleAuditor();
  
  auditor.runAudit()
    .then(passed => {
      process.exit(passed ? 0 : 1);
    })
    .catch(error => {
      console.error(chalk.red('Locale audit failed:'), error);
      process.exit(1);
    });
}

export { EdgeFunctionLocaleAuditor };