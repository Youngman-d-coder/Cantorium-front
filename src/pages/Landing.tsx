import { Link } from "react-router-dom";

const features = [
  {
    icon: "🎼",
    title: "AI-Powered Vocal Synthesis",
    desc: "Transform any choral script into realistic multi-voice performances. Our AI sings in 40+ languages with authentic accents and regional styles.",
    accent: "from-cyan-500 to-blue-500",
  },
  {
    icon: "📚",
    title: "Global Script Library",
    desc: "Browse thousands of choral arrangements from composers worldwide. Fork, adapt, and share your own creations with the community.",
    accent: "from-violet-500 to-fuchsia-500",
  },
  {
    icon: "🎧",
    title: "Part Isolation & Training",
    desc: "Isolate Soprano, Alto, Tenor, or Bass parts for focused practice. Slow down tempo, loop sections, and track your progress.",
    accent: "from-emerald-500 to-teal-500",
  },
  {
    icon: "🌍",
    title: "Any Language, Any Accent",
    desc: "From Latin hymns to Swahili folk songs — our AI handles pronunciation, diction, and phrasing authentically across cultures.",
    accent: "from-amber-400 to-orange-500",
  },
];

const howItWorks = [
  { step: "1", title: "Upload or Write", desc: "Paste your lyrics, upload sheet music, or start from a template in our composer." },
  { step: "2", title: "Assign Parts", desc: "Define voice parts, set dynamics, tempo, and choose language/accent settings." },
  { step: "3", title: "Generate & Listen", desc: "Our AI renders a full choral performance in seconds. Preview, tweak, and perfect." },
  { step: "4", title: "Share or Practice", desc: "Publish to the library, share with your choir, or use for personal training." },
];

