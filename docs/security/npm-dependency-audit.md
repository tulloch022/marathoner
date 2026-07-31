# npm dependency security review

**Tracking issue:** [#31](https://github.com/marathoner-app/marathoner/issues/31)

**Reviewed:** July 30, 2026

## Outcome

The production dependency tree has no known npm audit findings after upgrading Firebase within major version 11.

The full audit retains development-only findings in the ESLint and Firebase CLI
trees. They trace to three upstream advisories and are temporarily accepted
under the conditions documented below.

## Audit results

| Audit | Before | After |
| --- | --- | --- |
| `npm audit --omit=dev` | 2 moderate, 1 high, 2 critical | 0 findings |
| `npm audit` after issue #31 | 3 low, 4 moderate, 9 high, 2 critical | 5 high |
| `npm audit` after adding issue #12 emulator tooling | 5 high | 2 moderate, 20 high |

## Direct dependency changes

### Production

- `firebase`: `^11.3.1` to `^11.10.0`

Firebase 11.10.0 replaces the vulnerable production paths with these resolved versions:

- `@grpc/grpc-js@1.9.16`
- `protobufjs@7.6.5`
- `@protobufjs/utf8@1.1.2`
- `websocket-driver@0.7.5`

### Development

- `@eslint/js`: `^9.17.0` to `^9.39.5`
- `@vitejs/plugin-react`: `^4.3.4` to `^4.7.0`
- `eslint`: `^9.17.0` to `^9.39.5`
- `eslint-plugin-react-hooks`: `^5.0.0` to `^5.2.0`
- `eslint-plugin-react-refresh`: `^0.4.16` to `^0.4.26`
- `typescript-eslint`: `^8.18.2` to `^8.65.0`
- `vite`: `^6.0.5` to `^6.4.3`

These updates remain within the existing major versions. They remove the actionable Babel, Vite, Rollup, PostCSS, `flatted`, `js-yaml`, and `picomatch` findings without using `npm audit fix --force`.

### Persistence test tooling

- `@firebase/rules-unit-testing`: `^4.0.1`
- `firebase-tools`: `^15.25.1`

These development dependencies run the local Firestore emulator and verify
authorization rules against authenticated, anonymous, and cross-user requests.
They are not imported by the application or included in its production bundle.

## Accepted residual risk

### ESLint glob expansion

The remaining audit result is [GHSA-mh99-v99m-4gvg](https://github.com/advisories/GHSA-mh99-v99m-4gvg), a denial-of-service issue in `brace-expansion`. npm reports five affected packages because the same underlying advisory propagates through three ESLint paths:

```text
eslint@9.39.5 -> minimatch@3.1.5 -> brace-expansion@1.1.18
eslint@9.39.5 -> @eslint/config-array@0.21.2 -> minimatch@3.1.5 -> brace-expansion@1.1.18
eslint@9.39.5 -> @eslint/eslintrc@3.3.6 -> minimatch@3.1.5 -> brace-expansion@1.1.18
```

### Why it is accepted temporarily

- The packages exist only in the lint toolchain and are excluded from the production dependency audit and application bundle.
- Marathoner supplies trusted repository paths and configuration to ESLint. Application users cannot provide glob patterns to this code path.
- npm's proposed automatic remediation is an incompatible downgrade to `eslint@4.0.0`, not a safe upgrade.
- Forcing a new major version of `minimatch` or `brace-expansion` beneath ESLint would bypass the versions ESLint declares compatible and could make lint results unreliable.

### Mitigations

- Do not run the lint toolchain against an unreviewed third-party branch or untrusted ESLint configuration.
- Keep `npm audit --omit=dev` at zero findings.
- Re-run the full audit whenever the lockfile or lint dependencies change.
- Remove this exception when ESLint adopts a compatible dependency path that resolves the advisory.

### Firebase CLI transitive dependencies

Adding `firebase-tools@15.25.1` for the Firestore emulator introduces findings
for these upstream packages:

- `@opentelemetry/core@1.30.1`, reported by
  [GHSA-8988-4f7v-96qf](https://github.com/advisories/GHSA-8988-4f7v-96qf)
- `brace-expansion` versions 1.1.18 and 2.1.4, reported by
  [GHSA-mh99-v99m-4gvg](https://github.com/advisories/GHSA-mh99-v99m-4gvg)
- `uuid@9.0.1`, reported by
  [GHSA-w5hq-g745-h8pq](https://github.com/advisories/GHSA-w5hq-g745-h8pq)

They are accepted temporarily because:

- Firebase CLI is development-only and is excluded from the production audit
  and browser bundle.
- The CLI and emulator consume trusted repository configuration and test data.
  Application users cannot provide baggage headers, glob expressions, or UUID
  output buffers to these local code paths.
- The emulator binds to localhost only while the integration command is
  running, then shuts down.
- npm offers no compatible automatic remediation. `npm audit fix --force`
  proposes breaking downgrades to `firebase-tools@3.18.2` and `eslint@4.0.0`.

Mitigations:

- Do not expose the Firestore emulator to a public network.
- Run emulator tests only from reviewed repository code and configuration.
- Keep Firebase CLI current and remove these exceptions when compatible
  upstream releases resolve the dependency paths.
- Treat any production, critical, or unrelated future finding as a new review.

## Node version note

The repository's GitHub Pages workflow uses Node 22, which is supported by the updated toolchain. A clean install under the local Node 23.4.0 environment completes but emits an engine warning from `eslint-visitor-keys@5.0.1`, whose supported versions are Node 20.19 or newer in the 20 line, Node 22.13 or newer in the 22 line, or Node 24 and newer.

Node 23 is a non-LTS release and is not included in that package's supported range. Local development should use the same Node 22 LTS line as the repository workflow rather than weakening or downgrading the patched lint dependencies.

## Verification commands

```sh
npm ci
npm audit --omit=dev
npm audit
npm run lint
npm test
npm run build
```

The full audit is expected to exit nonzero while the accepted development-only
advisories remain. Its result must continue to match the dependency paths and
exposure described above. Any new production finding, critical finding, or
unrelated full-audit finding requires a separate review rather than being
covered by this acceptance.
