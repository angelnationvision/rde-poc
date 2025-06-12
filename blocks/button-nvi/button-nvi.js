/* eslint-disable */

export default function decorate(block) {
  const buttonChildrens = [...block.children];
  const [btn, id, ariaLabel, classes, openInNewTabBool] = [...buttonChildrens];
  const cta = block?.querySelector('a.button');
  if (ariaLabel?.textContent) {
    cta.ariaLabel = ariaLabel.textContent.trim();
  }
  if(openInNewTabBool?.textContent.trim() === 'true') {
    cta.setAttribute('target', '_blank');
  }
  if (classes?.textContent.includes('americas')) {
    block.classList.add('americas');
  } else if (classes?.textContent.includes('eyeglass')) {
    block.classList.add('eyeglass');
  } else if (classes?.textContent.includes('discountcontacts')) {
    block.classList.add('discountcontacts');
  } else if (classes?.textContent.includes('vistaopt')) {
    block.classList.add('vistaopt');
  }
  if (classes) {
    block.removeChild(classes);
  }
  block?.removeChild(id);
  block?.removeChild(ariaLabel);
  block?.removeChild(openInNewTabBool);
}
