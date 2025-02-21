import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { setImpactColor, getTargetPath, argsChecker, getFileName, transformPath } from '../../src/utils/utils';
import { existsSync } from 'node:fs';
import path from 'node:path';

vi.mock('node:fs');
vi.mock('node:path');

describe('setImpactColor', () => {
  it('should return correct colors for different impacts', () => {
    expect(setImpactColor('critical')).toBe('red');
    expect(setImpactColor('serious')).toBe('yellow');
    expect(setImpactColor('moderate')).toBe('yellow');
    expect(setImpactColor('minor')).toBe('blue');
    expect(setImpactColor(null)).toBe('green');
    expect(setImpactColor(undefined)).toBe('green');
    expect(setImpactColor('unknown')).toBe('green');
  });
});

describe('getTargetPath', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(path.resolve).mockImplementation((...paths) => {
      return paths.join('/');
    });
    vi.spyOn(process, 'cwd').mockImplementation(() => '/test/path');
    vi.mocked(existsSync).mockReturnValue(true);
  });

  it('should handle current directory', () => {
    const mockConfig = { extensions: ['.html'] };

    const result = getTargetPath('.', mockConfig);
    expect(result).toBe('/test/path');
  });

  it('should throw error for non-existent path', () => {
    const mockConfig = { extensions: ['.html'] };
    vi.mocked(existsSync).mockReturnValue(false);
    const mockExit = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    getTargetPath('nonexistent', mockConfig);
    
    expect(mockExit).toHaveBeenCalledWith(1);
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should show compile reminder when lintingSourceFolder is set', () => {
    const mockConfig = { 
      extensions: ['.html'], 
      lintingSrouceFolder: 'dist' 
    };
    vi.mocked(existsSync).mockReturnValue(false);
    const mockExit = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    getTargetPath('nonexistent', mockConfig);
    
    expect(mockExit).toHaveBeenCalledWith(1);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Did you set lintingSrouceFolder in config file and forget to compile ?')
    );
  });
});

describe('argsChecker', () => {
  const originalArgv = process.argv;

  beforeEach(() => {
    process.argv = [...originalArgv];
  });

  afterEach(() => {
    process.argv = originalArgv;
  });

  it('should parse args correctly with --fix flag', () => {
    process.argv = ['node', 'script.js', '--fix', 'test.html'];
    const result = argsChecker();
    expect(result).toEqual({
      paths: ['test.html'],
      shouldFix: true
    });
  });

  it('should handle no arguments', () => {
    process.argv = ['node', 'script.js'];
    const mockExit = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    argsChecker();
    
    expect(mockExit).toHaveBeenCalledWith(1);
    expect(consoleSpy).toHaveBeenCalled();
  });
});

describe('getFileName', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // Mock path.basename implementation
    vi.mocked(path.basename).mockImplementation((filePath, ext = '') => {
      const base = filePath.split('/').pop() || '';
      return ext ? base.replace(ext, '') : base;
    });
    // Mock path.extname implementation
    vi.mocked(path.extname).mockImplementation((filePath) => {
      const match = filePath.match(/\.[^.]+$/);
      return match ? match[0] : '';
    });
  });

  it('should extract filename without extension', () => {

    expect(getFileName('path/to/file.txt')).toBe('file');
    expect(getFileName('file.test.js')).toBe('file.test');
    expect(getFileName('file')).toBe('file');
  });
});

describe('transformPath', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    Object.defineProperty(path, 'sep', {
      value: '/',
      configurable: true
    });
  });

  it('should return original path when no lintingSourceFolder', () => {
    const config = { extensions: ['.html'] };
    expect(transformPath('test.njk', config)).toBe('test.njk');
  });

  it('should return original path when lintingSourceFolder is empty', () => {
    const config = { extensions: ['.html'], lintingSrouceFolder: '' };
    expect(transformPath('test.njk', config)).toBe('test.njk');
  });

  it('should transform path with lintingSourceFolder', () => {
    const config = { extensions: ['.html'], lintingSrouceFolder: 'dist' };
    expect(transformPath('src/components/test.njk', config))
      .toBe('dist/components/test.html');
  });

  it('should handle single file path', () => {
    const config = { extensions: ['.html'], lintingSrouceFolder: 'dist' };
    expect(transformPath('test.njk', config)).toBe('dist/test.html');
  });

  it('should handle complex paths', () => {
    const config = { extensions: ['.html'], lintingSrouceFolder: 'dist' };
    expect(transformPath('src/deep/nested/path/test.component.njk', config))
      .toBe('dist/deep/nested/path/test.component.html');
  });
});