# kurenn — Claude Code plugin marketplace

Plugins for Rails developers using Claude Code, by [Abraham Kuri](https://github.com/kurenn).

## Add this marketplace

```bash
claude plugin marketplace add kurenn/marketplace
```

After that, install any plugin below by name.

## Available plugins

| Plugin | What it does | Install |
|---|---|---|
| [`roundhouse@kurenn`](#roundhousekurenn) | Rails specialist team — orchestrator + 9 Sonnet specialists, TDD-aware | `claude plugin install roundhouse@kurenn` |
| [`boorails@kurenn`](#boorailskurenn) | 7 Rails skills: `/boo-security`, `/boo-quality`, `/boo-safety`, `/boo-diagnose`, `/boo-framework`, `/boo-alternatives`, `/boo-dx` | `claude plugin install boorails@kurenn` |
| [`rails-audit@kurenn`](#rails-auditkurenn) | 18-dimension Rails project stability audit, severity-ranked report | `claude plugin install rails-audit@kurenn` |
| [`prompt-refiner@kurenn`](#prompt-refinerkurenn) | One-shot task refinement — casual asks → structured technical specs | `claude plugin install prompt-refiner@kurenn` |

Install all four at once:

```bash
claude plugin install roundhouse@kurenn boorails@kurenn rails-audit@kurenn prompt-refiner@kurenn
```

## Plugins (detail)

### `roundhouse@kurenn`

Rails specialist team for Claude Code. Orchestrator on Opus, specialists on Sonnet, prompt-refiner once per task, TDD by default for cross-cutting work, conditional security/database gates.

**Bench-validated 7–34× cheaper** than the comparable [claude-on-rails](https://github.com/kurenn/claude-on-rails) v0.4 swarm across 10 representative Rails tasks ([benchmark](https://github.com/kurenn/roundhouse/blob/main/BENCHMARK.md)).

Skills: `/rails-feature`, `/rails-bugfix`, `/rails-models`, `/rails-controllers`, `/rails-views`, `/rails-services`, `/rails-tests`.

```bash
claude plugin install roundhouse@kurenn
```

- Repo: <https://github.com/kurenn/roundhouse>
- Latest release: <https://github.com/kurenn/roundhouse/releases/latest>

### `boorails@kurenn`

Seven Rails-specific skills covering security, quality gates, implementation safety, root-cause diagnosis, framework operating mode, developer experience, and architectural alternatives. Script-first execution with explicit summary reports.

Skills: `/boo-framework` (orchestrator), `/boo-security`, `/boo-diagnose`, `/boo-quality`, `/boo-safety`, `/boo-alternatives`, `/boo-dx`.

```bash
claude plugin install boorails@kurenn
```

- Repo: <https://github.com/kurenn/boorails>
- Site: <https://kurenn.github.io/boorails/>

> **Migrating from boorails 0.2.x?** All slash-command names changed from `rails-*` to `boo-*` in 2.0. See the [migration guide](https://github.com/kurenn/boorails/blob/main/CHANGELOG.md#200--2026-05-05).

### `rails-audit@kurenn`

Comprehensive Rails project stability audit across 18 dimensions — foundation, domain, specs, deploy/CI, security, money paths, code health, performance, reliability, observability, jobs, data integrity, governance, DX, cost. Read-only — produces a severity-ranked markdown report with a recommended fix sequence.

Skill: `/rails-audit` (with `--quick`, `--standard` (default), `--deep` modes).

```bash
claude plugin install rails-audit@kurenn
```

- Repo: <https://github.com/kurenn/rails-audit>

### `prompt-refiner@kurenn`

Translates casual application requests into detailed, step-by-step technical specifications that AI coding assistants can execute faithfully. Useful as a one-shot refinement at the top of any feature or build task.

Skill: `/prompt-refiner`.

```bash
claude plugin install prompt-refiner@kurenn
```

- Repo: <https://github.com/kurenn/prompt-refiner-skill>

## Updating

To pull the latest manifest from this marketplace and update installed plugins:

```bash
# Refresh the marketplace cache (pulls the latest marketplace.json)
claude plugin marketplace update kurenn

# Update a specific plugin to its latest released version
claude plugin update roundhouse
claude plugin update boorails
claude plugin update rails-audit
claude plugin update prompt-refiner
```

After updating, restart your Claude Code session for the changes to take effect.

## Pairing recommendations

- **Roundhouse + prompt-refiner** — `/rails-feature` invokes `/prompt-refiner` once per task, so these work well together. Install both.
- **Boorails + rails-audit** — both are auditors but operate at different levels. `rails-audit` produces the severity-ranked report across 18 dimensions; boorails skills do focused deep-dives on each (security, safety, quality gates, etc.). Install both for a full review surface.
- **All four together** — production Rails team toolkit: build with roundhouse, refine with prompt-refiner, ship-check with boorails, periodic stability audits with rails-audit.

## Removing the marketplace

```bash
# Uninstall plugins first
claude plugin uninstall roundhouse boorails rails-audit prompt-refiner

# Then remove the marketplace
claude plugin marketplace remove kurenn
```

## Adding more plugins

If you want to suggest a new plugin (yours or someone else's), open an issue or PR adding it to `.claude-plugin/marketplace.json`.

## License

The marketplace metadata is MIT — see [LICENSE](LICENSE). Each listed plugin has its own license.
