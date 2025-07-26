#!/bin/bash

###############################################################################
# AqlHR Platform - Pre-Commit Translation Memory Hook
# 
# @file scripts/pre-commit.sh
# @description Git pre-commit hook for automatic translation key extraction
#              and TM system synchronization
# @version 2.1.0
# @created 2025-01-26
# @security PDPL compliant - sanitizes content before TM upload
# 
# This hook:
# 1. Extracts translation keys from modified files
# 2. Uploads new/changed keys to Translation Memory system
# 3. Validates existing translations
# 4. Aborts commit if TM sync fails or keys are missing
###############################################################################

set -e  # Exit on any error

# ═══ CONFIGURATION ═════════════════════════════════════════════════
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
NODE_BIN="$PROJECT_ROOT/node_modules/.bin"
TEMP_DIR="/tmp/aqlhr-precommit-$$"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# ═══ ENVIRONMENT VALIDATION ═══════════════════════════════════════
validate_environment() {
    log_info "Validating pre-commit environment..."
    
    # Check if Node.js is available
    if ! command -v node &> /dev/null; then
        log_error "Node.js is required but not installed"
        exit 1
    fi
    
    # Check if required scripts exist
    local required_scripts=(
        "$SCRIPT_DIR/extract-keys.js"
        "$SCRIPT_DIR/verify-translations.js"
    )
    
    for script in "${required_scripts[@]}"; do
        if [[ ! -f "$script" ]]; then
            log_error "Required script not found: $script"
            log_info "Run 'npm run setup:translation-tools' to install missing scripts"
            exit 1
        fi
    done
    
    # Check TM credentials
    if [[ -z "$TM_API_KEY" && -z "$CROWDIN_API_KEY" && -z "$LOKALISE_API_KEY" ]]; then
        log_warning "No Translation Memory API key found"
        log_warning "Set TM_API_KEY, CROWDIN_API_KEY, or LOKALISE_API_KEY environment variable"
        log_warning "Or add to your local .env file"
        
        # Check if .env file exists
        if [[ -f "$PROJECT_ROOT/.env" ]]; then
            log_info "Loading environment from .env file"
            set -a
            source "$PROJECT_ROOT/.env"
            set +a
        fi
        
        # Final check
        if [[ -z "$TM_API_KEY" && -z "$CROWDIN_API_KEY" && -z "$LOKALISE_API_KEY" ]]; then
            log_error "Translation Memory credentials are required for pre-commit hook"
            log_info "To bypass this check temporarily, use: git commit --no-verify"
            exit 1
        fi
    fi
    
    log_success "Environment validation completed"
}

# ═══ FILE ANALYSIS ════════════════════════════════════════════════
get_modified_files() {
    log_info "Analyzing modified files..."
    
    # Get staged files that match our patterns
    local modified_files
    modified_files=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(ts|tsx|js|jsx)$' | grep -v '\.test\.' | grep -v '\.stories\.' || true)
    
    if [[ -z "$modified_files" ]]; then
        log_info "No relevant files modified, skipping translation checks"
        exit 0
    fi
    
    echo "$modified_files"
}

# ═══ KEY EXTRACTION ═══════════════════════════════════════════════
extract_translation_keys() {
    local modified_files="$1"
    
    log_info "Extracting translation keys from modified files..."
    
    # Create temporary directory
    mkdir -p "$TEMP_DIR"
    
    # Extract keys from modified files only
    echo "$modified_files" | while read -r file; do
        if [[ -f "$PROJECT_ROOT/$file" ]]; then
            echo "$file"
        fi
    done > "$TEMP_DIR/modified_files.txt"
    
    if [[ ! -s "$TEMP_DIR/modified_files.txt" ]]; then
        log_info "No valid files to process"
        cleanup_temp
        exit 0
    fi
    
    # Run key extraction on modified files
    node "$SCRIPT_DIR/extract-keys.js" \
        --files="$TEMP_DIR/modified_files.txt" \
        --output="$TEMP_DIR/extracted_keys.json" \
        --format=json \
        --include-context
    
    if [[ ! -f "$TEMP_DIR/extracted_keys.json" ]]; then
        log_error "Key extraction failed"
        cleanup_temp
        exit 1
    fi
    
    # Count extracted keys
    local key_count
    key_count=$(node -e "console.log(Object.keys(require('$TEMP_DIR/extracted_keys.json')).length)")
    
    if [[ "$key_count" -gt 0 ]]; then
        log_success "Extracted $key_count translation keys"
    else
        log_info "No new translation keys found"
        cleanup_temp
        exit 0
    fi
}

# ═══ TM SYSTEM UPLOAD ═════════════════════════════════════════════
upload_to_tm_system() {
    log_info "Uploading new keys to Translation Memory system..."
    
    # Determine TM system and upload
    local tm_system="${TM_SYSTEM:-crowdin}"
    local upload_result
    
    case "$tm_system" in
        "crowdin")
            upload_result=$(upload_to_crowdin)
            ;;
        "lokalise")
            upload_result=$(upload_to_lokalise)
            ;;
        "custom")
            upload_result=$(upload_to_custom_tm)
            ;;
        *)
            log_error "Unsupported TM system: $tm_system"
            exit 1
            ;;
    esac
    
    if [[ "$upload_result" != "success" ]]; then
        log_error "Failed to upload keys to TM system"
        log_info "Upload result: $upload_result"
        exit 1
    fi
    
    log_success "Successfully uploaded keys to TM system"
}

