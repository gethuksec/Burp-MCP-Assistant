import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { PromptLibrary } from '../prompts/promptLibrary';
import { HistoryManager } from '../history/historyManager';

export class CommandRegistry {
    private promptLibrary: PromptLibrary;
    private historyManager: HistoryManager;

    private context?: vscode.ExtensionContext;

    constructor(
        promptLibrary: PromptLibrary,
        historyManager: HistoryManager
    ) {
        this.promptLibrary = promptLibrary;
        this.historyManager = historyManager;
    }

    public registerCommands(context: vscode.ExtensionContext): void {
        this.context = context;
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
                        `✅ Copied "${prompt.name}" to clipboard!\n\n💡 Paste this into your AI Assistant chat.`,
                        'Got it!'
                    );
                }
            }
        } else {
            // Default: just copy with helpful message
            if (config.get('ui.showNotifications')) {
                const action = await vscode.window.showInformationMessage(
                    `✅ Copied "${prompt.name}" to clipboard!\n\n💡 Next: Paste this into your AI Assistant chat.`,
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
        try {
            if (!this.context) {
                return '<h1>Error: Extension context not initialized</h1>';
            }

            const htmlPath = path.join(this.context.extensionPath, 'resources', 'tools-reference.html');
            if (fs.existsSync(htmlPath)) {
                return fs.readFileSync(htmlPath, 'utf8');
            }

            return '<h1>Error: Tools reference HTML file not found</h1>';
        } catch (error) {
            console.error('Error loading tools reference HTML:', error);
            return `<h1>Error loading template: ${error}</h1>`;
        }
    }
}
