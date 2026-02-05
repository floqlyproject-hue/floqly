import ts from 'typescript-eslint'

export default [
  ...ts.configs.recommended,
  {
    ignores: ['node_modules/', 'dist/'],
  },
]
