function toggleLinkList(e) {
  if (window.innerWidth < 768) {
    if (e.target.classList.contains('expand')) {
      e.target.nextSibling.style.maxHeight = null;
      e.target.classList.remove('expand');
    } else {
      // let linkListTitleArr;
      const parentElem = e.target.closest('.section.link-list-container');
      if (parentElem) {
        // linkListTitleArr = parentElem.querySelectorAll('.link-list-title');
        // for (let i = 0; i < linkListTitleArr.length; i += 1) {
        //   linkListTitleArr[i].classList.remove('expand');
        //   linkListTitleArr[i].nextElementSibling.style.maxHeight = null;
        // }
        e.target.nextSibling.style.maxHeight = `${e.target.nextSibling.scrollHeight}px`;
        e.target.classList.add('expand');
      }
    }
  }
}

function generateLinkListDom(block) {
  const props = [...block.children].map(row => row.firstElementChild);
  const [linkListOrientation, linkListTitle, linkListDetail] = props;
  const orientationClassName = linkListOrientation.textContent || 'vertical';
  block.parentElement.classList.add(orientationClassName);

  const linkListTitleElem = document.createElement('h3');
  linkListTitleElem.classList.add('link-list-title');
  linkListTitleElem.textContent = linkListTitle.textContent;
  linkListTitleElem.addEventListener('click', toggleLinkList);

  const linkListDetailElem = document.createElement('div');
  linkListDetailElem.classList.add('link-list-detail');
  linkListDetailElem.innerHTML = linkListDetail.innerHTML;

  return [linkListTitleElem, linkListDetailElem];
}

export default function decorate(block) {
  const [linkListTitleElem, linkListDetailElem] = generateLinkListDom(block);
  block.textContent = '';
  block.append(linkListTitleElem);
  block.append(linkListDetailElem);
  // const parent = block.parentElement;
  // if (!parent?.classList.contains('horizontal')) {
  //   return;
  // }
  // const anchor = parent.querySelector('.link-list-detail ul li a');
  // anchor?.setAttribute('target', '_blank');
}
