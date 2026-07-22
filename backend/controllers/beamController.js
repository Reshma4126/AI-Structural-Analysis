const BeamDesign = require('../models/beamModel');
const Project = require('../models/projectModel');

// Helper function to check project ownership
const checkProjectOwnership = async (projectId, userId) => {
    const project = await Project.findByIdAndUser(projectId, userId);
    return project !== undefined;
};

// @route   POST /api/projects/:projectId/beams
// @desc    Create a new beam design for a project
// @access  Private
const createBeam = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    // Check if user owns the project
    const isOwner = await checkProjectOwnership(projectId, req.user.id);
    if (!isOwner) {
        return res.status(403).json({ message: 'Unauthorized or Project not found' });
    }

    const { 
        beam_name, beam_width, beam_depth, beam_length,
        concrete_grade, steel_grade, cover, 
        number_of_tensile_bars, diameter_tensile_bars, 
        number_of_compression_bars, diameter_compression_bars, 
        stirrup_diameter, stirrup_spacing, 
        loading_type, applied_load 
    } = req.body;
    
    const beamId = await BeamDesign.create({
      project_id: projectId,
      beam_name, beam_width, beam_depth, beam_length,
      concrete_grade, steel_grade, cover, 
      number_of_tensile_bars, diameter_tensile_bars, 
      number_of_compression_bars, diameter_compression_bars, 
      stirrup_diameter, stirrup_spacing, 
      loading_type, applied_load,
      created_by: req.user.id
    });

    res.status(201).json({
      message: 'Beam design created successfully',
      beamId
    });
  } catch (error) {
    console.error('Error in createBeam:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   GET /api/projects/:projectId/beams
// @desc    Get all beam designs for a project with optional filters
// @access  Private
const getBeamsForProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const isOwner = await checkProjectOwnership(projectId, req.user.id);
    if (!isOwner) {
        return res.status(403).json({ message: 'Unauthorized or Project not found' });
    }

    const { grade, loading, sort } = req.query;
    
    const filters = {};
    if (grade) filters.grade = grade;
    if (loading) filters.loading = loading;
    if (sort) filters.sort = sort;

    const beams = await BeamDesign.findAllByProject(projectId, filters);
    res.json(beams);
  } catch (error) {
    console.error('Error in getBeamsForProject:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   GET /api/beams/:beamId
// @desc    Get a single beam design
// @access  Private
const getBeamById = async (req, res) => {
  try {
    const beam = await BeamDesign.findById(req.params.beamId);
    
    if (!beam) {
      return res.status(404).json({ message: 'Beam design not found' });
    }

    // Verify ownership via project
    const isOwner = await checkProjectOwnership(beam.project_id, req.user.id);
    if (!isOwner) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(beam);
  } catch (error) {
    console.error('Error in getBeamById:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   PUT /api/beams/:beamId
// @desc    Update a beam design
// @access  Private
const updateBeam = async (req, res) => {
  try {
    const beam = await BeamDesign.findById(req.params.beamId);
    if (!beam) {
      return res.status(404).json({ message: 'Beam design not found' });
    }

    // Verify ownership via project
    const isOwner = await checkProjectOwnership(beam.project_id, req.user.id);
    if (!isOwner) {
        return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const affectedRows = await BeamDesign.update(req.params.beamId, beam.project_id, req.body);

    res.json({ message: 'Beam design updated successfully' });
  } catch (error) {
    console.error('Error in updateBeam:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   DELETE /api/beams/:beamId
// @desc    Delete a beam design
// @access  Private
const deleteBeam = async (req, res) => {
  try {
    const beam = await BeamDesign.findById(req.params.beamId);
    if (!beam) {
      return res.status(404).json({ message: 'Beam design not found' });
    }

    // Verify ownership via project
    const isOwner = await checkProjectOwnership(beam.project_id, req.user.id);
    if (!isOwner) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    await BeamDesign.delete(req.params.beamId, beam.project_id);

    res.json({ message: 'Beam design deleted successfully' });
  } catch (error) {
    console.error('Error in deleteBeam:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   POST /api/beams/:beamId/duplicate
// @desc    Duplicate an existing beam design
// @access  Private
const duplicateBeam = async (req, res) => {
    try {
        const beam = await BeamDesign.findById(req.params.beamId);
        if (!beam) {
            return res.status(404).json({ message: 'Beam design not found' });
        }
    
        // Verify ownership via project
        const isOwner = await checkProjectOwnership(beam.project_id, req.user.id);
        if (!isOwner) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
    
        const newBeamId = await BeamDesign.duplicate(req.params.beamId, req.user.id);
        if (!newBeamId) {
             return res.status(500).json({ message: 'Failed to duplicate' });
        }
    
        res.status(201).json({ message: 'Beam duplicated successfully', beamId: newBeamId });
    } catch (error) {
        console.error('Error in duplicateBeam:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @route   GET /api/beams/:beamId/summary
// @desc    Get structured summary of a beam design
// @access  Private
const getBeamSummary = async (req, res) => {
    try {
        const beam = await BeamDesign.findById(req.params.beamId);
        if (!beam) {
            return res.status(404).json({ message: 'Beam design not found' });
        }
    
        // Verify ownership via project
        const isOwner = await checkProjectOwnership(beam.project_id, req.user.id);
        if (!isOwner) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        
        const summary = {
            beamName: beam.beam_name,
            geometry: {
                width: beam.beam_width,
                depth: beam.beam_depth,
                length: beam.beam_length,
                cover: beam.cover
            },
            materials: {
                concreteGrade: beam.concrete_grade,
                steelGrade: beam.steel_grade
            },
            reinforcement: {
                tensile: {
                    bars: beam.number_of_tensile_bars,
                    diameter: beam.diameter_tensile_bars
                },
                compression: {
                    bars: beam.number_of_compression_bars,
                    diameter: beam.diameter_compression_bars
                },
                stirrups: {
                    diameter: beam.stirrup_diameter,
                    spacing: beam.stirrup_spacing
                }
            },
            loading: {
                type: beam.loading_type,
                appliedLoad: beam.applied_load
            },
            audit: {
                createdBy: beam.created_by_name || beam.created_by,
                createdAt: beam.created_at,
                updatedAt: beam.updated_at
            }
        };

        res.json(summary);
    } catch (error) {
        console.error('Error in getBeamSummary:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
  createBeam,
  getBeamsForProject,
  getBeamById,
  updateBeam,
  deleteBeam,
  duplicateBeam,
  getBeamSummary
};
