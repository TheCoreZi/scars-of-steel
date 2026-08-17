# Cicatrices de Acero

Text adventure game about the career of a Zoids pilot.

## Requirements

- Node.js 20.19 or a later compatible version.
- npm.

The project uses the public npm registry through its `.npmrc` file.

## Installation

```sh
npm install --registry=https://registry.npmjs.org/
```

The `--registry` option prevents an environment variable from replacing the
project registry.

## Development

```sh
npm run dev
```

## Verification

```sh
npm run typecheck
npm run lint
npm run format:check
npm run test:run
npm run build
```

Run `npm test` to run tests in watch mode. Run `npm run lint:fix` or `npm run
format` to fix files. Run `npm run preview` to serve the local build.
