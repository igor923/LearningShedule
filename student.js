/**
 * Created by a on 19.11.2016.
 */

Student();
function Student() {


    Student.studentPage=function (token) {
        var obj = {
            currentToken: token
        };

        $("#container").load("./student.html", function () {
            Student.sendRequest("/get/scheduler",obj,"tbl");
            Student.buttonOnclick("schedule","/get/scheduler","tbl",token);
            Student.buttonOnclick("attendance","/attendance",token);
            Student.buttonOnclick("payments","/payments",token);
    })};


    Student.buttonOnclick=function(id, path, divId,token) {

        $("#" + id).click(function () {
            var obj = {
                currentToken: token
            };
            Student.sendRequest(path, obj, divId);

        })

    };


    Student.sendRequest=function(path, obj, divId) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4) return;
            if (xhr.response == "/getSchedule") {
                if (xhr.response == "error") {
                    console.log("ERROR!!!")
                } else {
                    Student.tableSchedule(JSON.parse(xhr.response), divId)

                }
            }
            else if (path == "/get/scheduler") {
                if (xhr.response == "error") {
                    console.log("ERROR SCHEDULE")
                }
                /*it will be JSON*/
                else {

                    /*document.body.appendChild(fillSchedule(JSON.parse(xhr.response)));*/
                    Student.tableSchedule(JSON.parse(xhr.response), divId)

                }
            }
            else if (path == "/attendance") {
                if (xhr.response == "error") {
                    console.log("ERROR ATTENDNCE")
                }
                /*it will be JSON*/
                else {
                    var ttt = JSON.parse(xhr.response);
                    console.log(ttt);
                    /*document.body.appendChild(setTable(JSON.parse(xhr.response)));*/
                }

            }
            else if (path == "/payments") {
                if (xhr.response == "error") {
                    console.log("ERROR PAYMENTS")
                }
                /*it will be JSON*/
                else {
                    var ttt = JSON.parse(xhr.response);
                    console.log(ttt);
                    /*document.body.appendChild(setTable(JSON.parse(xhr.response)));*/
                }

            }


        };

        xhr.open("POST", path, true);
        xhr.send(JSON.stringify(obj));

    };


    Student.fillStartTabel=function() {

    };

    Student.tableSchedule=function(days, divId) {
        console.log(days);
        var scheduleTable = {

            sunDate0: days[0].date,
            sunTime0: days[0].time,
            sunCourse0: days[0].course,
            sunTeacherLName0: days[0].teacherLastName,
            sunTeacherName0: days[0].teacherName,
            sunAuditory0: days[0].auditory,


            sunDate1: days[1].date,
            sunTime1: days[1].time,
            sunCourse1: days[1].course,
            sunTeacherLName1: days[1].teacherLastName,
            sunTeacherName1: days[1].teacherName,
            sunAuditory1: days[1].auditory

            /* monTime0 : days.days[1].lessons[0].time,
             monSubj0 : days.days[1].lessons[0].subject,
             monTeacher0 : days.days[1].lessons[0].teacher,
             monClassRoom0 : days.days[1].lessons[0].classRoom,

             monTime1 : days.days[1].lessons[1].time,
             monSubj1 : days.days[1].lessons[1].subject,
             monTeacher1 : days.days[1].lessons[1].teacher,
             monClassRoom1 : days.days[1].lessons[1].classRoom*/

        };

        var tbl = document.getElementById(divId);
        tbl.rows[0].cells[0].innerHTML = scheduleTable.sunDate0 + "<br>" + scheduleTable.sunTime0;
        tbl.rows[0].cells[1].innerHTML = scheduleTable.sunCourse0 + "<br>" + scheduleTable.sunTeacherName0 + "<br>" + scheduleTable.sunTeacherLName0 + "<br>" + "auditory: " + scheduleTable.sunAuditory0;
        tbl.rows[1].cells[0].innerHTML = scheduleTable.sunDate1 + "<br>" + scheduleTable.sunTime1;
        tbl.rows[1].cells[1].innerHTML = scheduleTable.sunCourse1 + "<br>" + scheduleTable.sunTeacherName1 + "<br>" + scheduleTable.sunTeacherLName1 + "<br>" + "auditory: " + scheduleTable.sunAuditory1;
        /*   tbl.rows[0].cells[2].innerText=scheduleTable.monTime0;
         tbl.rows[0].cells[3].innerHTML=scheduleTable.monSubj0+"<br>"+scheduleTable.monTeacher0+"<br>"+scheduleTable.monClassRoom0;
         tbl.rows[1].cells[2].innerText=scheduleTable.monTime1;
         tbl.rows[1].cells[3].innerHTML=scheduleTable.monSubj1+"<br>"+scheduleTable.monTeacher1+"<br>"+scheduleTable.monClassRoom1;*/

    };

    Student.fillAttendance=function() {

    };

    Student.fillPayments=function() {

    };

}