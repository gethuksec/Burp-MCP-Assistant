import * as vscode from 'vscode';
import { PromptLibrary, PromptTemplate } from '../prompts/promptLibrary';

/**
 * TreeItem for individual prompt
 */
export class PromptItem extends vscode.TreeItem {
    constructor(
        public readonly prompt: PromptTemplate,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(prompt.name, collapsibleState);
        this.description = prompt.tags.slice(0, 2).join(', ');
        this.tooltip = this._createTooltip();
        this.iconPath = new vscode.ThemeIcon('file-code');
        this.contextValue = 'prompt';
        this.command = {
            command: 'burpMCP.copyPrompt',
            title: 'Copy Prompt',
            arguments: [{ prompt }]
        };
    }

    /**
     * Creates a Markdown formatted tooltip
     */
    private _createTooltip(): vscode.MarkdownString {
        const md = new vscode.MarkdownString();

        // Enable interactive tooltip (select text, click links)
        md.isTrusted = true;
        md.supportHtml = true;

        md.appendMarkdown(`**${this.prompt.name}**\n\n`);
        md.appendMarkdown(`${this.prompt.description}\n\n`);
        md.appendMarkdown(`---\n\n`);
        md.appendMarkdown(`**MCP Tool:** \`${this.prompt.mcpTool}\`\n\n`);
        md.appendMarkdown(`**Tags:** ${this.prompt.tags.join(', ')}\n\n`);

        // Show template preview (max 200 characters)
        const preview = this.prompt.template.length > 200
            ? this.prompt.template.slice(0, 200) + '...'
            : this.prompt.template;
        md.appendCodeblock(preview, 'text');

        return md;
    }
}

/**
 * TreeItem for category (folder)
 */
export class CategoryItem extends vscode.TreeItem {
    constructor(
        public readonly categoryName: string,
        public readonly promptCount: number
    ) {
        super(categoryName, vscode.TreeItemCollapsibleState.Collapsed);
        this.description = `${promptCount} prompts`;
        this.iconPath = new vscode.ThemeIcon('folder');
        this.contextValue = 'category';
    }
}

/**
 * TreeDataProvider for Prompt Library
 * Displays prompts in hierarchy: Category → Prompts
 * Supports search filtering with hierarchy preserved
 */
export class PromptLibraryTreeProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
    private _onDidChangeTreeData = new vscode.EventEmitter<vscode.TreeItem | undefined>();
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

    private searchQuery: string = '';

    constructor(private promptLibrary: PromptLibrary) { }

    /**
     * Set search filter and refresh tree
     */
    public setSearchFilter(query: string): void {
        this.searchQuery = query.toLowerCase().trim();
        this._onDidChangeTreeData.fire(undefined);
    }

    /**
     * Clear search filter
     */
    public clearSearch(): void {
        this.searchQuery = '';
        this._onDidChangeTreeData.fire(undefined);
    }

    /**
     * Get current search query
     */
    public getSearchQuery(): string {
        return this.searchQuery;
    }

    /**
     * Refresh the tree view
     */
    public refresh(): void {
        this._onDidChangeTreeData.fire(undefined);
    }

    getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: vscode.TreeItem): vscode.ProviderResult<vscode.TreeItem[]> {
        if (!element) {
            // Root level: show categories (filtered if search active)
            return this._getCategories();
        }

        if (element instanceof CategoryItem) {
            // Category level: show prompts in category (filtered if search active)
            return this._getPromptsByCategory(element.categoryName);
        }

        return [];
    }

    /**
     * Gets list of categories with their prompt counts
     * When filtering, only shows categories with matching prompts
     */
    private _getCategories(): CategoryItem[] {
        const prompts = this._getFilteredPrompts();
        const categoryMap = new Map<string, number>();

        prompts.forEach(p => {
            categoryMap.set(p.category, (categoryMap.get(p.category) || 0) + 1);
        });

        return Array.from(categoryMap.entries())
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([name, count]) => {
                const item = new CategoryItem(name, count);
                // Auto-expand categories when searching
                if (this.searchQuery) {
                    item.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
                }
                return item;
            });
    }

    /**
     * Gets prompts by category (filtered if search active)
     */
    private _getPromptsByCategory(category: string): PromptItem[] {
        return this._getFilteredPrompts()
            .filter(p => p.category === category)
            .map(p => new PromptItem(p, vscode.TreeItemCollapsibleState.None));
    }

    /**
     * Gets all prompts filtered by search query
     */
    private _getFilteredPrompts(): PromptTemplate[] {
        const allPrompts = this.promptLibrary.getAllPrompts();

        if (!this.searchQuery) {
            return allPrompts;
        }

        const query = this.searchQuery;
        return allPrompts.filter(p =>
            p.name.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            p.tags.some(t => t.toLowerCase().includes(query)) ||
            p.category.toLowerCase().includes(query) ||
            p.mcpTool.toLowerCase().includes(query)
        );
    }
}
