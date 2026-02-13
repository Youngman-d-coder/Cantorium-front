import { useState } from "react";
import { useToast } from "../components/ui/Toast";
import { Button, Badge, Card } from "../components/ui/Components";

const templates = [
  { id: "satb", label: "SATB", desc: "Standard mixed choir", accent: "from-cyan-500 to-blue-500", voices: ["Soprano", "Alto", "Tenor", "Bass"], icon: "🎵" },
  { id: "ssa", label: "SSA", desc: "Treble voices", accent: "from-fuchsia-500 to-purple-500", voices: ["Soprano 1", "Soprano 2", "Alto"], icon: "👩‍🎤" },
  { id: "ttbb", label: "TTBB", desc: "Lower voices", accent: "from-emerald-500 to-teal-500", voices: ["Tenor 1", "Tenor 2", "Baritone", "Bass"], icon: "👨‍🎤" },
  { id: "satbb", label: "SATBB", desc: "Extended bass", accent: "from-amber-500 to-orange-500", voices: ["Soprano", "Alto", "Tenor", "Baritone", "Bass"], icon: "🎭" },
];

const languages = [
  { code: "en", name: "English", accents: ["American", "British", "Australian"], flag: "🇬🇧" },
  { code: "la", name: "Latin", accents: ["Classical", "Ecclesiastical", "Italian"], flag: "🏛️" },
  { code: "it", name: "Italian", accents: ["Standard", "Tuscan", "Sicilian"], flag: "🇮🇹" },
  { code: "fr", name: "French", accents: ["Parisian", "Canadian", "Belgian"], flag: "🇫🇷" },
  { code: "de", name: "German", accents: ["Standard", "Austrian", "Swiss"], flag: "🇩🇪" },
  { code: "es", name: "Spanish", accents: ["Castilian", "Latin American", "Andalusian"], flag: "🇪🇸" },
  { code: "sw", name: "Swahili", accents: ["Kenyan", "Tanzanian"], flag: "🇰🇪" },
  { code: "zu", name: "Zulu", accents: ["Standard"], flag: "🇿🇦" },
];

