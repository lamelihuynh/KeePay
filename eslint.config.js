// Flat config (ESLint 9+). Team nào cần rule riêng cho app của mình thì extend từ đây.
const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const prettier = require('eslint-config-prettier');

module.exports = tseslint.config(
  { ignores: ['**/dist/**', '**/.expo/**', '**/node_modules/**', '**/coverage/**', '**/*.js'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  prettier,
);
