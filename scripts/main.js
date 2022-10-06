import { example } from "./modules/test.js"

window.onload = () => {
    //Code here executes when the page is ready

    console.log("Running...")
    //Prints to the console, useful for debugging, press F12 to view

    document.body.innerHTML += example();
    /*
    Appends to the text inside the HTML body tag
    example function is an example on how to import and use other local JS files
    */
};