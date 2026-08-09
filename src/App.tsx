import React, { useState, useCallback } from 'react';
import { ReactorState, RadiationSensor, MaintenanceSystem, PowerGridAllocation, SecurityStatus, SatelliteAlert } from './types';
import { LogoSvg } from './components/LogoSvg';
import { ReactorSimulator } from './components/ReactorSimulator';
import { RadiationMonitor } from './components/RadiationMonitor';
import { PredictiveMaintenance } from './components/PredictiveMaintenance';
import { GridIntegration } from './components/GridIntegration';
import { SecurityOperations } from './components/SecurityOperations';
import { ContactForm } from './components/ContactForm';
import { Shield, Radio, Cpu, Zap, Activity, Grid, ArrowUpRight, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';

const INITIAL_SENSORS: RadiationSensor[] = [
  { id: 'SEN-R1', location: 'Reactor Primary Containment', radiationLevel: 1.25, status: 'NORMAL', history: [1.1, 1.2, 1.25, 1.22, 1.24, 1.25] },
  { id: 'SEN-B1', location: 'Spent Fuel Storage Pools', radiationLevel: 14.8, status: 'ELEVATED', history: [12.1, 13.5, 14.2, 14.8, 14.6, 14.8] },
  { id: 'SEN-C1', location: 'Coolant Pump Recirc loop', radiationLevel: 0.85, status: 'NORMAL', history: [0.8, 0.82, 0.84, 0.85, 0.83, 0.85] },
  { id: 'SEN-A1', location: 'Station Auxiliary Vent Line', radiationLevel: 51.4, status: 'HIGH', history: [45.2, 48.9, 50.1, 51.4, 50.8, 51.4] },
];

const INITIAL_MAINTENANCE: MaintenanceSystem[] = [
  { id: 'MNT-TRB', name: 'High-Pressure Steam Turbine Assembly', category: 'Turbine', wearLevel: 32, recommendedAction: 'No immediate overhaul. Standard bearing lubrication during next standard loop check.', status: 'OPTIMAL', rulDays: 145 },
  { id: 'MNT-PMP', name: 'Reactor Primary Coolant Injection Pumps', category: 'Cooling', wearLevel: 84, recommendedAction: 'Schedule mechanical seal replacement inside the 14-day safety window.', status: 'CRITICAL', rulDays: 12 },
  { id: 'MNT-CNT', name: 'Drywell Concrete Containment Shield', category: 'Containment', wearLevel: 14, recommendedAction: 'Structural load-bearing is perfect. Micro-fissure scan optimal.', status: 'OPTIMAL', rulDays: 520 },
  { id: 'MNT-GEN', name: 'Emergency Backup Diesel Generator Unit 3', category: 'Electrical', wearLevel: 55, recommendedAction: 'Monitor starter valve relay voltages and test compression lines weekly.', status: 'MONITOR', rulDays: 45 },
];

const INITIAL_GRID: PowerGridAllocation[] = [
  { id: 'GRD-N1', sector: 'Sector Alpha Municipal Grid', demand: 450, nuclearSupply: 400, solarSupply: 30, windSupply: 20, capacity: 500 },
  { id: 'GRD-C2', sector: 'Central Industrial Manufacturing Complex', demand: 350, nuclearSupply: 250, solarSupply: 80, windSupply: 20, capacity: 400 },
  { id: 'GRD-S3', sector: 'Southern High-Speed Electric Rail Corridor', demand: 240, nuclearSupply: 200, solarSupply: 30, windSupply: 10, capacity: 300 },
];

export default function App() {
  // Navigation / Tabs state
  const [activeTab, setActiveTab] = useState<'overview' | 'reactor' | 'radiation' | 'maintenance' | 'grid' | 'security'>('overview');

  // Reactor Simulation Data
  const [reactorState, setReactorState] = useState<ReactorState>({
    powerOutput: 890,
    targetOutput: 1000,
    coreTemperature: 285,
    waterLevel: 94,
    controlRodDepth: 35,
    coolingRate: 65,
    pressure: 15.2,
    status: 'STABLE',
    aiMode: true,
  });

  // Simulator state listeners
  const handleReactorStateChange = useCallback((nextState: ReactorState) => {
    setReactorState(nextState);
  }, []);

  // AI advisory response state variables
  const [aiRecommendation, setAiRecommendation] = useState<string | null>(null);
  const [aiActions, setAiActions] = useState<string[]>([]);
  const [aiSafetyAssessment, setAiSafetyAssessment] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Trigger Gemini Analysis API
  const handleSendTelemetryToAI = async (state: ReactorState) => {
    setIsAiLoading(true);
    try {
      const resp = await fetch("/api/nuclear/recommend-control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });
      const data = await resp.json();
      setAiRecommendation(data.recommendation);
      setAiActions(data.actions || []);
      setAiSafetyAssessment(data.safetyAssessment);
    } catch (err) {
      console.error(err);
      // Fallback fallback if any integration error
      setAiRecommendation("Core dynamic feedback analyzed. Core parameters remain in regulatory boundaries.");
      setAiSafetyAssessment("STABLE");
    } finally {
      setIsAiLoading(false);
    }
  };

  // Radiation Monitor state variables
  const [sensors, setSensors] = useState<RadiationSensor[]>(INITIAL_SENSORS);

  const handleTriggerVentPurge = (sensorId: string) => {
    setSensors((prev) =>
      prev.map((s) => {
        if (s.id === sensorId) {
          // Gaseous filter ventilation drops radioactivity back to clean normal levels
          const level = parseFloat((Math.random() * 0.4 + 0.5).toFixed(2));
          return {
            ...s,
            radiationLevel: level,
            status: 'NORMAL' as const,
            history: [...s.history.slice(1), level],
          };
        }
        return s;
      })
    );
  };

  // Maintenance state variables
  const [maintenance, setMaintenance] = useState<MaintenanceSystem[]>(INITIAL_MAINTENANCE);

  const handleTriggerMaintenance = (systemId: string) => {
    setMaintenance((prev) =>
      prev.map((m) => {
        if (m.id === systemId) {
          return {
            ...m,
            wearLevel: 5,
            status: 'OPTIMAL' as const,
            rulDays: 365,
            recommendedAction: 'Completed refit. Operational stress logs clear.',
          };
        }
        return m;
      })
    );
  };

  // Hybrid Grid Integration state variables
  const [grid, setGrid] = useState<PowerGridAllocation[]>(INITIAL_GRID);
  const [isHybridLoading, setIsHybridLoading] = useState(false);
  const [analysisOutput, setAnalysisOutput] = useState<string | null>(null);
  const [dispatchStrategy, setDispatchStrategy] = useState<string | null>(null);
  const [resilienceScore, setResilienceScore] = useState<number | null>(null);

  const handleTriggerGridDispatch = async (solarSupply: number, nuclearSupply: number) => {
    setIsHybridLoading(true);
    try {
      const resp = await fetch("/api/integration/analyze-hybrid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ solarMWe: solarSupply, nuclearMWe: nuclearSupply, activeSystem: "RA + MONTU Hybrid Dispatch" }),
      });
      const data = await resp.json();
      setAnalysisOutput(data.analysis);
      setDispatchStrategy(data.dispatchStrategy);
      setResilienceScore(data.resilienceScore);

      // Reallocate grid supply splits visually based on ratios
      setGrid((prev) => {
        return prev.map((item, idx) => {
          // Split proportionately
          const ratio = item.demand / 1040; // baseline sum
          const addedNuclear = Math.round(nuclearSupply * ratio);
          const addedSolar = Math.round(solarSupply * ratio);
          return {
            ...item,
            nuclearSupply: addedNuclear,
            solarSupply: addedSolar,
          };
        });
      });

    } catch (err) {
      console.error(err);
    } finally {
      setIsHybridLoading(false);
    }
  };

  // Surveillance/Security parameters
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus>({
    activeSweep: false,
    networkThreatsBlocked: 4122,
    firewallStatus: 'SHIELDED',
    satelliteLinkStatus: 'CONNECTED',
    perimeterStatus: 'SECURE',
  });

  const [satelliteAlerts, setSatelliteAlerts] = useState<SatelliteAlert[]>([
    { id: 'AL-902', timestamp: '2026-05-23 03:15:21', type: 'Unscheduled Drone flyby detected', severity: 'medium', resolved: false, coords: '32.1492 N, 14.8812 E' },
    { id: 'AL-124', timestamp: '2026-05-23 04:02:45', type: 'Unauthorized IP gateway ping block', severity: 'low', resolved: false, coords: 'Firewall Router Gateway 3B' },
  ]);

  const [isSweeping, setIsSweeping] = useState(false);

  const handleTriggerAerialSweep = () => {
    setIsSweeping(true);
    // Simulate satellite coordinates calculations
    setTimeout(() => {
      setIsSweeping(false);
      setSecurityStatus((prev) => ({
        ...prev,
        networkThreatsBlocked: prev.networkThreatsBlocked + Math.floor(Math.random() * 15 + 1),
      }));
      // Append a simulation sweep coordinates log
      const newAlert: SatelliteAlert = {
        id: `AL-${Math.floor(100 + Math.random() * 900)}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        type: 'Active satellite scan completed. Ground targets aligned.',
        severity: 'low',
        resolved: true,
        coords: 'Containment structure 1 thermal sweep OK',
      };
      setSatelliteAlerts((prev) => [newAlert, ...prev]);
    }, 1500);
  };

  const handleClearAlerts = () => {
    setSatelliteAlerts([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col justify-between">
      
      {/* Dynamic Security/Operation Strip */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-[11px] font-mono text-gray-400 select-none">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-medium text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> SANS RESILIENCE PROTOCOL ACTIVE
          </span>
          <span className="hidden sm:inline">|</span>
          <span className="hidden sm:inline">Grid Status: Baseload Stabilized</span>
        </div>

        <div className="flex items-center gap-3">
          <span>Local Time: 2026-05-23</span>
          <span className="hidden md:inline bg-slate-800 py-0.5 px-2 rounded border border-slate-700/60 text-emerald-400">
            Node: MONTU-SEC-6
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col gap-8">
        
        {/* Navigation & Brand Header Header Block */}
        <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-gray-200 pb-6">
          <div className="flex items-center gap-4">
            {/* Custom High Definition Animated Logo component used here */}
            <LogoSvg size={54} />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-serif font-black tracking-tighter text-slate-900">MONTU</h1>
                <span className="bg-slate-100 border border-slate-200 text-slate-700 font-mono text-[10px] uppercase font-semibold tracking-wider py-0.5 px-2 rounded">
                  Nuclear Intelligence Node
                </span>
              </div>
              <p className="text-sm font-sans text-gray-500 mt-1 max-w-xl">
                AI-guided energy intelligence for reactor safety, continuous radiation control, and clean grid integration.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-slate-100 border border-gray-200/60 p-1.5 rounded-xl">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${activeTab === 'overview' ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-500 hover:text-slate-800'}`}
            >
              System Overview
            </button>
            <button
              onClick={() => setActiveTab('reactor')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${activeTab === 'reactor' ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-500 hover:text-slate-800'}`}
            >
              Reactor Control
            </button>
            <button
              onClick={() => setActiveTab('radiation')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${activeTab === 'radiation' ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-500 hover:text-slate-800'}`}
            >
              Radiation Safeguard
            </button>
            <button
              onClick={() => setActiveTab('maintenance')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${activeTab === 'maintenance' ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-500 hover:text-slate-800'}`}
            >
              Stress & Wear (RUL)
            </button>
            <button
              onClick={() => setActiveTab('grid')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${activeTab === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-500 hover:text-slate-800'}`}
            >
              Grid Dispatch
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${activeTab === 'security' ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-500 hover:text-slate-800'}`}
            >
              Site Security
            </button>
          </div>
        </header>

        {/* Dynamic View Layout Block */}
        <main className="flex-1">
          {activeTab === 'overview' && (
            <div className="space-y-8" id="overview-dashboard-bento flex flex-col gap-8">
              
              {/* Highlight Hero Intro Card */}
              <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-xl p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative overflow-hidden">
                <div className="relative z-10 max-w-2xl">
                  <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] uppercase font-semibold tracking-wider py-1 px-2.5 rounded-full inline-block mb-3">
                    Active Deployment Protocol
                  </span>
                  <h2 className="text-3xl font-serif text-white tracking-tight leading-tight">
                    Optimize Nuclear operations with AI predictive coordination and safety loops.
                  </h2>
                  <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                    MONTU delivers real-time reactor thermal safety limits calculations, advanced dosimetric safeguard auditing, wear monitoring prognosis (RUL), and dynamic hybrid power distribution across sovereign clean-energy smart grids.
                  </p>
                </div>

                <div className="shrink-0 relative z-10 flex justify-center items-center">
                  {/* Decorative high definition animated svg */}
                  <div className="bg-slate-950 p-4 border border-slate-800 rounded-full shadow-inner animate-pulse duration-4000">
                    <LogoSvg size={140} />
                  </div>
                </div>

                {/* Sub-grid structural lines */}
                <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="500" cy="100" r="160" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="5 5" />
                    <circle cx="500" cy="100" r="280" fill="none" stroke="#06b6d4" strokeWidth="1" />
                  </svg>
                </div>
              </div>

              {/* Bento Grid Features Map */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Micro Card 1 */}
                <div onClick={() => setActiveTab('reactor')} className="bg-white border border-gray-200/80 rounded-xl p-5 hover:border-slate-400 transition-all cursor-pointer flex flex-col justify-between h-48 group">
                  <div>
                    <div className="h-9 w-9 bg-slate-100 rounded-lg flex items-center justify-center text-slate-750 font-medium border border-gray-200">
                      <Cpu className="h-5 w-5" />
                    </div>
                    <h4 className="font-sans font-semibold text-slate-800 text-base mt-4">Reactor Optimization</h4>
                    <p className="text-xs text-gray-500 mt-1 leading-normal">
                      Fine-tune reactor performance, load configurations, and thermal efficiency with active safety advisor cycles.
                    </p>
                  </div>
                  <span className="text-[10px] uppercase font-mono text-gray-400 group-hover:text-slate-800 transition-colors flex items-center gap-1">
                    Open Control <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>

                {/* Micro Card 2 */}
                <div onClick={() => setActiveTab('radiation')} className="bg-white border border-gray-200/80 rounded-xl p-5 hover:border-slate-400 transition-all cursor-pointer flex flex-col justify-between h-48 group">
                  <div>
                    <div className="h-9 w-9 bg-slate-100 rounded-lg flex items-center justify-center text-slate-755 font-medium border border-gray-200">
                      <Radio className="h-5 w-5" />
                    </div>
                    <h4 className="font-sans font-semibold text-slate-800 text-base mt-4">Radiation Monitoring</h4>
                    <p className="text-xs text-gray-500 mt-1 leading-normal">
                      Continuously track radiation levels, dose records, and filtration safeguard routines.
                    </p>
                  </div>
                  <span className="text-[10px] uppercase font-mono text-gray-400 group-hover:text-slate-800 transition-colors flex items-center gap-1">
                    Open Monitor <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>

                {/* Micro Card 3 */}
                <div onClick={() => setActiveTab('maintenance')} className="bg-white border border-gray-200/80 rounded-xl p-5 hover:border-slate-400 transition-all cursor-pointer flex flex-col justify-between h-48 group">
                  <div>
                    <div className="h-9 w-9 bg-slate-100 rounded-lg flex items-center justify-center text-slate-755 font-medium border border-gray-200">
                      <Activity className="h-5 w-5" />
                    </div>
                    <h4 className="font-sans font-semibold text-slate-800 text-base mt-4">Predictive Maintenance</h4>
                    <p className="text-xs text-gray-500 mt-1 leading-normal">
                      Anticipate equipment stress and schedule mechanical refits before outages occur.
                    </p>
                  </div>
                  <span className="text-[10px] uppercase font-mono text-gray-400 group-hover:text-slate-800 transition-colors flex items-center gap-1">
                    Open Wear Prognosis <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>

                {/* Micro Card 4 */}
                <div onClick={() => setActiveTab('grid')} className="bg-white border border-gray-200/80 rounded-xl p-5 hover:border-slate-400 transition-all cursor-pointer flex flex-col justify-between h-48 group">
                  <div>
                    <div className="h-9 w-9 bg-slate-100 rounded-lg flex items-center justify-center text-slate-755 font-medium border border-gray-200">
                      <Zap className="h-5 w-5" />
                    </div>
                    <h4 className="font-sans font-semibold text-slate-800 text-base mt-4">Grid Integration</h4>
                    <p className="text-xs text-gray-500 mt-1 leading-normal">
                      Coordinate power distribution and load balancing with hybrid solar clean reservoirs.
                    </p>
                  </div>
                  <span className="text-[10px] uppercase font-mono text-gray-400 group-hover:text-slate-800 transition-colors flex items-center gap-1">
                    Open Dispatch <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>

              </div>

              {/* Secondary block - Integration constellation partners description */}
              <div className="bg-white border border-gray-200/80 rounded-xl p-6 md:p-8 shadow-sm">
                <div className="max-w-3xl mb-6">
                  <span className="font-mono text-xs text-slate-400 uppercase tracking-widest block mb-1">Constellation System Interoperability</span>
                  <h3 className="text-xl font-sans font-bold text-slate-900">Sans Mercantile Interconnected Protocol</h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    MONTU is strategically aligned within the standard Sans Mercantile ecosystem, mapping operations against sovereign satellite arrays and solar portfolios.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* RA */}
                  <div className="bg-slate-50 border border-slate-100 p-4.5 rounded-lg flex flex-col justify-between min-h-[140px]">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-emerald-600 uppercase block mb-1">RA System</span>
                      <p className="text-xs text-gray-500 leading-normal">
                        Combines solar and nuclear power matrices to assure high-resilience base state clean energy reserves.
                      </p>
                    </div>
                    <button onClick={() => setActiveTab('grid')} className="text-[10px] font-mono hover:underline text-slate-800 text-left mt-3">
                      Initialize RA Dispatch →
                    </button>
                  </div>

                  {/* SHANGO */}
                  <div className="bg-slate-50 border border-slate-100 p-4.5 rounded-lg flex flex-col justify-between min-h-[140px]">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-blue-600 uppercase block mb-1">SHANGO System</span>
                      <p className="text-xs text-gray-500 leading-normal">
                        Assess dynamic climate impacts, wind stresses, and environmental constraints near facility parameters.
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-gray-400 mt-3">Active (Climate Synced)</span>
                  </div>

                  {/* KIBUKA */}
                  <div className="bg-slate-50 border border-slate-100 p-4.5 rounded-lg flex flex-col justify-between min-h-[140px]">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-rose-600 uppercase block mb-1">KIBUKA System</span>
                      <p className="text-xs text-gray-500 leading-normal">
                        Integrates real-time high-resolution satellite imagery feeds and drone surveillance coordinates with site safety.
                      </p>
                    </div>
                    <button onClick={() => setActiveTab('security')} className="text-[10px] font-mono hover:underline text-slate-800 text-left mt-3">
                      Trigger Surveillance Sweep →
                    </button>
                  </div>

                  {/* SOBEK */}
                  <div className="bg-slate-50 border border-slate-100 p-4.5 rounded-lg flex flex-col justify-between min-h-[140px]">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase block mb-1">SOBEK System</span>
                      <p className="text-xs text-gray-500 leading-normal">
                        Locks down local cyber systems and physical ingress boundaries against high-sophistication vectors.
                      </p>
                    </div>
                    <button onClick={() => setActiveTab('security')} className="text-[10px] font-mono hover:underline text-slate-800 text-left mt-3">
                      Verify SOBEK Shielding →
                    </button>
                  </div>
                </div>
              </div>

              {/* Simulated Reactor Real-Time Status Snippet Block */}
              <div className="bg-slate-100 border border-gray-200/80 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <div>
                    <h5 className="text-sm font-sans font-semibold text-slate-800">Operational Reactor Core Telemetry Stream</h5>
                    <p className="text-xs text-gray-500 mt-0.5">Core Temperature: {reactorState.coreTemperature}°C | Power Output: {reactorState.powerOutput} MWe | Safety Code: EN-STABLE</p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('reactor')}
                  className="bg-slate-900 hover:bg-slate-850 text-white font-sans py-2 px-4 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Configure Reactor Parameters
                </button>
              </div>

              {/* Secure inquiry contact module */}
              <ContactForm />

            </div>
          )}

          {activeTab === 'reactor' && (
            <div className="space-y-6">
              {/* Simulator Component with interactive sliding regulators and GEMINI API Safety loop integration */}
              <ReactorSimulator
                onStateChange={handleReactorStateChange}
                onSendTelemetryToAI={handleSendTelemetryToAI}
                aiRecommendation={aiRecommendation}
                aiActions={aiActions}
                aiSafetyAssessment={aiSafetyAssessment}
                isAiLoading={isAiLoading}
              />
            </div>
          )}

          {activeTab === 'radiation' && (
            <div className="space-y-6">
              <RadiationMonitor
                sensors={sensors}
                onTriggerVentPurge={handleTriggerVentPurge}
              />
            </div>
          )}

          {activeTab === 'maintenance' && (
            <div className="space-y-6">
              <PredictiveMaintenance
                systems={maintenance}
                onTriggerMaintenance={handleTriggerMaintenance}
              />
            </div>
          )}

          {activeTab === 'grid' && (
            <div className="space-y-6">
              <GridIntegration
                allocations={grid}
                onTriggerGridDispatch={handleTriggerGridDispatch}
                analysisOutput={analysisOutput}
                dispatchStrategy={dispatchStrategy}
                resilienceScore={resilienceScore}
                isHybridLoading={isHybridLoading}
              />
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <SecurityOperations
                security={securityStatus}
                satelliteAlerts={satelliteAlerts}
                onTriggerAerialSweep={handleTriggerAerialSweep}
                onClearAlerts={handleClearAlerts}
                isSweeping={isSweeping}
              />
            </div>
          )}
        </main>

        {/* Footer Info Block */}
        <footer className="border-t border-gray-200 pt-8 mt-12 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400 font-mono">
          <div>
            <span>© 2026 MONTU Nuclear Energy Intelligence • Part of Sans Mercantile Constellation</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://www.sansmercantile.com/montu/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline hover:text-slate-650 flex items-center gap-1.5"
            >
              sansmercantile.com/montu <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </footer>

      </div>
    </div>
  );
}
