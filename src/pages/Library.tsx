import { Link } from "react-router-dom";
import { useState } from "react";
import { useToast } from "../components/ui/Toast";
import { Button, Badge, Card, Input, EmptyState, Skeleton } from "../components/ui/Components";

const libraryItems = [
  { id: "l1", title: "Nocturne in Indigo", owner: "Sarah M.", difficulty: "Intermediate", tags: ["SATB", "English"], plays: 1240, forks: 32, language: "English", accent: "American" },
  { id: "l2", title: "Ave Maria", owner: "Fr. Antonio", difficulty: "Advanced", tags: ["SATB", "Latin"], plays: 3860, forks: 128, language: "Latin", accent: "Classical" },
  { id: "l3", title: "Lumen Cantorum", owner: "Choir Guild", difficulty: "Advanced", tags: ["TTBB", "Italian"], plays: 2200, forks: 44, language: "Italian", accent: "Tuscany" },
  { id: "l4", title: "African Sanctus", owner: "Kenji T.", difficulty: "Intermediate", tags: ["SATB", "Swahili"], plays: 980, forks: 21, language: "Swahili", accent: "East African" },
  { id: "l5", title: "Das Wohltemperierte", owner: "Anna B.", difficulty: "Advanced", tags: ["SSA", "German"], plays: 1560, forks: 38, language: "German", accent: "Bavarian" },
  { id: "l6", title: "Gloria Patri", owner: "Public Domain", difficulty: "Beginner", tags: ["SATB", "Latin"], plays: 5200, forks: 256, language: "Latin", accent: "Roman" },
];

const filterOptions = ["All", "My Scripts", "Shared With Me", "Public", "Latin", "English", "SATB", "SSA", "TTBB"];

