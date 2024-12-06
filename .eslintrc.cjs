module.exports = {
  extends: '@mintlify/eslint-config-next',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
  },
  ignorePatterns: ['.eslintrc.cjs', '.next'],
};
