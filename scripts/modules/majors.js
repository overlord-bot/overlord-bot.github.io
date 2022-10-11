//https://www.w3schools.com/howto/howto_js_filter_lists.asp
document.getElementById('search_input').addEventListener('keyup', sortList)

//import { class_results } from '../../json/class_results.json';
import class_results from '../../json/class_results.json' assert {type: 'json'};
//const class_results = require('../../json/class_results.json');


function sortList() {
    // Declare variables
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById('search_input');
    filter = input.value.toUpperCase();
    ul = document.getElementById("majorUL");
    li = ul.getElementsByTagName('li');
  
    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName("a")[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
}

function populateMajors() { //Add majors to search list
    for (var key in class_results) {
        if (class_results.hasOwnProperty(key)) {
            console.log(key);
        }
    }
}

populateMajors()

