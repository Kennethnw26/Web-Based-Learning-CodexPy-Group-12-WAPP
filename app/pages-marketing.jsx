/* global React, Icon, SnakeHero, ProgressOrb, MODULES, INITIAL_USER */
// User-facing pages: Landing, Dashboard, Modules list, Module detail

const { useState: useStateP, useEffect: useEffectP, useRef: useRefP, useMemo: useMemoP } = React;

// =================== LANDING PAGE =============================================

function LandingPage({ setPage, lens }) {
  const [scroll, setScroll] = useStateP(0);
  const ref = useRefP(null);

  useEffectP(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const max = Math.max(1, el.scrollHeight - el.clientHeight);
      setScroll(Math.min(1, el.scrollTop / max));
    };
    const el = ref.current;
    el?.addEventListener("scroll", onScroll);
    return () => el?.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={ref} className="page-enter" style={{ flex: 1, overflowY: "auto", height: "100vh" }}>
      {/* Marketing top bar */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 48px", position: "sticky", top: 0, zIndex: 5,
        background: "color-mix(in oklab, var(--bg) 92%, transparent)", backdropFilter: "blur(10px)",
        borderBottom: "1px solid var(--hairline)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 600, letterSpacing: "-0.02em" }}>
          <span style={{ width: 26, height: 26, borderRadius: 7, background: "var(--ink)", color: "var(--py-yellow)", display: "grid", placeItems: "center", fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 14 }}>{"</"}</span>
          Codex<span style={{ fontFamily: "var(--font-mono)", background: "var(--py-yellow)", color: "var(--py-blue-d)", padding: "1px 6px", borderRadius: 5, marginLeft: 2 }}>Py</span>
        </div>
        <nav style={{ display: "flex", gap: 28, fontSize: 14, color: "var(--ink-2)" }}>
          <a href="#modules">Modules</a>
          <a href="#audiences">Who it's for</a>
          <a href="#lens">Lens accessibility</a>
          <a href="#testimonials">Reviews</a>
        </nav>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-ghost" onClick={() => setPage("login")}>Sign in</button>
          <button className="btn btn-yellow" onClick={() => setPage("dashboard")}>Start learning</button>
        </div>
      </header>

      {/* HERO */}
      <section style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 40, padding: "72px 48px 48px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ paddingTop: 40, minWidth: 0 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 12px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 999, fontSize: 12.5, color: "var(--muted)", marginBottom: 22 }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--success)" }} />
            New: Lens — accessibility tools built into every screen.
          </div>
          <h1 className="h-display" style={{ margin: 0 }}>
            Learn Python.<br />
            <span style={{ color: "var(--py-blue-d)" }}>One coil at a time.</span>
          </h1>
          <p style={{ fontSize: 19, lineHeight: 1.55, color: "var(--muted)", marginTop: 22, maxWidth: 480 }}>
            CodexPy is a guided path through the fundamentals — from your first <code style={{ fontFamily: "var(--font-mono)", background: "var(--bg-sunk)", padding: "2px 7px", borderRadius: 5, fontSize: 16 }}>print("hi")</code> to async patterns, with practice and quizzes that actually stick.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
            <button className="btn btn-yellow btn-lg" onClick={() => setPage("dashboard")}>
              Start the first module
              <Icon name="arrowRight" size={16} />
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => setPage("module")}>
              <Icon name="play" size={13} /> Preview a lesson
            </button>
          </div>
          <div style={{ marginTop: 36, display: "flex", gap: 32, color: "var(--muted)", fontSize: 13 }}>
            <Stat n="12" l="curated modules" />
            <Stat n="120+" l="practice quizzes" />
            <Stat n="4.8★" l="learner rating" />
          </div>
        </div>

        <div style={{ position: "relative", aspectRatio: "1 / 1", minHeight: 420, minWidth: 0 }}>
          {lens.motion === "calm" ? (
            <SnakePoster />
          ) : (
            <SnakeHero scroll={scroll} />
          )}
          {/* Soft yellow halo */}
          <div style={{ position: "absolute", inset: "10% 8%", background: "radial-gradient(ellipse at center, rgba(255,212,59,0.18) 0%, transparent 65%)", pointerEvents: "none", zIndex: -1 }} />
          {/* 3D motion annotation */}
          <MotionTag>3D · WebGL · Idle: slow rotation + breathing · Scroll: uncoils + parallax</MotionTag>
        </div>
      </section>

      {/* AUDIENCE STRIP */}
      <section id="audiences" style={{ padding: "32px 48px 72px", maxWidth: 1280, margin: "0 auto" }}>
        <div className="eyebrow" style={{ marginBottom: 16 }}>For three kinds of learner</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
          <AudienceCard
            tag="School"
            age="Ages 13–17"
            title="Friendly, encouraging, never juvenile."
            body="Comfortable type sizes, jargon-free copy, badges that feel earned. Calm-mode strips every animation if focus is hard."
            tone="yellow"
          />
          <AudienceCard
            tag="University"
            age="Ages 18–25"
            title="Efficient, mobile-aware, intermediate-ready."
            body="OOP, file handling, libraries. Keyboard shortcuts everywhere. Mark complete in 1 keystroke."
            tone="blue"
          />
          <AudienceCard
            tag="Self-learner"
            age="Career changers"
            title="Clean reading layouts. Real, runnable examples."
            body="Every snippet is correct, copyable Python. Progress, certificates, and a portable transcript."
            tone="dark"
          />
        </div>
      </section>

      {/* FEATURED MODULES */}
      <section id="modules" style={{ padding: "8px 48px 80px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", marginBottom: 18 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 6 }}>Featured modules</div>
            <h2 className="h1">From your first variable to async patterns.</h2>
          </div>
          <button className="btn btn-secondary" onClick={() => setPage("modules")}>Browse all 12 <Icon name="arrowRight" size={14} /></button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 8 }}>
          {MODULES.slice(0, 6).map((m, i) => (
            <ModuleCardTilt key={m.id} m={m} onClick={() => setPage("module")} />
          ))}
        </div>
      </section>

      {/* LENS SHOWCASE */}
      <section id="lens" style={{ padding: "0 48px 80px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ background: "var(--ink)", color: "var(--bg)", borderRadius: 24, padding: 48, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 11px", background: "rgba(255,212,59,0.15)", color: "var(--py-yellow)", borderRadius: 999, fontSize: 12, fontWeight: 600, marginBottom: 18 }}>
              <Icon name="accessibility" size={13} /> Lens
            </div>
            <h2 style={{ fontSize: 40, lineHeight: 1.1, letterSpacing: "-0.025em", fontWeight: 600, margin: 0 }}>
              Built for every kind of learner.
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.5, color: "#C2C5CC", marginTop: 18, maxWidth: 460 }}>
              Lens is our integrated accessibility companion. One button opens a panel that adapts the entire app to how <em>you</em> learn — dyslexia-friendly type, color-blind palettes, audio narration, ASL avatars on video lessons, focus magnifier, calm motion mode, and more.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginTop: 24, maxWidth: 460 }}>
              {[
                ["type", "Dyslexia font"],
                ["contrast", "High contrast"],
                ["eye", "CB palettes"],
                ["headphones", "Audio narration"],
                ["handRaise", "ASL avatar"],
                ["captions", "Captions"],
                ["target", "Focus magnifier"],
                ["keyboard", "KB hints"],
              ].map(([ic, t]) => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.5, color: "#E2E4E8" }}>
                  <span style={{ color: "var(--py-yellow)" }}><Icon name={ic} size={15} /></span>
                  {t}
                </div>
              ))}
            </div>
          </div>
          <LensPreviewCard />
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" style={{ padding: "0 48px 80px", maxWidth: 1280, margin: "0 auto" }}>
        <div className="eyebrow" style={{ marginBottom: 16 }}>What learners say</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          <Testimonial
            q="The 3D progress orb sounds like a gimmick but it actually pulls me back every day. Watching it fill up is the only streak tracker that's worked for me."
            who="Yusra A."
            sub="University student, KL"
          />
          <Testimonial
            q="Lens has Atkinson Hyperlegible and ASL avatars built in. My 14-year-old uses it without help. Worth the subscription on day one."
            who="Daniel R."
            sub="Parent, school student"
          />
          <Testimonial
            q="As a career changer, I needed real Python — not toy snippets. The Lists & Dictionaries module clicked something I'd been hitting my head on for weeks."
            who="Priya M."
            sub="Self-learner, Selangor"
          />
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "0 48px 120px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ background: "var(--py-yellow)", borderRadius: 24, padding: "64px 48px", textAlign: "center" }}>
          <h2 className="h1" style={{ color: "var(--py-blue-d)", fontSize: 48 }}>Ready to write your first <span style={{ fontFamily: "var(--font-mono)" }}>print("Hello")</span>?</h2>
          <p style={{ fontSize: 17, color: "var(--py-blue-d)", opacity: 0.85, marginTop: 14, maxWidth: 520, margin: "14px auto 0" }}>
            Free to start. No credit card. Sign in and the snake will be waiting.
          </p>
          <button className="btn btn-lg" style={{ background: "var(--ink)", color: "var(--py-yellow)", marginTop: 30 }} onClick={() => setPage("dashboard")}>
            Start the first module <Icon name="arrowRight" size={16} />
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

