export default function decorate(block) {
const cols = [...block.firstElementChild.children];
const attr = document.querySelector('[class*="gap-"]');
const gapName = attr.className.split(" ");
const gapClass = gapName[1];

// setup columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      col.parentElement.classList.add('grid-container', gapClass);
      col.parentElement.setAttribute("style",`grid-template-columns: repeat(${cols.length}, 1fr)`);
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }
    const colnode = "colnode-";

     if (col.innerHTML.includes(colnode)) {
        const all_elements_array = Array.from(document.querySelectorAll('*'));
        const matching_elements = all_elements_array.filter(element => element.innerHTML.includes(colnode));
        console.log('Found elements:', matching_elements);
        const getElement = matching_elements.at(-1);
        console.log("get Element", getElement);
        const eleString = getElement.textContent.trim().slice(5, 0);
        console.log(eleString);
        //const remove = getElement.remove();
       }
    });
  });
  block.classList.remove(gapClass);
  block.classList.add(`columns-${cols.length}-cols`)
  block.classList.add('columns-main');

}
