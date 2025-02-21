# ay11lint

An accessibility linter for HTML files with a focus on WCAG compliance based on axe.

## Installation

```bash
npm install ay11lint
```

## Usage

```bash
ay11lint <file-or-directory-path>
```

## Configuration

Create an ay11lint.json or .ay11lintrc file in your project root:

```json
{
  "lintingSrouceFolder": "dist", // folder to lint, after using your templating engine to compile into html
  "ignore": ["node_modules/**"], // glob patterns to ignore
  "extensions": [".njk", ".html"], // file extensions to lint
  "rules": {
    "link-name": { "enabled": false },
    "region": { "enabled": true }
  }, // rule configuration based on axe-core rules configuration
  "rulesMessages": {
    "link-name": "Link name should be a sentence",
    "region": "Region should be a sentence"
  } // custom messages for rules
}
```

## Features
- WCAG 2.0 compliance checking
- WCAG 2.1 compliance checking
- HTML accessibility validation
- Support for single files and directories
- Configurable rules and extensions

## Contributing
Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) before submitting a pull request.

## License
This project is licensed under the MIT License.
MIT © HC