const testimonials = [
  { name: "Sarah M.", role: "Choir Director, Boston", quote: "Cantorium transformed how we prepare for performances. Singers can practice their parts at home with perfect pitch references." },
  { name: "Fr. Antonio", role: "Liturgical Composer, Rome", quote: "Finally, a tool that handles Latin pronunciation correctly. The AI voices are remarkably natural." },
  { name: "Kenji T.", role: "Music Teacher, Tokyo", quote: "My students can now hear complex harmonies before we attempt them. It's revolutionized our learning process." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      {/* Navigation */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/40 bg-cyan-500/10 text-lg font-bold text-cyan-200">
            C
          </div>
          <span className="text-xl font-semibold text-slate-50">Cantorium</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/library" className="text-sm text-slate-300 hover:text-cyan-100">
            Library
          </Link>
          <Link to="/signin" className="text-sm text-slate-300 hover:text-cyan-100">
            Sign In
          </Link>
          <Link
            to="/signup"
            className="rounded-2xl border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-cyan-500/20"
          >
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="mx-auto max-w-7xl px-6 py-20 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">AI-Powered Choral Studio</p>
        <h1 className="mt-4 text-5xl font-bold leading-tight text-slate-50 md:text-6xl lg:text-7xl">
          Turn Scripts into<br />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
            Stunning Choral Music
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
          Cantorium uses advanced AI to transform your lyrics and choral scripts into full vocal performances — 
          in any language, any accent, with perfect four-part harmony. Create, share, and practice like never before.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/signup"
            className="rounded-2xl border border-cyan-400/40 bg-cyan-500/20 px-8 py-4 text-lg font-semibold text-cyan-100 shadow-lg shadow-cyan-900/40 transition hover:-translate-y-1 hover:border-cyan-300 hover:bg-cyan-500/30"
          >
            Start Creating — It's Free
          </Link>
          <Link
            to="/library"
            className="rounded-2xl border border-slate-700 bg-slate-800/80 px-8 py-4 text-lg font-semibold text-slate-200 transition hover:-translate-y-1 hover:border-cyan-400/40 hover:text-cyan-100"
          >
            Explore the Library
          </Link>
        </div>

        {/* Hero Visual */}
        <div className="relative mx-auto mt-16 max-w-4xl">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/20 via-violet-500/20 to-emerald-500/20 blur-3xl" />
          <div className="relative rounded-3xl border border-cyan-400/20 bg-slate-900/80 p-6 shadow-2xl shadow-cyan-900/30 backdrop-blur">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="h-3 w-3 rounded-full bg-rose-500/70" />
              <div className="h-3 w-3 rounded-full bg-amber-500/70" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/70" />
              <span className="ml-3 text-xs text-slate-400">Cantorium Composer</span>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-left">
                <p className="text-xs uppercase tracking-wide text-slate-500">Lyrics Input</p>
                <p className="mt-2 font-mono text-sm text-slate-300">
                  Night descends in indigo<br />
                  Voices rise in gentle glow<br />
                  Hold the line and let it flow<br />
                  Cantorium will carry you home
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-left">
                <p className="text-xs uppercase tracking-wide text-slate-500">Voice Parts</p>
                <div className="mt-2 space-y-2">
                  {["Soprano", "Alto", "Tenor", "Bass"].map((part, i) => (
                    <div key={part} className="flex items-center justify-between rounded-xl bg-slate-900/60 px-3 py-1.5 text-xs">
                      <span className="text-slate-200">{part}</span>
                      <div className="h-2 w-16 rounded-full bg-slate-800">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                          style={{ width: `${80 - i * 10}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/5 p-4 text-left">
                <p className="text-xs uppercase tracking-wide text-emerald-400">AI Rendering</p>
                <div className="mt-2 flex items-center gap-2 text-sm text-emerald-200">
                  <span className="inline-block h-3 w-3 animate-pulse rounded-full bg-emerald-400" />
                  Generating 4-part harmony...
                </div>
                <p className="mt-2 text-xs text-slate-400">Language: English | Tempo: 88 BPM</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-300/80">Capabilities</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-50 md:text-4xl">Everything Your Choir Needs</h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            From composition to practice, Cantorium is the complete platform for choral musicians.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {features.map((f) => (
            <div
              key={f.title}
              className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg transition hover:-translate-y-1 hover:border-cyan-400/30"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${f.accent} opacity-5`} />
              <div className="relative">
                <span className="text-4xl">{f.icon}</span>
                <h3 className="mt-4 text-xl font-semibold text-slate-50">{f.title}</h3>
                <p className="mt-2 text-slate-400">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-violet-300/80">Simple Workflow</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-50 md:text-4xl">From Script to Song in Minutes</h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {howItWorks.map((step) => (
            <div key={step.step} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/40 bg-violet-500/10 text-xl font-bold text-violet-200">
                {step.step}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-50">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-emerald-300/80">Trusted Worldwide</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-50 md:text-4xl">Loved by Choir Directors & Musicians</h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <p className="text-slate-300">"{t.quote}"</p>
              <div className="mt-4 border-t border-slate-800 pt-4">
                <p className="font-semibold text-slate-100">{t.name}</p>
                <p className="text-sm text-slate-500">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="relative overflow-hidden rounded-3xl border border-cyan-400/30 bg-gradient-to-br from-slate-900 via-cyan-950/30 to-slate-900 p-12 text-center shadow-2xl shadow-cyan-900/30">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent" />
          <div className="relative">
            <h2 className="text-3xl font-bold text-slate-50 md:text-4xl">Ready to Transform Your Choir?</h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-300">
              Join thousands of musicians creating beautiful choral music with AI. Start free, upgrade when you're ready.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/signup"
                className="rounded-2xl border border-cyan-400/40 bg-cyan-500/20 px-8 py-4 text-lg font-semibold text-cyan-100 shadow-lg shadow-cyan-900/40 transition hover:-translate-y-1 hover:border-cyan-300 hover:bg-cyan-500/30"
              >
                Create Your Free Account
              </Link>
            </div>
            <p className="mt-4 text-sm text-slate-500">No credit card required • 3 free compositions per month</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/80">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-400/40 bg-cyan-500/10 text-sm font-bold text-cyan-200">
                C
              </div>
              <span className="font-semibold text-slate-200">Cantorium</span>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-slate-400">
              <Link to="/library" className="hover:text-cyan-100">Library</Link>
              <Link to="/create" className="hover:text-cyan-100">Composer</Link>
              <Link to="/practice" className="hover:text-cyan-100">Practice</Link>
              <a href="#" className="hover:text-cyan-100">Documentation</a>
              <a href="#" className="hover:text-cyan-100">Support</a>
            </div>
          </div>
          <div className="mt-8 border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
            © {new Date().getFullYear()} Cantorium. AI-powered choral music for everyone.
          </div>
        </div>
      </footer>
    </div>
  );
}
