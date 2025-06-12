/* eslint-disable */
const iconList = {
  facebook: '/icons/facebook.png',
  twitter: '/icons/x-logo.png',
  instagram: '/icons/instagram.png',
  youtube: '/icons/youtube.png'
};

export function generateIconDOM(props) {
  // Extract properties, always same order as in model, empty string if not set
  const [iconType, altText, iconLink] = props;
  let iconPath;
  let iconDom;
  const origin = window.location.host.match('author-(.*?).adobeaemcloud.com(.*?)') ? `${window.hlx.codeBasePath}` : '';
  iconPath = iconList[iconType.textContent];
  const iconsURL = `${origin}${iconPath}`;
  // Build DOM
  iconDom = document.createRange().createContextualFragment(`
    <a class="icon-container" href="${iconLink.textContent}" title="${altText.textContent}" tabindex="0">
    <img src="${iconsURL}" alt="${altText.textContent}" loading="lazy" width="28" height="28"/>
    </a>`);

  return iconDom;
}

export default function decorate(block) {
  // get the first and only cell from each row
  const props = [...block.children].map((row) => row.firstElementChild);
  const iconDOM = generateIconDOM(props);
  block.textContent = '';
  block.append(iconDOM);
}