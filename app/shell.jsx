/* global React, ReactDOM */
// CodexPy — App shell, navigation, icons, shared UI

const { useState, useEffect, useRef, useMemo, useCallback, createContext, useContext } = React;

// -------------------- Icons (inline SVG, consistent stroke) ------------------
const Icon = ({ name, size = 16, stroke = 1.6 }) => {
  const paths = {
    home: "M3 11.5 12 4l9 7.5M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9",
    book: "M4 4.5A1.5 1.5 0 0 1 5.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5zM4 19.5A1.5 1.5 0 0 0 5.5 21H20",
    grid: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
    quiz: "M9.09 9a3 3 0 1 1 5.83 1c0 2-3 3-3 3M12 17h.01M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0z",
    chart: "M3 3v18h18M7 16l4-6 3 4 5-9",
    user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z",
    award: "M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM8.5 14l-1.5 7 5-3 5 3-1.5-7",
    settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
    search: "M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16zM21 21l-4.35-4.35",
    bell: "M18 8A6 6 0 1 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0",
    play: "M5 3v18l15-9z",
    check: "M5 12l5 5 9-13",
    x: "M18 6L6 18M6 6l12 12",
    arrowRight: "M5 12h14M12 5l7 7-7 7",
    arrowLeft: "M19 12H5M12 19l-7-7 7-7",
    clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
    chevronDown: "M6 9l6 6 6-6",
    chevronRight: "M9 6l6 6-6 6",
    sparkle: "M12 3l1.7 5.2 5.3 1.6-5.3 1.6L12 16.6l-1.7-5.2-5.3-1.6 5.3-1.6zM19 3v4M21 5h-4M5 17v3M6.5 18.5h-3",
    plus: "M12 5v14M5 12h14",
    edit: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z",
    trash: "M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6",
    eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
    accessibility: "M12 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM19 13l-5-2v-2H10v2L5 13M9 22l3-7 3 7M12 15v-4",
    code: "M16 18l6-6-6-6M8 6L2 12l6 6",
    play2: "M5 3l14 9-14 9V3z",
    star: "M12 2l3 7 7.5.5L17 14l1.5 7L12 17 5.5 21 7 14 1.5 9.5 9 9z",
    moon: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
    menu: "M3 12h18M3 6h18M3 18h18",
    lightbulb: "M9 18h6M10 22h4M12 2a7 7 0 0 1 4 12.7c-1 .7-1.5 1.7-1.5 2.8V18h-5v-.5c0-1.1-.5-2.1-1.5-2.8A7 7 0 0 1 12 2z",
    flame: "M8.5 14.5A2.5 2.5 0 0 0 11 17c2 0 4-2 4-5 0-2.4-1.9-4.2-3.1-5C11 6.4 9 5 8 3c-.7 1.5-1 3-1 5 0 1.2.3 2 .8 2.8.7 1 1.2 1.5 1.2 2.5 0 .5-.2 1-.5 1.2z",
    target: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
    log: "M16 17l5-5-5-5M21 12H9M13 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h8",
    shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    bolt: "M13 2 3 14h7l-1 8 10-12h-7z",
    folder: "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
    file: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6",
    save: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 21v-8H7v8M7 3v5h8",
    download: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",
    upload: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12",
    filter: "M3 4h18l-7 8v6l-4 2v-8z",
    type: "M4 7h16M9 7v13M15 7v13",
    contrast: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 3v18",
    headphones: "M3 14a9 9 0 0 1 18 0v5a2 2 0 0 1-2 2h-1v-7h3M3 14v5a2 2 0 0 0 2 2h1v-7H3",
    mic: "M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3zM19 11a7 7 0 0 1-14 0M12 18v4M8 22h8",
    captions: "M3 5h18v14H3zM7 12h3M14 12h3M7 15h3M14 15h3",
    keyboard: "M3 6h18v12H3zM6 9v1M9 9v1M12 9v1M15 9v1M18 9v1M7 13h10",
    languages: "M5 8h6M8 5v3M14 12l3 7M20 19l-3-7M5 15l3-7 3 7M5 21h6M14 17h6",
    sun: "M12 4V2M12 22v-2M5 5l-1.5-1.5M20.5 20.5L19 19M22 12h-2M2 12H4M19 5l1.5-1.5M3.5 20.5L5 19M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z",
    panel: "M3 4h18v16H3zM3 9h18",
    handRaise: "M9 11V5a2 2 0 1 1 4 0v6M11 11V3a2 2 0 1 1 4 0v8M13 11V5a2 2 0 1 1 4 0v8c0 4-3 8-7 8s-7-4-7-8V8a2 2 0 1 1 4 0v3",
    lock: "M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4",
  };
  const d = paths[name];
  if (!d) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
};

