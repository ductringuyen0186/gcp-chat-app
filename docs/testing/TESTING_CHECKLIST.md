# Testing Checklist for Every Code Change

## ✅ Before Making Changes
- [ ] Run baseline tests: `npm run test:all`
- [ ] Verify all tests pass before starting
- [ ] Check current test coverage

## ✅ While Developing
- [ ] Write tests first (TDD approach)
- [ ] Run relevant tests frequently: `npm test -- --testPathPattern=YourComponent`
- [ ] Use `screen.debug()` to inspect DOM when debugging
- [ ] Mock external dependencies (Firebase, API calls)

## ✅ After Implementing Changes
- [ ] Run all tests: `npm run test:all`
- [ ] Check test coverage: `npm run test:coverage`
- [ ] Verify no existing tests are broken
- [ ] Add tests for edge cases

## ✅ For New Components
- [ ] Test component renders without crashing
- [ ] Test all props and prop types
- [ ] Test user interactions (clicks, inputs)
- [ ] Test loading and error states
- [ ] Test accessibility features

## ✅ For API Changes
- [ ] Mock API responses in tests
- [ ] Test successful API calls
- [ ] Test API error handling
- [ ] Test loading states during API calls
- [ ] Update API integration tests

## ✅ For Bug Fixes
- [ ] Write test that reproduces the bug
- [ ] Verify test fails (confirms bug exists)
- [ ] Fix the bug
- [ ] Verify test passes
- [ ] Add regression tests

## ✅ Before Committing
- [ ] Run full test suite: `npm run test:all`
- [ ] Check test coverage hasn't decreased
- [ ] Run linting: `npm run lint`
- [ ] Verify pre-commit hooks are working

## ✅ VS Code Integration
- [ ] Use VS Code tasks for testing (Ctrl+Shift+P → "Tasks: Run Task")
- [ ] Check Problems panel for test failures
- [ ] Use Test Explorer for individual test runs

## Common Test Commands
```bash
# Essential commands to remember
npm run test:all              # Run all tests
npm run test:frontend         # Frontend tests only
npm run test:coverage         # Tests with coverage
npm test -- --testPathPattern=ComponentName  # Specific tests
```

## 🚨 Red Flags - Stop and Fix
- [ ] Any test failures
- [ ] Coverage below 80%
- [ ] Console errors or warnings
- [ ] Lint errors
- [ ] Missing tests for new functionality

## 🎯 Success Criteria
- [ ] All tests pass ✅
- [ ] Coverage maintained or improved ✅
- [ ] No lint errors ✅
- [ ] New functionality has tests ✅
- [ ] Edge cases are covered ✅

---

**Remember: No code change is complete without running tests!**
