import * as vscode from 'vscode';
import { CommandRegistry } from './commands/commandRegistry';
import { PromptLibrary } from './prompts/promptLibrary';
import { PromptLibraryWebviewProvider } from './webviews/promptLibraryWebview';
import { HistoryManager } from './history/historyManager';
import { WorkflowEngine } from './workflows/workflowEngine';

let commandRegistry: CommandRegistry;
let promptLibrary: PromptLibrary;
let historyManager: HistoryManager;
let workflowEngine: WorkflowEngine;

export async function activate(context: vscode.ExtensionContext) {
    console.log('🎯 Burp MCP Assistant (Prompt Library) is now active!');

    // Initialize core components
    historyManager = new HistoryManager(context);
    promptLibrary = new PromptLibrary(context);
    workflowEngine = new WorkflowEngine(context);
    commandRegistry = new CommandRegistry(
        promptLibrary,
        historyManager
    );

    // Register all commands
    commandRegistry.registerCommands(context);

    // Register workflow command
    context.subscriptions.push(
        vscode.commands.registerCommand('burpMCP.runWorkflow', async () => {
            const workflows = workflowEngine.getWorkflows();
            const items = workflows.map(w => ({
                label: w.name,
                description: w.tags.join(', '),
                detail: w.description,
                workflowId: w.id
            }));

            const selected = await vscode.window.showQuickPick(items, {
                placeHolder: 'Select a security workflow to run'
            });

            if (selected) {
                await workflowEngine.executeWorkflow(selected.workflowId);
            }
        })
    );

    // Register views
    registerViews(context);

    // Show welcome message on first install
    const hasShownWelcome = context.globalState.get('hasShownWelcome', false);
    if (!hasShownWelcome) {
        showWelcomeMessage(context);
        context.globalState.update('hasShownWelcome', true);
    }
}

export function deactivate() {
    console.log('👋 Burp MCP Assistant deactivated');
}

function registerViews(context: vscode.ExtensionContext) {
    // Prompt Library View Provider
    const promptLibraryWebviewProvider = new PromptLibraryWebviewProvider(
        context.extensionUri,
        promptLibrary
    );

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            PromptLibraryWebviewProvider.viewType,
            promptLibraryWebviewProvider
        )
    );

    // History View Provider
    const historyViewProvider = {
        getTreeItem: (element: any) => element,
        getChildren: () => {
            return historyManager.getRecentCommands();
        }
    };

    vscode.window.registerTreeDataProvider(
        'burpMCP.history',
        historyViewProvider
    );
}

function showWelcomeMessage(context: vscode.ExtensionContext) {
    const message = `
🎯 Welcome to Burp MCP Assistant!

This extension provides 100+ security testing prompts and workflows for Burp Suite MCP.

📋 Setup:
1. Configure Burp MCP in your AI Assistant (see README)
2. Browse prompts in the sidebar
3. Copy prompts and use with your AI Assistant
4. Let AI execute Burp tools for you!

Ready to start?
    `.trim();

    vscode.window.showInformationMessage(
        message,
        'Open Prompt Library',
        'View Setup Guide'
    ).then(selection => {
        if (selection === 'Open Prompt Library') {
            vscode.commands.executeCommand('burpMCP.openPromptLibrary');
        } else if (selection === 'View Setup Guide') {
            vscode.env.openExternal(
                vscode.Uri.parse('https://github.com/gethuksec/burpMCP#readme')
            );
        }
    });
}
