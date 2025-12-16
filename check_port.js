import net from 'net';

const client = new net.Socket();
client.setTimeout(2000);

client.connect(5000, '127.0.0.1', () => {
    console.log('OPEN');
    client.destroy();
});

client.on('error', (err) => {
    console.log('CLOSED: ' + err.message);
});

client.on('timeout', () => {
    console.log('TIMEOUT');
    client.destroy();
});
