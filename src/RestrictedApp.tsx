import React, { useState, useEffect } from "react";
import { Shield, Zap, LogOut, Atom, AlertTriangle, Lock } from "lucide-react";

// MONTU restricted app: login (admin-provisioned) → real reactor-fleet reference
// data + an explicitly-labeled educational physics simulator. No fabricated
// "live" control-room telemetry.

interface Unit { id: string; name: string; country: string; type: string; netMWe: number; status: string; firstGridYear: number }
interface Stats { unitsTracked: number; operationalUnits: number; totalOperationalNetMWe: number; countries: number; byType: Record<string, number> }

const inputCls = "w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 rounded-none";
const btnCls = "px-4 py-2 text-xs font-mono font-bold uppercase tracking-widest border bg-emerald-500 text-zinc-950 border-emerald-500 hover:bg-emerald-400 disabled:opacity-40 rounded-none";
const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || "";

export default function RestrictedApp() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("montu_token"));
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [fleet, setFleet] = useState<{ stats?: Stats; units?: Unit[]; note?: string }>({});
  const [fleetError, setFleetError] = useState<string | null>(null);

  // Educational sim state
  const [rod, setRod] = useState(50);
  const [demand, setDemand] = useState(900);
  const [capacity, setCapacity] = useState(1600);
  const [simResult, setSimResult] = useState<any>(null);

  useEffect(() => {
    if (token) fetchFleet(token);
  }, [token]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setLoginError(null);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Login failed");
      localStorage.setItem("montu_token", j.token);
      setToken(j.token);
      setUser(j.user);
    } catch (err: any) { setLoginError(err.message); }
    finally { setBusy(false); }
  };

  const fetchFleet = async (t: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/fleet`, { headers: { Authorization: `Bearer ${t}` } });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Failed to load fleet");
      setFleet(j);
    } catch (err: any) { setFleetError(err.message); }
  };

  const runSim = async () => {
    if (!token) return;
    setBusy(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/simulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ controlRodDepthPct: rod, powerDemandMWe: demand, netCapacityMWe: capacity }),
      });
      const j = await res.json();
      if (res.ok) setSimResult(j);
    } finally { setBusy(false); }
  };

  const logout = () => {
    localStorage.removeItem("montu_token");
    setToken(null); setUser(null); setFleet({});
  };

  // --- Login gate ---
  if (!token) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-6">
        <div className="w-full max-w-md border border-zinc-800 bg-zinc-900/50 p-8">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-5 h-5 text-emerald-500" />
            <span className="text-lg font-black uppercase tracking-tight">MONTU</span>
            <span className="text-[9px] font-mono px-2 py-0.5 bg-red-500/20 text-red-400 border border-red-500/30 uppercase">Restricted</span>
          </div>
          <p className="text-xs text-zinc-400 mb-6 font-light">
            Nuclear-energy intelligence. Access requires an account provisioned by a Sans Mercantile operator.
          </p>
          <form onSubmit={login} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} />
            </div>
            {loginError && <p className="text-xs text-red-400 flex items-center gap-2"><AlertTriangle className="w-4 h-4" />{loginError}</p>}
            <button type="submit" disabled={busy} className={`${btnCls} w-full`}>{busy ? "Authenticating…" : "Sign In"}</button>
          </form>
          <p className="text-[10px] font-mono text-zinc-600 mt-6">No public signup. Contact your operator for an account.</p>
        </div>
      </div>
    );
  }

  // --- Restricted dashboard ---
  const stats = fleet.stats;
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 bg-zinc-950/90 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Atom className="w-5 h-5 text-emerald-500" />
            <span className="font-black uppercase tracking-tight text-sm">MONTU</span>
            <span className="text-[9px] font-mono px-2 py-0.5 bg-red-500/20 text-red-400 border border-red-500/30 uppercase">Restricted</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-zinc-500">{user?.email}</span>
            <button onClick={logout} className="flex items-center gap-1 text-xs font-mono text-zinc-400 hover:text-white border border-zinc-700 px-2 py-1 rounded-none">
              <LogOut className="w-3.5 h-3.5" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-6 space-y-8">
        <p className="text-[11px] font-sans text-zinc-400 border-l-2 border-emerald-500 pl-3">
          {fleet.note || "Public reference data (nameplate capacity/status), not live telemetry."}
        </p>

        {/* Fleet stats */}
        {fleetError && <p className="text-red-400 text-sm">{fleetError}</p>}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border border-zinc-800 bg-zinc-900/50 p-4"><div className="text-2xl font-black">{stats.unitsTracked}</div><div className="text-[10px] font-mono text-zinc-500 uppercase">Units tracked</div></div>
            <div className="border border-zinc-800 bg-zinc-900/50 p-4"><div className="text-2xl font-black text-emerald-400">{stats.operationalUnits}</div><div className="text-[10px] font-mono text-zinc-500 uppercase">Operational</div></div>
            <div className="border border-zinc-800 bg-zinc-900/50 p-4"><div className="text-2xl font-black">{stats.totalOperationalNetMWe.toLocaleString()}</div><div className="text-[10px] font-mono text-zinc-500 uppercase">Net MWe (operational)</div></div>
            <div className="border border-zinc-800 bg-zinc-900/50 p-4"><div className="text-2xl font-black">{stats.countries}</div><div className="text-[10px] font-mono text-zinc-500 uppercase">Countries</div></div>
          </div>
        )}

        {/* Fleet table */}
        {fleet.units && (
          <div className="border border-zinc-800 bg-zinc-900/50">
            <div className="px-4 py-3 border-b border-zinc-800 flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">Reactor Fleet Reference</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[10px] font-mono uppercase text-zinc-500 border-b border-zinc-800">
                    <th className="px-4 py-2">Unit</th><th className="px-4 py-2">Country</th><th className="px-4 py-2">Type</th>
                    <th className="px-4 py-2">Net MWe</th><th className="px-4 py-2">Status</th><th className="px-4 py-2">First grid</th>
                  </tr>
                </thead>
                <tbody>
                  {fleet.units.map((u) => (
                    <tr key={u.id} className="border-b border-zinc-800/60">
                      <td className="px-4 py-2 font-bold text-zinc-100">{u.name}</td>
                      <td className="px-4 py-2">{u.country}</td>
                      <td className="px-4 py-2">{u.type}</td>
                      <td className="px-4 py-2">{u.netMWe.toLocaleString()}</td>
                      <td className="px-4 py-2">
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 border ${u.status === "operational" ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" : u.status === "under construction" ? "text-amber-400 border-amber-500/30 bg-amber-500/10" : "text-zinc-400 border-zinc-600"}`}>{u.status}</span>
                      </td>
                      <td className="px-4 py-2">{u.firstGridYear || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Educational simulator */}
        <div className="border border-amber-500/30 bg-amber-500/5">
          <div className="px-4 py-3 border-b border-amber-500/20 flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">Educational Reactor Physics Simulator</span>
          </div>
          <div className="p-4 space-y-4">
            <p className="text-[11px] font-sans text-amber-200/90 border-l-2 border-amber-400 pl-3">
              A transparent point-model for learning reactor physics — how control-rod depth and demand relate to power. <strong>Not reactor control</strong>, and not based on any real reactor's telemetry.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1">Control rod depth: {rod}%</label>
                <input type="range" min={0} max={100} value={rod} onChange={(e) => setRod(+e.target.value)} className="w-full accent-emerald-500" />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1">Demand (MWe)</label>
                <input type="number" value={demand} onChange={(e) => setDemand(+e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1">Net capacity (MWe)</label>
                <input type="number" value={capacity} onChange={(e) => setCapacity(+e.target.value)} className={inputCls} />
              </div>
            </div>
            <button onClick={runSim} disabled={busy} className={btnCls}>{busy ? "Computing…" : "Run model"}</button>
            {simResult && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                <div className="bg-zinc-950/60 border border-zinc-800 p-3"><div className="text-lg font-black">{simResult.outputs.reactivity}</div><div className="text-[9px] font-mono text-zinc-500 uppercase">Reactivity</div></div>
                <div className="bg-zinc-950/60 border border-zinc-800 p-3"><div className="text-lg font-black">{simResult.outputs.steadyStatePowerMWe} MWe</div><div className="text-[9px] font-mono text-zinc-500 uppercase">Steady power</div></div>
                <div className="bg-zinc-950/60 border border-zinc-800 p-3"><div className="text-lg font-black">{simResult.outputs.illustrativeCoreTempC}°C</div><div className="text-[9px] font-mono text-zinc-500 uppercase">Illustrative core temp</div></div>
                <div className="bg-zinc-950/60 border border-zinc-800 p-3"><div className={`text-lg font-black ${simResult.outputs.meetsDemand ? "text-emerald-400" : "text-red-400"}`}>{simResult.outputs.meetsDemand ? "YES" : "NO"}</div><div className="text-[9px] font-mono text-zinc-500 uppercase">Meets demand</div></div>
              </div>
            )}
            {simResult && <p className="text-[10px] font-mono text-amber-400/80">{simResult.disclaimer}</p>}
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-800 py-4 text-center text-[10px] font-mono text-zinc-600">
        MONTU · Restricted nuclear-energy intelligence · Sans Mercantile · Reference data + educational simulator only
      </footer>
    </div>
  );
}