const Stat = ({ n, l }) => (
  <div>
    <div style={{ fontSize: 26, fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.02em" }}>{n}</div>
    <div style={{ fontSize: 13 }}>{l}</div>
  </div>
);

const AudienceCard = ({ tag, age, title, body, tone }) => {
  const bg = tone === "yellow" ? "var(--py-yellow)" : tone === "blue" ? "var(--py-blue)" : "var(--ink)";
  const fg = tone === "yellow" ? "var(--py-blue-d)" : tone === "blue" ? "white" : "var(--py-yellow)";
  return (
    <div className="card card-hover" style={{ padding: 28, display: "flex", flexDirection: "column", gap: 14, minHeight: 230 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 999, background: bg, color: fg, fontSize: 12, fontWeight: 600 }}>{tag}</div>
        <div style={{ fontSize: 12, color: "var(--muted)" }}>{age}</div>
      </div>
      <h3 style={{ fontSize: 19, lineHeight: 1.3, fontWeight: 600, letterSpacing: "-0.015em", margin: 0 }}>{title}</h3>
      <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.55, margin: 0 }}>{body}</p>
    </div>
  );
};

// 3D-tilt module card
function ModuleCardTilt({ m, onClick }) {
  const ref = useRefP(null);
  const onMove = (e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const tilt = 8;
    el.style.transform = `perspective(900px) rotateY(${(px - 0.5) * tilt}deg) rotateX(${-(py - 0.5) * tilt}deg) translateZ(0)`;
  };
  const onLeave = () => {
    const el = ref.current; if (!el) return;
    el.style.transform = "perspective(900px) rotateY(0) rotateX(0)";
  };
  return (
    <div ref={ref}
      className="card card-hover"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      style={{ padding: 22, cursor: "pointer", transition: "transform .25s var(--easing), box-shadow .25s var(--easing)" }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <ModIcon color={m.color} icon={m.icon} />
        <span className={"tag " + diffClass(m.difficulty)}>{m.difficulty}</span>
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em", margin: 0 }}>{m.title}</h3>
      <p style={{ color: "var(--muted)", fontSize: 13.5, marginTop: 6, marginBottom: 16, lineHeight: 1.5 }}>{m.blurb}</p>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--muted)" }}>
        <span>{m.lessons} lessons</span>
        <span>{m.duration}</span>
      </div>
    </div>
  );
}

