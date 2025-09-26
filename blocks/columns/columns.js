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
    var nodeList = col;

// Get a list of all elements as an array
const all_elements_array = Array.from(document.querySelectorAll('*'));

// Define the string you are looking for
const search_string = 'colnode-';

// Filter the array to get only the elements that include the string in their innerHTML
const matching_elements = all_elements_array.filter(element => element.innerHTML.includes(search_string));

console.log('Found elements:', matching_elements);

matching_elements.classList.add("test");

//Good Code Below

     if (nodeList.innerHTML.includes(colnode)) {

        console.log("true - Yes has object");
        console.log(col);

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
