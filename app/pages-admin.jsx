/* global React, Icon, MODULES, QUIZ_QUESTIONS */
// Admin pages: Dashboard, Manage Users, Manage Modules, Manage Quizzes, Reports

const { useState: useStateA, useEffect: useEffectA, useMemo: useMemoA, useRef: useRefA } = React;

const USERS = [
  { id: "u1", name: "Maya Chen", email: "maya.chen@apu.edu.my", role: "Student", segment: "University", joined: "Feb 2026", progress: 0.45, lastActive: "2h ago", status: "active" },
  { id: "u2", name: "Yusra Abdullah", email: "yusra.a@gmail.com", role: "Student", segment: "Self-learner", joined: "Mar 2026", progress: 0.78, lastActive: "1d ago", status: "active" },
  { id: "u3", name: "Daniel Rivera", email: "danr@apu.edu.my", role: "Student", segment: "School", joined: "Jan 2026", progress: 0.20, lastActive: "5d ago", status: "active" },
  { id: "u4", name: "Priya Maharaj", email: "priya.m@outlook.com", role: "Student", segment: "Self-learner", joined: "Apr 2026", progress: 0.62, lastActive: "30m ago", status: "active" },
  { id: "u5", name: "Tan Wei Han", email: "weihan@apu.edu.my", role: "Student", segment: "University", joined: "Feb 2026", progress: 0.91, lastActive: "12m ago", status: "active" },
  { id: "u6", name: "Carla Mendez", email: "cmendez@apu.edu.my", role: "Student", segment: "University", joined: "Feb 2026", progress: 0.08, lastActive: "3w ago", status: "dormant" },
  { id: "u7", name: "Ash Yamamoto", email: "ash.y@gmail.com", role: "Student", segment: "Self-learner", joined: "Mar 2026", progress: 0.55, lastActive: "4h ago", status: "active" },
  { id: "u8", name: "Liam O'Connor", email: "loc@school.edu", role: "Student", segment: "School", joined: "Apr 2026", progress: 0.34, lastActive: "1d ago", status: "active" },
  { id: "u9", name: "Fatima Aziz", email: "f.aziz@apu.edu.my", role: "Student", segment: "University", joined: "Mar 2026", progress: 0.71, lastActive: "1h ago", status: "active" },
  { id: "u10", name: "Sam Park", email: "spark@nextfund.io", role: "Student", segment: "Self-learner", joined: "Jan 2026", progress: 1.0, lastActive: "yesterday", status: "active" },
  { id: "u11", name: "Hana Mori", email: "hmori@apu.edu.my", role: "Student", segment: "University", joined: "Feb 2026", progress: 0.15, lastActive: "1w ago", status: "active" },
  { id: "u12", name: "Joaquín Vega", email: "jv@school.edu", role: "Student", segment: "School", joined: "Mar 2026", progress: 0.42, lastActive: "yesterday", status: "active" },
];

// =================== ADMIN DASHBOARD =========================================