const diffClass = (d) => d === "Beginner" ? "beg dot" : d === "Intermediate" ? "int dot" : "adv dot";

const ModIcon = ({ color, icon }) => (
  <div style={{
    width: 40, height: 40, borderRadius: 10,
    background: `color-mix(in oklab, ${color} 14%, var(--surface))`,
    color: color, display: "grid", placeItems: "center"
  }}>
    <Icon name={icon} size={18} stroke={1.7} />
  </div>
);

const SnakePoster = () => (
  <div style={{
    width: "100%", height: "100%", borderRadius: 24,
    background: "radial-gradient(ellipse at center, rgba(255,212,59,0.16), transparent 60%), var(--bg-sunk)",
    display: "grid", placeItems: "center", border: "1px dashed var(--border-2)"
  }}>
    <div style={{ textAlign: "center", color: "var(--muted)", padding: 20 }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 14 }}>// 3D scene paused — calm mode</div>
      <div style={{ fontSize: 13, marginTop: 8 }}>A coiled blue & yellow Python snake circles a floating "Py" wordmark.</div>
    </div>
  </div>
);

const MotionTag = ({ children }) => (
  <div style={{
    position: "absolute", bottom: 12, left: 12,
    fontFamily: "var(--font-mono)", fontSize: 11,
    padding: "5px 9px", background: "rgba(15,23,41,0.78)", color: "rgba(255,255,255,0.85)",
    borderRadius: 6, letterSpacing: ".02em"
  }}>{children}</div>
);

