# Burp Suite MCP VS Code Extension - Implementation Plan

## Project Overview

Building a comprehensive VS Code extension that integrates Burp Suite's MCP (Model Context Protocol) tools, enabling security professionals to perform web application security testing directly from their code editor with AI-powered prompts.

## Legal & Ethics

**IMPORTANT DISCLAIMER**: This tool is designed exclusively for authorized security testing, penetration testing, and security research on systems you own or have explicit written permission to test. Unauthorized access to computer systems is illegal.

## Phase 0: Development Infrastructure ✅

**Status**: 🟢 Completed

### Phase 0: Tasks Completed ✅

1. ✅ DevContainer setup (Node.js 22, ESLint, Prettier)
2. ✅ Unit test framework (Mocha, @vscode/test-electron)
3. ✅ Test structure (`src/test/suite/`)

## Phase 1: Core Infrastructure

**Status**: 🟢 Completed

### Phase 1: Tasks Completed ✅

1. ✅ Project initialization and structure
2. ✅ Package.json with extension configuration
3. ✅ TypeScript configuration
4. ✅ Main extension.ts with activation logic
5. ✅ CommandRegistry implementation (6 commands)
6. ✅ PromptLibrary with 100+ security testing prompts
7. ✅ HistoryManager for command tracking
8. ✅ Legal disclaimer integration (README)

## Phase 2: Code Quality & Refactoring

**Status**: 🟢 Completed

### Proposed Changes

#### Modular Prompt Library ✅

- **Goal**: Move 2000+ lines of hardcoded prompts from `promptLibrary.ts` to modular JSON files.
- **Files**:
  - `[NEW]` [resources/prompts/input-validation.json](file:///Users/brndls/repos/github/brndls/Burp-MCP-Assistant/resources/prompts/input-validation.json)
  - `[NEW]` [resources/prompts/auth-session.json](file:///Users/brndls/repos/github/brndls/Burp-MCP-Assistant/resources/prompts/auth-session.json)
  - `[NEW]` [resources/prompts/authorization.json](file:///Users/brndls/repos/github/brndls/Burp-MCP-Assistant/resources/prompts/authorization.json)
  - `[NEW]` [resources/prompts/api-security.json](file:///Users/brndls/repos/github/brndls/Burp-MCP-Assistant/resources/prompts/api-security.json)
  - `[NEW]` [resources/prompts/crypto-encoding.json](file:///Users/brndls/repos/github/brndls/Burp-MCP-Assistant/resources/prompts/crypto-encoding.json)
  - `[NEW]` [resources/prompts/business-logic.json](file:///Users/brndls/repos/github/brndls/Burp-MCP-Assistant/resources/prompts/business-logic.json)
  - `[NEW]` [resources/prompts/reporting-docs.json](file:///Users/brndls/repos/github/brndls/Burp-MCP-Assistant/resources/prompts/reporting-docs.json)
  - `[MODIFY]` [src/prompts/promptLibrary.ts](file:///Users/brndls/repos/github/brndls/Burp-MCP-Assistant/src/prompts/promptLibrary.ts): Logic to load JSON files.

#### ESLint Configuration

- **Goal**: Standardize code style and catch bugs early.
- **Files**:
  - `[NEW]` [.eslintrc.json](file:///Users/brndls/repos/github/brndls/Burp-MCP-Assistant/.eslintrc.json): Rules for VS Code Extension + TypeScript.

#### External HTML Templates

- **Goal**: Separate logic from presentation.
- **Files**:
  - `[NEW]` [resources/tools-reference.html](file:///Users/brndls/repos/github/brndls/Burp-MCP-Assistant/resources/tools-reference.html)
  - `[MODIFY]` [src/commands/commandRegistry.ts](file:///Users/brndls/repos/github/brndls/Burp-MCP-Assistant/src/commands/commandRegistry.ts): Load HTML from file. ✅

#### Pre-commit Hooks

- **Goal**: Ensure only clean code is committed.
- **Tools**: Husky, lint-staged.
- **Action**: Run `eslint` on staged files.

### Tasks Remaining 📋

1. ✅ Refactor promptLibrary.ts ke JSON files (DRY)
2. ✅ Tambah ESLint config file (.eslintrc.json)
3. ✅ Pisahkan HTML templates dari TypeScript
4. ✅ Setup pre-commit hooks (Husky + lint-staged)

## Phase 3: Enhanced UI & Features

**Status**: ⚪ Not Started

### Tasks

1. Create webview for Prompt Library UI (better UX)
2. Create request/response formatting utilities
3. Add syntax highlighting for HTTP messages
4. Visual workflow builder
5. Custom prompt template creation UI
6. Export/import functionality for templates

## Phase 4: Testing & Documentation

**Status**: 🟢 Completed

### Phase 4: Tasks Completed ✅

1. ✅ Test infrastructure setup
2. ✅ Extension integration tests
3. ✅ PromptLibrary unit tests
4. ✅ HistoryManager unit tests
5. ✅ Run tests in DevContainer (Verified platform independence)
6. ✅ Integration tests with mock Burp server (Added `integration.test.ts`)
7. ✅ User documentation (Created `docs/tutorial.md` and `docs/tutorial-id.md`)
8. ✅ API documentation (Created `docs/api-documentation.md` and `docs/api-documentation-id.md`)

### Phase 4: Tasks Remaining 📋

(None)

## Current Focus

Starting Phase 3: Enhanced UI & Features

- **Next**: Create webview for Prompt Library UI
- **Then**: Formatting utilities & syntax highlighting

## Security Considerations

- Secure storage for API keys (VS Code SecretStorage)
- Input validation for all user inputs
- Sensitive data masking in logs
- HTTPS enforcement for remote connections
- Command confirmation for destructive operations

## Quick Start (Development)

```bash
# Option 1: DevContainer (Recommended)
# Open in VS Code → F1 → "Dev Containers: Reopen in Container"
# Auto-runs: npm install && npm run compile

# Option 2: Local
npm install
npm run compile
npm test
```

## Timeline Estimate

- ~~Phase 0: ~1 hour~~ ✅ Done
- ~~Phase 1: ~2-3 hours~~ ✅ Done
- Phase 2: ~2-3 hours
- Phase 3: ~4-5 hours
- Phase 4: ~2-3 hours
**Total**: ~8-11 hours remaining
