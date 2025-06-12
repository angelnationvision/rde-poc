// blocks/icon-link-list/icon-link-list.test.js
import { describe, it, expect, beforeEach, vi, beforeAll } from 'vitest';
import { JSDOM } from 'jsdom';
import iconLinkList from './icon-link-list.js'; // Adjust to actual path

vi.mock('../icon/icon.js', () => ({
  generateIconDOM: vi.fn(() => {
    const icon = document.createElement('span');
    icon.className = 'mock-icon';
    return icon;
  }),
}));

beforeAll(() => {
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
  global.window = dom.window;
  global.document = dom.window.document;
});

describe('icon-link-list iconLinkList', () => {
  let block;

  beforeEach(() => {
    block = document.createElement('div');

    // Create 2 child panels
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 2; i++) {
      const panel = document.createElement('div');
      const iconType = document.createElement('div');
      iconType.textContent = i === 0 ? 'type-a' : 'type-b';
      const label = document.createElement('div');
      label.textContent = `Label ${i + 1}`;
      panel.appendChild(iconType);
      panel.appendChild(label);
      block.appendChild(panel);
    }
  });

  it('should iconLinkList the block and generate icon DOMs', () => {
    iconLinkList(block);

    const container = block.querySelector('.icon-link-list-container');
    expect(container).toBeTruthy();
    expect(container.children.length).toBe(2);

    [...container.children].forEach((panel, index) => {
      expect(panel.classList.contains('icon')).toBe(true);
      expect(panel.classList.contains('block')).toBe(true);
      expect(panel.classList.contains(index === 0 ? 'type-a' : 'type-b')).toBe(true);
      expect(panel.querySelector('.mock-icon')).toBeTruthy();
    });
  });
});
