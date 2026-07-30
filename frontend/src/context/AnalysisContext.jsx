import React, { createContext, useContext, useState, useEffect } from 'react';

const defaultAnalysisObj = {
  analysisId: 101,
  beamName: 'Main Transfer Girder B-101 (Baseline)',
  projectName: 'Commercial High-Rise Complex B',
  beamParams: {
    width: 300,
    depth: 450,
    span: 5000,
    concrete_strength: 30,
    fy_longitudinal_bars: 500,
    num_tensile_bars: 4,
    diameter_tensile_bars: 20,
    num_stirrup_legs: 2,
    stirrup_spacing: 150,
    stirrup_diameter: 8
  },
  engineering: {
    effectiveDepth: 407,
    steelArea: 1256.6,
    neutralAxisDepth: 168.7,
    momentOfInertia: 2278125000,
    momentCapacity: 183.7,
    shearCapacity: 339.2
  },
  prediction: {
    pmax: 245.2,
    delta_ult: 49.4,
    failure_mode: 'Flexural-bending (ductile)',
    ensemble_pmax_breakdown: {
      'Random Forest': 242.6,
      'Extra Trees': 241.3,
      'LightGBM': 243.5,
      'CatBoost': 253.2
    },
    ensemble_deltault_breakdown: {
      'Random Forest': 52.6,
      'Extra Trees': 47.8,
      'LightGBM': 48.5,
      'CatBoost': 48.7
    }
  },
  beam_health_score: 81,
  recommendation: 'Calculated working deflection (32.9 mm) exceeds allowable L/250 limit (20.0 mm). Consider increasing section depth to 550 mm.',
  shap: {
    top_features: [
      { feature: 'fy_Longitudinal_Bars', importance: 0.47 },
      { feature: 'Width', importance: 0.37 },
      { feature: 'Concrete_Strength', importance: 0.09 }
    ]
  },
  createdAt: new Date().toISOString()
};

const defaultOptimizedObj = {
  analysisId: 102,
  beamName: 'Transfer Girder B-101 (Optimized h=550mm)',
  projectName: 'Commercial High-Rise Complex B',
  beamParams: {
    width: 300,
    depth: 550,
    span: 5000,
    concrete_strength: 30,
    fy_longitudinal_bars: 500,
    num_tensile_bars: 4,
    diameter_tensile_bars: 20,
    num_stirrup_legs: 2,
    stirrup_spacing: 150,
    stirrup_diameter: 8
  },
  engineering: {
    effectiveDepth: 507,
    steelArea: 1256.6,
    neutralAxisDepth: 168.7,
    momentOfInertia: 4159375000,
    momentCapacity: 228.4,
    shearCapacity: 415.8
  },
  prediction: {
    pmax: 291.5,
    delta_ult: 27.1,
    failure_mode: 'Flexural-bending (ductile)',
    ensemble_pmax_breakdown: {
      'Random Forest': 288.0,
      'Extra Trees': 289.2,
      'LightGBM': 292.1,
      'CatBoost': 296.7
    },
    ensemble_deltault_breakdown: {
      'Random Forest': 28.5,
      'Extra Trees': 26.2,
      'LightGBM': 26.8,
      'CatBoost': 26.9
    }
  },
  beam_health_score: 96,
  recommendation: 'Section meets ultimate capacity and L/250 serviceability deflection limits with ductile flexural behavior.',
  shap: {
    top_features: [
      { feature: 'Depth', importance: 0.52 },
      { feature: 'fy_Longitudinal_Bars', importance: 0.31 },
      { feature: 'Width', importance: 0.12 }
    ]
  },
  createdAt: new Date(Date.now() - 3600000).toISOString()
};

