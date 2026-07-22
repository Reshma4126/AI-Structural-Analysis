const Project = require('../models/projectModel');

// @route   POST /api/projects
// @desc    Create a new project
// @access  Private
const createProject = async (req, res) => {
  try {
    const { project_name, description } = req.body;
    
    if (!project_name) {
      return res.status(400).json({ message: 'Project name is required' });
    }

    const projectId = await Project.create({
      user_id: req.user.id,
      project_name,
      description
    });

    res.status(201).json({
      message: 'Project created successfully',
      project: { id: projectId, project_name, description, status: 'Active' }
    });
  } catch (error) {
    console.error('Error in createProject:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   GET /api/projects
// @desc    Get all active projects for the logged-in user
// @access  Private
const getProjects = async (req, res) => {
  try {
    const projects = await Project.findAllByUser(req.user.id);
    res.json(projects);
  } catch (error) {
    console.error('Error in getProjects:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   GET /api/projects/:id
// @desc    Get a single project
// @access  Private
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findByIdAndUser(req.params.id, req.user.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found or archived' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error in getProjectById:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   PUT /api/projects/:id
// @desc    Update a project
// @access  Private
const updateProject = async (req, res) => {
  try {
    const { project_name, description, status } = req.body;
    
    const affectedRows = await Project.update(req.params.id, req.user.id, {
        project_name, description, status
    });

    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Project not found or unauthorized' });
    }

    res.json({ message: 'Project updated successfully' });
  } catch (error) {
    console.error('Error in updateProject:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   DELETE /api/projects/:id
// @desc    Archive a project (Soft delete)
// @access  Private
const deleteProject = async (req, res) => {
  try {
    const affectedRows = await Project.softDelete(req.params.id, req.user.id);

    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Project not found or unauthorized' });
    }

    res.json({ message: 'Project archived successfully' });
  } catch (error) {
    console.error('Error in deleteProject:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject
};
