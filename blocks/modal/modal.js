import { loadFragment } from '../fragment/fragment.js';
import { buildBlock, decorateBlock, loadBlock, loadCSS } from '../../scripts/aem.js';
import { iconList } from '../icon/icon.js';

export async function createModal(contentNodes) {
  await loadCSS(`${window.hlx.codeBasePath}/blocks/modal/modal.css`);
  const dialog = document.createElement('dialog');
  const dialogContent = document.createElement('div');
  dialogContent.classList.add('modal-content');
  dialogContent.append(...contentNodes);
  dialog.append(dialogContent);

  const headline = dialogContent?.querySelector('.default-content-wrapper h2');
  const subheading = dialogContent?.querySelector('.default-content-wrapper h4');
  const ctaBtn = dialogContent?.querySelector('.button-nvi-container');

  if (ctaBtn) {
    ctaBtn.addEventListener('click', e => {
      const targetHref = e.target.getAttribute?.('href');
      const parentHref = e.target.parentElement?.getAttribute?.('href');

      if (targetHref === '#' || parentHref === '#') {
        e.preventDefault();
        dialog.close();
      }
    });
  }

  if (subheading) {
    subheading.insertAdjacentHTML('afterend', '<div class="border-headline"></div>');
    headline.style.paddingBottom = '12px';
  } else {
    headline?.insertAdjacentHTML('afterend', '<div class="border-headline"></div>');
  }

  const closeButton = document.createElement('button');
  closeButton.classList.add('close-button');
  closeButton.setAttribute('aria-label', 'Close');
  closeButton.type = 'button';
  closeButton.innerHTML = '<span class="icon icon-close"></span>';
  closeButton.addEventListener('click', () => dialog.close());
  dialog.prepend(closeButton);

  const block = buildBlock('modal', '');
  document.querySelector('main').append(block);
  decorateBlock(block);
  await loadBlock(block);

  // close on click outside the dialog
  dialog.addEventListener('click', e => {
    const { left, right, top, bottom } = dialog.getBoundingClientRect();
    const { clientX, clientY } = e;
    if (clientX < left || clientX > right || clientY < top || clientY > bottom) {
      dialog.close();
    }
  });

  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    block.remove();
    if (document?.body.classList.contains('newmodal')) {
      document?.querySelector('.lens-modal-overlay')?.classList?.add('open');
      document?.body?.classList?.add('lensmodal-open');
      document.body.classList.remove('newmodal');
    }
  });

  block.innerHTML = '';
  block.append(dialog);

  return {
    block,
    showModal: () => {
      dialog.showModal();
      dialog.focus();
      // reset scroll position
      setTimeout(() => {
        dialogContent.scrollTop = 0;
      }, 0);
      document.body.classList.add('modal-open');
    },
  };
}

export async function openModal(fragmentUrl) {
  const path = fragmentUrl.startsWith('http')
    ? new URL(fragmentUrl, window.location).pathname
    : fragmentUrl;

  const fragment = await loadFragment(path);
  const { showModal } = await createModal(fragment.childNodes);
  showModal();
}

export default function decorate(block) {
  const [checkboxType, checkboxLabel] = [...block.children].map(row => row.firstElementChild);
  const checkboxTitle = checkboxLabel?.querySelector('h4')?.textContent?.trim();
  const helperText = checkboxLabel?.querySelector('p')?.textContent?.trim();

  if (checkboxType?.textContent.trim().toLowerCase() === 'true') {
    const checkboxContainer = document.createElement('div');
    checkboxContainer.classList.add('checkbox__container');
    const iconsURL = iconList.infoMark;

    const fragment = document.createRange().createContextualFragment(`
      <div class="checkbox-label" aria-checked="false">
        <input type="checkbox" id="myCheckbox" role="checkbox" tabindex="0" />
        <h4>${checkboxTitle}</h4>
        <img src="${iconsURL}" class="info-mark" alt="More info" loading="lazy" width="22" height="22"/>
      </div>
      <p class="helper-text">${helperText}</p>
    `);

    checkboxContainer.appendChild(fragment);
    block.textContent = '';
    block.appendChild(checkboxContainer);

    // JS behavior to support toggling on click + keyboard
    const checkboxLabelEl = checkboxContainer.querySelector('.checkbox-label');
    const input = checkboxContainer.querySelector('input[type="checkbox"]');

    checkboxLabelEl.addEventListener('keydown', e => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();

        // Toggle manually on keyboard only
        input.checked = !input.checked;
        checkboxLabelEl.setAttribute('aria-checked', input.checked.toString());
      }
    });
 


    // Sync aria-checked on native click/interaction
    input.addEventListener('change', () => {
      checkboxLabelEl.setAttribute('aria-checked', input.checked.toString());
    });
  } else {
    block.textContent = '';
  }
}
