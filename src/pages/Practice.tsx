import { useState } from "react";
import { useToast } from "../components/ui/Toast";
import { Button, Badge, Card, ProgressBar } from "../components/ui/Components";

const practicePieces = [
  { id: "p1", title: "Nocturne in Indigo", part: "Tenor", tempo: 88, key: "Dm", language: "English" },
  { id: "p2", title: "Ave Maria", part: "Soprano", tempo: 72, key: "F", language: "Latin" },
  { id: "p3", title: "Lumen Cantorum", part: "Bass", tempo: 96, key: "Bb", language: "Italian" },
];

const voiceParts = [
  { name: "Soprano", color: "cyan", volume: 80 },
  { name: "Alto", color: "violet", volume: 70 },
  { name: "Tenor", color: "emerald", volume: 100 },
  { name: "Bass", color: "amber", volume: 60 },
];

export default function Practice() {
  const [activePart, setActivePart] = useState("Tenor");
  const [tempo, setTempo] = useState(88);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [practiceMode, setPracticeMode] = useState<'guided' | 'free'>('guided');
  const [loopEnabled, setLoopEnabled] = useState(false);
  const [metronomeEnabled, setMetronomeEnabled] = useState(false);
  const { showToast } = useToast();

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    showToast(
      isPlaying ? 'Practice session paused' : 'Practice session started',
      isPlaying ? 'info' : 'success'
    );
  };

  const handleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      showToast('Your recording has been saved for comparison', 'success');
    } else {
      setIsRecording(true);
      showToast('Sing along with the playback...', 'info');
    }
  };

  const handleLoadPiece = (piece: typeof practicePieces[0]) => {
    setActivePart(piece.part);
    setTempo(piece.tempo);
    showToast(`Now practicing "${piece.title}" - ${piece.part} part`, 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="stagger-animation">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-300/80 flex items-center gap-2">
            <span>🎵</span>
            Practice Studio
          </p>
          <h1 className="text-2xl font-semibold text-slate-50">Choral Training Mode</h1>
          <p className="text-sm text-slate-300">Isolate your voice part, slow down tempo, loop sections, and perfect your performance.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-200">
          <button
            onClick={() => setPracticeMode('guided')}
            className={`rounded-full border px-3 py-1.5 transition-all duration-200 ${
              practiceMode === 'guided'
                ? 'border-emerald-400/50 bg-emerald-500/15 text-emerald-100 shadow-sm shadow-emerald-900/30'
                : 'border-slate-700 bg-slate-800/70 text-slate-300 hover:border-emerald-400/30'
            }`}
            aria-pressed={practiceMode === 'guided'}
          >
            Guided Mode
          </button>
          <button
            onClick={() => setPracticeMode('free')}
            className={`rounded-full border px-3 py-1.5 transition-all duration-200 ${
              practiceMode === 'free'
                ? 'border-cyan-400/50 bg-cyan-500/15 text-cyan-100 shadow-sm shadow-cyan-900/30'
                : 'border-slate-700 bg-slate-800/70 text-slate-300 hover:border-cyan-400/30'
            }`}
            aria-pressed={practiceMode === 'free'}
          >
            Free Practice
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Main Practice Area */}
        <div className="space-y-4 rounded-3xl border border-cyan-400/20 bg-slate-900/70 p-4 shadow-xl shadow-cyan-900/30 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Now Practicing</p>
              <h3 className="text-lg font-semibold text-slate-50 flex items-center gap-2">
                Nocturne in Indigo
                {isPlaying && <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />}
              </h3>
              <p className="text-sm text-slate-300">
                <span className="text-cyan-300 font-medium">{activePart}</span> part | {tempo} BPM | Key of Dm | English
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-200">
              <button 
                onClick={() => { setLoopEnabled(!loopEnabled); showToast(loopEnabled ? 'Loop disabled' : 'Loop enabled', 'info'); }}
                className={`rounded-full border px-3 py-1.5 transition-all duration-200 flex items-center gap-1 ${
                  loopEnabled ? 'border-cyan-400/50 bg-cyan-500/15 text-cyan-100' : 'border-slate-700 bg-slate-800/70 hover:border-cyan-400/30'
                }`}
              >
                <span>🔁</span> Loop A/B
              </button>
              <button 
                onClick={() => { setMetronomeEnabled(!metronomeEnabled); showToast(metronomeEnabled ? 'Metronome off' : 'Metronome on', 'info'); }}
                className={`rounded-full border px-3 py-1.5 transition-all duration-200 flex items-center gap-1 ${
                  metronomeEnabled ? 'border-violet-400/50 bg-violet-500/15 text-violet-100' : 'border-slate-700 bg-slate-800/70 hover:border-violet-400/30'
                }`}
              >
                <span>🎚️</span> Metronome
              </button>
            </div>
          </div>

          {/* Waveform Display */}
          <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 p-4">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-mono">0:00</span>
              <span>Measures 1-16</span>
              <span className="font-mono">2:34</span>
            </div>
            <div className={`h-32 rounded-xl border bg-slate-950/70 relative overflow-hidden transition-all duration-300 ${isPlaying ? 'border-cyan-400/50' : 'border-slate-800'}`}>
              {/* Simulated waveform visualization */}
              <div className="absolute inset-0 flex items-center justify-center gap-0.5">
                {Array.from({ length: 60 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-full transition-all duration-300 ${
                      isPlaying 
                        ? 'bg-gradient-to-t from-cyan-500/50 to-cyan-400/80 animate-pulse' 
                        : 'bg-gradient-to-t from-cyan-500/30 to-cyan-400/60'
                    }`}
                    style={{ 
                      height: `${20 + Math.random() * 60}%`,
                      animationDelay: `${i * 0.02}s`
                    }}
                  />
                ))}
              </div>
              {/* Playhead */}
              <div className={`absolute left-1/3 top-0 bottom-0 w-0.5 transition-all duration-300 ${isPlaying ? 'bg-cyan-400 shadow-lg shadow-cyan-400/50' : 'bg-cyan-400/50'}`} />
              {/* Recording indicator */}
              {isRecording && (
                <div className="absolute top-2 right-2 flex items-center gap-1.5 rounded-full bg-rose-500/20 px-2 py-1 text-xs text-rose-300">
                  <span className="inline-block h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                  Recording
                </div>
              )}
            </div>
            <div className="mt-3 flex items-center justify-center gap-3">
              <Button variant="ghost" size="sm">⏮ Prev</Button>
              <Button 
                variant={isPlaying ? "danger" : "primary"} 
                className="px-6 py-3 text-lg"
                onClick={handlePlay}
              >
                {isPlaying ? '⏸ Pause' : '▶ Play'}
              </Button>
              <Button variant="ghost" size="sm">Next ⏭</Button>
            </div>
          </div>

          {/* Part Mix Controls */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Card className="p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500 mb-3 flex items-center gap-1">
                <span>🎛️</span> Voice Part Mixer
              </p>
              <p className="text-xs text-slate-400 mb-2">Isolate your part or hear the full blend</p>
              <div className="space-y-3">
                {voiceParts.map((part) => (
                  <div key={part.name} className="flex items-center justify-between text-xs group">
                    <button 
                      onClick={() => setActivePart(part.name)}
                      className={`font-semibold transition-colors flex items-center gap-1 ${activePart === part.name ? 'text-cyan-300' : 'text-slate-300 hover:text-slate-100'}`}
                    >
                      {part.name} 
                      {activePart === part.name && <Badge variant="info" className="text-[9px]">Active</Badge>}
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-mono">{part.volume}%</span>
                      <div className="h-2 w-24 rounded-full bg-slate-800 overflow-hidden">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            part.name === 'Soprano' ? 'bg-gradient-to-r from-cyan-400 to-cyan-500' :
                            part.name === 'Alto' ? 'bg-gradient-to-r from-violet-400 to-violet-500' :
                            part.name === 'Tenor' ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' :
                            'bg-gradient-to-r from-amber-400 to-amber-500'
                          }`}
                          style={{ width: `${part.volume}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500 mb-3 flex items-center gap-1">
                <span>⏱️</span> Tempo Control
              </p>
              <p className="text-xs text-slate-400 mb-2">Slow down without pitch shift</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input 
                    type="range" 
                    min="50" 
                    max="120" 
                    value={tempo}
                    onChange={(e) => setTempo(Number(e.target.value))}
                    className="flex-1 accent-emerald-400 h-2 rounded-full"
                  />
                  <span className="text-lg font-semibold text-emerald-100 font-mono min-w-[3rem] text-right">{tempo}%</span>
                </div>
                <div className="flex gap-2">
                  {[50, 75, 100].map((t) => (
                    <button 
                      key={t}
                      onClick={() => setTempo(t)} 
                      className={`rounded-lg border px-3 py-1.5 text-xs transition-all duration-200 ${
                        tempo === t 
                          ? 'border-emerald-400/50 bg-emerald-500/15 text-emerald-100' 
                          : 'border-slate-700 text-slate-300 hover:border-emerald-400/30 hover:bg-slate-800'
                      }`}
                    >
                      {t}%
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Takes & Recordings */}
          <Card className="p-3">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 flex items-center gap-1">
                  <span>🎙️</span> Your Practice Takes
                </p>
                <p className="text-xs text-slate-400">Record yourself and compare with the AI</p>
              </div>
              <Button 
                variant={isRecording ? "danger" : "ghost"} 
                size="sm"
                onClick={handleRecord}
              >
                {isRecording ? '⏹ Stop Recording' : '🎙 Record New Take'}
              </Button>
            </div>
            <div className="space-y-2 text-xs text-slate-200">
              <div className="flex items-center justify-between rounded-xl border border-emerald-400/30 bg-emerald-500/5 px-3 py-2 transition-all duration-200 hover:bg-emerald-500/10 group cursor-pointer">
                <span className="flex items-center gap-2">
                  <span className="text-emerald-400">🏆</span>
                  Take 3 — Today 2:15 PM
                </span>
                <Badge variant="success">Best Match 94%</Badge>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 transition-all duration-200 hover:border-slate-700 hover:bg-slate-900 cursor-pointer">
                <span>Take 2 — Today 1:45 PM</span>
                <span className="text-slate-400">Match 87%</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 transition-all duration-200 hover:border-slate-700 hover:bg-slate-900 cursor-pointer">
                <span>Take 1 — Today 1:30 PM</span>
                <span className="text-slate-400">Match 72%</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="rounded-3xl border-emerald-400/20 shadow-xl shadow-emerald-900/30 p-4">
            <h3 className="text-lg font-semibold text-slate-50 flex items-center gap-2">
              <span>📚</span> Select a Piece
            </h3>
            <p className="text-sm text-slate-400 mb-3">From your library or recent sessions</p>
            <div className="space-y-2 text-sm text-slate-200">
              {practicePieces.map((p, index) => (
                <div 
                  key={p.id} 
                  className="rounded-2xl border border-slate-800 bg-slate-950/60 px-3 py-2 hover:border-cyan-400/30 cursor-pointer transition-all duration-200 hover:bg-slate-950/80 group"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-100 group-hover:text-cyan-100 transition-colors">{p.title}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <Badge variant="default" className="text-[9px]">{p.part}</Badge>
                        <span>{p.tempo} BPM</span>
                        <span>•</span>
                        <span>{p.language}</span>
                      </p>
                    </div>
                    <Button variant="primary" size="sm" onClick={() => handleLoadPiece(p)}>
                      Load
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="rounded-3xl border-violet-400/20 shadow-xl shadow-violet-900/30 p-4">
            <h3 className="text-lg font-semibold text-slate-50 flex items-center gap-2">
              <span>🎯</span> Practice Goals
            </h3>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Sessions this week</span>
                <span className="font-semibold text-violet-200">4 / 5</span>
              </div>
              <ProgressBar value={80} max={100} color="violet" />
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <span className="text-amber-400">⚡</span>
                1 more session to hit your weekly goal!
              </p>
            </div>
          </Card>

          <Card className="rounded-3xl p-4">
            <h3 className="text-lg font-semibold text-slate-50 flex items-center gap-2">
              <span>💡</span> Practice Tips
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li className="flex items-start gap-2 group hover:text-slate-300 transition-colors">
                <span className="text-cyan-400">•</span>
                <span>Start at 50% tempo for difficult passages</span>
              </li>
              <li className="flex items-start gap-2 group hover:text-slate-300 transition-colors">
                <span className="text-emerald-400">•</span>
                <span>Use loop mode to master tricky intervals</span>
              </li>
              <li className="flex items-start gap-2 group hover:text-slate-300 transition-colors">
                <span className="text-violet-400">•</span>
                <span>Mute other parts to focus on your line</span>
              </li>
              <li className="flex items-start gap-2 group hover:text-slate-300 transition-colors">
                <span className="text-amber-400">•</span>
                <span>Record takes to track improvement</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
