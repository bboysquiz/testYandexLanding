import js from '@eslint/js'

export default [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  js.configs.recommended,
  {
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        clearInterval: 'readonly',
        document: 'readonly',
        getComputedStyle: 'readonly',
        requestAnimationFrame: 'readonly',
        setInterval: 'readonly',
        window: 'readonly',
      },
    },
  },
]
