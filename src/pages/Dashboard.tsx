import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { buildUrl, buildWsUrl, endpoints } from "../config";
import { useToast } from "../components/ui/Toast";
import { Badge, Button, Card, EmptyState, ProgressBar, Skeleton, Tooltip } from "../components/ui/Components";

type Composition = {
  id: string;
  title: string;
  parts: string[];
  language: string;
  difficulty: string;
  status: "draft" | "published" | "shared" | "rendering";
  updatedAt: string;
};

type Session = {
  id: string;
  title: string;
  part: string;
  tempo: number;
  progress: number;
  startedAt: string;
};

type Activity = {
  id: string;
  timestamp: string;
  message: string;
  kind: "create" | "practice" | "publish" | "share" | "update" | "login";
};

type LogEntry = {
  timestamp: string;
  level: string;
  message: string;
};

type WebSocketMessage = 
  | { type: "activity"; payload: Activity }
  | { type: "log"; payload: LogEntry };

const fallbackCompositions: Composition[] = [
  { id: "1", title: "Nocturne in Indigo", parts: ["SATB"], language: "English", difficulty: "Intermediate", status: "shared", updatedAt: new Date().toISOString() },
  { id: "2", title: "Aurora Gloria", parts: ["SSA"], language: "Latin", difficulty: "Advanced", status: "draft", updatedAt: new Date().toISOString() },
  { id: "3", title: "Lumen Cantorum", parts: ["TTBB"], language: "Italian", difficulty: "Advanced", status: "published", updatedAt: new Date().toISOString() },
];

const fallbackSessions: Session[] = [
  { id: "s1", title: "Nocturne in Indigo", part: "Tenor", tempo: 88, progress: 72, startedAt: new Date().toISOString() },
  { id: "s2", title: "Aurora Gloria", part: "Soprano", tempo: 96, progress: 40, startedAt: new Date().toISOString() },
];

const fallbackActivity: Activity[] = [
  { id: "a1", timestamp: new Date().toISOString(), message: "Sarah published \"Nocturne in Indigo\"", kind: "publish" },
  { id: "a2", timestamp: new Date().toISOString(), message: "Marcus started practicing Tenor part", kind: "practice" },
  { id: "a3", timestamp: new Date().toISOString(), message: "Amara created \"Aurora Gloria\"", kind: "create" },
];

const fallbackLogs: LogEntry[] = [
  { timestamp: new Date().toISOString(), level: "info", message: "Session stream connected." },
  { timestamp: new Date().toISOString(), level: "info", message: "Queued render job for Aurora Gloria." },
  { timestamp: new Date().toISOString(), level: "warn", message: "One track exceeded target LUFS; auto-trim applied." },
];

// Activity icon mapping
const activityIcons: Record<Activity["kind"], string> = {
  create: "🎼",
  practice: "🎧",
  publish: "📢",
  share: "🔗",
  update: "✏️",
  login: "👋",
};

// Status badge mapping
const statusVariants: Record<Composition["status"], "default" | "success" | "warning" | "info"> = {
  draft: "default",
  published: "success",
  shared: "info",
  rendering: "warning",
};

