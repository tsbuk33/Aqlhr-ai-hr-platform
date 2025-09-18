#!/bin/bash

# Script to fix all remaining custom RPC call TypeScript errors
# by adding 'as any' cast to custom RPC function names

echo "Fixing remaining custom RPC calls..."

# Function to fix RPC calls in a file
fix_rpc_calls() {
    local file="$1"
    if [[ -f "$file" ]]; then
        echo "Processing $file..."
        
        # Fix various custom RPC calls
        sed -i.bak \
            -e "s/\.rpc('dev_seed_employees_v1',/.rpc('dev_seed_employees_v1' as any,/g" \
            -e "s/\.rpc('dev_backfill_kpis_v1',/.rpc('dev_backfill_kpis_v1' as any,/g" \
            -e "s/\.rpc('cci_get_overview_v1',/.rpc('cci_get_overview_v1' as any,/g" \
            -e "s/\.rpc('cci_get_heatmap_v1',/.rpc('cci_get_heatmap_v1' as any,/g" \
            -e "s/\.rpc('roi_backfill_snapshots_v1',/.rpc('roi_backfill_snapshots_v1' as any,/g" \
            -e "s/\.rpc('dashboard_backfill_v1',/.rpc('dashboard_backfill_v1' as any,/g" \
            -e "s/\.rpc('dashboard_compute_kpis_v1',/.rpc('dashboard_compute_kpis_v1' as any,/g" \
            -e "s/\.rpc('gov_get_status_v1',/.rpc('gov_get_status_v1' as any,/g" \
            -e "s/\.rpc('get_tenant_localization_prefs',/.rpc('get_tenant_localization_prefs' as any,/g" \
            -e "s/\.rpc('update_localization_prefs',/.rpc('update_localization_prefs' as any,/g" \
            -e "s/\.rpc('saudization_color_v1',/.rpc('saudization_color_v1' as any,/g" \
            -e "s/\.rpc('compliance_run_now_v1',/.rpc('compliance_run_now_v1' as any,/g" \
            -e "s/\.rpc('dev_seed_retention_v1',/.rpc('dev_seed_retention_v1' as any,/g" \
            -e "s/\.rpc('rew_get_high_risk_managers_v1',/.rpc('rew_get_high_risk_managers_v1' as any,/g" \
            -e "s/\.rpc('start_trial',/.rpc('start_trial' as any,/g" \
            -e "s/\.rpc('create_api_key',/.rpc('create_api_key' as any,/g" \
            -e "s/\.rpc('revoke_api_key',/.rpc('revoke_api_key' as any,/g" \
            "$file"
        
        # Remove backup file
        rm -f "$file.bak"
    fi
}

# Fix all the files mentioned in the errors
fix_rpc_calls "src/lib/dev/ensureDemoData.ts"
fix_rpc_calls "src/lib/dev/ensureDemoEmployees.ts"
fix_rpc_calls "src/modules/cci/exports/data.ts"
fix_rpc_calls "src/pages/Onboarding.tsx"
fix_rpc_calls "src/pages/admin/DemoData.tsx"
fix_rpc_calls "src/pages/admin/GovernmentIntegration.tsx"
fix_rpc_calls "src/pages/admin/Localization.tsx"
fix_rpc_calls "src/pages/compliance/ComplianceAutopilot.tsx"
fix_rpc_calls "src/pages/diagnostic/Hub.tsx"
fix_rpc_calls "src/pages/diagnostic/Retention.tsx"
fix_rpc_calls "src/pages/diagnostic/RetentionEarlyWarning.tsx"
fix_rpc_calls "src/pages/plans/PlansPage.tsx"
fix_rpc_calls "src/pages/platform-features/APIGateway.tsx"

echo "Done fixing RPC calls!"