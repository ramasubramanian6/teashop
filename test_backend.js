import http from 'http';

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/sales',
    method: 'GET', // GET should return 200 or 401 (if auth), but not 404 if route exists
    headers: {
        'Content-Type': 'application/json'
    }
};

console.log('Testing connection to http://localhost:5000/api/sales...');

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
});

req.on('error', (e) => {
    console.error(`PROBLEM: ${e.message}`);
});

req.end();
