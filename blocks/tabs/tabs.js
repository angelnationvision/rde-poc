import { toClassName } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

export default async function decorate(block) {
  const tabs = [...block.children];
  console.log(tabs);

  for (let index = 0; index < tabs.length; index++) {
    const tabWrapper = tabs[index];
    const [titleDiv, linkDiv] = [...tabWrapper.children];

    if (!titleDiv || !linkDiv) continue;

    const id = toClassName(titleDiv.textContent.trim());
    const linkEl = linkDiv.querySelector('a');
    const tabUrl = linkEl?.getAttribute('href') || linkEl?.getAttribute('title');
    linkDiv?.remove();

    tabWrapper.className = 'tabs-panel';
    tabWrapper.id = `tabpanel-${id}`;
    tabWrapper.setAttribute('role', 'tabpanel');
    tabWrapper.setAttribute('aria-hidden', true);

    if (tabUrl) {
      const contentHtml = await loadFragment(tabUrl);
      const contentContainer = document.createElement('div');
      contentContainer.className = 'tab-panel-content';
      if (contentHtml instanceof HTMLElement) {
        contentContainer.appendChild(contentHtml);
      } else if (typeof contentHtml === 'string') {
        contentContainer.innerHTML = contentHtml;
      }
      tabWrapper.appendChild(contentContainer);
    }

    const button = document.createElement('button');
    button.className = 'tabs-tab';
    button.id = `tab-${id}`;
    button.innerHTML = titleDiv.innerHTML;
    button.setAttribute('aria-controls', `tabpanel-${id}`);
    button.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');
    titleDiv.remove();

    button.addEventListener('click', () => {
      block.querySelectorAll('[role=tabpanel]').forEach((p) => p.setAttribute('aria-hidden', true));
      block
        .querySelectorAll('button[role=tab]')
        .forEach((b) => b.setAttribute('aria-selected', false));
      tabWrapper.setAttribute('aria-hidden', false);
      button.setAttribute('aria-selected', true);
    });

    let tablistWrapper = block.querySelector('.tabs-list');
    if (!tablistWrapper) {
      tablistWrapper = document.createElement('div');
      tablistWrapper.className = 'tabs-list';
      tablistWrapper.setAttribute('role', 'tablist');
      block.prepend(tablistWrapper);
    }

    tablistWrapper.appendChild(button);

    if (index === 0) {
      button.setAttribute('aria-selected', 'true');
      tabWrapper.setAttribute('aria-hidden', 'false');
    }
  }
}
