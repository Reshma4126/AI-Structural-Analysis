const Project = require('../models/projectModel');
const BeamDesign = require('../models/beamModel');

// @route   GET /api/dashboard
// @desc    Get dashboard statistics based on user role
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    // Fetch common project stats
    const totalProjects = await Project.countByUser(userId);
    const activeProjects = await Project.countActiveByUser(userId);
    const recentProjects = await Project.getRecentByUser(userId, 5);

    // Fetch beam stats
    const allUserProjects = await Project.findAllByUser(userId);
    const projectIds = allUserProjects.map(p => p.project_id);
    
    let totalBeamDesigns = 0;
    let recentBeamDesigns = [];
    if (projectIds.length > 0) {
        totalBeamDesigns = await BeamDesign.countByProjectIds(projectIds);
        recentBeamDesigns = await BeamDesign.getRecentByProjectIds(projectIds, 5);
    }

    let stats = {};

    switch(role) {
        case 'Engineer':
            stats = {
                totalProjects,
                activeProjects,
                totalBeamDesigns,
                recentProjects,
                recentlyModifiedBeams: recentBeamDesigns,
                archivedProjects: totalProjects - activeProjects
            };
            break;
        case 'Researcher':
            stats = {
                totalProjects,
                datasetSamples: totalBeamDesigns, // Placeholder for future dataset integration
                experiments: activeProjects, // Placeholder for future experiments
                recentProjects
            };
            break;
        case 'Student':
            stats = {
                totalProjects,
                beamDesigns: totalBeamDesigns,
                recentProjects
            };
            break;
        case 'Admin':
            stats = {
                totalProjects,
                activeProjects,
                totalBeamDesigns,
                recentProjects,
                message: "Admin dashboard full analytics coming soon."
            };
            break;
        default:
            stats = {
                totalProjects,
                recentProjects
            };
    }

    res.json(stats);
  } catch (error) {
    console.error('Error in getDashboardStats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getDashboardStats
};
