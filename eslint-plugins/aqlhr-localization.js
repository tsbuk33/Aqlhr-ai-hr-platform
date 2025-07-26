import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

/**
 * ESLint plugin to enforce AqlHR localization governance
 * Checks for hardcoded strings and ensures proper translation key usage
 */

let termBank = null;

// Load the term bank
function loadTermBank() {
  if (termBank) return termBank;
  
  try {
    const termBankPath = path.join(process.cwd(), 'localization', 'terms.yaml');
    const fileContents = fs.readFileSync(termBankPath, 'utf8');
    termBank = yaml.load(fileContents);
    return termBank;
  } catch (error) {
    console.warn('Could not load term bank:', error.message);
    return {};
  }
}

// Extract all approved translation keys from term bank
function getApprovedKeys() {
  const terms = loadTermBank();
  const keys = new Set();
  
  function extractKeys(obj, prefix = '') {
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (value && typeof value === 'object') {
        if (value.en && value.ar) {
          // This is a translation entry
          keys.add(fullKey);
        } else {
          // This is a nested category
          extractKeys(value, fullKey);
        }
      }
    }
  }
  
  extractKeys(terms);
  return keys;
}

// Check if a string appears to be hardcoded text that should be translated
function isHardcodedString(value) {
  // Skip if it's clearly not user-facing text
  if (!value || typeof value !== 'string') return false;
  if (value.length < 2) return false;
  if (/^[a-zA-Z0-9_-]+$/.test(value)) return false; // Technical identifiers
  if (/^\d+(\.\d+)?$/.test(value)) return false; // Numbers
  if (/^#[0-9a-fA-F]{3,8}$/.test(value)) return false; // Colors
  if (/^https?:\/\//.test(value)) return false; // URLs
  if (/^\/[\/\w-]*$/.test(value)) return false; // Paths
  if (/^\.[a-zA-Z-]+$/.test(value)) return false; // CSS classes
  if (/^[A-Z_][A-Z0-9_]*$/.test(value)) return false; // Constants
  
  // Check for common user-facing patterns
  const userFacingPatterns = [
    /^[A-Z][a-z]/, // Starts with capital letter
    /\s/, // Contains spaces
    /[.!?]$/, // Ends with punctuation
    /^(Add|Edit|Delete|Save|Cancel|Loading|Error|Success|Warning)/, // Common UI terms
  ];
  
  return userFacingPatterns.some(pattern => pattern.test(value));
}

// Check if translation key exists in approved terms
function isApprovedKey(key) {
  const approvedKeys = getApprovedKeys();
  return approvedKeys.has(key);
}

const plugin = {
  meta: {
    name: 'aqlhr-localization',
    version: '1.0.0',
    docs: {
      description: 'Enforce AqlHR localization governance and prevent hardcoded strings',
      category: 'Best Practices',
    },
    fixable: null,
    schema: [],
  },
  
  create(context) {
    return {
      // Check JSX text nodes
      JSXText(node) {
        const value = node.value.trim();
        if (isHardcodedString(value)) {
          context.report({
            node,
            message: `Hardcoded string detected: "${value}". Use translation key from terms.yaml instead.`,
          });
        }
      },
      
      // Check string literals in JSX attributes
      JSXExpressionContainer(node) {
        if (node.expression.type === 'Literal' && typeof node.expression.value === 'string') {
          const value = node.expression.value;
          if (isHardcodedString(value)) {
            context.report({
              node: node.expression,
              message: `Hardcoded string in JSX attribute: "${value}". Use translation key instead.`,
            });
          }
        }
      },
      
      // Check template literals
      TemplateLiteral(node) {
        if (node.quasis.length === 1) {
          const value = node.quasis[0].value.cooked;
          if (isHardcodedString(value)) {
            context.report({
              node,
              message: `Hardcoded string in template literal: "${value}". Use translation key instead.`,
            });
          }
        }
      },
      
      // Check function calls to translation functions
      CallExpression(node) {
        // Check t() function calls
        if (node.callee.name === 't' && node.arguments.length > 0) {
          const keyArg = node.arguments[0];
          if (keyArg.type === 'Literal' && typeof keyArg.value === 'string') {
            const key = keyArg.value;
            if (!isApprovedKey(key)) {
              context.report({
                node: keyArg,
                message: `Translation key "${key}" not found in approved term bank. Add to terms.yaml first.`,
              });
            }
          }
        }
      },
      
      // Check object properties that might contain hardcoded strings
      Property(node) {
        if (node.value.type === 'Literal' && typeof node.value.value === 'string') {
          const value = node.value.value;
          
          // Check common property names that should use translations
          const translatableProps = ['title', 'label', 'placeholder', 'description', 'message', 'text'];
          const propertyName = node.key.name || node.key.value;
          
          if (translatableProps.includes(propertyName) && isHardcodedString(value)) {
            context.report({
              node: node.value,
              message: `Property "${propertyName}" contains hardcoded string: "${value}". Use translation key instead.`,
            });
          }
        }
      },
    };
  },
};

export default plugin;