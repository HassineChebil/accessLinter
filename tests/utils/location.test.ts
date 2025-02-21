import { describe, it, expect } from 'vitest';
import { findElementLocation } from '../../src/utils/location';

describe('findElementLocation', () => {
  it('should find element location in a simple HTML string', () => {
    const html = '<div>\n  <button>Click me</button>\n</div>';
    const elementHtml = '<button>Click me</button>';

    const location = findElementLocation(html, elementHtml);

    expect(location).toEqual({
      line: 2,
      column: 3
    });
  });

  it('should handle elements with extra whitespace', () => {
    const html = '<div>\n  <button   >   Click   me   </button>\n</div>';
    const elementHtml = '<button   >   Click   me   </button>';

    const location = findElementLocation(html, elementHtml);

    expect(location).toEqual({
      line: 2,
      column: 3
    });
  });

  it('should return 0 for line and column when element is not found', () => {
    const html = '<div>\n  <button>Click me</button>\n</div>';
    const elementHtml = '<button>Not found</button>';

    const location = findElementLocation(html, elementHtml);

    expect(location).toEqual({
      line: 0,
      column: 0
    });
  });

  it('should handle multiple occurrences and return first match', () => {
    const html = '<div>\n  <span>Test</span>\n  <span>Test</span>\n</div>';
    const elementHtml = '<span>Test</span>';

    const location = findElementLocation(html, elementHtml);

    expect(location).toEqual({
      line: 2,
      column: 3
    });
  });

  it('should handle empty strings', () => {
    const html = '';
    const elementHtml = '<button>Click me</button>';

    const location = findElementLocation(html, elementHtml);

    expect(location).toEqual({
      line: 0,
      column: 0
    });
  });
});