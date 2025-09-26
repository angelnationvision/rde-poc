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
      const searchText = "colspan-";
      console.log(nodeList.innerHTML.includes(searchText));
      
      /*const elementsArray = Array.from(nodeList);
      console.log("element array");
      console.log(elementsArray);
      const foundElement = elementsArray.find(element => {
              return element.innerHTML.includes(searchText); 
        }); 
        if (foundElement) {
          console.log("Found element:", foundElement);
        }  */

      if (nodeList.innerHTML.includes(searchText)) {
        console.log("true - Yes has object");
      }
      else {
        console.log("false - nope");
      }

    });
  });
  block.classList.remove(gapClass);
  block.classList.add(`columns-${cols.length}-cols`)
  block.classList.add('columns-main');

}
