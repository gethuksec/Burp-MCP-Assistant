import * as path from 'path';
import { runTests } from '@vscode/test-electron';

async function main() {
    try {
        // Path ke folder extension yang berisi package.json
        const extensionDevelopmentPath = path.resolve(__dirname, '../../');

        // Path ke test suite
        const extensionTestsPath = path.resolve(__dirname, './suite/index');

        // Download VS Code, unzip, dan jalankan integration tests
        await runTests({
            extensionDevelopmentPath,
            extensionTestsPath,
        });
    } catch (err) {
        console.error('Failed to run tests:', err);
        process.exit(1);
    }
}

main();
