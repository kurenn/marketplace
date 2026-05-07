// Sections of the landing page.

const TOOLS = [
{
  id: "railwyrm",
  tag: "01 · Forge",
  name: "Railwyrm",
  blurb: "A Ruby CLI that bootstraps Rails apps with an opinionated default stack — PostgreSQL, Tailwind, RSpec, Devise, Brakeman, RuboCop, GitHub Actions — and an interactive wizard for magic-link, passkeys, CI and quality features. New apps in minutes, not days.",
  repo: "kurenn/railwyrm",
  cmd: "railwyrm new",
  Demo: DemoRailwyrm
},
{
  id: "rails-audit",
  tag: "02 · Assess",
  name: "Rails Audit",
  blurb: "An 18-dimension stability audit for the codebase you inherited (or the one you wrote and stopped trusting). Severity-ranked. Evidence cited inline. A fix sequence ordered so each phase unblocks the next.",
  repo: "kurenn/rails-audit",
  cmd: "/rails-audit",
  Demo: DemoRailsAudit
},
{
  id: "boorails",
  tag: "03 · Harden",
  name: "BooRails",
  blurb: "Script-first Rails skills that execute the workflow end-to-end and return evidence. Diagnose → security → safety → quality gates. Not suggestions — runs.",
  repo: "kurenn/boorails",
  cmd: "/rails-framework",
  Demo: DemoBooRails
},
{
  id: "prompt-refiner",
  tag: "04 · Translate",
  name: "Prompt Refiner",
  blurb: "Casual intent in, executable spec out. Expands “add login” into auth flows, rate limits, validation rules and edge cases — so the agent that builds it isn't silently guessing.",
  repo: "kurenn/prompt-refiner-skill",
  cmd: "/prompt-refiner",
  Demo: DemoPromptRefiner
},
{
  id: "roundhouse",
  tag: "05 · Dispatch",
  name: "Roundhouse",
  blurb: "A Claude Code plugin that simulates a Rails dev team. An Opus orchestrator triages each task into trivial / single-domain / cross-cutting, then dispatches Sonnet specialists with TDD and conditional gates. Benchmarked 7– 34× cheaper than the comparable swarm.",
  repo: "kurenn/roundhouse",
  cmd: "/rails-feature",
  Demo: DemoRoundhouse
}];


function Mark() {
  return (
    <span className="mark">
      <span className="mark-glyph"><span>R</span></span>
      <span>RAILS&nbsp;TOOLKIT</span>
    </span>);

}

function Nav() {
  return (
    <div className="nav">
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 28px" }}>
        <Mark />
        <nav style={{ display: "flex", gap: 24, fontSize: 13, fontFamily: "var(--mono)" }}>
          <a href="#manifesto">Manifesto</a>
          <a href="#workflow">Workflow</a>
          <a href="#tools">Tools</a>
          <a href="#install">Install</a>
          <a href="#about">About</a>
        </nav>
        <a href="https://github.com/kurenn" target="_blank" rel="noreferrer" className="mono muted" style={{ fontSize: 13 }}>github.com/kurenn ↗</a>
      </div>
    </div>);

}

