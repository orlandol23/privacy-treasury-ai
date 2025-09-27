const http = require('http');

const data = JSON.stringify({
  assets: [
    { symbol: 'ETH', amount: 100, value: 200000 }
  ]
});

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/analyze-portfolio',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  let responseData = '';
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  res.on('end', () => {
    console.log('Response:', responseData);
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
});

req.write(data);
req.end();
