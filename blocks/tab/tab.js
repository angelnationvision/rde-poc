// eslint-disable-next-line import/no-unresolved
import { toClassName } from '../../scripts/aem.js';

export default async function decorate(block) {
  const [title, descp, filterLabel, linkBtn, ...tabsDivs] = [...block.children];
  const arrowSvgString = `
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
    <path d="M3.4375 16.4065C3.14583 16.1148 3 15.7815 3 15.4065C3 15.0107 3.14583 14.6773 3.4375 14.4065L9 8.81274L3.4375 3.21899C3.14583 2.94816 3 2.62524 3 2.25024C3 1.85441 3.13542 1.52108 3.40625 1.25024C3.69792 0.958577 4.03125 0.812744 4.40625 0.812744C4.80208 0.812744 5.14583 0.948161 5.4375 1.21899L12 7.81274C12.2917 8.08358 12.4375 8.41691 12.4375 8.81274C12.4375 9.20858 12.2917 9.54191 12 9.81274L5.4375 16.4065C5.14583 16.6773 4.80208 16.8127 4.40625 16.8127C4.03125 16.8127 3.70833 16.6773 3.4375 16.4065Z" fill="#295EDB"/>
  </svg>
  `;

  const cardItems = tabsDivs.filter(item => item.children.length === 4);
  const imageItems = tabsDivs.filter(item => item.children.length === 1);

  // Get the tab container closest to the block
  const tabsSection = block.closest('.tab-container');
  let tablistWrapper = tabsSection.querySelector('.tabs-list');

  if (!tablistWrapper) {
    tablistWrapper = document.createElement('div');
    tablistWrapper.className = 'tabs-list';
    tablistWrapper.setAttribute('role', 'tablist');
    if (tabsSection.dataset.variation) {
      const variation = tabsSection.dataset.variation || '';
      tabsSection.classList.add(variation);
    } else {
      tabsSection.classList.add('tabs-inline');
    }
  }

  // Generate an ID based on the title
  const id = toClassName(title.textContent);

  // Generate tab panels and add card items
  const cardWrapper = document.createElement('div');
  cardWrapper.className = 'tab-card-wrapper';
  if (cardItems.length > 0) {
    cardItems.forEach(item => {
      const [, , styleColors, styleImage] = [...item.children];
      if (styleColors.textContent) {
        const styleClrsArray = styleColors?.textContent?.split(',') || [];
        const decodedColors = styleClrsArray?.map(color => decodeURIComponent(color));
        styleColors.textContent = '';
        if (decodedColors.length > 0) {
          decodedColors?.forEach(clr => {
            const div = document.createElement('div');
            const span = document.createElement('span');
            div.className = 'tab-style-box';
            span.className = 'tab-style-color';
            span.style.backgroundColor = clr.trim();
            div.append(span);
            styleColors.appendChild(div);
          });
          styleColors.className = 'tab-style-list';
        }
      }
      if (styleImage.querySelector('picture')) {
        styleImage.className = 'tab-style-box';
        styleColors.appendChild(styleImage);
        styleColors.className = 'tab-style-list';
      }
      // Assuming you're appending card items correctly, wrap them in cardWrapper
      cardWrapper.appendChild(item);
    });
  }

  // Generate tab panels and add card items
  const brandWrapper = document.createElement('div');
  brandWrapper.className = 'tab-brand-wrapper';
  if (imageItems.length > 0) {
    imageItems.forEach(item => {
      // Assuming you're appending card items correctly, wrap them in cardWrapper
      brandWrapper.appendChild(item);
    });
  }

  // Create tab panel
  const tabpanel = block.closest('.tab-wrapper');
  tabpanel.className = 'tabs-panel';
  tabpanel.id = `tabpanel-${id}`;
  tabpanel.setAttribute('aria-hidden', true); // Initially hidden
  tabpanel.setAttribute('aria-labelledby', `tab-${id}`);
  tabpanel.setAttribute('role', 'tabpanel');
  const panelContent = document.createElement('div');
  panelContent.className = 'tab-panel-content';
  if (descp) {
    panelContent.appendChild(descp);
  }
  panelContent.appendChild(cardWrapper);
  if (filterLabel) {
    filterLabel.classList.add('filter-label');
    panelContent.appendChild(filterLabel);
  }
  panelContent.appendChild(brandWrapper);
  block.appendChild(panelContent);
  if (linkBtn) {
    const container = linkBtn.querySelector('a');
    if (container) {
      container.insertAdjacentHTML('beforeend', arrowSvgString);
    }
    block.appendChild(linkBtn);
  }

  // Create the tab button
  const button = document.createElement('button');
  button.className = 'tabs-tab';
  button.id = `tab-${id}`;
  button.innerHTML = title.innerHTML;
  button.setAttribute('aria-controls', `tabpanel-${id}`);
  button.setAttribute('aria-selected', false);
  button.setAttribute('role', 'tab');
  button.setAttribute('type', 'button');

  button.addEventListener('click', () => {
    tabsSection.querySelectorAll('[role=tabpanel]').forEach(panel => {
      panel.setAttribute('aria-hidden', true);
    });
    tablistWrapper.querySelectorAll('button').forEach(btn => {
      btn.setAttribute('aria-selected', false);
    });
    tabpanel.setAttribute('aria-hidden', false);
    button.setAttribute('aria-selected', true);
  });
  title.remove();

  const activeTypeTxt = tabsSection.dataset.activeType;
  const activeTabId = tabsSection.dataset.tabId;
  const currentTabId = id;

  const isMatch =
    activeTypeTxt === 'others' && activeTabId && toClassName(activeTabId) === currentTabId;
  // If this tab should be selected
  if (isMatch) {
    tablistWrapper.querySelector('[aria-selected="true"]')?.setAttribute('aria-selected', 'false');
    tabsSection.querySelector('[aria-hidden="false"]')?.setAttribute('aria-hidden', 'true');
    button.setAttribute('aria-selected', 'true');
    tabpanel.setAttribute('aria-hidden', 'false');
  } else {
    button.setAttribute('aria-selected', 'false');
    tabpanel.setAttribute('aria-hidden', 'true');
  }
  const existingSelected = tablistWrapper.querySelector('[aria-selected="true"]');
  if (!existingSelected) {
    button.setAttribute('aria-selected', 'true');
    tabpanel.setAttribute('aria-hidden', 'false');
  }
  if (title.textContent) {
    const existButton = tablistWrapper.querySelector(`#tab-${id}`);
    const existPanel = tabsSection.querySelector(`#tabpanel-${id}`);
    if (existButton && existPanel) {
      tablistWrapper.replaceChild(button, existButton);
    } else {
      tablistWrapper.appendChild(button);
    }
  }
  tabsSection.prepend(tablistWrapper);
  const tablist = tablistWrapper.querySelectorAll('.tabs-tab');

  tablist.forEach(item => {
    const tabId = item.id;
    if (tabId === '') {
      item.remove();
    } else {
      const panelId = tabId.replace('tab', 'tabpanel');
      const panel = tabsSection.querySelector(`#${panelId}`);
      if (!tabsSection.querySelector(`#${panelId}`)) {
        item.remove();
      } else {
        const allPanels = Array.from(tabsSection.querySelectorAll('[id^="tabpanel-"]'));
        const panelIndex = allPanels.indexOf(panel);
        if (panelIndex !== -1) {
          const allTabs = Array.from(tablistWrapper.querySelectorAll('.tabs-tab'));
          const currentTabIndex = allTabs.indexOf(item);

          if (currentTabIndex !== panelIndex) {
            tablistWrapper.removeChild(item);
            const refTab = tablistWrapper.querySelectorAll('.tabs-tab')[panelIndex];
            tablistWrapper.insertBefore(item, refTab || null);
          }
        }
      }
    }
  });
}