export default function Create() {
  const [selectedTemplate, setSelectedTemplate] = useState("satb");
  const [selectedLang, setSelectedLang] = useState("en");
  const [selectedAccent, setSelectedAccent] = useState("American");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lyrics, setLyrics] = useState(`Night descends in indigo
Voices rise in gentle glow
Hold the line and let it flow
Cantorium will carry you home`);
  const { showToast } = useToast();

  const currentLang = languages.find(l => l.code === selectedLang);
  const currentTemplate = templates.find(t => t.id === selectedTemplate);

  const handleSaveDraft = async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise(r => setTimeout(r, 1000));
    setIsSaving(false);
    showToast("Draft saved successfully!", "success");
  };

  const handleGenerate = async () => {
    if (!lyrics.trim()) {
      showToast("Please enter some lyrics first", "warning");
      return;
    }
    setIsGenerating(true);
    showToast("AI is generating your choral rendition...", "info", 3000);
    // Simulate generation
    await new Promise(r => setTimeout(r, 3000));
    setIsGenerating(false);
    showToast("🎵 Choral rendition generated successfully!", "success");
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-300/80">AI Composer</p>
          <h1 className="text-2xl font-semibold text-slate-50">Create New Choral Composition</h1>
          <p className="text-sm text-slate-300">Enter lyrics, choose voice arrangement, and let AI generate a full choral rendition.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="secondary" 
            onClick={handleSaveDraft}
            loading={isSaving}
          >
            Save Draft
          </Button>
          <Button 
            variant="success" 
            onClick={handleGenerate}
            loading={isGenerating}
            disabled={!lyrics.trim()}
          >
            🎙 Generate AI Rendition
          </Button>
        </div>
      </header>

      {/* Voice Template Selection */}
      <section>
        <h2 className="text-lg font-semibold text-slate-50 mb-3">1. Choose Voice Arrangement</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {templates.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => setSelectedTemplate(tpl.id)}
              className={`group relative overflow-hidden rounded-3xl border px-4 py-5 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-lg shadow-slate-950/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${
                selectedTemplate === tpl.id
                  ? "border-cyan-400/40 bg-slate-900/80 ring-2 ring-cyan-500/30"
                  : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
              }`}
              aria-pressed={selectedTemplate === tpl.id}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${tpl.accent} opacity-10 transition-opacity group-hover:opacity-20`} />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Template</p>
                  <span className="text-2xl transition-transform group-hover:scale-110">{tpl.icon}</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-50 group-hover:text-cyan-200 transition-colors">{tpl.label}</h3>
                <p className="text-sm text-slate-300">{tpl.desc}</p>
                <p className="text-xs text-slate-500 mt-1">{tpl.voices.length} voices</p>
                {selectedTemplate === tpl.id && (
                  <Badge variant="success" className="mt-2">✓ Selected</Badge>
                )}
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Lyrics Input */}
        <Card accent="cyan" className="lg:col-span-2 p-4 space-y-4">
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-50">2. Enter Lyrics & Script</h2>
              <p className="text-sm text-slate-400">Paste or type your choral text. AI will analyze syllables and phrasing.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                📄 Import .txt
              </Button>
              <Button variant="ghost" size="sm">
                📑 Import PDF
              </Button>
            </div>
          </header>
          <textarea
            className="min-h-[200px] w-full rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-100 outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-500/30 font-mono transition-all resize-y"
            placeholder="Paste lyrics here..."
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            aria-label="Lyrics input"
          />
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="tabular-nums">{lyrics.split(/\s+/).filter(Boolean).length} words • {lyrics.split('\n').length} lines</span>
            {lyrics.trim() ? (
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400"></span>
                AI-ready for syllable analysis
              </span>
            ) : (
              <span className="flex items-center gap-1 text-slate-500">
                <span className="inline-block h-2 w-2 rounded-full bg-slate-500"></span>
                Enter lyrics to begin
              </span>
            )}
          </div>

          {/* Language & Accent Selection */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Language</p>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setSelectedLang(lang.code);
                      const firstAccent = lang.accents[0];
                      if (firstAccent) {
                        setSelectedAccent(firstAccent);
                      }
                    }}
                    className={`rounded-full border px-3 py-1.5 text-xs transition-all duration-200 flex items-center gap-1.5 ${
                      selectedLang === lang.code
                        ? "border-cyan-400/50 bg-cyan-500/15 text-cyan-100 shadow-sm shadow-cyan-900/30"
                        : "border-slate-700 bg-slate-800/80 text-slate-100 hover:border-cyan-400/30 hover:bg-slate-800"
                    }`}
                    aria-pressed={selectedLang === lang.code}
                  >
                    <span>{lang.flag}</span>
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Accent / Pronunciation Style</p>
              <div className="flex flex-wrap gap-2">
                {currentLang?.accents.map((accent) => (
                  <button
                    key={accent}
                    onClick={() => setSelectedAccent(accent)}
                    className={`rounded-full border px-3 py-1.5 text-xs transition-all duration-200 ${
                      selectedAccent === accent
                        ? "border-emerald-400/50 bg-emerald-500/15 text-emerald-100 shadow-sm shadow-emerald-900/30"
                        : "border-slate-700 bg-slate-800/80 text-slate-100 hover:border-emerald-400/30 hover:bg-slate-800"
                    }`}
                    aria-pressed={selectedAccent === accent}
                  >
                    {accent}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Dynamics & Tempo */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Dynamics & Expression</p>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 text-sm">
              <div>
                <label className="text-xs text-slate-400">Tempo (BPM)</label>
                <input type="number" defaultValue={88} className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-slate-100" />
              </div>
              <div>
                <label className="text-xs text-slate-400">Key</label>
                <select className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-slate-100">
                  <option>D minor</option>
                  <option>C major</option>
                  <option>G major</option>
                  <option>F major</option>
                  <option>A minor</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400">Dynamics</label>
                <select className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-slate-100">
                  <option>Piano (soft)</option>
                  <option>Mezzo-piano</option>
                  <option>Mezzo-forte</option>
                  <option>Forte (loud)</option>
                  <option>Crescendo</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400">Style</label>
                <select className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-slate-100">
                  <option>Legato (smooth)</option>
                  <option>Staccato</option>
                  <option>Marcato</option>
                  <option>Rubato</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Voice Parts Panel */}
        <div className="space-y-4 rounded-3xl border border-emerald-400/20 bg-slate-900/70 p-4 shadow-xl shadow-emerald-900/30 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <header className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-50 flex items-center gap-2">
              <span className="text-emerald-400">🎤</span>
              3. Voice Parts
            </h2>
            <Badge variant="success">{selectedTemplate.toUpperCase()}</Badge>
          </header>
          <p className="text-sm text-slate-400">AI will distribute lyrics across these voice parts automatically.</p>
          
          <div className="space-y-3 text-sm text-slate-200">
            {currentTemplate?.voices.map((part, index) => (
              <div 
                key={part} 
                className="rounded-2xl border border-slate-800 bg-slate-950/50 px-3 py-3 transition-all duration-200 hover:border-emerald-400/30 hover:bg-slate-950/70 group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-cyan-100 group-hover:text-cyan-50">{part}</span>
                  <span className="rounded-full border border-slate-700 bg-slate-800/60 px-2 py-1 text-xs text-slate-400 flex items-center gap-1">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    AI Auto
                  </span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-2 rounded-full bg-gradient-to-r from-cyan-400/60 to-blue-500/60 transition-all duration-500" 
                    style={{ width: `${60 + Math.random() * 40}%` }} 
                  />
                </div>
                <p className="mt-2 text-xs text-slate-400">Range & phrasing optimized for this voice</p>
              </div>
            ))}
          </div>

          {/* Preview Panel */}
          <Card className="border-violet-400/30 bg-violet-500/5">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-violet-500/20 p-2">
                <span className="text-lg">🔮</span>
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wide text-violet-400 font-medium">AI Preview</p>
                <p className="mt-1 text-sm text-slate-200">Click "Generate AI Rendition" to hear a preview of your composition with full vocal synthesis.</p>
                <div className="mt-3 flex items-center gap-2 text-xs">
                  {lyrics.trim() ? (
                    <>
                      <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-emerald-300">Ready to generate</span>
                    </>
                  ) : (
                    <>
                      <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
                      <span className="text-amber-300">Add lyrics to continue</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Button
            variant="success"
            className="w-full"
            onClick={handleGenerate}
            disabled={!lyrics.trim() || isGenerating}
            loading={isGenerating}
          >
            {isGenerating ? 'Generating...' : '🎙 Generate AI Rendition'}
          </Button>
        </div>
      </section>
    </div>
  );
}
