const express = require('express');
const router = express.Router();
const { 
  createBeam, 
  getBeamsForProject, 
  getBeamById, 
  updateBeam, 
  deleteBeam,
  duplicateBeam,
  getBeamSummary
} = require('../controllers/beamController');
const { auth } = require('../middleware/authMiddleware');
const { validateBeamDesign } = require('../middleware/validationMiddleware');

// All beam routes require authentication
router.use(auth);

// For /api/projects/:projectId/beams
router.route('/projects/:projectId/beams')
  .post(validateBeamDesign, createBeam)
  .get(getBeamsForProject);

// For /api/beams/:beamId
router.route('/beams/:beamId')
  .get(getBeamById)
  .put(validateBeamDesign, updateBeam)
  .delete(deleteBeam);

// For /api/beams/:beamId/duplicate
router.post('/beams/:beamId/duplicate', duplicateBeam);

// For /api/beams/:beamId/summary
router.get('/beams/:beamId/summary', getBeamSummary);

module.exports = router;
