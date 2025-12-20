import * as path from 'path';
import Mocha from 'mocha';
import { glob } from 'glob';

export async function run(): Promise<void> {
    // Buat Mocha test runner
    const mocha = new Mocha({
        ui: 'tdd',
        color: true,
        timeout: 10000
    });

    const testsRoot = path.resolve(__dirname, '.');

    // Cari semua test files
    const files = await glob('**/**.test.js', { cwd: testsRoot });

    // Tambahkan files ke test suite
    files.forEach((f: string) => mocha.addFile(path.resolve(testsRoot, f)));

    // Jalankan tests
    return new Promise((resolve, reject) => {
        mocha.run((failures: number) => {
            if (failures > 0) {
                reject(new Error(`${failures} tests failed.`));
            } else {
                resolve();
            }
        });
    });
}
