import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) {
    const a = fragment.querySelector('.default-content-wrapper p');
    const currYear = new Date().getFullYear().toString();
    const originalCopyright = a.textContent;
    const updatedCopyright = originalCopyright.replace(/(\d{4})[–-]\d{4}/, `$1–${currYear}`);
    a.textContent = updatedCopyright;

    // checking if the div has radio button
    if (fragment.firstElementChild.hasAttribute('data-radio')) {
      if (fragment.firstElementChild.getAttribute('data-radio') === 'americas best') {
        block.classList.add('footer-americas-bg');
      } else if (fragment.firstElementChild.getAttribute('data-radio') === 'vistaOpt') {
        block.classList.add('footer-vistaopt-bg');
      } else if (fragment.firstElementChild.getAttribute('data-radio') === 'eyeglass') {
        block.classList.add('footer-eyeglass-bg');
      }
    }
    footer.append(fragment.firstElementChild);
  }

  block.append(footer);
}
