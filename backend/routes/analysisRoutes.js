const express = require('express');
const router = express.Router();
const { 
  predictAnalysis,
  getAnalysisData, 
  runAnalysis,
  getComparisonData
} = require('../controllers/analysisController');
const { auth } = require('../middleware/authMiddleware');

router.use(auth);

// POST /api/analysis/predict - Single inference API integrating Python ML models and SHAP
router.post('/predict', predictAnalysis);

// GET /api/analysis/comparison
router.get('/comparison', getComparisonData);

// Beam Analysis Operations
router.get('/:beamId', getAnalysisData);
router.post('/:beamId/run', runAnalysis);

module.exports = router;
