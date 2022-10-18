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
          var ul = document.getElementById("majorUL");
          var li = document.createElement("li");
          var a = document.createElement("a");

          a.textContent = key
          a.setAttribute('href', "#")
          li.appendChild(a);
          ul.appendChild(li);
        }
    }
}

function display_major_info(major){
  var classes = class_results[major]
  for (var list_num in classes){
    var major_class = classes[list_num]
    console.log(major_class)

    var classDiv = document.getElementById("classesDiv")
    var typeLi = document.createElement("li");
    var creditsLi = document.createElement("li");
    var majorLi = document.createElement("li");
    var courseLi = document.createElement("li");
    typeLi.appendChild(document.createTextNode("Type: " + major_class["type"]));
    creditsLi.appendChild(document.createTextNode("Credits: " + major_class["credits"]));
    majorLi.appendChild(document.createTextNode("Major: " + major_class["major"]));
    courseLi.appendChild(document.createTextNode("Course ID: " + major_class["id"]));

    
    

    classDiv.append(document.createTextNode(major_class["name"]))
    classDiv.append(typeLi)
    classDiv.append(creditsLi)
    classDiv.append(majorLi)
    classDiv.append(courseLi)
  }
}

function clear_past_classes(){
  document.getElementById('classesDiv').innerHTML = '';
}

populateMajors()


document.getElementById("majorUL").addEventListener("click",function(e) {
  //var major = window.location.hash.substr(1)
  var major = e.target.textContent  
  console.log(e.target.textContent)

  document.getElementById("search_input").value = major
  sortList()
  clear_past_classes()
  display_major_info(major)
})


//var type = window.location.hash.substr(1);
//console.log(type)