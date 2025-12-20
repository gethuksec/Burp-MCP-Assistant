import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export interface PromptTemplate {
    id: string;
    name: string;
    description: string;
    category: string;
    mcpTool: string;
    template: string;
    parameters: PromptParameter[];
    examples: string[];
    tags: string[];
}

export interface PromptParameter {
    name: string;
    type: 'string' | 'number' | 'url' | 'json' | 'select';
    required: boolean;
    description: string;
    default?: any;
    options?: string[];
    validation?: string;
}

export class PromptLibrary {
    private context: vscode.ExtensionContext;
    private prompts: PromptTemplate[] = [];

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.initializePrompts();
    }

    private initializePrompts(): void {
        try {
            // Load prompts from JSON files in resources/prompts directory
            // We check both src (for development) and resources (for production)
            let promptsDir = path.join(this.context.extensionPath, 'resources', 'prompts');

            if (!fs.existsSync(promptsDir)) {
                // Fallback for development if not in resources
                promptsDir = path.join(this.context.extensionPath, 'src', 'prompts', 'data');
            }

            if (!fs.existsSync(promptsDir)) {
                console.error(`Prompt library directory not found.`);
                this.prompts = [];
                return;
            }

            const files = fs.readdirSync(promptsDir);

            for (const file of files) {
                if (file.endsWith('.json')) {
                    const filePath = path.join(promptsDir, file);
                    const content = fs.readFileSync(filePath, 'utf8');
                    try {
                        const categoryPrompts = JSON.parse(content) as PromptTemplate[];
                        if (Array.isArray(categoryPrompts)) {
                            this.prompts.push(...categoryPrompts);
                        }
                    } catch (parseError) {
                        console.error(`Error parsing prompt file ${file}:`, parseError);
                    }
                }
            }

            console.log(`Loaded ${this.prompts.length} prompts from library.`);
        } catch (error) {
            console.error('Error initializing prompt library:', error);
            this.prompts = [];
        }
    }

    public getCategories(): vscode.TreeItem[] {
        const uniqueCategories = [...new Set(this.prompts.map(p => p.category))];

        return uniqueCategories.map(category => {
            const item = new vscode.TreeItem(
                category,
                vscode.TreeItemCollapsibleState.Collapsed
            );
            item.iconPath = new vscode.ThemeIcon('folder');
            item.contextValue = 'category';
            return item;
        });
    }

    public getPromptsByCategory(category: string): vscode.TreeItem[] {
        const prompts = this.prompts.filter(p => p.category === category);

        return prompts.map(prompt => {
            const item = new vscode.TreeItem(prompt.name);
            item.description = prompt.description;
            item.tooltip = new vscode.MarkdownString(
                `**${prompt.name}**\n\n${prompt.description}\n\n` +
                `**MCP Tool**: ${prompt.mcpTool}\n\n` +
                `**Tags**: ${prompt.tags.join(', ')}\n\n` +
                `**Examples**: ${prompt.examples[0]}`
            );
            item.iconPath = new vscode.ThemeIcon('file-code');
            item.command = {
                command: 'burpMCP.copyPrompt',
                title: 'Copy Prompt',
                arguments: [{ prompt }]
            };
            item.contextValue = 'prompt';
            return item;
        });
    }

    public async showLibrary(): Promise<void> {
        const categories = [...new Set(this.prompts.map(p => p.category))];

        const selected = await vscode.window.showQuickPick(categories, {
            placeHolder: 'Select a prompt category'
        });

        if (!selected) {
            return;
        }

        const categoryPrompts = this.prompts.filter(p => p.category === selected);
        const promptNames = categoryPrompts.map(p => ({
            label: p.name,
            description: p.description,
            prompt: p
        }));

        const selectedPrompt = await vscode.window.showQuickPick(promptNames, {
            placeHolder: 'Select a security testing prompt'
        });

        if (selectedPrompt) {
            // Copy to clipboard
            await vscode.env.clipboard.writeText(selectedPrompt.prompt.template);
            vscode.window.showInformationMessage(
                `✅ Copied "${selectedPrompt.prompt.name}" to clipboard!\n\nPaste in Cursor Chat to use with Burp MCP.`
            );
        }
    }

    public getAllPrompts(): PromptTemplate[] {
        return this.prompts;
    }

    public getPromptById(id: string): PromptTemplate | undefined {
        return this.prompts.find(p => p.id === id);
    }

    public searchPrompts(query: string): PromptTemplate[] {
        const lowerQuery = query.toLowerCase();
        return this.prompts.filter(p =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.description.toLowerCase().includes(lowerQuery) ||
            p.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        );
    }
}
