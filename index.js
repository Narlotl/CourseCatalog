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
/*
var params = new URLSearchParams(location.search);
if (params.get('school') && params.get('grade')) {
    school = params.get('school');
    grade = params.get('grade');
    update();
}
*/
function update() {
    /*
    params.set('school', school);
    params.set('grade', grade);
    location = location.href.replace(location.search, '').concat('?').concat(params);*/
    amount = 0;
    document.querySelector('div.courses').innerHTML = '';
    courses.forEach(course => {
        try {
            if ((course.schools.includes(school) || school == '*') && (course.years.includes(grade) || grade == '*')) {
                document.querySelector('div.courses').innerHTML += html.replaceAll('_name', course.name).replaceAll('_prev', course.previous_courses).replaceAll('_term', course.term).replaceAll('_desc', course.description).replaceAll('_schools', course.schools.toString().replaceAll(',', ', ')).replaceAll('_years', course.years.toString().replaceAll(',', ', '));
                amount++;
            }
        } catch (e) { document.querySelector('div.courses').innerHTML += '<h1>'.concat(course).concat('</h1>'); }
    });
    document.querySelector('div.courses').innerHTML = '<div class="alert alert-primary"><strong>' + amount + ' courses!</strong ></div > ' + document.querySelector('div.courses').innerHTML;
}
//document.querySelector('div.courses').innerHTML += html.replaceAll('_name', course.name).replaceAll('_prev', course.previous_courses).replaceAll('_term', course.term).replaceAll('_desc', course.description).replaceAll('_schools', course.schools.toString().replaceAll(',', ', ')).replaceAll('_years', course.years.toString().replaceAll(',', ', '))
