# Missing Package.json Scripts

The following scripts need to be manually added to `package.json`:

```json
{
  "scripts": {
    "typecheck": "tsc -p . --noEmit",
    "i18n:verify": "tsx scripts/i18n-verify.ts"
  }
}
```

These scripts are required for the CI workflow to function properly.

## How to Test

After adding the scripts, you can run:

```bash
npm run typecheck
npm run i18n:verify
```

The `i18n:verify` script will check for:
- Missing translations between EN/AR
- Legacy SimpleLanguageContext usage
- Translation integrity across all namespaces