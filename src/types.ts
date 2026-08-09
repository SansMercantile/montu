export interface ReactorState {
  powerOutput: number;      // in MWe
  targetOutput: number;     // in MWe
  coreTemperature: number;  // in °C
  waterLevel: number;       // in %
  controlRodDepth: number;  // in %
  coolingRate: number;      // in %
  pressure: number;         // in MPa
  status: 'STABLE' | 'WARNING' | 'CRITICAL' | 'SHUTDOWN' | 'STARTUP';
  aiMode: boolean;          // AI Control Loop Active
}

export interface RadiationSensor {
  id: string;
  location: string;
  radiationLevel: number;    // in μSv/h
  status: 'NORMAL' | 'ELEVATED' | 'HIGH';
  history: number[];
}

export interface MaintenanceSystem {
  id: string;
  name: string;
  category: 'Turbine' | 'Cooling' | 'Containment' | 'Core' | 'Electrical';
  wearLevel: number;        // 0 to 100
  recommendedAction: string;
  status: 'OPTIMAL' | 'MONITOR' | 'CRITICAL';
  rulDays: number;          // Remaining Useful Life (days)
}

export interface PowerGridAllocation {
  id: string;
  sector: string;
  demand: number;           // in MWe
  nuclearSupply: number;    // in MWe
  solarSupply: number;      // in MWe (RA hybrid)
  windSupply: number;       // in MWe (SHANGO hybrid)
  capacity: number;         // in MWe
}

export interface SecurityStatus {
  activeSweep: boolean;
  networkThreatsBlocked: number;
  firewallStatus: 'ACTIVE' | 'SHIELDED' | 'ATTACK_DETECTION';
  satelliteLinkStatus: 'CONNECTED' | 'SYNCING' | 'DEGRADED';
  perimeterStatus: 'SECURE' | 'BREACH_ALERT' | 'INVESTIGATING';
}

export interface SatelliteAlert {
  id: string;
  timestamp: string;
  type: string;
  severity: 'low' | 'medium' | 'high';
  resolved: boolean;
  coords: string;
}
