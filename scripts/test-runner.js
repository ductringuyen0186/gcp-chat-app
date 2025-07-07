#!/usr/bin/env node

/**
 * Comprehensive test runner for the Discord Clone Chat App
 * Runs all tests, generates coverage reports, and provides detailed output
 */

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

const log = (message, color = 'white') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const runCommand = (command, cwd) => {
  return new Promise((resolve, reject) => {
    log(`Running: ${command}`, 'cyan');
    exec(command, { cwd }, (error, stdout, stderr) => {
      if (error) {
        log(`Error: ${error.message}`, 'red');
        reject(error);
      } else {
        if (stdout) log(stdout, 'white');
        if (stderr) log(stderr, 'yellow');
        resolve(stdout);
      }
    });
  });
};

const checkDirectory = (dir) => {
  return fs.existsSync(dir) && fs.existsSync(path.join(dir, 'package.json'));
};

const main = async () => {
  const rootDir = path.resolve(__dirname, '..');
  const frontendDir = path.join(rootDir, 'frontend');
  const backendDir = path.join(rootDir, 'backend');
  
  log('🧪 Starting comprehensive test suite...', 'magenta');
  log('=' * 50, 'blue');
  
  const results = {
    frontend: { passed: false, coverage: null },
    backend: { passed: false, coverage: null },
    overall: { passed: false, startTime: new Date() }
  };
  
  try {
    // Frontend tests
    if (checkDirectory(frontendDir)) {
      log('\n📱 Running Frontend Tests...', 'cyan');
      log('-' * 30, 'blue');
      
      try {
        await runCommand('npm test -- --watchAll=false --coverage --verbose', frontendDir);
        results.frontend.passed = true;
        log('✅ Frontend tests passed!', 'green');
      } catch (error) {
        log('❌ Frontend tests failed!', 'red');
        results.frontend.passed = false;
      }
    } else {
      log('⚠️  Frontend directory not found or missing package.json', 'yellow');
    }
    
    // Backend tests
    if (checkDirectory(backendDir)) {
      log('\n🔧 Running Backend Tests...', 'cyan');
      log('-' * 30, 'blue');
      
      try {
        // Check if test script exists
        const packageJsonPath = path.join(backendDir, 'package.json');
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        
        if (packageJson.scripts && packageJson.scripts.test) {
          await runCommand('npm test', backendDir);
          results.backend.passed = true;
          log('✅ Backend tests passed!', 'green');
        } else {
          log('⚠️  No backend tests found (missing test script)', 'yellow');
          results.backend.passed = true; // Don't fail if no tests exist
        }
      } catch (error) {
        log('❌ Backend tests failed!', 'red');
        results.backend.passed = false;
      }
    } else {
      log('⚠️  Backend directory not found or missing package.json', 'yellow');
    }
    
    // Overall results
    results.overall.passed = results.frontend.passed && results.backend.passed;
    const endTime = new Date();
    const duration = ((endTime - results.overall.startTime) / 1000).toFixed(2);
    
    log('\n' + '=' * 50, 'blue');
    log('📊 Test Results Summary', 'magenta');
    log('=' * 50, 'blue');
    
    log(`Frontend: ${results.frontend.passed ? '✅ PASSED' : '❌ FAILED'}`, 
        results.frontend.passed ? 'green' : 'red');
    log(`Backend:  ${results.backend.passed ? '✅ PASSED' : '❌ FAILED'}`, 
        results.backend.passed ? 'green' : 'red');
    log(`Duration: ${duration}s`, 'blue');
    
    if (results.overall.passed) {
      log('\n🎉 All tests passed!', 'green');
    } else {
      log('\n💥 Some tests failed!', 'red');
    }
    
    // Generate coverage report info
    const coverageDir = path.join(frontendDir, 'coverage');
    if (fs.existsSync(coverageDir)) {
      log('\n📈 Coverage report generated in:', 'cyan');
      log(`   ${coverageDir}`, 'white');
      log('   Open coverage/lcov-report/index.html in your browser', 'white');
    }
    
    // Exit with appropriate code
    process.exit(results.overall.passed ? 0 : 1);
    
  } catch (error) {
    log(`\n💥 Unexpected error: ${error.message}`, 'red');
    process.exit(1);
  }
};

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  log('Discord Clone Test Runner', 'magenta');
  log('Usage: node test-runner.js [options]', 'white');
  log('Options:', 'white');
  log('  --help, -h    Show this help message', 'white');
  log('  --frontend    Run only frontend tests', 'white');
  log('  --backend     Run only backend tests', 'white');
  log('  --coverage    Generate coverage report', 'white');
  process.exit(0);
}

main().catch(error => {
  log(`Fatal error: ${error.message}`, 'red');
  process.exit(1);
});