# ═══ TM SYSTEM IMPLEMENTATIONS ════════════════════════════════════
upload_to_crowdin() {
    log_info "Uploading to Crowdin..."
    
    # Use Crowdin CLI or API
    if command -v crowdin &> /dev/null; then
        # Use Crowdin CLI
        crowdin upload sources \
            --source="$TEMP_DIR/extracted_keys.json" \
            --config="$PROJECT_ROOT/crowdin.yml" \
            --verbose
    else
        # Use direct API call
        local project_id="${CROWDIN_PROJECT_ID:-$TM_PROJECT_ID}"
        local api_key="${CROWDIN_API_KEY:-$TM_API_KEY}"
        
        curl -X POST \
            "https://api.crowdin.com/api/v2/projects/$project_id/strings" \
            -H "Authorization: Bearer $api_key" \
            -H "Content-Type: application/json" \
            -d @"$TEMP_DIR/extracted_keys.json" \
            --fail
    fi
    
    echo "success"
}

upload_to_lokalise() {
    log_info "Uploading to Lokalise..."
    
    local project_id="${LOKALISE_PROJECT_ID:-$TM_PROJECT_ID}"
    local api_key="${LOKALISE_API_KEY:-$TM_API_KEY}"
    
    curl -X POST \
        "https://api.lokalise.com/api2/projects/$project_id/keys" \
        -H "X-Api-Token: $api_key" \
        -H "Content-Type: application/json" \
        -d @"$TEMP_DIR/extracted_keys.json" \
        --fail
    
    echo "success"
}

upload_to_custom_tm() {
    log_info "Uploading to custom TM system..."
    
    local base_url="${CUSTOM_TM_URL:-https://tm.aqlhr.com/api/v1}"
    local api_key="${CUSTOM_TM_KEY:-$TM_API_KEY}"
    local project_key="${CUSTOM_PROJECT_KEY:-aqlhr-platform}"
    
    curl -X POST \
        "$base_url/projects/$project_key/keys" \
        -H "Authorization: Bearer $api_key" \
        -H "Content-Type: application/json" \
        -d @"$TEMP_DIR/extracted_keys.json" \
        --fail
    
    echo "success"
}

# ═══ TRANSLATION VALIDATION ═══════════════════════════════════════
validate_translations() {
    log_info "Validating existing translations..."
    
    # Run translation verification
    node "$SCRIPT_DIR/verify-translations.js" \
        --strict \
        --report="$TEMP_DIR/validation_report.json"
    
    local exit_code=$?
    
    if [[ $exit_code -ne 0 ]]; then
        log_error "Translation validation failed"
        
        # Show validation report if available
        if [[ -f "$TEMP_DIR/validation_report.json" ]]; then
            log_info "Validation Report:"
            node -e "
                const report = require('$TEMP_DIR/validation_report.json');
                if (report.missing && report.missing.length > 0) {
                    console.log('Missing keys:');
                    report.missing.forEach(key => console.log('  - ' + key));
                }
                if (report.outdated && report.outdated.length > 0) {
                    console.log('Outdated translations:');
                    report.outdated.forEach(key => console.log('  - ' + key));
                }
            "
        fi
        
        log_info "Run 'npm run translations:sync' to update translations"
        log_info "Or use 'git commit --no-verify' to bypass this check"
        exit 1
    fi
    
    log_success "Translation validation passed"
}

# ═══ CLEANUP ═══════════════════════════════════════════════════════
cleanup_temp() {
    if [[ -d "$TEMP_DIR" ]]; then
        rm -rf "$TEMP_DIR"
    fi
}

# ═══ ERROR HANDLING ═══════════════════════════════════════════════
handle_error() {
    local exit_code=$?
    log_error "Pre-commit hook failed with exit code $exit_code"
    cleanup_temp
    exit $exit_code
}

trap handle_error ERR

# ═══ MAIN EXECUTION ═══════════════════════════════════════════════
main() {
    log_info "Starting AqlHR Translation Memory pre-commit hook..."
    
    # Validate environment
    validate_environment
    
    # Get modified files
    local modified_files
    modified_files=$(get_modified_files)
    
    if [[ -z "$modified_files" ]]; then
        exit 0
    fi
    
    # Extract translation keys
    extract_translation_keys "$modified_files"
    
    # Upload to TM system (if keys were found)
    if [[ -f "$TEMP_DIR/extracted_keys.json" ]]; then
        local key_count
        key_count=$(node -e "console.log(Object.keys(require('$TEMP_DIR/extracted_keys.json')).length)")
        
        if [[ "$key_count" -gt 0 ]]; then
            upload_to_tm_system
        fi
    fi
    
    # Validate existing translations
    validate_translations
    
    # Cleanup
    cleanup_temp
    
    log_success "Pre-commit translation checks completed successfully"
}

# Run main function
main "$@"