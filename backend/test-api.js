#!/usr/bin/env node

/**
 * Simple API test script for Discord Clone Backend
 * This script tests the basic endpoints without authentication
 */

const http = require('http');
const https = require('https');

const BASE_URL = process.env.API_URL || 'http://localhost:9000';
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
      timeout: 10000, // 10 second timeout
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Discord-Clone-Test/1.0',
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
      log('red', `Request failed: ${err.code} - ${err.message}`);
      if (err.code === 'ECONNRESET') {
        log('yellow', '💡 Connection reset suggests backend crashed or rejected the request');
      } else if (err.code === 'ECONNREFUSED') {
        log('yellow', '💡 Connection refused suggests backend is not running');
      }
      reject(err);
    });

    req.on('timeout', () => {
      log('red', 'Request timeout - backend may be unresponsive');
      req.destroy();
      reject(new Error('Request timeout'));
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

async function testHealth() {
  try {
    const res = await new Promise((resolve, reject) => {
      makeRequest('/health', 'GET').then(resolve).catch(reject);
    });
    log('green', `✅ Health check passed: ${JSON.stringify(res)}`);
  } catch (err) {
    log('red', `❌ Health check failed: ${err.message}`);
  }
}

async function testChannels() {
  try {
    const res = await new Promise((resolve, reject) => {
      makeRequest('/api/channels', 'GET', null, { Authorization: 'Bearer test' }).then(resolve).catch(reject);
    });
    if (Array.isArray(res.channels)) {
      log('green', `✅ Channels endpoint works: ${res.channels.length} channels`);
    } else {
      log('red', `❌ Channels endpoint returned unexpected data: ${JSON.stringify(res)}`);
    }
  } catch (err) {
    log('red', `❌ Channels endpoint error: ${err.message}`);
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

// Main test execution
async function main() {
  log('blue', '🔍 Starting comprehensive backend integration tests...\n');
  
  // Step 1: Test basic connectivity
  log('yellow', 'Step 1: Testing basic connectivity...');
  await testConnectivity();
  console.log('');
  
  // Step 2: Run main test suite
  log('yellow', 'Step 2: Running endpoint tests...');
  await runTests();
  console.log('');
  
  // Step 3: Test specific functions
  log('yellow', 'Step 3: Testing specific health and channels...');
  await testHealth();
  await testChannels();
}

// Test basic connectivity before running other tests
async function testConnectivity() {
  try {
    log('blue', 'Testing raw TCP connectivity to localhost:9000...');
    
    const net = require('net');
    const socket = new net.Socket();
    
    const connectPromise = new Promise((resolve, reject) => {
      socket.setTimeout(5000);
      
      socket.on('connect', () => {
        log('green', '✅ TCP connection successful');
        socket.destroy();
        resolve(true);
      });
      
      socket.on('timeout', () => {
        log('red', '❌ Connection timeout - backend may not be running');
        socket.destroy();
        reject(new Error('Connection timeout'));
      });
      
      socket.on('error', (err) => {
        log('red', `❌ Connection error: ${err.message}`);
        socket.destroy();
        reject(err);
      });
      
      socket.connect(9000, 'localhost');
    });
    
    await connectPromise;
    
  } catch (error) {
    log('red', `❌ Basic connectivity test failed: ${error.message}`);
    log('yellow', '💡 Suggestions:');
    console.log('   - Make sure backend is running: npm run dev');
    console.log('   - Check if port 9000 is available');
    console.log('   - Verify no firewall is blocking connections');
    return false;
  }
  
  return true;
}

// Run the main test
main().catch((error) => {
  console.error('Test execution failed:', error);
  process.exit(1);
});
