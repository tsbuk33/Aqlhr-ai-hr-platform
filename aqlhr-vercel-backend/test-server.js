const http = require('http');
const url = require('url');

// Import handlers
const healthHandler = require('./api/health.js').default;
const indexHandler = require('./api/index.js').default;
const aiHandler = require('./api/ai/index.js').default;
const employeesHandler = require('./api/employees/index.js').default;
const vision2030Handler = require('./api/vision2030/index.js').default;
const gosiHandler = require('./api/government/gosi.js').default;

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Create mock request object
  const mockReq = {
    method: req.method,
    url: req.url,
    query: parsedUrl.query,
    body: {}
  };
  
  // Create mock response object
  const mockRes = {
    setHeader: (key, value) => res.setHeader(key, value),
    status: (code) => ({
      json: (data) => {
        res.writeHead(code, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data, null, 2));
      },
      end: () => {
        res.writeHead(code);
        res.end();
      }
    })
  };
  
  try {
    // Route requests
    if (pathname === '/api/health') {
      await healthHandler(mockReq, mockRes);
    } else if (pathname.startsWith('/api/ai')) {
      await aiHandler(mockReq, mockRes);
    } else if (pathname.startsWith('/api/employees')) {
      await employeesHandler(mockReq, mockRes);
    } else if (pathname.startsWith('/api/vision2030')) {
      await vision2030Handler(mockReq, mockRes);
    } else if (pathname.startsWith('/api/gosi')) {
      await gosiHandler(mockReq, mockRes);
    } else if (pathname === '/api' || pathname === '/api/' || pathname === '/') {
      await indexHandler(mockReq, mockRes);
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not found' }));
    }
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: error.message }));
  }
});

const PORT = 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`AQLHR Backend running on http://0.0.0.0:${PORT}`);
  console.log('Available endpoints:');
  console.log('- GET /api/health');
  console.log('- GET /api/ai/status');
  console.log('- GET /api/employees/statistics/summary');
  console.log('- GET /api/vision2030/kpis');
  console.log('- GET /api/gosi/status');
});
