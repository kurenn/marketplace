// Interactive demos for each tool. Each demo is a small windowed UI that shows the
// shape of what running that tool feels like. They lean on canned data + light
// stateful interactivity rather than live execution.

const { useState, useEffect, useRef, useMemo } = React;

// ───────────────────────────────────────────────────────────────────────────────
// Shared chrome
// ───────────────────────────────────────────────────────────────────────────────
function Window({ title, subtitle, actions, children, padded = false, style }) {
  return (
    <div className="win" style={style}>
      <div className="win-bar">
        <div className="win-dots">
          <i className="win-dot r" /><i className="win-dot y" /><i className="win-dot g" />
        </div>
        <div className="win-title">{title}</div>
        <div className="win-actions">{actions || subtitle || ""}</div>
      </div>
      <div style={{ padding: padded ? 18 : 0 }}>{children}</div>
    </div>
  );
}

function Bar({ value, color, max = 100 }) {
  return (
    <div style={{ height: 6, background: "var(--line-2)", borderRadius: 999, overflow: "hidden", flex: 1 }}>
      <div style={{
        width: `${Math.min(100, (value / max) * 100)}%`,
        height: "100%",
        background: color || "var(--accent)",
        transition: "width .6s cubic-bezier(.2,.7,.2,1)",
      }} />
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────────
// 1. Rails Audit — severity-ranked report viewer
// ───────────────────────────────────────────────────────────────────────────────
const AUDIT_FINDINGS = [
  { sev: "blocker", count: 3, color: "#c83b2c" },
  { sev: "high",    count: 11, color: "#e08646" },
  { sev: "medium",  count: 24, color: "#c9a64a" },
  { sev: "low",     count: 47, color: "#7a9a72" },
];
const AUDIT_DIMS = [
  ["Foundation",      9, "Ruby 3.4.7 / Rails 8.1.3 — fresh"],
  ["Security",        4, "Brakeman: 2 high-severity SSRF candidates"],
  ["Money paths",     3, "Stripe webhook missing idempotency key"],
  ["Spec stability",  6, "Flake rate 2.4% — `LedgerSpec` worst offender"],
  ["Performance",     5, "3 N+1s on `/dashboard` cluster"],
  ["Background jobs", 7, "Sidekiq retry caps OK; no DLQ on payouts"],
  ["Data integrity",  8, "FK constraints OK; one soft-delete inconsistency"],
  ["Observability",   6, "Sentry wired; no request IDs on workers"],
];
function DemoRailsAudit() {
  const [tab, setTab] = useState("summary");
  const total = AUDIT_FINDINGS.reduce((s, f) => s + f.count, 0);
  return (
    <Window title="rails-audit · report-2026-05-07.md" actions="--standard · 12m 04s · $0.84">
      <div style={{ display: "flex", borderBottom: "1px solid var(--line)", fontFamily: "var(--mono)", fontSize: 12 }}>
        {[["summary","Summary"],["dims","Dimensions"],["punch","Punch list"],["fix","Fix plan"]].map(([k,l]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            background: "transparent",
            border: "none",
            padding: "11px 16px",
            color: tab === k ? "var(--fg)" : "var(--muted)",
            borderBottom: tab === k ? "2px solid var(--accent)" : "2px solid transparent",
            cursor: "pointer",
          }}>{l}</button>
        ))}
      </div>
      <div style={{ padding: 22, fontSize: 13 }}>
        {tab === "summary" && (
          <div style={{ display: "grid", gap: 18 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
              <div className="mono muted" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".14em" }}>Risk score</div>
              <div style={{ fontFamily: "var(--serif)", fontSize: 56, lineHeight: 1, fontWeight: 500 }}>5.8<span className="muted" style={{ fontSize: 22 }}> / 10</span></div>
              <div className="muted" style={{ fontSize: 12 }}>↓ 1.4 since last audit</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
              {AUDIT_FINDINGS.map(f => (
                <div key={f.sev} style={{ borderTop: `2px solid ${f.color}`, paddingTop: 8 }}>
                  <div className="mono muted" style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".12em" }}>{f.sev}</div>
                  <div style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 500 }}>{f.count}</div>
                </div>
              ))}
            </div>
            <div className="muted" style={{ fontSize: 12, lineHeight: 1.6 }}>
              {total} findings across 18 dimensions · evidence cited inline · 4 phases recommended in fix plan.
            </div>
          </div>
        )}
        {tab === "dims" && (
          <div style={{ display: "grid", gap: 8 }}>
            {AUDIT_DIMS.map(([name, score, note]) => (
              <div key={name} style={{ display: "grid", gridTemplateColumns: "150px 1fr 38px", alignItems: "center", gap: 14 }}>
                <div style={{ fontWeight: 500 }}>{name}</div>
                <Bar value={score} max={10} color={score >= 7 ? "#7a9a72" : score >= 5 ? "#c9a64a" : "#c83b2c"} />
                <div className="mono" style={{ fontSize: 12, color: "var(--muted)", textAlign: "right" }}>{score}/10</div>
                <div style={{ gridColumn: "2 / span 2", color: "var(--muted)", fontSize: 12 }}>{note}</div>
              </div>
            ))}
          </div>
        )}
        {tab === "punch" && (
          <div style={{ display: "grid", gap: 10, fontFamily: "var(--mono)", fontSize: 12 }}>
            {[
              ["BLOCKER", "money", "app/services/payments/webhook_handler.rb:42", "Idempotency key missing on Stripe `charge.succeeded` handler — possible double-charge under retry."],
              ["BLOCKER", "data",  "db/schema.rb:118",                              "`payouts.amount` stored as Float — money in floats is a data-loss bug waiting to happen."],
              ["HIGH",    "security", "app/controllers/imports_controller.rb:21",  "User-supplied URL fetched server-side without allowlist (SSRF)."],
              ["HIGH",    "perf",     "app/dashboards/index.html.erb:9",            "N+1 on `current_user.recent_orders.each` — add `.includes(:line_items, :customer)`."],
            ].map(([sev, dim, loc, body], i) => (
              <div key={i} style={{ borderLeft: `3px solid ${sev === "BLOCKER" ? "#c83b2c" : "#e08646"}`, paddingLeft: 12 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
                  <span style={{ color: sev === "BLOCKER" ? "#c83b2c" : "#e08646" }}>{sev}</span>
                  <span className="muted">{dim}</span>
                  <span className="muted">·</span>
                  <span>{loc}</span>
                </div>
                <div style={{ color: "var(--fg)", fontFamily: "var(--sans)", fontSize: 13, marginTop: 4 }}>{body}</div>
              </div>
            ))}
          </div>
        )}
        {tab === "fix" && (
          <ol style={{ paddingLeft: 18, margin: 0, display: "grid", gap: 14, fontSize: 13.5, lineHeight: 1.55 }}>
            <li><b>Phase 1 · Stop the bleeding</b> <span className="muted">(1–2 days)</span><br/><span className="muted">Add idempotency keys, switch money columns to Decimal, allowlist outbound URLs.</span></li>
            <li><b>Phase 2 · Tighten the query budget</b> <span className="muted">(2 days)</span><br/><span className="muted">Resolve N+1s on `/dashboard`, add the missing 3 indexes flagged in Cluster B.</span></li>
            <li><b>Phase 3 · Observability + DLQ</b> <span className="muted">(1 day)</span><br/><span className="muted">Request IDs on workers, dead-letter queue for payouts pipeline.</span></li>
            <li><b>Phase 4 · Spec hygiene</b> <span className="muted">(ongoing)</span><br/><span className="muted">Stabilize `LedgerSpec`, raise critical-path coverage above 80%.</span></li>
          </ol>
        )}
      </div>
    </Window>
  );
}

