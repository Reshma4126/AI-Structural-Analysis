const pool = require('./config/db');

const run = async () => {
    try {
        await pool.execute(`
            ALTER TABLE analysis_records 
            ADD COLUMN beam_health INT,
            ADD COLUMN overall_status VARCHAR(50),
            ADD COLUMN ultimate_load_status VARCHAR(50),
            ADD COLUMN deflection_status VARCHAR(50),
            ADD COLUMN ductility_status VARCHAR(50),
            ADD COLUMN energy_status VARCHAR(50),
            ADD COLUMN failure_status VARCHAR(50),
            ADD COLUMN recommendations TEXT;
        `);
        console.log("analysis_records table altered with evaluation columns.");
        process.exit(0);
    } catch (e) {
        if (e.code === 'ER_DUP_FIELDNAME') {
            console.log("Evaluation columns already exist.");
            process.exit(0);
        } else {
            console.error("Migration error:", e);
            process.exit(1);
        }
    }
};

run();
