/* global React, Icon, MODULES, QUIZ_QUESTIONS, ModuleCardTilt, ModIcon, diffClass, BadgeChip, QuizBurst, ScoreGauge, JourneyMap, Medallion */
// Modules list, Module detail, Quiz, Results, Progress, Profile

const { useState: useStateL, useEffect: useEffectL, useRef: useRefL, useMemo: useMemoL } = React;

// =================== MODULES LIST =============================================

function ModulesList({ setPage, lens }) {
  const [diff, setDiff] = useStateL("All");
  const [query, setQuery] = useStateL("");
  const filtered = MODULES.filter(m =>
    (diff === "All" || m.difficulty === diff) &&
    (query === "" || m.title.toLowerCase().includes(query.toLowerCase()))
  );
  return (
    <div className="page-enter" style={{ padding: "32px 40px", overflowY: "auto" }}>
      <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Library</div>
          <h1 className="h1">All modules</h1>
          <p style={{ color: "var(--muted)", marginTop: 6 }}>12 modules · 84 lessons · ~14 hours of content</p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: 11, color: "var(--muted)" }}><Icon name="search" /></span>
            <input className="input" placeholder="Search modules…" value={query} onChange={e => setQuery(e.target.value)} style={{ paddingLeft: 36, width: 260 }} />
          </div>
          <div className="seg">
            {["All", "Beginner", "Intermediate", "Advanced"].map(d => (
              <button key={d} className={diff === d ? "on" : ""} onClick={() => setDiff(d)}>{d}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Beginner Path emphasis card */}
      <div style={{
        display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 24, alignItems: "center",
        padding: "20px 24px", marginBottom: 24,
        borderRadius: 16, background: "var(--ink)", color: "var(--bg)"
      }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: "var(--py-yellow)", color: "var(--py-blue-d)", display: "grid", placeItems: "center" }}>
          <Icon name="sparkle" size={24} stroke={2} />
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".12em", color: "var(--py-yellow)" }}>Recommended path</div>
          <div style={{ fontSize: 19, fontWeight: 600, marginTop: 4 }}>The Beginner's Path — Modules 1–5 in order</div>
          <div style={{ fontSize: 13, color: "#C2C5CC", marginTop: 4 }}>Five connected modules. Roughly 6 hours. Earns the "Foundations" certificate.</div>
        </div>
        <button className="btn btn-yellow" onClick={() => setPage("module")}>Continue path</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {filtered.map(m => (
          <ModuleListCard key={m.id} m={m} onClick={() => setPage("module")} />
        ))}
      </div>
    </div>
  );
}

