# GitHub Copilot Instructions for Discord Clone Chat App

## 🚨 CRITICAL: ALWAYS RUN TESTS AFTER CODE CHANGES 🚨

**MANDATORY TESTING WORKFLOW:**
1. **Before making any code changes** - Run existing tests to ensure baseline
2. **After implementing any feature** - Run tests to verify functionality
3. **After fixing any bug** - Run tests to ensure fix works and doesn't break existing code
4. **Before committing code** - Run full test suite with coverage

**Quick Test Commands:**
```powershell
# Frontend tests (MUST run after any frontend change)
cd frontend; npm test -- --watchAll=false

# Backend tests (MUST run after any backend change)
cd backend; npm test

# Full test suite with coverage
npm run test:all

# IMPORTANT FOR WINDOWS/POWERSHELL:
# Use semicolon (;) instead of && for command chaining
# OR run commands separately for better reliability
```

## Project Overview
This is a Discord-clone chat application built with Node.js/Express backend and React frontend, using Firebase for authentication and real-time features. The app includes mock data systems for development and demo modes.

## Development Guidelines

### 1. Code Quality Standards
- **Always run tests after making code changes**
- Use TypeScript-style JSDoc comments for better IntelliSense
- Follow React best practices (hooks, functional components)
- Implement error handling and loading states
- Use proper prop validation and default values
- Follow consistent naming conventions (camelCase for variables, PascalCase for components)

### 2. Testing Requirements
**CRITICAL: Run tests after every code change**

#### Available Test Scripts:
```powershell
# Frontend tests
cd frontend
npm test -- --watchAll=false           # Run once
npm test                               # Watch mode
npm run test:coverage                  # With coverage report

# Backend tests
cd backend
npm test                               # Run backend tests

# Root level unified scripts
npm run test:all                       # Run all tests (frontend + backend)
npm run test:frontend                  # Frontend tests only
npm run test:backend                   # Backend tests only
npm run test:coverage                  # All tests with coverage

# Run specific test files
npm test -- --testPathPattern=ComponentName
npm test -- --testNamePattern="should render"

# WINDOWS/POWERSHELL SYNTAX NOTES:
# ❌ DON'T USE: cd frontend && npm test (not supported)
# ✅ USE INSTEAD: cd frontend; npm test
# ✅ OR BETTER: Run commands separately
```

#### VS Code Integration:
- Use **Ctrl+Shift+P** → "Tasks: Run Task" → "Run All Tests"
- Use **Ctrl+Shift+P** → "Tasks: Run Task" → "Run Tests with Coverage"
- Pre-commit hooks will automatically run tests before commits
- VS Code settings configured to run tests on save (when enabled)

#### Test-Driven Development Cycle:
1. 🔴 **Red**: Write a failing test that describes the desired behavior
2. 🟢 **Green**: Write the minimum code to make the test pass
3. 🔵 **Refactor**: Improve the code while keeping tests passing
4. 🔄 **Repeat**: Continue the cycle for each new feature/change

#### Testing Checklist for Every Change:
- [ ] Tests pass before starting (baseline verification)
- [ ] New tests written for new functionality
- [ ] Edge cases covered (empty data, errors, loading states)
- [ ] Integration tests updated if components interact differently
- [ ] Coverage maintained or improved
- [ ] No existing tests broken by changes

### 3. File Structure Conventions

#### Frontend (`/frontend/src/`)
```
components/
  auth/           # Authentication components
  chat/           # Chat-related components
  common/         # Reusable UI components
  debug/          # Development/demo components
config/           # API configuration
contexts/         # React contexts
hooks/            # Custom React hooks
mocks/            # Mock data and utilities
pages/            # Page components
utils/            # Utility functions
```

#### Backend (`/backend/src/`)
```
controllers/      # Route handlers
middleware/       # Express middleware
models/           # Data models
routes/           # API routes
services/         # Business logic services
utils/            # Utility functions
```

### 4. Mock Data System
- Use `mockChannels` from `/frontend/src/mocks/channelData.js` for base data
- Use `generateRandomChannels()` for dynamic data generation
- Use `channelTemplates` for quick channel creation
- Use `useAdvancedMockChannels` hook for complex mock data management
- Use `MockChannelManager` for advanced pagination and filtering

