import { example } from "./modules/test.js"
import { getCatalog, getSchedule} from "./modules/fetch.js"

window.onload = async () => {
    //Code here executes when the page is ready

    console.log("Running...")
    //Prints to the console, useful for debugging, press F12 to view

    //document.body.innerHTML += await getCatalog();
    const catalog = await getCatalog();
    console.log(catalog)
    await catalog.response.courses.forEach((element) => {
        document.getElementById('courses').innerHTML += '<option value=' + element.name + '>' + element.major + ' ' + element.name + '</option>'
    });

    const schedule = await getSchedule(1);
    console.log(schedule)
    await schedule.schedule.semesters.forEach((element) => {
        element.forEach((course) => {
            console.log(course)
        })
    });
    /*
    Appends to the text inside the HTML body tag
    example function is an example on how to import and use other local JS files
    */

};