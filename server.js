var express = require("express");
// var bodyParser = require("body-parser");
var http = require("http");
var url = require('url');
var mysql = require('mysql');
var app = express();
var port = 3000;
var headers = require('./headers');
var dataBaseName = 'learningscheduler';
var randtoken = require('rand-token');
var uid = require('rand-token').uid;
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: dataBaseName
});

// connection.query(tableAuthScript, function (err, res, fields) {console.log(err);});
// connection.query(tableStudentScript, function (err, res, fields) {console.log(err);});
/*
 *

 SELECT l.timeLesson, cl.numerClassRoom, cr.descriptionCourse, u.name FROM lessons l INNER JOIN classrooms cl on l.idClassRoom = cl.idClassRoom INNER JOIN courses cr on l.idCourse = cr.idCourse INNER JOIN users u on u.idUser = (SELECT idUserTeacher from courses where idCourse = l.idCourse) and l.idCourse in (SELECT idCourse from courses WHERE idGroup in (SELECT idGroup from studentsingroups WHERE idUserStudent = (SELECT idUser from users WHERE currentToken = 'q100500q')))
 SELECT l.idLEsson , l.startLesson, l.endLesson, u.idUser as idUserStudent, u.name as studentName, u.lastName as studentLastName, u.accessLevel, c.descriptionCourse as course, uu.name as teacherName, uu.lastName as teacherLastName from lessons l INNER JOIN users u on u.idUser in ( select idUserStudent FROM studentsingroups where idGroup in ( select idGroup from courses where idUserTeacher in ( SELECT idUser from users where currentToken='UOQBHZAlkqTbWIz4YSdqbDcfI4p3nDGf' ) and idGroup in ( SELECT idGroup FROM courses WHERE idCourse = l.idCourse ) ) ) INNER JOIN users uu on uu.idUser in ( SELECT idUser from users where currentToken='UOQBHZAlkqTbWIz4YSdqbDcfI4p3nDGf' ) INNER JOIN courses c on c.idCourse in ( SELECT idCourse from courses where idUserTeacher in( SELECT idUser from users where currentToken='UOQBHZAlkqTbWIz4YSdqbDcfI4p3nDGf' ) ) and c.idCourse = l.idCourse WHERE (now() BETWEEN l.startLesson and l.endLesson)



 * * */

app.listen(port, function () {
    console.log("Started on PORT " + port);
});
app.get('/*', function (getReq, getRes) {
    headers.setHeaders(getRes);
    getReq.on('data', function (chunk) {
        console.log(chunk)
    });
    getReq.on('end', function (getData) {
        switch (getReq.path) {
            // default page
            case '/': {
                getRes.sendfile("index.html");
                break;
            }
            // all other files needed
            default: {
                getRes.sendfile(getReq.path.replace('/', ''));
            }
        }
    });
});


