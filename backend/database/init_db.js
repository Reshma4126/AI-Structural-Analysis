const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function initDB() {
  console.log('Starting DB initialization...');
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root@123',
    multipleStatements: true
  });

  try {
    const dbName = process.env.DB_NAME || 'mini_proj';
    console.log(`Ensuring database ${dbName} exists...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    await connection.query(`USE \`${dbName}\`;`);

    const schemaPath = path.join(__dirname, 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Executing schema.sql statements...');
    await connection.query(sql);
    console.log('Database tables created/verified successfully!');

    // Seed default user if none exists
    const [users] = await connection.query('SELECT * FROM users LIMIT 1');
    let userId = 1;
    if (users.length === 0) {
      console.log('Seeding default user...');
      const hashedPassword = await bcrypt.hash('password123', 10);
      const [res] = await connection.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Senior Structural Engineer', 'engineer@ai-structural.com', hashedPassword, 'Engineer']
      );
      userId = res.insertId;
      console.log(`Default user created with ID: ${userId}`);
    } else {
      userId = users[0].id;
    }

    // Seed default project if none exists
    const [projects] = await connection.query('SELECT * FROM projects LIMIT 1');
    let projectId = 1;
    if (projects.length === 0) {
      console.log('Seeding default project...');
      const [res] = await connection.query(
        'INSERT INTO projects (user_id, project_name, description, status) VALUES (?, ?, ?, ?)',
        [userId, 'Commercial High-Rise Complex B', 'Structural AI Analysis & Limit State Design Verification', 'Active']
      );
      projectId = res.insertId;
      console.log(`Default project created with ID: ${projectId}`);
    } else {
      projectId = projects[0].project_id;
    }

    // Seed default beam design if none exists
    const [beams] = await connection.query('SELECT * FROM beam_designs LIMIT 1');
    let beamId = 1;
    if (beams.length === 0) {
      console.log('Seeding default beam design...');
      const [res] = await connection.query(
        `INSERT INTO beam_designs (
          project_id, beam_name, beam_width, beam_depth, beam_length, 
          concrete_grade, steel_grade, cover, number_of_tensile_bars, 
          diameter_tensile_bars, number_of_compression_bars, diameter_compression_bars, 
          stirrup_diameter, stirrup_spacing, loading_type, applied_load, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          projectId, 'Main Transfer Girder B-101', 300, 450, 5000,
          'M30', 'Fe500', 25, 4,
          20, 2, 12,
          8, 150, 'Uniformly Distributed Load (UDL)', 150, userId
        ]
      );
      beamId = res.insertId;
      console.log(`Default beam design created with ID: ${beamId}`);
    } else {
      beamId = beams[0].beam_id;
    }

    // Seed default analysis record if none exists
    const [records] = await connection.query('SELECT * FROM analysis_records LIMIT 1');
    if (records.length === 0) {
      console.log('Seeding default completed analysis record...');
      await connection.query(
        `INSERT INTO analysis_records (
          beam_id, status, prediction_version, pmax, ultimate_deflection, 
          ductility, energy_dissipation, failure_mode, beam_health, 
          overall_status, ultimate_load_status, deflection_status, 
          ductility_status, energy_status, failure_status, recommendations
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          beamId, 'COMPLETED', 'AHEM-v1.0', 245.2, 49.4,
          3.8, 1620.0, 'Flexural-bending (ductile)', 81,
          'PASS', 'PASS', 'WARNING',
          'GOOD', 'EXCELLENT', 'PREFERRED',
          JSON.stringify(["Consider increasing section depth to ~500mm to reduce working deflection below allowable L/250 limit."])
        ]
      );
      console.log('Default analysis record created.');
    }

    console.log('DB Initialization & Seeding Complete!');

  } catch (err) {
    console.error('Error initializing database:', err);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

initDB();
