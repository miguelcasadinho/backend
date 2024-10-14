import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

// Promisify exec to use with async/await
const execPromise = promisify(exec);

// Get the path to the Python script and virtual environment
const __dirname = path.resolve();
const scriptPath = path.join('/home', 'giggo', 'python', 'events', 'readings.py');
const venvActivate = path.join('/home', 'giggo', 'python', 'events','events', 'bin', 'activate');

const execPython = async () => {
    try {
        // Command to activate the virtual environment and run the Python script
        const command = `bash -c "source ${venvActivate} && python3 ${scriptPath}"`;

        // Use execPromise for async/await pattern
        const { stdout, stderr } = await execPromise(command);

        // If there's any error output from the Python script
        if (stderr) {
        console.error(`Python script error: ${stderr}`);
        return;
        }

        // The output from the Python script will include the file name
        const outputFile = stdout.trim();  // Capture and trim the file name
        //console.log(`CSV file generated: ${outputFile}`);

        return outputFile;
    } catch (error) {
        console.error('Error in execPython: ', error.message);
    }
};

export { execPython };