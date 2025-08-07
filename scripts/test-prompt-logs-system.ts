#!/usr/bin/env tsx

/**
 * Comprehensive smoke test for the prompt logs system
 * Tests all CRUD operations and verifies data integrity
 */

import { supabase } from '../src/integrations/supabase/client';
import chalk from 'chalk';

interface TestLog {
  user_prompt: string;
  ai_response: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed' | 'archived';
  implementation_notes?: string;
}

class PromptLogsSystemTester {
  private testLogIds: string[] = [];

  async runAllTests() {
    console.log(chalk.blue('🚀 Starting Prompt Logs System Tests\n'));

    try {
      await this.testAuthentication();
      await this.testCreateLog();
      await this.testReadLogs();
      await this.testUpdateLog();
      await this.testFiltering();
      await this.testRLSPolicies();
      await this.testDeleteLog();
      
      console.log(chalk.green('✅ All tests passed! Prompt logs system is working correctly.\n'));
    } catch (error) {
      console.error(chalk.red('❌ Test failed:'), error);
      process.exit(1);
    } finally {
      await this.cleanup();
    }
  }

  private async testAuthentication() {
    console.log(chalk.yellow('Testing authentication...'));
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('No authenticated user found. Please ensure authentication is working.');
    }
    
    console.log(chalk.green('✓ Authentication working'));
  }

  private async testCreateLog() {
    console.log(chalk.yellow('Testing log creation...'));
    
    const testLog: TestLog = {
      user_prompt: 'Test prompt for system verification',
      ai_response: 'Test AI response for system verification',
      category: 'testing',
      priority: 'medium',
      status: 'pending',
      implementation_notes: 'Created during system test'
    };

    const { data, error } = await supabase
      .from('prompt_logs')
      .insert(testLog)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create log: ${error.message}`);
    }

    if (!data) {
      throw new Error('No data returned from log creation');
    }

    this.testLogIds.push(data.id);
    
    // Verify auto-populated fields
    if (!data.user_id) {
      throw new Error('user_id was not auto-populated');
    }
    
    if (!data.company_id) {
      throw new Error('company_id was not auto-populated');
    }
    
    if (!data.summary) {
      throw new Error('summary was not auto-generated');
    }

    console.log(chalk.green('✓ Log creation working'));
    console.log(chalk.gray(`  Created log with ID: ${data.id}`));
  }

  private async testReadLogs() {
    console.log(chalk.yellow('Testing log reading...'));
    
    const { data, error } = await supabase
      .from('prompt_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      throw new Error(`Failed to read logs: ${error.message}`);
    }

    if (!data || data.length === 0) {
      throw new Error('No logs returned (should have at least the test log)');
    }

    console.log(chalk.green('✓ Log reading working'));
    console.log(chalk.gray(`  Found ${data.length} logs`));
  }

  private async testUpdateLog() {
    console.log(chalk.yellow('Testing log updates...'));
    
    if (this.testLogIds.length === 0) {
      throw new Error('No test log available for update test');
    }

    const logId = this.testLogIds[0];
    const updates = {
      status: 'completed' as const,
      implementation_notes: 'Updated during system test',
      priority: 'high' as const
    };

    const { data, error } = await supabase
      .from('prompt_logs')
      .update(updates)
      .eq('id', logId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update log: ${error.message}`);
    }

    if (!data) {
      throw new Error('No data returned from update');
    }

    // Verify updates applied
    if (data.status !== 'completed') {
      throw new Error('Status update failed');
    }

    if (data.priority !== 'high') {
      throw new Error('Priority update failed');
    }

    console.log(chalk.green('✓ Log updates working'));
  }

  private async testFiltering() {
    console.log(chalk.yellow('Testing log filtering...'));
    
    // Test status filtering
    const { data: completedLogs, error: statusError } = await supabase
      .from('prompt_logs')
      .select('*')
      .eq('status', 'completed');

    if (statusError) {
      throw new Error(`Failed to filter by status: ${statusError.message}`);
    }

    // Test priority filtering
    const { data: highPriorityLogs, error: priorityError } = await supabase
      .from('prompt_logs')
      .select('*')
      .eq('priority', 'high');

    if (priorityError) {
      throw new Error(`Failed to filter by priority: ${priorityError.message}`);
    }

    console.log(chalk.green('✓ Log filtering working'));
    console.log(chalk.gray(`  Found ${completedLogs?.length || 0} completed logs`));
    console.log(chalk.gray(`  Found ${highPriorityLogs?.length || 0} high priority logs`));
  }

  private async testRLSPolicies() {
    console.log(chalk.yellow('Testing RLS policies...'));
    
    // Test that we can only see our own logs
    const { data, error } = await supabase
      .from('prompt_logs')
      .select('user_id')
      .limit(100);

    if (error) {
      throw new Error(`Failed to test RLS: ${error.message}`);
    }

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('No user found for RLS test');
    }

    // Verify all logs belong to current user
    const allLogsOwnedByUser = data?.every(log => log.user_id === user.id);
    
    if (!allLogsOwnedByUser) {
      throw new Error('RLS policies not working - found logs from other users');
    }

    console.log(chalk.green('✓ RLS policies working correctly'));
  }

  private async testDeleteLog() {
    console.log(chalk.yellow('Testing log deletion...'));
    
    if (this.testLogIds.length === 0) {
      throw new Error('No test log available for deletion test');
    }

    const logId = this.testLogIds[0];

    const { error } = await supabase
      .from('prompt_logs')
      .delete()
      .eq('id', logId);

    if (error) {
      throw new Error(`Failed to delete log: ${error.message}`);
    }

    // Verify log was deleted
    const { data, error: fetchError } = await supabase
      .from('prompt_logs')
      .select('id')
      .eq('id', logId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw new Error(`Unexpected error checking deletion: ${fetchError.message}`);
    }

    if (data) {
      throw new Error('Log was not actually deleted');
    }

    // Remove from our tracking array
    this.testLogIds = this.testLogIds.filter(id => id !== logId);

    console.log(chalk.green('✓ Log deletion working'));
  }

  private async cleanup() {
    console.log(chalk.yellow('Cleaning up test data...'));
    
    if (this.testLogIds.length > 0) {
      const { error } = await supabase
        .from('prompt_logs')
        .delete()
        .in('id', this.testLogIds);

      if (error) {
        console.warn(chalk.orange(`Warning: Failed to cleanup test logs: ${error.message}`));
      } else {
        console.log(chalk.green('✓ Cleanup completed'));
      }
    }
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  const tester = new PromptLogsSystemTester();
  tester.runAllTests().catch(console.error);
}

export { PromptLogsSystemTester };