// ───────────────────────────────────────────────────────────────────────────────
// 2. BooRails — Security audit: live-streaming terminal
// ───────────────────────────────────────────────────────────────────────────────
const BOO_LINES = [
  ["sys", "$ /rails-framework --gemset full --require-lsp"],
  ["ok",  "✔ gem bootstrap         brakeman 6.2.1 · bundler-audit 0.9.2 · rubocop 1.66.1"],
  ["ok",  "✔ lsp                   ruby-lsp v0.18.4 attached"],
  ["info","→ rails-diagnose        scanning 312 models · 184 controllers"],
  ["ok",  "✔ rails-diagnose        no boot-blocking smells"],
  ["info","→ rails-security        OWASP Top-10 mapped to Rails surface"],
  ["warn","! XSS                   1 finding · app/views/posts/_card.html.erb:14 (raw user bio)"],
  ["bad", "✘ SSRF                  1 finding · imports_controller.rb:21 (no allowlist)"],
  ["info","→ rails-implementation-safety"],
  ["warn","! migration              add_column :users, :role w/ default change · risky on prod"],
  ["info","→ rails-quality-gates"],
  ["ok",  "✔ tests · lint · security · smoke   → all gates PASS"],
  ["sys", "─────────────────────────────────────────"],
  ["ok",  "report → tmp/rails-framework-workflow-20260507/00-summary.md"],
];
const BOO_COLOR = {
  ok: "#7a9a72", warn: "#c9a64a", bad: "#c83b2c",
  info: "var(--muted)", sys: "var(--fg)",
};
function DemoBooRails() {
  const [n, setN] = useState(0);
  const [running, setRunning] = useState(true);
  useEffect(() => {
    if (!running) return;
    if (n >= BOO_LINES.length) return;
    const t = setTimeout(() => setN(n + 1), n === 0 ? 240 : 360 + Math.random() * 280);
    return () => clearTimeout(t);
  }, [n, running]);
  const reset = () => { setN(0); setRunning(true); };
  return (
    <Window title="boorails — /rails-framework" actions={running && n < BOO_LINES.length ? "running…" : "complete"}>
      <div className="term-body" style={{
        background: "var(--paper)",
        color: "var(--fg)",
        fontFamily: "var(--mono)",
        fontSize: 12.5,
        lineHeight: 1.7,
        padding: "16px 18px",
        height: 320,
        overflow: "auto",
      }}>
        {BOO_LINES.slice(0, n).map(([kind, line], i) => (
          <div key={i} style={{ color: BOO_COLOR[kind] }}>{line}</div>
        ))}
        {n < BOO_LINES.length && <span className="blink" style={{ color: "var(--accent)" }}>▌</span>}
        {n >= BOO_LINES.length && (
          <div style={{ marginTop: 16 }}>
            <button onClick={reset} className="btn" style={{ padding: "8px 14px", fontSize: 12 }}>Run again</button>
          </div>
        )}
      </div>
    </Window>
  );
}

