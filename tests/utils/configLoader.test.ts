import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { loadConfig } from '../../src/utils/configLoader';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

// Mock fs and path modules
vi.mock('node:fs');
vi.mock('node:path');

describe('loadConfig', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should load JSON config file when it exists', async () => {
    const mockConfig = {
      extensions: ['.njk', '.html'],
      ignore: ['node_modules/**']
    };

    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(readFileSync).mockReturnValue(JSON.stringify(mockConfig));
    vi.mocked(path.join).mockReturnValue('/test/path/ay11lint.json');

    const config = await loadConfig('/test/path');
    
    expect(config).toEqual(mockConfig);
    expect(existsSync).toHaveBeenCalledWith('/test/path/ay11lint.json');
    expect(readFileSync).toHaveBeenCalledWith('/test/path/ay11lint.json', 'utf8');
  });

  it('should return default config when no config file exists', async () => {
    vi.mocked(existsSync).mockReturnValue(false);

    const config = await loadConfig('/test/path');
    
    expect(config).toEqual({ extensions: ['.html'] });
    expect(existsSync).toHaveBeenCalledTimes(2); // Checks both possible config files
  });

  it('should handle JSON parse errors', async () => {
    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(readFileSync).mockReturnValue('invalid json');
    vi.mocked(path.join).mockReturnValue('/test/path/ay11lint.json');

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const config = await loadConfig('/test/path');
    
    expect(config).toEqual({ extensions: ['.html'] });
    expect(consoleSpy).toHaveBeenCalled();
  });
});