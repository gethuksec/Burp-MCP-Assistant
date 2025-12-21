import * as vscode from 'vscode';

export interface FavoriteItem {
    promptId: string;
    promptName: string;
    category: string;
    template: string;
    addedAt: number;
}

/**
 * Manages favorite prompts with persistent storage
 */
export class FavoritesManager {
    private context: vscode.ExtensionContext;
    private favorites: FavoriteItem[] = [];

    private _onDidChangeFavorites = new vscode.EventEmitter<void>();
    readonly onDidChangeFavorites = this._onDidChangeFavorites.event;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.loadFavorites();
    }

    /**
     * Add a prompt to favorites
     */
    public addFavorite(prompt: { id: string; name: string; category: string; template: string }): void {
        // Check if already exists
        if (this.isFavorite(prompt.id)) {
            vscode.window.showInformationMessage(`"${prompt.name}" is already in favorites`);
            return;
        }

        this.favorites.unshift({
            promptId: prompt.id,
            promptName: prompt.name,
            category: prompt.category,
            template: prompt.template,
            addedAt: Date.now()
        });

        this.saveFavorites();
        this._onDidChangeFavorites.fire();
        vscode.window.showInformationMessage(`⭐ Added "${prompt.name}" to favorites`);
    }

    /**
     * Remove a prompt from favorites
     */
    public removeFavorite(promptId: string): void {
        const index = this.favorites.findIndex(f => f.promptId === promptId);
        if (index === -1) {return;}

        const removed = this.favorites.splice(index, 1)[0];
        this.saveFavorites();
        this._onDidChangeFavorites.fire();
        vscode.window.showInformationMessage(`Removed "${removed.promptName}" from favorites`);
    }

    /**
     * Check if a prompt is in favorites
     */
    public isFavorite(promptId: string): boolean {
        return this.favorites.some(f => f.promptId === promptId);
    }

    /**
     * Get all favorites as TreeItems
     */
    public getFavorites(): vscode.TreeItem[] {
        return this.favorites.map(fav => {
            const treeItem = new vscode.TreeItem(fav.promptName);
            treeItem.description = fav.category;

            const md = new vscode.MarkdownString();
            md.isTrusted = true;
            md.appendMarkdown(`**${fav.promptName}**\n\n`);
            md.appendMarkdown(`📁 ${fav.category}\n\n`);
            md.appendMarkdown(`⭐ Added: ${new Date(fav.addedAt).toLocaleDateString()}\n\n`);
            md.appendMarkdown(`🔗 Click to copy`);
            treeItem.tooltip = md;

            treeItem.iconPath = new vscode.ThemeIcon('star-full');
            treeItem.contextValue = 'favoriteItem';

            // Click to copy
            treeItem.command = {
                command: 'burpMCP.copyPrompt',
                title: '',
                arguments: [{
                    prompt: {
                        id: fav.promptId,
                        name: fav.promptName,
                        category: fav.category,
                        template: fav.template
                    }
                }]
            };

            return treeItem;
        });
    }

    /**
     * Get raw favorites array
     */
    public getAllFavorites(): FavoriteItem[] {
        return [...this.favorites];
    }

    /**
     * Clear all favorites
     */
    public clearFavorites(): void {
        this.favorites = [];
        this.saveFavorites();
        this._onDidChangeFavorites.fire();
        vscode.window.showInformationMessage('All favorites cleared');
    }

    private loadFavorites(): void {
        this.favorites = this.context.globalState.get<FavoriteItem[]>('favorites', []);
    }

    private saveFavorites(): void {
        this.context.globalState.update('favorites', this.favorites);
    }
}
