import { describe, it, expect, vi, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
import { JSDOM } from 'jsdom';
import headerCarousel, { updateCarousel, scrollRight, scrollLeft } from './header-carousel.js';

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

function createListItems(num) {
  return Array.from({ length: num }, () => document.createElement('li'));
}

describe('carousel functions', () => {
  let listItems;

  beforeEach(() => {
    listItems = createListItems(3);
  });

  it('updateCarousel adds active class to correct item and removes from others', () => {
    listItems[0].classList.add('active');
    updateCarousel(2, listItems);

    expect(listItems[0].classList.contains('active')).toBe(false);
    expect(listItems[1].classList.contains('active')).toBe(false);
    expect(listItems[2].classList.contains('active')).toBe(true);
  });

  it('scrollRight moves index forward and loops back', () => {
    listItems[0].classList.add('active');

    const newIndex = scrollRight(0, listItems);
    expect(newIndex).toBe(1);
    expect(listItems[1].classList.contains('active')).toBe(true);

    const wrapIndex = scrollRight(2, listItems);
    expect(wrapIndex).toBe(0);
    expect(listItems[0].classList.contains('active')).toBe(true);
  });

  it('scrollLeft moves index backward and loops correctly', () => {
    listItems[2].classList.add('active');

    const newIndex = scrollLeft(2, listItems);
    expect(newIndex).toBe(1);
    expect(listItems[1].classList.contains('active')).toBe(true);

    const wrapIndex = scrollLeft(0, listItems);
    expect(wrapIndex).toBe(2);
    expect(listItems[2].classList.contains('active')).toBe(true);
  });
});

describe('decorate function', () => {
  let block;

  beforeEach(() => {
    vi.useFakeTimers();

    block = document.createElement('div');

    const row1 = document.createElement('div');
    const props = document.createElement('div');
    row1.appendChild(props);

    const listItemsContainer = document.createElement('ul');
    ['Item 1', 'Item 2', 'Item 3'].forEach(text => {
      const li = document.createElement('li');
      li.textContent = text;
      listItemsContainer.appendChild(li);
    });
    props.appendChild(listItemsContainer);

    const row2 = document.createElement('div');
    const dummyChild = document.createElement('div');
    row2.appendChild(dummyChild);

    block.appendChild(row1);
    block.appendChild(row2);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('creates carousel with buttons and list items', () => {
    headerCarousel(block);

    const carousel = block.querySelector('.carousel-items');
    expect(carousel).toBeTruthy();

    const prevBtn = carousel.querySelector('button.prev-btn-left');
    const nextBtn = carousel.querySelector('button.next-btn-right');
    const ul = carousel.querySelector('ul');

    expect(prevBtn).toBeTruthy();
    expect(nextBtn).toBeTruthy();
    expect(ul).toBeTruthy();

    expect(block.children.length).toBe(1);
    expect(block.firstElementChild).toBe(carousel);
  });

  it('initializes with first item active', () => {
    headerCarousel(block);
    const lis = block.querySelectorAll('li');
    expect(lis[0].classList.contains('active')).toBe(true);
    expect(lis[1].classList.contains('active')).toBe(false);
  });

  it('auto scrolls every 3 seconds and updates active item', () => {
    headerCarousel(block);
    const lis = block.querySelectorAll('li');

    expect(lis[0].classList.contains('active')).toBe(true);

    vi.advanceTimersByTime(3000);

    expect(lis[0].classList.contains('active')).toBe(false);
    expect(lis[1].classList.contains('active')).toBe(true);

    vi.advanceTimersByTime(3000);

    expect(lis[1].classList.contains('active')).toBe(false);
    expect(lis[2].classList.contains('active')).toBe(true);
  });

  it('clicking next button scrolls right and resets interval', () => {
    headerCarousel(block);
    const carousel = block.querySelector('.carousel-items');
    const nextBtn = carousel.querySelector('button.next-btn-right');
    const lis = carousel.querySelectorAll('li');

    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
    const setIntervalSpy = vi.spyOn(global, 'setInterval');

    expect(lis[0].classList.contains('active')).toBe(true);

    nextBtn.click();

    expect(lis[0].classList.contains('active')).toBe(false);
    expect(lis[1].classList.contains('active')).toBe(true);

    expect(clearIntervalSpy).toHaveBeenCalled();
    expect(setIntervalSpy).toHaveBeenCalled();

    clearIntervalSpy.mockRestore();
    setIntervalSpy.mockRestore();
  });

  it('clicking prev button scrolls left and resets interval', () => {
    headerCarousel(block);
    const carousel = block.querySelector('.carousel-items');
    const prevBtn = carousel.querySelector('button.prev-btn-left');
    const nextBtn = carousel.querySelector('button.next-btn-right');
    const lis = carousel.querySelectorAll('li');

    // Move currentIndex to 1 by clicking next once
    nextBtn.click();
    expect(lis[1].classList.contains('active')).toBe(true);

    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
    const setIntervalSpy = vi.spyOn(global, 'setInterval');

    // Now click prev button to move back to 0
    prevBtn.click();

    expect(lis[1].classList.contains('active')).toBe(false);
    expect(lis[0].classList.contains('active')).toBe(true);

    expect(clearIntervalSpy).toHaveBeenCalled();
    expect(setIntervalSpy).toHaveBeenCalled();

    clearIntervalSpy.mockRestore();
    setIntervalSpy.mockRestore();
  });
});
