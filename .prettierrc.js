module.exports = {
  printWidth: 100,
  singleQuote: true,
  quoteProps: 'as-needed',
  trailingComma: 'all',
  bracketSpacing: false,
  arrowParens: 'avoid',
  htmlWhitespaceSensitivity: 'strict',
  overrides: [
    {files: '*.html', options: {parser: 'angular'}},
    {files: '*.api.md', options: {requirePragma: true}},
  ],
};
