import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('Extension should be present', () => {
        assert.ok(vscode.extensions.getExtension('gethuksec.burp-mcp-assistant'));
    });

    test('Extension should activate', async () => {
        const ext = vscode.extensions.getExtension('gethuksec.burp-mcp-assistant');
        if (ext) {
            await ext.activate();
            assert.ok(ext.isActive);
        }
    });

    test('Commands should be registered', async () => {
        const commands = await vscode.commands.getCommands(true);

        const expectedCommands = [
            'burpMCP.openPromptLibrary',
            'burpMCP.copyPrompt',
            'burpMCP.searchPrompts',
            'burpMCP.clearSearch',
            'burpMCP.showToolsReference',
            'burpMCP.addToFavorites',
            'burpMCP.removeFromFavorites',
            'burpMCP.refreshFavorites'
        ];

        for (const cmd of expectedCommands) {
            assert.ok(
                commands.includes(cmd),
                `Command ${cmd} should be registered`
            );
        }
    });
});
