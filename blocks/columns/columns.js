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

      const colspan = "colspan-";
      const selection = col;
      let i = -1;

      console.info("SELECTION", selection);
      let targetIndex;
      while(++i < selection.length){
        if(selection[i].innerHTML.indexOf(colspan) > -1) {
          targetIndex = i;
        }
      }
      console.info("targetIndex", targetIndex);
      console.info("TARGET", selection[targetIndex]);





/*
      const nodeList = col; 
      const searchText = "colspan-";
      console.log(nodeList.innerHTML.includes(searchText));
      
        let i = -1;

        console.info("SELECTION", nodeList);
        let targetIndex;
        while(++i < selection.length){
          if(selection[i].innerHTML.indexOf(searchText) > -1){
            targetIndex = i;
          }
        }
        console.info("targetIndex", targetIndex);
        console.info("TARGET", selection[targetIndex]);

      if (nodeList.innerHTML.includes(searchText)) {
        console.log("true - Yes has object");
       }
      else {
        console.log("false - nope");
      }*/

    });
  });
  block.classList.remove(gapClass);
  block.classList.add(`columns-${cols.length}-cols`)
  block.classList.add('columns-main');

}
