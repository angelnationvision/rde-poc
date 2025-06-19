import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { JSDOM } from 'jsdom';
import favIcon from './favorite-icon.js';

let favIconContainer;
let favIconWrapper;

beforeAll(() => {
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', { url: 'http://localhost' });
  global.window = dom.window;
  global.document = dom.window.document;

  // ✅ Mock matchMedia to prevent errors
  window.matchMedia =
    window.matchMedia ||
    function (query) {
      return {
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {}, // deprecated
        removeListener: () => {}, // deprecated
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      };
    };
});

describe('favIcon', () => {
  beforeEach(() => {
    // Setup DOM structure
    document.body.innerHTML = `
      <div class="nav-tools">
        <p><span class="icon-favourite-icon"></span></p>
        <p style="display:none;"><span class="icon-favourite-icon-active"></span></p>
      </div>
    `;

    favIconContainer = document.createElement('div');
    favIconWrapper = document.createElement('div');

    // Add 5 children to simulate the wrapper content
    for (let i = 0; i < 5; i++) {
      const child = document.createElement('div');
      if (i === 1) {
        const link = document.createElement('a');
        link.classList.add('button');
        child.appendChild(link);
      }
      favIconWrapper.appendChild(child);
    }
  });

  it('should decorate and attach modal and overlay', async () => {
    await favIcon(favIconContainer, favIconWrapper);

    const modal = document.querySelector('.fav-modal');
    const overlay = document.querySelector('.fav-overlay');

    expect(modal).toBeTruthy();
    expect(overlay).toBeTruthy();
    expect(modal.style.display).toBe('none');
    expect(overlay.style.display).toBe('none');

    const signoutGroup = favIconWrapper.querySelector('.fav-signout-group');
    const signinGroup = favIconWrapper.querySelector('.fav-signin-group');

    expect(signoutGroup?.children.length).toBe(3);
    expect(signinGroup?.children.length).toBe(2);

    const link = favIconWrapper.querySelector('.fav-signin a');
    expect(link?.classList.contains('text-btn')).toBe(true);
    expect(link?.classList.contains('button')).toBe(false);
  });
});