function Hero({ variant }) {
  // variant: "text" | "ascii" | "panel"
  return (
    <section data-screen-label="01 Hero" id="hero" style={{ paddingTop: 80, paddingBottom: 60 }}>
      <div className="container">
        <div className="track-row" style={{ marginBottom: 36 }}>
          <span className="eyebrow"><span className="accent">●</span> RAILS · AI · 2026 — by Abraham Kuri (kurenn)</span>
          <div className="rail-thin" />
        </div>

        {variant === "text" &&
        <>
            <h1 className="h-display display" style={{ margin: 0 }}>
              A workflow for <em>Rails</em>,<br />
              built for the era<br />
              of <em>AI builders.</em>
            </h1>
            <div className="hero-text-grid" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 80, marginTop: 60, alignItems: "end" }}>
              <p className="hero-text-lede" style={{ fontSize: 22, lineHeight: 1.4, color: "var(--fg)", maxWidth: "32ch", margin: 0 }}>
                Fifteen years of Rails, distilled into a workflow. Five tools, one line, and Claude on the controls — the way I'd build today if I were starting from zero, and the way I build now after shipping for a decade and a half.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", flexWrap: "wrap" }}>
                <a href="#manifesto" className="btn btn-primary">Read the manifesto →</a>
                <a href="#install" className="btn">Install</a>
              </div>
            </div>
          </>
        }

        {variant === "ascii" &&
        <>
            <div className="mono" style={{ fontSize: 11, color: "var(--muted)", marginBottom: 18, whiteSpace: "pre", lineHeight: 1.2 }}>
{`  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
  │  FORGE  │ ─→ │ ASSESS  │ ─→ │ HARDEN  │ ─→ │ REFINE  │ ─→ │DISPATCH │
  └─────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘`}
            </div>
            <h1 className="h-display display" style={{ margin: 0, fontFamily: "var(--mono)", fontSize: "clamp(40px, 6.4vw, 88px)", letterSpacing: "-0.02em", fontWeight: 500 }}>
              Five tools.<br />
              One assembly line.<br />
              <span style={{ color: "var(--accent)" }}>Rails, on rails.</span>
            </h1>
            <p style={{ fontSize: 18, lineHeight: 1.55, maxWidth: "60ch", marginTop: 28, color: "var(--muted)" }}>
              An opinionated pipeline for shipping Rails apps with AI agents — bootstrap, assess, harden, refine and dispatch. Each piece does one thing well; together they let one engineer punch like ten.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
              <a href="#manifesto" className="btn btn-primary">Read the manifesto</a>
              <a href="#tools" className="btn">See the tools</a>
            </div>
          </>
        }

        {variant === "panel" &&
        <div className="hero-panel-grid" style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 56, alignItems: "center" }}>
            <div>
              <h1 className="h-display display" style={{ margin: 0, fontSize: "clamp(44px, 6vw, 92px)" }}>
                Solo&nbsp;developer.<br />
                Structured&nbsp;team.<br />
                <span style={{ color: "var(--accent)" }}>Real&nbsp;Rails&nbsp;apps.</span>
              </h1>
              <p style={{ fontSize: 18, lineHeight: 1.55, maxWidth: "52ch", marginTop: 28, color: "var(--muted)" }}>
                A toolkit of four Claude/Codex skills and one Ruby CLI that give you the audit-build-ship workflow of an experienced team — without the team.
              </p>
              <div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
                <a href="#manifesto" className="btn btn-primary">Read the manifesto</a>
                <a href="#install" className="btn">Install all five</a>
              </div>
            </div>
            <DemoRoundhouse />
          </div>
        }

        <div className="track-row" style={{ marginTop: 64 }}>
          <div className="tie" /><div className="tie" /><div className="tie" /><div className="rail" />
          <span className="mono muted" style={{ fontSize: 11 }}>SCROLL ↓</span>
          <div className="rail" /><div className="tie" /><div className="tie" /><div className="tie" />
        </div>
      </div>
    </section>);

}