function ModuleListCard({ m, onClick }) {
  const ref = useRefL(null);
  const onMove = (e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.transform = `perspective(900px) rotateY(${(px - 0.5) * 6}deg) rotateX(${-(py - 0.5) * 6}deg)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = ""; };
  return (
    <div ref={ref} className="card card-hover" onMouseMove={onMove} onMouseLeave={onLeave} onClick={onClick} style={{ padding: 22, cursor: "pointer", position: "relative" }}>
      {m.progress >= 1 && (
        <div style={{ position: "absolute", top: 14, right: 14, display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 9px", background: "color-mix(in oklab, var(--success) 18%, var(--surface))", color: "#047857", borderRadius: 999, fontSize: 11.5, fontWeight: 600 }}>
          <Icon name="check" size={12} /> Done
        </div>
      )}
      {m.current && (
        <div style={{ position: "absolute", top: 14, right: 14, display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 9px", background: "var(--py-yellow)", color: "var(--py-blue-d)", borderRadius: 999, fontSize: 11.5, fontWeight: 600 }}>
          <Icon name="play" size={10} /> In progress
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <ModIcon color={m.color} icon={m.icon} />
        <div className={"tag " + diffClass(m.difficulty)}>{m.difficulty}</div>
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em", margin: 0 }}>{m.title}</h3>
      <p style={{ color: "var(--muted)", fontSize: 13.5, marginTop: 6, marginBottom: 16, lineHeight: 1.5 }}>{m.blurb}</p>
      <div className="progress-bar" style={{ marginBottom: 12 }}><span style={{ width: `${m.progress * 100}%` }} /></div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--muted)" }}>
        <span>{m.lessons} lessons · {m.duration}</span>
        <span>{Math.round(m.progress * 100)}%</span>
      </div>
    </div>
  );
}

// =================== MODULE DETAIL (full Python lesson) =====================
// Module 5 — Lists & Dictionaries. Lesson 5 — Iterating dictionaries.

function ModuleDetail({ setPage, lens }) {
  const [lessonIdx, setLessonIdx] = useStateL(4);
  const lessons = [
    { t: "Why sequences and mappings matter", done: true },
    { t: "Creating and indexing lists", done: true },
    { t: "Slicing and stride", done: true },
    { t: "List comprehensions", done: true },
    { t: "Iterating dictionaries", done: false, current: true },
    { t: "Mutating in place vs. copying", done: false },
    { t: "Dict comprehensions", done: false },
    { t: "Idiomatic patterns: getdefault, Counter, items", done: false },
  ];
  const cur = lessons[lessonIdx];

  return (
    <div className="page-enter" style={{ display: "grid", gridTemplateColumns: "1fr 320px", height: "calc(100vh - 0px)", overflow: "hidden" }}>
      {/* Lesson body */}
      <div style={{ overflowY: "auto", padding: "32px 48px 80px" }}>
        {/* Lesson header */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--muted)", marginBottom: 10 }}>
            <span className="tag int">Intermediate</span>
            <span>Module 5 · Lists & Dictionaries</span>
            <span>·</span>
            <span>Lesson {lessonIdx + 1} of {lessons.length}</span>
            <span>·</span>
            <span><Icon name="clock" size={12} /> 8 min read</span>
          </div>
          <h1 style={{ fontSize: 38, lineHeight: 1.15, letterSpacing: "-0.02em", fontWeight: 600, margin: 0 }}>
            Iterating dictionaries
          </h1>
          <p style={{ fontSize: 17, color: "var(--muted)", marginTop: 12, maxWidth: 680 }}>
            Dictionaries are everywhere in Python — JSON responses, configuration, frequency counts. The way you loop over them changes <em>what</em> you get back. Let's untangle <code style={{ fontFamily: "var(--font-mono)", background: "var(--bg-sunk)", padding: "1px 6px", borderRadius: 4 }}>keys()</code>, <code style={{ fontFamily: "var(--font-mono)", background: "var(--bg-sunk)", padding: "1px 6px", borderRadius: 4 }}>values()</code>, and <code style={{ fontFamily: "var(--font-mono)", background: "var(--bg-sunk)", padding: "1px 6px", borderRadius: 4 }}>items()</code>.
          </p>
        </div>

        {/* Audio narration bar — when Lens narration on */}
        {lens.narration && (
          <NarrationBar />
        )}

        <Prose>
          <h2>The default loop iterates keys</h2>
          <p>When you write a <code>for</code> loop over a dict, Python gives you the keys. This trips up almost everyone the first time, because the result looks like you're iterating "the dict itself".</p>
        </Prose>

        <CodeBlock
          lens={lens}
          altText="A simple dictionary called scores with three keys (Maya, Yusra, Pri) and integer values. A for-loop over scores prints each key, not the key-value pair."
          code={[
            ["scores", "op", " = {"],
            ["\"Maya\"", "str", ": ", "92", "num", ", ", "\"Yusra\"", "str", ": ", "88", "num", ", ", "\"Pri\"", "str", ": ", "75", "num", "}"],
            ["for", "kw", " name ", "in", "kw", " scores:"],
            ["    print", "fn", "(name)"],
            ["", "com", "# Maya"],
            ["", "com", "# Yusra"],
            ["", "com", "# Pri"],
          ]}
        />

        <Callout tone="blue" title="Read it as 'for each key in scores'">
          The dict object iterates the same way as <code>scores.keys()</code> does. They're equivalent — just write whichever is clearer.
        </Callout>

        <Prose>
          <h2>Use <code>.items()</code> when you want pairs</h2>
          <p>Most of the time you actually want <em>both</em> the key and its value. <code>.items()</code> yields a tuple per iteration — unpack it directly in the loop variables.</p>
        </Prose>

        <CodeBlock
          lens={lens}
          altText="The same scores dictionary; this for-loop iterates over scores.items() and unpacks each pair into name and score. The output joins each pair with a colon."
          code={[
            ["for", "kw", " name, score ", "in", "kw", " scores.", "items", "fn", "():"],
            ["    print", "fn", "(", "f\"{name}: {score}\"", "str", ")"],
            ["", "com", "# Maya: 92"],
            ["", "com", "# Yusra: 88"],
            ["", "com", "# Pri: 75"],
          ]}
        />

        <Prose>
          <h2>Counting with a dictionary</h2>
          <p>A classic pattern: count how many times each value appears in a sequence. The idiomatic way uses <code>dict.get()</code> with a default of <code>0</code>:</p>
        </Prose>

        <CodeBlock
          lens={lens}
          altText="A list of vote strings is reduced to a tally dictionary. For each vote we increment the existing count, defaulting to zero if the key isn't there yet."
          code={[
            ["votes", "op", " = [", "\"yes\"", "str", ", ", "\"no\"", "str", ", ", "\"yes\"", "str", ", ", "\"yes\"", "str", ", ", "\"abstain\"", "str", ", ", "\"no\"", "str", "]"],
            ["tally", "op", " = {}"],
            ["for", "kw", " v ", "in", "kw", " votes:"],
            ["    tally[v] = tally.", "get", "fn", "(v, ", "0", "num", ") + ", "1", "num"],
            ["print", "fn", "(tally)  ", "# {'yes': 3, 'no': 2, 'abstain': 1}", "com"],
          ]}
        />

        <Callout tone="yellow" title="Idiomatic shortcut">
          For counting, <code>collections.Counter(votes)</code> does the same thing in one line and gives you <code>.most_common()</code> for free. Save it for module 9.
        </Callout>

        <Prose>
          <h2>Try it</h2>
          <p>Below is a runnable playground. Tweak the dictionary and the loop — see what changes. Your edits won't break anything, and a reset button puts it back.</p>
        </Prose>

        <Playground />

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40, padding: "24px 0", borderTop: "1px solid var(--border)" }}>
          <button className="btn btn-secondary" onClick={() => setLessonIdx(Math.max(0, lessonIdx - 1))} disabled={lessonIdx === 0}>
            <Icon name="arrowLeft" size={14} /> Previous lesson
          </button>
          <button className="btn btn-yellow" onClick={() => setPage("quiz")}>
            <Icon name="check" size={14} /> Mark complete & take quiz
          </button>
          <button className="btn btn-primary" onClick={() => setLessonIdx(Math.min(lessons.length - 1, lessonIdx + 1))}>
            Next lesson <Icon name="arrowRight" size={14} />
          </button>
        </div>
      </div>

      {/* Side rail */}
      <aside style={{ borderLeft: "1px solid var(--border)", background: "var(--surface-2)", padding: "32px 24px", overflowY: "auto" }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>Lists & Dictionaries</div>
        <h3 className="h3" style={{ marginBottom: 14 }}>{Math.round((4 / lessons.length) * 100)}% complete</h3>
        <div className="progress-bar" style={{ marginBottom: 20 }}><span style={{ width: `${(4 / lessons.length) * 100}%` }} /></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {lessons.map((l, i) => (
            <div key={i}
              onClick={() => setLessonIdx(i)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", borderRadius: 8, cursor: "pointer",
                background: i === lessonIdx ? "var(--surface)" : "transparent",
                border: i === lessonIdx ? "1px solid var(--border-2)" : "1px solid transparent",
                fontSize: 13.5,
              }}>
              <span style={{
                width: 18, height: 18, borderRadius: 999,
                background: l.done ? "var(--success)" : i === lessonIdx ? "var(--py-yellow)" : "var(--bg-sunk)",
                color: l.done ? "white" : "var(--muted)",
                display: "grid", placeItems: "center", flexShrink: 0,
                fontSize: 11, fontWeight: 600,
              }}>
                {l.done ? <Icon name="check" size={10} stroke={2.5} /> : (i + 1)}
              </span>
              <span style={{ color: i === lessonIdx ? "var(--ink)" : "var(--ink-2)", fontWeight: i === lessonIdx ? 500 : 400 }}>
                {l.t}
              </span>
            </div>
          ))}
        </div>

        {lens.codeReader && (
          <div style={{ marginTop: 24, padding: "12px 14px", background: "color-mix(in oklab, var(--info) 12%, var(--surface))", borderRadius: 10, fontSize: 12, color: "var(--ink-2)", lineHeight: 1.55 }}>
            <strong style={{ display: "block", marginBottom: 4 }}>Code reader on</strong>
            Plain-English summaries appear above every snippet on this lesson.
          </div>
        )}

        {lens.asl && (
          <div style={{ marginTop: 16, padding: 14, background: "var(--bg-sunk)", borderRadius: 10 }}>
            <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 6 }}>ASL avatar</div>
            <div style={{ aspectRatio: "1 / 1", borderRadius: 8, background: "linear-gradient(135deg, #1A1A1F, #2C2A28)", display: "grid", placeItems: "center", color: "var(--py-yellow)" }}>
              <Icon name="handRaise" size={36} />
            </div>
            <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 8 }}>Signs along with the lesson narration.</div>
          </div>
        )}
      </aside>
    </div>
  );
}

const Prose = ({ children }) => (
  <div style={{ maxWidth: 720, fontSize: 16, lineHeight: 1.7, color: "var(--ink-2)" }}>
    <style>{`
      .prose-wrap h2 { font-size: 22px; line-height: 1.3; font-weight: 600; letter-spacing: -0.015em; margin: 36px 0 12px; color: var(--ink); }
      .prose-wrap p { margin: 0 0 14px; }
      .prose-wrap code { font-family: var(--font-mono); background: var(--bg-sunk); padding: 1px 6px; border-radius: 4px; font-size: 14.5px; }
    `}</style>
    <div className="prose-wrap">{children}</div>
  </div>
);

function CodeBlock({ code, altText, lens }) {
  const tokens = []; // array of [text, klass]
  // code is an array of rows; each row is alternating [text, klass, text, klass...]
  return (
    <div style={{ margin: "18px 0", maxWidth: 720 }}>
      {lens.codeReader && (
        <div style={{ marginBottom: 8, padding: "10px 14px", background: "color-mix(in oklab, var(--info) 10%, var(--surface))", borderRadius: 10, fontSize: 13, color: "var(--ink-2)", lineHeight: 1.55, borderLeft: "3px solid var(--info)" }}>
          <strong style={{ display: "block", marginBottom: 2, fontSize: 11, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--info)" }}>What this does</strong>
          {altText}
        </div>
      )}
      <pre className="code-block" style={{ margin: 0 }}>
        <code>
          {code.map((row, i) => (
            <div key={i}>
              {tokenize(row)}
            </div>
          ))}
        </code>
        <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 10, fontSize: 11, color: "#6B7895" }}>
          <span>Python 3.11</span>
          <button style={{ color: "#88D498", fontFamily: "var(--font-mono)", fontSize: 11 }}>▷ Run</button>
        </div>
      </pre>
    </div>
  );
}

function tokenize(row) {
  // row is an interleaved [text, klass?, text, klass?, ...].
  // klass is a known token class; if next item isn't a known class, treat current as plain text.
  if (typeof row === "string") return row;
  const known = new Set(["kw", "str", "com", "fn", "num", "op", "builtin"]);
  const out = [];
  let i = 0;
  while (i < row.length) {
    const text = row[i];
    const next = row[i + 1];
    if (typeof next === "string" && known.has(next)) {
      out.push(<span key={i} className={next}>{text}</span>);
      i += 2;
    } else {
      out.push(<React.Fragment key={i}>{text}</React.Fragment>);
      i += 1;
    }
  }
  return out;
}

const Callout = ({ tone = "blue", title, children }) => {
  const colorMap = {
    blue: { bg: "color-mix(in oklab, var(--py-blue) 10%, var(--surface))", border: "var(--py-blue)" },
    yellow: { bg: "color-mix(in oklab, var(--py-yellow) 18%, var(--surface))", border: "var(--py-yellow-d)" },
    green: { bg: "color-mix(in oklab, var(--success) 12%, var(--surface))", border: "var(--success)" },
  };
  const c = colorMap[tone];
  return (
    <div style={{
      margin: "20px 0", padding: "14px 18px", background: c.bg, borderLeft: `3px solid ${c.border}`,
      borderRadius: "0 10px 10px 0", maxWidth: 720,
    }}>
      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, color: "var(--ink)" }}>{title}</div>
      <div style={{ fontSize: 14, lineHeight: 1.55, color: "var(--ink-2)" }}>{children}</div>
    </div>
  );
};

const NarrationBar = () => (
  <div style={{
    position: "sticky", top: 12, zIndex: 4,
    display: "flex", alignItems: "center", gap: 14, padding: "10px 16px",
    background: "var(--ink)", color: "var(--bg)", borderRadius: 12, marginBottom: 24, maxWidth: 720,
  }}>
    <button style={{ width: 32, height: 32, borderRadius: 999, background: "var(--py-yellow)", color: "var(--py-blue-d)", display: "grid", placeItems: "center" }}>
      <Icon name="play" size={11} />
    </button>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginBottom: 4 }}>0:00 / 4:12 · Iterating dictionaries</div>
      <div style={{ height: 4, background: "rgba(255,255,255,0.15)", borderRadius: 999, overflow: "hidden" }}>
        <div style={{ width: "18%", height: "100%", background: "var(--py-yellow)" }} />
      </div>
    </div>
    <div style={{ display: "flex", gap: 6 }}>
      {["0.75x", "1x", "1.25x"].map(s => (
        <button key={s} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 999, background: s === "1x" ? "rgba(255,255,255,0.18)" : "transparent", color: "rgba(255,255,255,0.85)" }}>{s}</button>
      ))}
    </div>
  </div>
);

function Playground() {
  const [code, setCode] = useStateL(`scores = {"Maya": 92, "Yusra": 88, "Pri": 75}
for name, score in scores.items():
    print(f"{name}: {score}")`);
  const [output, setOutput] = useStateL("Maya: 92\nYusra: 88\nPri: 75");
  const run = () => {
    // Mock runner — interprets a couple of patterns
    setOutput("Maya: 92\nYusra: 88\nPri: 75");
  };
  return (
    <div style={{ maxWidth: 720, marginTop: 18, marginBottom: 28, border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", background: "var(--surface)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "var(--bg-sunk)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
          <Icon name="play2" size={12} /> playground.py
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setCode("scores = {}\nfor k, v in scores.items():\n    print(k, v)")}>Reset</button>
          <button className="btn btn-primary btn-sm" onClick={run}><Icon name="play" size={10} /> Run</button>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        <textarea
          value={code}
          onChange={e => setCode(e.target.value)}
          spellCheck={false}
          style={{
            border: 0, outline: 0, resize: "none",
            background: "#0F1729", color: "#E8EAEE",
            fontFamily: "var(--font-mono)", fontSize: 13.5, lineHeight: 1.6,
            padding: 16, minHeight: 200,
          }}
        />
        <div style={{ background: "#0B1220", color: "#88D498", fontFamily: "var(--font-mono)", fontSize: 13, padding: 16, whiteSpace: "pre-wrap", borderLeft: "1px solid #1B2540" }}>
          <div style={{ color: "#6B7895", fontSize: 11, marginBottom: 8 }}># output</div>
          {output}
        </div>
      </div>
    </div>
  );
}

// =================== QUIZ =====================================================

function QuizPage({ setPage, lens }) {
  const [idx, setIdx] = useStateL(0);
  const [picked, setPicked] = useStateL(null);
  const [submitted, setSubmitted] = useStateL(false);
  const [answers, setAnswers] = useStateL([]); // [{ q, picked, correct }]
  const [timeLeft, setTimeLeft] = useStateL(15 * 60); // 15 minutes
  const [burst, setBurst] = useStateL({ trigger: 0, kind: "correct" });
  const [codeInput, setCodeInput] = useStateL("");
  const q = QUIZ_QUESTIONS[idx];

  useEffectL(() => {
    if (timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [timeLeft]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  const submit = () => {
    let correct = false;
    if (q.kind === "mcq") {
      correct = picked === q.answer;
    } else {
      correct = codeInput.trim().toLowerCase() === q.blank.toLowerCase();
    }
    setBurst({ trigger: burst.trigger + 1, kind: correct ? "correct" : "wrong" });
    setSubmitted(true);
    setAnswers([...answers, { idx, picked, codeInput, correct }]);
  };

  const next = () => {
    if (idx >= QUIZ_QUESTIONS.length - 1) {
      // Compute score, go to results
      window.__quizScore = (answers.length / QUIZ_QUESTIONS.length);
      setPage("results");
      return;
    }
    setIdx(idx + 1);
    setPicked(null);
    setSubmitted(false);
    setCodeInput("");
  };

  return (
    <div className="page-enter" style={{ height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* Quiz header */}
      <header style={{ padding: "20px 40px", borderBottom: "1px solid var(--border)", background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setPage("module")}><Icon name="arrowLeft" size={14} /> Exit</button>
          <div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>Lists & Dictionaries · Checkpoint quiz</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Question {idx + 1} of {QUIZ_QUESTIONS.length}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: "var(--bg-sunk)", borderRadius: 999, fontSize: 13, fontFamily: "var(--font-mono)", fontWeight: 500 }}>
            <Icon name="clock" size={13} /> {minutes}:{seconds}
          </div>
          <div style={{ width: 260, height: 6, background: "var(--bg-sunk)", borderRadius: 999, overflow: "hidden" }}>
            <div style={{ width: `${((idx + (submitted ? 1 : 0)) / QUIZ_QUESTIONS.length) * 100}%`, height: "100%", background: "linear-gradient(90deg, var(--py-blue), var(--py-yellow))", transition: "width .35s var(--easing)" }} />
          </div>
        </div>
      </header>

      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 280px", overflow: "hidden" }}>
        {/* Question area */}
        <div style={{ padding: "48px 56px", overflowY: "auto", display: "flex", flexDirection: "column", maxWidth: 880, margin: "0 auto", width: "100%", position: "relative" }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>{q.kind === "code" ? "Code completion" : "Multiple choice"}</div>
          <h1 style={{ fontSize: 28, lineHeight: 1.35, fontWeight: 600, letterSpacing: "-0.015em", margin: 0 }} dangerouslySetInnerHTML={{ __html: q.prompt.replace(/`([^`]+)`/g, '<code style="font-family:var(--font-mono);background:var(--bg-sunk);padding:2px 8px;border-radius:5px;font-size:0.85em">$1</code>') }} />

          {q.kind === "mcq" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 32, position: "relative" }}>
              {q.options.map((opt, i) => {
                const isPicked = picked === i;
                const isCorrect = i === q.answer;
                let style = {};
                if (submitted) {
                  if (isCorrect) style = { borderColor: "var(--success)", background: "color-mix(in oklab, var(--success) 8%, var(--surface))" };
                  else if (isPicked) style = { borderColor: "var(--error)", background: "color-mix(in oklab, var(--error) 8%, var(--surface))" };
                } else if (isPicked) {
                  style = { borderColor: "var(--py-blue)", background: "color-mix(in oklab, var(--py-blue) 6%, var(--surface))" };
                }
                return (
                  <button
                    key={i}
                    onClick={() => !submitted && setPicked(i)}
                    disabled={submitted}
                    style={{
                      textAlign: "left", padding: "16px 20px", borderRadius: 12,
                      border: "1.5px solid var(--border)", background: "var(--surface)",
                      display: "flex", alignItems: "center", gap: 14,
                      transition: "all .15s var(--easing)", cursor: submitted ? "default" : "pointer",
                      ...style,
                    }}
                  >
                    <span style={{
                      width: 28, height: 28, borderRadius: 8,
                      background: isPicked || (submitted && isCorrect) ? "var(--ink)" : "var(--bg-sunk)",
                      color: isPicked || (submitted && isCorrect) ? "var(--py-yellow)" : "var(--muted)",
                      display: "grid", placeItems: "center", fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 13,
                      flexShrink: 0,
                    }}>{String.fromCharCode(65 + i)}</span>
                    <span style={{ fontSize: 16, fontFamily: opt.startsWith("<") || opt.startsWith("`") ? "var(--font-mono)" : "var(--font-sans)" }}
                      dangerouslySetInnerHTML={{ __html: opt.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/`([^`]+)`/g, '<span style="font-family:var(--font-mono)">$1</span>') }} />
                    {submitted && isCorrect && (
                      <span style={{ marginLeft: "auto", color: "var(--success)" }}><Icon name="check" size={18} stroke={2.5} /></span>
                    )}
                    {submitted && isPicked && !isCorrect && (
                      <span style={{ marginLeft: "auto", color: "var(--error)" }}><Icon name="x" size={18} stroke={2.5} /></span>
                    )}
                  </button>
                );
              })}
              {/* 3D burst overlay */}
              {submitted && (
                <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                  <QuizBurst trigger={burst.trigger} kind={burst.kind} />
                </div>
              )}
            </div>
          ) : (
            <div style={{ marginTop: 28 }}>
              <pre className="code-block" style={{ margin: 0, fontSize: 15, lineHeight: 1.7 }}>
                <code>
                  {q.starter.split("___").map((part, i, arr) => (
                    <React.Fragment key={i}>
                      {part}
                      {i < arr.length - 1 && (
                        <input
                          value={codeInput}
                          onChange={e => setCodeInput(e.target.value)}
                          disabled={submitted}
                          autoFocus
                          style={{
                            display: "inline-block", width: 60, padding: "2px 8px",
                            background: submitted ? (codeInput.trim().toLowerCase() === q.blank ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)") : "rgba(255,212,59,0.18)",
                            border: "1px solid " + (submitted ? (codeInput.trim().toLowerCase() === q.blank ? "var(--success)" : "var(--error)") : "var(--py-yellow)"),
                            borderRadius: 6, color: "#FFD43B", fontFamily: "var(--font-mono)", fontSize: "inherit",
                          }}
                          placeholder="…"
                        />
                      )}
                    </React.Fragment>
                  ))}
                </code>
              </pre>
            </div>
          )}

          {submitted && (
            <div className="page-enter" style={{
              marginTop: 28, padding: "16px 20px", borderRadius: 12,
              background: answers[answers.length - 1]?.correct ? "color-mix(in oklab, var(--success) 12%, var(--surface))" : "color-mix(in oklab, var(--py-blue) 8%, var(--surface))",
              borderLeft: `3px solid ${answers[answers.length - 1]?.correct ? "var(--success)" : "var(--py-blue)"}`,
            }}>
              <div style={{ fontWeight: 600, marginBottom: 6, color: answers[answers.length - 1]?.correct ? "#047857" : "var(--py-blue-d)" }}>
                {answers[answers.length - 1]?.correct ? "Nice — that's the one." : "Not quite."}
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.55, color: "var(--ink-2)" }}>{q.explain}</div>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "auto", paddingTop: 40 }}>
            <button className="btn btn-ghost" onClick={() => { setIdx(Math.max(0, idx - 1)); setPicked(null); setSubmitted(false); }} disabled={idx === 0}>
              <Icon name="arrowLeft" size={14} /> Previous
            </button>
            {!submitted ? (
              <button className="btn btn-yellow btn-lg" onClick={submit} disabled={q.kind === "mcq" ? picked === null : codeInput === ""}>
                Submit answer <Icon name="check" size={14} />
              </button>
            ) : (
              <button className="btn btn-primary btn-lg" onClick={next}>
                {idx === QUIZ_QUESTIONS.length - 1 ? "See your results" : "Next question"} <Icon name="arrowRight" size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Side overview */}
        <aside style={{ borderLeft: "1px solid var(--border)", background: "var(--surface-2)", padding: "32px 24px", overflowY: "auto" }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>Question map</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6, marginBottom: 24 }}>
            {QUIZ_QUESTIONS.map((_, i) => {
              const a = answers.find(an => an.idx === i);
              const isCurrent = i === idx;
              return (
                <div key={i} style={{
                  aspectRatio: "1 / 1", borderRadius: 8,
                  display: "grid", placeItems: "center", fontSize: 12, fontWeight: 600,
                  background: a ? (a.correct ? "var(--success)" : "var(--error)") : isCurrent ? "var(--py-yellow)" : "var(--bg-sunk)",
                  color: a ? "white" : isCurrent ? "var(--py-blue-d)" : "var(--muted)",
                  border: isCurrent ? "2px solid var(--ink)" : "1px solid var(--border)",
                }}>{i + 1}</div>
              );
            })}
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.55, marginBottom: 18 }}>
            You can submit each question once. Wrong answers don't end the quiz — explanations follow every choice.
          </div>
          <div style={{ padding: 14, background: "var(--bg-sunk)", borderRadius: 10, fontSize: 12, color: "var(--ink-2)", lineHeight: 1.5 }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Need a hint?</div>
            Hints don't lower your score, but using one is logged on your profile.
            <button className="btn btn-secondary btn-sm" style={{ marginTop: 10 }}>
              <Icon name="lightbulb" size={12} /> Get a hint
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

// =================== QUIZ RESULTS =============================================

function QuizResults({ setPage, lens }) {
  const score = window.__quizScore || 0.7;
  const correct = Math.round(score * QUIZ_QUESTIONS.length);
  return (
    <div className="page-enter" style={{ padding: "40px 48px", overflowY: "auto", height: "100vh" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 28, maxWidth: 1100, margin: "0 auto" }}>
        <div className="card" style={{ padding: 36 }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Quiz complete · Lists & Dictionaries</div>
          <h1 style={{ fontSize: 44, fontWeight: 600, letterSpacing: "-0.02em", margin: 0, lineHeight: 1.1 }}>
            {score >= 0.9 ? "Outstanding."
             : score >= 0.75 ? "Solid work."
             : score >= 0.6 ? "Getting there."
             : "Worth another pass."}
          </h1>
          <p style={{ fontSize: 16, color: "var(--muted)", marginTop: 12, lineHeight: 1.55 }}>
            You answered <strong style={{ color: "var(--ink)" }}>{correct} of {QUIZ_QUESTIONS.length}</strong> correctly. Your strongest area was <em>dictionary iteration</em>; you stumbled most on <em>mutability aliasing</em> — revisit lesson 6.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 24 }}>
            <ResultStat label="Accuracy" value={Math.round(score * 100) + "%"} />
            <ResultStat label="Time" value="9:42" />
            <ResultStat label="XP earned" value={"+" + (correct * 18)} />
          </div>

          <div style={{ marginTop: 28 }}>
            <div className="eyebrow" style={{ marginBottom: 12 }}>Per-question breakdown</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 6, marginBottom: 16 }}>
              {QUIZ_QUESTIONS.map((q, i) => {
                const ok = Math.random() < score; // approx
                return (
                  <div key={i} className="tt" data-tt={`Q${i + 1}: ${ok ? "correct" : "incorrect"}`} style={{
                    aspectRatio: "1 / 1", borderRadius: 6,
                    background: ok ? "var(--success)" : "var(--error)",
                    display: "grid", placeItems: "center", color: "white", fontSize: 11, fontWeight: 600,
                  }}>{i + 1}</div>
                );
              })}
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
            <button className="btn btn-yellow" onClick={() => setPage("quiz")}>
              <Icon name="bolt" size={13} /> Retry quiz
            </button>
            <button className="btn btn-secondary" onClick={() => setPage("module")}>
              <Icon name="book" size={13} /> Back to lesson
            </button>
            <button className="btn btn-ghost" onClick={() => setPage("progress")}>
              View progress <Icon name="arrowRight" size={13} />
            </button>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card" style={{ padding: 24, textAlign: "center", position: "relative" }}>
            <div className="eyebrow">Score</div>
            <div style={{ height: 240, position: "relative", margin: "-10px 0" }}>
              {lens.motion === "calm" ? (
                <div style={{ display: "grid", placeItems: "center", height: "100%" }}>
                  <div style={{ fontSize: 64, fontWeight: 600, letterSpacing: "-0.03em", color: "var(--py-blue-d)" }}>{Math.round(score * 100)}%</div>
                </div>
              ) : (
                <>
                  <ScoreGauge score={score} />
                  <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", pointerEvents: "none" }}>
                    <div style={{ fontSize: 44, fontWeight: 600, letterSpacing: "-0.02em" }}>{Math.round(score * 100)}<span style={{ fontSize: 18, color: "var(--muted)" }}>%</span></div>
                  </div>
                </>
              )}
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>3D · Radial gauge fills in sync with the number</div>
          </div>

          {score >= 0.75 && (
            <div className="card" style={{ padding: 24, background: "var(--ink)", color: "var(--bg)", textAlign: "center" }}>
              <div className="eyebrow" style={{ color: "var(--py-yellow)" }}>Badge unlocked</div>
              <div style={{ height: 160 }}>
                {lens.motion === "calm"
                  ? <div style={{ display: "grid", placeItems: "center", height: "100%", color: "var(--py-yellow)" }}><Icon name="award" size={64} /></div>
                  : <Medallion tone="yellow" />}
              </div>
              <div style={{ fontWeight: 600, fontSize: 16, marginTop: 6 }}>Mapping Maestro</div>
              <div style={{ fontSize: 12, color: "#C2C5CC", marginTop: 2 }}>Scored ≥ 75% on dictionary iteration</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const ResultStat = ({ label, value }) => (
  <div style={{ padding: "14px 16px", background: "var(--bg-sunk)", borderRadius: 12 }}>
    <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 600 }}>{label}</div>
    <div style={{ fontSize: 22, fontWeight: 600, marginTop: 2, letterSpacing: "-0.02em" }}>{value}</div>
  </div>
);

// =================== PROGRESS PAGE ============================================

function ProgressPage({ setPage, lens }) {
  const journeyNodes = MODULES.map(m => ({
    id: m.id, title: m.title, difficulty: m.difficulty,
    status: m.progress >= 1 ? "done" : m.progress > 0 ? "current" : "locked",
  }));
  const [focus, setFocus] = useStateL(null);

  return (
    <div className="page-enter" style={{ padding: "32px 40px", overflowY: "auto" }}>
      <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Your journey</div>
          <h1 className="h1">Learning progress</h1>
          <p style={{ color: "var(--muted)", marginTop: 6 }}>4 complete · 1 in progress · 7 ahead</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-secondary"><Icon name="download" size={13} /> Export transcript</button>
        </div>
      </div>

      {/* Journey constellation */}
      <div className="card" style={{ padding: 0, overflow: "hidden", marginBottom: 24, position: "relative" }}>
        <div style={{ height: 360, background: "linear-gradient(180deg, var(--surface) 0%, var(--surface-2) 100%)" }}>
          {lens.motion === "calm" ? (
            <JourneyPoster />
          ) : (
            <JourneyMap nodes={journeyNodes} onNodeClick={setFocus} />
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 24px", borderTop: "1px solid var(--border)", fontSize: 12, color: "var(--muted)" }}>
          <span>3D · Constellation of all modules. Click a node to focus. Locked nodes float slightly above the path.</span>
          <div style={{ display: "flex", gap: 16 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--py-blue)" }} /> Done</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--py-yellow)" }} /> Current</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--muted-2)" }} /> Locked</span>
          </div>
        </div>
        {focus && (
          <div style={{ position: "absolute", left: 24, bottom: 64, padding: "14px 18px", background: "var(--ink)", color: "var(--bg)", borderRadius: 12, maxWidth: 320, fontSize: 13.5 }}>
            <div style={{ fontWeight: 600, fontSize: 15 }}>{focus.title}</div>
            <div style={{ fontSize: 12, color: "#C2C5CC", marginTop: 2 }}>{focus.difficulty} · {focus.status}</div>
            <button className="btn btn-yellow btn-sm" style={{ marginTop: 10 }} onClick={() => setPage("module")}>Open module</button>
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 16 }}>
        <div className="card" style={{ padding: 24 }}>
          <h2 className="h2" style={{ marginBottom: 16 }}>Module-by-module</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {MODULES.map((m, i) => (
              <div key={m.id} style={{ display: "grid", gridTemplateColumns: "auto 1fr auto auto", gap: 14, alignItems: "center", padding: "12px 8px", borderBottom: i < MODULES.length - 1 ? "1px solid var(--hairline)" : "none" }}>
                <div style={{ width: 32, color: "var(--muted)", fontFamily: "var(--font-mono)", fontSize: 13 }}>{String(i + 1).padStart(2, "0")}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{m.title}</div>
                  <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                    <div className={"tag " + diffClass(m.difficulty)} style={{ fontSize: 10.5 }}>{m.difficulty}</div>
                    <span style={{ fontSize: 11.5, color: "var(--muted)" }}>{m.lessons} lessons · {m.duration}</span>
                  </div>
                </div>
                <div style={{ width: 140 }}>
                  <div className="progress-bar"><span style={{ width: `${m.progress * 100}%` }} /></div>
                </div>
                <div style={{ width: 48, textAlign: "right", fontSize: 12.5, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>{Math.round(m.progress * 100)}%</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card" style={{ padding: 24 }}>
            <h2 className="h2" style={{ marginBottom: 14 }}>Certificates</h2>
            <div style={{
              padding: "20px 18px", borderRadius: 12,
              background: "linear-gradient(135deg, color-mix(in oklab, var(--py-yellow) 30%, var(--surface)), var(--surface))",
              border: "1px solid color-mix(in oklab, var(--py-yellow-d) 30%, var(--border))",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div className="eyebrow" style={{ color: "var(--py-blue-d)" }}>Track 1</div>
                  <div style={{ fontSize: 18, fontWeight: 600, marginTop: 4 }}>Python Foundations</div>
                  <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>Earned May 9, 2026 · Modules 1–4</div>
                </div>
                <div style={{ color: "var(--py-blue-d)" }}><Icon name="award" size={42} stroke={1.5} /></div>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <button className="btn btn-primary btn-sm"><Icon name="download" size={12} /> Download PDF</button>
                <button className="btn btn-secondary btn-sm">Share</button>
              </div>
            </div>
            <div style={{ marginTop: 14, padding: "16px 18px", borderRadius: 12, background: "var(--bg-sunk)", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--surface)", color: "var(--muted)", display: "grid", placeItems: "center" }}><Icon name="award" size={20} /></div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>Intermediate Python</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>3 of 6 modules · ~5 hours left</div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 24 }}>
            <h2 className="h2" style={{ marginBottom: 14 }}>Badge collection</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              {["First Function","5-Day Streak","Loop Master","OOP Apprentice","Mapping Maestro","Quiz Streak","Night Owl","Comeback"].map((b, i) => (
                <BadgeChip key={b} label={b} idx={i} locked={i >= 4} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const JourneyPoster = () => (
  <div style={{ height: "100%", display: "grid", placeItems: "center", background: "repeating-linear-gradient(45deg, var(--surface), var(--surface) 10px, var(--surface-2) 10px, var(--surface-2) 20px)" }}>
    <div style={{ textAlign: "center", color: "var(--muted)" }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>// Calm mode — static map</div>
      <div style={{ fontSize: 13, marginTop: 8, maxWidth: 360 }}>A constellation of 12 modules connected by a winding path. Completed nodes glow blue; current node glows yellow; locked nodes are dim.</div>
    </div>
  </div>
);

// =================== PROFILE ==================================================

function ProfilePage({ setPage, user, lens }) {
  const [editing, setEditing] = useStateL(false);
  return (
    <div className="page-enter" style={{ padding: "32px 40px", overflowY: "auto", maxWidth: 1100, margin: "0 auto", width: "100%" }}>
      <div className="card" style={{ padding: 32, display: "flex", gap: 28, alignItems: "center", marginBottom: 20 }}>
        <div className="avatar lg" style={{ background: "var(--py-blue)" }}>{user.initials}</div>
        <div style={{ flex: 1 }}>
          <h1 className="h1">{user.name}</h1>
          <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 4 }}>{user.email} · Joined {user.joined}</div>
          <div style={{ display: "flex", gap: 16, marginTop: 14, fontSize: 13 }}>
            <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}><Icon name="flame" size={14} stroke={1.8} /> {user.streak}-day streak</span>
            <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}><Icon name="bolt" size={14} stroke={1.8} /> Level {user.level}</span>
            <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}><Icon name="award" size={14} stroke={1.8} /> {user.badges.length} badges</span>
          </div>
        </div>
        <button className="btn btn-secondary" onClick={() => setEditing(!editing)}>
          <Icon name="edit" size={13} /> {editing ? "Cancel" : "Edit profile"}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: editing ? "1fr 1fr" : "2fr 1fr", gap: 16 }}>
        <div className="card" style={{ padding: 28 }}>
          <h2 className="h2" style={{ marginBottom: 16 }}>{editing ? "Edit profile" : "About"}</h2>
          {editing ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Field label="Display name" value={user.name} />
              <Field label="Email" value={user.email} />
              <Field label="Bio" value="Year-2 Software Engineering student at APU. Learning Python for a thesis project on text analytics." textarea />
              <Field label="Goal" value="Finish all 12 modules by end of Semester 2" />
              <Field label="Country" value="Malaysia" />
              <Field label="Pronouns" value="she/her" />
              <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                <button className="btn btn-yellow"><Icon name="save" size={13} /> Save changes</button>
                <button className="btn btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: 14.5, color: "var(--ink-2)", lineHeight: 1.7 }}>
              <p>Year-2 Software Engineering student at APU. Learning Python for a thesis project on text analytics. Coffee, Pomodoros, and the occasional <code style={{ fontFamily: "var(--font-mono)", background: "var(--bg-sunk)", padding: "1px 5px", borderRadius: 4 }}>print()</code>-driven debugging session.</p>
              <p style={{ marginTop: 12 }}><strong>Current goal:</strong> Finish all 12 modules by end of Semester 2.</p>
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card" style={{ padding: 24 }}>
            <h3 className="h3" style={{ marginBottom: 14 }}>Stats</h3>
            <Row k="Modules" v={`${user.modulesCompleted} / ${user.modulesTotal}`} />
            <Row k="Lessons" v="26 / 84" />
            <Row k="Quizzes taken" v="14" />
            <Row k="Avg. accuracy" v="82%" />
            <Row k="Hours learning" v="9h 22m" />
          </div>

          <div className="card" style={{ padding: 24 }}>
            <h3 className="h3" style={{ marginBottom: 14 }}>Recent activity</h3>
            <Activity t="Completed lesson" sub="Slicing and stride · 2h ago" />
            <Activity t="Scored 95% on quiz" sub="Control Flow checkpoint · yesterday" />
            <Activity t="Earned badge" sub="Loop Master · 3 days ago" />
            <Activity t="Joined" sub="Feb 12 · Welcome 🎉" />
          </div>
        </div>
      </div>
    </div>
  );
}

const Row = ({ k, v }) => (
  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 13.5, borderTop: "1px solid var(--hairline)" }}>
    <span style={{ color: "var(--muted)" }}>{k}</span>
    <strong style={{ color: "var(--ink)" }}>{v}</strong>
  </div>
);

const Activity = ({ t, sub }) => (
  <div style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 0", borderTop: "1px solid var(--hairline)" }}>
    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--py-yellow)", marginTop: 6, flexShrink: 0 }} />
    <div>
      <div style={{ fontSize: 13.5, fontWeight: 500 }}>{t}</div>
      <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 1 }}>{sub}</div>
    </div>
  </div>
);

const Field = ({ label, value, textarea }) => (
  <label style={{ display: "block" }}>
    <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 5, fontWeight: 500 }}>{label}</div>
    {textarea
      ? <textarea defaultValue={value} className="input" style={{ minHeight: 70 }} />
      : <input defaultValue={value} className="input" />}
  </label>
);

Object.assign(window, { ModulesList, ModuleDetail, QuizPage, QuizResults, ProgressPage, ProfilePage });
