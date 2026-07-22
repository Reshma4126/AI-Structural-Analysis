const pool = require('../config/db');

const Project = {
  create: async (projectData) => {
    const { user_id, project_name, description } = projectData;
    const query = 'INSERT INTO projects (user_id, project_name, description) VALUES (?, ?, ?)';
    const [result] = await pool.execute(query, [user_id, project_name, description]);
    return result.insertId;
  },

  findAllByUser: async (user_id) => {
    const query = 'SELECT * FROM projects WHERE user_id = ? AND status != "Archived" ORDER BY updated_at DESC';
    const [rows] = await pool.execute(query, [user_id]);
    return rows;
  },

  findByIdAndUser: async (project_id, user_id) => {
    const query = 'SELECT * FROM projects WHERE project_id = ? AND user_id = ? AND status != "Archived"';
    const [rows] = await pool.execute(query, [project_id, user_id]);
    return rows[0];
  },

  update: async (project_id, user_id, updateData) => {
    const { project_name, description, status } = updateData;
    
    // Dynamically build the update query based on provided fields
    const fields = [];
    const values = [];

    if (project_name !== undefined) {
      fields.push('project_name = ?');
      values.push(project_name);
    }
    if (description !== undefined) {
      fields.push('description = ?');
      values.push(description);
    }
    if (status !== undefined) {
      fields.push('status = ?');
      values.push(status);
    }

    if (fields.length === 0) return 0; // Nothing to update

    const query = `UPDATE projects SET ${fields.join(', ')} WHERE project_id = ? AND user_id = ?`;
    values.push(project_id, user_id);

    const [result] = await pool.execute(query, values);
    return result.affectedRows;
  },

  softDelete: async (project_id, user_id) => {
    const query = 'UPDATE projects SET status = "Archived" WHERE project_id = ? AND user_id = ?';
    const [result] = await pool.execute(query, [project_id, user_id]);
    return result.affectedRows;
  },
  
  countByUser: async (user_id) => {
     const query = 'SELECT COUNT(*) as count FROM projects WHERE user_id = ?';
     const [rows] = await pool.execute(query, [user_id]);
     return rows[0].count;
  },

  countActiveByUser: async (user_id) => {
      const query = 'SELECT COUNT(*) as count FROM projects WHERE user_id = ? AND status = "Active"';
      const [rows] = await pool.execute(query, [user_id]);
      return rows[0].count;
  },

  getRecentByUser: async (user_id, limit = 5) => {
     const query = 'SELECT * FROM projects WHERE user_id = ? ORDER BY updated_at DESC LIMIT ?';
     const [rows] = await pool.execute(query, [user_id, limit]);
     return rows;
  }
};

module.exports = Project;
