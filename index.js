/*
_name: the course title
_schools: the schools the course is offered at
_years: the grades the course can be taken
_prev: the courses requiered before taking this course
_desc: the course description
_term: how long the course lasts
*/

var html = `
<div class="course">
<h3>_name</h3>
<ul>
<li><strong>Schools:</strong> _schools</li>
<li><strong>Grades:</strong> _years</li>
<li><strong>Required previous courses:</strong> _prev</li>
<li><strong>Length:</strong> _term</li>
</ul>
<div class="description">_desc</div>
</div>`;
var courses = new Array();

var req = new XMLHttpRequest();
req.open('GET', 'data.json', true);
req.onload = function () {
    var data = JSON.parse(this.response);
    data.forEach(course => {
        courses.push(course);
    });
};
req.send();

var school = '*';
var grade = '*';
var amount = 0;

function schoolChange(value) {
    school = value;
    update();
}

function gradeChange(value) {
    grade = value;
    update();
}

function update() {
    amount = 0;
    document.querySelector('div.courses').innerHTML = '<div class="go-to"><h3>Subjects</h3><ul></ul></div>';
    courses.forEach(course => {
        try {
            if ((course.schools.includes(school) || school == '*') && (course.years.includes(grade) || grade == '*')) {
                document.querySelector('div.courses').innerHTML += html.replaceAll('_name', course.name).replaceAll('_prev', course.previous_courses).replaceAll('_term', course.term).replaceAll('_desc', course.description).replaceAll('_schools', course.schools.toString().replaceAll(',', ', ')).replaceAll('_years', course.years.toString().replaceAll(',', ', '));
                amount++;
            }
        } catch (e) {
            document.querySelector('div.courses').innerHTML += '<h1 id="'.concat(course).concat('">').concat(course).concat('</h1>');
            document.querySelector('div.go-to > ul').innerHTML += '<li><a href="#'.concat(course).concat('">').concat(course).concat(' </a></li>');
        }
    });
    document.querySelector('div.courses').innerHTML = '<div class="alert alert-primary"><strong>' + amount + ' courses!</strong ></div > ' + document.querySelector('div.courses').innerHTML;
}