// -------------------- App Context --------------------------------------------

const AppContext = createContext(null);
const useApp = () => useContext(AppContext);

const INITIAL_USER = {
  name: "Maya Chen",
  initials: "MC",
  role: "student",
  email: "maya.chen@apu.edu.my",
  joined: "Feb 2026",
  streak: 14,
  totalPoints: 1840,
  level: 6,
  modulesCompleted: 4,
  modulesTotal: 12,
  badges: ["First Function", "5-Day Streak", "Loop Master", "OOP Apprentice"],
};

const MODULES = [
  { id: "m1", title: "Variables and Data Types", difficulty: "Beginner", lessons: 8, duration: "1h 20m", progress: 1.00, color: "#3776AB", icon: "type", blurb: "Strings, integers, floats, booleans — the building blocks." },
  { id: "m2", title: "Control Flow", difficulty: "Beginner", lessons: 7, duration: "1h 10m", progress: 1.00, color: "#10B981", icon: "bolt", blurb: "if / elif / else, branching, and ternary expressions." },
  { id: "m3", title: "Loops & Iteration", difficulty: "Beginner", lessons: 6, duration: "55m", progress: 1.00, color: "#F59E0B", icon: "flame", blurb: "for, while, break, continue, and comprehensions." },
  { id: "m4", title: "Functions", difficulty: "Beginner", lessons: 9, duration: "1h 35m", progress: 1.00, color: "#3776AB", icon: "bolt", blurb: "Defining functions, arguments, returns, scope, lambda." },
  { id: "m5", title: "Lists & Dictionaries", difficulty: "Intermediate", lessons: 8, duration: "1h 25m", progress: 0.62, color: "#3776AB", icon: "folder", blurb: "Sequences, mappings, slicing, and idiomatic patterns.", current: true },
  { id: "m6", title: "Strings & Formatting", difficulty: "Intermediate", lessons: 6, duration: "1h 05m", progress: 0.0, color: "#8B5CF6", icon: "type", blurb: "f-strings, methods, regex basics." },
  { id: "m7", title: "OOP Basics", difficulty: "Intermediate", lessons: 10, duration: "2h 10m", progress: 0.0, color: "#3776AB", icon: "shield", blurb: "Classes, instances, inheritance, dunder methods." },
  { id: "m8", title: "File I/O", difficulty: "Intermediate", lessons: 5, duration: "55m", progress: 0.0, color: "#F59E0B", icon: "file", blurb: "Reading, writing, context managers, paths." },
  { id: "m9", title: "Modules & Packages", difficulty: "Intermediate", lessons: 5, duration: "50m", progress: 0.0, color: "#10B981", icon: "folder", blurb: "import, pip, virtual environments." },
  { id: "m10", title: "Error Handling", difficulty: "Intermediate", lessons: 5, duration: "45m", progress: 0.0, color: "#EF4444", icon: "shield", blurb: "try / except / finally, raising, custom exceptions." },
  { id: "m11", title: "Async Python", difficulty: "Advanced", lessons: 7, duration: "1h 50m", progress: 0.0, color: "#8B5CF6", icon: "bolt", blurb: "async / await, event loops, asyncio." },
  { id: "m12", title: "Working with Libraries", difficulty: "Advanced", lessons: 6, duration: "1h 30m", progress: 0.0, color: "#3776AB", icon: "grid", blurb: "requests, pandas, numpy — practical workflows." },
];

