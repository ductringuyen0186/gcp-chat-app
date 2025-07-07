# Discord Clone Chat App - Testing & Development Guide

## 🧪 Testing Strategy

This project follows a **Test-Driven Development (TDD)** approach with automated testing after every code change.

### Quick Testing Commands

```bash
# Run all tests (frontend + backend)
npm test

# Run only frontend tests
npm run test:frontend

# Run only backend tests
npm run test:backend

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode (for development)
npm run test:watch

# Run specific test file
cd frontend && npm test -- --testPathPattern=ComponentName
```

### Automated Testing Setup

1. **VS Code Tasks**: Use `Ctrl+Shift+P` → "Tasks: Run Task" → "Run All Frontend Tests"
2. **Pre-commit Hooks**: Tests automatically run before each commit
3. **Watch Mode**: Tests can run automatically when files change

### Test Coverage Goals

- **Frontend Components**: 90%+ coverage
- **Hooks and Utilities**: 95%+ coverage
- **API Integration**: 85%+ coverage
- **Mock Data Systems**: 100% coverage

## 🏗️ Development Workflow

### 1. Before Making Changes
```bash
# Ensure all tests pass
npm test

# Start development servers
npm run dev
```

### 2. Making Changes (TDD Approach)
```bash
# 1. Write failing test
# 2. Run tests to confirm failure
npm test

# 3. Write minimal code to pass test
# 4. Run tests to confirm pass
npm test

# 5. Refactor and optimize
# 6. Run tests again
npm test
```

### 3. After Making Changes
```bash
# Run all tests
npm test

# Check test coverage
npm run test:coverage

# Fix any linting issues
npm run lint:fix

# Test the app manually
npm run dev
```

## 📁 Project Structure

```
discord-clone-chat-app/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── auth/        # Authentication components
│   │   │   ├── chat/        # Chat components
│   │   │   ├── common/      # Reusable components
│   │   │   └── debug/       # Development/demo components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── mocks/           # Mock data and utilities
│   │   ├── pages/           # Page components
│   │   ├── contexts/        # React contexts
│   │   ├── config/          # Configuration files
│   │   └── utils/           # Utility functions
│   ├── public/              # Static assets
│   └── package.json
├── backend/                  # Node.js backend
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # Express middleware
│   │   ├── models/          # Data models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   └── utils/           # Utility functions
│   └── package.json
├── .vscode/                  # VS Code configuration
│   ├── tasks.json           # Automated tasks
│   ├── launch.json          # Debug configuration
│   └── settings.json        # Editor settings
├── test-runner.js           # Comprehensive test runner
├── COPILOT_INSTRUCTIONS.md  # Development guidelines
└── package.json             # Root package configuration
```

## 🧪 Testing Features

### Frontend Testing
- **Component Testing**: React Testing Library
- **Hook Testing**: Custom hooks with mock data
- **Integration Testing**: API calls and state management
- **Mock Data Testing**: Channel creation, pagination, filtering

### Backend Testing
- **API Endpoint Testing**: Express routes and middleware
- **Mock Data Generation**: Dynamic channel creation
- **Error Handling Testing**: Various failure scenarios

### Mock Data System
- **Base Mock Data**: 12 predefined channels with realistic data
- **Dynamic Generation**: Random channel creation with varied properties
- **Template System**: Quick channel creation from templates
- **Advanced Features**: Pagination, filtering, search, statistics

## 🚀 Getting Started

### Prerequisites
- Node.js 14+
- npm 6+

### Installation
```bash
# Install all dependencies
npm run install:all

# Or install individually
npm install                 # Root dependencies
cd frontend && npm install  # Frontend dependencies
cd ../backend && npm install # Backend dependencies
```

### Running the App
```bash
# Start both frontend and backend
npm start
# or
npm run dev

# Start individually
npm run start:frontend  # React dev server (http://localhost:3000)
npm run start:backend   # Node.js server (http://localhost:5000)
```

### Testing the App
```bash
# Run comprehensive test suite
npm test

# Run with coverage report
npm run test:coverage

# Test specific component
cd frontend && npm test -- --testPathPattern=ChatPage
```

## 🔧 VS Code Integration

### Recommended Extensions
- Jest Runner
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- Auto Rename Tag
- Bracket Pair Colorizer

### Built-in Tasks
- `Ctrl+Shift+P` → "Tasks: Run Task" → Choose from:
  - Run All Frontend Tests
  - Run Frontend Tests with Coverage
  - Run Specific Test File
  - Start Frontend Dev Server
  - Start Backend Server
  - Start Both Servers
  - Test and Start

### Debugging
- `F5` to start debugging
- Choose from available debug configurations:
  - Debug Frontend
  - Debug Backend
  - Debug Tests
  - Debug Current Test File

## 📈 Coverage Reports

After running tests with coverage:
```bash
npm run test:coverage
```

Open `frontend/coverage/lcov-report/index.html` in your browser to view detailed coverage reports.

## 🎯 Testing Best Practices

1. **Write tests first** (TDD approach)
2. **Test behavior, not implementation**
3. **Use descriptive test names**
4. **Mock external dependencies**
5. **Test edge cases and error conditions**
6. **Keep tests simple and focused**
7. **Run tests frequently during development**

## 🛠️ Mock Data Features

### Channel Management
- Create, read, update, delete channels
- Pagination with configurable page sizes
- Search and filtering capabilities
- Category-based organization
- Statistics and analytics

### Demo Components
- `/mock-demo` - Basic mock data visualization
- `/advanced-demo` - Advanced channel management interface

### API Endpoints
- `GET /api/channels/demo` - Basic demo channels
- `GET /api/channels/demo/enhanced` - Advanced demo with pagination/filtering

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. **Write tests first**
4. Implement the feature
5. **Ensure all tests pass**
6. Submit a pull request

## 🐛 Troubleshooting

### Tests Not Running
```bash
# Check if dependencies are installed
npm run install:all

# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Coverage Issues
```bash
# Generate fresh coverage report
npm run test:coverage

# Check if coverage directory exists
ls -la frontend/coverage/
```

### Development Server Issues
```bash
# Kill any running processes
npx kill-port 3000 5000

# Start fresh
npm run dev
```

## 📋 Checklist for New Features

- [ ] Write tests first (TDD)
- [ ] Implement feature
- [ ] All tests pass
- [ ] Code coverage maintained
- [ ] Linting passes
- [ ] Manual testing complete
- [ ] Documentation updated
- [ ] Demo/mock data added if needed

Remember: **Testing is not optional** - it's an integral part of our development process!