// ───────────────────────────────────────────────────────────────────────────────
// 3. Prompt Refiner — vague request → structured spec
// ───────────────────────────────────────────────────────────────────────────────
const PROMPTS = [
  "I want to track expenses",
  "Build me a Stripe-style webhook handler",
  "Add login with magic links",
];
const SPECS = {
  "I want to track expenses": [
    "User auth: signup → email verification → session w/ rolling expiry",
    "Entities: Account, Expense (decimal cents), Category, Receipt (file)",
    "Flows: import CSV · split with rules · monthly report",
    "Edge cases: empty state · duplicate import · timezone in totals",
    "Security: Rack::Attack on import · CSP for receipts · PII boundary",
  ],
  "Build me a Stripe-style webhook handler": [
    "Endpoint: POST /webhooks/:provider · raw body · signature verify",
    "Idempotency: fingerprint = (event_id, type, livemode)",
    "Replay window: 5 min · clock skew tolerance",
    "DLQ: Sidekiq batch retry · max 6 · then to PostgreSQL audit table",
    "Observability: trace ID propagated · Sentry breadcrumbs · slow-log",
  ],
  "Add login with magic links": [
    "Token: 32-byte SecureRandom · HMAC pepper · 10-minute TTL",
    "Single-use: deleted on first POST · also expires on password change",
    "Rate limit: 5/email/hour · 20/IP/hour · captcha after threshold",
    "UX: paste-to-login fallback · resend cooldown · expired error state",
    "Email: action_mailer + transactional provider · plain-text fallback",
  ],
};
function DemoPromptRefiner() {
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(0);
  const prompt = PROMPTS[idx];
  useEffect(() => {
    setRevealed(0);
    const lines = SPECS[prompt].length;
    const t = setInterval(() => setRevealed(r => r >= lines ? r : r + 1), 380);
    return () => clearInterval(t);
  }, [prompt]);
  return (
    <Window title="prompt-refiner · /prompt-refiner" actions={`mode: hybrid`} padded>
      <div style={{ display: "grid", gap: 12 }}>
        <div className="mono muted" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".14em" }}>Vague input</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {PROMPTS.map((p, i) => (
            <button key={i} onClick={() => setIdx(i)} className="chip" style={{
              cursor: "pointer",
              background: idx === i ? "var(--accent)" : undefined,
              color: idx === i ? "var(--accent-ink)" : undefined,
              borderColor: idx === i ? "transparent" : undefined,
            }}>{p}</button>
          ))}
        </div>
        <div style={{
          fontFamily: "var(--serif)",
          fontSize: 22,
          fontWeight: 400,
          lineHeight: 1.25,
          padding: "14px 0 4px",
        }}>
          “{prompt}”
        </div>
        <div className="track-row" style={{ marginTop: 4, marginBottom: 8 }}>
          <div className="rail" />
          <div className="mono muted" style={{ fontSize: 11 }}>refine →</div>
          <div className="rail" />
        </div>
        <div className="mono muted" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".14em" }}>Structured spec</div>
        <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 8 }}>
          {SPECS[prompt].map((line, i) => (
            <li key={i} style={{
              opacity: i < revealed ? 1 : 0,
              transform: i < revealed ? "translateY(0)" : "translateY(6px)",
              transition: "all .35s ease",
              display: "grid",
              gridTemplateColumns: "20px 1fr",
              gap: 10,
              fontSize: 13.5,
              lineHeight: 1.5,
              alignItems: "baseline",
            }}>
              <span className="mono" style={{ color: "var(--accent)", fontWeight: 600 }}>0{i+1}</span>
              <span>{line}</span>
            </li>
          ))}
        </ol>
      </div>
    </Window>
  );
}

