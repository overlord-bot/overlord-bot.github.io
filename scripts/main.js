import { example } from "./components/test.js"

window.onload = () => {
    //Code here executes when the page is ready

    document.body.innerHTML += example();
    //An example on how to import and use other local JS files
};