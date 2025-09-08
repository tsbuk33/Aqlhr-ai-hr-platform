#!/bin/bash

# AQLHR Backend Vercel Deployment Script
# ======================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Vercel CLI is installed
check_vercel_cli() {
    if ! command -v vercel &> /dev/null; then
        print_error "Vercel CLI is not installed. Installing..."
        npm install -g vercel
    fi
    print_success "Vercel CLI is available"
}

# Deploy to Vercel
deploy_backend() {
    print_status "Deploying AQLHR Backend to Vercel..."
    
    # Navigate to project root
    cd "$(dirname "$0")/../.."
    
    # Deploy using the backend-specific Vercel config
    vercel --config vercel-backend.json --prod
    
    print_success "Backend deployed to Vercel!"
}

# Set environment variables
set_env_vars() {
    print_status "Setting up environment variables..."
    
    # Check if .env file exists
    if [ ! -f "backend/.env" ]; then
        print_warning "No .env file found. Please create one from .env.example"
        cp backend/.env.example backend/.env
        print_warning "Please edit backend/.env with your configuration"
        return 1
    fi
    
    # Read environment variables and set them in Vercel
    while IFS='=' read -r key value; do
        # Skip comments and empty lines
        if [[ $key =~ ^#.*$ ]] || [[ -z $key ]]; then
            continue
        fi
        
        # Remove quotes from value
        value=$(echo "$value" | sed 's/^"//;s/"$//')
        
        # Set environment variable in Vercel
        if [[ ! -z $value && $value != "your_"* ]]; then
            print_status "Setting environment variable: $key"
            vercel env add "$key" production <<< "$value"
        fi
    done < backend/.env
    
    print_success "Environment variables configured"
}

# Test deployment
test_deployment() {
    print_status "Testing deployment..."
    
    # Get the deployment URL
    DEPLOYMENT_URL=$(vercel ls --scope=$(vercel whoami) | grep aqlhr-backend | head -1 | awk '{print $2}')
    
    if [ -z "$DEPLOYMENT_URL" ]; then
        print_error "Could not find deployment URL"
        return 1
    fi
    
    # Test health endpoint
    print_status "Testing health endpoint: https://$DEPLOYMENT_URL/api/health"
    
    if curl -f -s "https://$DEPLOYMENT_URL/api/health" > /dev/null; then
        print_success "Health check passed!"
        print_success "Backend is live at: https://$DEPLOYMENT_URL"
    else
        print_error "Health check failed"
        return 1
    fi
}

# Main deployment function
main() {
    print_status "Starting AQLHR Backend Vercel deployment..."
    
    check_vercel_cli
    
    case "${1:-deploy}" in
        "deploy")
            deploy_backend
            test_deployment
            ;;
        "env")
            set_env_vars
            ;;
        "test")
            test_deployment
            ;;
        *)
            echo "Usage: $0 {deploy|env|test}"
            echo ""
            echo "Commands:"
            echo "  deploy - Deploy backend to Vercel"
            echo "  env    - Set environment variables"
            echo "  test   - Test deployment"
            exit 1
            ;;
    esac
}

main "$@"

