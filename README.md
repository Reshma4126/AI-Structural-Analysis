# StructWise AI — AI-Powered Structural Intelligence for Reinforced Concrete Beams

![StructWise AI Logo](./frontend/src/assets/structwise_logo.png)

**StructWise AI** is an enterprise-grade artificial intelligence platform delivering precision structural analytics, capacity prediction ($P_{\max}$ & $\Delta_{\text{ult}}$), failure mode classification, explainable AI (SHAP XAI), side-by-side benchmarking, and AI-assisted optimization recommendations for reinforced concrete beams under AISC 360-16 / IS 456 codes.

---

## Brand & Corporate Palette

- **Primary**: `#1E3A5F` (Navy Blue)
- **Secondary**: `#64748B` (Steel Gray)
- **Accent**: `#F59E0B` (Construction Orange)
- **Background**: `#F8FAFC`

---

## Connected 8-Module Architecture Flow

```
Dashboard ➔ Beam Input ➔ AI Analysis ➔ Beam Health Score ➔ Recommendation ➔ SHAP Explanation ➔ History Archive ➔ Comparison ➔ Report Sheet
```

1. **Dashboard**: Integrated analytics stats & 8-module pipeline stepper.
2. **Beam Input**: Parameter modeling (Geometry, Concrete Grade, Longitudinal & Stirrup Steel).
3. **AI Analysis**: Adaptive Hybrid Ensemble Model (RF + ET + LightGBM + CatBoost).
4. **Beam Health Score**: Weighted multi-limit compliance score ($0-100\%$).
5. **AI Recommendation Engine**: Multi-option diagnostic advice (Depth tuning, Concrete upgrade, Rebar ratio).
6. **SHAP Explainable AI**: Feature attribution explanation graphs.
7. **Execution History**: Archive of analysis runs with `View`, `Compare`, `Report`, and `Delete` controls.
8. **Side-by-Side Comparison**: Benchmarking table (`Parameter | Beam A | Beam B | Winner`) with green winner highlights and a **FINAL DECISION** card.
9. **Calculation Reports**: Printable AISC 360-16 / IS 456 verification sheets with PDF exporter.

---

## Quick Start Guide

### 1. Backend Service Setup
```bash
cd backend
npm install
node database/init_db.js
npm run dev
```

### 2. Frontend Application Setup
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173/` in your browser to launch **StructWise AI**.
