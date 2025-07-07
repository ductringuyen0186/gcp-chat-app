# Testing Documentation

This directory contains comprehensive testing documentation for the Discord Clone Chat Application.

## 📚 Available Guides

### 🧪 [Testing Guide](TESTING_GUIDE.md)
**Perfect for:** Complete testing workflows
- Testing philosophy and approach
- Test-driven development guidelines
- Testing tools and setup
- Best practices

### 📖 [Test Commands Reference](TEST_COMMANDS_REFERENCE.md)
**Perfect for:** Quick command lookup
- Essential test commands
- PowerShell syntax (Windows users)
- VS Code integration
- Debugging test failures

### ✅ [Testing Checklist](TESTING_CHECKLIST.md)
**Perfect for:** Pre-commit verification
- Required testing steps
- Coverage requirements
- Quality gates
- Checklist format

### 📋 [Complete Testing Guide](COMPLETE_TESTING_GUIDE.md)
**Perfect for:** In-depth testing knowledge
- Advanced testing scenarios
- Integration testing
- Performance testing
- CI/CD integration

## 🚨 Critical Testing Rules

### **ALWAYS RUN TESTS AFTER CODE CHANGES**

```powershell
# Quick test commands
npm test                    # Run all tests
npm run test:frontend      # Frontend tests only
npm run test:backend       # Backend tests only
npm run test:coverage      # With coverage report
```

### **PowerShell Syntax (Windows)**
```powershell
# ❌ WRONG - Don't use &&
cd frontend && npm test

# ✅ CORRECT - Use semicolon
cd frontend; npm test

# ✅ BEST - Separate commands
cd frontend
npm test
```

## 🔧 Testing Tools

- **Jest** - Testing framework
- **React Testing Library** - React component testing
- **VS Code Tasks** - Integrated test running
- **Pre-commit Hooks** - Automated testing
- **Coverage Reports** - Test coverage analysis

## 🚀 Quick Start Testing

1. **Run all tests**: `npm test`
2. **Check coverage**: `npm run test:coverage`
3. **Fix any failures**: See [Test Commands Reference](TEST_COMMANDS_REFERENCE.md)
4. **Use VS Code tasks**: `Ctrl+Shift+P` → "Tasks: Run Task"

## 📊 Testing Standards

- **Minimum 80% coverage** for new code
- **All tests must pass** before commits
- **Test-driven development** preferred
- **Mock external dependencies** properly
- **Test edge cases** and error conditions

## 🔄 Testing Workflow

1. **Before coding**: Run existing tests to establish baseline
2. **During development**: Write tests first (TDD)
3. **After changes**: Run relevant tests
4. **Before commits**: Run full test suite
5. **After merging**: Verify integration tests

## 🤝 Need Help?

- **Test failures?** Check [Test Commands Reference](TEST_COMMANDS_REFERENCE.md)
- **Setup issues?** See [setup documentation](../setup/)
- **Development questions?** Review [development guides](../development/)
- **VS Code integration?** Check [Copilot Auto-Approval Guide](../development/COPILOT_AUTO_APPROVAL_GUIDE.md)
