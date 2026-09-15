# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

`@onlyoffice/document-editor-react` is a thin React wrapper around the ONLYOFFICE Document Server JavaScript API (`DocsAPI`). It exports two components from `src/index.ts`: `DocumentEditor` (`src/DocumentEditor.tsx`) opens a document, `DocumentEditorPreload` (`src/DocumentEditorPreload.tsx`) only warms the browser cache. It is published to npm as a library — there is no app to run here; the only ways to see it work are Storybook and the e2e harness.

## Commands

```bash
npm install            # install deps
npm run test           # jest unit tests (jsdom)
npm run test -- -t "renders"   # run a single test by name
npm run rollup         # build dist/ (cjs, esm, .d.ts)
npm pack               # produce the publishable tarball
npm run storybook      # dev Storybook on :6006
npm run build-storybook
npm run test:e2e       # from repo root: npm ci + Playwright run inside e2e/
```

E2E is a nested npm project in `e2e/` with its own `package.json` and `node_modules`; run its commands with `--prefix e2e` or from inside `e2e/`:

```bash
cd e2e
npx playwright install --with-deps chromium   # once
npm run test                                  # setup.mjs + full suite
npx playwright test tests/document-editor.e2e.spec.ts -g "error code -2"   # single test
E2E_LIB_VERSION=2.2.0 npm run test            # test a published npm version instead of local source
```

## Architecture

**Component lifecycle** (`src/DocumentEditor.tsx`) — the whole library is essentially one `useEffect` pair:

1. Mount effect builds `${documentServerUrl}web-apps/apps/api/documents/api.js` (appending `?shardkey=…`, defaulting to `config.document.key` when `shardkey` is `true`), loads it via `src/utils/loadScript.ts`, then calls `onLoad()`. Cleanup destroys the editor instance.
2. A second effect watches "important" props (`documentServerUrl`, `JSON.stringify(config)`, `document_*`, `documentType`, `editorConfig_lang`, `height`, `type`, `width`) and, if an instance already exists, destroys and re-creates the editor. Props outside that list intentionally do **not** re-init the editor.

**Instance registry**: editors are tracked in the global `window.DocEditor.instances[id]`, keyed by the `id` prop — this is how the component detects duplicates, avoids double-init, and destroys on unmount. `id` must be unique per editor on the page (Storybook's preview decorator appends a timestamp to `args.id` for this reason).

**Config merge order**: flat `document_*` / `editorConfig_*` / `events_*` props are assembled into a `propsConfig` object, then `Object.assign(propsConfig, cloneDeep(config))` — so the `config` object always wins over the flat legacy props. `config` is deep-cloned (lodash) because DocsAPI mutates what it is given.

**Error codes** passed to `onLoadComponentError`: `-1` unknown, `-2` failed to load `api.js`, `-3` `DocsAPI` undefined after load. E2E tests assert these numbers; keep them stable.

**`loadScript`** deduplicates by script element `id` (`onlyoffice-api-script`): if `window.DocsAPI` already exists it resolves immediately; if a script tag with that id is mid-flight (marked by a `loading` attribute) it polls every 500 ms rather than injecting a second tag; a stale tag that finished without defining `DocsAPI` is removed and re-created.

**`DocumentEditorPreload`** (`src/DocumentEditorPreload.tsx`) shares nothing with the editor component: no `useEffect`, no `loadScript`, no instance registry. It renders a hidden `<iframe>` pointing at `${documentServerUrl}web-apps/apps/api/documents/preload.html` (adding the trailing slash when the url lacks one) and nothing else. The preload page exists since ONLYOFFICE Docs 9.0; older servers answer it with a 404, which is harmless. Keep the component free of `DocsAPI` knowledge — mounting it next to `DocumentEditor` is pointless, it is meant for pages shown *before* the editor.

**Types** come from the peer dependency `@onlyoffice/doceditor-types` (`Config`, `DocEditor`); this repo no longer defines its own `IConfig`. `window.DocsAPI` / `window.DocEditor` are declared in the component's `declare global` block.

## Build & test setup

- Rollup produces two bundles from `src/index.ts` (cjs → `dist/cjs`, esm → `dist/esm`) plus a rolled-up `dist/index.d.ts` via `rollup-plugin-dts`; `react`/`react-dom` and peer deps are externalized. `tsconfig.json` excludes tests, stories, and `e2e/` from the build.
- Jest uses babel (`babel.config.js`), jsdom, and ignores `e2e/`. For `DocumentEditor` the unit tests are smoke-level only — real behaviour is covered by Playwright. `DocumentEditorPreload` is the exception: `src/DocumentEditorPreload.test.tsx` is its only coverage, it has neither an e2e test nor a story.
- The e2e suite installs the **packed tarball** into `e2e/node_modules` (`e2e/scripts/setup.mjs` runs `npm run rollup` + `npm pack` at the repo root), so it exercises the published artifact, not `src/`. Rebuild by re-running `npm run test` in `e2e/` after changing library code — running `playwright test` alone will use the stale tarball.
- Tests never touch a real Document Server: they stub `window.DocsAPI` via `page.addInitScript`, or intercept `**/web-apps/apps/api/documents/api.js**` with `page.route` to serve a fake / abort it. Keep that pattern — CI has no Document Server.
- Storybook (`.storybook/`, webpack5 + swc) reads `src/config/default.json`; point `documentServerUrl` there at a real server to try the component manually.

## Conventions

- Commits must follow Conventional Commits — `commitlint` runs on `commit-msg` via lefthook (`lefthook.yml`).
- Releases are tag-driven: bump `package.json`, add the version section at the top of `CHANGELOG.md`, merge to `master` → `create-tag.yml` reads the first version in `CHANGELOG.md` and pushes `v<version>` → `release.yml` builds, publishes to npm with provenance, and cuts a GitHub release whose body is extracted from `CHANGELOG.md`.
- Every source file carries the Ascensio System SIA Apache-2.0 header; new files in `src/` should keep it. A CI job checks dependency licenses against Apache-2.0.
- `README.md` holds one props table per component (`DocumentEditor`, and `DocumentEditorPreload` under "Preloading the editor") — these tables are the public API doc, update the right one when adding or changing a prop.
