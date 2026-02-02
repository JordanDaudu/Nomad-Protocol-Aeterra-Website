// src/pages/home-site-manifest.tsx

export interface SystemAlert {
  id: number;
  type: "CRIT" | "WARN" | "INFO";
  message: string;
}

/**
 * Add new alerts to the BOTTOM of this array.
 * The Home component will automatically reverse them so the newest appears first.
 */
export const SYSTEM_ALERTS: SystemAlert[] = [
  { 
    id: 1, 
    type: "CRIT", 
    message: "Connection to central dogma lost." 
  },
  { 
    id: 2, 
    type: "WARN", 
    message: "Physics engine instability detected in Sector 7." 
  },
  { 
    id: 3, 
    type: "INFO", 
    message: "Lore archives 34% recovered." 
  },
  { 
    id: 4, 
    type: "INFO", 
    message: "New weapon schematics compiled." 
  },
];

export const ENGINE_SKILLS = [
  "C# / .NET", 
  "UNITY_URP", 
  "HLSL_SHADERS", 
  "SCRIPTABLE_OBJECTS", 
  "OOP_PATTERNS", 
  "GIT_VCS"
];

export const SYSTEM_STATS = {
  stability: "42.08%",
  uplink: "34%"
};