import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';

suite('Integration Test Suite', () => {

    test('Prompts should reference existing MCP tools', () => {
        // List of known tools in Burp MCP
        const knownTools = [
            'send_http1_request',
            'send_http2_request',
            'create_repeater_tab',
            'send_to_intruder',
            'get_proxy_http_history',
            'get_proxy_http_history_regex',
            'get_proxy_websocket_history',
            'get_scanner_issues',
            'base64_encode',
            'base64_decode',
            'url_encode',
            'url_decode',
            'generate_random_string',
            'set_proxy_intercept_state',
            'set_task_execution_engine_state'
        ];

        // Load all prompts
        const promptsDir = path.resolve(__dirname, '../../../../resources/prompts');
        if (!fs.existsSync(promptsDir)) {
            // Skip if dir doesn't exist (e.g. in some test environments)
            return;
        }

        const files = fs.readdirSync(promptsDir).filter(f => f.endsWith('.json'));

        for (const file of files) {
            const content = fs.readFileSync(path.join(promptsDir, file), 'utf8');
            const prompts = JSON.parse(content);

            for (const prompt of prompts) {
                assert.ok(
                    knownTools.includes(prompt.mcpTool),
                    `Prompt "${prompt.id}" references unknown tool "${prompt.mcpTool}"`
                );
            }
        }
    });

    test('Prompt templates should be valid markdown/text', () => {
        const promptsDir = path.resolve(__dirname, '../../../../resources/prompts');
        if (!fs.existsSync(promptsDir)) {return;}

        const files = fs.readdirSync(promptsDir).filter(f => f.endsWith('.json'));

        for (const file of files) {
            const content = fs.readFileSync(path.join(promptsDir, file), 'utf8');
            const prompts = JSON.parse(content);

            for (const prompt of prompts) {
                assert.ok(prompt.template.length > 10, `Template for "${prompt.id}" is too short`);
                // Check if template uses parameters that are defined
                const paramMatches = prompt.template.match(/{{(.*?)}}/g);
                if (paramMatches) {
                    const definedParams = prompt.parameters.map((p: any) => p.name);
                    for (const match of paramMatches) {
                        const paramName = match.replace(/{{|}}/g, '').trim();
                        // Some prompts might have global parameters or standard placeholders
                        assert.ok(definedParams.includes(paramName), `Param "${paramName}" not defined in "${prompt.id}"`);
                    }
                }
            }
        }
    });
});