const QUIZ_QUESTIONS = [
  {
    id: 1,
    prompt: "What is the output of `print(type(3.14))`?",
    kind: "mcq",
    options: ["<class 'int'>", "<class 'float'>", "<class 'str'>", "<class 'decimal'>"],
    answer: 1,
    explain: "3.14 is a floating-point literal — Python infers its type as float.",
  },
  {
    id: 2,
    prompt: "Which of the following is a *mutable* sequence in Python?",
    kind: "mcq",
    options: ["tuple", "str", "list", "frozenset"],
    answer: 2,
    explain: "Lists are mutable — you can change their contents after creation. Tuples and strings are immutable.",
  },
  {
    id: 3,
    prompt: "Given `nums = [1, 2, 3, 4]`, what does `nums[-2:]` return?",
    kind: "mcq",
    options: ["[1, 2]", "[3, 4]", "[2, 3, 4]", "[4]"],
    answer: 1,
    explain: "Negative indices count from the end. `-2:` is 'from second-to-last through the end'.",
  },
  {
    id: 4,
    prompt: "Complete the code to print every value in `prices`.",
    kind: "code",
    starter: "prices = [4.5, 9.99, 12.0]\n___ p in prices:\n    print(p)",
    blank: "for",
    explain: "`for` introduces the iteration; `in` follows the loop variable.",
  },
  {
    id: 5,
    prompt: "What does `len({'a': 1, 'b': 2, 'a': 3})` return?",
    kind: "mcq",
    options: ["1", "2", "3", "TypeError"],
    answer: 1,
    explain: "Duplicate keys collapse — the dict ends up with two entries: 'a': 3 and 'b': 2.",
  },
  {
    id: 6,
    prompt: "Which expression returns `True`?",
    kind: "mcq",
    options: ["`'cat' in ['catalog', 'dog']`", "`'cat' in 'catalog'`", "`['a'] == 'a'`", "`0 is False`"],
    answer: 1,
    explain: "`in` checks substring membership for strings. The list version checks element equality, not substrings.",
  },
  {
    id: 7,
    prompt: "Fill the blank to keep only even numbers.",
    kind: "code",
    starter: "evens = [n for n in range(10) ___ n % 2 == 0]",
    blank: "if",
    explain: "`if` is the filter clause in a list comprehension.",
  },
  {
    id: 8,
    prompt: "What is the value of `x` after `x = [1,2,3]; y = x; y.append(4)`?",
    kind: "mcq",
    options: ["[1, 2, 3]", "[1, 2, 3, 4]", "[4]", "[1, 2, 3], [1, 2, 3, 4]"],
    answer: 1,
    explain: "`y = x` aliases the same list. Mutating through `y` is visible through `x`.",
  },
  {
    id: 9,
    prompt: "Pick the correct way to merge two dicts (Python 3.9+).",
    kind: "mcq",
    options: ["`a + b`", "`a.merge(b)`", "`a | b`", "`merge(a, b)`"],
    answer: 2,
    explain: "Python 3.9 introduced `|` (union) for dicts. The keys in `b` win on conflict.",
  },
  {
    id: 10,
    prompt: "What does `list(range(2, 10, 3))` produce?",
    kind: "mcq",
    options: ["[2, 5, 8]", "[2, 3, 4, 5, 6, 7, 8, 9, 10]", "[2, 5, 8, 11]", "[3, 6, 9]"],
    answer: 0,
    explain: "`range(start, stop, step)` — starts at 2, stops before 10, jumps by 3.",
  },
];

// -------------------- Nav definitions ----------------------------------------

const NAV_USER = [
  { id: "landing", label: "Home", icon: "home", section: "Browse" },
  { id: "dashboard", label: "Dashboard", icon: "grid", section: "Learn" },
  { id: "modules", label: "All Modules", icon: "book", section: "Learn" },
  { id: "module", label: "Lists & Dictionaries", icon: "file", section: "Learn", indent: true },
  { id: "quiz", label: "Take a Quiz", icon: "quiz", section: "Learn" },
  { id: "progress", label: "My Progress", icon: "chart", section: "You" },
  { id: "profile", label: "Profile", icon: "user", section: "You" },
];

