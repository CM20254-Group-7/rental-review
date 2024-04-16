/** @type {import("prettier").Config} */
const config = {
  tabWidth: 2,
  trailingComma: 'all',
  singleQuote: true,
  jsxSingleQuote: true,
  quoteProps: 'as-needed',
  semi: true,
  bracketSameLine: false,
  plugins: ['prettier-plugin-tailwindcss'],
};

export default config;