import { example } from "./modules/test.js"
import { getCatalog, getSchedule,addCourse, deleteCourse} from "./modules/fetch.js"

const getSemester = async (schedule) => {
    document.getElementById('deleted').innerHTML = '<option value="None">None</option>';
    const semesters = ['freshman-fall', 'freshman-spring','sophomore-fall','sophomore-spring','junior-summer','junior-fall','senior-fall','senior-spring']
    await schedule.schedule.semesters.forEach((element, i) => {
        document.getElementById(semesters[i]).innerHTML = '<tr><th>' + semesters[i].replaceAll("-", " ").toUpperCase() + '</th></tr>'
        element.forEach((course) => {
            console.log(course)
            document.getElementById(semesters[i]).innerHTML += '<tr>' + course.id + ' ' + course.major + ' ' + course.name + '</tr>'
            document.getElementById("deleted").innerHTML += '<option value=' + course.name.replaceAll(" ", "-") + '>' + course.major + ' ' + course.name + '</option>'
        })
    });
}

window.onload = async () => {
    console.log("test")
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
        const semesters = ['freshman-fall', 'freshman-spring','sophomore-fall','sophomore-spring','junior-summer','junior-fall','senior-fall','senior-spring']
        let j = 0;
        var schedule;
        for (let i in semesters){
            console.log(semesters[i])
            const course = document.getElementById("deleted").value.replaceAll("-", " ");
            var dict = {
                "semester" : j,
                "courses" : [course]
                }
            console.log(dict)
            schedule = await deleteCourse(1,dict)
            console.log(await schedule)
            j++;
        }        //const semester = document.getElementById("").value;
        await getSemester(schedule)
    };
    
    console.log("Running...")
    //Prints to the console, useful for debugging, press F12 to view

    //document.body.innerHTML += await getCatalog();
    const catalog = await getCatalog();
    console.log("catalog", catalog)
    await catalog.response.courses.forEach((element) => {
        document.getElementById('courses').innerHTML += '<option value=' + element.name.replaceAll(" ", "-") + '>' + element.major + ' ' + element.name + '</option>'
    });

    const schedule2 = await getSchedule(1);
    console.log(schedule2)
    await getSemester(schedule2);
    /*
    Appends to the text inside the HTML body tag
    example function is an example on how to import and use other local JS files
    */

};