const NAV_ADMIN = [
  { id: "admin", label: "Overview", icon: "home", section: "Admin" },
  { id: "admin-users", label: "Manage Users", icon: "user", section: "Admin" },
  { id: "admin-modules", label: "Manage Modules", icon: "book", section: "Admin" },
  { id: "admin-quizzes", label: "Manage Quizzes", icon: "quiz", section: "Admin" },
  { id: "admin-reports", label: "Reports", icon: "chart", section: "Admin" },
];

// -------------------- Sidebar -----------------------------------------------

const Sidebar = ({ page, setPage, mode, setMode }) => {
  const nav = mode === "admin" ? NAV_ADMIN : NAV_USER;
  const sections = {};
  nav.forEach((n) => { (sections[n.section] = sections[n.section] || []).push(n); });

  return (
    <aside className="sidebar" aria-label="Primary">
      <div className="logo">
        <span style={{
          width: 26, height: 26, borderRadius: 7,
          background: "var(--ink)", color: "var(--py-yellow)",
          display: "grid", placeItems: "center", fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 14,
        }}>{'</'}</span>
        Codex<span className="py">Py</span>
      </div>

      {Object.entries(sections).map(([sec, items]) => (
        <React.Fragment key={sec}>
          <h6>{sec}</h6>
          {items.map((n) => (
            <div
              key={n.id}
              role="link"
              tabIndex={0}
              className={"nav-item" + (page === n.id ? " active" : "")}
              style={n.indent ? { marginLeft: 22, fontSize: 13, color: "var(--muted)" } : {}}
              onClick={() => setPage(n.id)}
              onKeyDown={(e) => { if (e.key === "Enter") setPage(n.id); }}
            >
              <span className="nav-ico"><Icon name={n.icon} /></span>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.label}</span>
            </div>
          ))}
        </React.Fragment>
      ))}

      <div style={{ marginTop: "auto", paddingTop: 16, borderTop: "1px solid var(--border)" }}>
        <div className="nav-item" onClick={() => setMode(mode === "user" ? "admin" : "user")} title="Switch view">
          <span className="nav-ico"><Icon name="shield" /></span>
          <span>{mode === "user" ? "Switch to Admin" : "Switch to User"}</span>
        </div>
        <div className="nav-item" onClick={() => setPage("login")}>
          <span className="nav-ico"><Icon name="log" /></span>
          <span>Log out</span>
        </div>
      </div>
    </aside>
  );
};

// -------------------- Top bar ------------------------------------------------

const Topbar = ({ crumbs, actions, user }) => (
  <div className="topbar">
    <div className="crumbs">
      {crumbs.map((c, i) => (
        <React.Fragment key={i}>
          {i > 0 && <Icon name="chevronRight" size={14} />}
          {i === crumbs.length - 1 ? <strong>{c}</strong> : <span>{c}</span>}
        </React.Fragment>
      ))}
    </div>
    <div className="actions">
      {actions}
      <div className="tt" data-tt="Notifications">
        <button className="btn btn-ghost btn-sm" aria-label="Notifications"><Icon name="bell" /></button>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 10px 4px 4px", borderRadius: 999, background: "var(--bg-sunk)" }}>
        <div className="avatar" style={{ width: 28, height: 28, fontSize: 11 }}>{user.initials}</div>
        <span style={{ fontSize: 13, fontWeight: 500 }}>{user.name.split(" ")[0]}</span>
      </div>
    </div>
  </div>
);

// -------------------- Lens (Accessibility Companion) -------------------------

const DEFAULT_LENS = {
  open: false,
  font: "default",        // default | dyslexia
  contrast: "default",    // default | high
  cb: "default",          // default | deutan | protan | tritan
  motion: "default",      // default | calm
  targets: "default",     // default | large | xlarge
  narration: false,       // audio narration
  asl: false,             // ASL avatar slot in videos
  captions: true,
  codeReader: false,      // verbose alt-text for code blocks
  magnifier: false,       // focus magnifier overlay
  kbHints: false,         // show keyboard hints on focus
};

