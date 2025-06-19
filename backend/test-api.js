#!/usr/bin/env node

/**
 * Simple API test script for Discord Clone Backend
 * This script tests the basic endpoints without authentication
 */

const http = require('http');
const https = require('https');

const BASE_URL = process.env.API_URL || 'http://localhost:8080';
const isHttps = BASE_URL.startsWith('https');
const httpModule = isHttps ? https : http;

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(path, method = 'GET', data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    
    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    if (data) {
      const jsonData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(jsonData);
    }

    const req = httpModule.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonBody = body ? JSON.parse(body) : {};
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: jsonBody
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: body
          });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function testEndpoint(name, path, expectedStatus = 200, method = 'GET', data = null, headers = {}) {
  try {
    log('blue', `Testing ${name}...`);
    const response = await makeRequest(path, method, data, headers);
    
    if (response.statusCode === expectedStatus) {
      log('green', `✅ ${name} - Status: ${response.statusCode}`);
      if (response.body && typeof response.body === 'object') {
        console.log('   Response:', JSON.stringify(response.body, null, 2));
      }
      return true;
    } else {
      log('red', `❌ ${name} - Expected: ${expectedStatus}, Got: ${response.statusCode}`);
      console.log('   Response:', response.body);
      return false;
    }
  } catch (error) {
    log('red', `❌ ${name} - Error: ${error.message}`);
    return false;
  }
}

async function runTests() {
  log('yellow', `🧪 Testing Discord Clone API at: ${BASE_URL}`);
  console.log('');

  const tests = [
    // Health check
    ['Health Check', '/health', 200],
    
    // Unauthenticated requests (should return 401)
    ['Auth - Get Profile (No Token)', '/api/auth/me', 401],
    ['Channels - Get All (No Token)', '/api/channels', 401],
    ['Messages - Get Channel Messages (No Token)', '/api/messages/channel/test', 401],
    ['Users - Get User (No Token)', '/api/users/test-user', 401],
    
    // Invalid routes (should return 404)
    ['Invalid Route', '/api/invalid', 404],
    ['Root Route', '/', 404]
  ];

  let passed = 0;
  let total = tests.length;

  for (const [name, path, expectedStatus, method, data, headers] of tests) {
    const success = await testEndpoint(name, path, expectedStatus, method, data, headers);
    if (success) passed++;
    console.log('');
  }

  log('yellow', `📊 Test Results: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    log('green', '🎉 All tests passed! Your API is working correctly.');
  } else {
    log('red', '⚠️  Some tests failed. Check the output above for details.');
  }

  console.log('');
  log('blue', '📝 Next steps:');
  console.log('   1. Set up Firebase Authentication to test authenticated endpoints');
  console.log('   2. Create a frontend application to interact with the API');
  console.log('   3. Test with real Firebase ID tokens');
}

// Run the tests
runTests().catch(console.error);
