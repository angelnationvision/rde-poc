export default async function decorate(block) {
  const [logo, pageText, logoUrl, rightArrow, startLevel, ...itemDivs] = [...block.children];

  const logoUrlPath = logoUrl?.querySelector('a')?.getAttribute('href') || '';
  logoUrl.remove();

  const rightArrowTag = rightArrow?.querySelector('picture') || '';
  rightArrow.remove();
  const startLevelValue = Number(startLevel?.querySelector('p')?.textContent) || 1;
  startLevel.remove();

  const breadcrumb = document.createElement('div');
  breadcrumb.classList.add('breadcrumb-nav');

  if (startLevelValue <= 1) {
    if (logo?.querySelector('picture') && logo.closest('.block').classList.contains('logo')) {
      const link = document.createElement('a');
      const pictureTag = logo.querySelector('picture');
      link.appendChild(pictureTag);
      link.href = logoUrlPath;
      logo.textContent = '';
      breadcrumb.appendChild(link);
      breadcrumb.appendChild(rightArrowTag.cloneNode(true));
      pageText.remove();
    } else {
      logo.remove();
      if (pageText?.querySelector('p')) {
        const pageTitle = pageText.querySelector('p').textContent.trim();
        const link = document.createElement('a');
        link.textContent = pageTitle;
        link.href = logoUrlPath;
        pageText.textContent = '';
        breadcrumb.appendChild(link);
        breadcrumb.appendChild(rightArrowTag.cloneNode(true));
      } else {
        pageText.remove();
      }
    }
  }
  logo.remove();
  pageText.remove();

  let isFirst = true;
  itemDivs.forEach((div, index) => {
    if (index + 2 >= startLevelValue) {
      const titleDiv = div.querySelector(':scope > div:nth-child(1)');
      const label = titleDiv?.querySelector('p')?.textContent?.trim() || '';
      const href = div.querySelector('a')?.getAttribute('href') || '#';

      const hideItemText = div
        .querySelector(':scope > div:nth-child(3) p')
        ?.textContent?.trim()
        ?.toLowerCase();
      const hideItem = hideItemText === 'true';

      if (!hideItem) {
        const link = document.createElement('a');
        link.textContent = label;
        link.href = href;

        if (!isFirst && rightArrowTag && label) {
          breadcrumb.appendChild(rightArrowTag.cloneNode(true));
        }

        if (index === itemDivs.length - 1) {
          link.classList.add('active');
        }

        breadcrumb.appendChild(link);
        isFirst = false;
      }
    }
    div.textContent = '';
  });

  block.appendChild(breadcrumb);
}