const LensFAB = ({ lens, setLens }) => (
  <button
    className="lens-fab"
    onClick={() => setLens({ ...lens, open: !lens.open })}
    aria-label="Lens — accessibility companion"
  >
    <Icon name="accessibility" size={22} stroke={2} />
  </button>
);

const LensPanel = ({ lens, setLens }) => {
  const update = (k, v) => setLens({ ...lens, [k]: v });
  return (
    <div className="lens-panel" role="dialog" aria-label="Lens accessibility companion">
      <div className="head">
        <div>
          <div style={{ fontSize: 12, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".12em", fontWeight: 600 }}>Lens</div>
          <div style={{ fontWeight: 600, fontSize: 16, marginTop: 2 }}>Accessibility companion</div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => update("open", false)} aria-label="Close">
          <Icon name="x" />
        </button>
      </div>
      <div className="body">

        <LensSection title="Reading">
          <LensRow label="Dyslexia-friendly font" sub="Atkinson Hyperlegible; wider letterforms.">
            <button className={"toggle " + (lens.font === "dyslexia" ? "on" : "")} onClick={() => update("font", lens.font === "dyslexia" ? "default" : "dyslexia")} aria-label="Toggle dyslexia font" />
          </LensRow>
          <LensRow label="High contrast" sub="Pure black/white text and borders.">
            <button className={"toggle " + (lens.contrast === "high" ? "on" : "")} onClick={() => update("contrast", lens.contrast === "high" ? "default" : "high")} aria-label="Toggle high contrast" />
          </LensRow>
          <LensRow label="Color-blind palette" sub="Remap accents and semantics.">
            <div className="seg">
              {["default", "deutan", "protan", "tritan"].map((k) => (
                <button key={k} className={lens.cb === k ? "on" : ""} onClick={() => update("cb", k)}>{k === "default" ? "Off" : k}</button>
              ))}
            </div>
          </LensRow>
        </LensSection>

        <LensSection title="Motion">
          <LensRow label="Calm mode" sub="Replace all 3D scenes with static posters, remove transitions.">
            <button className={"toggle " + (lens.motion === "calm" ? "on" : "")} onClick={() => update("motion", lens.motion === "calm" ? "default" : "calm")} aria-label="Toggle calm mode" />
          </LensRow>
        </LensSection>

        <LensSection title="Targets & focus">
          <LensRow label="Touch target size">
            <div className="seg">
              {[["default", "M"], ["large", "L"], ["xlarge", "XL"]].map(([k, l]) => (
                <button key={k} className={lens.targets === k ? "on" : ""} onClick={() => update("targets", k)}>{l}</button>
              ))}
            </div>
          </LensRow>
          <LensRow label="Focus magnifier" sub="2× lens follows focused element.">
            <button className={"toggle " + (lens.magnifier ? "on" : "")} onClick={() => update("magnifier", !lens.magnifier)} />
          </LensRow>
          <LensRow label="Keyboard hints" sub="Show shortcut chips on focus.">
            <button className={"toggle " + (lens.kbHints ? "on" : "")} onClick={() => update("kbHints", !lens.kbHints)} />
          </LensRow>
        </LensSection>

        <LensSection title="Multimodal">
          <LensRow label="Audio narration" sub="Spoken lesson with adjustable speed.">
            <button className={"toggle " + (lens.narration ? "on" : "")} onClick={() => update("narration", !lens.narration)} />
          </LensRow>
          <LensRow label="ASL avatar" sub="Sign-language avatar appears next to video lessons.">
            <button className={"toggle " + (lens.asl ? "on" : "")} onClick={() => update("asl", !lens.asl)} />
          </LensRow>
          <LensRow label="Captions on by default">
            <button className={"toggle " + (lens.captions ? "on" : "")} onClick={() => update("captions", !lens.captions)} />
          </LensRow>
          <LensRow label="Verbose code reader" sub="Adds plain-English description above every code block.">
            <button className={"toggle " + (lens.codeReader ? "on" : "")} onClick={() => update("codeReader", !lens.codeReader)} />
          </LensRow>
        </LensSection>

        <div style={{ marginTop: 14, padding: "12px 14px", background: "var(--bg-sunk)", borderRadius: 12, fontSize: 12.5, color: "var(--muted)", lineHeight: 1.55 }}>
          Lens settings sync to your account and persist across sessions. WCAG AA across both themes.
        </div>
      </div>
    </div>
  );
};

