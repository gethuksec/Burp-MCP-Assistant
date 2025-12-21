# Packaging Guide for Burp MCP Assistant

This guide describes how to package the extension into a `.vsix` file for distribution or manual installation.

## Prerequisites

- **Node.js**: Installed (v18+ recommended).
- **vsce**: The VS Code Extension Manager tool.

If you don't have `vsce` installed globally, you can execute it using `npx`:

```bash
npx @vscode/vsce --version
```

## Packaging Steps

1. **Prepare the Project**
    Ensure all dependencies are installed and the code is compiled.

    ```bash
    npm install
    npm run compile
    ```

2. **Verify Configuration**
    Check `package.json` for correct version, publisher, and icon settings.

3. **Package the Extension**
    Run the following command to generate the `.vsix` file:

    ```bash
    npx @vscode/vsce package
    ```

    You might be asked about missing `LICENSE` file or other warnings. Review them.
    If successful, a file named `burp-mcp-assistant-0.2.0.vsix` (or current version) will be created in the root directory.

## Installation

### VS Code

1. Open VS Code.
2. Go to the **Extensions** view (`Ctrl+Shift+X`).
3. Click the "..." (Views and More Actions) menu at the top right of the sidebar.
4. Select **"Install from VSIX..."**.
5. Locate and select the generated `.vsix` file.
6. Reload VS Code if prompted.

### Cursor / Antigravity

1. Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`).
2. Type "Install from VSIX" and select **"Extensions: Install from VSIX..."**.
3. Select the `.vsix` file.

## Troubleshooting

- **Image/Icon Issues**: If the icon doesn't show up, ensure it is a PNG/SVG file and the path in `package.json` is correct (`resources/burp-icon.svg`).
- **Missing Dependencies**: If the extension fails to start, ensure `node_modules` were not accidentally ignored in `.vscodeignore`.
