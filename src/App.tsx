

import { useEffect, useRef, useState } from 'react';
import { NavLink, Routes, Route, Navigate, Link } from 'react-router-dom';
import './App.css';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Create from './pages/Create';
import Library from './pages/Library';
import Practice from './pages/Practice';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import { AuthProvider, useAuth } from './auth';
import { ToastProvider } from './components/ui/Toast';
import { CommandPalette, KeyboardShortcutsModal, useKeyboardShortcuts } from './components/ui/CommandPalette';

const navItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Compose', path: '/create' },
  { label: 'Library', path: '/library' },
  { label: 'Practice', path: '/practice' },
];

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  return children;
}

// Wrapper for the app shell (used for authenticated pages)
function AppShell({ children }: { children: React.ReactNode }) {
  const [showPlayer, setShowPlayer] = useState(false);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const avatarMenuRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();
  const {
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    isShortcutsModalOpen,
    setShortcutsModalOpen,
  } = useKeyboardShortcuts();

  const initials = user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'C';

  // Close avatar menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(event.target as Node)) {
        setShowAvatarMenu(false);
      }
    };

    if (showAvatarMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAvatarMenu]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      {/* Command Palette */}
      <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
      
      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal isOpen={isShortcutsModalOpen} onClose={() => setShortcutsModalOpen(false)} />

      <div className="mx-auto max-w-7xl px-6 py-8 space-y-8 animate-fade-in">
        <header className="rounded-3xl border border-cyan-400/20 bg-slate-900/70 p-6 shadow-xl shadow-cyan-900/30 backdrop-blur animate-fade-in-down">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/40 bg-cyan-500/10 text-lg font-bold text-cyan-200 transition-transform group-hover:scale-105">
                C
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-cyan-300/80">Cantorium</p>
                <h1 className="text-xl font-semibold text-slate-50">Choral AI Studio</h1>
              </div>
            </Link>

            <div className="flex w-full flex-col items-stretch gap-3 md:w-auto md:flex-row md:flex-wrap md:items-center">
              <button
                onClick={() => setCommandPaletteOpen(true)}
                className="relative w-full min-w-[240px] md:w-64 text-left"
              >
                <div
                  className="w-full rounded-2xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 pr-12 text-sm text-slate-400 outline-none transition hover:border-cyan-400/40 hover:text-slate-300 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/30"
                >
                  Search commands...
                </div>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-lg border border-cyan-400/30 bg-cyan-500/10 px-2 py-1 text-[11px] font-semibold text-cyan-100">
                  ⌘K
                </span>
              </button>
              <div className="flex flex-wrap items-center gap-3 md:justify-end">
                <Link to="/create" className="rounded-2xl border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-cyan-500/20 hover:shadow-lg hover:shadow-cyan-900/30">
                  New Composition
                </Link>
                {!user && (
                  <>
                    <NavLink
                      to="/signin"
                      className="rounded-2xl border border-slate-700 bg-slate-800/90 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:-translate-y-0.5 hover:border-cyan-400/40 hover:text-cyan-100"
                    >
                      Sign In
                    </NavLink>
                    <NavLink
                      to="/signup"
                      className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-500/20"
                    >
                      Sign Up
                    </NavLink>
                  </>
                )}
                {user && (
                  <div className="relative" ref={avatarMenuRef}>
                    <button
                      onClick={() => setShowAvatarMenu((v) => !v)}
                      className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-800/90 px-3 py-2 text-sm text-slate-100"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-cyan-400/40 bg-cyan-500/10 text-xs font-semibold text-cyan-100">
                        {initials}
                      </div>
                      <div className="leading-tight text-left">
                        <p className="font-semibold text-slate-50">{user.name || 'Logged in'}</p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </div>
                      <span className="text-xs text-slate-400">▾</span>
                    </button>
                    {showAvatarMenu && (
                      <div className="absolute right-0 z-30 mt-2 w-48 rounded-2xl border border-slate-700 bg-slate-900/95 p-2 shadow-lg shadow-slate-950/40">
                        <NavLink
                          to="/profile"
                          className="block rounded-xl px-3 py-2 text-sm text-slate-100 hover:bg-slate-800"
                          onClick={() => setShowAvatarMenu(false)}
                        >
                          Profile
                        </NavLink>
                        <button
                          className="block w-full rounded-xl px-3 py-2 text-left text-sm text-slate-100 hover:bg-slate-800"
                          onClick={() => {
                            setShowAvatarMenu(false);
                            signOut();
                          }}
                        >
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <nav className="mt-5 flex flex-wrap items-center gap-2 text-sm text-slate-300" role="navigation" aria-label="Main navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  `rounded-full border px-3 py-1.5 transition-all duration-200 ${
                    isActive
                      ? 'border-cyan-400/50 bg-cyan-500/15 text-cyan-100 shadow-md shadow-cyan-900/20'
                      : 'border-slate-700 bg-slate-800/60 hover:border-cyan-400/30 hover:text-cyan-100 hover:bg-slate-800/80'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            {/* Keyboard shortcuts hint */}
            <button
              onClick={() => setShortcutsModalOpen(true)}
              className="ml-auto rounded-full border border-slate-700/50 bg-slate-800/40 px-2 py-1 text-xs text-slate-500 transition hover:border-cyan-400/30 hover:text-slate-300"
              aria-label="View keyboard shortcuts"
            >
              <span className="hidden sm:inline">Shortcuts </span>⌘/
            </button>
          </nav>
        </header>

        {/* Main content with page transition animation */}
        <main className="animate-fade-in-up">
          {children}
        </main>
      </div>

      {!showPlayer && (
        <button
          className="fixed bottom-6 right-6 z-20 rounded-full border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-100 shadow-lg shadow-cyan-900/40 backdrop-blur transition hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-cyan-500/20"
          onClick={() => setShowPlayer(true)}
        >
          Open Now Playing
        </button>
      )}

      {showPlayer && (
        <div className="fixed inset-x-6 bottom-6 z-20 rounded-2xl border border-cyan-400/30 bg-slate-900/85 px-4 py-3 shadow-2xl shadow-cyan-900/40 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl border border-cyan-400/30 bg-cyan-500/10" />
              <div>
                <p className="text-sm font-semibold text-slate-100">Nocturne in Indigo</p>
                <p className="text-xs text-slate-400">SATB | 120 BPM | Key of Dm</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-200">
              <button className="rounded-full border border-slate-700 px-3 py-1 hover:border-cyan-400/40 hover:text-cyan-100">Prev</button>
              <button className="rounded-full border border-cyan-400/50 bg-cyan-500/10 px-4 py-2 font-semibold text-cyan-100 hover:bg-cyan-500/20">
                Play
              </button>
              <button className="rounded-full border border-slate-700 px-3 py-1 hover:border-cyan-400/40 hover:text-cyan-100">Next</button>
              <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1 text-xs text-slate-300">
                <span className="font-semibold text-cyan-200">Tenor</span>
                <span className="h-5 w-px bg-slate-700" />
                <span>Loop A/B</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span>Tempo</span>
                <div className="w-28 rounded-full bg-slate-800/70 p-1">
                  <div className="h-2 w-2/3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
                </div>
                <span className="font-semibold text-cyan-100">88%</span>
              </div>
              <button
                className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-200 hover:border-rose-400/40 hover:text-rose-100"
                onClick={() => setShowPlayer(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          {/* Public landing page */}
          <Route path="/" element={<Landing />} />
          
          {/* Auth pages (no shell) */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          
          {/* App pages with shell */}
          <Route path="/dashboard" element={<AppShell><Dashboard /></AppShell>} />
          <Route path="/create" element={<AppShell><Create /></AppShell>} />
          <Route path="/library" element={<AppShell><Library /></AppShell>} />
          <Route path="/practice" element={<AppShell><Practice /></AppShell>} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <AppShell><Profile /></AppShell>
              </ProtectedRoute>
            }
          />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}