### 5. Component Development Pattern

#### When creating new components:
1. Create the component file
2. **Write tests first** (Test-Driven Development)
3. Implement the component
4. **Run tests to verify functionality**
5. Add proper TypeScript/PropTypes if needed
6. Update parent components to use the new component
7. **Run tests again after integration**

#### Example Component Template:
```javascript
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * ComponentName - Brief description
 * @param {Object} props - Component props
 * @param {string} props.title - Title prop
 */
const ComponentName = ({ title, onAction }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Your component logic here

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="component-container">
      {/* Your JSX here */}
    </div>
  );
};

ComponentName.propTypes = {
  title: PropTypes.string.isRequired,
  onAction: PropTypes.func
};

ComponentName.defaultProps = {
  onAction: () => {}
};

export default ComponentName;
```

### 6. API Integration Guidelines
- Use `apiEndpoints` from `/frontend/src/config/api.js`
- Implement proper error handling with try-catch
- Use loading states during API calls
- Implement fallback to demo/mock data when authentication fails
- Use React Query for data fetching when possible

### 7. Testing Guidelines

#### Frontend Testing:
```javascript
// Use React Testing Library
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { jest } from '@jest/globals';

// Mock external dependencies
jest.mock('../hooks/useAuth');
jest.mock('../config/api');

// Test component rendering, user interactions, and state changes
describe('ComponentName', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('should handle user interactions', async () => {
    render(<ComponentName />);
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(mockFunction).toHaveBeenCalled();
    });
  });
});
```

#### Test Categories to Cover:
- **Component rendering** - Does it render without crashing?
- **User interactions** - Click, input, form submission
- **State management** - Loading, error, success states
- **API integration** - Mock API calls and responses
- **Edge cases** - Empty data, errors, network failures
- **Accessibility** - Screen reader support, keyboard navigation

#### Common Testing Patterns:
```javascript
// Mock Firebase/Auth context
const mockAuthContext = {
  user: { uid: 'test-user', email: 'test@example.com' },
  login: jest.fn(),
  logout: jest.fn(),
  loading: false
};

// Mock API calls
jest.mock('../config/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  apiEndpoints: {
    channels: '/api/channels',
    messages: '/api/messages'
  }
}));

// Test async operations
it('should handle async data loading', async () => {
  const mockData = [{ id: 1, name: 'Test Channel' }];
  api.get.mockResolvedValue({ data: mockData });
  
  render(<ChannelList />);
  
  await waitFor(() => {
    expect(screen.getByText('Test Channel')).toBeInTheDocument();
  });
});

// Test error states
it('should display error message on API failure', async () => {
  api.get.mockRejectedValue(new Error('API Error'));
  
  render(<ChannelList />);
  
  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
```

#### Debugging Test Issues:
- **Use `screen.debug()`** to see current DOM state
- **Use `getAllByText()` instead of `getByText()`** when multiple elements have same text
- **Use `findBy*` queries** for elements that appear asynchronously
- **Check `act()` warnings** and wrap state updates properly
- **Mock external dependencies** (Firebase, API calls, timers)
- **Use `waitFor()` for async operations** instead of arbitrary timeouts

### 8. Automated Testing Workflow

#### Pre-commit Hook Setup:
Pre-commit hooks are configured in `.git/hooks/pre-commit` and `.git/hooks/pre-commit.ps1` to:
- Run linting checks
- Execute full test suite
- Generate coverage reports
- Prevent commits if tests fail

#### VS Code Tasks Available:
Access via **Ctrl+Shift+P** → "Tasks: Run Task":
- **"Run All Tests"** - Execute frontend and backend tests
- **"Run Tests with Coverage"** - Generate coverage reports
- **"Run Frontend Tests"** - Frontend tests only
- **"Run Backend Tests"** - Backend tests only
- **"Start Dev Servers"** - Start both frontend and backend
- **"Build Frontend"** - Production build
- **"Lint and Fix"** - Run ESLint with auto-fix

#### VS Code Settings Configured:
- Format on save enabled
- ESLint auto-fix on save
- Test files associated with Jest runner
- Problems panel integration for test failures
- Auto-save triggers test runs (when enabled)

