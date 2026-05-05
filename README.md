# kurenn — Claude Code plugin marketplace

Plugins for Rails developers using Claude Code, by [Abraham Kuri](https://github.com/kurenn).

## Add this marketplace

```bash
claude plugin marketplace add github:kurenn/marketplace
```

After that, you can install any plugin listed below by name.

## Plugins

### roundhouse

Rails specialist team for Claude Code. Orchestrator on Opus, specialists on Sonnet, prompt-refiner once per task, TDD by default for cross-cutting work, conditional security/database gates.

**Bench-validated 7–34× cheaper** than the comparable [claude-on-rails](https://github.com/kurenn/claude-on-rails) v0.4 swarm across 10 representative Rails tasks.

```bash
claude plugin install roundhouse@kurenn
```

- Repo: <https://github.com/kurenn/roundhouse>
- Bench: <https://github.com/kurenn/roundhouse/blob/main/BENCHMARK.md>
- Latest release: <https://github.com/kurenn/roundhouse/releases/latest>

## Updates

Once you've added this marketplace, pull updates with:

```bash
claude plugin marketplace update kurenn
```

## Adding more plugins

If you want to suggest a new plugin (yours or someone else's), open an issue or PR adding it to `.claude-plugin/marketplace.json`.

## License

The marketplace metadata is MIT — see [LICENSE](LICENSE). Each listed plugin has its own license.
