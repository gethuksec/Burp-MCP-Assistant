# Changelog

All notable changes to the "Burp MCP Assistant" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2025-12-22

### Added

- **DevContainer Support**: Node.js 22 development environment with ESLint and Prettier pre-configured
- **Integration Tests**: Mock Burp server tests (`integration.test.ts`) for CI/CD pipelines
- **User Documentation**: Tutorial and API documentation in English and Indonesian
  - `docs/tutorial.md` / `docs/tutorial-id.md`
  - `docs/api-documentation.md` / `docs/api-documentation-id.md`
- **Pre-commit Hooks**: Husky + lint-staged for automated code quality checks
- **Workflow Engine**: Support for multi-step security testing workflows (e.g., API Audit)
- **Favorites System**: Save frequently used prompts for quick access
- **Search Filter**: Real-time filtering with category hierarchy preserved

### Changed

- **Prompt Library UI**: Migrated from Webview to native TreeView for better stability
  - Categories displayed as collapsible folders
  - Auto-expand categories during search
  - Single-click to copy prompt
  - Right-click context menu for add to favorites
- **Modular Prompt Library**: Refactored 2000+ lines of hardcoded prompts into 7 JSON files
  - `resources/prompts/input-validation.json`
  - `resources/prompts/auth-session.json`
  - `resources/prompts/authorization.json`
  - `resources/prompts/api-security.json`
  - `resources/prompts/crypto-encoding.json`
  - `resources/prompts/business-logic.json`
  - `resources/prompts/reporting-docs.json`
- **External HTML Templates**: `tools-reference.html` separated from TypeScript code
- **Prompt Count**: Now includes 100+ expert security testing templates (up from 10+)

### Removed

- **Webview UI**: Replaced with native TreeView (simpler, more stable)
- **insertAtCursor**: Removed in favor of copy-paste workflow

### Developer Experience

- **ESLint Configuration**: Added `.eslintrc.json` for TypeScript code quality
- **Unit Tests**: Added tests for PromptLibrary and HistoryManager
- **Dockerfile**: Updated to include unit test framework for DevContainer testing

## [0.1.1] - 2025-11-28

### Fixed

- **Connection to Burp MCP server** now uses correct `/messages` endpoint instead of `/mcp`
- Added SSE endpoint awareness (`/sse`) for compatibility with Burp's SSE-based MCP server
- Added health check before attempting MCP connection
- Added comprehensive debug logging to VS Code Debug Console
- Improved error messages with full response details for easier troubleshooting
- Fixed TypeScript type annotations for API responses

### Changed

- MCP client now uses `/messages` endpoint for direct request-response communication
- Added `tools/list` test call during connection to verify MCP server is working
- All operations now log detailed information to Debug Console with `[Burp MCP]` prefix
- Better error handling with specific error messages for common issues

### Technical Details

- Endpoint changed: `http://localhost:9876/mcp` → `http://localhost:9876/messages`
- Added SSE URL: `http://localhost:9876/sse` (for future streaming support)
- Connection test now calls `tools/list` to verify 21 Burp tools are available
- Logging format: `[Burp MCP] <message>` for easy filtering in console

## [0.1.0] - 2025-11-28

### Added - Phase 1 MVP Release

#### Core Features

- **MCP Client Implementation**: Full integration with Burp Suite MCP server via HTTP/SSE
- **Connection Management**: Auto-connect, reconnection with exponential backoff
- **Status Bar Integration**: Real-time connection, intercept, and engine status indicators

#### UI Components

- **Sidebar Panels**:
  - Connection status and management
  - Quick actions for common tasks
  - Prompt library browser
  - Command history viewer
- **Command Palette Integration**: All commands accessible via Ctrl+Shift+P
- **Context Menu**: Right-click encoding/decoding operations
- **Status Bar Indicators**: Connection status, intercept state, task engine state

#### MCP Tools (Phase 1)

- **HTTP Request Execution**:
  - `send_http1_request` - Send HTTP/1.1 requests
  - `send_http2_request` - Send HTTP/2 requests
  
- **Burp Tools Integration**:
  - `create_repeater_tab` - Create Repeater tabs
  - `send_to_intruder` - Send requests to Intruder
  
