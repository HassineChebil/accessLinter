import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { LinterOptions } from '../interfaces';

const CONFIG_FILE_NAMES = [
    'ay11lint.json',
    '.ay11lintrc'
];

export async function loadConfig(cwd: string): Promise<LinterOptions> {
    for (const fileName of CONFIG_FILE_NAMES) {
        const configPath = path.join(cwd, fileName);
        
        if (existsSync(configPath)) {
            try {
                if (fileName.endsWith('.json') || fileName === '.njklintrc') {
                    const content = readFileSync(configPath, 'utf8');
                    return JSON.parse(content);
                }
            } catch (error) {
                console.error(`Error loading config from ${configPath}:`, error);
            }
        }
    }
    
    return {extensions: ['.html']};
}