export default function decorate(block) {
    const addClassesc = (element, classesc) => {
    classesc.split(',').forEach((c) => {
      element.classList.add(toClassName(c.trim()));
    });
  };
  console.log("angel test");
  console.log(addClassesc);
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });
}