const Testimonial = ({ q, who, sub }) => (
  <div className="card" style={{ padding: 26 }}>
    <div style={{ display: "flex", gap: 2, color: "var(--py-yellow)", marginBottom: 12 }}>
      {[0,1,2,3,4].map(i => <Icon key={i} name="star" size={15} stroke={0} />)}
    </div>
    <blockquote style={{ margin: 0, fontSize: 15, lineHeight: 1.55, color: "var(--ink-2)" }}>"{q}"</blockquote>
    <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 10 }}>
      <div className="avatar" style={{ background: "var(--bg-sunk)", color: "var(--ink)" }}>{who.split(" ").map(x => x[0]).join("")}</div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600 }}>{who}</div>
        <div style={{ fontSize: 12, color: "var(--muted)" }}>{sub}</div>
      </div>
    </div>
  </div>
);

const LensPreviewCard = () => (
  <div style={{ background: "#0E1626", border: "1px solid #1E2A44", borderRadius: 16, padding: 22, color: "#D9DCE3", boxShadow: "0 30px 60px -20px rgba(0,0,0,0.55)" }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".12em", color: "#9CA3AE" }}>Lens</div>
        <div style={{ fontSize: 15, fontWeight: 600, marginTop: 1 }}>Accessibility companion</div>
      </div>
      <span style={{ fontSize: 11, color: "var(--py-yellow)", padding: "3px 8px", border: "1px solid rgba(255,212,59,0.4)", borderRadius: 999 }}>Active</span>
    </div>
    {[
      ["type", "Dyslexia-friendly font", true],
      ["contrast", "High contrast", false],
      ["eye", "Deutan palette", true],
      ["headphones", "Audio narration", true],
      ["handRaise", "ASL avatar (videos)", false],
      ["target", "Focus magnifier", true],
    ].map(([ic, t, on]) => (
      <div key={t} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0", borderTop: "1px solid #1A2440", fontSize: 13.5 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ color: "var(--py-yellow)" }}><Icon name={ic} size={15} /></span>{t}</span>
        <span style={{ width: 30, height: 18, borderRadius: 999, background: on ? "var(--py-blue-l)" : "#28354F", position: "relative" }}>
          <span style={{ position: "absolute", width: 14, height: 14, borderRadius: 999, background: "white", top: 2, left: on ? 14 : 2, transition: "left .2s" }} />
        </span>
      </div>
    ))}
  </div>
);

const Footer = () => (
  <footer style={{ padding: "48px 48px 36px", borderTop: "1px solid var(--border)", color: "var(--muted)", fontSize: 13 }}>
    <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
      <div>
        <div style={{ fontWeight: 600, color: "var(--ink)", marginBottom: 6 }}>CodexPy</div>
        <div>A capstone project · Asia Pacific University of Technology & Innovation</div>
        <div style={{ marginTop: 6 }}>Module CT050-3-2-WAPP · Built for school, university & self-learners.</div>
      </div>
      <div style={{ display: "flex", gap: 40 }}>
        <FooterCol h="Learn" items={["All modules", "Quizzes", "Certificates"]} />
        <FooterCol h="Company" items={["About", "Lens accessibility", "Contact"]} />
        <FooterCol h="Legal" items={["Privacy", "Terms", "WCAG statement"]} />
      </div>
    </div>
    <div style={{ maxWidth: 1280, margin: "32px auto 0", paddingTop: 18, borderTop: "1px solid var(--hairline)", fontSize: 12 }}>© 2026 CodexPy. Python is a trademark of the Python Software Foundation.</div>
  </footer>
);

const FooterCol = ({ h, items }) => (
  <div>
    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 8 }}>{h}</div>
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {items.map(i => <a key={i} href="#" style={{ color: "var(--muted)" }}>{i}</a>)}
    </div>
  </div>
);

// =================== DASHBOARD =============================================