export default function Dashboard() {
  const [compositions, setCompositions] = useState<Composition[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const [dashboardRes, compsRes, sessionsRes, logsRes] = await Promise.all([
          fetch(buildUrl(endpoints.dashboard), { signal: controller.signal }).then((r) => r.json()),
          fetch(buildUrl(endpoints.compositions), { signal: controller.signal }).then((r) => r.json()),
          fetch(buildUrl(endpoints.sessions), { signal: controller.signal }).then((r) => r.json()),
          fetch(buildUrl(endpoints.logs), { signal: controller.signal }).then((r) => r.json()),
        ]);

        if (!mounted) return;
        setCompositions(Array.isArray(compsRes) ? compsRes : fallbackCompositions);
        setSessions(Array.isArray(sessionsRes) ? sessionsRes : fallbackSessions);
        setActivity(Array.isArray(dashboardRes?.activity) ? dashboardRes.activity : fallbackActivity);
        setLogs(Array.isArray(logsRes) ? logsRes.slice(0, 120) : fallbackLogs);
      } catch {
        if (!controller.signal.aborted) {
          setError("Using sample data until the Cantorium API responds.");
          showToast("Using sample data — API connection failed", "warning", 5000);
          setCompositions(fallbackCompositions);
          setSessions(fallbackSessions);
          setActivity(fallbackActivity);
          setLogs(fallbackLogs);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    const ws = new WebSocket(buildWsUrl(endpoints.stream));
    ws.onopen = () => {
      showToast("Real-time updates connected", "success", 2000);
    };
    ws.onmessage = (evt) => {
      try {
        const msg = JSON.parse(evt.data) as WebSocketMessage;
        if (!msg || typeof msg !== 'object' || !('type' in msg)) {
          console.error('Invalid WebSocket message format:', evt.data);
          return;
        }
        
        if (msg.type === "activity" && msg.payload) {
          setActivity((prev) => [msg.payload, ...prev].slice(0, 50));
        } else if (msg.type === "log" && msg.payload) {
          setLogs((prev) => [msg.payload, ...prev].slice(0, 200));
        }
      } catch (e) {
        console.error('Failed to parse WebSocket message:', e, evt.data);
      }
    };
    ws.onerror = () => {
      setError((prev) => prev ?? "WebSocket connection dropped.");
    };
    wsRef.current = ws;

    return () => {
      mounted = false;
      controller.abort();
      ws.close();
    };
  }, [showToast]);

  const stats = useMemo(
    () => [
      { label: "My Compositions", value: compositions.length, accent: "from-cyan-500 to-blue-500", icon: "🎼" },
      { label: "Practice Sessions", value: sessions.length, accent: "from-violet-500 to-fuchsia-500", icon: "🎧" },
      { label: "Community Activity", value: activity.length, accent: "from-emerald-500 to-teal-500", icon: "👥" },
      { label: "AI Renders Today", value: logs.length, accent: "from-amber-400 to-orange-500", icon: "🤖" },
    ],
    [compositions.length, sessions.length, activity.length, logs.length]
  );

  return (
    <div className="space-y-6">
      {error && (
        <div className="animate-fade-in-down rounded-2xl border border-amber-400/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100 flex items-center gap-3">
          <span className="text-lg">⚠️</span>
          <span>{error}</span>
          <button 
            onClick={() => setError(null)} 
            className="ml-auto text-amber-200 hover:text-amber-100 transition-colors"
            aria-label="Dismiss notification"
          >
            ✕
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 stagger-animation">
        {loading
          ? <>
              <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg shadow-slate-950/40">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <Skeleton className="h-10 w-10 rounded-xl" />
                </div>
              </div>
              <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg shadow-slate-950/40">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <Skeleton className="h-10 w-10 rounded-xl" />
                </div>
              </div>
              <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg shadow-slate-950/40">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <Skeleton className="h-10 w-10 rounded-xl" />
                </div>
              </div>
              <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg shadow-slate-950/40">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <Skeleton className="h-10 w-10 rounded-xl" />
                </div>
              </div>
            </>
          : stats.map((stat, index) => (
              <div
                key={stat.label}
                className="hover-lift relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg shadow-slate-950/40 cursor-pointer group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.accent} opacity-10 transition-opacity group-hover:opacity-20`} />
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">{stat.label}</p>
                    <p className="mt-1 text-3xl font-semibold text-slate-50 tabular-nums">{stat.value}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-500/10 text-2xl transition-transform group-hover:scale-110">
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="xl:col-span-2 space-y-4">
          <header className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-50">My Compositions</h2>
              <p className="text-sm text-slate-400">Latest drafts, shared pieces, and published works.</p>
            </div>
            <Tooltip content="Manage all compositions">
              <Link to="/library" className="rounded-full border border-cyan-400/40 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-100 transition-all hover:bg-cyan-500/20 hover:border-cyan-300">
                Manage →
              </Link>
            </Tooltip>
          </header>

          <Card accent="cyan" className="overflow-hidden p-0">
            <table className="w-full text-sm text-slate-200">
              <thead className="bg-slate-900/80 text-xs uppercase tracking-wide text-slate-400">
                <tr className="divide-x divide-slate-800">
                  <th className="px-4 py-3 text-left">Title</th>
                  <th className="px-4 py-3 text-left hidden sm:table-cell">Parts</th>
                  <th className="px-4 py-3 text-left hidden md:table-cell">Language</th>
                  <th className="px-4 py-3 text-left hidden lg:table-cell">Difficulty</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left hidden md:table-cell">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {loading
                  ? <>
                      <tr>
                        <td className="px-4 py-3"><Skeleton className="h-4 w-32" /></td>
                        <td className="px-4 py-3 hidden sm:table-cell"><Skeleton className="h-4 w-16" /></td>
                        <td className="px-4 py-3 hidden md:table-cell"><Skeleton className="h-4 w-16" /></td>
                        <td className="px-4 py-3 hidden lg:table-cell"><Skeleton className="h-4 w-20" /></td>
                        <td className="px-4 py-3"><Skeleton className="h-4 w-14" /></td>
                        <td className="px-4 py-3 hidden md:table-cell"><Skeleton className="h-4 w-28" /></td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3"><Skeleton className="h-4 w-32" /></td>
                        <td className="px-4 py-3 hidden sm:table-cell"><Skeleton className="h-4 w-16" /></td>
                        <td className="px-4 py-3 hidden md:table-cell"><Skeleton className="h-4 w-16" /></td>
                        <td className="px-4 py-3 hidden lg:table-cell"><Skeleton className="h-4 w-20" /></td>
                        <td className="px-4 py-3"><Skeleton className="h-4 w-14" /></td>
                        <td className="px-4 py-3 hidden md:table-cell"><Skeleton className="h-4 w-28" /></td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3"><Skeleton className="h-4 w-32" /></td>
                        <td className="px-4 py-3 hidden sm:table-cell"><Skeleton className="h-4 w-16" /></td>
                        <td className="px-4 py-3 hidden md:table-cell"><Skeleton className="h-4 w-16" /></td>
                        <td className="px-4 py-3 hidden lg:table-cell"><Skeleton className="h-4 w-20" /></td>
                        <td className="px-4 py-3"><Skeleton className="h-4 w-14" /></td>
                        <td className="px-4 py-3 hidden md:table-cell"><Skeleton className="h-4 w-28" /></td>
                      </tr>
                    </>
                  : compositions.slice(0, 10).map((c) => (
                      <tr key={c.id} className="hover:bg-slate-800/60 transition-colors cursor-pointer group">
                        <td className="px-4 py-3">
                          <span className="font-semibold text-slate-100 group-hover:text-cyan-200 transition-colors">
                            {c.title}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-300 hidden sm:table-cell">{c.parts.join(", ")}</td>
                        <td className="px-4 py-3 text-slate-300 hidden md:table-cell">{c.language}</td>
                        <td className="px-4 py-3 text-slate-300 hidden lg:table-cell">{c.difficulty}</td>
                        <td className="px-4 py-3">
                          <Badge variant={statusVariants[c.status]}>
                            {c.status === "rendering" && <span className="mr-1 inline-block h-2 w-2 animate-pulse rounded-full bg-current" />}
                            {c.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-xs hidden md:table-cell">
                          {new Date(c.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                      </tr>
                    ))}

                {!compositions.length && !loading && (
                  <tr>
                    <td colSpan={6}>
                      <EmptyState
                        icon="🎼"
                        title="No compositions yet"
                        description="Create your first choral composition and let AI bring it to life."
                        action={
                          <Button variant="primary" onClick={() => window.location.href = "/create"}>
                            Create First Composition
                          </Button>
                        }
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card>
        </section>

        <aside className="space-y-4">
          <Card accent="violet" className="p-4">
            <h3 className="text-lg font-semibold text-slate-50">Quick Actions</h3>
            <p className="text-sm text-slate-400">Jump into the flows you use most.</p>
            <div className="mt-4 grid grid-cols-1 gap-3">
              <Link to="/create" className="group rounded-2xl border border-cyan-400/40 bg-cyan-500/10 px-4 py-3 text-sm font-semibold text-cyan-100 transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-cyan-500/20 hover:shadow-lg hover:shadow-cyan-900/30 text-center flex items-center justify-center gap-2">
                <span className="text-lg transition-transform group-hover:scale-110">🎼</span> New Choral Composition
              </Link>
              <Link to="/practice" className="group rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-100 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-500/20 hover:shadow-lg hover:shadow-emerald-900/30 text-center flex items-center justify-center gap-2">
                <span className="text-lg transition-transform group-hover:scale-110">🎧</span> Open Practice Studio
              </Link>
              <Link to="/library" className="group rounded-2xl border border-blue-400/40 bg-blue-500/10 px-4 py-3 text-sm font-semibold text-blue-100 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-500/20 hover:shadow-lg hover:shadow-blue-900/30 text-center flex items-center justify-center gap-2">
                <span className="text-lg transition-transform group-hover:scale-110">📚</span> Browse Script Library
              </Link>
            </div>
          </Card>

          <Card accent="cyan" className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-50">Activity Feed</h3>
              <Badge variant="info">{activity.length} events</Badge>
            </div>
            <div className="h-72 overflow-auto pr-1 text-xs text-slate-200 scrollbar-thin">
              <ul className="space-y-2">
                {activity.slice(0, 50).map((a, index) => (
                  <li 
                    key={a.id} 
                    className="rounded-xl border border-slate-800/70 bg-slate-800/40 px-3 py-2 transition-all hover:bg-slate-800/60 hover:border-slate-700"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1.5 font-semibold text-cyan-200">
                        <span>{activityIcons[a.kind]}</span>
                        {a.kind}
                      </span>
                      <span>{new Date(a.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="mt-1 text-slate-100">{a.message}</p>
                  </li>
                ))}

                {!activity.length && !loading && (
                  <li className="py-8 text-center">
                    <EmptyState
                      icon="📭"
                      title="No activity yet"
                      description="Activity from you and your collaborators will appear here."
                    />
                  </li>
                )}
              </ul>
            </div>
          </Card>
        </aside>
      </div>

      {/* Active Practice Sessions */}
      <section className="rounded-3xl border border-blue-400/20 bg-slate-900/80 p-4 shadow-xl shadow-blue-900/30">
        <header className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-50">Active Practice Sessions</h2>
            <p className="text-sm text-slate-400">Monitor who is rehearsing and how far they are.</p>
          </div>
          <Badge variant="success">
            <span className="mr-1 inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            {sessions.length} in flight
          </Badge>
        </header>

        {sessions.length === 0 && !loading ? (
          <EmptyState
            icon="🎧"
            title="No active sessions"
            description="Start a practice session to track your progress."
            action={
              <Button variant="success" onClick={() => window.location.href = "/practice"}>
                Start Practice Session
              </Button>
            }
            className="py-8"
          />
        ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((s) => (
            <div key={s.id} className="hover-lift rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-slate-950/40 cursor-pointer group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">{s.part} part</p>
                  <p className="text-lg font-semibold text-slate-50 group-hover:text-cyan-200 transition-colors">{s.title}</p>
                </div>
                <Badge variant="success">{s.tempo} BPM</Badge>
              </div>
              <div className="mt-3">
                <ProgressBar 
                  value={s.progress} 
                  color={s.progress >= 80 ? "emerald" : s.progress >= 50 ? "cyan" : "amber"} 
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                <span>Progress</span>
                <span className="text-slate-100 font-semibold tabular-nums">{Math.round(s.progress)}%</span>
              </div>
            </div>
          ))}
        </div>
        )}
      </section>

      <section className="rounded-3xl border border-emerald-400/20 bg-slate-900/80 p-4 shadow-xl shadow-emerald-900/30">
        <header className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-50">AI Render Queue</h2>
            <p className="text-sm text-slate-400">Voice synthesis and rendering events.</p>
          </div>
          <span className="text-xs text-slate-400">{logs.length} jobs processed</span>
        </header>

        <div className="mt-4 h-64 overflow-auto rounded-2xl border border-slate-800 bg-slate-900/70 p-3 text-xs text-slate-100">
          <ul className="space-y-2">
            {logs.slice(0, 80).map((l, i) => (
              <li key={`${l.timestamp}-${i}`} className="rounded-xl border border-slate-800/70 bg-slate-800/40 px-3 py-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-semibold text-cyan-200">{l.level}</span>
                  <span>{new Date(l.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="mt-1 text-slate-100">{l.message}</p>
              </li>
            ))}

            {!logs.length && !loading && <li className="text-slate-400">No logs yet.</li>}
          </ul>
        </div>
      </section>
    </div>
  );
}