app.post('/*', function (postReq, postRes) {
    var bodyStringData = '';
    var bodyData = {};
    postReq.on("data", function (chunk) {
        bodyStringData = bodyStringData + chunk;
    });

    postReq.on("end", function () {
        bodyData = JSON.parse(bodyStringData);
        console.log("bodyStringData ", bodyStringData);
        console.log("bodyData ", bodyData);
        var result = {};
        switch (postReq.path) {
            case '/auth/user': {
                var name = postRes.bodyData.name;
                var pass = postRes.bodyData.pass;
                var sqlScript = 'select pass from auth where ?';
                connection.query(sqlScript, {name: name}, function (sqlErr, sqlRes) {
                    if (!sqlRes) {
                        console.log(sqlErr)
                    } else if (sqlRes.length !== 0) {
                        if (pass === sqlRes[0].pass) {
                            result.status = 'ok';
                            result.token = uid(16);

                            console.log('ok');
                        }
                        else if (pass !== sqlRes[0].pass) {
                            result.status = 'error';
                            result.field = '#pass';
                            result.reason = 'password incorrect';
                        }
                    }
                    else if (sqlRes.length === 0) {
                        result.status = 'error';
                        result.field = '#user';
                        result.reason = 'name not found';
                    }
                    else if (sqlErr) {
                        console.log(sqlErr);
                        result.status = 'error';
                        result.reason = 'query password failed';
                        result.fullErrorText = sqlErr;
                    }
                    console.log(sqlRes); //>>>[0].pass
                    console.log(result); //>>>[0].pass
                    postRes.end(JSON.stringify(result));
                });
                break;
            }
            case '/role/user': {
                name = postRes.bodyData.name;
                sqlScript = 'select roleName from roles  ' +
                    'where idRole=(select idRole from users where ?)';
                connection.query(sqlScript, {name: name}, function (sqlErr, sqlRes) {
                    if (!sqlRes) {
                        console.log(sqlErr)
                    } else if (sqlRes.length !== 0) {
                        result.status = 'ok';
                        result.role = sqlRes[0].roleName;
                    }
                    else if (sqlRes.length === 0) {
                        result.status = 'error';
                        result.reason = 'name not found';
                    }
                    else if (sqlErr) {
                        result.status = 'error';
                        result.reason = 'query failed';
                        result.fullErrorText = sqlErr;
                    }
                    postRes.end(JSON.stringify(result));
                });
                // });
                break;
            }
            case '/schedule/user':
            case '/schedule/teacher': {

                break;
            }
            case '/check/token': {
                result = {};
                sqlScript = 'select * from users where ?';
                login = bodyData.login;
                token = bodyData.token;
                connection.query(sqlScript, {currentToken: token}, function (sqlErr, sqlRes, sqlFields) {
                        // console.log('error: ', sqlErr);
                        if (sqlErr) {
                            result.status = 'error';
                            result.reason = 'sql reqest failed';
                            result.fullErrorText = sqlErr;
                            console.log(sqlErr);
                        }
                        else if (sqlRes.length == 0) {
                            result.status = 'error';
                            result.reason = 'token not found';
                        }
                        else if (sqlRes[0].currentToken.valueOf() == token.valueOf()) {
                            result.status = 'ok';
                            result.reason = 'token passed';
                            result.accessLevel = sqlRes[0].accessLevel;
                            result.login = sqlRes[0].login;

                        }
                        console.log(token);
                        console.log(login);
                        console.log(sqlRes);
                        postRes.end(JSON.stringify(result));
                    }
                )
                break;
            }
            case '/create/user': {
                result = {};
                sqlScript = 'insert into users set ?';
                connection.query(sqlScript, bodyData, function (sqlErr, sqlRes, sqlFields) {
                    console.log(sqlErr);
                    console.log(sqlRes);
                    result = sqlRes;
                    postRes.end(JSON.stringify(result));
                });

                break;
            }
            case '/get/scheduler': {
                console.log(bodyData);
                sqlScript = "" +
                    "SELECT " +
                    "l.startLesson as time," +
                    "cl.numerClassRoom as auditory, " +
                    "cl.cityClassRoom as city, " +
                    "cr.descriptionCourse as course,  " +
                    "u.name as teacherName, " +
                    "u.lastName as teacherLastName " +
                    "FROM lessons l INNER JOIN classrooms cl on l.idClassRoom = cl.idClassRoom " +
                    "INNER JOIN courses cr on l.idCourse = cr.idCourse " +
                    "INNER JOIN users u on u.idUser = (SELECT idUserTeacher from courses where idCourse = l.idCourse) " +
                    "and l.idCourse in " +
                    "(SELECT idCourse from courses WHERE idGroup in " +
                    "(SELECT idGroup from studentsingroups WHERE idUserStudent = " +
                    "(SELECT idUser from users WHERE ?)))";
                connection.query(sqlScript, {currentToken: bodyData.currentToken}, function (sqlErr, sqlRes, sqlFields) {
                    console.log(sqlErr);
                    console.log(sqlRes);
                    result = sqlRes;
                    postRes.end(JSON.stringify(result));
                });
                break;
            }
            case '/set/token': {
                // console.log(bodyData);
                //check login - password
                sqlScript = "select login,pass,accessLevel from users where ?"
                sqlBody = {login: bodyData.login}
                console.log(sqlBody);
                connection.query(sqlScript, sqlBody, function (sqlErr, sqlRes, sqlFields) {
                    console.log('sqlRes length:', sqlRes.length, "");
                    console.log('sqlRes :', sqlRes, "");
                    if (sqlErr) {
                        result.status = 'error';
                        result.reason = 'sql error';
                        result.fullErrorText = sqlErr;
                        postRes.end(JSON.stringify(result));
                    }
                    else if (sqlRes.length == 0) {
                        result.status = 'error';
                        result.reason = 'login not found';
                        postRes.end(JSON.stringify(result));
                    }
                    else if (bodyData.pass.valueOf() == sqlRes[0].pass.valueOf()) {
                        result.status = 'ok';
                        result.newToken = uid(32);
                        result.accessLevel = sqlRes[0].accessLevel;
                        console.log('newToken: ', result.newToken, " ");
                        sqlScriptToken = "UPDATE `users` SET `currentToken` = '" + result.newToken + "' WHERE ?";
                        connection.query(sqlScriptToken, {login: bodyData.login}, function (sqlErr, sqlRes, sqlFields) {
                            //TODO: WORK WITH ERRORS
                            console.log('result', result);
                            postRes.end(JSON.stringify(result));
                        });
                    }


                });


                // TODO: return status:ok / error
                // TODO: return new token
                // TODO: insert new token into db

                break;
            }
            case '/get/students': {
                console.log(bodyData);
                // hidden sql script!
                {
                    sqlScript = "" +
                        "SELECT " +
                        "l.idLEsson , " +
                        "l.startLesson, " +
                        "l.endLesson, " +
                        "u.idUser as idUserStudent, " +
                        "u.name as studentName, " +
                        "u.lastName as studentLastName, " +
                        "u.accessLevel, " +
                        "c.descriptionCourse as course, " +
                        "uu.name as teacherName, " +
                        "uu.lastName as teacherLastName " +
                        "from lessons l " +
                        "" +
                        "INNER JOIN users u on u.idUser in (" +
                        "   select idUserStudent FROM studentsingroups where idGroup in ( " +
                        "       select idGroup from courses where idUserTeacher in ( " +
                        "           SELECT idUser from users where currentToken='" +
                        bodyData.currentToken +
                        "' " +
                        "       ) and " +
                        "   idGroup in ( " +
                        "       SELECT idGroup FROM courses WHERE idCourse = l.idCourse " +
                        "   ) " +
                        ") " +
                        ") " +
                        "" +
                        "INNER JOIN users uu on uu.idUser in ( " +
                        "   SELECT idUser from users where currentToken='" +
                        bodyData.currentToken +
                        "' " +
                        ") " +
                        "" +
                        "INNER JOIN courses c on c.idCourse in ( " +
                        "   SELECT idCourse from courses where idUserTeacher in( " +
                        "       SELECT idUser from users where currentToken='" +
                        bodyData.currentToken +
                        "' ) ) " +
                        "" +
                        "and c.idCourse = l.idCourse WHERE (now() BETWEEN l.startLesson and l.endLesson)"
                }
                sqlBody = {currentToken: bodyData.currentToken};
                connection.query(sqlScript, sqlBody, function (sqlErr, sqlRes, sqlFields) {
                    console.log('/STUDENTS/');
                    console.log(sqlRes);
                    console.log('/STUDENTS/');
                    postRes.send(JSON.stringify(sqlRes))
                });

                break;
            }
            case '/set/attendance': {
                // console.log(bodyData);
                // TODO: CHECK privilegies by !TOKEN!
                sqlScript = "INSERT INTO `attendance` set ?"
                sqlBody = {
                    idLesson: bodyData.idLesson,
                    idUserStudent: bodyData.idUserStudent,
                    presence:bodyData.presence
                };
                connection.query(sqlScript, sqlBody, function (sqlErr, sqlRes, sqlFields) {
                    if (sqlErr) {
                        console.log('/ERROR/');
                        console.log(sqlErr);
                        console.log('/ERROR/');
                        result.status = 'error';
                        result.reason = 'sql error';
                        result.fullErrorText = sqlErr;
                    }else {
                        result.status='ok';
                        result.reason='record added';
                        result.fullResultText=sqlErr;
                    }
                    // postRes.send(JSON.stringify(sqlRes));
                    postRes.send(JSON.stringify(result));
                });
                break;
            }
            default: {
                console.log("default");
            }
        }
    });
});