function Dashboard({ setPage, user, lens }) {
  const completed = MODULES.filter(m => m.progress >= 1).length;
  const inProgress = MODULES.find(m => m.current);
  const overall = MODULES.reduce((a, m) => a + m.progress, 0) / MODULES.length;

  return (
    <div className="page-enter" style={{ padding: "32px 40px", overflowY: "auto" }}>
      {/* Welcome banner */}
      <div style={{
        background: "linear-gradient(135deg, var(--surface) 0%, var(--surface-2) 100%)",
        border: "1px solid var(--border)", borderRadius: 20, padding: "28px 32px",
        display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24, alignItems: "center", overflow: "hidden", position: "relative"
      }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Tuesday · May 13</div>
          <h1 style={{ fontSize: 36, fontWeight: 600, letterSpacing: "-0.02em", margin: 0 }}>
            Welcome back, {user.name.split(" ")[0]}. <span style={{ color: "var(--muted-2)" }}>You're {Math.round(overall * 100)}% through.</span>
          </h1>
          <p style={{ fontSize: 15, color: "var(--muted)", marginTop: 10, maxWidth: 460 }}>
            Pick up where you left off — three lessons left in <strong style={{ color: "var(--ink-2)" }}>Lists & Dictionaries</strong>.
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button className="btn btn-yellow" onClick={() => setPage("module")}>
              Continue lesson <Icon name="arrowRight" size={14} />
            </button>
            <button className="btn btn-secondary" onClick={() => setPage("quiz")}>
              <Icon name="quiz" size={14} /> Quick quiz
            </button>
          </div>
        </div>
        <div style={{ position: "relative", height: 220 }}>
          {lens.motion === "calm" ? (
            <OrbPoster progress={overall} />
          ) : (
            <ProgressOrb progress={overall} />
          )}
          <div style={{ position: "absolute", top: 8, left: 8, fontSize: 11, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>3D · Progress orb</div>
          <div style={{ position: "absolute", bottom: 8, right: 8, fontSize: 38, fontWeight: 600, letterSpacing: "-0.02em" }}>
            {Math.round(overall * 100)}<span style={{ fontSize: 18, color: "var(--muted)" }}>%</span>
          </div>
        </div>
      </div>

      {/* KPI strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 20 }}>
        <KPI label="Current streak" value={user.streak} unit="days" icon="flame" tone="yellow" />
        <KPI label="Lessons complete" value={26} unit="of 84" icon="book" tone="blue" />
        <KPI label="Quiz average" value={"82"} unit="%" icon="quiz" tone="green" />
        <KPI label="XP earned" value={user.totalPoints} unit="pts" icon="bolt" tone="purple" />
      </div>

      {/* Main grid */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginTop: 20 }}>
        {/* Continue learning */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 className="h2">Continue learning</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => setPage("modules")}>All modules <Icon name="arrowRight" size={13} /></button>
          </div>
          <div onClick={() => setPage("module")} style={{
            display: "grid", gridTemplateColumns: "auto 1fr auto", alignItems: "center", gap: 18,
            padding: 18, background: "var(--bg-sunk)", borderRadius: 14, cursor: "pointer"
          }}>
            <ModIcon color={inProgress.color} icon={inProgress.icon} />
            <div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>Module 5 · {inProgress.difficulty}</div>
              <div style={{ fontSize: 17, fontWeight: 600 }}>{inProgress.title}</div>
              <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>Lesson 5 of 8 — Iterating dictionaries</div>
              <div className="progress-bar" style={{ marginTop: 10, maxWidth: 360 }}>
                <span style={{ width: `${inProgress.progress * 100}%` }} />
              </div>
            </div>
            <button className="btn btn-primary"><Icon name="play" size={11} /> Resume</button>
          </div>

          <div style={{ marginTop: 20 }}>
            <div className="eyebrow" style={{ marginBottom: 10 }}>Recommended next</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {MODULES.slice(5, 8).map(m => (
                <div key={m.id} className="card card-hover" style={{ padding: 16 }} onClick={() => setPage("module")}>
                  <ModIcon color={m.color} icon={m.icon} />
                  <div style={{ fontSize: 14, fontWeight: 600, marginTop: 10 }}>{m.title}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{m.lessons} lessons · {m.duration}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Side column: recent scores + badges */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <h3 className="h3">Recent quizzes</h3>
              <button className="btn btn-ghost btn-sm">View all</button>
            </div>
            {[
              { t: "Control Flow checkpoint", s: 95, d: "Yesterday" },
              { t: "Loops & comprehensions",  s: 80, d: "3 days ago" },
              { t: "Functions: arguments",    s: 70, d: "Last week" },
            ].map((q, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderTop: i === 0 ? "none" : "1px solid var(--hairline)" }}>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 500 }}>{q.t}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>{q.d}</div>
                </div>
                <div style={{
                  padding: "3px 10px", borderRadius: 999, fontSize: 13, fontWeight: 600,
                  background: q.s >= 90 ? "color-mix(in oklab, var(--success) 18%, var(--surface))" : q.s >= 75 ? "color-mix(in oklab, var(--py-blue) 14%, var(--surface))" : "color-mix(in oklab, var(--warning) 18%, var(--surface))",
                  color: q.s >= 90 ? "#047857" : q.s >= 75 ? "var(--py-blue-d)" : "#92400E",
                }}>{q.s}%</div>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <h3 className="h3">Badges</h3>
              <span style={{ fontSize: 12, color: "var(--muted)" }}>{user.badges.length} earned</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              {user.badges.map((b, i) => (
                <BadgeChip key={b} label={b} idx={i} />
              ))}
              {Array(4 - user.badges.length % 4).fill(0).map((_, i) => (
                <BadgeChip key={"lock" + i} label="Locked" locked />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const KPI = ({ label, value, unit, icon, tone }) => {
  const toneMap = {
    yellow: { bg: "color-mix(in oklab, var(--py-yellow) 18%, var(--surface))", fg: "var(--py-blue-d)" },
    blue:   { bg: "color-mix(in oklab, var(--py-blue) 14%, var(--surface))", fg: "var(--py-blue-d)" },
    green:  { bg: "color-mix(in oklab, var(--success) 18%, var(--surface))", fg: "#047857" },
    purple: { bg: "color-mix(in oklab, #8B5CF6 16%, var(--surface))", fg: "#6D28D9" },
  };
  const t = toneMap[tone];
  return (
    <div className="card" style={{ padding: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: t.bg, color: t.fg, display: "grid", placeItems: "center" }}>
          <Icon name={icon} size={15} stroke={1.8} />
        </div>
        <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>{label}</div>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
        <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: "-0.02em" }}>{value}</div>
        <div style={{ fontSize: 13, color: "var(--muted)" }}>{unit}</div>
      </div>
    </div>
  );
};

const BadgeChip = ({ label, locked, idx = 0 }) => {
  const colors = ["#3776AB", "#FFD43B", "#10B981", "#8B5CF6"];
  const c = colors[idx % colors.length];
  return (
    <div className="tt" data-tt={locked ? "Locked — keep going" : label} style={{
      aspectRatio: "1 / 1", borderRadius: 12,
      background: locked ? "var(--bg-sunk)" : `linear-gradient(135deg, color-mix(in oklab, ${c} 22%, var(--surface)) 0%, var(--surface) 100%)`,
      border: "1px solid " + (locked ? "var(--border)" : `color-mix(in oklab, ${c} 35%, transparent)`),
      display: "grid", placeItems: "center", color: locked ? "var(--muted-2)" : c,
      position: "relative", overflow: "hidden",
    }}>
      <Icon name={locked ? "lock" : "star"} size={20} stroke={1.6} />
      <div style={{ position: "absolute", inset: 0, background: locked ? "transparent" : `radial-gradient(circle at 30% 30%, ${c}25 0%, transparent 60%)`, pointerEvents: "none" }} />
    </div>
  );
};

const OrbPoster = ({ progress }) => (
  <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center" }}>
    <div style={{
      width: 160, height: 160, borderRadius: "50%",
      background: `conic-gradient(var(--py-blue) ${progress * 360}deg, var(--bg-sunk) ${progress * 360}deg)`,
      display: "grid", placeItems: "center", position: "relative",
    }}>
      <div style={{ width: 124, height: 124, borderRadius: "50%", background: "var(--surface)", display: "grid", placeItems: "center", fontSize: 32, fontWeight: 600, letterSpacing: "-0.02em" }}>
        {Math.round(progress * 100)}%
      </div>
    </div>
  </div>
);

Object.assign(window, { LandingPage, Dashboard, ModuleCardTilt, ModIcon, diffClass, Footer, BadgeChip, KPI });
