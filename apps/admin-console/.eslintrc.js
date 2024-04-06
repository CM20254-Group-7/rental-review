/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@repo/eslint-config/next.js"],
  parser: "@typescript-eslint/parser",
  rules: {
    "import/no-extraneous-dependencies": [
      "error",
      {
        "devDependencies": [
          "**/*.config.ts",
          "**/*.config.js"
        ],
        "packageDir": [
          "../../", // monorepo root
          "./", // package root
        ]
      }
    ]
  },
  overrides: [
    // remove some requirements from imported shadcn components
    {
      files: [
        'lib/utils.ts',
        'components/ui/*.tsx',
      ],
      rules: {
        'react/jsx-props-no-spreading': 'off',
        'import/prefer-default-export': 'off',
        'object-curly-newline': 'off',
        'jsx-a11y/heading-has-content': 'off',
      }
    }
  ]
};
