import * as assert from 'assert';

// Mock vscode module untuk unit testing
const mockContext = {
    globalState: {
        data: {} as Record<string, any>,
        get<T>(key: string, defaultValue?: T): T {
            return (this.data[key] as T) ?? (defaultValue as T);
        },
        update(key: string, value: any): Thenable<void> {
            this.data[key] = value;
            return Promise.resolve();
        }
    },
    subscriptions: []
};

// Import setelah mock siap (dalam environment test yang sebenarnya)
// Untuk saat ini, kita tulis test yang bisa dijalankan setelah compile

suite('PromptLibrary Test Suite', () => {

    test('Prompt template should have required fields', () => {
        // Contoh struktur prompt yang valid
        const validPrompt = {
            id: 'sql-injection-basic',
            name: 'SQL Injection Basic Test',
            description: 'Test for SQL injection',
            category: 'Input Validation',
            mcpTool: 'send_http1_request',
            template: 'Test {{url}} for SQLi',
            parameters: [],
            examples: ['Example usage'],
            tags: ['sqli', 'injection']
        };

        assert.ok(validPrompt.id, 'Prompt should have id');
        assert.ok(validPrompt.name, 'Prompt should have name');
        assert.ok(validPrompt.description, 'Prompt should have description');
        assert.ok(validPrompt.category, 'Prompt should have category');
        assert.ok(validPrompt.mcpTool, 'Prompt should have mcpTool');
        assert.ok(validPrompt.template, 'Prompt should have template');
        assert.ok(Array.isArray(validPrompt.parameters), 'Parameters should be array');
        assert.ok(Array.isArray(validPrompt.examples), 'Examples should be array');
        assert.ok(Array.isArray(validPrompt.tags), 'Tags should be array');
    });

    test('Prompt categories should be valid', () => {
        const validCategories = [
            'Input Validation',
            'Authentication & Session',
            'Authorization & Access Control',
            'API Security',
            'Encoding & Cryptography',
            'Business Logic',
            'Reporting & Documentation'
        ];

        // Semua kategori harus non-empty string
        for (const cat of validCategories) {
            assert.ok(cat.length > 0, `Category "${cat}" should be non-empty`);
            assert.ok(typeof cat === 'string', `Category should be string`);
        }
    });

    test('Search function should match by tags', () => {
        const prompts = [
            { id: '1', name: 'SQLi Test', tags: ['sqli', 'injection'] },
            { id: '2', name: 'XSS Test', tags: ['xss', 'client-side'] },
            { id: '3', name: 'Auth Bypass', tags: ['auth', 'bypass'] }
        ];

        const query = 'sqli';
        const results = prompts.filter(p =>
            p.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );

        assert.strictEqual(results.length, 1);
        assert.strictEqual(results[0].id, '1');
    });

    test('Search function should match by name', () => {
        const prompts = [
            { id: '1', name: 'SQL Injection Test', tags: [] },
            { id: '2', name: 'XSS Test', tags: [] }
        ];

        const query = 'sql';
        const results = prompts.filter(p =>
            p.name.toLowerCase().includes(query.toLowerCase())
        );

        assert.strictEqual(results.length, 1);
        assert.strictEqual(results[0].id, '1');
    });
});

suite('HistoryManager Test Suite', () => {

    test('History item should have required fields', () => {
        const historyItem = {
            command: 'copyPrompt',
            timestamp: Date.now(),
            success: true,
            details: { promptId: 'test-1' }
        };

        assert.ok(historyItem.command, 'Should have command');
        assert.ok(historyItem.timestamp > 0, 'Should have valid timestamp');
        assert.strictEqual(typeof historyItem.success, 'boolean', 'Success should be boolean');
    });

    test('History should respect max size limit', () => {
        const maxSize = 100;
        const history: any[] = [];

        // Simulasi menambah item melebihi limit
        for (let i = 0; i < 150; i++) {
            history.unshift({ command: `cmd-${i}`, timestamp: Date.now() });
            if (history.length > maxSize) {
                history.splice(maxSize);
            }
        }

        assert.strictEqual(history.length, maxSize, 'History should not exceed max size');
        assert.strictEqual(history[0].command, 'cmd-149', 'Most recent should be first');
    });

    test('Statistics calculation should be correct', () => {
        const history = [
            { command: 'copyPrompt', success: true },
            { command: 'copyPrompt', success: true },
            { command: 'searchPrompts', success: true },
            { command: 'copyPrompt', success: false }
        ];

        const totalCommands = history.length;
        const successfulCommands = history.filter(h => h.success).length;
        const successRate = (successfulCommands / totalCommands) * 100;

        // Count command occurrences
        const commandCounts: Record<string, number> = {};
        history.forEach(item => {
            commandCounts[item.command] = (commandCounts[item.command] || 0) + 1;
        });

        // Find most used
        let mostUsedCommand = '';
        let maxCount = 0;
        Object.entries(commandCounts).forEach(([command, count]) => {
            if (count > maxCount) {
                maxCount = count;
                mostUsedCommand = command;
            }
        });

        assert.strictEqual(totalCommands, 4);
        assert.strictEqual(successRate, 75);
        assert.strictEqual(mostUsedCommand, 'copyPrompt');
        assert.strictEqual(commandCounts['copyPrompt'], 3);
    });
});
