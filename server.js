var express = require("express");
var bodyParser = require("body-parser");
var http = require("http");
var url = require('url');
var mysql = require('mysql');
var app = express();
var port = 3000;
var headers = require('./headers');
var dataBaseName = 'events';
var randtoken = require('rand-token');
var uid = require('rand-token').uid;
var sqlCreators = require('./sqlCreators');

console.log(sqlCreators.sqlCreators());

app.use("/*", function (req, res, next) {

    var bodyStringData = '';
    req.on("data", function (chunk) {
        bodyStringData = bodyStringData + chunk;
    });
    req.on("end", function () {
        console.log(bodyStringData);
        res.bodyStringData = bodyStringData;
        if (res.bodyStringData) {
            res.bodyData = JSON.parse(res.bodyStringData);
        }
    });
    headers.setHeaders(res);
    next();
});
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: dataBaseName
});

// connection.query(tableAuthScript, function (err, res, fields) {console.log(err);});
// connection.query(tableStudentScript, function (err, res, fields) {console.log(err);});


app.listen(port, function () {
    console.log("Started on PORT " + port);
});
app.get('/*', function (getReq, getRes) {
    headers.setHeaders(getRes);
    getReq.on('data', function (chunk) {console.log(chunk)});
    getReq.on('end', function (getData) {
        switch (getReq.path) {
            // default page
            case '/': {getRes.sendfile("index.html");break;}
            // all other files needed
            default: {getRes.sendfile(getReq.path.replace('/', ''));}
        }
    });
});


app.post('/*', function (postReq, postRes) {
    postReq.on("end", function () {
        console.log(postReq.path);
        console.log(postRes.bodyData);
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
            case '/check/'
            default: {
                console.log("default");
            }
        }
    });
});
