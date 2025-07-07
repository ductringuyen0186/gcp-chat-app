# Development Documentation

This directory contains development guidelines, tools configuration, and project status documentation.

## 📚 Available Guides

### 🤖 [Copilot Instructions](COPILOT_INSTRUCTIONS.md)
**Perfect for:** GitHub Copilot development guidelines
- Complete development standards
- Testing requirements and workflows
- Code quality guidelines
- PowerShell syntax guide
- Component development patterns
- API integration guidelines

### ⚙️ [Copilot Auto-Approval Guide](COPILOT_AUTO_APPROVAL_GUIDE.md)
**Perfect for:** VS Code automation setup
- Auto-approval configuration
- Global VS Code settings
- Keyboard shortcuts
- Security considerations
- Testing workflow automation

### 📊 [Chat Functionality Status](CHAT_FUNCTIONALITY_STATUS.md)
**Perfect for:** Current implementation status
- Feature implementation progress
- Known issues and limitations
- Roadmap and future plans
- Technical debt tracking

## 🚨 Development Rules

### **MANDATORY TESTING WORKFLOW**
1. **Before making changes** - Run existing tests
2. **After implementing features** - Run tests to verify
3. **After fixing bugs** - Run tests to ensure fixes work
4. **Before committing** - Run full test suite with coverage

### **PowerShell Syntax (Windows)**
```powershell
# ❌ WRONG - && not supported
cd frontend && npm test

# ✅ CORRECT - Use semicolon
cd frontend; npm test

# ✅ BEST PRACTICE - Separate commands
cd frontend
npm test
```

## 🛠️ Development Tools

### **VS Code Integration**
- **Tasks configured** for testing and building
- **Auto-approval settings** for streamlined workflow
- **Keyboard shortcuts** for common operations
- **Pre-commit hooks** for automated testing

### **GitHub Copilot Configuration**
- **Development guidelines** for AI-assisted coding
- **Testing emphasis** in all suggestions
- **Code quality standards** enforcement
- **Project-specific patterns** and conventions

## 🔧 Quick Development Setup

1. **Read** [Copilot Instructions](COPILOT_INSTRUCTIONS.md)
2. **Configure** [Auto-Approval Settings](COPILOT_AUTO_APPROVAL_GUIDE.md)
3. **Check** [Project Status](CHAT_FUNCTIONALITY_STATUS.md)
4. **Start coding** with testing-first approach

## 📋 Development Standards

- **Test-Driven Development** - Write tests first
- **Code Quality** - ESLint, formatting, documentation
- **Error Handling** - Proper try-catch, loading states
- **Performance** - React.memo, useMemo, useCallback
- **Accessibility** - ARIA labels, keyboard navigation
- **Security** - Input validation, authentication

## 🔄 Development Workflow

### **For New Features**
1. Create feature branch
2. **Write tests first** (Red phase)
3. **Implement minimum code** (Green phase)
4. **Refactor and optimize** (Refactor phase)
5. **Run all tests** to ensure nothing breaks
6. Create pull request with test results

### **For Bug Fixes**
1. **Create test that reproduces bug**
2. **Verify test fails** (confirms bug exists)
3. **Fix the bug** with minimal changes
4. **Verify test passes** and no regressions
5. **Add additional tests** for edge cases

## 🚀 VS Code Features

### **Keyboard Shortcuts**
- `Ctrl+Shift+T` - Run All Tests
- `Ctrl+Shift+Alt+T` - Run Tests with Coverage
- `Ctrl+Shift+F` - Run Frontend Tests
- `Ctrl+Shift+B` - Run Backend Tests

### **Command Palette**
- `Ctrl+Shift+P` → "Tasks: Run Task"
- Pre-configured tasks for common operations
- Integrated with VS Code's Problems panel

### **Auto-Approval**
- Terminal commands auto-approved for trusted operations
- Task execution with minimal prompts
- Security settings optimized for development

## 🤝 Need Help?

- **New to the project?** Start with [Copilot Instructions](COPILOT_INSTRUCTIONS.md)
- **VS Code setup?** Check [Auto-Approval Guide](COPILOT_AUTO_APPROVAL_GUIDE.md)
- **Feature status?** Review [Chat Functionality Status](CHAT_FUNCTIONALITY_STATUS.md)
- **Testing issues?** See [testing documentation](../testing/)
- **Setup problems?** Check [setup guides](../setup/)
