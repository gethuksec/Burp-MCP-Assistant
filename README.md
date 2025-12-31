# 🎯 Burp MCP Assistant

Security testing prompts & workflows for Burp Suite MCP

![Version](https://img.shields.io/badge/version-0.2.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

Expert-crafted prompts and cheatsheet for penetration testing with Burp Suite via Model Context Protocol (MCP).

---

## ⚠️ LEGAL DISCLAIMER

**This extension is for AUTHORIZED security testing ONLY.**

- ✅ Only use on systems you own or have written permission to test
- ❌ Unauthorized access to computer systems is ILLEGAL
- ⚠️ Follow responsible disclosure practices
- 📋 Comply with all applicable laws and regulations

**By using this extension, you agree to use it responsibly and legally.**

---

## 🎯 What is This?

Burp MCP Assistant is a **prompt library and cheatsheet** that helps you perform security testing 10x faster using Burp Suite with AI assistants like Cursor.

### NOT a Connection Tool

This extension **does NOT** connect to Burp Suite directly. Instead, it provides:

- 📚 **100+ Expert Prompts** for security testing
- 🎯 **Quick Reference** for all 21 Burp MCP tools  
- 📋 **Copy-paste Templates** for common attacks
- 🔍 **Search & Filter** by vulnerability type
- 📊 **Workflow Templates** for complete audits

### How It Works

1. You configure **Cursor** to connect to Burp Suite (one-time setup)
2. You browse prompts in **this extension** (sidebar)
3. You copy/paste prompts into **Cursor Chat**
4. **Cursor AI** uses Burp tools to execute security tests
5. You get results without managing connections! ✨

---

## 🚀 Quick Start

### Step 1: Setup Burp Suite MCP Server (One Time)

1. **Install Burp MCP Extension** in Burp Suite

   ```bash
   git clone https://github.com/portswigger/mcp-server.git
   cd mcp-server
   ./gradlew embedProxyJar
   ```

2. **Load into Burp Suite**
   - Extensions → Add → Java → Select `build/libs/burp-mcp-all.jar`
   - MCP tab → Enable ✅

### Step 2: Configure Cursor / AntiGravity (One Time)

Add to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "Burp MCP": {
      "command": "<java path>",
      "args": [
        "-jar",
        "<jar path>",
        "--sse-url",
        "<mcp server>"
      ],
      "disabled": false
    }
  }
}
```

Example

```json
{
  "mcpServers": {
    "Burp MCP": {
      "command": "java",
      "args": [
        "-jar",
        "D:/mcp-demo/mcp-proxy.jar",
        "--sse-url",
        "http://127.0.0.1:9876"
      ]
    }
  }
}
```

**Restart Cursor** after adding this configuration.

### Step 3: Install This Extension

Install "Burp MCP Assistant" from VS Code marketplace or from source:

```bash
git clone https://github.com/gethuksec/burpMCP.git
cd burpMCP
npm install
npm run compile
```

### Step 4: Start Testing! 🎉

1. Open Burp MCP Assistant sidebar in Cursor
2. Browse prompt categories
3. Click to copy prompt
4. Paste in Cursor Chat
5. Watch AI execute security tests!

---

## 🎨 Features

### 📚 Prompt Library

**100+ Expert Templates** organized by category:

- Input Validation (SQLi, XSS, SSRF, Command Injection, etc.)
- Authentication & Session (Bypass, JWT, Session Fixation, etc.)
- Authorization & Access Control (IDOR, Privilege Escalation, etc.)
- API Security (REST, GraphQL, Rate Limiting, etc.)
- Encoding & Cryptography (Hash Cracking, Encoding Chains, etc.)
- Business Logic (Race Conditions, Payment Manipulation, etc.)
- Reporting & Documentation (PoC Generation, Evidence Collection, etc.)

### 🔍 Quick Reference

**All 21 Burp MCP Tools** documented:

- Tool name, parameters, examples
- Common usage patterns
- Best practices
- Tips & tricks

### ⚡ Productivity Features

- **Copy to Clipboard** - One-click copy
- **Insert at Cursor** - Auto-insert into editor
- **Search & Filter** - Find prompts by tags/keywords
- **Recently Used** - Quick access to favorite prompts
- **Keyboard Shortcuts** - Work without mouse

---

## 📖 Usage Examples

### Example 1: SQL Injection Testing

```markdown
1. Open sidebar → "Input Validation" → "SQL Injection Basic Test"
2. Click "Copy Prompt"
3. In Cursor Chat:
   
   User: [Paste prompt]
   Test https://example.com/api/users?id=1 for SQL injection

   Cursor AI: [Uses Burp MCP tools]
   - Sends test payloads
   - Analyzes responses
   - Reports vulnerabilities

4. Get comprehensive results!
```

### Example 2: API Security Audit

```markdown
1. Sidebar → "API Security" → "Comprehensive API Test"
2. Copy prompt
3. Cursor Chat:
   
   User: [Paste prompt]
   Audit /api/v1/users endpoint for security issues

   Cursor AI:
   - Tests authentication bypass
   - Tests authorization
   - Fuzzes parameters
   - Tests rate limiting
   - Generates report

