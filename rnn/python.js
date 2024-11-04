import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execPromise = promisify(exec);

const __dirname = path.resolve();
const venvActivate = path.join('/home', 'giggo', 'python', 'Neural-Networks', 'nn-env', 'bin', 'activate');
const za1Update = path.join('/home', 'giggo', 'python', 'water-flow-prediction', 'za', 'za1', 'rnn_update.py');
const za1Predict = path.join('/home', 'giggo', 'python', 'water-flow-prediction', 'za', 'za1', 'rnn_predict.py');
const za1msmUpdate = path.join('/home', 'giggo', 'python', 'water-flow-prediction', 'za', 'za1_msm', 'rnn_update.py');
const za1msmPredict = path.join('/home', 'giggo', 'python', 'water-flow-prediction', 'za', 'za1_msm', 'rnn_predict.py');
const za2Update = path.join('/home', 'giggo', 'python', 'water-flow-prediction', 'za', 'za2', 'rnn_update.py');
const za2Predict = path.join('/home', 'giggo', 'python', 'water-flow-prediction', 'za', 'za2', 'rnn_predict.py');
const za3Update = path.join('/home', 'giggo', 'python', 'water-flow-prediction', 'za', 'za3', 'rnn_update.py');
const za3Predict = path.join('/home', 'giggo', 'python', 'water-flow-prediction', 'za', 'za3', 'rnn_predict.py');
const za4Update = path.join('/home', 'giggo', 'python', 'water-flow-prediction', 'za', 'za4', 'rnn_update.py');
const za4Predict = path.join('/home', 'giggo', 'python', 'water-flow-prediction', 'za', 'za4', 'rnn_predict.py');
const za5Predict = path.join('/home', 'giggo', 'python', 'water-flow-prediction', 'za', 'za5', 'rnn_predict.py');
const za5Update = path.join('/home', 'giggo', 'python', 'water-flow-prediction', 'za', 'za5', 'rnn_update.py');
const zb1mvPredict = path.join('/home', 'giggo', 'python', 'water-flow-prediction', 'zb', 'zb1_mv', 'rnn_predict.py');
const zb1mvUpdate = path.join('/home', 'giggo', 'python', 'water-flow-prediction', 'zb', 'zb1_mv', 'rnn_update.py');


const execPython = async (script) => {
    try {
        const command = `bash -c "source ${venvActivate} && python3 ${script}"`;
        const { stdout, stderr } = await execPromise(command);

        if (stderr) console.warn(`Warning in Python script: ${stderr}`);
        console.log(`Python script output: ${stdout}`);
    } catch (error) {
        console.error(`Error running ${script}:`, error.message);
        throw error;
    }
};

// Helper function to introduce a delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const runZa1Scripts = async () => {
    try {
            await execPython(za1Update);
            // Add a 1-minute delay (60000 ms) between scripts
            await delay(60000);
            await execPython(za1Predict);
    } catch (error) {
        console.error('Error running ZA1 scripts:', error);
    }
};

const runZa1msmScripts = async () => {
    try {
            await execPython(za1msmUpdate);
            // Add a 1-minute delay (60000 ms) between scripts
            await delay(60000);
            await execPython(za1msmPredict);
    } catch (error) {
        console.error('Error running ZA1_msm scripts:', error);
    }
};

const runZa2Scripts = async () => {
    try {
            await execPython(za2Update);
            // Add a 1-minute delay (60000 ms) between scripts
            await delay(60000);
            await execPython(za2Predict);
    } catch (error) {
        console.error('Error running ZA2 scripts:', error);
    }
};

const runZa3Scripts = async () => {
    try {
            await execPython(za3Update);
            // Add a 1-minute delay (60000 ms) between scripts
            await delay(60000);
            await execPython(za3Predict);
    } catch (error) {
        console.error('Error running ZA3 scripts:', error);
    }
};

const runZa4Scripts = async () => {
    try {
            await execPython(za4Update);
            // Add a 1-minute delay (60000 ms) between scripts
            await delay(60000);
            await execPython(za4Predict);
    } catch (error) {
        console.error('Error running ZA4 scripts:', error);
    }
};

const runZa5Scripts = async () => {
    try {
            await execPython(za5Update);
            // Add a 1-minute delay (60000 ms) between scripts
            await delay(60000);
            await execPython(za5Predict);
    } catch (error) {
        console.error('Error running ZA5 scripts:', error);
    }
};

const runZb1mvScripts = async () => {
    try {
            await execPython(zb1mvUpdate);
            // Add a 1-minute delay (60000 ms) between scripts
            await delay(60000);
            await execPython(zb1mvPredict);
    } catch (error) {
        console.error('Error running ZB1_mv scripts:', error);
    }
};

export { runZa1Scripts, runZa1msmScripts, runZa2Scripts, runZa3Scripts, runZa4Scripts, runZa5Scripts,
    runZb1mvScripts
  };

