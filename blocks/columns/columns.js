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
      console.log(col);
      // 1. Get your NodeList (e.g., from document.querySelectorAll)
const nodeList = col; // Example: Select all <div> elements

// 2. Define the text you're looking for
const searchText = "colspan-5";

// 3. Convert the NodeList to an array and filter it
const matchingElements = Array.from(nodeList).filter(element => {
  // Check if the element's textContent contains the searchText
  return element.textContent.includes(searchText);
});

// 4. The matchingElements array contains elements with the text
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
