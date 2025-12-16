import { spawn } from 'child_process';
import fs from 'fs';

const logStream = fs.createWriteStream('server_debug.log');

console.log('Spawning server process...');
const server = spawn('node', ['server/index.js'], {
    stdio: ['ignore', 'pipe', 'pipe']
});

server.stdout.on('data', (data) => {
    const msg = `STDOUT: ${data}`;
    console.log(msg);
    logStream.write(msg);
});

server.stderr.on('data', (data) => {
    const msg = `STDERR: ${data}`;
    console.log(msg);
    logStream.write(msg);
});

server.on('close', (code) => {
    const msg = `Server process exited with code ${code}`;
    console.log(msg);
    logStream.write(msg);
    logStream.end();
});

// Keep alive for a bit to capture startup
setTimeout(() => {
    console.log('Timeout reached, killing test server...');
    server.kill();
}, 10000);
