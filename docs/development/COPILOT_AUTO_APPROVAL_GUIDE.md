# VS Code Settings for GitHub Copilot Auto-Approval

## Global User Settings (settings.json)

To configure Copilot for auto-approval globally, add these settings to your VS Code user settings:

**Windows:** `%APPDATA%\Code\User\settings.json`
**Mac:** `~/Library/Application Support/Code/User/settings.json`
**Linux:** `~/.config/Code/User/settings.json`

```json
{
  // GitHub Copilot Auto-Approval Settings
  "github.copilot.enable": {
    "*": true,
    "yaml": true,
    "plaintext": true,
    "markdown": true
  },
  
  // Copilot Chat Auto-Approval for Terminal Commands
  "github.copilot.chat.followups": "always",
  "github.copilot.chat.localeOverride": "en",
  "github.copilot.chat.useProjectTemplates": true,
  
  // Terminal Settings for Smoother Experience
  "terminal.integrated.confirmOnExit": "never",
  "terminal.integrated.confirmOnKill": "never",
  "terminal.integrated.enableMultiLinePasteWarning": "never",
  "terminal.integrated.allowChords": false,
  
  // Task Auto-Execution
  "task.autoDetect": "on",
  "task.saveBeforeRun": "always",
  "task.slowProviderWarning": false,
  
  // Security Settings (Use with caution)
  "security.workspace.trust.untrustedFiles": "open",
  "security.workspace.trust.banner": "never",
  "security.workspace.trust.startupPrompt": "never",
  "security.workspace.trust.emptyWindow": false,
  
  // Auto-approve common safe commands
  "terminal.integrated.commandsToSkipShell": [
    "npm test",
    "npm run test:all",
    "npm run test:frontend",
    "npm run test:backend",
    "npm run test:coverage",
    "npm install",
    "npm start",
    "npm run build",
    "npm run lint",
    "git status",
    "git add",
    "git commit",
    "git push"
  ]
}
```

## Command Palette Settings

You can also configure VS Code to automatically accept certain commands:

1. **Open Command Palette** (`Ctrl+Shift+P` or `Cmd+Shift+P`)
2. **Type:** `Preferences: Open Settings (UI)`
3. **Search for:** `copilot`
4. **Configure:**
   - Enable Copilot for all file types
   - Set up auto-suggestions
   - Configure chat preferences

## Keyboard Shortcuts for Quick Test Execution

Add these to your `keybindings.json` for instant test running:

```json
[
  {
    "key": "ctrl+shift+t",
    "command": "workbench.action.tasks.runTask",
    "args": "Run All Tests"
  },
  {
    "key": "ctrl+shift+alt+t",
    "command": "workbench.action.tasks.runTask",
    "args": "Run Tests with Coverage"
  },
  {
    "key": "ctrl+shift+f",
    "command": "workbench.action.tasks.runTask",
    "args": "Run Frontend Tests"
  },
  {
    "key": "ctrl+shift+b",
    "command": "workbench.action.tasks.runTask",
    "args": "Run Backend Tests"
  }
]
```

## Extensions for Enhanced Auto-Approval

Install these extensions for better terminal and task automation:

- **Task Explorer** (`ms-vscode.vscode-tasks`)
- **Terminal Tabs** (`Tyriar.vscode-terminal-tabs`)
- **Auto Run Command** (`formulahendry.auto-run-command`)

## Important Security Note

⚠️ **Be cautious with auto-approval settings, especially:**
- `security.workspace.trust.*` settings
- `terminal.integrated.commandsToSkipShell`
- Only add commands you trust completely

## Recommended Workflow

1. **Start with conservative settings** - Only auto-approve test commands
2. **Gradually add more commands** as you become comfortable
3. **Review regularly** - Remove commands you no longer use
4. **Use workspace-specific settings** for project-specific commands

## Testing the Configuration

After applying these settings, test with:

```powershell
# These should run without confirmation prompts
npm test -- --watchAll=false
npm run test:coverage
npm run lint

# For PowerShell (Windows): Use semicolon (;) instead of && for command chaining
npm test -- --watchAll=false; npm run lint

# Or run commands separately (recommended for PowerShell)
npm test -- --watchAll=false
npm run lint
```

**Important for Windows/PowerShell users:**
- `&&` is NOT supported in PowerShell
- Use `;` for command chaining
- Or run commands on separate lines for better reliability

## Alternative: Use Tasks Instead

For maximum control, use VS Code Tasks instead of direct terminal commands:

1. Use `Ctrl+Shift+P` → "Tasks: Run Task"
2. Select your predefined task
3. Tasks run with less security prompts than direct terminal commands

This approach gives you the automation you want while maintaining security.