function Manifesto({ density }) {
  return (
    <section id="manifesto" data-screen-label="02 Manifesto" style={{ background: "var(--paper)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
      <div className="container-sm">
        <div className="eyebrow" style={{ marginBottom: 18 }}>I · The Manifesto</div>
        <h2 className="h-section serif" style={{ margin: "0 0 36px" }}>
          Most AI workflows stop at <em>suggestions.</em><br />
          That's not enough anymore.
        </h2>
        <div className="dropcap" style={{ fontSize: density === "dense" ? 17 : 19, lineHeight: 1.65, color: "var(--fg)", maxWidth: "62ch" }}>
          For fifteen years I've been writing Ruby on Rails. Long enough to remember when a senior engineer was someone who'd seen what happens to an app with no test suite, no migrations strategy, no idea what a callback chain costs. The trade was always the same: experience, paid in production scars, in exchange for the right to ship with confidence.
        </div>
        <p style={{ fontSize: density === "dense" ? 17 : 19, lineHeight: 1.65, color: "var(--fg)", maxWidth: "62ch", marginTop: 28 }}>
          AI changes the trade. A solo developer in 2026 can move at the speed of a small team — but only if they stop using AI like a fancier autocomplete and start running it like a workforce. Models are not engineers. They're <em>workers</em>. They need scaffolding: a forge that lays the rails, an audit that calibrates risk, a pipeline that catches the obvious mistakes, a translator between vague intent and executable spec, and a dispatcher that runs the team that builds it.
        </p>
        <p style={{ fontSize: density === "dense" ? 17 : 19, lineHeight: 1.65, color: "var(--fg)", maxWidth: "62ch", marginTop: 24 }}>
          That's what this toolkit is. Four Claude Code skills and one Ruby CLI — each the distilled version of a thing I'd previously do by hand, slowly, on every Rails project I touched. Plug them in and you stop doing AI by improvisation. You start running a crew that just <em>works for you.</em>
        </p>
        <p style={{ fontSize: density === "dense" ? 17 : 19, lineHeight: 1.65, color: "var(--fg)", maxWidth: "62ch", marginTop: 24, fontStyle: "italic", fontFamily: "var(--serif)" }}>
          One developer. The leverage of a team. The same Rails you've been writing for years.
        </p>
        <div style={{ marginTop: 48, display: "flex", alignItems: "center", gap: 14 }}>
          <span className="mono muted" style={{ fontSize: 12 }}>— Abraham Kuri (@kurenn) · 15 years of Rails</span>
        </div>
      </div>
    </section>);

}

function WorkflowDiagram() {
  return (
    <section id="workflow" data-screen-label="03 Workflow">
      <div className="container">
        <div className="pipeline-head" style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 24, marginBottom: 36 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 12 }}>II · The Pipeline</div>
            <h2 className="h-section" style={{ margin: 0, maxWidth: "16ch" }}>
              Five stations.<br />One direction.
            </h2>
          </div>
          <p className="muted" style={{ maxWidth: "44ch", fontSize: 16, lineHeight: 1.55 }}>
            Each tool does one thing well. The output of the upstream stage is the input to the next. Use them à la carte; or run the whole line and watch the work move down the track.
          </p>
        </div>

        <div className="workflow">
          {TOOLS.map((t, i) =>
          <div key={t.id} className="wf-cell">
              <div className="wf-num">{t.tag}</div>
              <div className="wf-name">{t.name}</div>
              <div className="wf-desc">{t.blurb.split(".")[0]}.</div>
              <div className="track-row" style={{ marginTop: "auto" }}>
                <div className="tie" /><div className="rail-thin" />
                {i < TOOLS.length - 1 && <span className="mono accent" style={{ color: "var(--accent)", fontSize: 12 }}>→</span>}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

}

function ToolsSection() {
  return (
    <section id="tools" data-screen-label="04 Tools">
      <div className="container">
        <div className="eyebrow" style={{ marginBottom: 12 }}>III · The Toolkit</div>
        <h2 className="h-section" style={{ margin: "0 0 8px" }}>The five.</h2>
        <p className="muted" style={{ maxWidth: "60ch", fontSize: 17, lineHeight: 1.5 }}>
          Each one is a Claude Code / Codex skill. Each one is on GitHub. Each one is open source. Hover, click, run the embedded demos.
        </p>
        <div className="tools-list" style={{ marginTop: 48 }}>
          {TOOLS.map((t) => {
            const Demo = t.Demo;
            return (
              <div key={t.id} className="tool" id={`tool-${t.id}`}>
                <div className="tool-info">
                  <div className="tool-tag">{t.tag}</div>
                  <h3 className="tool-name" style={{ margin: 0 }}>{t.name}</h3>
                  <p className="tool-blurb">{t.blurb}</p>
                  <div className="tool-meta">
                    <span className="chip"><span className="dot" /> github.com/{t.repo}</span>
                    <span className="chip mono">{t.cmd}</span>
                  </div>
                  <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                    <a className="btn" href={`https://github.com/${t.repo}`} target="_blank" rel="noreferrer">Repo ↗</a>
                    <a className="btn btn-ghost" href="#install">Install</a>
                  </div>
                </div>
                <div className="tool-demo">
                  <div style={{ width: "100%" }}>
                    <Demo />
                  </div>
                </div>
              </div>);

          })}
        </div>
      </div>
    </section>);

}

function CodeDemo() {
  return (
    <section id="terminal" data-screen-label="05 Terminal" style={{ background: "var(--paper)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
      <div className="container-md">
        <div className="eyebrow" style={{ marginBottom: 12 }}>IV · A morning, end-to-end</div>
        <h2 className="h-section" style={{ margin: "0 0 24px", maxWidth: "20ch" }}>
          From <em>rails new</em> to a green PR — same morning, same Rails.
        </h2>
        <Window title="~/work · zsh" actions="kurenn@studio">
          <div className="code" style={{ padding: "20px 22px", whiteSpace: "pre", overflowX: "auto", lineHeight: 1.7, color: "var(--fg)" }}>
{`$ railwyrm new my_app --devise_magic_link  `}<span className="com">{`# Postgres · Tailwind · RSpec · Devise · CI`}</span>{`
  → my_app/  (Ruby 3.3 · Rails ~> 8.0 · magic links wired)

$ cd my_app
$ /rails-audit --quick                          `}<span className="com">{`# baseline, ~$0.10`}</span>{`
  → 0 blockers · 3 medium · ready to build on

$ /prompt-refiner "add team accounts with invites + roles"
  → spec.md  (Account · Membership · Invite · admin/member roles)

$ /rails-feature spec.md                       `}<span className="com">{`# roundhouse dispatch`}</span>{`
  ▶ opus triage → cross-cutting · TDD · security gate ON
  ▶ models · controllers · request specs · pundit policies
  ✓ all gates green  · branch: team-accounts-2026-05-07

$ /rails-framework                               `}<span className="com">{`# boorails final pass`}</span>{`
  ✓ diagnose · ✓ security · ✓ safety · ✓ quality-gates

$ gh pr create --fill
  → `}<span className="kw">https://github.com/kurenn/my_app/pull/1</span>{`

$ `}<span className="blink" style={{ color: "var(--accent)" }}>▌</span>
            </div>
        </Window>
      </div>
    </section>);

}

function About() {
  return (
    <section id="about" data-screen-label="06 About">
      <div className="container-sm">
        <div className="eyebrow" style={{ marginBottom: 12 }}>V · Who built this</div>
        <h2 className="h-section" style={{ margin: "0 0 28px" }}>
          15 years on the rails.
        </h2>
        <p style={{ fontSize: 19, lineHeight: 1.65, color: "var(--fg)", maxWidth: "60ch" }}>
          Abraham Kuri (<span className="mono">@kurenn</span>) — Mexico City. Co-founder of Icalia Labs. I shipped my first Rails app in 2010 and have spent the years since auditing, refactoring and resurrecting Rails codebases for teams of two and teams of two hundred.
        </p>
        <p style={{ fontSize: 19, lineHeight: 1.65, color: "var(--fg)", maxWidth: "60ch", marginTop: 18 }}>
          This toolkit is the residue of that work. Every dimension in <span className="mono">rails-audit</span> caught a real production fire on a real project. Every BooRails skill exists because I was tired of doing it by hand. The Prompt Refiner is what I wish I'd had every time a non-technical founder said “I want users to log in.”
        </p>
        <div style={{ display: "flex", gap: 16, marginTop: 32, flexWrap: "wrap" }}>
          <a href="https://github.com/kurenn" target="_blank" rel="noreferrer" className="btn">github.com/kurenn ↗</a>
          <a href="#install" className="btn btn-primary">Install the toolkit</a>
        </div>
      </div>
    </section>);

}

function Install() {
  return (
    <section id="install" data-screen-label="07 Install" style={{ background: "var(--paper)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
      <div className="container-md">
        <div className="eyebrow" style={{ marginBottom: 12 }}>VI · Get on the line</div>
        <h2 className="h-section" style={{ margin: "0 0 28px" }}>One marketplace. Five plugins.</h2>
        <Window title="claude code · plugin marketplace" actions="">
          <div className="code" style={{ padding: "22px 24px", whiteSpace: "pre", overflowX: "auto", lineHeight: 1.85, color: "var(--fg)" }}>
{`$ `}<span className="kw">claude plugin marketplace add</span>{` kurenn/marketplace      `}<span className="com">{`# one-time per machine`}</span>{`

$ `}<span className="kw">claude plugin install</span>{` rails-audit@kurenn
$ `}<span className="kw">claude plugin install</span>{` boorails@kurenn
$ `}<span className="kw">claude plugin install</span>{` prompt-refiner@kurenn
$ `}<span className="kw">claude plugin install</span>{` roundhouse@kurenn

`}<span className="com">{`# Or install all four at once:`}</span>{`
$ `}<span className="kw">claude plugin install</span>{` roundhouse@kurenn boorails@kurenn rails-audit@kurenn prompt-refiner@kurenn

`}<span className="com">{`# Railwyrm is a Ruby CLI — clone and run from the repo:`}</span>{`
$ `}<span className="kw">git clone</span>{` https://github.com/kurenn/railwyrm
$ `}<span className="kw">cd</span>{` railwyrm `}<span className="kw">&&</span>{` bundle install
$ bundle exec ruby exe/railwyrm new my_app --devise_magic_link

`}<span className="com">{`# Restart Claude Code. /rails-audit, /boo-framework, /prompt-refiner`}</span>{`
`}<span className="com">{`# and /rails-feature now appear in the slash menu.`}</span>
            </div>
        </Window>
        <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
          <a href="https://github.com/kurenn/marketplace" target="_blank" rel="noreferrer" className="btn btn-primary">Open the marketplace ↗</a>
          <a href="#tools" className="btn">Pick one tool to start</a>
        </div>
      </div>
    </section>);

}

function FAQ() {
  const items = [
  ["Do I need all five?",
  "No. Each tool stands alone. The most common starting point is rails-audit on a codebase you don't fully trust, then prompt-refiner the next time someone hands you a vague request. Roundhouse is what ties them together once you have two or more installed."],
  ["What models / clients does this support?",
  "Claude Code only. The skills, plugins and CLI are built specifically against Claude's Sonnet/Opus models and Claude Code's plugin and slash-command primitives. No API key gymnastics — they use your existing Claude Code session."],
  ["Is this a replacement for Brakeman / RuboCop / etc.?",
  "Emphatically no. Rails Audit invokes Brakeman, bundler-audit, RuboCop, reek, rails_best_practices, simplecov and friends. The point is that a 400-warning brakeman dump is not a report — it's evidence. The toolkit synthesizes evidence into something you'll actually act on."],
  ["What does it cost to run?",
  "Sonnet/Opus token costs only — no subscription, no SaaS, no telemetry. A --quick rails-audit runs around $0.05–0.20. A full --standard pass on a 30–50 KLOC monolith is $0.20–1.50. Roundhouse benchmarks 7–34× cheaper than the comparable swarm — a trivial fix runs about $0.36, a cross-cutting feature about $2.65."],
  ["Why Rails specifically?",
  "Because this is what I know cold. Fifteen years of Rails means fifteen years of knowing exactly what an N+1 looks like at 4am, where the Stripe-webhook idempotency bug always lives, why your Sidekiq retry policy is probably wrong. The toolkit encodes that, not generic LLM intuition."],
  ["Can I extend it?",
  "Yes — every repo takes issues and PRs. The dimensions in rails-audit, the skill prompts in BooRails, the question batches in Prompt Refiner — all just markdown."]];

  return (
    <section id="faq" data-screen-label="08 FAQ">
      <div className="container-sm">
        <div className="eyebrow" style={{ marginBottom: 12 }}>VII · Questions</div>
        <h2 className="h-section" style={{ margin: "0 0 28px" }}>FAQ.</h2>
        <div>
          {items.map(([q, a], i) =>
          <details key={i}>
              <summary>
                <span className="q">{q}</span>
                <span className="plus" />
              </summary>
              <div className="a">{a}</div>
            </details>
          )}
        </div>
      </div>
    </section>);

}

function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--line)", paddingTop: 64, paddingBottom: 80, background: "var(--paper)" }}>
      <div className="container">
        <div className="track-line" style={{ marginBottom: 56 }} />
        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 40 }}>
          <div>
            <Mark />
            <p className="muted" style={{ marginTop: 14, fontSize: 14, lineHeight: 1.55, maxWidth: "32ch" }}>
              Rails &amp; AI engineering, pipelined. Five MIT-licensed open-source skills by Abraham Kuri.
            </p>
          </div>
          <div>
            <div className="eyebrow" style={{ marginBottom: 12 }}>Repos</div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 8, fontFamily: "var(--mono)", fontSize: 13 }}>
              {TOOLS.map((t) =>
              <li key={t.id}><a href={"https://github.com/" + t.repo} target="_blank" rel="noreferrer" className="muted">{t.repo} ↗</a></li>
              )}
              <li><a href="https://github.com/kurenn/marketplace" target="_blank" rel="noreferrer" className="muted">kurenn/marketplace ↗</a></li>
            </ul>
          </div>
          <div>
            <div className="eyebrow" style={{ marginBottom: 12 }}>This site</div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 8, fontFamily: "var(--mono)", fontSize: 13 }}>
              <li><a href="#manifesto">Manifesto</a></li>
              <li><a href="#workflow">Workflow</a></li>
              <li><a href="#tools">Tools</a></li>
              <li><a href="#install">Install</a></li>
              <li><a href="#about">About</a></li>
            </ul>
          </div>
          <div>
            <div className="eyebrow" style={{ marginBottom: 12 }}>Author</div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 8, fontFamily: "var(--mono)", fontSize: 13 }}>
              <li><a href="https://github.com/kurenn" target="_blank" rel="noreferrer">github.com/kurenn ↗</a></li>
              <li><a href="https://twitter.com/kurenn" target="_blank" rel="noreferrer">@kurenn</a></li>
            </ul>
          </div>
        </div>
        <div className="rule" style={{ marginTop: 56, paddingTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16, color: "var(--muted)", fontSize: 12, fontFamily: "var(--mono)" }}>
          <div>© 2026 Abraham Kuri · MIT licensed</div>
          <div>Built in Mexico City · Hosted on kurenn/marketplace</div>
        </div>
      </div>
    </footer>);

}

Object.assign(window, {
  TOOLS, Nav, Hero, Manifesto, WorkflowDiagram, ToolsSection,
  CodeDemo, About, Install, FAQ, Footer
});