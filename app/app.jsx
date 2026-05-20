/* global React, ReactDOM, Icon, Sidebar, Topbar, useApplyLens, DEFAULT_LENS, LensFAB, LensPanel, INITIAL_USER, useTweaks, TweaksPanel, LandingPage, Dashboard, ModulesList, ModuleDetail, QuizPage, QuizResults, ProgressPage, ProfilePage, AdminDashboard, AdminUsers, AdminModules, AdminQuizzes, AdminReports */
// CodexPy — main app router

const { useState: useStateApp, useEffect: useEffectApp } = React;

// =================== LOGIN PAGE (minimal sign-in) ============================

function LoginPage({ setPage }) {
  const [tab, setTab] = useStateApp("login");
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", height: "100vh", overflow: "hidden" }}>
      <div style={{ padding: "48px 56px", display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: 480, margin: "0 auto", width: "100%" }}>
        <button onClick={() => setPage("landing")} style={{ display: "inline-flex", alignItems: "center", gap: 10, fontWeight: 600, marginBottom: 40, fontSize: 17, alignSelf: "flex-start" }}>
          <span style={{ width: 28, height: 28, borderRadius: 7, background: "var(--ink)", color: "var(--py-yellow)", display: "grid", placeItems: "center", fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 14 }}>{"</"}</span>
          Codex<span style={{ fontFamily: "var(--font-mono)", background: "var(--py-yellow)", color: "var(--py-blue-d)", padding: "1px 6px", borderRadius: 5 }}>Py</span>
        </button>

        <div className="seg" style={{ alignSelf: "flex-start", marginBottom: 28 }}>
          <button className={tab === "login" ? "on" : ""} onClick={() => setTab("login")}>Sign in</button>
          <button className={tab === "register" ? "on" : ""} onClick={() => setTab("register")}>Register</button>
        </div>

        <h1 style={{ fontSize: 36, fontWeight: 600, letterSpacing: "-0.02em", margin: 0, lineHeight: 1.1 }}>
          {tab === "login" ? "Welcome back." : "Start learning."}
        </h1>
        <p style={{ fontSize: 15, color: "var(--muted)", marginTop: 10, marginBottom: 32 }}>
          {tab === "login" ? "Pick up where the snake left off." : "Free forever for the first three modules. No credit card."}
        </p>

        {tab === "register" && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 5, fontWeight: 500 }}>Full name</div>
            <input className="input" defaultValue="Maya Chen" />
          </div>
        )}

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 5, fontWeight: 500 }}>Email</div>
          <input className="input" type="email" defaultValue="maya.chen@apu.edu.my" />
        </div>

        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
            <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>Password</div>
            {tab === "login" && <a href="#" style={{ fontSize: 12, color: "var(--py-blue)" }}>Forgot?</a>}
          </div>
          <input className="input" type="password" defaultValue="••••••••••" />
          {tab === "register" && (
            <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
              {[0,1,2,3].map(i => <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < 3 ? "var(--success)" : "var(--bg-sunk)" }} />)}
              <span style={{ fontSize: 11, color: "var(--success)", marginLeft: 6 }}>Strong</span>
            </div>
          )}
        </div>

        {tab === "register" && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 5, fontWeight: 500 }}>I am a…</div>
            <div className="seg" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", width: "100%" }}>
              <button className="on">School student</button>
              <button>University student</button>
              <button>Self-learner</button>
            </div>
          </div>
        )}

        <button className="btn btn-yellow btn-lg" onClick={() => setPage("dashboard")} style={{ marginTop: 18, justifyContent: "center" }}>
          {tab === "login" ? "Sign in" : "Create my account"} <Icon name="arrowRight" size={14} />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "24px 0", color: "var(--muted)", fontSize: 12 }}>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          or continue with
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <button className="btn btn-secondary">Google</button>
          <button className="btn btn-secondary">APU SSO</button>
        </div>

        <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 28, textAlign: "center" }}>
          By {tab === "login" ? "signing in" : "registering"} you accept the <a href="#" style={{ color: "var(--py-blue)" }}>terms</a> and acknowledge our <a href="#" style={{ color: "var(--py-blue)" }}>privacy</a> policy.
        </p>
      </div>

      {/* Right: ambient 3D background */}
      <div style={{ background: "var(--ink)", color: "var(--bg)", position: "relative", overflow: "hidden", display: "grid", placeItems: "center", padding: 40 }}>
        <div style={{ position: "absolute", inset: 0 }}>
          {/* Decorative scene */}
          <AmbientCircles />
        </div>
        <div style={{ position: "relative", maxWidth: 360, textAlign: "center" }}>
          <div style={{ display: "inline-flex", padding: "5px 11px", background: "rgba(255,212,59,0.15)", color: "var(--py-yellow)", borderRadius: 999, fontSize: 11, fontWeight: 600, marginBottom: 18 }}>Day {INITIAL_USER.streak}</div>
          <h2 style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.015em", lineHeight: 1.25 }}>
            "I never thought I'd actually understand list comprehensions. Then the snake purred at me."
          </h2>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 16 }}>— Yusra, week 4</div>
        </div>
      </div>
    </div>
  );
}

function AmbientCircles() {
  // SVG-only ambient pattern (no Three.js — login is intentionally minimal)
  return (
    <svg style={{ width: "100%", height: "100%", position: "absolute", inset: 0, opacity: 0.55 }}>
      {Array(28).fill(0).map((_, i) => (
        <circle key={i}
          cx={`${(i * 47) % 100}%`} cy={`${(i * 31) % 100}%`}
          r={2 + (i % 5)} fill={i % 7 === 0 ? "#FFD43B" : "#3776AB"} opacity={0.35 + (i % 5) * 0.08}
        />
      ))}
    </svg>
  );
}

