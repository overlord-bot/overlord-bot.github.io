import { example } from "./components/test.js"

window.onload = () => {
    //Code here executes when the page is ready

    document.body.innerHTML += example();
    //an example on how to import and use other JS files
};