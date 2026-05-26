// eslint.config.js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'node_modules', '.vite', '*.js'] },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    rules: {
      // TẮT HẦU HẾT CÁC WARNING PHỔ BIẾN
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'no-console': 'off',
      'prefer-const': 'warn',
      'no-undef': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
    }
  }
);