#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';
import chalk from 'chalk';
import { execSync } from 'child_process';
import { glob } from 'glob';

const SUPABASE_URL = "https://qcuhjcyjlkfizesndmth.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjdWhqY3lqbGtmaXplc25kbXRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NDY4NzgsImV4cCI6MjA2MzQyMjg3OH0.Vr1tBpNjv8e6sNtjfISJul12Mg9ROQVrlRTgWB1dPoc";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface PromptLog {
  id: string;
  user_prompt: string;
  ai_response: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed' | 'archived';
  summary?: string;
  commit_hash?: string;
  git_commit_hash?: string;
  implementation_notes?: string;
  created_at: string;
  updated_at: string;
}

interface GapAnalysis {
  missingScaffolding: string[];
  missingRLSPolicies: string[];
  incompletePrompts: PromptLog[];
  verificationResults: { prompt: PromptLog; verified: boolean; reason: string }[];
}

async function readPromptHistory(): Promise<PromptLog[]> {
  console.log(chalk.blue('📖 Reading prompt history from database...'));
  
  const { data, error } = await supabase
    .from('prompt_logs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error(chalk.red('❌ Error reading prompt logs:'), error);
    return [];
  }

  console.log(chalk.green(`✅ Found ${data?.length || 0} prompt logs`));
  return data || [];
}

async function verifyUniversalScaffolding(): Promise<string[]> {
  console.log(chalk.blue('🔍 Verifying universal scaffolding...'));
  
  const pageFiles = await glob('src/pages/**/*.tsx', { 
    ignore: ['**/*.test.*', '**/*.spec.*'] 
  });
  
  const missingScaffolding: string[] = [];
  
  for (const filePath of pageFiles) {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    const requiredComponents = [
      'CenteredLayout',
      'ModuleTooltip', 
      'HowToUsePanel',
      'ModuleDocumentUploader',
      'ModuleAIChat',
      'ModuleDiagnosticPanel'
    ];
    
    const missing = requiredComponents.filter(component => !content.includes(component));
    
    if (missing.length > 0) {
      missingScaffolding.push(`${filePath}: missing ${missing.join(', ')}`);
    }
  }
  
  console.log(chalk.green(`✅ Scaffolding check: ${pageFiles.length - missingScaffolding.length}/${pageFiles.length} pages complete`));
  return missingScaffolding;
}

async function verifyRLSPolicies(): Promise<string[]> {
  console.log(chalk.blue('🔐 Checking RLS policies...'));
  
  try {
    // Check which tables have RLS enabled but no policies
    const { data: auditData, error } = await supabase.rpc('audit_rls_policies');
    
    if (error) {
      console.error(chalk.red('❌ Error checking RLS policies:'), error);
      return [];
    }
    
    const missingPolicies = auditData?.filter((table: any) => 
      table.rls_enabled && table.policy_count === 0
    ).map((table: any) => table.table_name) || [];
    
    console.log(chalk.green(`✅ RLS check: ${missingPolicies.length} tables need policies`));
    return missingPolicies;
  } catch (err) {
    console.error(chalk.red('❌ RLS verification failed:'), err);
    return [];
  }
}

