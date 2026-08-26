# Cicatrices de Acero

Text adventure game about the career of a Zoids pilot.

## Fan project notice

Scars of Steel is an unofficial, non-profit fan game created by The Core Zi.
This project is not affiliated with, sponsored by, or endorsed by TOMY Company,
Ltd. or its partners. ZOIDS and its names, characters, images, and trademarks
belong to TOMY Company, Ltd. and their respective owners.

## Asset credits

The following credits record the information that is currently available. An
unknown license does not grant permission to reuse or redistribute an asset.

| Assets                                                                                 | Source or creator                                                                                           | License status                                                                                                                                                          |
| -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Some title icons in `public/images/icons/titles/`                                      | [CraftPix](https://craftpix.net/)                                                                           | Covered by the applicable [CraftPix file license](https://craftpix.net/file-licenses/). The product tier is not documented. Do not redistribute these files separately. |
| Most Zoid sprites in `public/images/zoids/`                                            | The official Zoids Saga series for Game Boy Advance, collected through the internal `zoids-sleeper` project | The exact installment, original files, extraction details, and license are not documented.                                                                              |
| Rank images in `public/images/ranks/`                                                  | Kenney Vleugels                                                                                             | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/).                                                                                                          |
| IBM Plex Mono, IBM Plex Sans, and Quantico fonts                                       | Fontsource packages                                                                                         | SIL Open Font License 1.1. See `public/fonts/OFL-1.1.txt`.                                                                                                              |
| Faction emblems, brand images, achievement icons, remaining title icons, and UI images | The source is not documented.                                                                               | The license is not documented.                                                                                                                                          |

## Code copyright

The repository does not provide a general license to use, modify, or distribute
its original code. Default copyright restrictions apply. Asset terms remain
separate from the code copyright.

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
npm run verify
npm run verify:browser
```

Run `npm test` to run tests in watch mode. Run `npm run lint:fix` or `npm run
format` to fix files. Run `npm run preview` to serve the local build. The
`verify` command checks formatting, lint, types, and unit tests. The
`verify:browser` command runs Playwright, builds the application, and runs the
Lighthouse accessibility audit.

Install Chromium once before you run the browser checks:

```sh
npx playwright install chromium
```

## Git hooks

The installation configures Git hooks through Husky. The pre-commit hook runs
`npm run verify` and `npm run verify:browser`. A failed check stops the commit.
Use the CI workflow as the final verification for each pull request.

## Continuous integration

Pull requests and pushes to `master` install dependencies from the public npm
registry. They check formatting, lint, types, tests, and the production build.
The browser tests check accessibility, 48-pixel targets, horizontal overflow at
320, 768, and 1280 pixels, and a 200% zoom profile. Lighthouse requires an
Accessibility score of at least 95. A failed check stops the workflow. Builds
from `master` are available as GitHub Actions artifacts for seven days.

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
