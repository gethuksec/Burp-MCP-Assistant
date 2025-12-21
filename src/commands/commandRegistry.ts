import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { PromptLibrary } from '../prompts/promptLibrary';

export class CommandRegistry {
    private promptLibrary: PromptLibrary;
    private context?: vscode.ExtensionContext;

    constructor(promptLibrary: PromptLibrary) {
        this.promptLibrary = promptLibrary;
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

        // Show tools reference
        context.subscriptions.push(
            vscode.commands.registerCommand('burpMCP.showToolsReference', async () => {
                await this.showToolsReference();
            })
        );
    }

    private async copyPromptToClipboard(item?: any): Promise<void> {
        const prompt = item?.prompt || await this.selectPrompt();
        if (!prompt) {
            return;
        }

        // Copy to clipboard
        await vscode.env.clipboard.writeText(prompt.template);

        const config = vscode.workspace.getConfiguration('burpMCP');
        if (config.get('ui.showNotifications')) {
            vscode.window.showInformationMessage(
                `✅ Copied "${prompt.name}" to clipboard!\n\n💡 Paste this into your AI Assistant chat.`
            );
        }
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
