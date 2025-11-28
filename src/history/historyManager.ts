import * as vscode from 'vscode';

export interface CommandHistoryItem {
    command: string;
    timestamp: number;
    success: boolean;
    details?: any;
}

export class HistoryManager {
    private context: vscode.ExtensionContext;
    private history: CommandHistoryItem[] = [];
    private maxHistorySize: number = 100;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.loadHistory();
    }

    public addCommand(item: CommandHistoryItem): void {
        this.history.unshift(item); // Add to beginning

        // Trim history to max size
        if (this.history.length > this.maxHistorySize) {
            this.history = this.history.slice(0, this.maxHistorySize);
        }

        this.saveHistory();
    }

    public getRecentCommands(limit: number = 10): vscode.TreeItem[] {
        const recentItems = this.history.slice(0, limit);

        return recentItems.map(item => {
            const date = new Date(item.timestamp);
            const timeStr = date.toLocaleTimeString();

            const treeItem = new vscode.TreeItem(item.command);
            treeItem.description = timeStr;
            treeItem.tooltip = new vscode.MarkdownString(
                `**Command**: ${item.command}\n\n` +
                `**Time**: ${date.toLocaleString()}\n\n` +
                `**Status**: ${item.success ? '✅ Success' : '❌ Failed'}\n\n` +
                (item.details ? `**Details**: ${JSON.stringify(item.details, null, 2)}` : '')
            );
            treeItem.iconPath = new vscode.ThemeIcon(
                item.success ? 'pass' : 'error',
                item.success ?
                    new vscode.ThemeColor('testing.iconPassed') :
                    new vscode.ThemeColor('testing.iconFailed')
            );

            return treeItem;
        });
    }

    public getAllHistory(): CommandHistoryItem[] {
        return [...this.history];
    }

    public clearHistory(): void {
        this.history = [];
        this.saveHistory();
        vscode.window.showInformationMessage('Command history cleared');
    }

    public exportHistory(): string {
        return JSON.stringify(this.history, null, 2);
    }

    private loadHistory(): void {
        const saved = this.context.globalState.get<CommandHistoryItem[]>('commandHistory', []);
        this.history = saved;
    }

    private saveHistory(): void {
        this.context.globalState.update('commandHistory', this.history);
    }

    public getStatistics(): {
        totalCommands: number;
        successRate: number;
        mostUsedCommand: string;
        commandCounts: Record<string, number>;
    } {
        const totalCommands = this.history.length;
        const successfulCommands = this.history.filter(h => h.success).length;
        const successRate = totalCommands > 0 ? (successfulCommands / totalCommands) * 100 : 0;

        const commandCounts: Record<string, number> = {};
        this.history.forEach(item => {
            commandCounts[item.command] = (commandCounts[item.command] || 0) + 1;
        });

        let mostUsedCommand = '';
        let maxCount = 0;
        Object.entries(commandCounts).forEach(([command, count]) => {
            if (count > maxCount) {
                maxCount = count;
                mostUsedCommand = command;
            }
        });

        return {
            totalCommands,
            successRate,
            mostUsedCommand,
            commandCounts
        };
    }
}
