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
      const nodeList = col; 
      const searchText = "colspan-5";
      console.log(nodeList.innerHTML.includes(searchText));

      if (nodeList.innerHTML.includes(searchText)) {
        console.log("Yes has object");
      }
      else {
        console.log("nope");
      }
    
      const matchingElements = Array.from(nodeList).filter(element => {
        return element.innerHTML.includes(searchText);
      });

      if (matchingElements.length > 0) {
        console.log("Found matching elements:", matchingElements);
      } else {
        console.log("No matching elements found.");
      }

    });
  });
  block.classList.remove(gapClass);
  block.classList.add(`columns-${cols.length}-cols`)
  block.classList.add('columns-main');

}
