var express = require("express");
var bodyParser = require("body-parser");
var http = require("http");
var url = require('url');
var mysql = require('mysql');
var app = express();
var port = 3000;
var headers = require('./headers');
var dataBaseName = 'events';
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use("/*", function (req, res, next) {

    var bodyStringData = '';
    req.on("data", function (chunk) {
        bodyStringData = bodyStringData + chunk;
    });
    req.on("end", function () {
        res.bodyStringData = bodyStringData;
        if (res.bodyStringData) {
            res.bodyData = JSON.parse(res.bodyStringData);
        }
    });


    headers.setHeaders(res);
    next();
});
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
{
    var tableAuthScript = "CREATE TABLE IF NOT EXISTS `events`.`auth` ( `idAuth` INT NOT NULL AUTO_INCREMENT , `name` VARCHAR(25) NOT NULL , `pass` VARCHAR(25) NOT NULL , PRIMARY KEY (`idAuth`)) ENGINE = MyISAM;";
}
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: dataBaseName
});
connection.query(tableAuthScript, function (err, res, fields) {
    console.log(err);
});
connection.query(tableStudentScript, function (err, res, fields) {
    console.log(err);
});
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
            case '/':
            {
                // console.log("Hello" + getReq.path);
                getRes.sendfile("index.html");
                break
            }
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
            case '/auth/user':
            {
                var name = getReq.query.name;
                var pass = getReq.query.pass;
                var sqlScript = 'select pass from auth where name=?';
                var result = {};
                connection.query(sqlScript, name, function (sqlErr, sqlRes) {
                    console.log(sqlRes);
                    if (!sqlRes) {
                        ///
                        console.log(sqlErr)
                    } else if (sqlRes.length !== 0) {
                        if (pass === sqlRes[0].pass) {
                            result.status = 'ok';
                        }
                        else if (pass !== sqlRes[0].pass) {
                            result.status = 'error';
                            result.reason = 'password incorrect';
                        }
                    }
                    else if (sqlRes.length === 0) {
                        result.status = 'error';
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
                    getRes.end(JSON.stringify(result));
                });
                break;
            }
            default:
            {
                getRes.sendfile(getReq.path.replace('/', ''));
            }
        }
    });
});
app.post('/*', function (postReq, postRes) {
    postReq.on("end", function () {

        // console.log("MIDDLE", postRes.bodyStringData);
        // var postBody = JSON.parse(postData);
        console.log(postReq.path);
        console.log(postRes.bodyData);
        var result = {};
        switch (postReq.path) {
            case '/auth/user':
            {
                var name = postRes.bodyData.name;
                var pass = postRes.bodyData.pass;
                var sqlScript = 'select pass from auth where ?';
                connection.query(sqlScript, {name: name}, function (sqlErr, sqlRes) {
                    if (!sqlRes) {
                        console.log(sqlErr)
                    } else if (sqlRes.length !== 0) {
                        if (pass === sqlRes[0].pass) {
                            result.status = 'ok';
                        }
                        else if (pass !== sqlRes[0].pass) {
                            result.status = 'error';
                            result.reason = 'password incorrect';
                        }
                    }
                    else if (sqlRes.length === 0) {
                        result.status = 'error';
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
            case '/role/user':
            {
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
            case '/schedule/teacher':
            {

                break;
            }
            default:
            {
            }
        }
    });
});

///////////////////////////
var week = {
    days: [
        {
            date: date,
            dayOfWeek: dayOfWeek,
            lessons: [
                {
                    time: time,
                    class: className,
                    teacher: teacher,
                    subject: subject
                },
                {
                    time: time,
                    class: className,
                    teacher: teacher,
                    subject: subject
                },
                {
                    time: time,
                    class: className,
                    teacher: teacher,
                    subject: subject
                }
            ]
        },
        {
            date: date,
            dayOfWeek: dayOfWeek,
            lessons: [
                {
                    time: time,
                    class: className,
                    teacher: teacher,
                    subject: subject
                },
                {
                    time: time,
                    class: className,
                    teacher: teacher,
                    subject: subject
                },
                {
                    time: time,
                    class: className,
                    teacher: teacher,
                    subject: subject
                }
            ]
        }
    ]
};