function AdminDashboard({ setPage }) {
  return (
    <div className="page-enter" style={{ padding: "28px 32px", overflowY: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 22 }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 4 }}>System overview</div>
          <h1 className="h1">Admin dashboard</h1>
          <p style={{ color: "var(--muted)", marginTop: 4, fontSize: 14 }}>Tuesday, May 13 2026 — week 19</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div className="seg">
            <button className="on">7d</button><button>30d</button><button>90d</button><button>YTD</button>
          </div>
          <button className="btn btn-secondary"><Icon name="download" size={13} /> Export</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 18 }}>
        <AdminKPI label="Total learners" value="2,148" delta="+128" sub="vs last week" icon="user" />
        <AdminKPI label="Active this week" value="1,432" delta="+12%" sub="of total" icon="flame" />
        <AdminKPI label="Quizzes attempted" value="6,210" delta="+8%" sub="avg 82%" icon="quiz" />
        <AdminKPI label="Certificates issued" value="84" delta="+11" sub="Foundations track" icon="award" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16, marginBottom: 16 }}>
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h2 className="h2">Learner activity</h2>
            <div className="seg">
              <button className="on">Active users</button>
              <button>Lessons</button>
              <button>Quizzes</button>
            </div>
          </div>
          <ActivityChart />
          <div style={{ display: "flex", gap: 24, fontSize: 12, color: "var(--muted)", marginTop: 12 }}>
            <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}><span style={{ width: 10, height: 10, borderRadius: 2, background: "var(--py-blue)" }} /> Active learners</span>
            <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}><span style={{ width: 10, height: 10, borderRadius: 2, background: "var(--py-yellow)" }} /> Quiz attempts</span>
          </div>
        </div>
        <div className="card" style={{ padding: 24 }}>
          <h2 className="h2" style={{ marginBottom: 14 }}>Audience mix</h2>
          <DonutMix data={[
            { l: "University", v: 0.42, c: "var(--py-blue)" },
            { l: "School", v: 0.28, c: "var(--py-yellow)" },
            { l: "Self-learner", v: 0.30, c: "var(--diff-adv)" },
          ]} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        <div className="card" style={{ padding: 24 }}>
          <h3 className="h3" style={{ marginBottom: 14 }}>Top modules</h3>
          {[
            { m: "Variables & Data Types", c: 1812, p: 1.0 },
            { m: "Control Flow", c: 1644, p: 0.92 },
            { m: "Functions", c: 1450, p: 0.78 },
            { m: "Lists & Dictionaries", c: 1108, p: 0.62 },
            { m: "OOP Basics", c: 624, p: 0.31 },
          ].map((r, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, padding: "10px 0", borderTop: i === 0 ? "none" : "1px solid var(--hairline)" }}>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 500 }}>{r.m}</div>
                <div className="progress-bar" style={{ marginTop: 6 }}><span style={{ width: `${r.p * 100}%` }} /></div>
              </div>
              <div style={{ textAlign: "right", fontSize: 12, color: "var(--muted)" }}>
                <div style={{ fontWeight: 600, color: "var(--ink)" }}>{r.c.toLocaleString()}</div>
                <div>learners</div>
              </div>
            </div>
          ))}
        </div>
        <div className="card" style={{ padding: 24 }}>
          <h3 className="h3" style={{ marginBottom: 14 }}>Hardest questions</h3>
          {[
            { q: "Q4 · Iterating dicts with .items()", acc: 0.42 },
            { q: "Q8 · List aliasing & mutation", acc: 0.51 },
            { q: "Q7 · Dict union operator |", acc: 0.58 },
            { q: "Q2 · Mutable sequences", acc: 0.64 },
            { q: "Q9 · range(2,10,3)", acc: 0.69 },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: i === 0 ? "none" : "1px solid var(--hairline)", fontSize: 13.5 }}>
              <span>{r.q}</span>
              <span style={{ fontWeight: 600, color: r.acc < 0.5 ? "var(--error)" : r.acc < 0.65 ? "var(--warning)" : "var(--success)" }}>{Math.round(r.acc * 100)}%</span>
            </div>
          ))}
        </div>
        <div className="card" style={{ padding: 24 }}>
          <h3 className="h3" style={{ marginBottom: 14 }}>Recent admin actions</h3>
          {[
            { t: "Added quiz 'Async basics'", w: "Ms. Lim", a: "2h ago" },
            { t: "Edited module 'OOP Basics'", w: "Ms. Lim", a: "5h ago" },
            { t: "Suspended user 'spam_acc_141'", w: "Mr. Tan", a: "yesterday" },
            { t: "Issued cert · 6 learners", w: "system", a: "2d ago" },
            { t: "Rolled back quiz Q4 wording", w: "Ms. Lim", a: "3d ago" },
          ].map((r, i) => (
            <div key={i} style={{ padding: "10px 0", borderTop: i === 0 ? "none" : "1px solid var(--hairline)" }}>
              <div style={{ fontSize: 13.5, fontWeight: 500 }}>{r.t}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{r.w} · {r.a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const AdminKPI = ({ label, value, delta, sub, icon }) => (
  <div className="card" style={{ padding: 18 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
      <div style={{ width: 30, height: 30, borderRadius: 8, background: "var(--bg-sunk)", color: "var(--ink-2)", display: "grid", placeItems: "center" }}>
        <Icon name={icon} size={14} stroke={1.7} />
      </div>
      <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>{label}</div>
    </div>
    <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
      <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-0.02em" }}>{value}</div>
      <div style={{ fontSize: 12.5, color: "var(--success)", fontWeight: 600 }}>{delta}</div>
    </div>
    <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 2 }}>{sub}</div>
  </div>
);

function ActivityChart() {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const active = [840, 920, 1180, 1090, 1320, 760, 690];
  const quiz = [320, 410, 520, 480, 590, 290, 260];
  const max = Math.max(...active);
  return (
    <div style={{ height: 220, position: "relative", padding: "8px 0" }}>
      <div style={{ display: "flex", height: "100%", alignItems: "end", gap: 18, justifyContent: "space-between" }}>
        {days.map((d, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{ width: "100%", display: "flex", justifyContent: "center", gap: 4, height: "100%", alignItems: "end" }}>
              <div style={{ width: 18, height: `${(active[i] / max) * 100}%`, background: "var(--py-blue)", borderRadius: "6px 6px 0 0" }} />
              <div style={{ width: 18, height: `${(quiz[i] / max) * 100}%`, background: "var(--py-yellow)", borderRadius: "6px 6px 0 0" }} />
            </div>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>{d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DonutMix({ data }) {
  const total = data.reduce((a, d) => a + d.v, 0);
  let acc = 0;
  const r = 70, cx = 80, cy = 80;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
      <svg width="160" height="160" viewBox="0 0 160 160">
        {data.map((d, i) => {
          const a0 = (acc / total) * Math.PI * 2 - Math.PI / 2;
          acc += d.v;
          const a1 = (acc / total) * Math.PI * 2 - Math.PI / 2;
          const large = (a1 - a0) > Math.PI ? 1 : 0;
          const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
          const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
          return <path key={i} d={`M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`} fill={d.c} stroke="var(--surface)" strokeWidth="3" />;
        })}
        <circle cx="80" cy="80" r="36" fill="var(--surface)" />
        <text x="80" y="78" textAnchor="middle" fontWeight="600" fontSize="20" fill="var(--ink)">2,148</text>
        <text x="80" y="94" textAnchor="middle" fontSize="10" fill="var(--muted)">learners</text>
      </svg>
      <div style={{ flex: 1 }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 13, borderTop: i === 0 ? "none" : "1px solid var(--hairline)" }}>
            <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: d.c }} /> {d.l}
            </span>
            <span style={{ fontWeight: 600 }}>{Math.round(d.v * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// =================== MANAGE USERS ============================================

function AdminUsers() {
  const [search, setSearch] = useStateA("");
  const [segment, setSegment] = useStateA("All");
  const [sel, setSel] = useStateA(new Set());
  const [editing, setEditing] = useStateA(null);
  const filtered = USERS.filter(u =>
    (segment === "All" || u.segment === segment) &&
    (search === "" || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );
  const toggle = (id) => {
    const n = new Set(sel);
    n.has(id) ? n.delete(id) : n.add(id);
    setSel(n);
  };

  return (
    <div className="page-enter" style={{ padding: "28px 32px", overflowY: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 22 }}>
        <div>
          <h1 className="h1">Manage users</h1>
          <p style={{ color: "var(--muted)", marginTop: 4, fontSize: 14 }}>2,148 total · {filtered.length} matching filters</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-secondary"><Icon name="upload" size={13} /> Bulk import</button>
          <button className="btn btn-primary"><Icon name="plus" size={13} /> Add user</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 14, alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 320 }}>
          <span style={{ position: "absolute", left: 12, top: 11, color: "var(--muted)" }}><Icon name="search" /></span>
          <input className="input" placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 36 }} />
        </div>
        <div className="seg">
          {["All", "School", "University", "Self-learner"].map(s => (
            <button key={s} className={segment === s ? "on" : ""} onClick={() => setSegment(s)}>{s}</button>
          ))}
        </div>
        <button className="btn btn-ghost btn-sm"><Icon name="filter" size={13} /> More filters</button>
      </div>

      {sel.size > 0 && (
        <div style={{ padding: "10px 16px", background: "var(--ink)", color: "var(--bg)", borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 13 }}>{sel.size} selected</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-sm" style={{ background: "rgba(255,255,255,0.1)", color: "var(--bg)" }}>Send email</button>
            <button className="btn btn-sm" style={{ background: "rgba(255,255,255,0.1)", color: "var(--bg)" }}>Issue certificate</button>
            <button className="btn btn-sm btn-danger">Delete</button>
          </div>
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
          <thead style={{ background: "var(--bg-sunk)", position: "sticky", top: 0, fontSize: 11.5, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--muted)" }}>
            <tr>
              <th style={{ padding: "12px 16px", textAlign: "left", width: 36 }}>
                <input type="checkbox" checked={sel.size === filtered.length} onChange={e => setSel(e.target.checked ? new Set(filtered.map(u => u.id)) : new Set())} />
              </th>
              <th style={{ padding: "12px 8px", textAlign: "left" }}>User</th>
              <th style={{ padding: "12px 8px", textAlign: "left" }}>Segment</th>
              <th style={{ padding: "12px 8px", textAlign: "left" }}>Joined</th>
              <th style={{ padding: "12px 8px", textAlign: "left" }}>Progress</th>
              <th style={{ padding: "12px 8px", textAlign: "left" }}>Last active</th>
              <th style={{ padding: "12px 8px", textAlign: "left" }}>Status</th>
              <th style={{ padding: "12px 16px", textAlign: "right" }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr key={u.id} style={{ borderTop: "1px solid var(--hairline)", background: sel.has(u.id) ? "color-mix(in oklab, var(--py-yellow) 8%, var(--surface))" : (i % 2 ? "var(--surface)" : "var(--surface-2)") }}>
                <td style={{ padding: "12px 16px" }}>
                  <input type="checkbox" checked={sel.has(u.id)} onChange={() => toggle(u.id)} />
                </td>
                <td style={{ padding: "12px 8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div className="avatar" style={{ width: 30, height: 30, fontSize: 11, background: ["#3776AB", "#FFD43B", "#10B981", "#8B5CF6"][i % 4], color: i % 4 === 1 ? "var(--py-blue-d)" : "white" }}>
                      {u.name.split(" ").map(p => p[0]).join("")}
                    </div>
                    <div>
                      <div style={{ fontWeight: 500 }}>{u.name}</div>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "12px 8px" }}>
                  <span className="tag">{u.segment}</span>
                </td>
                <td style={{ padding: "12px 8px", color: "var(--muted)" }}>{u.joined}</td>
                <td style={{ padding: "12px 8px", width: 200 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div className="progress-bar" style={{ flex: 1, maxWidth: 120 }}><span style={{ width: `${u.progress * 100}%` }} /></div>
                    <span style={{ fontSize: 12, color: "var(--muted)", fontFamily: "var(--font-mono)", width: 32 }}>{Math.round(u.progress * 100)}%</span>
                  </div>
                </td>
                <td style={{ padding: "12px 8px", color: "var(--muted)" }}>{u.lastActive}</td>
                <td style={{ padding: "12px 8px" }}>
                  {u.status === "active"
                    ? <span style={{ display: "inline-flex", gap: 6, alignItems: "center", fontSize: 12, color: "var(--success)" }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--success)" }} /> Active</span>
                    : <span style={{ display: "inline-flex", gap: 6, alignItems: "center", fontSize: 12, color: "var(--muted)" }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--muted-2)" }} /> Dormant</span>}
                </td>
                <td style={{ padding: "12px 16px", textAlign: "right" }}>
                  <div style={{ display: "inline-flex", gap: 4 }}>
                    <button className="btn btn-ghost btn-sm tt" data-tt="View progress"><Icon name="eye" size={13} /></button>
                    <button className="btn btn-ghost btn-sm tt" data-tt="Edit" onClick={() => setEditing(u)}><Icon name="edit" size={13} /></button>
                    <button className="btn btn-ghost btn-sm tt" data-tt="Delete" style={{ color: "var(--error)" }}><Icon name="trash" size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && <UserEditModal user={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

const UserEditModal = ({ user, onClose }) => (
  <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,23,41,0.4)", zIndex: 100, display: "grid", placeItems: "center", padding: 40 }}>
    <div onClick={e => e.stopPropagation()} className="card" style={{ width: "min(560px, 100%)", padding: 32, maxHeight: "90vh", overflowY: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div className="eyebrow">Edit user</div>
          <h2 className="h2" style={{ marginTop: 4 }}>{user.name}</h2>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={onClose}><Icon name="x" /></button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Lbl k="Display name"><input className="input" defaultValue={user.name} /></Lbl>
        <Lbl k="Email"><input className="input" defaultValue={user.email} /></Lbl>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Lbl k="Role">
            <select className="input" defaultValue={user.role}>
              <option>Student</option><option>Instructor</option><option>Admin</option>
            </select>
          </Lbl>
          <Lbl k="Segment">
            <select className="input" defaultValue={user.segment}>
              <option>School</option><option>University</option><option>Self-learner</option>
            </select>
          </Lbl>
        </div>
        <Lbl k="Status">
          <select className="input" defaultValue={user.status}>
            <option value="active">Active</option><option value="dormant">Dormant</option><option value="suspended">Suspended</option>
          </select>
        </Lbl>
        <Lbl k="Notes (visible to admins only)">
          <textarea className="input" style={{ minHeight: 80 }} placeholder="Conversation history, special needs, accommodations…" />
        </Lbl>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
        <button className="btn btn-danger"><Icon name="trash" size={13} /> Delete user</button>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-yellow" onClick={onClose}>Save changes</button>
        </div>
      </div>
    </div>
  </div>
);

const Lbl = ({ k, children }) => (
  <label style={{ display: "block" }}>
    <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 5, fontWeight: 500 }}>{k}</div>
    {children}
  </label>
);

// =================== MANAGE MODULES ==========================================

function AdminModules() {
  const [editing, setEditing] = useStateA(null);
  return (
    <div className="page-enter" style={{ padding: "28px 32px", overflowY: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 22 }}>
        <div>
          <h1 className="h1">Manage modules</h1>
          <p style={{ color: "var(--muted)", marginTop: 4, fontSize: 14 }}>12 modules · drag to reorder · last edited by Ms. Lim 5h ago</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-secondary"><Icon name="folder" size={13} /> New track</button>
          <button className="btn btn-primary" onClick={() => setEditing({})}><Icon name="plus" size={13} /> New module</button>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {MODULES.map((m, i) => (
          <div key={m.id} style={{ display: "grid", gridTemplateColumns: "40px 50px 1fr 120px 120px 160px auto", gap: 16, alignItems: "center", padding: "14px 20px", borderTop: i === 0 ? "none" : "1px solid var(--hairline)" }}>
            <div style={{ color: "var(--muted-2)", cursor: "grab" }}>
              <Icon name="menu" size={16} />
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--muted)" }}>{String(i + 1).padStart(2, "0")}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: `color-mix(in oklab, ${m.color} 14%, var(--surface))`, color: m.color, display: "grid", placeItems: "center" }}>
                <Icon name={m.icon} size={16} />
              </div>
              <div>
                <div style={{ fontSize: 14.5, fontWeight: 500 }}>{m.title}</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>{m.lessons} lessons · {m.duration}</div>
              </div>
            </div>
            <div><span className={"tag " + (m.difficulty === "Beginner" ? "beg" : m.difficulty === "Intermediate" ? "int" : "adv") + " dot"}>{m.difficulty}</span></div>
            <div style={{ fontSize: 13, color: "var(--muted)" }}>Published</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>
              <div>{Math.floor(Math.random() * 1500 + 200)} enrolled</div>
              <div>updated {["1h", "5h", "1d", "3d", "1w"][i % 5]} ago</div>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              <button className="btn btn-ghost btn-sm tt" data-tt="Preview"><Icon name="eye" size={13} /></button>
              <button className="btn btn-ghost btn-sm tt" data-tt="Edit" onClick={() => setEditing(m)}><Icon name="edit" size={13} /></button>
              <button className="btn btn-ghost btn-sm tt" data-tt="Delete" style={{ color: "var(--error)" }}><Icon name="trash" size={13} /></button>
            </div>
          </div>
        ))}
      </div>

      {editing && <ModuleEditModal m={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

const ModuleEditModal = ({ m, onClose }) => (
  <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,23,41,0.4)", zIndex: 100, display: "grid", placeItems: "center", padding: 40 }}>
    <div onClick={e => e.stopPropagation()} className="card" style={{ width: "min(680px, 100%)", padding: 32, maxHeight: "90vh", overflowY: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div className="eyebrow">{m.id ? "Edit module" : "New module"}</div>
          <h2 className="h2" style={{ marginTop: 4 }}>{m.title || "Untitled module"}</h2>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={onClose}><Icon name="x" /></button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Lbl k="Title"><input className="input" defaultValue={m.title || ""} placeholder="e.g. Lists & Dictionaries" /></Lbl>
        <Lbl k="Blurb"><textarea className="input" defaultValue={m.blurb || ""} style={{ minHeight: 60 }} placeholder="One-line summary that learners see in the catalog" /></Lbl>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <Lbl k="Difficulty">
            <select className="input" defaultValue={m.difficulty || "Beginner"}>
              <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
            </select>
          </Lbl>
          <Lbl k="Lessons"><input className="input" type="number" defaultValue={m.lessons || 8} /></Lbl>
          <Lbl k="Duration"><input className="input" defaultValue={m.duration || "1h 30m"} /></Lbl>
        </div>
        <Lbl k="Prerequisites"><input className="input" defaultValue="Module 4: Functions" /></Lbl>
        <Lbl k="Tags"><input className="input" defaultValue="data-structures, iteration, idiomatic-python" /></Lbl>

        <div style={{ marginTop: 6 }}>
          <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8, fontWeight: 500 }}>Lessons</div>
          <div className="card" style={{ padding: 8 }}>
            {["Why sequences matter", "Creating and indexing lists", "Slicing and stride", "List comprehensions", "Iterating dictionaries"].map((t, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "20px 1fr auto", gap: 10, padding: "8px 10px", alignItems: "center", borderRadius: 8 }}>
                <Icon name="menu" size={13} />
                <span style={{ fontSize: 13.5 }}>{t}</span>
                <div style={{ display: "flex", gap: 2 }}>
                  <button className="btn btn-ghost btn-sm"><Icon name="edit" size={12} /></button>
                  <button className="btn btn-ghost btn-sm" style={{ color: "var(--error)" }}><Icon name="trash" size={12} /></button>
                </div>
              </div>
            ))}
            <button className="btn btn-ghost btn-sm" style={{ marginTop: 4 }}><Icon name="plus" size={12} /> Add lesson</button>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
        <button className="btn btn-danger"><Icon name="trash" size={13} /> Delete module</button>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-secondary">Save draft</button>
          <button className="btn btn-yellow" onClick={onClose}>Publish</button>
        </div>
      </div>
    </div>
  </div>
);

// =================== MANAGE QUIZZES ==========================================

function AdminQuizzes() {
  const [openQ, setOpenQ] = useStateA(0);
  const [questions, setQuestions] = useStateA(QUIZ_QUESTIONS);
  const q = questions[openQ];
  return (
    <div className="page-enter" style={{ padding: "28px 32px", overflowY: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 22 }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 4 }}>Lists & Dictionaries · Checkpoint quiz</div>
          <h1 className="h1">Manage quizzes</h1>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-secondary"><Icon name="play" size={13} /> Preview as learner</button>
          <button className="btn btn-primary"><Icon name="plus" size={13} /> New question</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 16 }}>
        {/* Question list */}
        <div className="card" style={{ padding: 12, height: "calc(100vh - 200px)", overflowY: "auto" }}>
          {questions.map((qq, i) => (
            <div key={qq.id}
              onClick={() => setOpenQ(i)}
              style={{
                padding: "10px 12px", borderRadius: 8, cursor: "pointer", marginBottom: 4,
                background: openQ === i ? "var(--bg-sunk)" : "transparent",
                border: openQ === i ? "1px solid var(--border-2)" : "1px solid transparent",
              }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--muted)" }}>Q{i + 1} · {qq.kind === "mcq" ? "MCQ" : "Code"}</div>
                <div style={{ display: "flex", gap: 2 }}>
                  <button className="btn btn-ghost btn-sm"><Icon name="trash" size={11} /></button>
                </div>
              </div>
              <div style={{ fontSize: 12.5, color: "var(--ink-2)", marginTop: 4, lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {qq.prompt.replace(/`/g, "")}
              </div>
            </div>
          ))}
        </div>

        {/* Editor */}
        <div className="card" style={{ padding: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 16 }}>
            <div>
              <div className="eyebrow">Editing Q{openQ + 1}</div>
              <h2 className="h2" style={{ marginTop: 4 }}>{q.kind === "mcq" ? "Multiple choice" : "Code completion"}</h2>
            </div>
            <div className="seg">
              <button className={q.kind === "mcq" ? "on" : ""}>Multiple choice</button>
              <button className={q.kind === "code" ? "on" : ""}>Code completion</button>
            </div>
          </div>
          <Lbl k="Question prompt (Markdown + inline code via backticks)">
            <textarea className="input" defaultValue={q.prompt} style={{ minHeight: 80, fontFamily: "var(--font-mono)", fontSize: 13.5 }} />
          </Lbl>

          {q.kind === "mcq" ? (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8, fontWeight: 500 }}>Options · check the correct answer</div>
              {q.options.map((opt, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "32px 1fr auto", gap: 8, alignItems: "center", marginBottom: 8 }}>
                  <input type="radio" name="ans" defaultChecked={i === q.answer} />
                  <input className="input" defaultValue={opt} />
                  <button className="btn btn-ghost btn-sm" style={{ color: "var(--error)" }}><Icon name="trash" size={13} /></button>
                </div>
              ))}
              <button className="btn btn-ghost btn-sm"><Icon name="plus" size={12} /> Add option</button>
            </div>
          ) : (
            <div style={{ marginTop: 16 }}>
              <Lbl k="Starter code (use ___ for blanks)">
                <textarea className="input" defaultValue={q.starter} style={{ minHeight: 100, fontFamily: "var(--font-mono)", fontSize: 13.5, background: "#0F1729", color: "#E8EAEE", border: 0 }} />
              </Lbl>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
                <Lbl k="Correct fill"><input className="input" defaultValue={q.blank} /></Lbl>
                <Lbl k="Match strategy">
                  <select className="input"><option>Exact (case-insensitive)</option><option>Regex</option><option>Run & compare output</option></select>
                </Lbl>
              </div>
            </div>
          )}

          <Lbl k="Explanation (shown after submit)">
            <textarea className="input" defaultValue={q.explain} style={{ minHeight: 70 }} />
          </Lbl>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 14 }}>
            <Lbl k="Points"><input className="input" type="number" defaultValue="10" /></Lbl>
            <Lbl k="Time limit (s)"><input className="input" type="number" defaultValue="90" /></Lbl>
            <Lbl k="Difficulty">
              <select className="input"><option>Easy</option><option selected>Medium</option><option>Hard</option></select>
            </Lbl>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24, paddingTop: 18, borderTop: "1px solid var(--border)" }}>
            <button className="btn btn-danger"><Icon name="trash" size={13} /> Delete question</button>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-secondary">Save draft</button>
              <button className="btn btn-yellow">Publish question</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =================== REPORTS =================================================

function AdminReports() {
  return (
    <div className="page-enter" style={{ padding: "28px 32px", overflowY: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 22 }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 4 }}>Analytics</div>
          <h1 className="h1">Reports</h1>
          <p style={{ color: "var(--muted)", marginTop: 4, fontSize: 14 }}>Cohort engagement, content health, and accessibility usage. <span style={{ color: "var(--py-blue)" }}>← Note: this page resolves the proposal's open "Reports" item.</span></p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div className="seg">
            <button>7d</button><button className="on">30d</button><button>90d</button><button>YTD</button>
          </div>
          <button className="btn btn-secondary"><Icon name="download" size={13} /> Export CSV</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }}>
        <div className="card" style={{ padding: 24 }}>
          <h2 className="h2" style={{ marginBottom: 4 }}>Completion funnel</h2>
          <p style={{ fontSize: 13, color: "var(--muted)" }}>Of every 100 learners who start "Variables & Data Types"…</p>
          <Funnel rows={[
            { l: "Start Module 1", n: 100, pct: 1.0 },
            { l: "Finish Module 1", n: 84, pct: 0.84 },
            { l: "Start Module 5: Lists & Dicts", n: 58, pct: 0.58 },
            { l: "Pass checkpoint quiz", n: 41, pct: 0.41 },
            { l: "Earn Foundations cert.", n: 33, pct: 0.33 },
          ]} />
        </div>
        <div className="card" style={{ padding: 24 }}>
          <h2 className="h2" style={{ marginBottom: 14 }}>Lens accessibility usage</h2>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 14 }}>% of active learners who turn on at least one Lens setting</p>
          {[
            { l: "Dyslexia font", v: 0.18 },
            { l: "High contrast", v: 0.09 },
            { l: "Color-blind palette", v: 0.07 },
            { l: "Calm motion mode", v: 0.21 },
            { l: "Audio narration", v: 0.32 },
            { l: "ASL avatar (videos)", v: 0.04 },
            { l: "Focus magnifier", v: 0.05 },
          ].map((r, i) => (
            <div key={i} style={{ padding: "8px 0", borderTop: i === 0 ? "none" : "1px solid var(--hairline)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                <span>{r.l}</span><strong>{Math.round(r.v * 100)}%</strong>
              </div>
              <div className="progress-bar"><span style={{ width: `${r.v * 100}%` }} /></div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        <div className="card" style={{ padding: 24 }}>
          <h3 className="h3" style={{ marginBottom: 14 }}>Cohort retention (D30)</h3>
          <RetentionGrid />
        </div>
        <div className="card" style={{ padding: 24 }}>
          <h3 className="h3" style={{ marginBottom: 14 }}>Question item analysis</h3>
          <p style={{ fontSize: 12.5, color: "var(--muted)" }}>Questions where &lt;55% of learners answer correctly — candidates to rewrite.</p>
          {[
            { q: "Q4 · for / in syntax with .items()", acc: 0.42, p: 0.71 },
            { q: "Q8 · Aliasing & mutation", acc: 0.51, p: 0.62 },
            { q: "Q7 · Comprehension filter", acc: 0.53, p: 0.55 },
          ].map((r, i) => (
            <div key={i} style={{ padding: "10px 0", borderTop: i === 0 ? "none" : "1px solid var(--hairline)" }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{r.q}</div>
              <div style={{ display: "flex", gap: 12, marginTop: 4, fontSize: 12, color: "var(--muted)" }}>
                <span>Acc <strong style={{ color: "var(--error)" }}>{Math.round(r.acc * 100)}%</strong></span>
                <span>Discrim. {r.p.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="card" style={{ padding: 24 }}>
          <h3 className="h3" style={{ marginBottom: 14 }}>Performance by segment</h3>
          {[
            { l: "School (13–17)", avg: 0.74, mods: 2.4 },
            { l: "University (18–25)", avg: 0.82, mods: 4.1 },
            { l: "Self-learner (adult)", avg: 0.79, mods: 3.7 },
          ].map((r, i) => (
            <div key={i} style={{ padding: "12px 0", borderTop: i === 0 ? "none" : "1px solid var(--hairline)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13.5, fontWeight: 500 }}>{r.l}</span>
                <strong>{Math.round(r.avg * 100)}%</strong>
              </div>
              <div className="progress-bar"><span style={{ width: `${r.avg * 100}%` }} /></div>
              <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 4 }}>Avg {r.mods.toFixed(1)} modules completed</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Funnel({ rows }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
      {rows.map((r, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: 14 }}>
          <div style={{
            background: "linear-gradient(90deg, var(--py-blue), var(--py-blue-l))",
            color: "white", padding: "12px 16px",
            width: `${r.pct * 100}%`,
            borderRadius: "var(--r-md)",
            fontSize: 13.5,
            fontWeight: 500,
            minWidth: 200,
          }}>{r.l}</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{r.n}<span style={{ fontSize: 11, color: "var(--muted)", marginLeft: 4 }}>{Math.round(r.pct * 100)}%</span></div>
        </div>
      ))}
    </div>
  );
}

function RetentionGrid() {
  // 6 cohorts × 5 weeks heatmap
  const cohorts = ["Feb '26", "Feb 15", "Mar 1", "Mar 15", "Apr 1", "Apr 15"];
  const data = [
    [1.00, 0.78, 0.62, 0.51, 0.44],
    [1.00, 0.81, 0.65, 0.55, 0.46],
    [1.00, 0.83, 0.71, 0.58, 0.49],
    [1.00, 0.85, 0.74, 0.62, 0.52],
    [1.00, 0.88, 0.79, 0.68, 0.58],
    [1.00, 0.91, 0.83, 0.72, 0.61],
  ];
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "72px repeat(5, 1fr)", gap: 4, fontSize: 11, color: "var(--muted)", marginBottom: 6 }}>
        <div />
        {["W0", "W1", "W2", "W3", "W4"].map(w => <div key={w} style={{ textAlign: "center", fontWeight: 600 }}>{w}</div>)}
      </div>
      {cohorts.map((c, i) => (
        <div key={c} style={{ display: "grid", gridTemplateColumns: "72px repeat(5, 1fr)", gap: 4, marginBottom: 4, alignItems: "center" }}>
          <div style={{ fontSize: 11, color: "var(--muted)" }}>{c}</div>
          {data[i].map((v, j) => (
            <div key={j} style={{
              padding: "8px 4px", textAlign: "center", fontSize: 11.5, fontWeight: 600,
              background: `color-mix(in oklab, var(--py-blue) ${v * 80}%, var(--surface))`,
              color: v > 0.6 ? "white" : "var(--ink)",
              borderRadius: 4,
            }}>{Math.round(v * 100)}</div>
          ))}
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { AdminDashboard, AdminUsers, AdminModules, AdminQuizzes, AdminReports });
