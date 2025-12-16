import http from 'http';

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/products',
    method: 'GET',
    headers: {
        'Authorization': 'Bearer test' // Just to see if it connects, auth might fail but connection should work
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.end();
