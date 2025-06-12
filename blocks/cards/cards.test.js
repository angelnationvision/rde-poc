import { vi, describe, it, expect, beforeAll } from 'vitest';
import { JSDOM } from 'jsdom';
import decorate from './cards.js';
import { createOptimizedPicture } from '../../scripts/aem.js';

beforeAll(() => {
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
  global.document = dom.window.document;
  global.window = dom.window;
});

// Mock external dependencies
vi.mock('../../scripts/aem.js', () => ({
  createOptimizedPicture: vi.fn().mockImplementation((src, alt) => {
    const picture = document.createElement('picture');
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    picture.appendChild(img);
    return picture;
  }),
}));

vi.mock('../../scripts/scripts.js', () => ({
  moveInstrumentation: vi.fn(),
}));

describe('decorate function', () => {
  it('should create a <ul> element and populate it with <li> elements', () => {
    // Create a mock block with child elements
    const block = document.createElement('div');
    const row1 = document.createElement('div');
    const row2 = document.createElement('div');
    row1.innerHTML = '<p>Card 1 Content</p>';
    row2.innerHTML = '<p>Card 2 Content</p>';
    block.appendChild(row1);
    block.appendChild(row2);

    // Call the decorate function
    decorate(block);

    // Check if <ul> was created and added to block
    const ul = block.querySelector('ul');
    expect(ul).not.toBeNull();
    expect(ul.children.length).toBe(2); // Should have two <li> elements

    // Check if <li> elements have the correct classes
    const li1 = ul.children[0];
    const li2 = ul.children[1];
    expect(li1.classList.contains('cards-card-1')).toBe(true);
    expect(li2.classList.contains('cards-card-2')).toBe(true);
  });

  it('should apply the correct classes based on the content', () => {
    // Create a mock block with child elements
    const block = document.createElement('div');
    const row = document.createElement('div');
    row.innerHTML = `
    <div><picture><img src="image.jpg" alt="Card image"></picture></div> <!-- This ensures .cards-card-image is applied -->
    <div><p>aspect-ratio-16x9</p></div> <!-- This ensures .cards-img-aspect-ratio is applied -->
    <div><p>Metadata</p></div>
    <div><p>Text</p></div>
    <div><p>Title</p></div>
  `;
    block.appendChild(row);

    // Call the decorate function
    decorate(block);

    // Check if classes are applied correctly to the elements
    const li = block.querySelector('ul li');
    expect(li).not.toBeNull(); // Ensure that <li> exists
    expect(li.querySelector('.cards-card-image')).not.toBeNull();
    expect(li.querySelector('.cards-img-aspect-ratio')).not.toBeNull();
    expect(li.querySelector('.cards-card-title')).toBeNull();
  });

  it('should apply the target="_blank" attribute to links when btnTargetValue is true', () => {
    // Create a mock block with a row containing a button container
    const block = document.createElement('div');
    const row = document.createElement('div');
    row.innerHTML = `
      <div><p>Some content</p></div>
      <div><p>Some more content</p></div>
      <div><p>true</p></div> <!-- This should trigger the target="_blank" -->
      <div class="button-container">
        <a href="https://example.com">Example</a>
      </div>
    `;
    block.appendChild(row);

    // Call the decorate function
    decorate(block);

    // Check if target="_blank" is applied to the link
    const link = block.querySelector('a');
    expect(link).not.toBeNull();
    if (link.getAttribute('target') === '_blank') {
      expect(link.getAttribute('target')).toBe('_blank');
    } else {
      expect(link.getAttribute('target')).toBe(null);
    }
  });

  it('should create optimized pictures for images', () => {
    // Create a mock block with an image
    const block = document.createElement('div');
    const row = document.createElement('div');
    row.innerHTML = '<div><picture><img src="image.jpg" alt="test" /></picture></div>';
    block.appendChild(row);

    // Call the decorate function
    decorate(block);

    // Check if createOptimizedPicture was called
    expect(createOptimizedPicture).toHaveBeenCalledWith('image.jpg', 'test', false, [
      { width: '750' },
    ]);
  });
});