// ───────────────────────────────────────────────────────────────────────────────
// 4. Railwyrm — Ruby CLI that bootstraps Rails apps with an opinionated stack
// ───────────────────────────────────────────────────────────────────────────────
const WYRM_STEPS = [
  { name: "rails new --database=postgresql --css=tailwind", out: "Ruby 3.3.0 · Rails ~> 8.0.3" },
  { name: "Install RSpec, Dotenv, Ruby LSP",                out: "bin/rails generate rspec:install" },
  { name: "Devise + magic-link (devise-passwordless)",      out: "paranoid · trackable · file mailer" },
  { name: "Brakeman, RuboCop, Bullet, Active Storage",      out: "dev/test gem groups · auto-config" },
  { name: "GitHub Actions CI workflow",                     out: ".github/workflows/ci.yml" },
  { name: "Track features in .railwyrm/features.yml",       out: "feature install · feature sync" },
  { name: "App ready to run",                               out: "bin/dev · bundle exec rspec" },
];
function DemoRailwyrm() {
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    if (step >= WYRM_STEPS.length) return;
    const t = setTimeout(() => setStep(step + 1), 900);
    return () => clearTimeout(t);
  }, [step, paused]);
  const reset = () => setStep(0);
  return (
    <Window title="railwyrm new my_app --devise_magic_link" actions={step >= WYRM_STEPS.length ? "✓ generated" : `step ${step + 1}/${WYRM_STEPS.length}`}>
      <div style={{ padding: 18, display: "grid", gap: 8 }}>
        {WYRM_STEPS.map((s, i) => {
          const state = i < step ? "done" : i === step ? "running" : "pending";
          return (
            <div key={i} style={{
              display: "grid",
              gridTemplateColumns: "20px 1fr auto",
              alignItems: "baseline",
              gap: 12,
              padding: "10px 12px",
              background: state === "running" ? "color-mix(in oklab, var(--accent) 8%, transparent)" : "transparent",
              border: "1px solid",
              borderColor: state === "running" ? "color-mix(in oklab, var(--accent) 35%, transparent)" : "var(--line-2)",
              borderRadius: 8,
              transition: "all .3s ease",
            }}>
              <span className="mono" style={{
                color: state === "done" ? "#7a9a72" : state === "running" ? "var(--accent)" : "var(--muted)",
                fontWeight: 600,
                fontSize: 12,
              }}>
                {state === "done" ? "✓" : state === "running" ? "▶" : "·"}
              </span>
              <div>
                <div style={{ fontWeight: 500, fontSize: 13.5 }}>{s.name}</div>
                {(state === "done" || state === "running") && (
                  <div className="mono muted" style={{ fontSize: 11.5, marginTop: 2 }}>
                    {state === "running" ? <span className="blink">…</span> : s.out}
                  </div>
                )}
              </div>
              <span className="mono muted" style={{ fontSize: 11 }}>
                {state === "done" ? `${(0.4 + i * 0.3).toFixed(1)}s` : ""}
              </span>
            </div>
          );
        })}
        <div style={{ display: "flex", gap: 10, paddingTop: 8 }}>
          <button onClick={() => setPaused(p => !p)} className="btn" style={{ padding: "8px 14px", fontSize: 12 }}>
            {paused ? "resume" : "pause"}
          </button>
          {step >= WYRM_STEPS.length && (
            <button onClick={reset} className="btn" style={{ padding: "8px 14px", fontSize: 12 }}>run again</button>
          )}
        </div>
      </div>
    </Window>
  );
}

