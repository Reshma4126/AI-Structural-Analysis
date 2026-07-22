const express = require('express');
const router = express.Router();
const { 
  createProject, 
  getProjects, 
  getProjectById, 
  updateProject, 
  deleteProject 
} = require('../controllers/projectController');
const { auth } = require('../middleware/authMiddleware');

// All project routes require authentication
router.use(auth);

// /api/projects
router.route('/')
  .post(createProject)
  .get(getProjects);

// /api/projects/:id
router.route('/:id')
  .get(getProjectById)
  .put(updateProject)
  .delete(deleteProject);

module.exports = router;