export default function Library() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const { toast } = useToast();

  const handlePlay = (item: typeof libraryItems[0]) => {
    if (playingId === item.id) {
      setPlayingId(null);
      toast({ type: 'info', title: 'Playback stopped', message: `Stopped playing "${item.title}"` });
    } else {
      setPlayingId(item.id);
      toast({ type: 'success', title: 'Now playing', message: `Playing "${item.title}" by ${item.owner}` });
    }
  };

  const handleFork = (item: typeof libraryItems[0]) => {
    toast({ type: 'success', title: 'Script forked!', message: `"${item.title}" has been added to your scripts` });
  };

  const filteredItems = libraryItems.filter(item => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(query) ||
        item.owner.toLowerCase().includes(query) ||
        item.language.toLowerCase().includes(query)
      );
    }
    if (activeFilter === "All") return true;
    if (activeFilter === "Latin" || activeFilter === "English") return item.language === activeFilter;
    if (["SATB", "SSA", "TTBB"].includes(activeFilter)) return item.tags.includes(activeFilter);
    return true;
  });

  const getDifficultyVariant = (difficulty: string): "default" | "success" | "warning" | "error" | "info" => {
    switch (difficulty) {
      case "Beginner": return "success";
      case "Intermediate": return "warning";
      case "Advanced": return "error";
      default: return "default";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="stagger-animation">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-300/80 flex items-center gap-2">
            <span>📚</span>
            Script Library
          </p>
          <h1 className="text-2xl font-semibold text-slate-50">Choral Scripts & Arrangements</h1>
          <p className="text-sm text-slate-300">Browse community compositions, listen to AI renditions, and fork for your own choir.</p>
        </div>
        <Link to="/create">
          <Button variant="primary">
            <span className="mr-1">+</span> Upload New Script
          </Button>
        </Link>
      </header>

      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-200">
        <span className="text-slate-400">Filter:</span>
        {filterOptions.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`cursor-pointer rounded-full border px-3 py-1.5 transition-all duration-200 ${
              activeFilter === f
                ? "border-cyan-400/50 bg-cyan-500/15 text-cyan-100 shadow-sm shadow-cyan-900/30"
                : "border-slate-700 bg-slate-800/70 text-slate-300 hover:border-cyan-400/30 hover:text-cyan-100"
            }`}
            aria-pressed={activeFilter === f}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="rounded-3xl border border-cyan-400/20 bg-slate-900/70 p-4 shadow-xl shadow-cyan-900/30">
        <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-slate-200">
          <div className="relative">
            <input 
              className="w-64 rounded-2xl border border-slate-700 bg-slate-950/60 px-4 py-2 pl-10 text-sm text-slate-100 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-500/30 transition-all duration-200" 
              placeholder="Search by title, composer, language..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
          </div>
          <button className="rounded-full border border-slate-700 bg-slate-800/70 px-3 py-1.5 text-xs cursor-pointer hover:border-cyan-400/30 hover:bg-slate-800 transition-all duration-200 flex items-center gap-1">
            <span>📊</span> Difficulty
          </button>
          <button className="rounded-full border border-slate-700 bg-slate-800/70 px-3 py-1.5 text-xs cursor-pointer hover:border-cyan-400/30 hover:bg-slate-800 transition-all duration-200 flex items-center gap-1">
            <span>🌍</span> Language
          </button>
          <button className="rounded-full border border-slate-700 bg-slate-800/70 px-3 py-1.5 text-xs cursor-pointer hover:border-cyan-400/30 hover:bg-slate-800 transition-all duration-200 flex items-center gap-1">
            <span>🎵</span> Voice Type
          </button>
          <button className="rounded-full border border-slate-700 bg-slate-800/70 px-3 py-1.5 text-xs cursor-pointer hover:border-cyan-400/30 hover:bg-slate-800 transition-all duration-200 flex items-center gap-1">
            <span>🗣</span> Accent
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-6 w-48 mb-1" />
                <Skeleton className="h-4 w-32 mb-3" />
                <div className="flex gap-2 mb-4">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-20" />
                  <Skeleton className="h-10 w-20" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <EmptyState
            icon="📚"
            title="No scripts found"
            description={searchQuery ? `No results for "${searchQuery}". Try a different search term.` : "No scripts match your current filters."}
            action={
              <Button variant="ghost" onClick={() => { setSearchQuery(""); setActiveFilter("All"); }}>
                Clear filters
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item, index) => (
              <Card
                key={item.id}
                className="p-4 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-lg hover:shadow-cyan-900/20 group"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={getDifficultyVariant(item.difficulty)} className="text-[10px]">
                        {item.difficulty}
                      </Badge>
                      <span className="text-xs text-slate-500">{item.language}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-50 group-hover:text-cyan-100 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-400">By {item.owner}</p>
                    <p className="mt-1 text-xs text-slate-500 flex items-center gap-1">
                      <span>🗣</span> {item.accent}
                    </p>
                  </div>
                  <Badge variant="info">{item.tags[0]}</Badge>
                </div>
                <div className="mt-3 flex items-center gap-3 text-xs text-slate-300">
                  <span className="rounded-full border border-slate-700 bg-slate-800/80 px-2 py-1 flex items-center gap-1">
                    <span>🎧</span> {item.plays.toLocaleString()}
                  </span>
                  <span className="rounded-full border border-slate-700 bg-slate-800/80 px-2 py-1 flex items-center gap-1">
                    <span>🔀</span> {item.forks}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-sm">
                  <Button
                    variant={playingId === item.id ? "danger" : "primary"}
                    size="sm"
                    onClick={() => handlePlay(item)}
                  >
                    {playingId === item.id ? '⏹ Stop' : '▶ Listen'}
                  </Button>
                  <Link to="/practice">
                    <Button variant="success" size="sm">
                      🎤 Practice
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={() => handleFork(item)}>
                    Fork Script
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Featured Section */}
      <section className="rounded-3xl border border-violet-400/20 bg-slate-900/70 p-6 shadow-xl shadow-violet-900/30 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-50 flex items-center gap-2">
              <span className="text-yellow-400">🌟</span>
              Featured This Week
            </h2>
            <p className="text-sm text-slate-400">Hand-picked arrangements showcasing AI vocal synthesis</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card className="border-violet-400/30 bg-violet-500/5 hover:border-violet-400/50 transition-all duration-300 group">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-violet-500/20 p-2 group-hover:scale-110 transition-transform">
                <span className="text-xl">👑</span>
              </div>
              <div className="flex-1">
                <Badge variant="info" className="mb-1">Staff Pick</Badge>
                <h3 className="text-lg font-semibold text-slate-50 group-hover:text-violet-100 transition-colors">Miserere mei, Deus</h3>
                <p className="text-sm text-slate-300">Classic polyphonic setting rendered in authentic Renaissance Latin pronunciation.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="default">SSAATTBB</Badge>
                  <span className="rounded-full border border-slate-700 bg-slate-800/80 px-2 py-1 text-xs text-slate-300">Latin</span>
                </div>
              </div>
            </div>
          </Card>
          <Card className="border-emerald-400/30 bg-emerald-500/5 hover:border-emerald-400/50 transition-all duration-300 group">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-emerald-500/20 p-2 group-hover:scale-110 transition-transform">
                <span className="text-xl">🔥</span>
              </div>
              <div className="flex-1">
                <Badge variant="success" className="mb-1">Trending</Badge>
                <h3 className="text-lg font-semibold text-slate-50 group-hover:text-emerald-100 transition-colors">Siyahamba</h3>
                <p className="text-sm text-slate-300">South African hymn with authentic Zulu pronunciation and rhythmic energy.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="success">SATB</Badge>
                  <span className="rounded-full border border-slate-700 bg-slate-800/80 px-2 py-1 text-xs text-slate-300">Zulu</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
