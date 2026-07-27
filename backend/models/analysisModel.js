const pool = require('../config/db');

const AnalysisRecord = {
  create: async (beamId, status = 'RUNNING') => {
    const query = `
      INSERT INTO analysis_records (beam_id, status) 
      VALUES (?, ?)
    `;
    const [result] = await pool.execute(query, [beamId, status]);
    return result.insertId;
  },

  updateStatus: async (analysisId, status) => {
    const query = `UPDATE analysis_records SET status = ? WHERE analysis_id = ?`;
    const [result] = await pool.execute(query, [status, analysisId]);
    return result.affectedRows;
  },

  updateResults: async (analysisId, results, evaluation, recommendations) => {
    const query = `
      UPDATE analysis_records 
      SET 
        status = 'COMPLETED',
        pmax = ?,
        ultimate_deflection = ?,
        ductility = ?,
        energy_dissipation = ?,
        failure_mode = ?,
        beam_health = ?,
        overall_status = ?,
        ultimate_load_status = ?,
        deflection_status = ?,
        ductility_status = ?,
        energy_status = ?,
        failure_status = ?,
        recommendations = ?
      WHERE analysis_id = ?
    `;
    const [result] = await pool.execute(query, [
      results.pmax || results.ultimateLoad,
      results.ultimateDeflection || results.deflection,
      results.ductility,
      results.energy || results.energyDissipation,
      results.failureMode,
      evaluation.beamHealth,
      evaluation.overallStatus,
      evaluation.ultimateLoadStatus,
      evaluation.deflectionStatus,
      evaluation.ductilityStatus,
      evaluation.energyStatus,
      evaluation.failureStatus,
      JSON.stringify(recommendations || []),
      analysisId
    ]);
    return result.affectedRows;
  },

  findLatestByBeamId: async (beamId) => {
    const query = `
        SELECT * FROM analysis_records 
        WHERE beam_id = ? 
        ORDER BY created_at DESC 
        LIMIT 1
    `;
    const [rows] = await pool.execute(query, [beamId]);
    return rows[0] || null;
  },

  findAllByBeamId: async (beamId) => {
    const query = `
        SELECT * FROM analysis_records 
        WHERE beam_id = ? 
        ORDER BY created_at DESC
    `;
    const [rows] = await pool.execute(query, [beamId]);
    return rows;
  },

  findFullHistory: async (userId, filters = {}) => {
    let query = `
      SELECT 
        a.analysis_id,
        a.beam_id,
        a.status,
        a.prediction_version,
        a.pmax,
        a.ultimate_deflection,
        a.ductility,
        a.energy_dissipation,
        a.failure_mode,
        a.beam_health,
        a.overall_status,
        a.ultimate_load_status,
        a.deflection_status,
        a.ductility_status,
        a.energy_status,
        a.failure_status,
        a.recommendations,
        a.created_at,
        b.beam_name,
        p.project_id,
        p.project_name
      FROM analysis_records a
      JOIN beam_designs b ON a.beam_id = b.beam_id
      JOIN projects p ON b.project_id = p.project_id
      WHERE p.user_id = ?
    `;
    const params = [userId];

    if (filters.search) {
      query += ` AND (p.project_name LIKE ? OR b.beam_name LIKE ?)`;
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    if (filters.status && filters.status !== 'ALL') {
      query += ` AND (a.overall_status = ? OR a.status = ?)`;
      params.push(filters.status, filters.status);
    }

    if (filters.sort === 'oldest') {
      query += ` ORDER BY a.created_at ASC`;
    } else {
      query += ` ORDER BY a.created_at DESC`;
    }

    const [rows] = await pool.execute(query, params);
    return rows;
  },

  findRecordById: async (analysisId) => {
    const query = `
      SELECT 
        a.*,
        b.beam_name,
        p.project_id,
        p.project_name,
        p.user_id
      FROM analysis_records a
      JOIN beam_designs b ON a.beam_id = b.beam_id
      JOIN projects p ON b.project_id = p.project_id
      WHERE a.analysis_id = ?
    `;
    const [rows] = await pool.execute(query, [analysisId]);
    return rows[0] || null;
  },

  deleteById: async (analysisId) => {
    const query = `DELETE FROM analysis_records WHERE analysis_id = ?`;
    const [result] = await pool.execute(query, [analysisId]);
    return result.affectedRows;
  },

  duplicateRecord: async (analysisId) => {
    const existing = await AnalysisRecord.findRecordById(analysisId);
    if (!existing) return null;

    const query = `
      INSERT INTO analysis_records 
      (beam_id, status, prediction_version, report_path, pmax, ultimate_deflection, ductility, energy_dissipation, failure_mode, beam_health, overall_status, ultimate_load_status, deflection_status, ductility_status, energy_status, failure_status, recommendations) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [
      existing.beam_id,
      existing.status,
      existing.prediction_version ? `${existing.prediction_version}-copy` : 'v1.0-copy',
      existing.report_path,
      existing.pmax,
      existing.ultimate_deflection,
      existing.ductility,
      existing.energy_dissipation,
      existing.failure_mode,
      existing.beam_health,
      existing.overall_status,
      existing.ultimate_load_status,
      existing.deflection_status,
      existing.ductility_status,
      existing.energy_status,
      existing.failure_status,
      existing.recommendations
    ]);
    return result.insertId;
  }
};

module.exports = AnalysisRecord;
