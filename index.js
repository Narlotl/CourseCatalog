/*
Node modules for PDF reading

const http = require('http');
const fs = require('fs');
const PDFParser = require('pdf2json');
var pdfFilePath = '/Users/lukefretwell/Documents/elias/course-catalog/data.pdf';*/

/*
PDF reading script

var data;
var final = [];
var text = '';
if (fs.existsSync(pdfFilePath)) {
    var pdfParser = new PDFParser('', 1);
    pdfParser.on("pdfParser_dataError", function (errData) {
        console.error(errData.parserError)
    });
    pdfParser.on("pdfParser_dataReady", function (pdfData) {
        data = String(pdfParser.getRawTextContent());
        var currentIndex = 0;
        while (data.indexOf('Term:', data.indexOf('Term:')) + currentIndex + 1 < data.length) {
            let index = data.indexOf('Term:', data.indexOf('Term:') + currentIndex + 1);
            let y = data.substring(index, data.indexOf('Term:', index + 1)).replaceAll('\r', '').replaceAll('‐', '−');
            let x = y.split('\n');
            let push = {
                'name': x[1].slice(x[1]),
                'schools': x[2].substring(0, x[2].search('[0-9]')).replaceAll(' ', '').split(''),
                'years': x[2].substring(x[2].search('[0-9]'), x[2].length).replace('11', '19').replaceAll('1', ' 1').replace('19', '11').replaceAll('9', '9 ').replaceAll('  ', ' ').split(' '),
                'previous_courses': x[3].replace('N/A', 'None'),
                'description': y.substring(y.indexOf(x[4]), y.indexOf('Grades:Schools:')).replaceAll('\n', '').replaceAll('+', ''),
                'term': y.substring(y.indexOf('Term:') + 5, y.indexOf('\n', y.indexOf('Term:') + 5))
            };
            if (push.years[0] == '')
                push.years.splice(0, 1);
            final.push(push);
            currentIndex += y.length;
        }
        final.forEach(course => {
            text += '<div class="course"><h3>'.concat(course.name).concat('</h3><p>Schools: ').concat(course.schools).concat('</p><p>Grades: ').concat(course.years.toString()).concat('</p><p>Required previous courses: ').concat(course.previous_courses).concat('</p><p>').concat(course.description).concat('</p></div>');
        });
        http.createServer(function (req, res) {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.write(text);
            res.end();
        }).listen(8080);
    });

    pdfParser.loadPDF(pdfFilePath);
} else {
    console.log('OOPs file not present in the downloaded folder');
}*/

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

var params = new URLSearchParams(location.search);
if (params.get('school') && params.get('grade')) {
    school = params.get('school');
    grade = params.get('grade');
    update();
}

function update() {
    params.set('school', school);
    params.set('grade', grade);
    location = location.href.replace(location.search, '').concat('?').concat(params);
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