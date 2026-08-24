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

## Continuous integration

Pull requests and pushes to `master` install dependencies from the public npm
registry. They check formatting, lint, types, tests, and the production build.
A failed check stops the workflow. Builds from `master` are available as GitHub
Actions artifacts for seven days.

The npm cache stores downloaded packages only. Each workflow still uses `npm
ci` to validate `package-lock.json` and create a clean dependency installation.

## Releases

Stable GitHub releases deploy to
<https://thecorezi.com/scars-of-steel/>. Drafts and prereleases do not deploy.
The release tag is the public version.

The release workflow builds the tag and saves `dist` as a GitHub Actions
artifact. It then requests a deployment from `TheCoreZi/thecorezi-web`. That
site includes the latest stable game release at `/scars-of-steel/` and checks
<https://thecorezi.com/scars-of-steel/build-info.json> after deployment. The
metadata file has this format:

```json
{
  "commit": "<full release commit SHA>",
  "version": "<release tag>"
}
```

Add a fine-grained token named `THECOREZI_WEB_DISPATCH_TOKEN` to the GitHub
Actions secrets for this repository. Give the token access only to
`TheCoreZi/thecorezi-web` and grant it write access to repository contents. The
token sends the `repository_dispatch` event. It is not included in the source
or build artifact.

Disable GitHub Pages for this repository. `TheCoreZi/thecorezi-web` owns the
Pages deployment and the `thecorezi.com` custom domain. Do not add a `CNAME`
file here.
