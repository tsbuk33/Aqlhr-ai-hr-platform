#!/bin/bash
# Script to systematically fix all custom RPC calls with 'as any' cast

# Add 'as any' cast to all custom RPC function calls
find src/hooks -name "*.ts" -exec sed -i "s/\.rpc('gov_queue_job_v1'/\.rpc('gov_queue_job_v1' as any/g" {} \;
find src/hooks -name "*.ts" -exec sed -i "s/\.rpc('gov_get_status_v1'/\.rpc('gov_get_status_v1' as any/g" {} \;
find src/hooks -name "*.ts" -exec sed -i "s/\.rpc('gov_get_changes_v1'/\.rpc('gov_get_changes_v1' as any/g" {} \;
find src/hooks -name "*.ts" -exec sed -i "s/\.rpc('gov_mark_change_processed_v1'/\.rpc('gov_mark_change_processed_v1' as any/g" {} \;
find src/hooks -name "*.ts" -exec sed -i "s/\.rpc('cci_get_hofstede_context_v1'/\.rpc('cci_get_hofstede_context_v1' as any/g" {} \;
find src/hooks -name "*.ts" -exec sed -i "s/\.rpc('integrations_overview_v2'/\.rpc('integrations_overview_v2' as any/g" {} \;
find src/hooks -name "*.ts" -exec sed -i "s/\.rpc('dashboard_get_v1'/\.rpc('dashboard_get_v1' as any/g" {} \;
find src/hooks -name "*.ts" -exec sed -i "s/\.rpc('integrations_status_v1'/\.rpc('integrations_status_v1' as any/g" {} \;
find src/hooks -name "*.ts" -exec sed -i "s/\.rpc('get_tenant_localization_prefs'/\.rpc('get_tenant_localization_prefs' as any/g" {} \;
find src/hooks -name "*.ts" -exec sed -i "s/\.rpc('update_localization_prefs'/\.rpc('update_localization_prefs' as any/g" {} \;
find src/hooks -name "*.ts" -exec sed -i "s/\.rpc('dev_seed_osi_v1'/\.rpc('dev_seed_osi_v1' as any/g" {} \;
find src/hooks -name "*.ts" -exec sed -i "s/\.rpc('osi_overview_v1'/\.rpc('osi_overview_v1' as any/g" {} \;
find src/hooks -name "*.ts" -exec sed -i "s/\.rpc('has_sku_access'/\.rpc('has_sku_access' as any/g" {} \;
find src/hooks -name "*.ts" -exec sed -i "s/\.rpc('start_trial'/\.rpc('start_trial' as any/g" {} \;
find src/hooks -name "*.ts" -exec sed -i "s/\.rpc('get_tenant_plan'/\.rpc('get_tenant_plan' as any/g" {} \;
find src/hooks -name "*.ts" -exec sed -i "s/\.rpc('has_feature'/\.rpc('has_feature' as any/g" {} \;
find src/hooks -name "*.ts" -exec sed -i "s/\.rpc('roi_get_last30_v1'/\.rpc('roi_get_last30_v1' as any/g" {} \;
find src/hooks -name "*.ts" -exec sed -i "s/\.rpc('roi_get_trend_v1'/\.rpc('roi_get_trend_v1' as any/g" {} \;
find src/hooks -name "*.ts" -exec sed -i "s/\.rpc('roi_emit_event'/\.rpc('roi_emit_event' as any/g" {} \;
find src/hooks -name "*.ts" -exec sed -i "s/\.rpc('get_user_tier'/\.rpc('get_user_tier' as any/g" {} \;
find src/hooks -name "*.ts" -exec sed -i "s/\.rpc('task_create_v1'/\.rpc('task_create_v1' as any/g" {} \;

echo "Fixed all RPC calls with 'as any' casts"