- **Encoding/Decoding Utilities**:
  - `url_encode` - URL encoding
  - `url_decode` - URL decoding
  - `base64_encode` - Base64 encoding
  - `base64_decode` - Base64 decoding
  - `generate_random_string` - Generate random strings
  
- **State Management**:
  - `set_proxy_intercept_state` - Toggle intercept
  - `set_task_execution_engine_state` - Control task engine
  
- **History & Monitoring**:
  - `get_proxy_http_history` - Fetch proxy history
  - `get_proxy_http_history_regex` - Search history with regex

#### Prompt Library

- **10+ Security Testing Templates**:
  - SQL Injection Testing
  - XSS Testing (Reflected)
  - Authentication Bypass
  - IDOR Testing
  - SSRF Testing
  - JWT Manipulation
  - Path Traversal
  - Command Injection
  - API Comprehensive Testing
  - Rate Limiting Testing

#### Commands

- `burpMCP.connect` - Connect to Burp Suite
- `burpMCP.disconnect` - Disconnect from Burp Suite
- `burpMCP.toggleIntercept` - Toggle proxy intercept
- `burpMCP.sendToRepeater` - Send to Repeater
- `burpMCP.sendToIntruder` - Send to Intruder
- `burpMCP.showHistory` - Show proxy history
- `burpMCP.urlEncode` - URL encode selection
- `burpMCP.urlDecode` - URL decode selection
- `burpMCP.base64Encode` - Base64 encode selection
- `burpMCP.base64Decode` - Base64 decode selection
- `burpMCP.sendRequest` - Send HTTP request (planned)
- `burpMCP.openPromptLibrary` - Open prompt library

#### Keyboard Shortcuts

- `Ctrl+Shift+B L` / `Cmd+Shift+B L` - Open Prompt Library
- `Ctrl+Shift+B S` / `Cmd+Shift+B S` - Search Prompts
- `Ctrl+Shift+B R` / `Cmd+Shift+B R` - Show Tools Reference

*(Use `Cmd` instead of `Ctrl` on macOS)*

#### Configuration Options

- Connection settings (host, port, timeout, auto-connect)
- UI preferences (status bar, notifications)
- Proxy settings (history limit)
- Security settings (sensitive data masking, patterns)

#### Documentation

- Comprehensive README with setup instructions
- Quick Start guide
- Legal disclaimer and usage warnings
- Troubleshooting section
- Example workflows
- Development roadmap

### Technical Details

- TypeScript-based implementation
- VS Code Extension API integration
- MCP SDK integration (@modelcontextprotocol/sdk)
- Event-driven architecture
- Persistent command history
- Error handling and retry logic

### Security

- Legal disclaimer on first launch
- Sensitive data masking support
- Configurable sensitive patterns
- Secure credential storage ready (for Phase 2)

### Known Limitations (Phase 1)

- WebSocket history tools not yet implemented (Phase 2)
- Configuration management UI pending (Phase 2)
- Editor integration pending (Phase 2)
- AI-powered workflows pending (Phase 2)
- HTTP request builder UI pending
- Full proxy history viewer pending

### Dependencies

- `@modelcontextprotocol/sdk`: ^0.5.0
- `axios`: ^1.6.2
- VS Code: ^1.85.0

---

## [Unreleased] - Phase 3 Planning

### Planned Features

- Webview-based Prompt Library UI (better UX)
- HTTP request/response formatting utilities
- Syntax highlighting for HTTP messages
- Visual workflow builder
- Custom prompt template creation UI
- Export/import functionality for templates

---

## Development Milestones

### ✅ Phase 1: MVP (Completed)

- Core functionality
- Basic UI
- 10+ prompts
- Essential MCP tools

### ✅ Phase 2: Code Quality & Refactoring (Completed)

- Modular prompt library (100+ templates)
- DevContainer support
- ESLint + pre-commit hooks
- User documentation (EN/ID)
- Integration tests

### 🚧 Phase 3: Enhanced UI & Features (In Progress)

- Webview Prompt Library
- HTTP formatting utilities
- Template management

### 📅 Phase 4: Polish & Optimization

- Visual workflow builder
- Team collaboration
- Performance optimization
- Marketplace launch

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## Support

- GitHub Issues: <https://github.com/gethuksec/burpMCP/issues>
- Discussions: <https://github.com/gethuksec/burpMCP/discussions>
