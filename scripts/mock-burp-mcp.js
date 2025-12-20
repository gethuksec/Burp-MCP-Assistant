/**
 * Mock Burp MCP Server
 * Simulates the Burp Suite MCP server for testing integration.
 * This script implements a minimal JSON-RPC protocol over stdio.
 */

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

console.warn('🚀 Mock Burp MCP Server started');

rl.on('line', (line) => {
    try {
        const request = JSON.parse(line);

        // Minimal MCP/JSON-RPC response
        if (request.id) {
            let result = {};

            switch (request.method) {
                case 'initialize':
                    result = {
                        protocolVersion: '2024-11-05',
                        capabilities: {
                            tools: {
                                listChanged: false
                            }
                        },
                        serverInfo: {
                            name: 'Mock Burp MCP',
                            version: '1.0.0'
                        }
                    };
                    break;

                case 'tools/list':
                    result = {
                        tools: [
                            {
                                name: 'send_http1_request',
                                description: 'Send an HTTP/1.1 request',
                                inputSchema: {
                                    type: 'object',
                                    properties: {
                                        targetHostname: { type: 'string' },
                                        targetPort: { type: 'integer' },
                                        usesHttps: { type: 'boolean' },
                                        content: { type: 'string' }
                                    },
                                    required: ['targetHostname', 'targetPort', 'usesHttps', 'content']
                                }
                            }
                        ]
                    };
                    break;

                default:
                    result = { status: 'ok', method: request.method };
            }

            console.log(JSON.stringify({
                jsonrpc: '2.0',
                id: request.id,
                result
            }));
        }
    } catch (e) {
        console.error('Error processing request:', e.message);
    }
});
