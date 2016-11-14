var express = require("express");
var bodyParser = require("body-parser");
var http = require("http");
const url = require('url');
var mysql = require('mysql');
var app = express();
var port = 3000;
var headers = require('./headers');
var dataBaseName = 'events';

{
    var tableStudentScript = "" +
        "CREATE TABLE IF NOT EXISTS `" +
        'students' +
        "` (    " +
        "`idStudent` int UNSIGNED AUTO_INCREMENT,    " +
        "`firstName` varchar(35) DEFAULT NULL,    " +
        "`lastName` varchar(50) DEFAULT NULL,    " +
        "`phone` varchar(20) DEFAULT NULL,    " +
        "`e-mail` varchar(255) DEFAULT NULL,    " +
        "`address` varchar(255) DEFAULT NULL,    " +
        "`passportID` int(11) DEFAULT NULL," +
        "PRIMARY KEY (`idStudent`)," +
        "UNIQUE `passportID`(`passportID`)" +
        ")";
}
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: dataBaseName
});

connection.query(tableStudentScript, function (err, res, fields) {
    console.log(err);
});
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen(port, function () {
    console.log("Started on PORT " + port);
});

app.get('/*', function (getReq, getRes) {
    headers.setHeaders(getRes);
    getReq.on('data', function (chunk) {
        console.log(chunk)
    });
    switch (getReq.path) {
        case '/add/user':
        {
            console.log(getReq.query);
            getReq.on('end', function () {
                var firstName = getReq.query.firstName;
                var lastName = getReq.query.lastName;
                var passportID = getReq.query.passportID;
                var sqlScript = 'insert into students set ?';
                var studentSet = {
                    idStudent: null,
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
        case '/get/users':
        {

            getReq.on('end', function () {
                var sqlScript = 'select * from students ';
                connection.query(sqlScript, {}, function (err, sqlRes) {
                    var result = {};
                    if (err) {
                        console.log(err);
                        result.status = 'error';
                        result.reason = 'select failed';
                        result.fullErrorText = err;
                    } else {
                        console.log(sqlRes);
                        result.status = 'ok';
                        result.reason = 'select done';
                        result.students = sqlRes;
                    }
                    getRes.end(JSON.stringify(result));
                });
            });
            break;
        }
        case '/del/user':
        {
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
                    } else if (sqlRes.affectedRows != 0) {
                        result.status = 'ok';
                        result.reason = 'record deleted';
                    } else if (sqlRes.affectedRows == 0) {
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
            console.log("Hello" + getReq.path);
            getRes.sendfile("index.html");
            break
        }
        ///////////////////////
        case '/au':
        {
            getReq.on('end',function(){
                var name = getReq.query.name;
                var pass = getReq.query.pass;
                var sqlScript = 'select pass from auth where name=?';
                var result;
                connection.query(sqlScript, name ,function (err,sqlRes) {
                    if(sqlRes.length !==0) {
                        if (pass === sqlRes[0].pass) result = 'ok';
                        else if (pass !== sqlRes[0].pass) result = 'password is incorrect';
                    }
                    else if(sqlRes.length ===0) result = 'does not exist such user name';
                    else if (err) {
                        console.log(err);
                        result.status = 'error';
                        result.reason = 'insert failed';
                        result.fullErrorText = err;
                    }
                    console.log(sqlRes); //>>>[0].pass
                    getRes.end(result);

                } )
            });
        break;
        }
        //////////////////////
        default:
        {
            getRes.sendfile(getReq.path.replace('/', ''));
        }
    }
});

app.post('/*', function (postReq, postRes) {
    console.log(postReq.body);
});