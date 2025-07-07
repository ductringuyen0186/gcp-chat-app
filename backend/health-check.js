#!/usr/bin/env node

/**
 * Simple health check script for Discord Clone Backend
 * This script tests if the backend is running and responding
 */

const http = require('http');
const net = require('net');

const PORT = process.env.PORT || 9000;
const HOST = 'localhost';

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

// Test TCP connectivity
async function testTCPConnection() {
  return new Promise((resolve, reject) => {
    const socket = new net.Socket();
    socket.setTimeout(3000);
    
    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });
    
    socket.on('timeout', () => {
      socket.destroy();
      reject(new Error('Connection timeout'));
    });
    
    socket.on('error', (err) => {
      socket.destroy();
      reject(err);
    });
    
    socket.connect(PORT, HOST);
  });
}

// Test HTTP health endpoint
async function testHealthEndpoint() {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: HOST,
      port: PORT,
      path: '/health',
      method: 'GET',
      timeout: 5000,
      headers: {
        'User-Agent': 'Health-Check/1.0'
      }
    }, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          resolve({
            statusCode: res.statusCode,
            data: data
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            data: body
          });
        }
      });
    });
    
    req.on('error', (err) => {
      reject(err);
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('HTTP request timeout'));
    });
    
    req.end();
  });
}

// Main health check
async function runHealthCheck() {
  log('blue', '🏥 Discord Clone Backend Health Check');
  log('blue', `Testing connection to ${HOST}:${PORT}`);
  console.log('');
  
  // Step 1: Test TCP connectivity
  try {
    log('yellow', '1. Testing TCP connectivity...');
    await testTCPConnection();
    log('green', '✅ TCP connection successful');
  } catch (error) {
    log('red', `❌ TCP connection failed: ${error.message}`);
    log('yellow', '💡 Backend server is not running or port is blocked');
    log('yellow', '   Try running: npm run dev');
    return;
  }
  
  // Step 2: Test HTTP health endpoint
  try {
    log('yellow', '2. Testing /health endpoint...');
    const result = await testHealthEndpoint();
    
    if (result.statusCode === 200) {
      log('green', '✅ Health endpoint responding');
      log('blue', `   Response: ${JSON.stringify(result.data)}`);
    } else {
      log('red', `❌ Health endpoint returned status: ${result.statusCode}`);
      log('blue', `   Response: ${JSON.stringify(result.data)}`);
    }
  } catch (error) {
    log('red', `❌ Health endpoint failed: ${error.message}`);
    
    if (error.code === 'ECONNRESET') {
      log('yellow', '💡 Connection reset - backend may be crashing on requests');
      log('yellow', '   Check backend logs for errors');
      log('yellow', '   Possible causes: Firebase credentials, middleware errors');
    }
  }
  
  console.log('');
  log('blue', '🔍 Troubleshooting tips:');
  console.log('   - Make sure backend is running: npm run dev');
  console.log('   - Check backend terminal for error messages');
  console.log('   - Verify .env file has correct Firebase credentials');
  console.log('   - Try commenting out Firebase initialization temporarily');
}

// Run the health check
runHealthCheck().catch((error) => {
  console.error('Health check failed:', error);
  process.exit(1);
});
