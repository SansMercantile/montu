import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ReactorState } from '../types';
import { Zap, Activity, Thermometer, ShieldAlert, Cpu, RefreshCw, AlertTriangle, ArrowUp, ArrowDown } from 'lucide-react';

interface ReactorSimulatorProps {
  onStateChange: (state: ReactorState) => void;
  onSendTelemetryToAI: (state: ReactorState) => void;
  aiRecommendation: string | null;
  aiActions: string[];
  aiSafetyAssessment: string | null;
  isAiLoading: boolean;
}

export const ReactorSimulator: React.FC<ReactorSimulatorProps> = ({
  onStateChange,
  onSendTelemetryToAI,
  aiRecommendation,
  aiActions,
  aiSafetyAssessment,
  isAiLoading
}) => {
  const [reactor, setReactor] = useState<ReactorState>({
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

  const [simulationSpeed, setSimulationSpeed] = useState<number>(1); // 1x, 2x, etc.
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Math model simulation loop
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setReactor((prev) => {
        let {
          powerOutput,
          targetOutput,
          coreTemperature,
          waterLevel,
          controlRodDepth,
          coolingRate,
          pressure,
          status,
          aiMode
        } = prev;

        // Influence factor math
        // Control rods absorb neutrons -> deeper rods = less power, lower temp
        // Coolant flow cools core -> higher cooling = lower temp
        // Core temperature drives water evaporation and steam power output

        // AI Autopilot loop logic: Stable adjustment toward targetOutput (MWe)
        if (aiMode) {
          const powerGap = targetOutput - powerOutput;
          // Slowly adjust rods and cooling rate to match power target safely
          if (Math.abs(powerGap) > 3) {
            // If target is higher, pull rods out (reduce controlRodDepth) and adjust cooling rate
            if (powerGap > 0) {
              controlRodDepth = Math.max(10, controlRodDepth - 0.4 * simulationSpeed);
              coolingRate = Math.min(95, coolingRate + 0.3 * simulationSpeed);
            } else {
              // If target is lower, push rods in (increase controlRodDepth)
              controlRodDepth = Math.min(95, controlRodDepth + 0.4 * simulationSpeed);
              coolingRate = Math.max(10, coolingRate - 0.2 * simulationSpeed);
            }
          }
        }

        // Physical responses based on inputs
        const targetTemp = 320 - (controlRodDepth * 1.5) - (coolingRate * 0.4);
        const tempDiff = targetTemp - coreTemperature;
        coreTemperature += (tempDiff * 0.08) * simulationSpeed;

        // Power output relies on core temperature and turbine steam pressure
        const targetPower = coreTemperature * 3.2; // Linear mapping
        const powerDiff = targetPower - powerOutput;
        powerOutput += (powerDiff * 0.1) * simulationSpeed;

        // Pressure is correlated with core temperature and water coolant volumes
        const calculatedPressure = 10 + (coreTemperature * 0.02) + (waterLevel * 0.015);
        pressure = parseFloat(calculatedPressure.toFixed(2));

        // Let water coolant slowly change based on heating and cooling feed rates
        const evapRate = (coreTemperature * 0.003);
        const intakeRate = (coolingRate * 0.012);
        waterLevel = Math.max(30, Math.min(100, waterLevel - (evapRate - intakeRate) * simulationSpeed));

        // Evaluate Status bounds
        if (coreTemperature > 330 || pressure > 18.5 || waterLevel < 45) {
          status = 'CRITICAL';
        } else if (coreTemperature > 310 || pressure > 17.0 || waterLevel < 70) {
          status = 'WARNING';
        } else if (powerOutput < 50 && coreTemperature < 90) {
          status = 'SHUTDOWN';
        } else if (status === 'SHUTDOWN' && powerOutput > 50) {
          status = 'STARTUP';
        } else {
          status = 'STABLE';
        }

        const nextState = {
          ...prev,
          powerOutput: Math.round(powerOutput),
          coreTemperature: Math.round(coreTemperature),
          waterLevel: parseFloat(waterLevel.toFixed(1)),
          controlRodDepth: parseFloat(controlRodDepth.toFixed(1)),
          coolingRate: parseFloat(coolingRate.toFixed(1)),
          pressure,
          status,
        };

        // Notify parent component
        onStateChange(nextState);
        return nextState;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [simulationSpeed, reactor.aiMode, reactor.targetOutput, onStateChange]);

  // Handle slide inputs (manually override if AI mode is disabled)
  const handleManualAdjust = (field: 'controlRodDepth' | 'coolingRate' | 'waterLevel' | 'targetOutput', value: number) => {
    setReactor((prev) => {
      const updated = {
        ...prev,
        [field]: value,
        aiMode: field === 'targetOutput' ? prev.aiMode : false, // Disable AI autopilot if adjusting direct inputs manually
      };
      onStateChange(updated);
      return updated;
    });
  };

  const toggleEmergencyScram = () => {
    setReactor((prev) => {
      const scrammed = {
        ...prev,
        targetOutput: 0,
        controlRodDepth: 100, // Maximum absorption
        coolingRate: 100,     // Max auxiliary feed cooling
        aiMode: false,
        status: 'SHUTDOWN' as const,
      };
      onStateChange(scrammed);
      return scrammed;
    });
  };

  const handleTriggerAIAnalysis = () => {
    onSendTelemetryToAI(reactor);
  };

  // Status color helpers
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'STABLE': return 'text-emerald-500 bg-emerald-50 border-emerald-200';
      case 'WARNING': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'CRITICAL': return 'text-rose-600 bg-rose-50 border-rose-200';
      case 'SHUTDOWN': return 'text-gray-500 bg-gray-50 border-gray-200';
      case 'STARTUP': return 'text-blue-500 bg-blue-50 border-blue-200';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="reactor-simulator-panel">
      {/* Reactor Graphics & Live Telemetry Layout - 7 columns */}
      <div className="lg:col-span-7 bg-white border border-gray-200/80 rounded-xl p-6 shadow-sm flex flex-col justify-between">
        
        {/* Header telemetry and controls */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="font-mono text-xs text-gray-400 tracking-wider uppercase block">System R1-Core</span>
            <h3 className="text-xl font-sans font-medium text-slate-900 tracking-tight flex items-center">
              Active Core Simulator
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-mono">Simulation:</span>
            <button
              onClick={() => setSimulationSpeed(1)}
              className={`px-2 py-1 text-xs font-mono rounded border ${simulationSpeed === 1 ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-600 border-gray-200'}`}
            >
              1x
            </button>
            <button
              onClick={() => setSimulationSpeed(3)}
              className={`px-2 py-1 text-xs font-mono rounded border ${simulationSpeed === 3 ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-600 border-gray-200'}`}
            >
              3x
            </button>
          </div>
        </div>

        {/* Dynamic Fission Schematic - Custom High Definition Animated SVG */}
        <div className="flex justify-center items-center py-6 bg-slate-50/80 rounded-lg border border-gray-100 flex-1 min-h-[280px] relative overflow-hidden">
          
          {/* Animated Water Circulations and Temperature Gradients */}
          <div className="absolute inset-x-0 bottom-0 top-0 pointer-events-none opacity-40">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              {/* Dynamic cooling liquid lines flowing */}
              <path
                d="M 50,220 C 50,150 70,80 150,80"
                fill="none"
                stroke={reactor.coreTemperature > 290 ? "#e11d48" : "#2563eb"}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="10 15"
                className="grid-pulse"
                style={{ animationDuration: reactor.coolingRate > 70 ? '0.8s' : '1.5s' }}
              />
              <path
                d="M 350,220 C 350,150 330,80 250,80"
                fill="none"
                stroke={reactor.coreTemperature > 290 ? "#e11d48" : "#2563eb"}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="10 15"
                className="grid-pulse"
                style={{ animationDuration: reactor.coolingRate > 70 ? '0.8s' : '1.5s', animationDirection: 'reverse' }}
              />
            </svg>
          </div>

          {/* Core Structure Diagram */}
          <div className="relative w-80 h-64 flex justify-center items-center">
            <svg width="320" height="256" viewBox="0 0 320 256" className="overflow-visible" xmlns="http://www.w3.org/2000/svg">
              {/* Containment Dome outline */}
              <path d="M 60,240 A 100,100 0 0,1 260,240 L 260,245 L 60,245 Z" fill="none" stroke="#64748b" strokeWidth="2.5" />
              
              {/* Inner Reactor Pressure Vessel */}
              <rect x="110" y="80" width="100" height="150" rx="16" fill="#1e293b" stroke="#475569" strokeWidth="2" />
              
              {/* Glowing thermal heat background inside vessel */}
              <circle
                cx="160"
                cy="160"
                r="38"
                fill={reactor.status === 'CRITICAL' ? '#f43f5e' : reactor.status === 'WARNING' ? '#fbbf24' : '#10b981'}
                opacity={0.15 + (reactor.coreTemperature / 500)} // dynamic glow intensity
                className="transition-opacity duration-500"
                filter="url(#ring-glow)"
              />

              {/* Control Rods visual elements (sliding up and down) */}
              <g transform={`translate(0, ${-20 + (reactor.controlRodDepth * 0.45)})`} className="transition-transform duration-500">
                {/* Rod 1 */}
                <rect x="130" y="55" width="10" height="65" rx="2" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="1" />
                {/* Rod 2 */}
                <rect x="155" y="55" width="10" height="65" rx="2" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="1" />
                {/* Rod 3 */}
                <rect x="180" y="55" width="10" height="65" rx="2" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="1" />
                {/* Crossbar connecting rods */}
                <rect x="122" y="50" width="76" height="6" rx="1" fill="#475569" />
              </g>

              {/* Dynamic Fuel Assemblies (glowing rods) */}
              <g strokeWidth="2" strokeLinecap="round">
                {/* Assembly 1 */}
                <line x1="140" y1="130" x2="140" y2="200" stroke={reactor.status === 'CRITICAL' ? '#ef4444' : reactor.status === 'WARNING' ? '#eab308' : '#22c55e'} opacity="0.8" />
                {/* Assembly 2 */}
                <line x1="165" y1="130" x2="165" y2="200" stroke={reactor.status === 'CRITICAL' ? '#ef4444' : reactor.status === 'WARNING' ? '#eab308' : '#22c55e'} opacity="0.8" />
                {/* Assembly 3 */}
                <line x1="190" y1="130" x2="190" y2="200" stroke={reactor.status === 'CRITICAL' ? '#ef4444' : reactor.status === 'WARNING' ? '#eab308' : '#22c55e'} opacity="0.8" />
              </g>

              {/* Animated neutron flux particles circulating */}
              {reactor.status !== 'SHUTDOWN' && (
                <g>
                  <circle cx="160" cy="165" r="30" fill="none" stroke="#22c55e" strokeWidth="0.7" strokeDasharray="3 9" className="animated-ring-1" />
                  <circle cx="160" cy="165" r="45" fill="none" stroke="#06b6d4" strokeWidth="0.5" strokeDasharray="5 15" className="animated-ring-2" />
                </g>
              )}
            </svg>

            {/* Floating digital status tags over the core */}
            <div className="absolute top-2 right-2 bg-slate-900/90 text-[10px] text-emerald-400 font-mono py-1 px-2 rounded backdrop-blur-sm border border-emerald-500/30">
              NEUTRON FLUX: {reactor.status === 'SHUTDOWN' ? '0' : Math.round((100 - reactor.controlRodDepth) * 12.8)} n/cm²/s
            </div>
          </div>
        </div>

        {/* Dashboard numerical outputs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <span className="text-xs text-gray-500 font-sans block mb-1">Power Output</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-mono font-medium text-slate-800">{reactor.powerOutput}</span>
              <span className="text-xs text-gray-400 font-mono">MWe</span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-500" 
                style={{ width: `${Math.min(100, (reactor.powerOutput / 1200) * 100)}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <span className="text-xs text-gray-500 font-sans block mb-1">Core Temp</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-mono font-medium text-slate-800">{reactor.coreTemperature}</span>
              <span className="text-xs text-gray-400 font-mono">°C</span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full mt-2 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${reactor.coreTemperature > 310 ? 'bg-rose-500' : reactor.coreTemperature > 295 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                style={{ width: `${(reactor.coreTemperature / 400) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <span className="text-xs text-gray-500 font-sans block mb-1">Feed Pressure</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-mono font-medium text-slate-800">{reactor.pressure}</span>
              <span className="text-xs text-gray-400 font-mono">MPa</span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full mt-2 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${reactor.pressure > 17 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                style={{ width: `${(reactor.pressure / 25) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <span className="text-xs text-gray-500 font-sans block mb-1">Coolant Level</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-mono font-medium text-slate-800">{reactor.waterLevel}</span>
              <span className="text-xs text-gray-400 font-mono">%</span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full mt-2 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${reactor.waterLevel < 60 ? 'bg-rose-500' : 'bg-blue-500'}`} 
                style={{ width: `${reactor.waterLevel}%` }}
              />
            </div>
          </div>
        </div>

      </div>

      {/* Control Console & AI Loop Status - 5 columns */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        
        {/* Core Controls Console */}
        <div className="bg-white border border-gray-200/80 rounded-xl p-6 shadow-sm flex flex-col justify-between h-full">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-sans font-medium text-slate-800">Reactor Control Loop</h4>
                <p className="text-xs text-gray-500">Fine-tune power configurations or prioritize AI control loops.</p>
              </div>
              <div className={`px-2.5 py-1 rounded text-xs font-mono font-medium border ${getStatusColor(reactor.status)}`}>
                {reactor.status}
              </div>
            </div>

            {/* AI Autopilot Switch & target setting */}
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 mb-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Cpu className={`h-4.5 w-4.5 ${reactor.aiMode ? 'text-emerald-500' : 'text-slate-400'}`} />
                  <span className="text-sm font-sans font-medium text-slate-700">AI Auto-Regulation</span>
                </div>
                <button
                  onClick={() => setReactor(p => ({ ...p, aiMode: !p.aiMode }))}
                  className={`w-12 h-6.5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${reactor.aiMode ? 'bg-emerald-500' : 'bg-slate-300'}`}
                >
                  <div className={`w-5.5 h-5.5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${reactor.aiMode ? 'translate-x-5.5' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Target load sliding regulator */}
              <div className="mb-2">
                <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                  <span>Target Basestation Load</span>
                  <span className="font-mono font-medium text-slate-700">{reactor.targetOutput} MWe</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1200"
                  step="50"
                  value={reactor.targetOutput}
                  onChange={(e) => handleManualAdjust('targetOutput', parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-slate-800"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-mono mt-1">
                  <span>0 MWe (Shutdown)</span>
                  <span>1200 MWe (Max Peak)</span>
                </div>
              </div>
            </div>

            {/* Manual Sliders */}
            <div className="space-y-4 mb-6">
              {/* Control Rod sliding input */}
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                  <span className="flex items-center gap-1">
                    Control Rod Insertion {reactor.aiMode && <span className="text-[10px] text-emerald-500 bg-emerald-50 px-1 py-0.1 select-none rounded">AI active</span>}
                  </span>
                  <span className="font-mono font-medium text-slate-700">{reactor.controlRodDepth}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="0.5"
                  value={reactor.controlRodDepth}
                  onChange={(e) => handleManualAdjust('controlRodDepth', parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-mono mt-1">
                  <span>5% (Max Power)</span>
                  <span>100% (Sub-critical)</span>
                </div>
              </div>

              {/* Turbine Coolant Flow sliding input */}
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                  <span className="flex items-center gap-1">
                    Recirc Coolant Flow {reactor.aiMode && <span className="text-[10px] text-emerald-500 bg-emerald-50 px-1 py-0.1 select-none rounded">AI active</span>}
                  </span>
                  <span className="font-mono font-medium text-slate-700">{reactor.coolingRate}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="1"
                  value={reactor.coolingRate}
                  onChange={(e) => handleManualAdjust('coolingRate', parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-mono mt-1">
                  <span>10% Min Flow</span>
                  <span>100% Peak Aux Purge</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action and Safety Emergency Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleTriggerAIAnalysis}
              disabled={isAiLoading}
              className="w-full bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 disabled:opacity-50 transition-colors font-sans py-2.5 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 border border-slate-200"
            >
              <RefreshCw className={`h-4 w-4 ${isAiLoading ? 'animate-spin text-emerald-500' : 'text-slate-600'}`} />
              Generate Safety Analysis (AI Advisory)
            </button>

            <button
              onClick={toggleEmergencyScram}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-sans py-2.5 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 shadow-sm shadow-rose-600/10 hover:shadow-rose-600/20 transition-all"
            >
              <ShieldAlert className="h-4.5 w-4.5" />
              EMERGENCY CORE SCRAM (Manual Shutoff)
            </button>
          </div>
        </div>

        {/* Dynamic AI advisor output - updates via Gemini API */}
        <div className="bg-slate-900 text-slate-100 rounded-xl p-5 border border-slate-800 flex-1 flex flex-col justify-between min-h-[220px]">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5 uppercase tracking-wider">
                <Cpu className="h-4 w-4" /> MONTU Core - Realtime AI Safety Co-Pilot
              </span>
              <span className="text-[10px] font-mono text-gray-500">Node v1.02</span>
            </div>

            {isAiLoading ? (
              <div className="py-8 text-center flex flex-col items-center justify-center gap-3">
                <Activity className="h-6 w-6 text-emerald-400 animate-pulse" />
                <span className="text-xs text-gray-400 font-mono">Parsing reactor thermal and flux variables...</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-serif leading-relaxed text-slate-200 italic">
                    "{aiRecommendation || "Core temperature and grid load balancing parameters are in optimal steady-states. Primary reactor protection rods stabilized at 35% insertion. Ready for live scenario queries."}"
                  </p>
                </div>

                {aiActions && aiActions.length > 0 && (
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1.5">AI Guided Action Directives:</span>
                    <ul className="text-xs text-slate-300/90 font-mono space-y-1">
                      {aiActions.map((act, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-500">•</span>
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="border-t border-slate-800 pt-3 mt-4 flex items-center justify-between text-[11px] font-mono">
            <span className="text-gray-400">Risk Assessment:</span>
            <span className={`font-semibold ${aiSafetyAssessment?.toLowerCase().includes('critical') ? 'text-rose-400' : 'text-emerald-400'}`}>
              {aiSafetyAssessment || 'STABLE - All Safety Envelopes Intact'}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
