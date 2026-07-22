const pool = require('../config/db');

const BeamDesign = {
  create: async (beamData) => {
    const { 
        project_id, beam_name, beam_width, beam_depth, beam_length,
        concrete_grade, steel_grade, cover, 
        number_of_tensile_bars, diameter_tensile_bars, 
        number_of_compression_bars, diameter_compression_bars, 
        stirrup_diameter, stirrup_spacing, 
        loading_type, applied_load, created_by
    } = beamData;
    
    const query = `
      INSERT INTO beam_designs 
      (project_id, beam_name, beam_width, beam_depth, beam_length, concrete_grade, steel_grade, cover, number_of_tensile_bars, diameter_tensile_bars, number_of_compression_bars, diameter_compression_bars, stirrup_diameter, stirrup_spacing, loading_type, applied_load, created_by) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [
        project_id, beam_name, beam_width, beam_depth, beam_length,
        concrete_grade, steel_grade, cover, 
        number_of_tensile_bars, diameter_tensile_bars, 
        number_of_compression_bars, diameter_compression_bars, 
        stirrup_diameter, stirrup_spacing, 
        loading_type, applied_load, created_by
    ]);
    
    // Update the project's updated_at timestamp
    await pool.execute('UPDATE projects SET updated_at = CURRENT_TIMESTAMP WHERE project_id = ?', [project_id]);
    
    return result.insertId;
  },

  findAllByProject: async (project_id, filters = {}) => {
    let query = 'SELECT * FROM beam_designs WHERE project_id = ?';
    const params = [project_id];

    if (filters.grade) {
        query += ' AND concrete_grade = ?';
        params.push(filters.grade);
    }
    
    if (filters.loading) {
        query += ' AND loading_type = ?';
        params.push(filters.loading);
    }

    if (filters.sort === 'created_at') {
        query += ' ORDER BY created_at DESC';
    } else {
        query += ' ORDER BY updated_at DESC'; // default sort
    }

    const [rows] = await pool.execute(query, params);
    return rows;
  },

  findById: async (beam_id) => {
    const query = `
        SELECT b.*, u.name as created_by_name 
        FROM beam_designs b 
        LEFT JOIN users u ON b.created_by = u.id 
        WHERE b.beam_id = ?
    `;
    const [rows] = await pool.execute(query, [beam_id]);
    return rows[0];
  },

  update: async (beam_id, project_id, updateData) => {
    const { 
        beam_name, beam_width, beam_depth, beam_length,
        concrete_grade, steel_grade, cover, 
        number_of_tensile_bars, diameter_tensile_bars, 
        number_of_compression_bars, diameter_compression_bars, 
        stirrup_diameter, stirrup_spacing, 
        loading_type, applied_load 
    } = updateData;

    const fields = [];
    const values = [];

    const addField = (fieldName, value) => {
        if (value !== undefined) {
            fields.push(`${fieldName} = ?`);
            values.push(value);
        }
    };

    addField('beam_name', beam_name);
    addField('beam_width', beam_width);
    addField('beam_depth', beam_depth);
    addField('beam_length', beam_length);
    addField('concrete_grade', concrete_grade);
    addField('steel_grade', steel_grade);
    addField('cover', cover);
    addField('number_of_tensile_bars', number_of_tensile_bars);
    addField('diameter_tensile_bars', diameter_tensile_bars);
    addField('number_of_compression_bars', number_of_compression_bars);
    addField('diameter_compression_bars', diameter_compression_bars);
    addField('stirrup_diameter', stirrup_diameter);
    addField('stirrup_spacing', stirrup_spacing);
    addField('loading_type', loading_type);
    addField('applied_load', applied_load);

    if (fields.length === 0) return 0;

    const query = `UPDATE beam_designs SET ${fields.join(', ')} WHERE beam_id = ?`;
    values.push(beam_id);

    const [result] = await pool.execute(query, values);
    
    if (result.affectedRows > 0) {
        // Update project timestamp
        await pool.execute('UPDATE projects SET updated_at = CURRENT_TIMESTAMP WHERE project_id = ?', [project_id]);
    }
    
    return result.affectedRows;
  },

  delete: async (beam_id, project_id) => {
    const query = 'DELETE FROM beam_designs WHERE beam_id = ?';
    const [result] = await pool.execute(query, [beam_id]);
    
    if (result.affectedRows > 0) {
        // Update project timestamp
        await pool.execute('UPDATE projects SET updated_at = CURRENT_TIMESTAMP WHERE project_id = ?', [project_id]);
    }
    
    return result.affectedRows;
  },

  duplicate: async (beam_id, created_by) => {
      // Fetch existing
      const existing = await BeamDesign.findById(beam_id);
      if (!existing) return null;

      // Create new name
      const newName = `${existing.beam_name} (Copy)`;

      // Insert new
      const query = `
        INSERT INTO beam_designs 
        (project_id, beam_name, beam_width, beam_depth, beam_length, concrete_grade, steel_grade, cover, number_of_tensile_bars, diameter_tensile_bars, number_of_compression_bars, diameter_compression_bars, stirrup_diameter, stirrup_spacing, loading_type, applied_load, created_by) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const [result] = await pool.execute(query, [
        existing.project_id, newName, existing.beam_width, existing.beam_depth, existing.beam_length,
        existing.concrete_grade, existing.steel_grade, existing.cover, 
        existing.number_of_tensile_bars, existing.diameter_tensile_bars, 
        existing.number_of_compression_bars, existing.diameter_compression_bars, 
        existing.stirrup_diameter, existing.stirrup_spacing, 
        existing.loading_type, existing.applied_load, created_by
      ]);

      // Update project timestamp
      await pool.execute('UPDATE projects SET updated_at = CURRENT_TIMESTAMP WHERE project_id = ?', [existing.project_id]);

      return result.insertId;
  },
  
  countByProjectIds: async (projectIds) => {
      if (!projectIds || projectIds.length === 0) return 0;
      const placeholders = projectIds.map(() => '?').join(',');
      const query = `SELECT COUNT(*) as count FROM beam_designs WHERE project_id IN (${placeholders})`;
      const [rows] = await pool.execute(query, projectIds);
      return rows[0].count;
  },
  
  getRecentByProjectIds: async (projectIds, limit = 5) => {
      if (!projectIds || projectIds.length === 0) return [];
      const placeholders = projectIds.map(() => '?').join(',');
      const query = `SELECT * FROM beam_designs WHERE project_id IN (${placeholders}) ORDER BY updated_at DESC LIMIT ?`;
      const params = [...projectIds, limit];
      const [rows] = await pool.execute(query, params);
      return rows;
  }
};

module.exports = BeamDesign;
