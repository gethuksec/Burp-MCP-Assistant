import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { PromptLibrary, PromptTemplate } from '../prompts/promptLibrary';

export class PromptLibraryWebviewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'burpMCP.promptLibraryWebview';

    private _view?: vscode.WebviewView;

    constructor(
        private readonly _extensionUri: vscode.Uri,
        private readonly _promptLibrary: PromptLibrary
    ) { }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                this._extensionUri
            ]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        webviewView.webview.onDidReceiveMessage(data => {
            switch (data.type) {
                case 'copyPrompt':
                    vscode.commands.executeCommand('burpMCP.copyPrompt', { prompt: data.prompt });
                    break;
                case 'insertPrompt':
                    vscode.commands.executeCommand('burpMCP.insertPrompt', { prompt: data.prompt });
                    break;
                case 'search':
                    // handled client side, or we could filter here
                    break;
            }
        });
    }

    public refresh() {
        if (this._view) {
            this._view.webview.html = this._getHtmlForWebview(this._view.webview);
        }
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        // Get the local path to main script
        const scriptPath = vscode.Uri.joinPath(this._extensionUri, 'resources', 'webviews', 'prompt-library', 'main.js');
        const scriptUri = webview.asWebviewUri(scriptPath);

        // Get the local path to css
        const stylePath = vscode.Uri.joinPath(this._extensionUri, 'resources', 'webviews', 'prompt-library', 'styles.css');
        const styleUri = webview.asWebviewUri(stylePath);

        // Get path to html template
        const htmlPath = path.join(this._extensionUri.fsPath, 'resources', 'webviews', 'prompt-library', 'index.html');
        let htmlContent = fs.readFileSync(htmlPath, 'utf8');

        // Get prompts data
        const prompts = this._promptLibrary.getAllPrompts();
        const categories = this._promptLibrary.getCategories().map(c => typeof c.label === 'string' ? c.label : c.label?.label || ''); // Simplified for now

        // Inject data into HTML
        // specific generic unique replacement strings to avoid conflicts
        htmlContent = htmlContent.replace('{{stylesUri}}', styleUri.toString());
        htmlContent = htmlContent.replace('{{scriptUri}}', scriptUri.toString());
        htmlContent = htmlContent.replace('{{cspSource}}', webview.cspSource);
        htmlContent = htmlContent.replace('{{promptsData}}', JSON.stringify(prompts));

        return htmlContent;
    }
}
