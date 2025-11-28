import * as vscode from 'vscode';
import { PromptLibrary } from '../prompts/promptLibrary';
import { HistoryManager } from '../history/historyManager';

export class CommandRegistry {
    private promptLibrary: PromptLibrary;
    private historyManager: HistoryManager;

    constructor(
        promptLibrary: PromptLibrary,
        historyManager: HistoryManager
    ) {
        this.promptLibrary = promptLibrary;
        this.historyManager = historyManager;
    }

    public registerCommands(context: vscode.ExtensionContext): void {
        // Open prompt library
        context.subscriptions.push(
            vscode.commands.registerCommand('burpMCP.openPromptLibrary', async () => {
                await this.promptLibrary.showLibrary();
            })
        );

        // Copy prompt to clipboard
        context.subscriptions.push(
            vscode.commands.registerCommand('burpMCP.copyPrompt', async (item?: any) => {
                await this.copyPromptToClipboard(item);
            })
        );

        // Insert prompt at cursor
        context.subscriptions.push(
            vscode.commands.registerCommand('burpMCP.insertPrompt', async (item?: any) => {
                await this.insertPromptAtCursor(item);
            })
        );

        // Search prompts
        context.subscriptions.push(
            vscode.commands.registerCommand('burpMCP.searchPrompts', async () => {
                await this.searchPrompts();
            })
        );

        // Show tools reference
        context.subscriptions.push(
            vscode.commands.registerCommand('burpMCP.showToolsReference', async () => {
                await this.showToolsReference();
            })
        );

        // Clear history
        context.subscriptions.push(
            vscode.commands.registerCommand('burpMCP.clearHistory', () => {
                this.historyManager.clearHistory();
            })
        );
    }

    private async copyPromptToClipboard(item?: any): Promise<void> {
        const prompt = item?.prompt || await this.selectPrompt();
        if (!prompt) {
            return;
        }

        const config = vscode.workspace.getConfiguration('burpMCP');
        const defaultAction = config.get<string>('prompt.defaultAction', 'copy');

        // Always copy to clipboard
        await vscode.env.clipboard.writeText(prompt.template);

        // Then do the additional action based on setting
        if (defaultAction === 'insertAtCursor') {
            // Insert at cursor in active editor
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                await editor.edit(editBuilder => {
                    editBuilder.insert(editor.selection.active, prompt.template);
                });
                if (config.get('ui.showNotifications')) {
                    vscode.window.showInformationMessage(
                        `✅ Inserted "${prompt.name}" at cursor!`
                    );
                }
            } else {
                if (config.get('ui.showNotifications')) {
                    vscode.window.showInformationMessage(
                        `✅ Copied "${prompt.name}" to clipboard!\n\n💡 Press Ctrl+Shift+I to open Cursor Chat, then Ctrl+V to paste.`,
                        'Got it!'
                    );
                }
            }
        } else {
            // Default: just copy with helpful message
            if (config.get('ui.showNotifications')) {
                const action = await vscode.window.showInformationMessage(
                    `✅ Copied "${prompt.name}" to clipboard!\n\n💡 Next: Press Ctrl+Shift+I to open Cursor Chat, then Ctrl+V to paste.`,
                    'Got it!',
                    'Open Settings'
                );
                
                if (action === 'Open Settings') {
                    vscode.commands.executeCommand('workbench.action.openSettings', 'burpMCP.prompt.defaultAction');
                }
            }
        }

