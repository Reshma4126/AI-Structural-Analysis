import React, { createContext, useContext, useState, useEffect } from 'react';

const AnalysisContext = createContext(null);

export function AnalysisProvider({ children }) {
  const [activeAnalysis, setActiveAnalysis] = useState(() => {
    try {
      const saved = localStorage.getItem('activeAnalysis');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [historyList, setHistoryList] = useState(() => {
    try {
      const saved = localStorage.getItem('analysisHistory');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
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
