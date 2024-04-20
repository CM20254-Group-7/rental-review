/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@repo/eslint-config/next.js'],
  parser: '@typescript-eslint/parser',
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/*.config.ts', '**/*.config.js'],
        packageDir: [
          '../../', // monorepo root
          './', // package root
        ],
      },
    ],
  },
  overrides: [
    // allow named export in lib/utils.ts file
    {
      files: ['./lib/utils.ts'],
      rules: {
        'import/prefer-default-export': 'off',
      },
    },
  ],
  ignorePatterns: [
    'next.config.js',
    'node_modules/**/*',
    'tailwind.config.cjs',
  ],
};
