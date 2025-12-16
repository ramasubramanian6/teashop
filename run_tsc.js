import { exec } from 'child_process';
import fs from 'fs';

console.log('Starting TSC check...');
exec('npx tsc --noEmit', { shell: true }, (error, stdout, stderr) => {
    const output = `STDOUT:\n${stdout}\n\nSTDERR:\n${stderr}\n\nERROR:\n${error ? error.message : 'None'}`;
    fs.writeFileSync('tsc_output.txt', output);
    console.log('TSC check complete. Output written to tsc_output.txt');
});
