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
          "playwright-tests/**",
          "**/*.test.ts",
          "**/*.spec.ts",
          "**/*.config.ts",
          "**/*.config.js"
        ],
        "packageDir": [
          "../../", // monorepo root
          "./", // package root
        ]
      }
    ]
  }
};
