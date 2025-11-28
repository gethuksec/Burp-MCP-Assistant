# Changelog

All notable changes to the "Burp MCP Assistant" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
- `Ctrl+Shift+B P` - Toggle Proxy Intercept
- `Ctrl+Shift+B R` - Send to Repeater
- `Ctrl+Shift+B I` - Send to Intruder
- `Ctrl+Shift+B H` - Show History
- `Ctrl+Shift+B E` - URL Encode
- `Ctrl+Shift+B D` - URL Decode

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

## [Unreleased] - Phase 2 Planning

### Planned Features
- Complete 21 MCP tool integration
- WebSocket history tools
- Configuration management UI
- Editor integration (sync with Burp editors)
- AI-powered command parsing
- 100+ prompt templates
- Advanced history browser with filtering
- Request/Response viewer webview
- Export functionality (CSV, JSON, HAR)

---

## Development Milestones

### ✅ Phase 1: MVP (Completed)
- Core functionality
- Basic UI
- 10+ prompts
- Essential MCP tools

### 🚧 Phase 2: Enhanced Features (In Progress)
- Target: Q1 2025
- Full MCP tool suite
- AI integration
- Advanced UI components

### 📅 Phase 3: Advanced Capabilities
- Target: Q2 2025
- Visual workflow builder
- Team collaboration
- External integrations

### 📅 Phase 4: Polish & Optimization
- Target: Q3 2025
- Performance optimization
- Marketplace launch
- Video tutorials

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## Support

- GitHub Issues: https://github.com/gethuksec/burpMCP/issues
- Discussions: https://github.com/gethuksec/burpMCP/discussions