// ───────────────────────────────────────────────────────────────────────────────
// 5. Roundhouse — Claude Code plugin simulating a Rails dev team
// ───────────────────────────────────────────────────────────────────────────────
const TIERS = [
  {
    id: "trivial",
    label: "Trivial",
    task: "Fix flash typo",
    desc: "Skips the team entirely. Orchestrator does it inline.",
    specialists: [],
    gates: [],
    cost: "$0.36 · 30s",
  },
  {
    id: "single",
    label: "Single-domain",
    task: "Add Post.recent scope",
    desc: "One specialist, TDD red→green, no auto-gates.",
    specialists: ["models", "tests"],
    gates: [],
    cost: "$0.61 · 2m03s",
  },
  {
    id: "cross",
    label: "Cross-cutting",
    task: "Add admin API + auth + rate limit",
    desc: "Full TDD, parallel specialists, conditional security/db gates.",
    specialists: ["models", "controllers", "services", "tests", "security"],
    gates: ["security", "db"],
    cost: "$2.65 · 8m55s",
  },
];
const ALL_SPECIALISTS = ["models", "controllers", "views", "services", "jobs", "tests", "security", "database", "tailwind"];
function DemoRoundhouse() {
  const [tier, setTier] = useState("cross");
  const t = TIERS.find(x => x.id === tier);
  return (
    <Window title="roundhouse · /rails-feature dispatcher" actions="opus → sonnet">
      <div style={{ padding: 22, display: "grid", gap: 16, minHeight: 320 }}>
        {/* tier picker */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {TIERS.map(x => (
            <button
              key={x.id}
              onClick={() => setTier(x.id)}
              className="mono"
              style={{
                padding: "10px 12px",
                borderRadius: 6,
                border: "1px solid",
                borderColor: x.id === tier ? "var(--accent)" : "var(--line-2)",
                background: x.id === tier ? "color-mix(in oklab, var(--accent) 8%, transparent)" : "transparent",
                color: x.id === tier ? "var(--accent)" : "var(--fg)",
                fontSize: 11.5,
                fontWeight: 600,
                letterSpacing: ".06em",
                textTransform: "uppercase",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              {x.label}
            </button>
          ))}
        </div>

        {/* task */}
        <div style={{ display: "grid", gap: 4 }}>
          <div className="mono muted" style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: ".14em" }}>Task</div>
          <div className="mono" style={{ fontSize: 13.5, color: "var(--fg)" }}>/rails-feature "{t.task}"</div>
          <div className="muted" style={{ fontSize: 12.5, marginTop: 4 }}>{t.desc}</div>
        </div>

        {/* org chart */}
        <div style={{ display: "grid", gap: 10 }}>
          <div style={{
            justifySelf: "center",
            padding: "8px 18px",
            background: "var(--accent)",
            color: "var(--accent-ink)",
            borderRadius: 999,
            fontFamily: "var(--mono)",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: ".1em",
          }}>OPUS · ORCHESTRATOR</div>
          <div className="mono muted" style={{ fontSize: 16, textAlign: "center", lineHeight: 1, marginTop: -4 }}>↓</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
            {ALL_SPECIALISTS.map(s => {
              const on = t.specialists.includes(s);
              return (
                <span key={s} className="mono" style={{
                  padding: "5px 10px",
                  borderRadius: 4,
                  border: "1px solid",
                  borderColor: on ? "color-mix(in oklab, var(--accent) 50%, transparent)" : "var(--line-2)",
                  background: on ? "color-mix(in oklab, var(--accent) 10%, transparent)" : "transparent",
                  color: on ? "var(--fg)" : "var(--muted)",
                  fontSize: 11,
                  opacity: on ? 1 : 0.55,
                  transition: "all .25s ease",
                }}>
                  {on && "● "}rails-{s}
                </span>
              );
            })}
          </div>
        </div>

        {/* gates + cost */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: 12, paddingTop: 6, borderTop: "1px dashed var(--line-2)" }}>
          <div className="mono" style={{ fontSize: 11.5, color: "var(--muted)" }}>
            gates: {t.gates.length ? t.gates.map(g => `✓ ${g}`).join(" · ") : "— none triggered —"}
          </div>
          <div className="mono" style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600 }}>{t.cost}</div>
        </div>
      </div>
    </Window>
  );
}

Object.assign(window, {
  Window,
  DemoRailsAudit, DemoBooRails, DemoPromptRefiner, DemoRailwyrm, DemoRoundhouse,
});
