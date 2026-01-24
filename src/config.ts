const fallbackBase = typeof window !== "undefined" ? `${window.location.protocol}//${window.location.host}` : "";

const apiBase = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") || fallbackBase;
const wsBase = (import.meta.env.VITE_WS_BASE_URL as string | undefined)?.replace(/\/$/, "") ||
  (apiBase.startsWith("https") ? apiBase.replace("https", "wss") : apiBase.replace("http", "ws"));

const normalizePath = (path: string) => (path.startsWith("/") ? path : `/${path}`);

export const endpoints = {
  dashboard: "/api/dashboard",
  compositions: "/api/compositions",
  sessions: "/api/sessions",
  activity: "/api/activity",
  logs: "/api/logs",
  practiceStart: "/api/practice/start",
  practiceStop: "/api/practice/stop",
  authSignIn: "/api/auth/signin",
  authSignUp: "/api/auth/signup",
  stream: "/ws/stream",
} as const;

export const buildUrl = (path: string) =>
  path.startsWith("http") ? path : `${apiBase}${normalizePath(path)}`;

export const buildWsUrl = (path: string) =>
  path.startsWith("ws") ? path : `${wsBase}${normalizePath(path)}`;

export { apiBase, wsBase };
