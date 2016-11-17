/**
 * Created by admin on 11/13/2016.
 */
module.exports.setHeaders = function (res) {
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Methods","GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers","X-Requested-With, content-type");
    res.setHeader("Access-Control-Allow-Credentials", true);
};

