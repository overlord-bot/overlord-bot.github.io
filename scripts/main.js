import { example } from "./components/test.js"

window.onload = () => {
    //Code here executes when the page is ready

    document.body.innerHTML += example();
    /*
        Appends to the text inside the HTML body tag
        example function is an example on how to import and use other local JS files
    */
};