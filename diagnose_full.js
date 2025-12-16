import http from 'http';
import net from 'net';

const checkPort = (port, label) => {
    return new Promise((resolve) => {
        const client = new net.Socket();
        client.setTimeout(1000);

        client.connect(port, '127.0.0.1', () => {
            console.log(`✅ ${label} (Port ${port}) is OPEN`);
            client.destroy();
            resolve(true);
        });

        client.on('error', (err) => {
            console.log(`❌ ${label} (Port ${port}) is CLOSED or Unreachable: ${err.message}`);
            resolve(false);
        });

        client.on('timeout', () => {
            console.log(`❌ ${label} (Port ${port}) TIMED OUT`);
            client.destroy();
            resolve(false);
        });
    });
};

const checkUrl = (port, path, label) => {
    return new Promise((resolve) => {
        const options = {
            hostname: 'localhost',
            port: port,
            path: path,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        };

        const req = http.request(options, (res) => {
            console.log(`ℹ️  ${label} (${path}) returned Status: ${res.statusCode}`);
            resolve(res.statusCode);
        });

        req.on('error', (e) => {
            console.log(`❌ ${label} (${path}) Request Failed: ${e.message}`);
            resolve(null);
        });

        req.end();
    });
};

async function runDiagnostics() {
    console.log('--- Starting Diagnostics ---');

    const backendUp = await checkPort(5000, 'Backend Server');
    const frontendUp = await checkPort(3000, 'Frontend Server');

    if (backendUp) {
        // Expecting 401 because we are not sending a token
        await checkUrl(5000, '/api/sales', 'Direct Backend API');
    }

    if (frontendUp) {
        // Expecting 401 if proxy works, or 404/200 if it fails
        await checkUrl(3000, '/api/sales', 'Frontend Proxy API');
    }

    console.log('--- Diagnostics Complete ---');
}

runDiagnostics();