const defaultHighStrengthObj = {
  analysisId: 103,
  beamName: 'Transfer Girder B-102 (High-Strength M40)',
  projectName: 'Commercial High-Rise Complex B',
  beamParams: {
    width: 350,
    depth: 500,
    span: 5000,
    concrete_strength: 40,
    fy_longitudinal_bars: 500,
    num_tensile_bars: 5,
    diameter_tensile_bars: 20,
    num_stirrup_legs: 2,
    stirrup_spacing: 125,
    stirrup_diameter: 8
  },
  engineering: {
    effectiveDepth: 457,
    steelArea: 1570.8,
    neutralAxisDepth: 136.2,
    momentOfInertia: 3645833333,
    momentCapacity: 310.2,
    shearCapacity: 480.5
  },
  prediction: {
    pmax: 335.8,
    delta_ult: 22.4,
    failure_mode: 'Flexural-bending (ductile)',
    ensemble_pmax_breakdown: {
      'Random Forest': 330.1,
      'Extra Trees': 332.5,
      'LightGBM': 338.0,
      'CatBoost': 342.6
    },
    ensemble_deltault_breakdown: {
      'Random Forest': 23.8,
      'Extra Trees': 21.9,
      'LightGBM': 22.0,
      'CatBoost': 21.9
    }
  },
  beam_health_score: 98,
  recommendation: 'High-performance section exhibiting maximum structural capacity, optimal stiffness, and full code compliance.',
  shap: {
    top_features: [
      { feature: 'Concrete_Strength', importance: 0.44 },
      { feature: 'Depth', importance: 0.38 },
      { feature: 'Width', importance: 0.14 }
    ]
  },
  createdAt: new Date(Date.now() - 7200000).toISOString()
};

const defaultSeedHistory = [defaultAnalysisObj, defaultOptimizedObj, defaultHighStrengthObj];

const AnalysisContext = createContext(null);

export function AnalysisProvider({ children }) {
  const [activeAnalysis, setActiveAnalysis] = useState(() => {
    try {
      const saved = localStorage.getItem('activeAnalysis');
      return saved ? JSON.parse(saved) : defaultAnalysisObj;
    } catch (e) {
      return defaultAnalysisObj;
    }
  });

  const [historyList, setHistoryList] = useState(() => {
    try {
      const saved = localStorage.getItem('analysisHistory');
      const parsed = saved ? JSON.parse(saved) : [];
      return parsed && parsed.length >= 2 ? parsed : defaultSeedHistory;
    } catch (e) {
      return defaultSeedHistory;
    }
  });

  // Save an analysis run into both active state and permanent history
  const saveAnalysisRun = (data, beamName = 'Beam B-101', beamParams = {}) => {
    if (!data) return;

    const analysisObj = {
      analysisId: data.analysisId || Date.now(),
      beamName: beamName || data.beamName || 'Beam B-101',
      beamParams: beamParams || data.beamParams || {},
      engineering: data.engineering || {},
      prediction: data.prediction || {},
      beam_health_score: data.beam_health_score ?? 85,
      recommendation: data.recommendation || 'Beam design is structurally acceptable.',
      shap: data.shap || { top_features: [] },
      createdAt: new Date().toISOString()
    };

    setActiveAnalysis(analysisObj);
    try {
      localStorage.setItem('activeAnalysis', JSON.stringify(analysisObj));
    } catch (e) {
      console.warn('LocalStorage activeAnalysis save failed:', e);
    }

    setHistoryList((prev) => {
      const filtered = prev.filter(h => h.analysisId !== analysisObj.analysisId);
      const updated = [analysisObj, ...filtered];
      try {
        localStorage.setItem('analysisHistory', JSON.stringify(updated));
      } catch (e) {
        console.warn('LocalStorage analysisHistory save failed:', e);
      }
      return updated;
    });

    return analysisObj;
  };

  // Load a historical analysis into active view
  const loadAnalysisRecord = (id) => {
    const record = historyList.find(h => String(h.analysisId) === String(id));
    if (record) {
      setActiveAnalysis(record);
      try {
        localStorage.setItem('activeAnalysis', JSON.stringify(record));
      } catch (e) {}
    }
    return record;
  };

  const deleteAnalysisRecord = (id) => {
    setHistoryList((prev) => {
      const updated = prev.filter(h => String(h.analysisId) !== String(id));
      try {
        localStorage.setItem('analysisHistory', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    if (activeAnalysis && String(activeAnalysis.analysisId) === String(id)) {
      setActiveAnalysis(null);
      localStorage.removeItem('activeAnalysis');
    }
  };

  return (
    <AnalysisContext.Provider
      value={{
        activeAnalysis,
        historyList,
        saveAnalysisRun,
        loadAnalysisRecord,
        deleteAnalysisRecord,
        setActiveAnalysis
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
}
