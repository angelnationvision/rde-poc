/* eslint-disable linebreak-style */
import { describe, it, expect, beforeAll } from 'vitest';
// eslint-disable-next-line import/no-extraneous-dependencies
import { JSDOM } from 'jsdom';
import accordion from './accordion.js';

let document;

beforeAll(() => {
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
  global.window = dom.window;
  global.document = dom.window.document;
  document = dom.window.document;
});

describe('decorate accordion block', () => {
  // Helper to build a block with optional collapse flag
  const createBlock = (collapseText = 'true', panelCount = 2) => {
    const block = document.createElement('div');

    // First child: configuration panel
    const configPanel = document.createElement('div');
    const configText = document.createElement('div');
    configText.textContent = collapseText;
    configPanel.appendChild(configText);
    block.appendChild(configPanel);

    // Add multiple panels with labels and body text
    for (let i = 0; i < panelCount; i += 1) {
      const panel = document.createElement('div');

      const label = document.createElement('div');
      label.textContent = `Panel ${i + 1} Label`;

      const copy = document.createElement('div');
      copy.textContent = `Panel ${i + 1} Content`;

      panel.append(label, copy);
      block.appendChild(panel);
    }

    return block;
  };

  it('removes the config panel after reading collapse setting', async () => {
    const block = createBlock('true');
    await accordion(block);
    expect(block.children.length).toBe(2); // only panels remain
  });

  it('adds accordion-panel class to each panel', async () => {
    const block = createBlock();
    await accordion(block);
    [...block.children].forEach(panel => {
      expect(panel.classList.contains('accordion-panel')).toBe(true);
    });
  });

  it('wraps panel content in <details> with <summary> and <div>', async () => {
    const block = createBlock();
    await accordion(block);

    const firstPanel = block.children[0];
    const details = firstPanel.querySelector('details');
    const summary = details.querySelector('summary');
    const body = details.querySelector('.accordion-item-body');

    expect(details).not.toBeNull();
    expect(summary).not.toBeNull();
    expect(body).not.toBeNull();
    expect(summary.textContent).toContain('Panel 1 Label');
    expect(body.textContent).toContain('Panel 1 Content');
  });

  it('opens the first accordion item if collapse is true or omitted', async () => {
    const block = createBlock('true');
    await accordion(block);

    const firstDetails = block.querySelector('details');
    expect(firstDetails.hasAttribute('open')).toBe(true);
  });

  it('does NOT open the first accordion item if collapse is false', async () => {
    const block = createBlock('false');
    await accordion(block);

    const firstDetails = block.querySelector('details');
    expect(firstDetails.hasAttribute('open')).toBe(false);
  });

  it('handles empty copyText gracefully', async () => {
    const block = createBlock();

    const secondPanel = block.children[1];
    const copyText = secondPanel.children[1];

    // Set empty string to simulate empty copyText
    copyText.textContent = '';

    await accordion(block);

    const secondDetails = secondPanel.querySelector('details');
    const body = secondDetails.querySelector('.accordion-item-body');

    // It should not contain copyText
    expect(body.childElementCount).toBe(0);
  });
});
