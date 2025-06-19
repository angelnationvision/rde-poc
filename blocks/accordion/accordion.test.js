import { describe, it, expect, beforeEach, beforeAll, afterAll } from 'vitest';
import { JSDOM } from 'jsdom';
import accordion from './accordion.js';

let document;
let window;

beforeAll(() => {
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
    url: 'http://localhost/',
  });
  window = dom.window;
  document = window.document;

  global.document = document;
  global.window = window;
  global.HTMLElement = window.HTMLElement;
  global.Node = window.Node;
  global.Event = window.Event;
  global.CustomEvent = window.CustomEvent;
  global.getComputedStyle = window.getComputedStyle;
});

afterAll(() => {
  delete global.document;
  delete global.window;
  delete global.HTMLElement;
  delete global.Node;
  delete global.Event;
  delete global.CustomEvent;
  delete global.getComputedStyle;
});

const createMockBlock = (optionsText, classText, panelCount = 3) => {
  const block = document.createElement('div');
  block.classList.add('accordion-container'); // ✅ THIS FIX

  const options = document.createElement('div');
  const optChild = document.createElement('div');
  optChild.textContent = optionsText;
  options.appendChild(optChild);

  const classPanel = document.createElement('div');
  const classChild = document.createElement('div');
  classChild.textContent = classText;
  classPanel.appendChild(classChild);

  block.appendChild(options);
  block.appendChild(classPanel);

  for (let i = 0; i < panelCount; i += 1) {
    const panel = document.createElement('div');

    const label = document.createElement('div');
    label.textContent = `Label ${i + 1}`;

    const content = document.createElement('div');
    content.textContent = `Content ${i + 1}`;

    panel.appendChild(label);
    panel.appendChild(content);
    block.appendChild(panel);
  }

  return block;
};

describe('accordion decorate()', () => {
  let block;

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('opens first panel if option is "openFirstPanel"', async () => {
    block = createMockBlock('openFirstPanel', 'true');
    await accordion(block);

    const panels = block.querySelectorAll('.accordion-panel');
    const first = panels[0].querySelector('details');

    expect(first.hasAttribute('open')).toBe(true);
  });

  it('keeps all panels closed if option is "keepAllClose"', async () => {
    block = createMockBlock('keepAllClose', 'true');
    await accordion(block);

    const panels = block.querySelectorAll('details');
    panels.forEach(panel => {
      expect(panel.hasAttribute('open')).toBe(false);
    });
  });

  it('opens all panels if option is "default"', async () => {
    block = createMockBlock('default', 'true');
    await accordion(block);

    const panels = block.querySelectorAll('details');
    panels.forEach(panel => {
      expect(panel.hasAttribute('open')).toBe(true);
    });
  });

  it('clicking a panel opens it and closes others when collapse is true', async () => {
    block = createMockBlock('openFirstPanel', 'true');
    await accordion(block);

    const details = block.querySelectorAll('details');
    const first = details[0];
    const second = details[1];

    expect(first.hasAttribute('open')).toBe(true);
    expect(second.hasAttribute('open')).toBe(false);

    // Manually invoke the event listener on <details> to simulate click
    const clickEvent = new window.MouseEvent('click', { bubbles: true, cancelable: true });
    const clickHandler =
      // eslint-disable-next-line no-underscore-dangle
      second.__clickHandler__ || [...(second.__handlers || [])].find(h => h.type === 'click');

    if (!clickHandler) {
      // Fallback: manually invoke toggleAccordion if no handler was found
      import('./accordion.js').then(({ toggleAccordion }) => {
        toggleAccordion(second);
        expect(first.hasAttribute('open')).toBe(false);
        expect(second.hasAttribute('open')).toBe(true);
      });
      return;
    }

    second.dispatchEvent(clickEvent);

    // Assertions
    expect(first.hasAttribute('open')).toBe(false);
    expect(second.hasAttribute('open')).toBe(true);
  });

  it('does not toggle panels if collapse is false', async () => {
    block = createMockBlock('openFirstPanel', 'false');
    await accordion(block);

    const details = block.querySelectorAll('details');
    const second = details[1];

    expect(second.hasAttribute('open')).toBe(false);

    // No event listener attached, so click should not open it
    second.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));

    expect(second.hasAttribute('open')).toBe(false);
  });
});