#### Test Runner Script:
A centralized test runner (`test-runner.js`) provides:
- Unified test execution across frontend/backend
- Coverage report generation
- Test result summarization
- Exit code handling for CI/CD

```json
// package.json scripts for unified testing
{
  "scripts": {
    "test": "node test-runner.js",
    "test:all": "node test-runner.js --all",
    "test:frontend": "cd frontend && npm test -- --watchAll=false",
    "test:backend": "cd backend && npm test",
    "test:coverage": "node test-runner.js --coverage",
    "precommit": "npm run test:all && npm run lint"
  }
}
```

#### GitHub Actions Integration Ready:
The project is set up for CI/CD with:
- Test scripts that work in both local and CI environments
- Coverage reporting compatible with GitHub Actions
- Proper exit codes for build pipeline integration

### 9. Development Workflow

#### For every new feature:
1. **Create feature branch** from main
2. **Write tests first** (Red phase of TDD)
3. **Implement minimum code** to pass tests (Green phase)
4. **Refactor and optimize** (Refactor phase)
5. **Run all tests** to ensure nothing is broken
6. **Update documentation** if needed
7. **Create pull request** with test results

#### For bug fixes:
1. **Create a test that reproduces the bug**
2. **Verify the test fails** (confirming the bug)
3. **Fix the bug** with minimal code changes
4. **Verify the test passes** and no other tests break
5. **Add additional tests** for edge cases

### 10. Mock Data Development

#### When adding new mock data:
```javascript
// Always provide realistic, varied data
const mockChannels = [
  {
    id: 'unique-id',
    name: 'channel-name',
    type: 'text', // or 'voice', 'music'
    description: 'Descriptive text with emoji 🎮',
    category: 'General', // Use consistent categories
    memberCount: 42,
    isPublic: true,
    botEnabled: false,
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2025-07-06T15:30:00Z',
    // ... other properties
  }
];
```

### 11. Error Handling Patterns

#### Frontend Error Handling:
```javascript
const handleAsyncAction = async () => {
  try {
    setLoading(true);
    setError(null);
    const result = await apiCall();
    setData(result);
  } catch (error) {
    console.error('Action failed:', error);
    setError(error.message || 'An unexpected error occurred');
    // Optionally show toast notification
    toast.error('Action failed. Please try again.');
  } finally {
    setLoading(false);
  }
};
```

#### Backend Error Handling:
```javascript
const routeHandler = async (req, res) => {
  try {
    const result = await service.performAction(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Route error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};
```

### 12. Performance Considerations
- Use `React.memo` for components that receive stable props
- Implement `useMemo` and `useCallback` for expensive computations
- Use pagination for large data sets
- Implement virtual scrolling for long lists
- Optimize images and assets

### 13. Accessibility Requirements
- Use semantic HTML elements
- Add proper ARIA labels and roles
- Ensure keyboard navigation works
- Maintain color contrast ratios
- Add alt text for images
- Use proper heading hierarchy

### 14. Code Review Checklist
- [ ] Tests are written and passing
- [ ] Code follows project conventions
- [ ] Error handling is implemented
- [ ] Loading states are handled
- [ ] Accessibility considerations are met
- [ ] Performance implications are considered
- [ ] Documentation is updated if needed

## Quick Commands Reference

```bash
# Start development servers
npm run dev          # Start both frontend and backend
cd frontend && npm start  # Frontend only
cd backend && npm start   # Backend only

# Testing
npm test                              # Run tests in watch mode
npm test -- --watchAll=false         # Run tests once
npm test -- --testPathPattern=MyComponent  # Run specific tests
npm run test:coverage                 # Run tests with coverage

# Building
npm run build                         # Build for production
npm run build:analyze                 # Analyze bundle size

# Linting
npm run lint                          # Run ESLint
npm run lint:fix                      # Fix linting issues
```

## Important Notes for Copilot

### 🔥 TESTING MANDATE 🔥
**EVERY CODE SUGGESTION MUST INCLUDE TESTING INSTRUCTIONS**

