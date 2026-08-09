import React from 'react';
import { SecurityStatus, SatelliteAlert } from '../types';
import { Shield, ShieldAlert, Cpu, Radio, Network, Radar, Activity, Skull } from 'lucide-react';

interface SecurityOperationsProps {
  security: SecurityStatus;
  satelliteAlerts: SatelliteAlert[];
  onTriggerAerialSweep: () => void;
  onClearAlerts: () => void;
  isSweeping: boolean;
}

export const SecurityOperations: React.FC<SecurityOperationsProps> = ({
  security,
  satelliteAlerts,
  onTriggerAerialSweep,
  onClearAlerts,
  isSweeping
}) => {
  return (
    <div className="bg-white border border-gray-200/80 rounded-xl p-6 shadow-sm" id="security-operations-room">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-gray-100 pb-4">
        <div>
          <span className="font-mono text-xs text-rose-600 tracking-wider uppercase block">Cap. 5 - Critical Infrastructure Shielding</span>
          <h3 className="text-xl font-sans font-medium text-slate-900 tracking-tight flex items-center gap-2">
            SOBEK Security & KIBUKA Surveillance
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Correlate satellite monitoring with automated cyber security firewalls protecting physical and digital nuclear perimeters.
          </p>
        </div>

        {/* System parameters */}
        <div className="flex gap-3">
          <div className="bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <Shield className={`h-4 w-4 ${security.perimeterStatus === 'SECURE' ? 'text-emerald-500' : 'text-rose-500 animate-pulse'}`} />
            <div>
              <span className="text-[9px] text-gray-400 font-mono block uppercase">Digital Shield</span>
              <span className="text-xs font-mono font-medium text-slate-700">{security.firewallStatus}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SOBEK Intrusion & Firewall Panel - 6 columns */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <h4 className="text-sm font-sans font-semibold text-slate-800 mb-3 flex items-center gap-1.5">
              <Network className="h-4.5 w-4.5 text-rose-500" /> SOBEK Automated Intrusion Blockers
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-center">
                <span className="text-2xl font-mono font-bold text-slate-800">
                  {security.networkThreatsBlocked}
                </span>
                <span className="text-[10px] text-gray-400 uppercase font-mono block mt-1">Cyber Attacks Aborted</span>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-center">
                <span className={`text-sm font-sans font-semibold block py-1 px-2.5 rounded-full inline-block ${security.perimeterStatus === 'SECURE' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {security.perimeterStatus}
                </span>
                <span className="text-[10px] text-gray-400 uppercase font-mono block mt-2">Physical Perimeter Status</span>
              </div>
            </div>
          </div>

          {/* Interactive cyber sweeps */}
          <div className="bg-slate-50 border border-slate-150/80 rounded-xl p-5">
            <h5 className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">Surveillance Overlays</h5>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              Activate automated KIBUKA sweeps to align aerial high-altitude drone trajectories and satellite imagery arrays with physical core perimeter zones.
            </p>

            <button
              onClick={onTriggerAerialSweep}
              disabled={isSweeping}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-sans py-2.5 px-4 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all"
            >
              {isSweeping ? "Tracking Satellite Coordinates..." : "Execute KIBUKA Satellite Sweep"}
            </button>
          </div>
        </div>

        {/* KIBUKA Satellite Radar Feeds - 6 columns */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-widest block">Active Telemetry Anomalies</span>
            {satelliteAlerts.length > 0 && (
              <button onClick={onClearAlerts} className="text-[10px] text-rose-600 font-mono hover:underline">
                Clear Reports
              </button>
            )}
          </div>

          <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
            {satelliteAlerts.length === 0 ? (
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-8 text-center text-slate-400">
                <Radar className="h-8 w-8 text-gray-300 mx-auto stroke-1" />
                <p className="text-xs mt-2">Zero anomalous activity detected inside KIBUKA surveillance grid.</p>
              </div>
            ) : (
              satelliteAlerts.map((alert) => (
                <div 
                  key={alert.id}
                  className={`border rounded-lg p-3.5 flex items-start gap-3 transition-colors ${alert.severity === 'high' ? 'border-rose-100 bg-rose-50/5' : 'border-gray-100'}`}
                >
                  <div className="mt-0.5">
                    {alert.severity === 'high' ? (
                      <ShieldAlert className="h-4.5 w-4.5 text-rose-500" />
                    ) : (
                      <Radio className="h-4.5 w-4.5 text-slate-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1 gap-2">
                      <span className="text-[10px] font-mono font-semibold text-slate-700 truncate">{alert.type}</span>
                      <span className={`px-1.5 py-0.1 text-[9px] rounded font-mono uppercase ${alert.severity === 'high' ? 'bg-rose-100 text-rose-700' : 'bg-slate-150 text-slate-600'}`}>
                        {alert.severity}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mb-1">Sector coordinates: <i className="font-mono text-slate-700">{alert.coords}</i></p>
                    <span className="text-[10px] text-gray-400 font-mono">{alert.timestamp}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
