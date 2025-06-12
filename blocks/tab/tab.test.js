import { describe, it, expect, beforeEach, vi, beforeAll } from 'vitest';
import { JSDOM } from 'jsdom';
import decorate from './tab.js'; // Replace with actual path

beforeAll(() => {
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
  global.document = dom.window.document;
  global.window = dom.window;
});
// Mock toClassName helper
vi.mock('../../scripts/aem.js', () => ({
  toClassName: vi.fn(str => str.toLowerCase().replace(/\s+/g, '-')),
}));
function createMockBlock() {
  const block = document.createElement('div');
  const title = document.createElement('h2');
  title.textContent = 'My Sample Tab';
  const desc = document.createElement('p');
  desc.textContent = 'Description text';
  const filterLabel = document.createElement('div');
  filterLabel.textContent = 'Filter label';
  const linkBtn = document.createElement('div');
  const link = document.createElement('a');
  link.href = '#';
  link.textContent = 'See more';
  linkBtn.appendChild(link);
  // Simulate card item (4 children)
  const cardItem = document.createElement('div');
  for (let i = 0; i < 4; i += 1) {
    cardItem.appendChild(document.createElement('div'));
  }
  // Simulate image item (1 child)
  const imageItem = document.createElement('div');
  const pic = document.createElement('picture');
  imageItem.appendChild(pic);
  block.append(title, desc, filterLabel, linkBtn, cardItem, imageItem);
  // DOM structure required by decorate
  const wrapper = document.createElement('div');
  wrapper.className = 'tab-wrapper';
  wrapper.appendChild(block);
  const container = document.createElement('div');
  container.className = 'tab-container';
  container.dataset.variation = 'tabs-inline';
  container.dataset.activeType = 'others';
  container.dataset.tabId = 'My Sample Tab';
  container.appendChild(wrapper);
  document.body.appendChild(container);
  return block;
}
describe('decorate()', () => {
  let block;
  beforeEach(() => {
    document.body.innerHTML = '';
    block = createMockBlock();
  });
  it('should decorate the tab structure correctly', async () => {
    await decorate(block);
    const tabContainer = document.querySelector('.tab-container');
    const tabList = tabContainer.querySelector('.tabs-list');
    const button = tabList.querySelector('.tabs-tab');
    const panel = tabContainer.querySelector('.tabs-panel');
    expect(tabList).toBeTruthy();
    expect(button).toBeTruthy();
    expect(panel).toBeTruthy();
    expect(button.id).toBe('tab-my-sample-tab');
    expect(panel.id).toBe('tabpanel-my-sample-tab');
    expect(button.getAttribute('aria-controls')).toBe(panel.id);
  });
  it('should select the correct tab based on data attributes', async () => {
    await decorate(block);
    const selectedTab = document.querySelector('.tabs-tab[aria-selected="true"]');
    const visiblePanel = document.querySelector('.tabs-panel[aria-hidden="false"]');
    expect(selectedTab).toBeTruthy();
    expect(visiblePanel).toBeTruthy();
    expect(selectedTab.id).toBe('tab-my-sample-tab');
    expect(visiblePanel.id).toBe('tabpanel-my-sample-tab');
  });
  it('should not create a tab button if title is empty', async () => {
    block.querySelector('h2').textContent = '';
    await decorate(block);
    const tabList = document.querySelector('.tabs-list');
    const buttons = tabList.querySelectorAll('.tabs-tab');
    expect(buttons.length).toBe(0);
  });
});
