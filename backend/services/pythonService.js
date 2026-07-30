/**
 * Python Service
 * Dedicated microservice handler for spawning Python ML inference processes,
 * writing input JSON payloads to stdin, and capturing JSON predictions.
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

/**
 * Detect the appropriate Python executable.
 * Prefers local .venv if present, otherwise falls back to system 'python'.
 */
const getPythonExecutable = () => {
    const venvPythonPath = path.join(__dirname, '..', '.venv', 'Scripts', 'python.exe');
    if (fs.existsSync(venvPythonPath)) {
        return venvPythonPath;
    }
    return process.env.PYTHON_PATH || 'python';
};

/**
 * Execute Python ML prediction script with beam parameters.
 * @param {Object} beamParams - Beam geometry, material, and loading parameters
 * @returns {Promise<Object>} Structured prediction payload including SHAP and recommendations
 */
const predict = (beamParams) => {
    return new Promise((resolve, reject) => {
        const pythonExec = getPythonExecutable();
        const scriptPath = path.join(__dirname, '..', 'ml', 'predict.py');

        // Spawn Python process in backend root working directory
        const pythonProcess = spawn(pythonExec, [scriptPath], {
            cwd: path.join(__dirname, '..'),
            env: { ...process.env, PYTHONUNBUFFERED: '1' }
        });

        let stdoutData = '';
        let stderrData = '';

        // Capture stdout data stream
        pythonProcess.stdout.on('data', (chunk) => {
            stdoutData += chunk.toString();
        });

        // Capture stderr stream
        pythonProcess.stderr.on('data', (chunk) => {
            stderrData += chunk.toString();
        });

        // Handle process completion
        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                console.error(`Python process exited with code ${code}. Stderr: ${stderrData}`);
                return reject(new Error(`Python execution failed (code ${code}): ${stderrData || 'Unknown error'}`));
            }

            try {
                const trimmed = stdoutData.trim();
                if (!trimmed) {
                    return reject(new Error('Empty output received from Python ML process.'));
                }

                const result = JSON.parse(trimmed);
                if (result.success === false) {
                    return reject(new Error(result.error || 'Python ML inference reported failure.'));
                }

                resolve(result);
            } catch (parseError) {
                console.error('Failed to parse Python ML output JSON:', stdoutData);
                reject(new Error(`Invalid JSON output from Python service: ${parseError.message}`));
            }
        });

        // Handle process spawn error
        pythonProcess.on('error', (err) => {
            console.error('Failed to spawn Python process:', err);
            reject(new Error(`Failed to start Python executable (${pythonExec}): ${err.message}`));
        });

        // Set 45-second execution timeout to allow heavy ML ensemble loading
        const timeout = setTimeout(() => {
            pythonProcess.kill();
            reject(new Error('Python ML inference timed out (45 seconds).'));
        }, 45000);


        pythonProcess.on('exit', () => clearTimeout(timeout));

        // Write payload to stdin and close stream
        pythonProcess.stdin.write(JSON.stringify(beamParams));
        pythonProcess.stdin.end();
    });
};

module.exports = {
    predict
};
