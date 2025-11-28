import * as vscode from 'vscode';
import { CommandRegistry } from './commands/commandRegistry';
import { PromptLibrary } from './prompts/promptLibrary';
import { HistoryManager } from './history/historyManager';

let commandRegistry: CommandRegistry;
let promptLibrary: PromptLibrary;
let historyManager: HistoryManager;

export async function activate(context: vscode.ExtensionContext) {
    console.log('🎯 Burp MCP Assistant (Prompt Library) is now active!');

    // Initialize core components
    historyManager = new HistoryManager(context);
    promptLibrary = new PromptLibrary(context);
    commandRegistry = new CommandRegistry(
        promptLibrary,
        historyManager
    );

    // Register all commands
    commandRegistry.registerCommands(context);

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
    const promptLibraryViewProvider = {
        getTreeItem: (element: any) => element,
        getChildren: (element?: any) => {
            if (!element) {
                return promptLibrary.getCategories();
            }
            return promptLibrary.getPromptsByCategory(element.label);
        }
    };

    vscode.window.registerTreeDataProvider(
        'burpMCP.prompts',
        promptLibraryViewProvider
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
1. Configure Burp MCP in Cursor (see README)
2. Browse prompts in the sidebar
3. Copy prompts and use with Cursor AI
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
