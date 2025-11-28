# Contributing to Burp Suite MCP Assistant

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## ⚠️ Legal & Ethical Standards

**Before contributing, you must agree to:**

1. Use this tool only for authorized security testing
2. Follow responsible disclosure practices
3. Never contribute features designed for malicious use
4. Respect all applicable laws and regulations

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help maintain a welcoming community
- Follow security best practices

## How to Contribute

### Reporting Bugs

1. **Search existing issues** to avoid duplicates
2. **Use the bug report template**
3. **Include**:
   - VS Code version
   - Burp Suite version
   - Extension version
   - Steps to reproduce
   - Expected vs actual behavior
   - Error messages/logs

### Suggesting Features

1. **Check the roadmap** in README.md
2. **Use feature request template**
3. **Explain**:
   - Use case and benefits
   - How it helps security testing
   - Potential implementation approach

### Contributing Code

#### Setup Development Environment

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/burpMCP.git
cd burpMCP

# Install dependencies
npm install

# Open in VS Code
code .

# Start development
# Press F5 to launch Extension Development Host
```

#### Making Changes

1. **Create a branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Follow code style**:
   - Use TypeScript
   - Follow existing patterns
   - Add JSDoc comments
   - Use meaningful variable names
   - Keep functions focused and small

3. **Write tests** for new features

4. **Update documentation**:
   - README.md for user-facing changes
   - Code comments for implementation details
   - Prompt templates with examples

#### Code Style

```typescript
// Good
export async function encodedSelection(type: 'url' | 'base64'): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showWarningMessage('No active editor');
        return;
    }
    // ... implementation
}

// Use clear naming
const isConnected = this.connectionManager.isConnected();

// Add error handling
try {
    const result = await this.client.sendRequest(...);
    if (!result.success) {
        vscode.window.showErrorMessage(`Failed: ${result.error}`);
    }
} catch (error) {
    vscode.window.showErrorMessage(`Error: ${error.message}`);
}
```

#### Pull Request Process

1. **Update task.md** to reflect your changes
2. **Ensure all tests pass**: `npm test`
3. **Compile successfully**: `npm run compile`
4. **Update CHANGELOG.md** if applicable
5. **Create pull request** with:
   - Clear title and description
   - Reference related issues
   - Screenshots for UI changes
   - Testing checklist

### Adding Prompt Templates

Prompt templates help users perform security testing efficiently.

```typescript
{
    id: 'unique-id',
    name: 'Descriptive Name',
    description: 'Clear explanation of what this does',
    category: 'Input Validation', // Use existing categories
    mcpTool: 'send_http1_request',
    template: 'Template with {{placeholders}}',
    parameters: [
        {
            name: 'url',
            type: 'url',
            required: true,
            description: 'Target URL'
        }
    ],
    examples: ['Real-world example usage'],
    tags: ['relevant', 'searchable', 'tags']
}
```

**Guidelines**:
- Focus on common security testing scenarios
- Include OWASP Top 10 vulnerabilities
- Provide clear examples
- Test templates before submitting

## Development Workflow

### Running Locally

```bash
# Watch mode (auto-compile)
npm run watch

# Launch Extension Development Host
# Press F5 in VS Code

# Run tests
npm test

# Lint code
npm run lint
```

### Testing Checklist

Before submitting PR:
- [ ] Extension activates without errors
- [ ] All commands work as expected
- [ ] Connection to Burp Suite successful
- [ ] UI elements display correctly
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Documentation updated

## Project Structure

```
burpMCP/
├── src/
│   ├── extension.ts          # Entry point
│   ├── mcp/                  # MCP client
│   ├── connection/           # Connection management
│   ├── commands/             # Command implementations
│   ├── prompts/              # Prompt library
│   ├── history/              # History tracking
│   └── ui/                   # UI components
├── resources/                # Icons, assets
├── test/                     # Tests
└── docs/                     # Documentation
```

## Review Process

1. **Automated checks** run on PR
2. **Maintainer review** (usually within 1 week)
3. **Feedback addressed** by contributor
4. **Approval and merge**

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Given credit in documentation

## Questions?

- Open a [Discussion](https://github.com/gethuksec/burpMCP/discussions)
- Join our [Discord](#) (coming soon)
- Email: contribute@gethuksec.com

## License

By contributing, you agree that your contributions will be licensed under the MIT License with the security disclaimer.

---

**Thank you for helping make security testing more accessible and efficient!** 🛡️