const LensSection = ({ title, children }) => (
  <div style={{ paddingBottom: 14, marginBottom: 14, borderBottom: "1px dashed var(--border)" }}>
    <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--muted)", marginBottom: 10 }}>{title}</div>
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{children}</div>
  </div>
);

const LensRow = ({ label, sub, children }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 13.5, fontWeight: 500, color: "var(--ink-2)" }}>{label}</div>
      {sub && <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 1, lineHeight: 1.4 }}>{sub}</div>}
    </div>
    <div>{children}</div>
  </div>
);

// Apply lens state -> root data attrs
function useApplyLens(lens) {
  useEffect(() => {
    const r = document.documentElement;
    r.setAttribute("data-lens-font", lens.font);
    r.setAttribute("data-lens-contrast", lens.contrast);
    r.setAttribute("data-lens-cb", lens.cb);
    r.setAttribute("data-lens-motion", lens.motion);
    r.setAttribute("data-lens-targets", lens.targets);
  }, [lens]);
}

// -------------------- Tweaks (density) ---------------------------------------

const DEFAULT_TWEAKS = /*EDITMODE-BEGIN*/{
  "density": "comfortable",
  "theme": "light"
}/*EDITMODE-END*/;

function useTweaks() {
  const [tweaks, setTweaks] = useState(DEFAULT_TWEAKS);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const onMessage = (e) => {
      if (e.data?.type === "__activate_edit_mode") setEditMode(true);
      else if (e.data?.type === "__deactivate_edit_mode") setEditMode(false);
    };
    window.addEventListener("message", onMessage);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const setTweak = useCallback((kv) => {
    setTweaks((t) => {
      const next = { ...t, ...kv };
      window.parent.postMessage({ type: "__edit_mode_set_keys", edits: kv }, "*");
      return next;
    });
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-density", tweaks.density);
    document.documentElement.classList.toggle("dark", tweaks.theme === "dark");
  }, [tweaks]);

  return { tweaks, setTweak, editMode, setEditMode };
}

const TweaksPanel = ({ tweaks, setTweak, onClose }) => (
  <div className="lens-panel" style={{ right: 22, bottom: 22, width: 320 }}>
    <div className="head">
      <div style={{ fontWeight: 600 }}>Tweaks</div>
      <button className="btn btn-ghost btn-sm" onClick={onClose}><Icon name="x" /></button>
    </div>
    <div className="body">
      <LensSection title="Density">
        <LensRow label="Layout density">
          <div className="seg">
            {["cozy", "comfortable", "compact"].map((k) => (
              <button key={k} className={tweaks.density === k ? "on" : ""} onClick={() => setTweak({ density: k })}>
                {k[0].toUpperCase() + k.slice(1)}
              </button>
            ))}
          </div>
        </LensRow>
      </LensSection>
      <LensSection title="Theme">
        <LensRow label="Mode">
          <div className="seg">
            {[["light", "Light"], ["dark", "Dark"]].map(([k, l]) => (
              <button key={k} className={tweaks.theme === k ? "on" : ""} onClick={() => setTweak({ theme: k })}>{l}</button>
            ))}
          </div>
        </LensRow>
      </LensSection>
      <div style={{ fontSize: 12, color: "var(--muted)" }}>
        Toggle Tweaks again to hide. Lens (accessibility) is separate — open from the floating button.
      </div>
    </div>
  </div>
);

// Expose globals
Object.assign(window, {
  Icon, AppContext, useApp, INITIAL_USER, MODULES, QUIZ_QUESTIONS,
  Sidebar, Topbar, LensFAB, LensPanel, useApplyLens, DEFAULT_LENS,
  TweaksPanel, useTweaks,
});
