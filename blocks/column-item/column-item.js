export default function decorate(block) {
    console.log("column item");
const colspan = document.querySelector('[class*="colspan"]');
    console.log(colspan);
 if (colspan) {
    console.log("colspan is here");
 }
}
