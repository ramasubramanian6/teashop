import fs from 'fs';
import net from 'net';

console.log('Starting Simple Diag...');
fs.writeFileSync('simple_diag_start.txt', 'Started');

const client = new net.Socket();
client.setTimeout(2000);

client.connect(5000, '127.0.0.1', () => {
    console.log('Port 5000 OPEN');
    fs.writeFileSync('simple_diag_result.txt', 'Port 5000 OPEN');
    client.destroy();
    process.exit(0);
});

client.on('error', (err) => {
    console.log('Port 5000 CLOSED: ' + err.message);
    fs.writeFileSync('simple_diag_result.txt', 'Port 5000 CLOSED: ' + err.message);
    process.exit(0);
});

client.on('timeout', () => {
    console.log('Port 5000 TIMEOUT');
    fs.writeFileSync('simple_diag_result.txt', 'Port 5000 TIMEOUT');
    client.destroy();
    process.exit(0);
});
