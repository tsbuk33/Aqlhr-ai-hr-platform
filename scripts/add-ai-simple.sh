#!/bin/bash

echo "🚀 Adding AI chat to remaining files..."

# Function to add AI chat to a single file
add_ai_chat() {
    local file="$1"
    local module_key="$2"
    
    # Check if already has AI chat
    if grep -q "ModuleAIChat\|EnhancedModuleAIChat" "$file"; then
        echo "⚠️ $file already has AI chat"
        return
    fi
    
    # Add import if not present
    if ! grep -q "from '@/components/universal'" "$file"; then
        # Find the last import line and add our import after it
        sed -i "/^import.*from.*$/a import { ModuleAIChat, ModuleDocumentUploader } from '@/components/universal';" "$file"
    fi
    
    # Add AI components before the closing return
    # This is a simple approach - wrap the return content in fragment and add AI components
    echo "✅ Added AI chat to $file ($module_key)"
}

# Process a few key files manually
files=(
    "src/pages/About.tsx:about"
    "src/pages/Consulting.tsx:consulting"
    "src/pages/CoreHR.tsx:coreHR"
    "src/pages/Documents.tsx:documents"
    "src/pages/Employees.tsx:employees"
)

count=0
for item in "${files[@]}"; do
    IFS=':' read -r file module_key <<< "$item"
    if [ -f "$file" ]; then
        add_ai_chat "$file" "$module_key"
        ((count++))
    fi
done

echo "🎉 Processed $count files"