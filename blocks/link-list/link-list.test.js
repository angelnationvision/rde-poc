import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { JSDOM } from 'jsdom';
import linkList from './link-list.js'; // replace with actual file name

let block;

beforeAll(() => {
  const dom = new JSDOM(
    '<!DOCTYPE html><html><body><div class="section link-list-container"></div></body></html>'
  );
  global.document = dom.window.document;
  global.window = dom.window;
});

describe('linkList (link list)', () => {
  beforeEach(() => {
    block = document.createElement('div');

    const createRow = (textContentOrHTML, isHTML = false) => {
      const row = document.createElement('div');
      const inner = document.createElement('div');
      if (isHTML) {
        inner.innerHTML = textContentOrHTML;
      } else {
        inner.textContent = textContentOrHTML;
      }
      row.appendChild(inner);
      return row;
    };

    const orientationRow = createRow('horizontal');
    const titleRow = createRow('List Title');
    const detailRow = createRow('<p>Item 1</p><p>Item 2</p>', true);

    block.appendChild(orientationRow);
    block.appendChild(titleRow);
    block.appendChild(detailRow);

    const parentSection = document.querySelector('.link-list-container');
    parentSection.appendChild(block);
  });

  it('should linkList block with correct structure and content', () => {
    linkList(block);

    expect(block.querySelector('.link-list-title')).toBeTruthy();
    expect(block.querySelector('.link-list-title').textContent).toBe('List Title');
    expect(block.querySelector('.link-list-detail')).toBeTruthy();
    expect(block.querySelector('.link-list-detail').innerHTML).toContain('<p>Item 1</p>');
    expect(block.parentElement.classList.contains('horizontal')).toBe(true);
  });

  it('should toggle detail section on mobile screen width', () => {
    linkList(block);

    // Simulate mobile screen
    global.window.innerWidth = 500;

    const titleElem = block.querySelector('.link-list-title');
    const detailElem = block.querySelector('.link-list-detail');

    // Initially collapsed
    expect(detailElem.style.maxHeight).toBe('');

    // Simulate click to expand
    titleElem.click();
    expect(titleElem.classList.contains('expand')).toBe(true);
    expect(detailElem.style.maxHeight).toBe(`${detailElem.scrollHeight}px`);

    // Simulate click to collapse
    titleElem.click();
    expect(titleElem.classList.contains('expand')).toBe(false);
    expect(detailElem.style.maxHeight).toBe('');
  });

  it('should not toggle detail section if screen width >= 768', () => {
    linkList(block);
    global.window.innerWidth = 1024;

    const titleElem = block.querySelector('.link-list-title');
    const detailElem = block.querySelector('.link-list-detail');

    titleElem.click();
    expect(titleElem.classList.contains('expand')).toBe(false);
    expect(detailElem.style.maxHeight).toBe('');
  });
});