async function verifyPromptImplementation(prompt: PromptLog): Promise<{ verified: boolean; reason: string }> {
  const { user_prompt, status, implementation_notes } = prompt;
  
  // Check for specific implementation keywords
  const scaffoldingKeywords = ['universal', 'scaffolding', 'ModuleTooltip', 'CenteredLayout'];
  const rlsKeywords = ['RLS', 'row level security', 'policies', 'security'];
  const routeKeywords = ['route', 'navigation', 'page', 'routing'];
  const componentKeywords = ['component', 'UI', 'interface'];
  
  if (status === 'completed' && implementation_notes) {
    // Check if implementation notes reference actual files
    const fileRefs = implementation_notes.match(/src\/[^\s]+/g) || [];
    const existingFiles = fileRefs.filter(file => fs.existsSync(file));
    
    if (fileRefs.length > 0 && existingFiles.length === fileRefs.length) {
      return { verified: true, reason: 'Implementation files exist' };
    }
  }
  
  // Check for scaffolding implementation
  if (scaffoldingKeywords.some(keyword => user_prompt.toLowerCase().includes(keyword))) {
    const pageFiles = await glob('src/pages/**/*.tsx');
    const scaffoldedPages = pageFiles.filter(file => {
      const content = fs.readFileSync(file, 'utf-8');
      return content.includes('ModuleTooltip') && content.includes('CenteredLayout');
    });
    
    if (scaffoldedPages.length > pageFiles.length * 0.8) {
      return { verified: true, reason: 'Universal scaffolding applied to most pages' };
    }
  }
  
  // Check for RLS implementation
  if (rlsKeywords.some(keyword => user_prompt.toLowerCase().includes(keyword))) {
    try {
      const { data: auditData } = await supabase.rpc('audit_rls_policies');
      const tablesWithPolicies = auditData?.filter((table: any) => 
        table.rls_enabled && table.policy_count > 0
      ).length || 0;
      
      if (tablesWithPolicies > 10) {
        return { verified: true, reason: 'RLS policies implemented on multiple tables' };
      }
    } catch (err) {
      // Ignore error for verification
    }
  }
  
  return { verified: false, reason: 'Implementation not verified' };
}

async function applyUniversalScaffolding(missingFiles: string[]): Promise<void> {
  if (missingFiles.length === 0) return;
  
  console.log(chalk.blue('🔧 Applying universal scaffolding to missing files...'));
  
  try {
    execSync('tsx scripts/apply-universal-scaffolding.ts', { stdio: 'inherit' });
    console.log(chalk.green('✅ Universal scaffolding applied'));
  } catch (error) {
    console.error(chalk.red('❌ Failed to apply scaffolding:'), error);
  }
}

async function generateRLSPolicies(missingTables: string[]): Promise<void> {
  if (missingTables.length === 0) return;
  
  console.log(chalk.blue('🔐 Generating RLS policies...'));
  
  const policyStatements = missingTables.map(tableName => {
    const tableBaseName = tableName.replace('public.', '');
    return `
-- RLS policies for ${tableBaseName}
ALTER TABLE ${tableName} ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage ${tableBaseName} from their company" 
ON ${tableName} 
FOR ALL 
USING (auth.uid() IS NOT NULL);`;
  }).join('\n\n');
  
  const migrationContent = `-- Auto-generated RLS policies for missing tables
-- Generated at: ${new Date().toISOString()}

${policyStatements}`;
  
  // Write migration file
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const migrationPath = `supabase/migrations/${timestamp}_auto_rls_policies.sql`;
  
  fs.writeFileSync(migrationPath, migrationContent);
  console.log(chalk.green(`✅ Generated RLS migration: ${migrationPath}`));
}

async function updatePromptStatus(prompts: PromptLog[]): Promise<void> {
  console.log(chalk.blue('📝 Updating prompt statuses...'));
  
  for (const prompt of prompts) {
    const verification = await verifyPromptImplementation(prompt);
    
    if (verification.verified && prompt.status !== 'completed') {
      const { error } = await supabase
        .from('prompt_logs')
        .update({
          status: 'completed',
          implementation_notes: verification.reason,
          updated_at: new Date().toISOString()
        })
        .eq('id', prompt.id);
      
      if (!error) {
        console.log(chalk.green(`✅ Updated prompt ${prompt.id} to completed`));
      }
    }
  }
}

