import { example } from "./modules/test.js"
import { getCatalog, getSchedule,addCourse} from "./modules/fetch.js"

const deleteCourse =  async (schedule) => {
    
}

const getSemester = async (schedule) => {
    await schedule.schedule.semesters.forEach((element) => {
        element.forEach((course) => {
            console.log(course)
            document.getElementById('freshman-fall').innerHTML += '<tr>' + course.id + ' ' + course.major + ' ' + course.name + '</tr>'
            document.getElementById('deleted').innerHTML += '<option value=' + course.name.replaceAll(" ", "-") + '>' + course.major + ' ' + course.name + '</option>'
        })
    });
}
window.onload = async () => {
    //Code here executes when the page is ready
    document.getElementById("submit").onclick = async () => {
        document.getElementById('freshman-fall').innerHTML = ''
        const course = document.getElementById("courses").value.replaceAll("-", " ");;
        const semester = document.getElementById("semester").value;
        var dict = {
            "semester" : semester,
            "courses" : [course]
        }
        console.log(dict)
        const schedule = await addCourse(1,dict)
        console.log(await schedule)
        await getSemester(schedule)
    };
    
    document.getElementById("delete").onclick = async () => {
        document.getElementById('freshman-fall').innerHTML = ''
        const course = document.getElementById("courses").value.replaceAll("-", " ");;
        const semester = document.getElementById("semester").value;
        var dict = {
            "semester" : semester,
            "courses" : [course]
        }
        console.log(dict)
        const schedule = await deleteCourse(1,dict)
        console.log(await schedule)
        await getSemester(schedule)
    


    console.log("Running...")
    //Prints to the console, useful for debugging, press F12 to view

    //document.body.innerHTML += await getCatalog();
    const catalog = await getCatalog();
    console.log(catalog)
    await catalog.response.courses.forEach((element) => {
        document.getElementById('courses').innerHTML += '<option value=' + element.name.replaceAll(" ", "-") + '>' + element.major + ' ' + element.name + '</option>'
    });

    const schedule = await getSchedule(1);
    console.log(schedule)
    await getSemester(schedule);
    /*
    Appends to the text inside the HTML body tag
    example function is an example on how to import and use other local JS files
    */

};