5. Complete API security audit done!
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+B L` | Open Prompt Library |
| `Ctrl+Shift+B S` | Search Prompts |
| `Ctrl+Shift+B R` | Show Tools Reference |

*(Mac: `Cmd` instead of `Ctrl`)*

---

## 🎯 Prompt Categories

### Input Validation

- SQL Injection (Basic, Blind, Time-based, Error-based)
- Cross-Site Scripting (Reflected, Stored, DOM-based)
- SSRF (Server-Side Request Forgery)
- Command Injection (OS, Code Injection)
- XML External Entity (XXE)
- Path Traversal / LFI
- Template Injection
- LDAP Injection

### Authentication & Session

- Authentication Bypass
- Brute Force / Credential Stuffing
- Session Fixation
- Session Hijacking
- JWT Vulnerabilities
- OAuth Flaws
- 2FA Bypass
- Password Reset Flaws

### Authorization & Access Control

- IDOR (Insecure Direct Object Reference)
- Privilege Escalation (Horizontal, Vertical)
- Forced Browsing
- Missing Function Level Access Control
- CORS Misconfiguration

### API Security

- REST API Testing
- GraphQL Security
- SOAP Testing
- API Rate Limiting
- Mass Assignment
- API Version Control Issues
- Excessive Data Exposure

### Encoding & Cryptography

- URL Encoding/Decoding
- Base64 Operations
- Hash Identification
- Encryption Testing
- Token Generation
- Encoding Chains

### Business Logic

- Race Conditions
- Payment Manipulation
- Workflow Bypass
- Logic Flaws
- Resource Exhaustion

### Reporting & Documentation

- Proof of Concept Generation
- Evidence Collection
- Finding Documentation
- Report Templates

---

## 🛠️ Configuration

### Extension Settings

```json
{
  "burpMCP.prompt.autoInsert": false,           // Auto-insert instead of copy
  "burpMCP.prompt.includeComments": true,        // Include explanatory comments
  "burpMCP.history.maxItems": 50,                // Recently used prompts to track
  "burpMCP.ui.showNotifications": true           // Show copy/insert notifications
}
```

---

## 💡 Tips & Best Practices

### 1. **Be Specific in Your Prompts**

❌ "Test this for XSS"
✅ "Test the 'search' parameter at /search?q= for reflected XSS using common payloads"

### 2. **Combine Multiple Prompts**

Use multiple prompts for comprehensive testing:

- Start with reconnaissance prompts
- Then run specific vulnerability tests
- Finally generate documentation

### 3. **Customize Prompts**

Edit prompts to match your testing methodology:

- Adjust payloads
- Add specific checks
- Include compliance requirements

### 4. **Use Workflows**

For complete audits, use workflow templates that chain multiple tests together.

### 5. **Review AI Output**

Always verify AI-generated findings manually before reporting!

---

## 🔧 Advanced Usage

### Creating Custom Prompts

Add your own prompts by editing the configuration or contributing to the library:

```typescript
{
  id: 'my-custom-test',
  name: 'My Custom Security Test',
  description: 'Test for specific vulnerability',
  category: 'Custom',
  mcpTool: 'send_http1_request',
  template: 'Your prompt template here...',
  tags: ['custom', 'api', 'auth']
}
```

### Importing/Exporting Prompts

Share prompts with your team:

- Export: Save prompts as JSON
- Import: Load team's prompt library
- Sync: Keep prompts updated

---

## 🐛 Troubleshooting

### Cursor Not Connecting to Burp

1. Check Burp Suite is running
2. Verify MCP extension is enabled in Burp
3. Check `mcp.json` configuration
4. Restart Cursor

### Prompts Not Showing

1. Reload VS Code window
2. Check extension is activated
3. Open sidebar manually: View → Open View → Burp MCP Assistant

### AI Not Using Burp Tools

1. Ensure Cursor can see Burp MCP connection
2. Be explicit in prompts: "Use Burp MCP tools to..."
3. Check Burp MCP server logs

---

## 📚 Resources

- **Burp MCP Server**: <https://github.com/portswigger/mcp-server>
- **MCP Protocol**: <https://modelcontextprotocol.io>
- **Burp Suite**: <https://portswigger.net/burp>
- **Documentation**: [GitHub Wiki](https://github.com/gethuksec/burpMCP/wiki)

---

## 🤝 Contributing

We welcome contributions!

- Add new prompts
- Improve existing templates
- Fix typos/errors
- Share your workflows

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📄 License

MIT License - see [LICENSE](LICENSE)

---

## 🙏 Credits

- **PortSwigger** for Burp Suite and MCP Server
- **Anthropic** for Model Context Protocol
- **Security Community** for testing and feedback

---

**Made with ❤️ by security professionals, for security professionals.**

*Happy (authorized) hacking!* 🎯