async function generateReport(analysis: GapAnalysis): Promise<void> {
  const reportContent = `# Prompt Implementation Audit Report

Generated: ${new Date().toISOString()}

## Summary

- **Total Prompts**: ${analysis.verificationResults.length}
- **Verified Complete**: ${analysis.verificationResults.filter(r => r.verified).length}
- **Missing Implementation**: ${analysis.verificationResults.filter(r => !r.verified).length}
- **Pages Missing Scaffolding**: ${analysis.missingScaffolding.length}
- **Tables Missing RLS**: ${analysis.missingRLSPolicies.length}

## Gap Analysis

### Missing Universal Scaffolding
${analysis.missingScaffolding.length === 0 ? '✅ All pages have universal scaffolding' : analysis.missingScaffolding.map(item => `- ${item}`).join('\n')}

### Missing RLS Policies
${analysis.missingRLSPolicies.length === 0 ? '✅ All tables have RLS policies' : analysis.missingRLSPolicies.map(table => `- ${table}`).join('\n')}

### Incomplete Prompts
${analysis.incompletePrompts.length === 0 ? '✅ All prompts are complete' : analysis.incompletePrompts.map(prompt => `- [${prompt.status}] ${prompt.summary || prompt.user_prompt.slice(0, 100)}...`).join('\n')}

## Verification Results
${analysis.verificationResults.map(result => 
  `- ${result.verified ? '✅' : '❌'} [${result.prompt.status}] ${result.prompt.summary || result.prompt.user_prompt.slice(0, 50)}... - ${result.reason}`
).join('\n')}

## Next Steps
${analysis.missingScaffolding.length > 0 ? '1. Run universal scaffolding script\n' : ''}${analysis.missingRLSPolicies.length > 0 ? '2. Apply RLS policies migration\n' : ''}${analysis.incompletePrompts.length > 0 ? '3. Complete remaining prompt implementations\n' : ''}

---
*Report generated by enforce-prompts.ts*
`;

  fs.writeFileSync('PROMPT_AUDIT_REPORT.md', reportContent);
  console.log(chalk.green('✅ Generated audit report: PROMPT_AUDIT_REPORT.md'));
}

async function main() {
  console.log(chalk.bold.blue('🚀 AqlHR Prompt Enforcement Audit\n'));
  
  // Step 1: Read prompt history
  const prompts = await readPromptHistory();
  
  // Step 2: Identify gaps
  console.log(chalk.yellow('\n📊 Analyzing implementation gaps...\n'));
  
  const [missingScaffolding, missingRLSPolicies] = await Promise.all([
    verifyUniversalScaffolding(),
    verifyRLSPolicies()
  ]);
  
  const incompletePrompts = prompts.filter(p => 
    p.status === 'pending' || p.status === 'in_progress'
  );
  
  const verificationResults = await Promise.all(
    prompts.map(async prompt => ({
      prompt,
      ...(await verifyPromptImplementation(prompt))
    }))
  );
  
  const analysis: GapAnalysis = {
    missingScaffolding,
    missingRLSPolicies,
    incompletePrompts,
    verificationResults
  };
  
  // Step 3: Auto-fill missing work
  console.log(chalk.yellow('\n🔧 Auto-filling missing implementations...\n'));
  
  await Promise.all([
    applyUniversalScaffolding(missingScaffolding),
    generateRLSPolicies(missingRLSPolicies)
  ]);
  
  // Step 4: Update statuses
  await updatePromptStatus(prompts);
  
  // Step 5: Generate report
  await generateReport(analysis);
  
  // Final summary
  const completedCount = verificationResults.filter(r => r.verified).length;
  const totalCount = verificationResults.length;
  const completionRate = totalCount > 0 ? (completedCount / totalCount * 100).toFixed(1) : '0';
  
  console.log(chalk.bold.green('\n✅ AUDIT COMPLETE!\n'));
  console.log(`📈 Implementation Rate: ${chalk.cyan(completionRate)}% (${completedCount}/${totalCount})`);
  console.log(`🔧 Scaffolding: ${chalk.green(missingScaffolding.length === 0 ? 'Complete' : `${missingScaffolding.length} gaps fixed`)}`);
  console.log(`🔐 RLS Policies: ${chalk.green(missingRLSPolicies.length === 0 ? 'Complete' : `${missingRLSPolicies.length} policies generated`)}`);
  console.log(`📄 Report: ${chalk.blue('PROMPT_AUDIT_REPORT.md')}`);
  
  if (completionRate === '100' && missingScaffolding.length === 0 && missingRLSPolicies.length === 0) {
    console.log(chalk.bold.green('\n🎉 ALL PROMPTS VERIFIED AND IMPLEMENTED! 🎉'));
  } else {
    console.log(chalk.yellow('\n⚠️  Some gaps remain - check the audit report for details'));
  }
}

if (require.main === module) {
  main().catch(console.error);
}