        this.historyManager.addCommand({
            command: 'copyPrompt',
            timestamp: Date.now(),
            success: true,
            details: { promptId: prompt.id, promptName: prompt.name }
        });
    }

    private async insertPromptAtCursor(item?: any): Promise<void> {
        const prompt = item?.prompt || await this.selectPrompt();
        if (!prompt) {
            return;
        }

        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('No active editor');
            return;
        }

        await editor.edit(editBuilder => {
            editBuilder.insert(editor.selection.active, prompt.template);
        });

        const config = vscode.workspace.getConfiguration('burpMCP');
        if (config.get('ui.showNotifications')) {
            vscode.window.showInformationMessage(
                `✅ Inserted "${prompt.name}" at cursor!`
            );
        }

        this.historyManager.addCommand({
            command: 'insertPrompt',
            timestamp: Date.now(),
            success: true,
            details: { promptId: prompt.id, promptName: prompt.name }
        });
    }

    private async selectPrompt(): Promise<any> {
        const allPrompts = this.promptLibrary.getAllPrompts();
        
        const quickPickItems = allPrompts.map(prompt => ({
            label: prompt.name,
            description: prompt.category,
            detail: prompt.description,
            prompt: prompt
        }));

        const selected = await vscode.window.showQuickPick(quickPickItems, {
            placeHolder: 'Select a prompt to use',
            matchOnDescription: true,
            matchOnDetail: true
        });

        return selected?.prompt;
    }

    private async searchPrompts(): Promise<void> {
        const query = await vscode.window.showInputBox({
            prompt: 'Search prompts (by name, description, or tags)',
            placeHolder: 'e.g. sql injection, xss, jwt'
        });

        if (!query) {
            return;
        }

        const results = this.promptLibrary.searchPrompts(query);
        
        if (results.length === 0) {
            vscode.window.showInformationMessage(`No prompts found for "${query}"`);
            return;
        }

        const quickPickItems = results.map(prompt => ({
            label: prompt.name,
            description: `${prompt.category} - ${prompt.tags.join(', ')}`,
            detail: prompt.description,
            prompt: prompt
        }));

        const selected = await vscode.window.showQuickPick(quickPickItems, {
            placeHolder: `${results.length} prompt(s) found`,
            matchOnDescription: true,
            matchOnDetail: true
        });

        if (selected) {
            await this.copyPromptToClipboard({ prompt: selected.prompt });
        }
    }

    private async showToolsReference(): Promise<void> {
        const panel = vscode.window.createWebviewPanel(
            'burpMCPToolsReference',
            'Burp MCP Tools Reference',
            vscode.ViewColumn.One,
            {}
        );

        panel.webview.html = this.getToolsReferenceHTML();
    }

    private getToolsReferenceHTML(): string {
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Burp MCP Tools Reference</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            padding: 20px;
            line-height: 1.6;
        }
        h1 { color: #ff6633; }
        h2 { color: #4a90e2; margin-top: 30px; }
        .tool { 
            background: #f5f5f5;
            padding: 15px;
            margin: 10px 0;
            border-left: 4px solid #ff6633;
        }
        .tool-name { font-weight: bold; font-size: 1.1em; }
        .tool-desc { margin: 5px 0; color: #666; }
        code { 
            background: #e0e0e0;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
        }
    </style>
</head>
<body>
    <h1>🎯 Burp MCP Tools Reference</h1>
    <p>Quick reference for all 21 Burp MCP tools</p>

    <h2>HTTP Request Execution</h2>
    <div class="tool">
        <div class="tool-name">send_http1_request</div>
        <div class="tool-desc">Issues an HTTP/1.1 request and returns the response</div>
        <div>Parameters: <code>targetHostname</code>, <code>targetPort</code>, <code>usesHttps</code>, <code>content</code></div>
    </div>
    <div class="tool">
        <div class="tool-name">send_http2_request</div>
        <div class="tool-desc">Issues an HTTP/2 request and returns the response</div>
        <div>Parameters: <code>targetHostname</code>, <code>targetPort</code>, <code>usesHttps</code>, <code>pseudoHeaders</code>, <code>headers</code>, <code>requestBody</code></div>
    </div>

    <h2>Burp Tools Integration</h2>
    <div class="tool">
        <div class="tool-name">create_repeater_tab</div>
        <div class="tool-desc">Creates a new Repeater tab with specified HTTP request</div>
        <div>Parameters: <code>targetHostname</code>, <code>targetPort</code>, <code>usesHttps</code>, <code>content</code>, <code>tabName</code></div>
    </div>
    <div class="tool">
        <div class="tool-name">send_to_intruder</div>
        <div class="tool-desc">Sends HTTP request to Intruder</div>
        <div>Parameters: <code>targetHostname</code>, <code>targetPort</code>, <code>usesHttps</code>, <code>content</code>, <code>tabName</code></div>
    </div>

    <h2>Encoding/Decoding</h2>
    <div class="tool">
        <div class="tool-name">url_encode</div>
        <div class="tool-desc">URL encodes the input string</div>
        <div>Parameters: <code>content</code></div>
    </div>
    <div class="tool">
        <div class="tool-name">url_decode</div>
        <div class="tool-desc">URL decodes the input string</div>
        <div>Parameters: <code>content</code></div>
    </div>
    <div class="tool">
        <div class="tool-name">base64_encode</div>
        <div class="tool-desc">Base64 encodes the input string</div>
        <div>Parameters: <code>content</code></div>
    </div>
    <div class="tool">
        <div class="tool-name">base64_decode</div>
        <div class="tool-desc">Base64 decodes the input string</div>
        <div>Parameters: <code>content</code></div>
    </div>
    <div class="tool">
        <div class="tool-name">generate_random_string</div>
        <div class="tool-desc">Generates random string of specified length and character set</div>
        <div>Parameters: <code>length</code>, <code>characterSet</code></div>
    </div>

    <h2>Configuration Management</h2>
    <div class="tool">
        <div class="tool-name">output_project_options</div>
        <div class="tool-desc">Outputs current project-level configuration in JSON format</div>
    </div>
    <div class="tool">
        <div class="tool-name">output_user_options</div>
        <div class="tool-desc">Outputs current user-level configuration in JSON format</div>
    </div>
    <div class="tool">
        <div class="tool-name">set_project_options</div>
        <div class="tool-desc">Sets project-level configuration in JSON format</div>
        <div>Parameters: <code>json</code></div>
    </div>
    <div class="tool">
        <div class="tool-name">set_user_options</div>
        <div class="tool-desc">Sets user-level configuration in JSON format</div>
        <div>Parameters: <code>json</code></div>
    </div>

    <h2>History & Monitoring</h2>
    <div class="tool">
        <div class="tool-name">get_proxy_http_history</div>
        <div class="tool-desc">Displays items within the proxy HTTP history</div>
        <div>Parameters: <code>count</code>, <code>offset</code></div>
    </div>
    <div class="tool">
        <div class="tool-name">get_proxy_http_history_regex</div>
        <div class="tool-desc">Displays items matching regex within proxy HTTP history</div>
        <div>Parameters: <code>regex</code>, <code>count</code>, <code>offset</code></div>
    </div>
    <div class="tool">
        <div class="tool-name">get_proxy_websocket_history</div>
        <div class="tool-desc">Displays items within proxy WebSocket history</div>
        <div>Parameters: <code>count</code>, <code>offset</code></div>
    </div>
    <div class="tool">
        <div class="tool-name">get_proxy_websocket_history_regex</div>
        <div class="tool-desc">Displays items matching regex within WebSocket history</div>
        <div>Parameters: <code>regex</code>, <code>count</code>, <code>offset</code></div>
    </div>

    <h2>State Management</h2>
    <div class="tool">
        <div class="tool-name">set_task_execution_engine_state</div>
        <div class="tool-desc">Sets state of Burp's task execution engine (paused or running)</div>
        <div>Parameters: <code>running</code> (boolean)</div>
    </div>
    <div class="tool">
        <div class="tool-name">set_proxy_intercept_state</div>
        <div class="tool-desc">Enables or disables Burp Proxy Intercept</div>
        <div>Parameters: <code>intercepting</code> (boolean)</div>
    </div>

    <h2>Editor Integration</h2>
    <div class="tool">
        <div class="tool-name">get_active_editor_contents</div>
        <div class="tool-desc">Outputs contents of user's active message editor</div>
    </div>
    <div class="tool">
        <div class="tool-name">set_active_editor_contents</div>
        <div class="tool-desc">Sets content of user's active message editor</div>
        <div>Parameters: <code>text</code></div>
    </div>

    <p style="margin-top: 40px; color: #666;">
        💡 <strong>Tip:</strong> Use these tool names in your prompts to direct the AI which Burp tools to use!
    </p>
</body>
</html>
        `.trim();
    }
}
