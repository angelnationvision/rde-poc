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

  if (subheading) {
    subheading.classList.add('border-subheading');
  } else {
    headline.classList.add('border-headline');
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
  });

  block.innerHTML = '';
  block.append(dialog);

  return {
    block,
    showModal: () => {
      dialog.showModal();
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
        <div class="checkbox-label">
        <input type="checkbox" />
        <h4>${checkboxTitle}</h4>
        <img src="${iconsURL}" class="info-mark" alt="" loading="lazy" width="22" height="22"/>
        </div>
        <p class="helper-text">${helperText}</p>
    `);
    checkboxContainer.appendChild(fragment);

    block.textContent = '';
    block.appendChild(checkboxContainer);
  } else {
    block.textContent = '';
  }
}
