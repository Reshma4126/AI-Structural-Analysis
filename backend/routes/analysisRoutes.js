const express = require('express');
const router = express.Router();
const { 
  getAnalysisData, 
  runAnalysis,
  getComparisonData
} = require('../controllers/analysisController');
const { auth } = require('../middleware/authMiddleware');

router.use(auth);

// GET /api/analysis/comparison
router.get('/comparison', getComparisonData);

// Beam Analysis Operations
router.get('/:beamId', getAnalysisData);
router.post('/:beamId/run', runAnalysis);

module.exports = router;
