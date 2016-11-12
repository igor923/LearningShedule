var express = require("express");
var bodyParser = require("body-parser");
var http = require("http");
const url = require('url');
var mysql = require('mysql');
var app = express();
var port = 3000;

var tableStudentScript = "" +
    "CREATE TABLE IF NOT EXISTS `students` (    " +
    "`idStudent` int(11) UNSIGNED AUTO_INCREMENT ,    " +
    "`firstName` varchar(35) DEFAULT NULL,    " +
    "`lastName` varchar(50) DEFAULT NULL,    " +
    "`phone` varchar(20) DEFAULT NULL,    " +
    "`e-mail` varchar(255) DEFAULT NULL,    " +
    "`address` varchar(255) DEFAULT NULL,    " +
    "`passportID` int(11) DEFAULT NULL," +
    "PRIMARY KEY (`idStudent`)," +
    "UNIQUE `passportID`(`passportID`)" +
    ")";
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'events'
});

connection.query(tableStudentScript, function (err, res, fields) {
    console.log(err);
});


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen(port, function () {
    console.log("Started on PORT " + port);
});

// app.get('/registerNamePassword', function (getReq, getRes) {});

app.get('/*', function (getReq, getRes) {
    switch (getReq.path) {
        case '/registerNamePassword':
        {
            getReq.on('data', function () {
            });
            getReq.on('end', function () {
                // console.log(req.query);
                name = getReq.query.name;
                pass = getReq.query.pass;

                var sqlScript = 'insert into users set ?';
                connection.query(sqlScript, {name: name, password: pass}, function (err, sqlRes) {
                    var result = {};
                    if (err) {
                        console.log(err);
                        result.status = 'error';
                        result.reason = 'insert name-password pair failed';
                    } else {
                        console.log(sqlRes);
                        result.status = 'ok';
                        result.reason = 'new record inserted';

                    }
                    getRes.end(JSON.stringify(result));
                });
            });
            break;
        }
        case '/sendNamePassword':
        {
            getReq.on('data', function () {
                // console.log(e);
            });

            getReq.on('end', function () {
                // console.log(req.query);
                name = getReq.query.name;
                pass = getReq.query.pass;

                var sqlScript = 'select password from users where ?';
                connection.query(sqlScript, {name: name}, function (err, sqlRes) {
                    var result = {};
                    if (sqlRes.length == 0) {
                        result.status = 'error';
                        result.reason = 'userNotFound';
                    } else if (pass == sqlRes[0].password) {
                        result.status = 'ok';
                        result.reason = 'passwordConfirmed';
                    } else {
                        result.status = 'error';
                        result.reason = 'userAndPasswordNotMatches';
                    }
                    getRes.end(JSON.stringify(result));
                });
            });
            break;
        }
        case '/add/user':
        {
            getReq.on('data', function () {});
            getReq.on('end', function () {
                firstName = getReq.query.firstName;
                lastName = getReq.query.lastName;
                passportID = getReq.query.passportID;
                var sqlScript = 'insert into students set ?';
                var studentSet = {
                    idStudent:null,
                    firstName: firstName,
                    lastName: lastName,
                    passportID: passportID
                };
                connection.query(sqlScript, studentSet, function (err, sqlRes) {
                    var result = {};
                    if (err) {
                        console.log(err);
                        result.status = 'error';
                        result.reason = 'insert failed';
                        result.fullErrorText = err;
                    } else {
                        console.log(sqlRes);
                        result.status = 'ok';
                        result.reason = 'new record inserted';
                    }
                    getRes.end(JSON.stringify(result));
                });
            });
            break;
        }
        case '/del/user':
        {
            getReq.on('data', function () {});
            getReq.on('end', function () {
                passportID = getReq.query.passportID;
                var sqlScript = 'delete from students where passportID = ?';
                connection.query(sqlScript, passportID, function (err, sqlRes) {
                    var result = {};
                    if (err) {
                        console.log(err);
                        result.status = 'error';
                        result.reason = 'insert failed';
                        result.fullErrorText = err;
                    } else if (sqlRes.affectedRows!=0){
                        result.status = 'ok';
                        result.reason = 'record deleted';
                    } else if (sqlRes.affectedRows==0){
                        result.status = 'warning';
                        result.reason = 'record not found';
                    }

                    getRes.end(JSON.stringify(result));
                });
            });
            break;
        }
        case '/':
        {
            getRes.sendfile("index.html");
            break
        }
        default:
        {
            getRes.sendfile(getReq.path.replace('/',''));
        }
    }
});