When suggesting code changes, ALWAYS include:
1. **Test commands to run** after implementing the change
2. **Expected test outcomes** (what should pass/fail)
3. **New tests to write** if adding functionality
4. **Test debugging tips** if tests might fail

### When to Run Tests:
- **Before starting work** - Verify baseline (`npm run test:all`)
- **After adding a component** - Test component rendering and behavior
- **After modifying hooks** - Test hook functionality and side effects
- **After changing API integration** - Test API calls and error handling
- **After fixing bugs** - Verify fix works and doesn't break existing code
- **Before code review** - Ensure all tests pass with coverage
- **After merging branches** - Verify integration hasn't broken anything

### Test Failure Recovery:
If tests fail after your changes:
1. **Read the error message carefully** - Jest provides detailed failure info
2. **Check if mocks need updating** - API changes might require mock updates
3. **Verify component props** - Props might have changed in parent components
4. **Use `screen.debug()`** to inspect rendered DOM
5. **Check async operations** - Use `waitFor()` for async state changes
6. **Update snapshots only if intentional** - `npm test -- --updateSnapshot`

### Code Quality Gates:
- **No commits without passing tests** - Pre-commit hooks enforce this
- **Coverage should not decrease** - Maintain or improve test coverage
- **New features require new tests** - Test-driven development is mandatory
- **Bug fixes require regression tests** - Prevent the same bug from recurring

1. **Always suggest running tests after code changes**
2. **Prioritize test-driven development approach**
3. **Consider mock data integration for new features**
4. **Implement proper error handling and loading states**
5. **Follow React best practices and hooks patterns**
6. **Use the existing component and utility patterns**
7. **Maintain consistency with project structure**

Remember: **Testing is not optional** - it's a core part of the development process for this project.

## VS Code Configuration for Automated Testing

### Auto-Approval Settings
This workspace is configured for streamlined testing with minimal prompts:

- **Terminal commands auto-approved** for common test/build operations
- **Task execution enabled** without confirmation dialogs
- **Security settings adjusted** for trusted workspace operations
- **Pre-commit hooks integrated** with VS Code tasks

### Quick Test Execution
Use these keyboard shortcuts for instant test running:
- `Ctrl+Shift+T` - Run All Tests
- `Ctrl+Shift+Alt+T` - Run Tests with Coverage
- `Ctrl+Shift+F` - Run Frontend Tests
- `Ctrl+Shift+B` - Run Backend Tests

### Command Palette Integration
Access via `Ctrl+Shift+P` → "Tasks: Run Task":
- Tasks run with minimal security prompts
- Pre-configured for common development workflows
- Integrated with VS Code's Problems panel for error reporting

### Auto-Approval Configuration
See `COPILOT_AUTO_APPROVAL_GUIDE.md` for:
- Global VS Code settings configuration
- Security considerations and best practices
- Keyboard shortcuts and task automation
- Extension recommendations for enhanced workflow

### 🪟 Windows PowerShell Syntax Guide

**IMPORTANT: This project uses PowerShell as the default terminal on Windows**

#### Command Chaining Syntax:
```powershell
# ❌ WRONG - && is NOT supported in PowerShell
cd frontend && npm test

# ✅ CORRECT - Use semicolon (;) for command chaining
cd frontend; npm test

# ✅ BEST PRACTICE - Run commands separately
cd frontend
npm test

# ✅ ALTERNATIVE - Use cmd if you need && syntax
cmd /c "cd frontend && npm test"
```

#### PowerShell vs Bash Differences:
| Task | Bash/Linux | PowerShell/Windows |
|------|------------|-------------------|
| Change directory + run | `cd dir && command` | `cd dir; command` |
| Multiple commands | `cmd1 && cmd2 && cmd3` | `cmd1; cmd2; cmd3` |
| Conditional execution | `test && success` | `if (test) { success }` |
| Background process | `command &` | `Start-Job { command }` |

#### Recommended PowerShell Commands for Testing:
```powershell
# Navigate and test (single line)
Set-Location frontend; npm test -- --watchAll=false

# Or use the cleaner approach (separate lines)
Set-Location frontend
npm test -- --watchAll=false

# Return to root and test backend
Set-Location ..
Set-Location backend
npm test
```
