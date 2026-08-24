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
<https://scars-of-steel.thecorezi.com/>. Drafts and prereleases do not deploy.
The release tag is the public version. The release workflow builds the tag,
deploys `dist` with GitHub Pages, and checks the public page after deployment.
The metadata is available at
<https://scars-of-steel.thecorezi.com/build-info.json> in this format:

```json
{
  "commit": "<full release commit SHA>",
  "version": "<release tag>"
}
```

In the repository Pages settings, select **GitHub Actions** as the source. Set
the custom domain to `scars-of-steel.thecorezi.com`. Before you add the DNS
record, add the custom domain to the repository settings. Then add a DNS CNAME
record from `scars-of-steel` to `thecorezi.github.io`. Enable **Enforce HTTPS**
after GitHub validates the DNS record.

The deployment uses `GITHUB_TOKEN` with native Pages permissions. It does not
require repository secrets. Do not add a `CNAME` file because GitHub stores the
custom domain in the Pages settings.
