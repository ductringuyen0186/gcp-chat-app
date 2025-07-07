# Test Commands Quick Reference

## 🚨 ALWAYS RUN TESTS AFTER CODE CHANGES 🚨

### 🪟 IMPORTANT FOR WINDOWS USERS
**PowerShell does NOT support `&&` syntax. Use `;` or run commands separately!**

### Essential Test Commands

#### Frontend Tests
```powershell
# ❌ WRONG - Don't use && in PowerShell
cd frontend && npm test -- --watchAll=false

# ✅ CORRECT - Use semicolon (;) or separate commands
cd frontend; npm test -- --watchAll=false

# ✅ BEST PRACTICE - Run separately
cd frontend
npm test -- --watchAll=false

# Run tests in watch mode (during development)
cd frontend
npm test

# Run tests with coverage
cd frontend
npm run test:coverage

# Run specific test file
cd frontend
npm test -- --testPathPattern=ChatPage

# Run tests matching a name pattern
cd frontend
npm test -- --testNamePattern="should render"
```

#### Backend Tests
```powershell
# ✅ CORRECT PowerShell syntax
cd backend
npm test

# Run specific backend test file
cd backend
npm test -- --testPathPattern=channels
```

#### Unified Test Commands (from root directory)
```powershell
# Run all tests (frontend + backend)
npm run test:all

# Run frontend tests only
npm run test:frontend

# Run backend tests only
npm run test:backend

# Run with coverage report
npm run test:coverage
```

### VS Code Integration

#### VS Code Tasks (Ctrl+Shift+P → "Tasks: Run Task")
- **"Run All Tests"** - Execute all tests
- **"Run Tests with Coverage"** - Generate coverage reports
- **"Run Frontend Tests"** - Frontend only
- **"Run Backend Tests"** - Backend only

#### VS Code Test Explorer
- Use the Test Explorer panel to run individual tests
- Click the play button next to test names
- View test results inline

### Debugging Test Failures

#### Common Issues & Solutions
```bash
# Tests failing due to mock issues
npm test -- --clearCache

# Update snapshots (only if intentional changes)
npm test -- --updateSnapshot

# Run tests with verbose output
npm test -- --verbose

# Run tests without coverage (faster)
npm test -- --coverage=false
```

#### Debug Commands
```javascript
// Add to test files for debugging
console.log('Debug data:', data);
screen.debug(); // Shows current DOM state
screen.debug(screen.getByTestId('component')); // Debug specific element
```

### Test Development Workflow

#### For New Features
1. Write failing test first (Red phase)
2. Write minimal code to pass (Green phase)
3. Refactor while keeping tests passing (Refactor phase)
4. Run full test suite to ensure no regressions

#### For Bug Fixes
1. Write test that reproduces the bug
2. Verify test fails (confirms bug exists)
3. Fix the bug
4. Verify test passes
5. Run full test suite

### Pre-commit Testing

#### Automatic Testing
- Pre-commit hooks run tests automatically
- Commits are blocked if tests fail
- Coverage reports are generated

#### Manual Pre-commit Check
```bash
# Run the same checks as pre-commit hook
npm run test:all && npm run lint
```

### CI/CD Integration

#### GitHub Actions Ready
The project is configured for continuous integration:
- Tests run on every pull request
- Coverage reports are generated
- Build fails if tests fail

### Coverage Reports

#### View Coverage
```bash
# Generate coverage report
npm run test:coverage

# View coverage in browser
# Coverage report will be in coverage/lcov-report/index.html
```

#### Coverage Targets
- Statements: > 80%
- Branches: > 80%
- Functions: > 80%
- Lines: > 80%

### Test File Patterns

#### Test File Naming
- `ComponentName.test.js` - Component tests
- `hookName.test.js` - Hook tests
- `api.test.js` - API integration tests
- `utils.test.js` - Utility function tests

#### Test Structure
```javascript
describe('ComponentName', () => {
  beforeEach(() => {
    // Setup before each test
  });

  afterEach(() => {
    // Cleanup after each test
  });

  it('should render correctly', () => {
    // Test implementation
  });

  it('should handle user interactions', () => {
    // Test implementation
  });
});
```

### Emergency Test Commands

#### If Tests Are Completely Broken
```bash
# Clear all caches and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Jest cache
npm test -- --clearCache

# Reset to last known good state
git stash
git checkout main
npm install
npm run test:all
```

### 🪟 PowerShell Syntax Troubleshooting

#### Common PowerShell Errors and Solutions:
```powershell
# ❌ ERROR: "The token '&&' is not a valid statement separator"
cd frontend && npm test

# ✅ SOLUTION: Use semicolon instead
cd frontend; npm test

# ✅ OR BETTER: Use separate lines
cd frontend
npm test
```

#### PowerShell Command Alternatives:
```powershell
# Multiple commands with error handling
cd frontend
if ($?) { npm test -- --watchAll=false }

# Chain commands with conditional execution
cd frontend; if ($LASTEXITCODE -eq 0) { npm test }

# Use try-catch for robust error handling
try {
    Set-Location frontend
    npm test -- --watchAll=false
} catch {
    Write-Error "Failed to run tests: $_"
}
```

#### Useful PowerShell Aliases for Testing:
```powershell
# Add these to your PowerShell profile
function Test-Frontend { Set-Location frontend; npm test -- --watchAll=false }
function Test-Backend { Set-Location backend; npm test }
function Test-All { npm run test:all }

# Usage: Just type the function name
Test-Frontend
Test-Backend
Test-All
```

## Remember: Testing is NOT Optional! 🧪

Every code change should be accompanied by running tests to ensure:
- New functionality works as expected
- Existing functionality isn't broken
- Code quality is maintained
- Coverage targets are met
