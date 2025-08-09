#!/bin/bash

# Fix all AqlHRAIAssistant imports from named to default
find src -name "*.tsx" -exec sed -i 's/import { AqlHRAIAssistant } from '"'"'@\/components\/ai\/AqlHRAIAssistant'"'"';/import AqlHRAIAssistant from '"'"'@\/components\/ai\/AqlHRAIAssistant'"'"';/g' {} \;

echo "Fixed all AqlHRAIAssistant imports"