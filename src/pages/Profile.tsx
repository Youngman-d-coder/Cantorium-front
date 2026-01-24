import { useState } from "react";
import { useAuth } from "../auth";
import { useToast } from "../components/ui/Toast";
import { Button, Badge, Card, Input } from "../components/ui/Components";

const plans = [
  { id: "free", name: "Starter", price: "$0", features: ["3 private compositions", "Basic practice metrics"], popular: false },
  { id: "pro", name: "Studio", price: "$18", features: ["Unlimited compositions", "Advanced render quality", "Analytics", "Priority support"], popular: true },
];

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
];

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState(user?.name || "");
  const [preferredLang, setPreferredLang] = useState("en");
  const [notifications, setNotifications] = useState({
    newShares: true,
    practiceSummaries: true,
    productUpdates: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [hasChanges, setHasChanges] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setHasChanges(false);
    toast({ type: 'success', title: 'Settings saved!', message: 'Your profile has been updated successfully.' });
  };

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    toast({ 
      type: 'info', 
      title: 'Plan selected', 
      message: planId === 'pro' ? 'Redirecting to checkout...' : 'You are on the free plan.' 
    });
  };

  const updateField = (callback: () => void) => {
    callback();
    setHasChanges(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="stagger-animation">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-300/80 flex items-center gap-2">
            <span>👤</span>
            Profile
          </p>
          <h1 className="text-2xl font-semibold text-slate-50">Account, preferences, subscription</h1>
          <p className="text-sm text-slate-300">Tune Cantorium to match your workflow and ensemble.</p>
        </div>
        <Button 
          variant="primary" 
          onClick={handleSave} 
          loading={isSaving}
          disabled={!hasChanges && !isSaving}
        >
          {isSaving ? 'Saving...' : hasChanges ? 'Save Changes' : 'No Changes'}
        </Button>
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 rounded-3xl border border-cyan-400/20 bg-slate-900/70 p-4 shadow-xl shadow-cyan-900/30 lg:col-span-2">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 text-sm text-slate-200">
            <Card className="p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500 mb-2 flex items-center gap-1">
                <span>✏️</span> Display Name
              </p>
              <Input 
                value={displayName}
                onChange={(e) => updateField(() => setDisplayName(e.target.value))}
                placeholder="Your display name"
              />
            </Card>
            <Card className="p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500 mb-2 flex items-center gap-1">
                <span>📧</span> Email
              </p>
              <Input 
                value={user?.email || ""}
                readOnly
                hint="Email cannot be changed"
                className="opacity-70 cursor-not-allowed"
              />
            </Card>
            <Card className="p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500 mb-2 flex items-center gap-1">
                <span>🌍</span> Preferred Language
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => updateField(() => setPreferredLang(lang.code))}
                    className={`rounded-full border px-3 py-1.5 text-xs transition-all duration-200 flex items-center gap-1.5 ${
                      preferredLang === lang.code
                        ? "border-cyan-400/50 bg-cyan-500/15 text-cyan-100 shadow-sm shadow-cyan-900/30"
                        : "border-slate-700 bg-slate-800/80 text-slate-100 hover:border-cyan-400/30 hover:bg-slate-800"
                    }`}
                    aria-pressed={preferredLang === lang.code}
                  >
                    <span>{lang.flag}</span>
                    {lang.name}
                  </button>
                ))}
              </div>
            </Card>
            <Card className="p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500 mb-2 flex items-center gap-1">
                <span>🔔</span> Notifications
              </p>
              <div className="mt-2 space-y-3 text-xs text-slate-200">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      checked={notifications.newShares}
                      onChange={(e) => updateField(() => setNotifications({ ...notifications, newShares: e.target.checked }))}
                      className="sr-only peer" 
                    />
                    <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-cyan-500 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </div>
                  <span className="group-hover:text-slate-100 transition-colors">New shares</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      checked={notifications.practiceSummaries}
                      onChange={(e) => updateField(() => setNotifications({ ...notifications, practiceSummaries: e.target.checked }))}
                      className="sr-only peer" 
                    />
                    <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-cyan-500 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </div>
                  <span className="group-hover:text-slate-100 transition-colors">Practice summaries</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      checked={notifications.productUpdates}
                      onChange={(e) => updateField(() => setNotifications({ ...notifications, productUpdates: e.target.checked }))}
                      className="sr-only peer" 
                    />
                    <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-cyan-500 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </div>
                  <span className="group-hover:text-slate-100 transition-colors">Product updates</span>
                </label>
              </div>
            </Card>
          </div>

          <Card className="p-3 text-sm text-slate-300">
            <p className="text-xs uppercase tracking-wide text-slate-500 flex items-center gap-1 mb-2">
              <span>👥</span> Connected Groups
            </p>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="info">Community Choir</Badge>
              <Badge variant="success">Chamber Ensemble</Badge>
            </div>
            <p className="text-xs text-slate-500">Invite members, manage roles, and share private pieces securely.</p>
            <Button variant="ghost" size="sm" className="mt-2">
              + Join or Create Group
            </Button>
          </Card>
        </div>

        <div className="space-y-3 rounded-3xl border border-emerald-400/20 bg-slate-900/70 p-4 shadow-xl shadow-emerald-900/30">
          <h3 className="text-lg font-semibold text-slate-50 flex items-center gap-2">
            <span>💎</span> Subscription
          </h3>
          <p className="text-sm text-slate-300">Choose a plan that fits your ensemble.</p>
          <div className="space-y-3">
            {plans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`p-3 text-sm text-slate-200 transition-all duration-300 cursor-pointer ${
                  selectedPlan === plan.id 
                    ? 'border-emerald-400/50 ring-1 ring-emerald-400/20' 
                    : 'hover:border-slate-700'
                }`}
                onClick={() => handlePlanSelect(plan.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs uppercase tracking-wide text-slate-500">{plan.name}</p>
                      {plan.popular && <Badge variant="success" className="text-[9px]">Popular</Badge>}
                    </div>
                    <p className="text-lg font-semibold text-slate-50">
                      {plan.price}
                      <span className="text-xs text-slate-500"> / mo</span>
                    </p>
                  </div>
                  <Button 
                    variant={selectedPlan === plan.id ? "success" : "primary"} 
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); handlePlanSelect(plan.id); }}
                  >
                    {selectedPlan === plan.id ? '✓ Current' : 'Select'}
                  </Button>
                </div>
                <ul className="mt-2 space-y-1 text-xs text-slate-300">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-1.5">
                      <span className="text-emerald-400">✓</span> {f}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
          
          {/* Danger Zone */}
          <div className="mt-4 pt-4 border-t border-slate-800">
            <p className="text-xs uppercase tracking-wide text-rose-400/80 mb-2">Danger Zone</p>
            <Button 
              variant="danger" 
              size="sm" 
              className="w-full"
              onClick={() => toast({ type: 'warning', title: 'Confirmation required', message: 'Please contact support to delete your account.' })}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