// =================== App router ==============================================

function App() {
  const [page, setPage] = useStateApp(() => {
    const h = window.location.hash.replace("#", "");
    return h || "landing";
  });
  const [mode, setMode] = useStateApp(() => {
    const h = window.location.hash.replace("#", "");
    return h.startsWith("admin") ? "admin" : "user";
  });
  const [user] = useStateApp(INITIAL_USER);
  const [lens, setLens] = useStateApp(() => {
    try {
      const stored = localStorage.getItem("codexpy:lens");
      return stored ? { ...DEFAULT_LENS, ...JSON.parse(stored) } : DEFAULT_LENS;
    } catch { return DEFAULT_LENS; }
  });
  const { tweaks, setTweak, editMode, setEditMode } = useTweaks();
  useApplyLens(lens);

  useEffectApp(() => {
    try { localStorage.setItem("codexpy:lens", JSON.stringify(lens)); } catch {}
  }, [lens]);

  // Auto-switch nav when crossing the user/admin boundary
  useEffectApp(() => {
    if (mode === "admin" && !page.startsWith("admin")) setPage("admin");
    if (mode === "user" && page.startsWith("admin")) setPage("dashboard");
  }, [mode]);

  // Login / register page is full-bleed (no shell)
  if (page === "login" || page === "register") {
    return (
      <>
        <LoginPage setPage={setPage} />
        <LensFAB lens={lens} setLens={setLens} />
        {lens.open && <LensPanel lens={lens} setLens={setLens} />}
      </>
    );
  }

  // Landing is full-bleed too
  if (page === "landing") {
    return (
      <>
        <LandingPage setPage={setPage} lens={lens} />
        <LensFAB lens={lens} setLens={setLens} />
        {lens.open && <LensPanel lens={lens} setLens={setLens} />}
        {editMode && <TweaksPanel tweaks={tweaks} setTweak={setTweak} onClose={() => { setEditMode(false); window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*"); }} />}
      </>
    );
  }

  const PAGE_TITLES = {
    dashboard: "Dashboard",
    modules: "All modules",
    module: "Lists & Dictionaries",
    quiz: "Checkpoint quiz",
    results: "Quiz results",
    progress: "My progress",
    profile: "Profile",
    admin: "Admin overview",
    "admin-users": "Manage users",
    "admin-modules": "Manage modules",
    "admin-quizzes": "Manage quizzes",
    "admin-reports": "Reports",
  };

  const crumbs = mode === "admin"
    ? ["CodexPy Admin", PAGE_TITLES[page] || page]
    : ["CodexPy", PAGE_TITLES[page] || page];

  return (
    <div className="app-shell" data-screen-label={mode === "admin" ? `Admin · ${PAGE_TITLES[page]}` : `User · ${PAGE_TITLES[page]}`}>
      <Sidebar page={page} setPage={setPage} mode={mode} setMode={setMode} />
      <div className="app-main">
        {/* Hide topbar on quiz (fullscreen) */}
        {page !== "quiz" && (
          <Topbar
            crumbs={crumbs}
            user={user}
            actions={page === "dashboard" ? <button className="btn btn-yellow btn-sm" onClick={() => setPage("module")}><Icon name="play" size={11}/> Continue</button> : null}
          />
        )}

        <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
          {mode === "user" ? (
            <>
              {page === "dashboard" && <Dashboard setPage={setPage} user={user} lens={lens} />}
              {page === "modules" && <ModulesList setPage={setPage} lens={lens} />}
              {page === "module" && <ModuleDetail setPage={setPage} lens={lens} />}
              {page === "quiz" && <QuizPage setPage={setPage} lens={lens} />}
              {page === "results" && <QuizResults setPage={setPage} lens={lens} />}
              {page === "progress" && <ProgressPage setPage={setPage} lens={lens} />}
              {page === "profile" && <ProfilePage setPage={setPage} user={user} lens={lens} />}
            </>
          ) : (
            <>
              {page === "admin" && <AdminDashboard setPage={setPage} />}
              {page === "admin-users" && <AdminUsers />}
              {page === "admin-modules" && <AdminModules />}
              {page === "admin-quizzes" && <AdminQuizzes />}
              {page === "admin-reports" && <AdminReports />}
            </>
          )}
        </div>
      </div>

      <LensFAB lens={lens} setLens={setLens} />
      {lens.open && <LensPanel lens={lens} setLens={setLens} />}
      {editMode && <TweaksPanel tweaks={tweaks} setTweak={setTweak} onClose={() => { setEditMode(false); window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*"); }} />}

      {/* Focus magnifier overlay */}
      {lens.magnifier && <FocusMagnifier />}
    </div>
  );
}

// Focus magnifier — follows the focused element, shows a 2x lens
function FocusMagnifier() {
  const [rect, setRect] = useStateApp(null);
  useEffectApp(() => {
    const onFocus = (e) => {
      const el = e.target;
      if (el && el.getBoundingClientRect) {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) setRect({ x: r.x, y: r.y, w: r.width, h: r.height });
      }
    };
    const onBlur = () => setRect(null);
    document.addEventListener("focusin", onFocus);
    document.addEventListener("focusout", onBlur);
    return () => { document.removeEventListener("focusin", onFocus); document.removeEventListener("focusout", onBlur); };
  }, []);
  if (!rect) return null;
  return (
    <div style={{
      position: "fixed", pointerEvents: "none", zIndex: 200,
      left: rect.x - 6, top: rect.y - 6, width: rect.w + 12, height: rect.h + 12,
      border: "3px solid var(--py-yellow)",
      borderRadius: 8,
      boxShadow: "0 0 0 4px rgba(255,212,59,0.25), 0 16px 40px -8px rgba(0,0,0,0.3)",
      transition: "all .15s var(--easing)",
    }} />
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
