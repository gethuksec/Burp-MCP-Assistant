import * as vscode from 'vscode';
import { CommandRegistry } from './commands/commandRegistry';
import { PromptLibrary } from './prompts/promptLibrary';
import { PromptLibraryTreeProvider } from './views/PromptLibraryTreeProvider';
import { FavoritesManager } from './favorites/FavoritesManager';
import { WorkflowEngine } from './workflows/workflowEngine';

let commandRegistry: CommandRegistry;
let promptLibrary: PromptLibrary;
let favoritesManager: FavoritesManager;
let workflowEngine: WorkflowEngine;
let promptLibraryTreeProvider: PromptLibraryTreeProvider;
let favoritesViewProvider: { refresh: () => void } | undefined;

export async function activate(context: vscode.ExtensionContext) {
    console.log('🎯 Burp MCP Assistant (Prompt Library) is now active!');

    // Initialize core components
    promptLibrary = new PromptLibrary(context);
    favoritesManager = new FavoritesManager(context);
    workflowEngine = new WorkflowEngine(context);
    commandRegistry = new CommandRegistry(promptLibrary);

    // Register all commands
    commandRegistry.registerCommands(context);

    // Register views
    registerViews(context);

    // Register search and favorites commands
    registerSearchAndFavoritesCommands(context);

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
    // Prompt Library TreeView Provider
    promptLibraryTreeProvider = new PromptLibraryTreeProvider(promptLibrary);

    context.subscriptions.push(
        vscode.window.registerTreeDataProvider(
            'burpMCP.promptLibrary',
            promptLibraryTreeProvider
        )
    );

    // Favorites View Provider
    const localFavoritesViewProvider = {
        _onDidChangeTreeData: new vscode.EventEmitter<void>(),
        get onDidChangeTreeData() { return this._onDidChangeTreeData.event; },
        getTreeItem: (element: any) => element,
        getChildren: () => {
            return favoritesManager.getFavorites();
        },
        refresh: function () {
            this._onDidChangeTreeData.fire();
        }
    };

    // Listen for favorites changes
    favoritesManager.onDidChangeFavorites(() => {
        localFavoritesViewProvider.refresh();
    });

    context.subscriptions.push(
        vscode.window.registerTreeDataProvider(
            'burpMCP.favorites',
            localFavoritesViewProvider
        )
    );

    // Store reference for refresh command
    favoritesViewProvider = localFavoritesViewProvider;
}

function registerSearchAndFavoritesCommands(context: vscode.ExtensionContext) {
    // Search command with real-time filtering
    context.subscriptions.push(
        vscode.commands.registerCommand('burpMCP.searchPrompts', async () => {
            const quickPick = vscode.window.createQuickPick();
            quickPick.placeholder = 'Type to filter prompts (e.g. sql, xss, jwt)...';
            quickPick.matchOnDescription = true;
            quickPick.matchOnDetail = true;

            // Get all prompts for QuickPick
            const allPrompts = promptLibrary.getAllPrompts();
            const allItems = allPrompts.map(p => ({
                label: p.name,
                description: p.category,
                detail: p.tags.join(', '),
                prompt: p
            }));

            quickPick.items = allItems;

            // Real-time filter as user types
            quickPick.onDidChangeValue(value => {
                promptLibraryTreeProvider.setSearchFilter(value);
            });

            // When item is selected, copy it
            quickPick.onDidAccept(() => {
                const selected = quickPick.selectedItems[0] as any;
                if (selected?.prompt) {
                    vscode.commands.executeCommand('burpMCP.copyPrompt', { prompt: selected.prompt });
                }
                quickPick.hide();
            });

            // Clear filter when QuickPick is closed
            quickPick.onDidHide(() => {
                quickPick.dispose();
            });

            quickPick.show();
        })
    );

    // Clear search command
    context.subscriptions.push(
        vscode.commands.registerCommand('burpMCP.clearSearch', () => {
            promptLibraryTreeProvider.clearSearch();
            vscode.window.showInformationMessage('Search filter cleared');
        })
    );

    // Add to favorites command
    context.subscriptions.push(
        vscode.commands.registerCommand('burpMCP.addToFavorites', (item: any) => {
            if (item?.prompt) {
                favoritesManager.addFavorite({
                    id: item.prompt.id,
                    name: item.prompt.name,
                    category: item.prompt.category,
                    template: item.prompt.template
                });
            }
        })
    );

    // Remove from favorites command
    context.subscriptions.push(
        vscode.commands.registerCommand('burpMCP.removeFromFavorites', (item: any) => {
            if (item?.command?.arguments?.[0]?.prompt?.id) {
                favoritesManager.removeFavorite(item.command.arguments[0].prompt.id);
            }
        })
    );

    // Refresh favorites command
    context.subscriptions.push(
        vscode.commands.registerCommand('burpMCP.refreshFavorites', () => {
            if (favoritesViewProvider) {
                favoritesViewProvider.refresh();
            }
        })
    );

    // Clear all favorites command
    context.subscriptions.push(
        vscode.commands.registerCommand('burpMCP.clearFavorites', async () => {
            const confirm = await vscode.window.showWarningMessage(
                'Are you sure you want to clear all favorites?',
                { modal: true },
                'Yes, Clear All'
            );
            if (confirm) {
                favoritesManager.clearFavorites();
            }
        })
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
