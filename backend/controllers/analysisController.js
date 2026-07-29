const analysisService = require('../services/analysisService');
const Project = require('../models/projectModel');
const BeamDesign = require('../models/beamModel');
const AnalysisRecord = require('../models/analysisModel');
const pool = require('../config/db');

const checkProjectOwnership = async (projectId, userId) => {
    const project = await Project.findByIdAndUser(projectId, userId);
    return project !== undefined;
};

/**
 * Endpoint handler for POST /api/analysis/predict
 * Accepts beam parameters JSON and returns engineering calculations, Python ML predictions, and SHAP features.
 */
const predictAnalysis = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid request payload. Please provide valid beam design parameters.'
            });
        }

        const result = await analysisService.predictBeam(req.body);
        return res.status(200).json(result);
    } catch (error) {
        console.error('Error in predictAnalysis controller:', error);
        return res.status(500).json({
            success: false,
            message: 'AI structural prediction failed: ' + error.message
        });
    }
};

const getAnalysisData = async (req, res) => {
    try {
        const { beamId } = req.params;
        
        let beam;
        if (beamId === 'default') {
            const [rows] = await pool.execute(`
                SELECT b.* FROM beam_designs b
                JOIN projects p ON b.project_id = p.project_id
                WHERE p.user_id = ?
                ORDER BY b.created_at DESC LIMIT 1
            `, [req.user.id]);
            
            if (rows.length > 0) {
                beam = await BeamDesign.findById(rows[0].beam_id);
            }
        } else {
            beam = await BeamDesign.findById(beamId);
        }
        
        if (!beam) {
            return res.status(404).json({ message: 'No beams found. Please create a beam first.' });
        }
        
        const actualBeamId = beam.beam_id;
        
        const isOwner = await checkProjectOwnership(beam.project_id, req.user.id);
        if (!isOwner) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const analysisData = await analysisService.getAnalysis(actualBeamId, req.user.id);
        res.status(200).json(analysisData);
    } catch (error) {
        console.error('Error in getAnalysisData:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const runAnalysis = async (req, res) => {
    try {
        const { beamId } = req.params;
        
        let beam;
        if (beamId === 'default') {
            const [rows] = await pool.execute(`
                SELECT b.* FROM beam_designs b
                JOIN projects p ON b.project_id = p.project_id
                WHERE p.user_id = ?
                ORDER BY b.created_at DESC LIMIT 1
            `, [req.user.id]);
            
            if (rows.length > 0) {
                beam = await BeamDesign.findById(rows[0].beam_id);
            }
        } else {
            beam = await BeamDesign.findById(beamId);
        }
        
        if (!beam) {
            return res.status(404).json({ message: 'No beams found. Please create a beam first.' });
        }
        
        const actualBeamId = beam.beam_id;
        
        const isOwner = await checkProjectOwnership(beam.project_id, req.user.id);
        if (!isOwner) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const runResult = await analysisService.runAnalysis(actualBeamId, req.user.id);
        res.status(200).json(runResult);
    } catch (error) {
        console.error('Error in runAnalysis:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getAnalysisHistory = async (req, res) => {
    try {
        const { search, status, sort } = req.query;
        const history = await AnalysisRecord.findFullHistory(req.user.id, { search, status, sort });
        res.status(200).json(history);
    } catch (error) {
        console.error('Error in getAnalysisHistory:', error);
        res.status(500).json({ message: 'Server error fetching history' });
    }
};

const getAnalysisRecordById = async (req, res) => {
    try {
        const { id } = req.params;
        const record = await AnalysisRecord.findRecordById(id);
        
        if (!record) {
            return res.status(404).json({ message: 'Analysis record not found' });
        }
        
        if (record.user_id !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        res.status(200).json(record);
    } catch (error) {
        console.error('Error in getAnalysisRecordById:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteAnalysisRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const record = await AnalysisRecord.findRecordById(id);
        
        if (!record) {
            return res.status(404).json({ message: 'Analysis record not found' });
        }
        
        if (record.user_id !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await AnalysisRecord.deleteById(id);
        res.status(200).json({ message: 'Analysis record deleted successfully' });
    } catch (error) {
        console.error('Error in deleteAnalysisRecord:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const duplicateAnalysisRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const record = await AnalysisRecord.findRecordById(id);
        
        if (!record) {
            return res.status(404).json({ message: 'Analysis record not found' });
        }
        
        if (record.user_id !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const newId = await AnalysisRecord.duplicateRecord(id);
        res.status(201).json({ message: 'Analysis record duplicated successfully', analysisId: newId });
    } catch (error) {
        console.error('Error in duplicateAnalysisRecord:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const comparisonService = require('../services/comparisonService');

const getComparisonData = async (req, res) => {
    try {
        const { beamIds } = req.query;
        const comparison = await comparisonService.getComparison(req.user.id, beamIds);
        res.status(200).json(comparison);
    } catch (error) {
        console.error('Error in getComparisonData:', error);
        res.status(500).json({ message: 'Server error fetching comparison data' });
    }
};

module.exports = {
    predictAnalysis,
    getAnalysisData,
    runAnalysis,
    getAnalysisHistory,
    getAnalysisRecordById,
    deleteAnalysisRecord,
    duplicateAnalysisRecord,
    getComparisonData
};
