import subprocess
import sys
import json

print("🔒 AqlHR End-to-End Security Validation")
print("=====================================")

# Execute our security validation demo
result = subprocess.run([
    "npx", "tsx", "scripts/run-security-validation-demo.ts"
], capture_output=True, text=True)

print(result.stdout)
if result.stderr:
    print("STDERR:", result.stderr)

print(f"Exit code: {result.returncode}")