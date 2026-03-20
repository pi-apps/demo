module.exports = {
  bracketSpacing: true,
  insertPragma: false,
  printWidth: 120,
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "es5",
  useTabs: false,
  arrowParens: "avoid",
  bracketSameLine: false,

  overrides: [
    {
      files: "*.svg",
      options: {
        parser: "html",
      },
    },
  ],
};
