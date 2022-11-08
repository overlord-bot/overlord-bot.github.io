import { example } from "./modules/test.js"
import { getCatalog, getSchedule,addCourse, deleteCourse} from "./modules/fetch.js"

const getSemester = async (schedule) => {
    document.getElementById('deleted').innerHTML = '<option value="None">None</option>';
    const semesters = ['freshman-fall', 'freshman-spring','sophomore-fall','sophomore-spring','junior-summer','junior-fall','senior-fall','senior-spring']
    await schedule.schedule.semesters.forEach((element, i) => {
        if(semesters[i] !== undefined) {
            document.getElementById(semesters[i]).innerHTML = '<tr><th>' + semesters[i].replaceAll("-", " ").toUpperCase() + '</th></tr>'
            element.forEach((course) => {
                console.log(course)
                document.getElementById(semesters[i]).innerHTML += '<tr>' + course.id + ' ' + course.major + ' ' + course.name + '</tr>'
                document.getElementById("deleted").innerHTML += '<option value=' + course.name.replaceAll(" ", "-") + '>' + course.major + ' ' + course.name + '</option>'
            })
        }
    });
}

const run = async (userid) => {
    document.getElementById("scheduleSelect").onclick = async () => {
    if (document.getElementById("scheduleSelect").value== "newSchedule")
    {
        alert("What would you like to name your schedule?");

    }
}
    //Code here executes when the page is ready
    document.getElementById("submit").onclick = async () => {
    if (document.getElementById("courses").value == "None" || document.getElementById("semester").value == "None" )
    {
        alert("None is not a valid option");
    }
    else
    {
    document.getElementById('freshman-fall').innerHTML = ''
    const course = document.getElementById("courses").value.replaceAll("-", " ");;
    const semester = document.getElementById("semester").value;
    var dict = {
        "semester" : semester,
        "courses" : [course]
    }
    console.log(dict)
    const schedule = await addCourse(1,dict,userid)
    console.log(await schedule)
    await getSemester(schedule)
}
    };
 
    document.getElementById("delete").onclick = async () => {
        if (document.getElementById("deleted").value == "None")
        {
            alert("None is not a valid option");
        }
        else
        {
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
            schedule = await deleteCourse(1,dict,userid)
            console.log(await schedule)
            j++;
        }        //const semester = document.getElementById("").value;
        await getSemester(schedule)
    }
    
    };
    
    console.log("Running...")
    //Prints to the console, useful for debugging, press F12 to view

    //document.body.innerHTML += await getCatalog();
    const catalog = await getCatalog();
    console.log("catalog", catalog)
    await catalog.response.courses.forEach((element) => {
        document.getElementById('courses').innerHTML += '<option value=' + element.name.replaceAll(" ", "-") + '>' + element.major + ' ' + element.name + '</option>'
    });

    const schedule2 = await getSchedule(1,userid);
    console.log(schedule2)
    await getSemester(schedule2);
    
}

window.onload = async () => {

    console.log(document.cookie)
    if(document.cookie !== '') {
        document.getElementById("loginContainer").style.display = "none";
        let user = document.cookie
            .split('; ')
            .find((row) => row.startsWith('user='))
            ?.split('=')[1];
        let header = document.getElementById("logout");
        header.innerHTML = '<h2>' + user + '</h2>';
        run(user);
    }

    document.getElementById("login").onsubmit = async (e) => {
        e.preventDefault();
        let userid = document.getElementById("userid").value;
        let header = document.getElementById("logout");
        header.innerHTML = '<h2>' + userid + '</h2>';
        document.cookie = "user=" + userid;
        document.getElementById("loginContainer").style.display = "none";
        document.getElementById("scheduleSelect").style.display = "flex";
        run(userid);
    }

    document.getElementById("logout").onclick = () => {
        if(document.cookie !== '') {
            document.cookie = "user=; expires=Thu, 18 Dec 2013 12:00:00 UTC";
            console.log(document.cookie);
            console.log("logout");
            document.getElementById("loginContainer").style.display = "flex";
            document.getElementById("scheduleSelect").style.display = "none";
            document.getElementById("logout").innerHTML = '';
        }
    };
};